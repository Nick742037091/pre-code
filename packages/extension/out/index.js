"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const pickFile = async (message, webview) => {
    const fileUri = await vscode.window.showOpenDialog({
        canSelectFiles: true, // 是否可以选择文件
        canSelectFolders: false, // 是否可以选择文件夹
        canSelectMany: false, // 是否可以多选
        openLabel: 'Select File' // 选择文件时的标签
    });
    if (fileUri && fileUri[0]) {
        const file = fileUri && fileUri[0];
        fs.readFile(file.fsPath, 'utf-8', (err, data) => {
            if (err) {
                return;
            }
            webview.postMessage({
                command: 'callbackResult',
                commandId: message.commandId,
                path: fileUri[0].fsPath,
                content: data
            });
        });
    }
};
const generateCode = (message, webview) => {
    // TODO 提取保存文件路径参数
    fs.writeFile('/Users/nick/Documents/project/hand-wirte/templates/table.vue', message.code, {}, (err) => {
        if (err) {
            vscode.window.showErrorMessage('生成代码失败');
        }
        else {
            vscode.window.showInformationMessage('生成代码成功');
        }
    });
};
function activate(context) {
    let disposable = vscode.commands.registerCommand('pre-code.start', () => {
        const panel = vscode.window.createWebviewPanel('tablePage', '生成表格页面', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'pickFile':
                    pickFile(message, panel.webview);
                    return;
                case 'generateCode':
                    generateCode(message, panel.webview);
                    return;
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
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
      <title>Pre Code</title>
    </head>
    <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5173/src/main.tsx"></script>
    </body>
  </html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map