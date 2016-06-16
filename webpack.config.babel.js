import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const IS_BUILD = (process.env.NODE_ENV === 'build')

const JS_NAME = IS_BUILD ? 'js/[name].[chunkhash:8].js' : 'js/[name].js'
const CSS_NAME = IS_BUILD ? 'css/[name].[chunkhash:8].css' : 'css/[name].css'
const ASSETS_NAME = IS_BUILD ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]'

const htmlminOptions = {
  collapseWhitespace: IS_BUILD,
  removeComments: IS_BUILD,
  removeEmptyAttributes: IS_BUILD,
  sortAttributes: IS_BUILD,
  sortClassName: IS_BUILD
}

const DEV_HOST = process.env.HOST || 'localhost'
const DEV_PORT = process.env.PORT || '8080'

const publicPath = {
  dev: `http://${DEV_HOST}:${DEV_PORT}/`,
  build: 'http://teambition.github.io/TB-Icons/'
}

let config = {
  entry: {
    iconfonts: [
      './lib/tb-icons.styl',
      './gh-pages/common.styl',
      './gh-pages/app.js'
    ],
    svgs: [
      './gh-pages/common.styl',
      './gh-pages/app.js'
    ]
  },
  output: {
    path: './build',
    filename: JS_NAME,
    publicPath: IS_BUILD ? publicPath.build : publicPath.dev
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
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!stylus')
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
        query: {
          name: ASSETS_NAME,
          limit: 1024
        },
        loader: 'url'
      },
      {
        test: /\.eot(\?\S*)?$/,
        query: {
          name: ASSETS_NAME,
          limit: 1024
        },
        loader: 'url'
      },
      {
        test: /\.svg(\?\S*)?$/,
        query: {
          name: ASSETS_NAME,
          limit: 1024,
          minetype: 'image/svg+xml'
        },
        loader: 'url'
      },
      {
        test: /\.ttf(\?\S*)?$/,
        query: {
          name: ASSETS_NAME,
          limit: 1024,
          minetype: 'application/octet-stream'
        },
        loader: 'url'
      },
      {
        test: /\.woff(\?\S*)?$/,
        query: {
          name: ASSETS_NAME,
          limit: 1024,
          minetype: 'application/font-woff'
        },
        loader: 'url'
      },
      {
        test: /\.woff2(\?\S*)?$/,
        query: {
          name: ASSETS_NAME,
          limit: 1024,
          minetype: 'application/font-woff2'
        },
        loader: 'url'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(CSS_NAME, {
      disable: !IS_BUILD
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'index.html',
      template: './gh-pages/index.html',
      showErrors: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'iconfonts/index.html',
      template: './gh-pages/iconfonts/index.html',
      showErrors: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'svgs/index.html',
      template: './gh-pages/svgs/index.html',
      showErrors: true
    })
  ],
  postcss(bundle) {
    let plugins = [
      require('autoprefixer')
    ]

    if (IS_BUILD) {
      plugins.push(require('cssnano'))
    }

    return plugins
  }
}

if (!IS_BUILD) {
  config.debug = true
  config.devtool = 'eval-source-map'
  config.devServer = {
    host: DEV_HOST,
    port: DEV_PORT
  }

  config.plugins = config.plugins.concat([
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ])

  Object.keys(config.entry).forEach(function(key) {
    config.entry[key] = config.entry[key].concat(
      'webpack/hot/dev-server',
      `webpack-dev-server/client?${publicPath.dev}`
    )
  })
}

if (IS_BUILD) {
  config.plugins = config.plugins.concat(
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    })
  )
}

export default config
