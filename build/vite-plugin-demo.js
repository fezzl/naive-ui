const createVuePlugin = require('@vitejs/plugin-vue')
const getTransformedVueSrc = require('./utils/get-demo-by-path')
const createCssrPlugin = require('./vite-plugin-css-render')
const siteIndexTransFormPlugin = require('./vite-plugin-index-tranform')

// 匹配 md 和 entry 结尾的文件
const fileRegex = /\.(md|entry)$/

const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/, /\.entry$/]
})

const createDemoPlugin = () => {
  const naiveDemoVitePlugin = {
    name: 'demo-vite',
    // 这个钩子会在每个传入模块请求时被调用，转换代码
    transform (_, id) {
      if (fileRegex.test(id)) {
        // 转换 *.md 和 *.demo.md 文件为 Vue 组件
        return getTransformedVueSrc(id)
      }
    },
    // 执行自定义 HMR 更新处理
    async handleHotUpdate (ctx) {
      const { file } = ctx
      if (fileRegex.test(file)) {
        const code = await getTransformedVueSrc(file)
        return vuePlugin.handleHotUpdate({
          ...ctx,
          // 这是一个异步读函数，它返回文件的内容
          read: () => code
        })
      }
    }
  }

  const cssrPlugin = createCssrPlugin()

  return [siteIndexTransFormPlugin, naiveDemoVitePlugin, vuePlugin, cssrPlugin]
}

module.exports = createDemoPlugin
