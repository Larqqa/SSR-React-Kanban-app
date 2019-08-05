const path = require('path');
const nodeExternals = require('webpack-node-externals');
const copy = require('copy-webpack-plugin');

const config = (env, argv) =>  {
  const dev = argv.mode === 'development';

  return {
    devtool: 'source-map',
    entry: './src/server/server.js',
    output: {
      path: path.join(__dirname, dev ? './devBuild' : './build'),
      filename: 'server.js',
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /node_modules/,
          ],
          loader: 'babel-loader',
          query: {
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  'targets': {
                    'node': '10'
                  }
                }
              ]
            ],
          },
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
            }
          }
        },
      ],
    },
    plugins: [
      new copy([
        {
          from: './src/public',
          to: path.join(__dirname, dev ? './devBuild' : './build'),
          ignore: ['index.html'],
        },
      ]),
    ],
  };
};

module.exports = config;