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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const handlebars_1 = __importDefault(require("handlebars"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('pre-code.start', () => {
        const panel = vscode.window.createWebviewPanel('tablePage', '生成表格页面', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'generateCode':
                    const template = handlebars_1.default.compile('Name: {{name}}');
                    vscode.window.showErrorMessage(template({ name: '张三' }));
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
      <title>Vite + React + TS</title>
    </head>
    <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5173/src/main.tsx"></script>
    </body>
  </html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map