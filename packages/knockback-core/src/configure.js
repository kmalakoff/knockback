import kb from './kb';

// @nodoc
export const settings = { orm: null };

// @nodoc
export default (options = {}) => kb.assign(settings, options);
