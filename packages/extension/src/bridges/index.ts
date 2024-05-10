import * as vscode from 'vscode'
import * as fs from 'fs'
import { nativeCommandCallback } from '../utils/bridge'
import { Message } from '@/utils/message'
import * as storage from '../utils/storage'
// TODO 导入webview-page问题：ESM 导入 Commonjs项目

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
  let { filePath } = message.params || {}
  if (!filePath) {
    const uri = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: '选择文件夹'
    })
    if (uri && uri[0]) {
      filePath = `${uri[0].fsPath}/${fileName}${fileType}`
    }
  }
  console.log('generateCode', filePath)
  if (filePath) {
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

// 添加模板
export const addTemplate = async (
  message: Message,
  webview: vscode.Webview
) => {
  const { templateName, templatePath } = message.params || {}
  const config = vscode.workspace.getConfiguration()
  // TODO ts增强
  const templateList = config.get('pre-code.templateList') as any[]
  if (templateList.find((item) => item.templateName === templateName)) {
    return vscode.window.showErrorMessage('模版已存在')
  }

  await config.update(
    'pre-code.templateList',
    [...templateList, { templateName, templatePath }],
    vscode.ConfigurationTarget.Global
  )
  nativeCommandCallback({
    webview,
    commandId: message.commandId
  })
}

//  编辑模板
export const editTemplate = async (
  message: Message,
  webview: vscode.Webview
) => {
  const { templateName, templatePath } = message.params || {}
  const config = vscode.workspace.getConfiguration()
  // TODO ts增强
  const templateList = config.get('pre-code.templateList') as any[]
  const index = templateList.findIndex(
    (item) => item.templateName === templateName
  )
  templateList.splice(index, 1, { templateName, templatePath })
  await config.update(
    'pre-code.templateList',
    templateList,
    vscode.ConfigurationTarget.Global
  )
  nativeCommandCallback({
    webview,
    commandId: message.commandId
  })
}

// 添加模板
export const getTemplateList = async (
  message: Message,
  webview: vscode.Webview
) => {
  const config = vscode.workspace.getConfiguration()
  const templateList = config.get('pre-code.templateList') as []
  nativeCommandCallback({
    webview,
    commandId: message.commandId,
    params: {
      templateList
    }
  })
}

// 更新模板列表
export const updateTemplateList = async (
  message: Message,
  webview: vscode.Webview
) => {
  const { templateList } = message.params || {}
  await vscode.workspace
    .getConfiguration()
    .update(
      'pre-code.templateList',
      templateList,
      vscode.ConfigurationTarget.Global
    )
  nativeCommandCallback({
    webview,
    commandId: message.commandId
  })
}
