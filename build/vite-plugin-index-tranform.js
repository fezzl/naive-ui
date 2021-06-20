const transformIndexHtml = (code) => {
  switch (process.env.NODE_ENV) {
    case 'production':
      // 生产环境下把 index.html 的占位脚本替换成 /demo/index.prod.js
      return code.replace(/__INDEX__/, '/demo/index.prod.js')
    default:
      // 开发环境下把 index.html 的占位入口脚本替换成 /demo/index.dev.js
      return code.replace(/__INDEX__/, '/demo/index.dev.js')
  }
}

const demoIndexTransFormPlugin = {
  name: 'demo-transform',
  enforce: 'pre',
  // vite build is production will not invoke `transformIndexHtml`
  transform (code, id) {
    if (id.endsWith('.html')) {
      return { code: transformIndexHtml(code), map: null }
    }
  },
  transformIndexHtml
}

module.exports = demoIndexTransFormPlugin
