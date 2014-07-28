assert = assert or require?('chai').assert
window = if window? then window else global

describe 'validation @quick @validation', ->
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko, $} = kb

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  it 'kb.valueValidator', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      value: ko.observable()

    validator = kb.valueValidator(view_model.value, {required: kb.valid.required, url: kb.valid.url})
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")

    view_model.value('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")

    view_model.value('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.inputValidator', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()

    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.inputValidator with custom validators', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()

    window.nameTaken = (value) -> return value is 'Bob'
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validations: {unique: nameTaken}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().unique, "unique is valid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(validator().unique, "unique is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('Fred')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().unique, "unique is valid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(!validator().unique, "unique is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.inputValidator with validation_options', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
    kb.statistics = new kb.Statistics() # turn on stats

    view_model =
      name: ko.observable()
    window.disable = ko.observable(true)
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable, priorities: \'url\'}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    assert.ok(validator().hasOwnProperty('required'), "obs: has required")
    assert.ok(validator().hasOwnProperty('url'), "obs: has url")
    assert.ok(validator().hasOwnProperty('$valid'), "obs: has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "obs: has $error_count")

    assert.ok(!validator().required, "obs: required is valid")
    assert.ok(!validator().url, "obs: url is valid")
    assert.ok(validator().$valid, "obs: validator is valid")
    assert.ok(!validator().$error_count, "obs: validator is not invalid")
    assert.ok(!validator().$active_error, "obs: active error does not exist")

    window.disable(false)
    assert.ok(validator().required, "obs: required is invalid")
    assert.ok(validator().url, "obs: url is invalid")
    assert.ok(!validator().$valid, "obs: validator not valid")
    assert.ok(validator().$error_count, "obs: validator is invalid")
    assert.equal(validator().$active_error, 'url', "obs: active error is url")

    window.disable(-> return true)
    assert.ok(!validator().required, "obs fn: required is valid")
    assert.ok(!validator().url, "obs fn: url is valid")
    assert.ok(validator().$valid, "obs fn: validator is valid")
    assert.ok(!validator().$error_count, "obs fn: validator is not invalid")
    assert.ok(!validator().$active_error, "obs fn: error does not exist")

    window.disable(-> return false)
    assert.ok(validator().required, "obs fn: required is invalid")
    assert.ok(validator().url, "obs fn: url is invalid")
    assert.ok(!validator().$valid, "obs fn: validator not valid")
    assert.ok(validator().$error_count, "obs fn: validator is invalid")
    assert.equal(validator().$active_error, 'url', "obs fn: active error is url")

    kb.release(view_model)

    view_model =
      name: ko.observable()
    window.disable = -> return true
    el = $('<input type="url" name="name" data-bind="value: name, inject: kb.inputValidator, validation_options: {disable: disable}" required>')[0]
    ko.applyBindings(view_model, el)

    validator = view_model.$name
    assert.ok(validator().hasOwnProperty('required'), "fn: has required")
    assert.ok(validator().hasOwnProperty('url'), "fn: has url")
    assert.ok(validator().hasOwnProperty('$valid'), "fn: has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "fn: has $error_count")

    assert.ok(!validator().required, "fn: required is valid")
    assert.ok(!validator().url, "fn: url is valid")
    assert.ok(validator().$valid, "fn: validator is valid")
    assert.ok(!validator().$error_count, "fn: validator is not invalid")
    assert.ok(!validator().$active_error, "fn: active error does not exist")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.formValidator with name', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
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
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(!validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.ok(validator().$active_error, "active error exists")

    view_model.name('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().$valid, "validator valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    validator = view_model.$my_form.site
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.formValidator no name with validation_options', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
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
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(!validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    # disabled
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().$valid, "validator valid")
    assert.ok(!validator().$error_count, "validator is not invalid")

    # enabled
    window.enable(-> return true)
    assert.ok(validator().required, "required is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")

    view_model.name('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().$valid, "validator valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    validator = view_model.$site
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "active error does not exist")

    kb.release(view_model)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()

  it 'kb.formValidator with inject and disable', (done) ->
    return done() unless $
    window.kb = kb unless window.kb # make kb global for bindings
    kb.statistics = new kb.Statistics() # turn on stats

    window.MyViewModel = kb.ViewModel.extend({
      constructor: ->
        model = new kb.Model({name: '', site: ''})
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
    assert.equal(injected[0].el, inject_el, "app was injected")
    view_model = injected[0].view_model

    # check name
    validator = view_model.$my_form.name
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(!validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    # disabled
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().$valid, "validator valid")
    assert.ok(!validator().$error_count, "validator is not invalid")

    # enabled
    window.disable(-> return false)
    assert.ok(validator().required, "required is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'required', "active error is required")

    view_model.name('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().$valid, "validator valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "no active error")

    validator = view_model.$my_form.site
    assert.ok(validator().hasOwnProperty('required'), "has required")
    assert.ok(validator().hasOwnProperty('url'), "has url")
    assert.ok(validator().hasOwnProperty('$valid'), "has $valid")
    assert.ok(validator().hasOwnProperty('$error_count'), "has $error_count")

    assert.ok(validator().required, "required is invalid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(validator().url, "url is invalid")
    assert.ok(!validator().$valid, "validator not valid")
    assert.ok(validator().$error_count, "validator is invalid")
    assert.equal(validator().$active_error, 'url', "active error is url")

    view_model.site('http://Bob')
    assert.ok(!validator().required, "required is valid")
    assert.ok(!validator().url, "url is valid")
    assert.ok(validator().$valid, "validator is valid")
    assert.ok(!validator().$error_count, "validator is not invalid")
    assert.ok(!validator().$active_error, "no active error")

    ko.removeNode(inject_el)

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
