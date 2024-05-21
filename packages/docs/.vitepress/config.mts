import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pre Code',
  description: '用EJS模板生成代码的VSCode插件',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '描述', link: '/desc' },
      { text: '快速开始', link: '/quick-start' }
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是 Pre Code？', link: '/desc' },
          { text: '快速开始', link: '/quick-start' }
        ]
      },
      {
        text: '模板',
        items: [
          { text: '模板标记', link: '/template/file' },
          { text: '模板数据', link: '/template/data' }
        ]
      },
      {
        text: '配置',
        items: [
          { text: '表格配置', link: '/config/table' },
          { text: '表单配置', link: '/config/form' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    logo: '/logo.svg'
  }
})
