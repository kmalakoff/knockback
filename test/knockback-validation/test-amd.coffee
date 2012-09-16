$(document).ready( ->
  module("knockback-validation-amd.js")

  module_name = 'knockback-validation'
  module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

  # Knockback and depdenencies
  require(['underscore', 'backbone', 'knockout', module_name, 'knockback-statistics'], (_, Backbone, ko, kb, kbs) ->
    _ or= @_
    Backbone or= @Backbone
    test("TEST DEPENDENCY MISSING", ->
      ok(!!ko, 'ko')
      ok(!!_, '_')
      ok(!!Backbone, 'Backbone')
      ok(!!kb, 'kb')
      ok(!!kbs, 'kbs')
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

    test("kb.formValidator with inject", ->
      kb.statistics = new kb.Statistics() # turn on stats

      window.MyViewModel = kb.ViewModel.extend({
        constructor: ->
          model = new Backbone.Model({name: '', site: ''})
          kb.ViewModel.prototype.constructor.call(this, model)
          return
      })

      HTML = """
      <div kb-inject="MyViewModel">
         <form name="my_form" data-bind="inject: kb.formValidator">
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

      inject_el = $(HTML)[0]
      injected = kb.injectViewModels(inject_el)
      equal(injected[0].el, inject_el, "app was injected")
      view_model = injected[0].view_model

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

      ko.removeNode(inject_el)

      equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    )
  )
)