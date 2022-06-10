module.exports = {
  theme: '',
  title: '前端基础组件库文档',
  description: '前端组件库文档 + 示例代码演示',
  base: '/',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '组件',
        link: '/comps/'
      }
    ],
    sidebar: {
      '/comps/': [
        '/comps/',
        '/comps/Select.md',
        '/comps/SearchBar.md',
        '/comps/ListTable.md',
        '/comps/Pagination.md',
      ]
    }
  },
  head: [],
  plugins: ['demo-container'],
  markdown: {}
}