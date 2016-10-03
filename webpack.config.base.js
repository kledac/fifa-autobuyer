/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import validate from 'webpack-validator';

export default validate({
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // Load images
      { test: /\.jpg/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
      { test: /\.gif/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
      { test: /\.png/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.svg/, loader: 'url-loader?limit=10000&mimetype=image/svg' },

      // Load fonts
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ]
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',

    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },

  plugins: [],

  externals: [
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  ]
});
