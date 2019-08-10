const path = require('path');

const config = (env, argv) =>  {
  const dev = argv.mode === 'development';
  return {

    // Map source files for better errors
    devtool: 'source-map',
    entry: [ '@babel/polyfill', './src/app/index.js' ],
    output: {
      path: path.join(__dirname, dev ? './devBuild' : './build'),
      filename: 'bundle.js',
    },
    devServer: {
      contentBase: path.join(__dirname, './src/app'),
      watchContentBase: true,
      compress: true,

      // Proxy address points to the express server running on port 3000 
      proxy: [
        {
          context: [ '/' ],
          target: 'http://localhost:3000',
          secure: false
        }
      ],
      port: 3001,

      // Show client errors in browser
      overlay: {
        warnings: true,
        errors: true
      }
    },
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
          test: /\.(css|scss)$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            },
          ]
        }
      ],
    }
  };
};

module.exports = config;