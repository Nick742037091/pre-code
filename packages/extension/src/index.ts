import * as vscode from 'vscode'
import { isDev } from './utils'
import * as bridges from './bridges/index'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pre-code.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'tablePage',
      '生成表格页面',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true // 切换窗口时保持webview状态
      }
    )
    panel.webview.html = getWebviewContent(context, panel.webview)
    panel.webview.onDidReceiveMessage((message) => {
      const bridge = bridges[message.command as keyof typeof bridges]
      if (bridge) {
        bridge(message, panel.webview)
      } else {
        console.error(`${message.command}桥接不存在`)
      }
    })
  })

  context.subscriptions.push(disposable)
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
) {
  if (isDev) {
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
            <title>Pre Code</title>
          </head>
          <body>
          <div id="root"></div>
          <script type="module" src="http://localhost:5173/src/main.tsx"></script>
          </body>
        </html>`
  } else {
    const scriptPathOnDisk = vscode.Uri.joinPath(
      context.extensionUri,
      'out',
      'table-page',
      'index.js'
    )
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)

    const stylePathOnDisk = vscode.Uri.joinPath(
      context.extensionUri,
      'out',
      'table-page',
      'index.css'
    )
    const styleUri = webview.asWebviewUri(stylePathOnDisk)
    return `<!doctype html>
        <html lang="en">
          <head>
            <script>
              window.vscode = acquireVsCodeApi();
            </script>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Pre Code</title>
          </head>
          <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
          <link rel="stylesheet" href="${styleUri}">
          </body>
        </html>`
  }
}

export function deactivate() {}
