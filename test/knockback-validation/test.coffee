$(->
  module("knockback-validation.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  _ = if not window._ and (typeof(require) isnt 'undefined') then require('underscore') else window._
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

    validator = kb.valueValidator(view_model.value, {required: kb.valid.required, url: kb.valid.url})
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")

    view_model.value('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")

    view_model.value('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.inputValidator", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()

    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.inputValidator with custom validators", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()

    window.nameTaken = (value) -> return value is 'Bob'
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().unique, "unique is valid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(validator().unique, "unique is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('Fred')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().unique, "unique is valid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(!validator().unique, "unique is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.inputValidator with validation_options", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
    window.disable = ko.observable(true)
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: \'url\'}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "obs: has required")
    ok(validator().hasOwnProperty('url'), "obs: has url")
    ok(validator().hasOwnProperty('$valid'), "obs: has $valid")
    ok(validator().hasOwnProperty('$error_count'), "obs: has $error_count")

    ok(!validator().required, "obs: required is valid")
    ok(!validator().url, "obs: url is valid")
    ok(validator().$valid, "obs: validator is valid")
    ok(!validator().$error_count, "obs: validator is not invalid")
    ok(!validator().$active_error, "obs: active error does not exist")

    window.disable(false)
    ok(validator().required, "obs: required is invalid")
    ok(validator().url, "obs: url is invalid")
    ok(!validator().$valid, "obs: validator not valid")
    ok(validator().$error_count, "obs: validator is invalid")
    equal(validator().$active_error, 'url', "obs: active error is url")

    window.disable(-> return true)
    ok(!validator().required, "obs fn: required is valid")
    ok(!validator().url, "obs fn: url is valid")
    ok(validator().$valid, "obs fn: validator is valid")
    ok(!validator().$error_count, "obs fn: validator is not invalid")
    ok(!validator().$active_error, "obs fn: error does not exist")

    window.disable(-> return false)
    ok(validator().required, "obs fn: required is invalid")
    ok(validator().url, "obs fn: url is invalid")
    ok(!validator().$valid, "obs fn: validator not valid")
    ok(validator().$error_count, "obs fn: validator is invalid")
    equal(validator().$active_error, 'url', "obs fn: active error is url")

    kb.release(view_model)

    view_model =
      name: ko.observable()
    window.disable = -> return true
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "fn: has required")
    ok(validator().hasOwnProperty('url'), "fn: has url")
    ok(validator().hasOwnProperty('$valid'), "fn: has $valid")
    ok(validator().hasOwnProperty('$error_count'), "fn: has $error_count")

    ok(!validator().required, "fn: required is valid")
    ok(!validator().url, "fn: url is valid")
    ok(validator().$valid, "fn: validator is valid")
    ok(!validator().$error_count, "fn: validator is not invalid")
    ok(!validator().$active_error, "fn: active error does not exist")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formValidator with name", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
      site: ko.observable()

    HTML = """
    <form name='my_form' data-bind="inject: kb.formValidator, validation_options: {priorities: ['required', 'url']}">
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
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().$valid, "validator valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    validator = view_model.$my_form.site
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formValidator no name with validation_options", ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
      site: ko.observable()

    HTML = """
    <form data-bind="inject: kb.formValidator, validation_options: {enable: enable, priorities: 'url'}">
      <div class="control-group">
        <input type="text" name="name" data-bind="value: name" required>
      </div>
      <div class="control-group">
        <input type="url" name="site" data-bind="value: site" required>
      </div>
    </form>
    """

    window.enable = ko.observable(false)
    el = $(HTML)[0]
    ko.applyBindings(view_model, el)

    # check name
    validator = view_model.$name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(!validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    # disabled
    ok(!validator().required, "required is valid")
    ok(validator().$valid, "validator valid")
    ok(!validator().$error_count, "validator is not invalid")

    # enabled
    window.enable(-> return true)
    ok(validator().required, "required is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")

    view_model.name('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().$valid, "validator valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    validator = view_model.$site
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )

  test("kb.formValidator with inject and disable", ->
    kb.statistics = new kb.Statistics() # turn on stats

    window.MyViewModel = kb.ViewModel.extend({
      constructor: ->
        model = new Backbone.Model({name: '', site: ''})
        kb.ViewModel.prototype.constructor.call(this, model)
        return
    })

    HTML = """
    <div kb-inject="MyViewModel">
       <form name="my_form" data-bind="inject: kb.formValidator, validation_options: {disable: disable, priorities: ['url']}">
         <div class="control-group">
          <label>Name</label>
          <input type="text" name="name" data-bind="value: name, valueUpdate: 'keyup'" required>
        </div>
        <div class="control-group">
          <label>Website</label>
          <input type="url" name="site" data-bind="value: site, valueUpdate: 'keyup'" required>
        </div>
      </form>
    </div>
    """

    window.disable = ko.observable(true)
    inject_el = $(HTML)[0]
    injected = kb.injectViewModels(inject_el)
    equal(injected[0].el, inject_el, "app was injected")
    view_model = injected[0].view_model

    # check name
    validator = view_model.$my_form.name
    ok(validator().hasOwnProperty('required'), "has required")
    ok(!validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    # disabled
    ok(!validator().required, "required is valid")
    ok(validator().$valid, "validator valid")
    ok(!validator().$error_count, "validator is not invalid")

    # enabled
    window.disable(-> return false)
    ok(validator().required, "required is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'required', "active error is required")

    view_model.name('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().$valid, "validator valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "no active error")

    validator = view_model.$my_form.site
    ok(validator().hasOwnProperty('required'), "has required")
    ok(validator().hasOwnProperty('url'), "has url")
    ok(validator().hasOwnProperty('$valid'), "has $valid")
    ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    ok(validator().required, "required is invalid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    ok(!validator().required, "required is valid")
    ok(validator().url, "url is invalid")
    ok(!validator().$valid, "validator not valid")
    ok(validator().$error_count, "validator is invalid")
    equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    ok(!validator().required, "required is valid")
    ok(!validator().url, "url is valid")
    ok(validator().$valid, "validator is valid")
    ok(!validator().$error_count, "validator is not invalid")
    ok(!validator().$active_error, "no active error")

    ko.removeNode(inject_el)

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)