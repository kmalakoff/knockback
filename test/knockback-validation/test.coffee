$(document).ready( ->
  module("knockback-validation.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) isnt 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and _.hasOwnProperty('_') # LEGACY
  Backbone = if not window.Backbone and (typeof(require) isnt 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko, 'ko')
    ok(!!_, '_')
    ok(!!Backbone, 'Backbone')
    ok(!!kb, 'kb')
  )

  test("kb.valueValidator", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      value: ko.observable()

    validator = kb.valueValidator(view_model.value, ['required', 'url'])
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.value('bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.value('http://bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().valid, "validator is valid")
    ok(!validator().invalid, "validator is not invalid")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.inputValidator", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      value: ko.observable()

    el = $('<input type="url" name="name" data-bind="value: value, inject: kb.inputValidator" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.value('bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.value('http://bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().valid, "validator is valid")
    ok(!validator().invalid, "validator is not invalid")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formValidator with name", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
      site: ko.observable()

    HTML = """
    <form name='my_form' data-bind="inject: kb.formValidator">
      <div class="control-group">
        <input type="text" name="name" data-bind="value: name" required>
      </div>
      <div class="control-group">
        <input type="url" name="site" data-bind="value: site" required>
      </div>
    </form>
    """

    el = $(HTML)[0]
    ko.applyBindings(view_model, el)

    # check name
    validator = view_model.$my_form.name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(!validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.name('bob')
    ok(!validator().required, "required is valid")
    ok(validator().valid, "validator valid")
    ok(!validator().invalid, "validator is not invalid")

    validator = view_model.$my_form.site
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.site('bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.site('http://bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().valid, "validator is valid")
    ok(!validator().invalid, "validator is not invalid")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formValidator no name", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
      site: ko.observable()

    HTML = """
    <form data-bind="inject: kb.formValidator">
      <div class="control-group">
        <input type="text" name="name" data-bind="value: name" required>
      </div>
      <div class="control-group">
        <input type="url" name="site" data-bind="value: site" required>
      </div>
    </form>
    """

    el = $(HTML)[0]
    ko.applyBindings(view_model, el)

    # check name
    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(!validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.name('bob')
    ok(!validator().required, "required is valid")
    ok(validator().valid, "validator valid")
    ok(!validator().invalid, "validator is not invalid")

    validator = view_model.$site
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('valid'), "has valid")
    ok(validator().hasOwnProperty('invalid'), "has invalid")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.site('bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().valid, "validator not valid")
    ok(validator().invalid, "validator is invalid")

    view_model.site('http://bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().valid, "validator is valid")
    ok(!validator().invalid, "validator is not invalid")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)