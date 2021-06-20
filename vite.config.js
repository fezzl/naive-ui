const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const createDemoPlugin = require('./build/vite-plugin-demo')

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: __dirname,
  plugins: createDemoPlugin(),
  resolve: {
    // In production site build, we want to import naive-ui from node_modules
    alias:
      process.env.NODE_ENV !== 'production'
        ? [
            {
              find: 'naive-ui',
              replacement: path.resolve(__dirname, './src')
            }
          ]
        : undefined
  },
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    'process.env.TUSIMPLE': !!process.env.TUSIMPLE,
    __DEV__: process.env.NODE_ENV !== 'production'
  },
  optimizeDeps: {
    // 依赖预构建
    include: [
      '@css-render/plugin-bem',
      'async-validator',
      'css-render',
      'date-fns',
      'evtd',
      'highlight.js',
      'lodash-es',
      'seemly',
      'treemate',
      'vdirs',
      'vooks',
      'vue',
      'vue-router',
      'vueuc'
    ],
    exclude: ['__INDEX__']
  },
  build: {
    outDir: 'site',
    rollupOptions: {
      plugins: [
        // babel 配合 rollup 使用
        babel({
          babelHelpers: 'bundled'
        })
      ]
    }
  },
  // 自定义 jsx
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
}
