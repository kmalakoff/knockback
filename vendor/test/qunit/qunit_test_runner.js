(function() {

  var startRunner = function() {
    var start = Date.now();
    var timeout = 60000;
    var interval = setInterval((function() {
      var code, stats;
      if (Date.now() > start + timeout) {
        // TIMEOUT
        $('#qunit-banner').removeClass('qunit-pass').addClass('qunit-fail');
        throw 'Warning: tests timed out';
      }
    }), 500);

    QUnit.done(function(details) {
      clearInterval(interval);
      if (!details.total) {
        $('#qunit-banner').removeClass('qunit-pass').addClass('qunit-fail');
        throw new Error('Warning: no tests run');
      }
    });
  };

  // AMD
  if (typeof define === 'function' && define.amd) {
    return define('qunit_test_runner', function() { return {start: startRunner}; });
  }

  // embedded in window
  else {
    var currentWindowOnload = window.onload;
    window.onload = function() {
      if (currentWindowOnload) currentWindowOnload();
      startRunner();
    };
  }
})();