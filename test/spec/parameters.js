const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let kb; try { kb = root.kb || require('knockback'); } catch (e) { kb = require('../../../knockback'); }

const exports = { LocaleManager: require('./lib/locale_manager') };

root.__test__parameters = exports;

if (typeof module !== 'undefined') module.exports = exports;
