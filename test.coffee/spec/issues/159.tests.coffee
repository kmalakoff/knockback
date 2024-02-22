assert = assert or require?('chai').assert

# https://github.com/kmalakoff/knockback/issues/159
describe 'issue 159 @issue159 @quick', ->
  kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')
  {_, ko} = kb
  $ = window?.$

  it 'TEST DEPENDENCY MISSING', (done) ->
    assert.ok(!!ko, 'ko')
    assert.ok(!!_, '_')
    assert.ok(!!kb.Model, 'kb.Model')
    assert.ok(!!kb.Collection, 'kb.Collection')
    assert.ok(!!kb, 'kb')
    done()

  it 'has no issue', (done) ->
    return done() unless ($ and window?.document)

    kb.statistics = new kb.Statistics() # turn on stats

    class ViewModel
      afterRender: -> @was_called = true

    # test without options override
    view_model = new ViewModel()
    assert.ok(!view_model.was_called, 'afterRender not called yet')
    el = $("""<script type="text/x-jquery-tmpl" id="the_template1">
        <div>
          <div>...</div>
        </div>
        <div>
          <div>...</div>
        </div>
      </script>""")
    $('body').append(el)
    kb.renderTemplate('the_template1', view_model)
    assert.ok(view_model.was_called, 'afterRender was called')

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
    done()
