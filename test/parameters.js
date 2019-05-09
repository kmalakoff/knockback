const r = typeof require !== 'undefined';
const root = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
const kb = root.kb || (r ? require('@knockback/core') : undefined);

const exports = { LocaleManager: require('./lib/locale_manager') };

root.__test__parameters = exports;

if (typeof module !== 'undefined') module.exports = exports;
