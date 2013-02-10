var testsDoneCallback = function(details) {
  // TODO: implement for requirejs
  if (typeof(require) != 'undefined') return;

  if (!details.total) {
    $('#qunit-banner').removeClass('qunit-pass').addClass('qunit-fail');
    throw new Error('Warning: no tests run');
  }
};

QUnit.done(testsDoneCallback);