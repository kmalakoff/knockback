// PhantomJS QUnit Test Runner

var args = phantom.args;
if (args.length < 1 || args.length > 2) {
  console.log("Usage: " + phantom.scriptName + " <URL> <timeout>");
  phantom.exit(1);
}
var timeout = parseInt(args[1], 10) || 60000;
var start = Date.now();

var page = require('webpage').create();

page.onConsoleMessage = function (msg) { if(msg.indexOf('warning')!=0) console.log(msg); };

page.open(args[0], function(status) {
  if (status !== 'success') {
    console.error("Unable to access network");
    phantom.exit(1);
  }
  else {
    var interval = setInterval(function() {
      if (Date.now() > start + timeout) {
        console.error("Tests timed out");
        phantom.exit(124);
      }
      else {
        // if there are still things to process on the queue, we are not done
        stats = page.evaluate(function(){ if (QUnit.config.queue.length==0) return QUnit.config.stats; })
        if (!stats) return; // not done
        clearInterval(interval);
        (stats.bad > 0) ? phantom.exit(1) : phantom.exit();
      }
    }, 500);
  }
});