const webpack = require("webpack");
const glob = require("glob");

const srcBase = './src';
const srcBaseJs = srcBase + '/js/pages';

const entryArray = glob.sync(srcBaseJs + "/**/*.js")
const entryObject = Object.fromEntries(entryArray.map(key => [key.split("/").slice(-1)[0].split(".")[0], key]));

module.exports = {
  mode: "production",
  entry: entryObject,
  output: {
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      },
    ]
  },
}