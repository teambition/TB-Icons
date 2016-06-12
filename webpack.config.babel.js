import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

const htmlminOptions = {

}

export default {
  entry: {
    iconfonts: [
      './gh-pages/common.styl',
      './gh-pages/iconfonts/style.styl',
      './gh-pages/iconfonts/app.js'
    ],
    svgs: [
      './gh-pages/common.styl',
      './gh-pages/svgs/style.styl',
      './gh-pages/svgs/app.js'
    ]
  },
  output: {
    path: './build',
    filename: 'js/[name].[hash:8].js',
    publicPath: 'http://localhost:8080/'
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
        test: /\.(gif|jpeg|jpg|png)(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024
        },
        loader: 'url'
      },
      {
        test: /\.eot(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024
        },
        loader: 'url'
      },
      {
        test: /\.svg(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024,
          minetype: 'image/svg+xml'
        },
        loader: 'url'
      },
      {
        test: /\.ttf(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024,
          minetype: 'application/octet-stream'
        },
        loader: 'url'
      },
      {
        test: /\.woff(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024,
          minetype: 'application/font-woff'
        },
        loader: 'url'
      },
      {
        test: /\.woff2(\?\S*)?$/,
        query: {
          name: 'assets/[name].[hash:8].[ext]',
          limit: 1024,
          minetype: 'application/font-woff2'
        },
        loader: 'url'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].[hash:8].css', {
      disable: process.env.NODE_ENV !== 'BUILD'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'index.html',
      template: './gh-pages/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'iconfonts/index.html',
      template: './gh-pages/iconfonts/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: htmlminOptions,
      filename: 'svgs/index.html',
      template: './gh-pages/svgs/index.html'
    })
  ],
  postcss(bundle) {
    let plugins = [
      require('autoprefixer')
    ]

    if (process.env.NODE_ENV === 'BUILD') {
      plugins.push(require('cssnano'))
    }

    return plugins
  }
}
