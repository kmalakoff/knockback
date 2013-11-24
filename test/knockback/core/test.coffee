describe 'knockback_core utils', ->

  ko = window.ko or require?('knockout')
  kb = window.kb or require?('knockback')
  _ = kb._

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  it 'kb.renderTemplate', (done) ->
    kb.statistics = new kb.Statistics() # turn on stats

    # not supported in older versions
    unless ko.version
       assert.ok(true)
       return done()

    class ViewModel
      constructor: ->
        @name = ko.observable('Bob')
      afterRender: ->
        @was_called = true

    # test without options override
    view_model = new ViewModel()
    assert.ok(!view_model.was_called, 'afterRender not called yet')
    el = $('<script type="text/x-jquery-tmpl" id="the_template1"><div data-bind="text: name"></div></script>')
    $('body').append(el)
    kb.renderTemplate('the_template1', view_model)
    assert.ok(view_model.was_called, 'afterRender was called')

    # test with options override
    was_called = false
    view_model = new ViewModel()
    assert.ok(!view_model.was_called, 'afterRender (options) not called yet')
    assert.ok(!view_model.was_called, 'afterRender not called yet')
    el = $('<script type="text/x-jquery-tmpl" id="the_template2"><div data-bind="text: name"></div></script>')
    $('body').append(el)
    kb.renderTemplate('the_template2', view_model, {afterRender: -> was_called = true})
    assert.ok(was_called, 'afterRender (options) was called')
    assert.ok(!view_model.was_called, 'afterRender was not called')

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
