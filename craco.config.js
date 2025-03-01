const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify"),
          "fs": false,
          "crypto": require.resolve("crypto-browserify"),
          "os": require.resolve("os-browserify/browser")
        }
      }
    }
  }
};
