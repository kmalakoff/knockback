module("knockback_core utils")

ko = if not window.ko and (typeof(require) isnt 'undefined') then require('knockout') else window.ko
kb = if not window.kb and (typeof(require) isnt 'undefined') then require('knockback') else window.kb
_ = kb._

test 'TEST DEPENDENCY MISSING', ->
  ok(!!ko, 'ko')
  ok(!!_, '_')
  ok(!!kb.Model, 'kb.Model')
  ok(!!kb.Collection, 'kb.Collection')
  ok(!!kb, 'kb')

test 'kb.renderTemplate', ->
  kb.statistics = new kb.Statistics() # turn on stats

  # not supported in older versions
  return ok(true) unless ko.version

  class ViewModel
    constructor: ->
      @name = ko.observable('Bob')
    afterRender: ->
      @was_called = true

  # test without options override
  view_model = new ViewModel()
  ok(!view_model.was_called, 'afterRender not called yet')
  el = $('<script type="text/x-jquery-tmpl" id="the_template1"><div data-bind="text: name"></div></script>')
  $('body').append(el)
  kb.renderTemplate('the_template1', view_model)
  ok(view_model.was_called, 'afterRender was called')

  # test with options override
  was_called = false
  view_model = new ViewModel()
  ok(!view_model.was_called, 'afterRender (options) not called yet')
  ok(!view_model.was_called, 'afterRender not called yet')
  el = $('<script type="text/x-jquery-tmpl" id="the_template2"><div data-bind="text: name"></div></script>')
  $('body').append(el)
  kb.renderTemplate('the_template2', view_model, {afterRender: -> was_called = true})
  ok(was_called, 'afterRender (options) was called')
  ok(!view_model.was_called, 'afterRender was not called')

  equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
