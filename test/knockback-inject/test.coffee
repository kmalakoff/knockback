$(document).ready( ->
  module("knockback-inject.js")

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

  test("1. Injection", ->
    kb.statistics = new kb.Statistics() # turn on stats

    app_el = $('<div kb-app></div>')[0]

    $('body').append(app_el)
    kb.injectApps()

    # view_model = kb.viewModel(new Backbone.Model({name: 'Bob'}))
    # collection_observable = kb.collectionObservable(new Backbone.Collection([new Backbone.Model({name: 'Fred'}), new Backbone.Model({name: 'Mary'})]))

    # $vm_el = $('<div id="vm" data-bind="text: name"></div>')
    # $co_el = $('<div id="co" data-bind="foreach: co"><div data-bind="text: name"></div></div>')
    # $('body').append($vm_el).append($co_el)

    # kb.applyBindings(view_model, $vm_el[0])
    # kb.applyBindings({co: collection_observable}, $co_el[0])

    # equal($vm_el.text(), 'Bob', 'found Bob')
    # for child, index in $co_el.children()
    #   name = if index then 'Mary' else 'Fred'
    #   equal($(child).text(), name, "found #{name}")

    # equal(kb.statistics.registeredCount('ViewModel'), 3, '3 bound view models')
    # equal(kb.statistics.registeredCount('CollectionObservable'), 1, '1 bound collection observable')

    # # dispose of the collection node
    # ko.removeNode($co_el[0])
    # equal(kb.statistics.registeredCount('ViewModel'), 1, '1 bound view model')
    # equal(kb.statistics.registeredCount('CollectionObservable'), 0, 'no bound collection observables')

    # # dispose of the model node
    # ko.removeNode($vm_el[0])

    equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null
  )
)