let kb = typeof window !== 'undefined' ? root.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) { /**/ } try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) { /**/ }

const exports = { LocaleManager: require('./lib/locale_manager') };

((() => {
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
})()).__test__parameters = exports;

if (typeof module !== 'undefined' && module !== null) module.exports = exports;
