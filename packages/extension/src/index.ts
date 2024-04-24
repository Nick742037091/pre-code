import * as vscode from 'vscode'
import * as fs from 'fs'
import { isDev } from './utils'

const pickFile = async (message: any, webview: vscode.Webview) => {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true, // 是否可以选择文件
    canSelectFolders: false, // 是否可以选择文件夹
    canSelectMany: false, // 是否可以多选
    openLabel: '选择文件' // 选择文件时的标签
  })
  if (fileUri && fileUri[0]) {
    const file = fileUri && fileUri[0]
    fs.readFile(file.fsPath, 'utf-8', (err, data) => {
      if (err) {
        return
      }
      webview.postMessage({
        command: 'callbackResult',
        commandId: message.commandId,
        path: fileUri[0].fsPath,
        content: data
      })
    })
  }
}

const generateCode = async (message: any, webview: vscode.Webview) => {
  const { fileName, code } = message
  const uri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    openLabel: '选择文件夹'
  })
  if (uri && uri[0]) {
    fs.writeFile(`${uri[0].fsPath}/${fileName}.vue`, code, {}, (err) => {
      if (err) {
        vscode.window.showErrorMessage('生成代码失败')
      } else {
        vscode.window.showInformationMessage('生成代码成功')
      }
    })
  }
}

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
    panel.webview.html = getWebviewContent(context, panel.webview)
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'pickFile':
          pickFile(message, panel.webview)
          return
        case 'generateCode':
          generateCode(message, panel.webview)
          return
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
