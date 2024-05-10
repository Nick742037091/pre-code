import * as vscode from 'vscode'

export interface CallbackOptions {
  webview: vscode.Webview
  commandId: string
  params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

export const NATIVE_CALLBACK_NAME = 'nativeCallbackResult'
export const nativeCommandCallback = (options: CallbackOptions) => {
  options.webview.postMessage({
    command: NATIVE_CALLBACK_NAME,
    commandId: options.commandId,
    params: options.params
    // FIXME 多次回调params会合并
  })
}
