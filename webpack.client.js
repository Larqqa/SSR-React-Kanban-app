const path = require('path');

const config = (env, argv) =>  {
  const dev = argv.mode === 'development';

  return {

    // Map source files for better errors
    devtool: 'source-map',
    entry: ['@babel/polyfill', './src/app/index.js'],
    output: {
      path: path.join(__dirname, dev ? './devBuild' : './build'),
      filename: 'bundle.js',
    },
    devServer: {

      // Points to folder with static files
      contentBase: path.join(__dirname, './src/app'),

      // For live reload
      watchContentBase: true,
      compress: true,

      // Enable proxy
      // Gets data served from express server running on port 3000 
      proxy: [
        {
          context: ['/'],
          target: 'http://localhost:3000',
          secure: false
        }
      ],
      port: 3001,
      overlay: {
        warnings: true,
        errors: true
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
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
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
        }
      ],
    }
  };
};

module.exports = config;