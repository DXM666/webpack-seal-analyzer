const path = require("path");
const WebpackSealAnalyzerPlugin = require("../dist/index.cjs");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackSealAnalyzerPlugin({
      outputFormat: "html",
      outputFile: "analysis.html"
    }),
  ],
};
