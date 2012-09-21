###
  knockback-validators.js 0.16.7
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Regular expressions from Angular.js: https://github.com/angular/angular.js
URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/

# A validator should return true if there are errors (similar to the binding check in HTML, eg. $name().required).
# Convention is that if they enf in Fn then returns a function pointer based on parameters passed.
kb.valid =
  required: (value) -> !value
  url: (value) -> !URL_REGEXP.test(value)
  email: (value) -> !EMAIL_REGEXP.test(value)
  number: (value) -> !NUMBER_REGEXP.test(value)

# kb.valid =
#   # returns function pointers
#   uniqueAttributeFn: (model, key, collection) ->
#     return (value) ->
#       m = ko.utils.unwrapObservable(model); k = ko.utils.unwrapObservable(key); c = ko.utils.unwrapObservable(collection)
#       return !!_.find(c.models, (test) => (test isnt m) and test.get(k) is value)
#   hasChangedFn: (model) ->
#     attributes = model.toJSON()
#     return (value) ->