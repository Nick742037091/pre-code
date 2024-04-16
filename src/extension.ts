import * as vscode from 'vscode'
import handlebars from 'handlebars'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pre-code.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'tablePage',
      '生成表格页面',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    )
    panel.webview.html = getWebviewContent()
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'generateCode':
          const template = handlebars.compile('Name: {{name}}')
          vscode.window.showErrorMessage(template({ name: '张三' }))
      }
    })
  })

  context.subscriptions.push(disposable)
}

function getWebviewContent() {
  // 本地开发需要使用本地连接，并处理好热更新
  return `<!doctype html>
  <html lang="en">
    <head>
      <script type="module">import { injectIntoGlobalHook } from "http://localhost:5173/@react-refresh";
      injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;</script>

      <script type="module" src="http://localhost:5173/@vite/client"></script>
      <script>
        window.vscode = acquireVsCodeApi();
      </script>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="http://localhost:5173/vite.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + React + TS</title>
    </head>
    <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5173/src/main.tsx"></script>
    </body>
  </html>`
}

export function deactivate() {}
