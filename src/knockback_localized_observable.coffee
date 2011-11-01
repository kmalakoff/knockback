###
  knockback_localized_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# options
#   * read_write - bi-directional
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value (if read_write)
####################################################

class Knockback.LocalizedObservable
  constructor: (@value, @options={}, @view_model) ->
    throw new Error('LocalizedObservable: value is missing') if not @value
    throw new Error('LocalizedObservable: options.read is missing') if not @options.read
    throw new Error('LocalizedObservable: Knockback.locale_manager is not defined') if not Knockback.locale_manager

    _.bindAll(this, 'destroy', '_onGetValue', '_onSetValue', 'getObservedValue', 'setObservedValue', '_onLocaleChange')
    @current_localized_value = @options.read(@value)
    @options.onChange(@current_localized_value) if @options.onChange

    if @options.read_write
      @view_model = {} if not @view_model
      throw new Error('LocalizedObservable: options.write is missing for read_write model attribute') if not @options.write
      @observable = ko.dependentObservable({read:@_onGetValue, write:@_onSetValue, owner:@view_model})
    else
      @observable = ko.dependentObservable(@_onGetValue)
    throw new Error('Knockback: forceRefresh is missing. Please upgrade to a compatible version of Knockout.js') if _.isUndefined(@observable.forceRefresh)

    Knockback.locale_manager.bind('change', @_onLocaleChange)

    # publish public interface on the observable and return instead of this
    @observable.getObservedValue = @getObservedValue
    @observable.setObservedValue = @setObservedValue
    @observable.destroy = @destroy
    return @observable

  destroy: ->
    Knockback.locale_manager.unbind('change', @_onLocaleChange)
    @observable.dispose(); @observable = null
    @options = {}
    @view_model = null

  getObservedValue: -> return @value
  setObservedValue: (value) -> @value = value; return this

  ####################################################
  # Internal
  ####################################################
  _onGetValue:            -> return @current_localized_value
  _onSetValue: (value)    ->
    @options.write(value, @value)
  _onLocaleChange:        ->
    @current_localized_value = @options.read(@value)
    @observable.forceRefresh()
    @options.onChange(@current_localized_value) if @options.onChange
