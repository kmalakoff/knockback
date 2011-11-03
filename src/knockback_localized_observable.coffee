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
    throw new Error('LocalizedObservable: value is missing') if not @value
    throw new Error('LocalizedObservable: options.read is missing') if not (@options.read or @read)
    throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.') if @options.read and @read
    throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.') if @options.write and @write
    throw new Error('LocalizedObservable: Knockback.locale_manager is not defined') if not kb.locale_manager

    _.bindAll(this, 'destroy', '_onGetValue', '_onSetValue', 'getObservedValue', 'setObservedValue', '_onLocaleChange')

    # either take the option or the class method
    @_kb_read = if @options.read then @options.read else @read
    @_kb_write = if @options.write then @options.write else @write

    @current_localized_value = @_kb_read.call(this, @value, @_kb_observable) if @value
    @options.onChange(@current_localized_value) if @options.onChange

    if @_kb_write
      @view_model = {} if not @view_model
      throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute') if not _.isFunction(@_kb_write)
      @_kb_observable = ko.dependentObservable({read:@_onGetValue, write:@_onSetValue, owner:@view_model})
    else
      @_kb_observable = ko.dependentObservable(@_onGetValue)
    throw new Error('Knockback: forceRefresh is missing. Please upgrade to a compatible version of Knockout.js') if _.isUndefined(@_kb_observable.forceRefresh)

    kb.locale_manager.bind('change', @_onLocaleChange)

    # publish public interface on the observable and return instead of this
    @_kb_observable.getObservedValue = @getObservedValue
    @_kb_observable.setObservedValue = @setObservedValue
    @_kb_observable.destroy = @destroy
    @_kb_observable.__kb_owner = this
    return kb.wrappedObservable(this)

  destroy: ->
    kb.locale_manager.unbind('change', @_onLocaleChange)
    @_kb_observable.dispose(); @_kb_observable = null
    @options = {}
    @view_model = null

  getObservedValue: -> return @value
  setObservedValue: (value) -> @value = value; return this

  ####################################################
  # Internal
  ####################################################
  _getDefault: ->
    return '' if not @options.hasOwnProperty('default')
    return if _.isFunction(@options.default) then @options.default() else @options.default

  _onGetValue:            -> return @current_localized_value
  _onSetValue: (value)    ->
    @_kb_write.call(this, value, @value, @_kb_observable)

  _onLocaleChange:        ->
    @current_localized_value = if not @value then @_getDefault() else @_kb_read.call(this, @value, @_kb_observable)
    @_kb_observable.forceRefresh()
    @options.onChange(@current_localized_value) if @options.onChange

# factory function
Knockback.localizedObservable = (value, options, view_model) -> return new Knockback.LocalizedObservable(value, options, view_model)
