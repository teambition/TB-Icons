import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = NODE_ENV === 'development'
// const __PROD__ = NODE_ENV === 'production'

const JS_NAME = __DEV__ ? 'js/[name].[chunkhash:8].js' : 'js/[name].js'
const __CSS_NAME__ = __DEV__ ? 'css/[name].[chunkhash:8].css' : 'css/[name].css'
const ASSETS_NAME = __DEV__ ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]'

const htmlminOptions = {
  collapseWhitespace: __DEV__,
  removeComments: __DEV__,
  removeEmptyAttributes: __DEV__,
  sortAttributes: __DEV__,
  sortClassName: __DEV__
}

const DEV_HOST = process.env.HOST || 'localhost'
const DEV_PORT = process.env.PORT || '4200'

const publicPath = {
  dev: `http://${DEV_HOST}:${DEV_PORT}/`,
  build: 'http://teambition.github.io/TB-Icons/v2/'
}

let webpackConfig = {
  target: 'web',
  entry: {
    iconfonts: [
      './lib/styles/tb-icons.styl',
      './src/gh-pages/common.styl',
      './src/gh-pages/app.js'
    ],
    svgs: [
      './src/gh-pages/common.styl',
      './src/gh-pages/app.js'
    ]
  },
  output: {
    path: './build/v2',
    filename: JS_NAME,
    publicPath: __DEV__ ? publicPath.build : publicPath.dev
  },
  resolve: {
    extensions: [
      '', '.js'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'post-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'post-loader',
          'stylus-loader',
        ]
      },
      {
        test: /\.html$/,
        loader: 'ejs-compiled'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(gif|jpeg|jpg|png)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: ASSETS_NAME,
            }
          }
        ]
      },
      {
        test: /\.eot(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: ASSETS_NAME
            }
          }
        ]
      },
      {
        test: /\.svg(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: ASSETS_NAME,
              limit: 1024,
              minetype: 'image/svg+xml'
            },
          }
        ]
      },
      {
        test: /\.ttf(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: ASSETS_NAME,
              limit: 1024,
              minetype: 'application/octet-stream'
            }
          }
        ]
      },
      {
        test: /\.woff(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: ASSETS_NAME,
              limit: 1024,
              minetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.woff2(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: ASSETS_NAME,
              limit: 1024,
              minetype: 'application/font-woff2'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin(CSS_NAME, {
    //   disable: !__DEV__
    // }),
    // disable in pro
    new MiniCssExtractPlugin({
      filename: __CSS_NAME__
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'index.html',
      template: './src/gh-pages/index.html',
      showErrors: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'iconfonts/index.html',
      template: './src/gh-pages/iconfonts/index.html',
      showErrors: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'svgs/index.html',
      template: './src/gh-pages/svgs/index.html',
      showErrors: true
    })
  ],
  // cssnano???
  // postcss(bundle) {
  //   let plugins = [
  //     require('autoprefixer')
  //   ]

  //   if (__DEV__) {
  //     plugins.push(require('cssnano'))
  //   }

  //   return plugins
  // }
}

// if (!__DEV__) {
//   webpackConfig.debug = true
//   webpackConfig.devtool = 'eval-source-map'
//   webpackConfig.devServer = {
//     host: DEV_HOST,
//     port: DEV_PORT
//   }

//   webpackConfig.plugins = webpackConfig.plugins.concat([
//     new webpack.NoErrorsPlugin(),
//     new webpack.optimize.OccurenceOrderPlugin()
//   ])

//   Object.keys(webpackConfig.entry).forEach(function(key) {
//     webpackConfig.entry[key] = webpackConfig.entry[key].concat(
//       'webpack/hot/dev-server',
//       `webpack-dev-server/client?${publicPath.dev}`
//     )
//   })
// }

// if (__DEV__) {
//   webpackConfig.plugins = webpackConfig.plugins.concat(
//     new webpack.optimize.AggressiveMergingPlugin(),
//     new webpack.optimize.DedupePlugin(),
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       },
//       sourceMap: false
//     })
//   )
// }

export default webpackConfig
