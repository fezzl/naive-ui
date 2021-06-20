const marked = require('marked')
const fs = require('fs')
const path = require('path')
const createRenderer = require('./md-renderer')
const mdRenderer = createRenderer()

const demoBlock = fs
  .readFileSync(path.resolve(__dirname, 'ComponentDemoTemplate.vue'))
  .toString()

// 把 markdown 生成的 token 转化为对应的 template script style title content
function getPartsOfDemo (tokens) {
  let template = null
  let script = null
  let style = null
  let title = null
  const contentTokens = []
  contentTokens.links = tokens.links
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'template' || token.lang === 'html')
    ) {
      template = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'script' || token.lang === 'js')
    ) {
      script = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'style' || token.lang === 'css')
    ) {
      style = token.text
    } else {
      contentTokens.push(token)
    }
  }
  return {
    template: template,
    script: script,
    style: style,
    title: title,
    content: marked.parser(contentTokens, {
      renderer: mdRenderer
    })
  }
}

// 把不同部分（template|script|style）组合起来成一个组件
function mergeParts (parts) {
  const mergedParts = {
    ...parts
  }
  // 初始化代码片段
  mergedParts.code = ''
  if (parts.template) {
    // 拼接 template 模板代码
    mergedParts.code += `<template>\n${parts.template
      .split('\n')
      .map((line) => (line.length ? '  ' + line : line))
      .join('\n')}\n</template>`
  }
  if (parts.script) {
    // 拼接 script 脚本代码
    if (parts.template) mergedParts.code += '\n\n'
    mergedParts.code += `<script>
    ${parts.script}
    </script>`
  }
  if (parts.style) {
    // 拼接 style 样式代码
    if (parts.template || parts.script) mergedParts.code += '\n\n'
    mergedParts.code += `<style>
    ${parts.style}
    </style>`
  }
  // 转义 utf-8 字符
  mergedParts.code = encodeURIComponent(mergedParts.code)
  return mergedParts
}

const cssRuleRegex = /([^{}]*)(\{[^}]*\})/g

// simulate scss style
// to remove dep of sass
// xxx {
//   mystyle
// }
function genStyle (sourceStyle) {
  let match
  let matched = false
  const rules = []

  while ((match = cssRuleRegex.exec(sourceStyle)) !== null) {
    matched = true
    const selector = match[1]
    const body = match[2]
    rules.push(
      selector
        .split(',')
        .map((part) => `.demo-card__view ${part}, .naive-ui-doc ${part}`)
        .join(',') + body
    )
  }
  if (!matched) return null
  return '<style scoped>\n' + rules.join('\n') + '</style>'
}

function genVueComponent (parts, fileName, relativeUrl, noRunning = false) {
  const demoFileNameReg = /<!--DEMO_FILE_NAME-->/g
  const relativeUrlReg = /<!--URL-->/g
  const titleReg = /<!--TITLE_SLOT-->/g
  const contentReg = /<!--CONTENT_SLOT-->/
  const codeReg = /<!--CODE_SLOT-->/
  const scriptReg = /<!--SCRIPT_SLOT-->/
  const styleReg = /<!--STYLE_SLOT-->/
  const demoReg = /<!--DEMO_SLOT-->/
  let src = demoBlock
  src = src.replace(demoFileNameReg, fileName)
  src = src.replace(relativeUrlReg, relativeUrl)
  if (parts.content) {
    src = src.replace(contentReg, parts.content)
  }
  if (parts.title) {
    src = src.replace(titleReg, parts.title)
  }
  if (parts.code) {
    src = src.replace(codeReg, parts.code)
  }
  if (parts.script && !noRunning) {
    src = src.replace(scriptReg, '<script>\n' + parts.script + '\n</script>')
  }
  if (parts.style) {
    const style = genStyle(parts.style)
    if (style !== null) {
      src = src.replace(styleReg, style)
    }
  }
  if (parts.template) {
    src = src.replace(demoReg, parts.template)
  }
  return src.trim()
}

function getFileName (resourcePath) {
  const dirs = resourcePath.split('/')
  const fileNameWithExtension = dirs[dirs.length - 1]
  return [fileNameWithExtension.split('.')[0], fileNameWithExtension]
}

function convertMd2Demo (text, { resourcePath, relativeUrl }) {
  // 不执行这段代码
  const noRunning = /<!--no-running-->/.test(text)
  // 把 markdown 语法转化为 token
  const tokens = marked.lexer(text)
  // 把 token 拆分成不同部分
  const parts = getPartsOfDemo(tokens)
  // 把不同部分组合成在一起
  const mergedParts = mergeParts(parts)
  // 获取文件名
  const [fileName] = getFileName(resourcePath)
  // 生成一个 demo 组件
  const vueComponent = genVueComponent(
    mergedParts,
    fileName,
    relativeUrl,
    noRunning
  )
  return vueComponent
}

module.exports = convertMd2Demo
