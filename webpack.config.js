/* eslint-disable @typescript-eslint/no-var-requires */

const slsw = require('serverless-webpack');
const getRootWebpackConfig = require('./webpack.base.config');

const isProd = !slsw.lib.webpack.isLocal;
const rootWebpackConfig = getRootWebpackConfig(isProd);
const config = {
  ...rootWebpackConfig,
  entry: slsw.lib.entries,
};

module.exports = config;
