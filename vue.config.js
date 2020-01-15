'use strict'

module.exports = {
  // 部署应用包时配置的
  publicPath: '/',
  // 打包后的目录
  outputDir: 'dist',
  // 放置生成的静态资源
  assetsDir: '',
  // 指定生成的 index.html 的输出路径
  // indexPath:'/',
  // css
  lintOnSave: false,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/mweb': {
        target: 'http://43.247.184.50:8280/mweb' // 测试服务器
        // 本地服务器
        // target: 'http://192.168.0.114:9080/dist'
      },
      '/yan': {
        // 老延服务器
        target: 'http://192.168.1.108:9000/v2'
        // target: 'http://43.247.184.50:8280/mweb'
      },
      '/yong': {
        // 健勇服务器
        target: 'http://192.168.1.108:9000/v2'
        // target: 'http://43.247.184.50:8280/mweb'
      },
      '/test': {
        // 测试服务器
        target: 'http://43.247.184.50:8280/xk-admin/v2'
        // target: 'http://43.247.184.50:8280/mweb'
      },
    }
  }
}
