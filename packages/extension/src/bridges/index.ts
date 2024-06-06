import * as vscode from 'vscode'
import * as fs from 'fs'
import { nativeCommandCallback } from '../utils/bridge'
import { Message } from '@/utils/message'
import * as storage from '../utils/storage'
// TODO 导入webview-page问题：ESM 导入 Commonjs项目

// 查询所有配置
export const getStorageData = async (
  message: Message,
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) => {
  const data = storage.getStorageData(context)
  nativeCommandCallback({
    webview,
    commandId: message.commandId,
    params: {
      data
    }
  })
}

// 保存所有配置
export const saveStorageData = async (
  message: Message,
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) => {
  const { data } = message.params || {}
  storage.saveStorageData(context, data)
  nativeCommandCallback({
    webview,
    commandId: message.commandId
  })
}

// 查询配置列表
export const getConfigList = async (
  message: Message,
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) => {
  const configList = storage.getConfigList(context)
  nativeCommandCallback({
    webview,
    commandId: message.commandId,
    params: {
      configList
    }
  })
}

// 保存配置列表
export const saveConfigList = async (
  message: Message,
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) => {
  const { configList } = message.params || {}
  storage.saveConfigList(context, configList)
  nativeCommandCallback({
    webview,
    commandId: message.commandId
  })
}

// 选择文件
export const pickFile = async (message: Message, webview: vscode.Webview) => {
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
      nativeCommandCallback({
        webview,
        commandId: message.commandId,
        params: {
          path: fileUri[0].fsPath,
          content: data
        }
      })
    })
  }
}

// 选择文件
export const readFile = async (message: Message, webview: vscode.Webview) => {
  const { filePath } = message.params || {}
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      nativeCommandCallback({
        webview,
        commandId: message.commandId,
        params: null
      })
      return
    }
    nativeCommandCallback({
      webview,
      commandId: message.commandId,
      params: {
        content: data
      }
    })
  })
}

// 生成页面代码
export const generateCode = async (
  message: Message,
  webview: vscode.Webview
) => {
  const { fileName, fileType, code } = message.params || {}
  let { filePath, line, character } = message.params || {}
  if (filePath) {
    console.log('generateCode', filePath, line, character)
    // 插入
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        nativeCommandCallback({
          webview,
          commandId: message.commandId,
          params: {
            isSuccess: false
          }
        })
        return
      }
      // 按行分割文件内容
      const lines = data.split('\n')
      // 在第n行插入文本
      lines.splice(line, 0, code)
      // 重新组合文本
      const newData = lines.join('\n')
      // 写回文件
      fs.writeFile(filePath, newData, 'utf8', (err) => {
        if (err) {
          vscode.window.showErrorMessage('生成代码失败')
        } else {
          vscode.window.showInformationMessage('生成代码成功')
        }
        nativeCommandCallback({
          webview,
          commandId: message.commandId,
          params: {
            isSuccess: !err
          }
        })
      })
    })
  } else {
    const uri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: '选择文件夹'
    })
    if (uri && uri[0]) {
      filePath = `${uri[0].fsPath}/${fileName}${fileType}`
    }
    // 覆盖
    fs.writeFile(filePath, code, {}, (err) => {
      if (err) {
        vscode.window.showErrorMessage('生成代码失败')
      } else {
        vscode.window.showInformationMessage('生成代码成功')
      }
      nativeCommandCallback({
        webview,
        commandId: message.commandId,
        params: {
          isSuccess: !err
        }
      })
    })
  }
}
