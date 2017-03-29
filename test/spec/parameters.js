const r = typeof require !== 'undefined';
const root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;
let kb = root.kb; try { kb = kb || (r ? require('knockback') : undefined); } catch (e) { /* */ }

const exports = { LocaleManager: require('./lib/locale_manager') };

root.__test__parameters = exports;

if (typeof module !== 'undefined') module.exports = exports;
