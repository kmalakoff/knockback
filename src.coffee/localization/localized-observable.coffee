###
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require '../core/kb'

KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent']

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
kb.locale_manager or= undefined

# @abstract You must provide the following two methods:
#   * read: function(value, observable) called to get the value and each time the locale changes
#   * write: function(localized_string, value, observable) called to set the value (optional)
#
# Base class for observing localized data that changes when the locale changes.
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
#     constructor: function(value, options, view_model) {
#       kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
#       return kb.utils.wrappedObservable(this);
#     },
#     read: function(value) {
#       return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
#     },
#     write: function(localized_string, value) {
#       var new_value;
#       new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
#       if (!(new_value && _.isDate(new_value))) {
#         return kb.utils.wrappedObservable(this).resetToCurrent();
#       }
#       return value.setTime(new_value.valueOf());
#     }
#   });
#   var ViewModel = function(model) {
#     this.localized_date = kb.observable(model, {
#       key: 'date',
#       'default': this.loading_message,
#       localizer: ShortDateLocalizer
#     }, this);
#   };
#   var view_model = new ViewModel(new Backbone.Model({date: new Date()}));
#
# @method .extend(prototype_properties, class_properties)
#   Class method for JavaScript inheritance.
#   @param [Object] prototype_properties the properties to add to the prototype
#   @param [Object] class_properties the properties to add to the class
#   @return [ko.observable] the constructor does not return 'this' but a ko.observable
#   @example
#     var MyLocalizedObservable = kb.LocalizedObservable.extend({
#        constructor: function(value, options, view_model) {
#          // the constructor does not return 'this' but a ko.observable
#          return kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
#        }
#     });
module.exports = class kb.LocalizedObservable
  @extend = kb.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  # Used to create a new kb.LocalizedObservable. This an abstract class.
  #
  # @param [Data|ko.observable] value the value to localize
  # @param [Object] options the create options
  # @option options [Data|ko.observable] default a default value to present when the value is null, an empty string, etc.
  # @option options [Function] onChange a notification that gets called when the locale changes. Signature: function(localized_string, value, observable)
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (@value, options, @vm) -> # @vm is view_model
    options or= {}; @vm or= {}
    @read or kb._throwMissing(this, 'read')
    kb.locale_manager or kb._throwMissing(this, 'kb.locale_manager')

    # bind callbacks
    @__kb or= {}
    @__kb._onLocaleChange = _.bind(@_onLocaleChange, @)
    @__kb._onChange = options.onChange

    # internal state
    value = ko.utils.unwrapObservable(@value) if @value
    @vo = ko.observable(if not value then null else @read(value, null))
    observable = kb.utils.wrappedObservable @, ko.computed {
      read: =>
        ko.utils.unwrapObservable(@value) if @value
        @vo() # create a depdenency
        return @read(ko.utils.unwrapObservable(@value))

      write: (value) =>
        @write or kb._throwUnexpected(@, 'writing to read-only')
        @write(value, ko.utils.unwrapObservable(@value))
        @vo(value)
        @__kb._onChange(value) if @__kb._onChange

      owner: @vm
    }

    # publish public interface on the observable and return instead of this
    kb.publishMethods(observable, @, KEYS_PUBLISH)

    # start
    kb.locale_manager.bind('change', @__kb._onLocaleChange)

    # wrap ourselves with a default value
    observable = kb.DefaultObservable and ko.defaultObservable(observable, options.default) if options.hasOwnProperty('default')

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    kb.locale_manager.unbind('change', @__kb._onLocaleChange)
    @vm = null
    kb.utils.wrappedDestroy(@)

  # Used to reset the value if localization is not possible.
  resetToCurrent: ->
    observable = kb.utils.wrappedObservable(@)
    current_value = if @value then @read(ko.utils.unwrapObservable(@value)) else null
    return if observable() is current_value
    observable(current_value)

  # Dual purpose set/get
  observedValue: (value) ->
    return @value if arguments.length == 0
    @value = value; @_onLocaleChange()
    return

  ####################################################
  # Internal
  ####################################################

  # @nodoc
  _onLocaleChange: ->
    value = @read(ko.utils.unwrapObservable(@value))
    @vo(value)
    @__kb._onChange(value) if @__kb._onChange

# factory function
kb.localizedObservable = (value, options, view_model) -> return new kb.LocalizedObservable(value, options, view_model)
kb.observableLocalized = kb.localizedObservable
