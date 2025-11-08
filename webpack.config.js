const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.join(__dirname);

const config = {
  mode: 'development',
  entry: {
    react: path.join(rootDir, 'src/react/index.js'),
  },
  output: {
    // Avoid MD4; works on Node 18/20+ without legacy OpenSSL
    hashFunction: 'xxhash64',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
        ],
        exclude: /node_modules/,
      },
      // Vendor CSS from node_modules/, don't CSS-module them
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: /node_modules/,
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(rootDir, 'src', 'index.html'),
      filename: 'index.html',
      chunks: ['react'],
      hash: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};

module.exports = config;
