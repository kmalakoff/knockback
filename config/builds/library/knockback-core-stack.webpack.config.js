const fs = require("fs");
const path = require("path");
const _ = require("underscore");

module.exports = _.extend(_.clone(require("../../webpack/base-config.js")), {
  entry: _.flatten([
    require("../../files").src_core,
    "./src/core/index.coffee",
  ]),
  output: {
    library: "kb",
    libraryTarget: "umd2",
    filename: "knockback-core-stack.js",
  },

  externals: [
    {
      "backbone-relational": {
        optional: true,
        root: "Backbone",
        amd: "backbone-relational",
        commonjs: "backbone-relational",
        commonjs2: "backbone-relational",
      },
    },
    {
      "backbone-associations": {
        optional: true,
        root: "Backbone",
        amd: "backbone-associations",
        commonjs: "backbone-associations",
        commonjs2: "backbone-associations",
      },
    },
  ],
});
