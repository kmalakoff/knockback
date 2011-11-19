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
#       super
#       return kb.wrappedObservable(this)
#
# You can either provide a read or a read and write function in the options or on the class itself.
# Options (all optional)
#   * default - the value automatically returned when there is no value present. If there is no default, it will return ''
#   * read: (value, observable) - called to get the value and each time the locale changes
#   * write: (localized_string, value, observable) ->  - called to set the value (optional)
#   * onChange: (localized_string, value, observable) -> called when the value changes
####################################################

class Knockback.LocalizedObservable
  constructor: (@value, @options={}, @view_model) ->
    throw new Error('LocalizedObservable: options.read is missing') if not (@options.read or @read)
    throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.') if @options.read and @read
    throw new Error('LocalizedObservable: options.write and write class function exist. You need to choose one.') if @options.write and @write
    throw new Error('LocalizedObservable: Knockback.locale_manager is not defined') if not kb.locale_manager

    _.bindAll(this, 'destroy', 'setToDefault', 'resetToCurrent', 'observedValue', '_onGetValue', '_onSetValue', '_onLocaleChange')

    # either take the option or the class method
    @_kb_read = if @options.read then @options.read else @read
    @_kb_write = if @options.write then @options.write else @write
    @_kb_default = if @options.default then @options.default else @default

    # internal state
    @_kb_value_observable = ko.observable()

    if @_kb_write
      @view_model = {} if not @view_model
      throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute') if not _.isFunction(@_kb_write)
      @_kb_observable = ko.dependentObservable({read:@_onGetValue, write:@_onSetValue, owner:@view_model})
    else
      @_kb_observable = ko.dependentObservable(@_onGetValue)

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy
    @_kb_observable.observedValue = @observedValue
    @_kb_observable.setToDefault = @setToDefault
    @_kb_observable.resetToCurrent = @resetToCurrent

    # start
    kb.locale_manager.bind('change', @_onLocaleChange)
    @_onLocaleChange()

    return kb.wrappedObservable(this)

  destroy: ->
    kb.locale_manager.unbind('change', @_onLocaleChange)
    @_kb_value_observable = null
    @_kb_observable.dispose(); @_kb_observable = null
    @options = {}
    @view_model = null

  setToDefault: ->
    current_value = @_kb_value_observable()
    default_value = @_getDefaultValue()
    if current_value != default_value then @_onSetValue(default_value) else @_kb_value_observable.valueHasMutated() # trigger the dependable

  resetToCurrent: ->
    @_kb_value_observable(null) # force KO to think a change occurred
    @_onSetValue(@_getCurrentValue())

  # dual purpose set/get
  observedValue: (value) ->
    return @value if arguments.length == 0
    @value = value; @_onLocaleChange()
    return this

  ####################################################
  # Internal
  ####################################################
  _getDefaultValue: ->
    return '' if not @_kb_default
    return if _.isFunction(@_kb_default) then @_kb_default() else @_kb_default

  _getCurrentValue: ->
    return @_getDefaultValue() if not (@value and @_kb_observable)
    return @_kb_read.call(this, ko.utils.unwrapObservable(@value), @_kb_observable)

  _onGetValue: ->
    return @_kb_value_observable()

  _onSetValue: (value) ->
    @_kb_write.call(this, value, ko.utils.unwrapObservable(@value), @_kb_observable)
    value = @_kb_read.call(this, ko.utils.unwrapObservable(@value), @_kb_observable)
    @_kb_value_observable(value)
    @options.onChange(value) if @options.onChange

  _onLocaleChange: ->
    value = @_kb_read.call(this, ko.utils.unwrapObservable(@value), @_kb_observable)
    @_kb_value_observable(value)
    @options.onChange(value) if @options.onChange

# factory function
Knockback.localizedObservable = (value, options, view_model) -> return new Knockback.LocalizedObservable(value, options, view_model)
