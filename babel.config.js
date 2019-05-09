module.exports = function(api) {
  api.cache(true);

  const plugins = ['@babel/plugin-proposal-class-properties', '@babel/transform-async-to-generator'];
  const presets = ['@babel/preset-env'];

  return {
    presets,
    plugins
  };
};
