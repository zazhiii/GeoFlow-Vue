const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    //    proxy: {
    //   '/api': {
    //     target: 'http://47.109.197.221:8080',
    //     changeOrigin: true
    //   }
    // },
    port: 7070
  }
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
}
