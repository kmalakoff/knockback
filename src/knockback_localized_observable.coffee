
###
  knockback_localized_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# Note: If you are deriving a class, you need to return the underlying observable rather than your instance since Knockout is expecting observable functions:
#   For example:
#     constructor: ->
#       super
#       return kb.utils.wrappedObservable(@)
#
# You can either provide a read or a read and write function in the options or on the class itself.
# Options (all optional)
#   * default - the value automatically returned when there is no value present. If there is no default, it will return ''
#   * read: (value, observable) - called to get the value and each time the locale changes
#   * write: (localized_string, value, observable) ->  - called to set the value (optional)
#   * onChange: (localized_string, value, observable) -> called when the value changes
####################################################

class kb.LocalizedObservable
  @extend = Backbone.Model.extend # from Backbone non-Coffeescript inheritance (use "kb.RefCountable_RCBase.extend({})" in Javascript instead of "class MyClass extends kb.RefCountable")

  constructor: (@value_holder, options={}, @view_model={}) ->
    kb.utils.throwMissing(this, 'read') unless @read
    kb.utils.throwMissing(this, 'kb.locale_manager') unless kb.locale_manager

    # bind callbacks
    @__kb or= {}
    @__kb._onLocaleChange = _.bind(@_onLocaleChange, @)
    @__kb._onChange = options.onChange

    # internal state
    value = ko.utils.unwrapObservable(@value_holder) if @value_holder
    kb.utils.wrappedByKey(@, 'vo', ko.observable(if not value then null else @read(value, null)))
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable({
      read: =>
        ko.utils.unwrapObservable(@value_holder) if @value_holder 
        value_observable = kb.utils.wrappedByKey(@, 'vo'); value_observable() # create a depdenency
        return @read(ko.utils.unwrapObservable(@value_holder))

      write: (value) =>
        kb.utils.throwUnexpected(this, 'writing to read-only') unless @write
        @write(value, ko.utils.unwrapObservable(@value_holder))
        value_observable = kb.utils.wrappedByKey(@, 'vo')
        value_observable(value)
        @__kb._onChange(value) if @__kb._onChange
      
      owner: @view_model
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.observedValue = _.bind(@observedValue, @)
    observable.resetToCurrent = _.bind(@resetToCurrent, @)

    # start
    kb.locale_manager.bind('change', @__kb._onLocaleChange)

    # wrap ourselves with a default value
    if options.hasOwnProperty('default')
      observable = ko.defaultWrapper(observable, options.default)

    return observable

  destroy: ->
    kb.locale_manager.unbind('change', @__kb._onLocaleChange)
    @view_model = null
    kb.utils.wrappedDestroy(@)

  resetToCurrent: ->
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable(null) # force KO to think a change occurred
    current_value = if @value_holder then @read(ko.utils.unwrapObservable(@value_holder)) else null
    kb.utils.wrappedObservable(@)(current_value)

  # dual purpose set/get
  observedValue: (value) ->
    return @value_holder if arguments.length == 0
    @value_holder = value; @_onLocaleChange()
    @

  ####################################################
  # Internal
  ####################################################

  _onLocaleChange: ->
    value = @read(ko.utils.unwrapObservable(@value_holder))
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable(value)
    @__kb._onChange(value) if @__kb._onChange

# factory function
kb.localizedObservable = (value, options, view_model) -> return new kb.LocalizedObservable(value, options, view_model)
