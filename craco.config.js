const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify"),
          "fs": false,
          "util": require.resolve("util/"),
          "buffer": require.resolve("buffer/"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "process": require.resolve("process/browser"),
          "assert": require.resolve("assert/"),
          "url": require.resolve("url/"),
          "os": require.resolve("os-browserify/browser"),
        }
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }
};
