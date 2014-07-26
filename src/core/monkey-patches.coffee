{ko} = require './kb'

# until is resolved https://github.com/knockout/knockout/issues/1464
_extend = ko.subscribable.fn.extend
ko.subscribable.fn.extend = ->
  target = _extend.apply(@, arguments)

  # release the extended observable
  if target isnt @ and @release
    _dispose = target.dispose
    target.dispose = =>
      _dispose?.apply(target, arguments)
      @release()

  return target
