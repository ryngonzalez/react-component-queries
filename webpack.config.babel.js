/* eslint-disable import/no-extraneous-dependencies */

import webpack from 'webpack';
import path from 'path';
import WebpackStatsPlugin from 'stats-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';

const env = process.env.NODE_ENV;
const generateStats = process.env.WEBPACK_STATS || false;
const libraryName = 'react-component-queries';
const outputFileName = `${libraryName}.js`;

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reactSizeMeExternal = {
  root: 'SizeMe',
  commonjs2: 'react-sizeme',
  commonjs: 'react-sizeme',
  amd: 'react-sizeme',
};

const config = {
  entry: path.resolve(__dirname, './src/index.js'),
  externals: {
    react: reactExternal,
    'react-sizeme': reactSizeMeExternal,
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loaders: ['eslint-loader'], exclude: /node_modules/ },
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [path.resolve(__dirname, './src')],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: outputFileName,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  eslint: {
    failOnError: true,
    failOnWarning: true,
  },
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    })
  );

  config.plugins.push(
    new LodashModuleReplacementPlugin()
  );
}

if (generateStats) {
  config.plugins.push(
    new WebpackStatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [/node_modules[\\\/]react/],
    })
  );
}

export default config;
