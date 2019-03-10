/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = isProd => {
  const config = {
    resolve: {
      extensions: ['.ts', '.js'],
      // webpack defaults to `module` and `main`, but that's
      // not really what node.js supports, so we reset it
      mainFields: ['main'],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    mode: isProd ? 'production' : 'development',
    target: 'node',
    node: false,
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(process.cwd(), '.webpack'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            configFile: path.join(__dirname, './.babelrc'),
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      ],
    },
    optimization: {
      // the below makes sure webpack doesn't touch NODE_ENV
      // because the default behavior for webpack is to set NODE_ENV = 'development' | 'production' depending on the mode at compile time
      nodeEnv: false,
      // minimize: false,
      // concatenateModules: false,
    },
    // this is because of a memory leak in either serverless-offline or serverless-webpack
    // that if we bundle all dependencies in the bundle, the memory keeps increasing over time
    // Refs:
    //  - https://github.com/dherault/serverless-offline/issues/539
    //  - https://github.com/serverless-heaven/serverless-webpack/issues/473
    externals: ['aws-sdk'],
    plugins: [
      new webpack.DefinePlugin({
        'process.env.IS_OFFLINE': JSON.stringify(!isProd),
        'process.env.IS_LOCAL': JSON.stringify(!isProd),
      }),
    ],
    // stats: isProd ? 'normal' : 'minimal',
  };
  if (isProd) {
    config.optimization.minimizer = [
      new TerserPlugin({
        cache: true,
        parallel: false,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ];
  }

  return config;
};
