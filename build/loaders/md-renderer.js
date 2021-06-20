const hljs = require('highlight.js')
const marked = require('marked')

function createRenderer (wrapCodeWithCard = true) {
  // markdown 渲染器实例
  const renderer = new marked.Renderer()
  // 重写渲染器规则
  const overrides = {
    // 重写表格渲染
    table (header, body) {
      if (body) body = '<tbody>' + body + '</tbody>'
      return (
        '<div class="md-table-wrapper"><n-table single-column class="md-table">\n' +
        '<thead>\n' +
        header +
        '</thead>\n' +
        body +
        '</n-table>\n' +
        '</div>'
      )
    },

    // 重写表格行渲染
    tablerow (content) {
      return '<tr>\n' + content + '</tr>\n'
    },

    // 重写表格单元渲染
    tablecell (content, flags) {
      const type = flags.header ? 'th' : 'td'
      const tag = flags.align
        ? '<' + type + ' align="' + flags.align + '">'
        : '<' + type + '>'
      return tag + content + '</' + type + '>\n'
    },

    // 重写代码块渲染
    code: (code, language) => {
      if (language.startsWith('__')) {
        language = language.replace('__', '')
      }
      const isLanguageValid = !!(language && hljs.getLanguage(language))
      if (!isLanguageValid) {
        throw new Error(
          `MdRendererError: ${language} is not valid for code - ${code}`
        )
      }
      const highlighted = hljs.highlight(code, { language }).value
      // TODO: v-pre 是什么
      const content = `<n-code><pre v-pre>${highlighted}</pre></n-code>`
      return wrapCodeWithCard
        ? `<n-card size="small" class="md-card" content-style="padding: 0;">
            <n-scrollbar x-scrollable content-style="padding: 12px; 16px;">
              ${content}
            </n-scrollbar>
          </n-card>`
        : content
    },

    // 重写标题的渲染
    heading: (text, level) => {
      const id = text.replace(/ /g, '-')
      return `<n-h${level} id="${id}">${text}</n-h${level}>`
    },

    // 重写引用渲染
    blockquote: (quote) => {
      return `<n-blockquote>${quote}</n-blockquote>`
    },

    // 重写分割线渲染
    hr: () => '<n-hr />',

    // 重写段落渲染
    paragraph: (text) => {
      return `<n-p>${text}</n-p>`
    },

    // 重写链接渲染
    link (href, title, text) {
      if (/^(http:|https:)/.test(href)) {
        return `<n-a href="${href}" target="_blank">${text}</n-a>`
      }
      return `<n-a to="${href}" >${text}</n-a>`
    },

    // 重写列表的渲染
    list (body, ordered, start) {
      // 区分有序和无序
      const type = ordered ? 'n-ol' : 'n-ul'
      const startatt = ordered && start !== 1 ? ' start="' + start + '"' : ''
      return `<${type}${startatt}>\n` + body + `</${type}>\n`
    },

    // 重写列表项的渲染
    listitem (text) {
      return `<n-li>${text}</n-li>`
    },

    // 重写代码片段渲染
    codespan (code) {
      return `<n-text code>${code}</n-text>`
    },

    // 重写强调的渲染
    strong (text) {
      return `<n-text strong>${text}</n-text>`
    },

    // 重写复选框的渲染
    checkbox (checked) {
      return `<n-checkbox :checked="${checked}" style="vertical-align: -2px; margin-right: 8px;" />`
    }
  }

  Object.keys(overrides).forEach((key) => {
    renderer[key] = overrides[key]
  })
  return renderer
}

module.exports = createRenderer
