module.exports = {
  module: {
    rules: [
      {
        test: /\.coffee$/,
        loader: "coffee-loader",
        options: {
          transpile: {
            presets: ["@babel/env"],
          },
        },
      },
    ],
  },

  resolve: {
    extensions: [".coffee", ".js"],
    modules: ["node_modules"],
  },
};
