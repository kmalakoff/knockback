module.exports = {
  basePath: ".",
  frameworks: ["mocha", "chai"],
  preprocessors: { "**/*.coffee": ["coffee"] },

  coffeePreprocessor: {
    options: { bare: true, sourceMap: false },
    transformPath(path) {
      return path.replace(/\.coffee$/, ".js");
    },
  },

  reporters: ["dots"],
  port: 9876,
  colors: true,
  logLevel: "INFO",

  browsers: ["ChromeHeadless"],
  singleRun: true,
};

// browsers: ['ChromeHeadless', 'Chrome, 'Firefox', 'Chrome', 'Safari']
// singleRun: true

// browsers: ['Chrome']
// singleRun: false
