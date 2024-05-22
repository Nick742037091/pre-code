# pre-code 

## 插件技术文档
https://www.nick-h.cn/pre-code/

> 项目为monorepo架构，所有命令在根目录执行

## 安装依赖
`pnpm install`

## 插件本地开发
`pnpm run dev`

> 启动后插件和插件内页面都会进入watch模式，修改插件代码需要重新打开插件，修改页面代码会自动触发热更新。

开发调试:
1. 在vscode中输入快捷键F5
2. [插件入口](https://www.nick-h.cn/pre-code/quick-start.html#%E6%8F%92%E4%BB%B6%E5%85%A5%E5%8F%A3)
3. 执行命令后会启动react-devtools应用，打开插件后会自动连接上
![alt text](/imgs/devtool.png)

## 生产构建
`pnpm run build`

会构建出插件和依赖的静态文件，用于插件发布

## 发布插件
`pnpm run publish:extension`

## 插件包构建
`pnpm run package:extension`

插件包仅用于测试安装，发布插件不依赖插件包

> 文档开发和构建与插件分离，需要单独执行命令

## 文档本地开发
`pnpm run dev:docs`


## 文档构建
`pnpm run build:docs`

## 文档预览
`pnpm run preview:docs`



