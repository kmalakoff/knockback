###
  knockback_localized_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# Note: If you are deriving a class, you need to return the underlying observable rather than your instance since Knockout is expecting observable functions:
#   For example:
#     constructor: ->
#       super; return kb.utils.wrappedObservable(this)
#
# You can either provide a read or a read and write function in the options or on the class itself.
# Options (all optional)
#   * default - the value automatically returned when there is no value present. If there is no default, it will return ''
#   * read: (value, observable) - called to get the value and each time the locale changes
#   * write: (localized_string, value, observable) ->  - called to set the value (optional)
#   * onChange: (localized_string, value, observable) -> called when the value changes
####################################################

class Knockback.LocalizedObservable
  constructor: (@value, @options={}, @view_model={}) ->
    throw new Error('LocalizedObservable: options.read is missing') if not (@options.read or @read)
    throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.') if @options.read and @read
    throw new Error('LocalizedObservable: options.write and write class function exist. You need to choose one.') if @options.write and @write
    throw new Error('LocalizedObservable: Knockback.locale_manager is not defined') if not kb.locale_manager

    @__kb = {}
    @__kb._onLocaleChange = _.bind(@_onLocaleChange, @)

    # either take the option or the class method
    @__kb.read = if @options.read then @options.read else @read
    @__kb.write = if @options.write then @options.write else @write
    @__kb.default = if @options.default then @options.default else @default

    # internal state
    value = ko.utils.unwrapObservable(@value) if @value
    @__kb.value_observable = ko.observable(if not value then @_getDefaultValue() else @__kb.read.call(this, value, null))

    throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute') if @__kb.write and not _.isFunction(@__kb.write)
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(@_onGetValue, @)
      write: if @__kb.write then _.bind(@_onSetValue, @) else (-> throw new Error("Knockback.LocalizedObservable: value is read only"))
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
    @__kb.value_observable = null
    kb.utils.wrappedObservable(this).dispose(); kb.utils.wrappedObservable(this, null)
    @options = {}
    @view_model = null
    @__kb = null

  setToDefault: ->
    return if not @__kb.default
    default_value = @_getDefaultValue()
    current_value = @__kb.value_observable()
    if current_value != default_value then @_onSetValue(default_value) else @__kb.value_observable.valueHasMutated() # trigger the dependable

  resetToCurrent: ->
    @__kb.value_observable(null) # force KO to think a change occurred
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
    return '' if not @__kb.default
    return if _.isFunction(@__kb.default) then @__kb.default() else @__kb.default

  _getCurrentValue: ->
    observable = kb.utils.wrappedObservable(this)
    return @_getDefaultValue() if not (@value and observable)
    return @__kb.read.call(this, ko.utils.unwrapObservable(@value))

  _onGetValue: ->
    ko.utils.unwrapObservable(@value) if @value # create a depdenency
    return @__kb.value_observable()

  _onSetValue: (value) ->
    @__kb.write.call(this, value, ko.utils.unwrapObservable(@value))
    value = @__kb.read.call(this, ko.utils.unwrapObservable(@value))
    @__kb.value_observable(value)
    @options.onChange(value) if @options.onChange

  _onLocaleChange: ->
    value = @__kb.read.call(this, ko.utils.unwrapObservable(@value))
    @__kb.value_observable(value)
    @options.onChange(value) if @options.onChange

# factory function
Knockback.localizedObservable = (value, options, view_model) -> return new Knockback.LocalizedObservable(value, options, view_model)
