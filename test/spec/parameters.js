/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let kb = typeof window !== 'undefined' && window !== null ? window.kb : undefined;
try {
  if (!kb) {
    kb = typeof require === 'function' ? require('knockback') : undefined;
  }
} catch (_error) {}
try {
  if (!kb) {
    kb = typeof require === 'function' ? require('../../../knockback') : undefined;
  }
} catch (_error1) {}

const exports = { LocaleManager: require('./lib/locale_manager') };

(() => {
  if (typeof window !== 'undefined' && window !== null) {
    return window;
  }
  if (typeof global !== 'undefined' && global !== null) {
    return global;
  }
})().__test__parameters = exports;
if (typeof module !== 'undefined' && module !== null) {
  module.exports = exports;
}
