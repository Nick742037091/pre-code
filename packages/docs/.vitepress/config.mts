import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Pre Code',
  description: '用EJS模板生成代码的VSCode插件',
  base: '/pre-code/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/pre-code/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/desc' },
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
          { text: '属性', link: '/config/attribute' },
          { text: '表格配置', link: '/config/table' },
          { text: '表单配置', link: '/config/form' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nick742037091/pre-code' }
    ],
    logo: '/logo.png'
  }
})
