$(document).ready( ->
  module("knockback_observables.js")

  # import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  if (typeof(require) != 'undefined') then _ = require('underscore') else _ = window._
  _ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
  Backbone = if not window.Backbone and (typeof(require) != 'undefined') then require('backbone') else window.Backbone
  ko = if not window.ko and (typeof(require) != 'undefined') then require('knockout') else window.ko
  kb = if not window.kb and (typeof(require) != 'undefined') then require('knockback') else window.kb
  _kbe = if not window._kbe and (typeof(require) != 'undefined') then require('knockback-examples') else window._kbe

  test("TEST DEPENDENCY MISSING", ->
    ok(!!ko); ok(!!_); ok(!!Backbone); ok(!!kb); ok(!!_kbe)
  )

  kb.locale_manager = new _kbe.LocaleManager('en', {})

  test("Standard use case: just enough to get the picture", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: true}
        number:   'number'
        date:     {key:'date', localizer: _kbe.LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this)
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.name2(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format")
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    model.set({date: new Date(1940, 10, 9)})
    kb.locale_manager.setLocale('fr-FR')
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format")
    view_model.date('10 novembre 1940')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1940, "year is good")
    equal(current_date.getMonth(), 10, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', write: true}   # LEGACY
        number:   {key: 'number', read_only: false}
        date:     {key:'date', localizer: _kbe.LongDateLocalizer}
        name2:    'name'
      }, this, false)
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")
    view_model.name2('Ringo')
    equal(model.get('name'), 'Ringo', "Name changed")
    equal(view_model.name(), 'Ringo', "Name changed")
    equal(view_model.name2(), 'Ringo', "Name changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state {read_only: false}", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name'}
        number:   {key: 'number'}
        date:     {key: 'date', localizer: _kbe.LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this, {read_only: false})
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Ringo')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Paul', "Name not changed")
    equal(view_model.name(), 'Paul', "Name not changed")
    equal(view_model.name2(), 'Paul', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Option to override the default read-only state {read_only: true}", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: false}
        number:   {key: 'number', read_only: false}
        date:     {key: 'date', localizer: _kbe.LongDateLocalizer, read_only: false}
        name2:    {key: 'name'}
      }, this, {read_only: true})
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    equal(view_model.name2(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Ringo')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'Paul', "Name not changed")
    equal(view_model.name(), 'Paul', "Name not changed")
    equal(view_model.name2(), 'Paul', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Supply non-write option state. Should stay read-only", ->
    ContactViewModel = (model) ->
      @attribute_observables = kb.observables(model, {
        name:     {key: 'name', read_only: true}
        number:   'number'
        date:     {key: 'date', read_only: false, localizer: _kbe.LongDateLocalizer}
        name2:    {key: 'name', read_only: true}
      }, this, {garbage: true})
      @

    model = new _kbe.Contact({name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9)})
    view_model = new ContactViewModel(model)

    # set from the view model
    raises((->view_model.name('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')
    view_model.date('10 December 1963')
    current_date = model.get('date')
    equal(current_date.getFullYear(), 1963, "year is good")
    equal(current_date.getMonth(), 11, "month is good")
    equal(current_date.getDate(), 10, "day is good")

    raises((->view_model.name2('Paul')), null, "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
    equal(model.get('name'), 'John', "Name not changed")
    equal(view_model.name(), 'John', "Name not changed")
    equal(view_model.name2(), 'John', "Name not changed")

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Bulk mode (array of keys)", ->
    model = new _kbe.Contact({name: 'John', number: '555-555-5558'})
    view_model = kb.observables(model, ['name', 'number'])

    # get
    equal(view_model.name(), 'John', "It is a name")
    equal(view_model.number(), '555-555-5558', "Not so interesting number")
    kb.locale_manager.setLocale('en-GB')
    kb.locale_manager.setLocale('fr-FR')

    # set from the view model
    view_model.name('Paul')
    equal(model.get('name'), 'Paul', "Name changed")
    equal(view_model.name(), 'Paul', "Name changed")
    view_model.number('9222-222-222')
    equal(model.get('number'), '9222-222-222', "Number was changed")
    equal(view_model.number(), '9222-222-222', "Number was changed")
    kb.locale_manager.setLocale('en-GB')

    # set from the model
    model.set({name: 'Yoko', number: '818-818-8181'})
    equal(view_model.name(), 'Yoko', "Name changed")
    equal(view_model.number(), '818-818-8181', "Number was changed")
    kb.locale_manager.setLocale('fr-FR')

    # and cleanup after yourself when you are done.
    kb.utils.release(view_model)
  )

  test("Error cases", ->
    raises((->kb.observables(new Backbone.Model({name: 'name1'}), 'name')), null, 'Observables: mappings_info is missing')

    # TODO
  )
)