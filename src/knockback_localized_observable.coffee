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

  constructor: (@value, @options={}, @view_model={}) ->
    throw 'LocalizedObservable: options.read is missing' if not (@options.read or @read)
    throw 'LocalizedObservable: options.read and read class function exist. You need to choose one.' if @options.read and @read
    throw 'LocalizedObservable: options.write and write class function exist. You need to choose one.' if @options.write and @write
    throw 'LocalizedObservable: kb.locale_manager is not defined' if not kb.locale_manager

    @__kb = {}
    @__kb._onLocaleChange = _.bind(@_onLocaleChange, @)

    # internal state
    value = ko.utils.unwrapObservable(@value) if @value
    kb.utils.wrappedValueObservable(@, ko.observable(if not value then @_getDefaultValue() else @read.call(this, value, null)))
    throw 'LocalizedObservable: options.write is not a function for read_write model attribute' if @write and (typeof(@write) isnt 'function')
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(@_onGetValue, @)
      write: if @write then _.bind(@_onSetValue, @) else (-> throw 'kb.LocalizedObservable: value is read only')
      owner:@view_model
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.observedValue = _.bind(@observedValue, @)
    observable.setToDefault = _.bind(@setToDefault, @)
    observable.resetToCurrent = _.bind(@resetToCurrent, @)

    # start
    kb.locale_manager.bind('change', @__kb._onLocaleChange)

    return observable

  destroy: ->
    kb.locale_manager.unbind('change', @__kb._onLocaleChange)
    @options = {}
    @view_model = null
    kb.utils.wrappedDestroy(@)

  setToDefault: ->
    return if not @default
    default_value = @_getDefaultValue()
    value_observable = kb.utils.wrappedValueObservable(@)
    current_value = value_observable()
    if current_value != default_value then @_onSetValue(default_value) else value_observable.valueHasMutated() # trigger the dependable

  resetToCurrent: ->
    value_observable = kb.utils.wrappedValueObservable(@)
    value_observable(null) # force KO to think a change occurred
    @_onSetValue(@_getCurrentValue())

  # dual purpose set/get
  observedValue: (value) ->
    return @value if arguments.length == 0
    @value = value; @_onLocaleChange()
    @

  ####################################################
  # Internal
  ####################################################
  _getDefaultValue: ->
    return '' if not @default
    return if (typeof(@default) is 'function') then @default() else @default

  _getCurrentValue: ->
    observable = kb.utils.wrappedObservable(this)
    return @_getDefaultValue() if not (@value and observable)
    return @read.call(this, ko.utils.unwrapObservable(@value))

  _onGetValue: ->
    ko.utils.unwrapObservable(@value) if @value # create a depdenency
    value_observable = kb.utils.wrappedValueObservable(@)
    return value_observable()

  _onSetValue: (value) ->
    @write.call(this, value, ko.utils.unwrapObservable(@value))
    value = @read.call(this, ko.utils.unwrapObservable(@value))
    value_observable = kb.utils.wrappedValueObservable(@)
    value_observable(value)
    @options.onChange(value) if @options.onChange

  _onLocaleChange: ->
    value = @read.call(this, ko.utils.unwrapObservable(@value))
    value_observable = kb.utils.wrappedValueObservable(@)
    value_observable(value)
    @options.onChange(value) if @options.onChange

# factory function
kb.localizedObservable = (value, options, view_model) -> return new kb.LocalizedObservable(value, options, view_model)
