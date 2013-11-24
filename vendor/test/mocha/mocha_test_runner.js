(function() {
  var options = {ui: 'bdd', reporter: 'html', timeout: 60000};
  if (window.MochaReporter) options.reporter = window.MochaReporter;
  mocha.setup(options);
  window.assert = chai.assert;

  var started = false,
    interval = null;

  var startRunner = function() {
    // mocha.checkLeaks();
    mocha.globals(['jQuery'])

    window.mocha_reporter = mocha.run(function(err) {
      details = mocha.suite.suites;

      if (!started) return;
      clearInterval(interval);
      if (!details.length) {
        $('#qunit-banner').removeClass('qunit-pass').addClass('qunit-fail');
        throw new Error('Warning: no tests run');
      }
    });

    started = true;
    var start = Date.now();
    var timeout = 60000;
    interval = setInterval((function() {
      var code, stats;
      if (Date.now() > start + timeout) {
        // TIMEOUT
        $('#qunit-banner').removeClass('qunit-pass').addClass('qunit-fail');
        throw 'Warning: tests timed out';
      }
    }), 500);
  };

  // AMD
  if (typeof define === 'function' && define.amd) {
    return define('mocha_test_runner', function() { return {start: startRunner}; });
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