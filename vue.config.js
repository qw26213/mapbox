'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, //process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  devServer: {
    port: 8001,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    name: 'mapbox',
    externals: {},
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'public/index.html',
        inject: true
      })
      // new CompressionWebpackPlugin({
      //   asset: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: new RegExp(
      //     '\\.(' +
      //     config.build.productionGzipExtensions.join('|') +
      //     ')$'
      //   ),
      //   threshold: 10240,
      //   minRatio: 0.8
      // })
    ],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
      symbolId: 'icon-[name]'
    }).end()
    config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
      options.compilerOptions.preserveWhitespace = true
      return options
    }).end()
    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))
  }
}
