import { Config, StorageData } from '@/types/config'
import * as vscode from 'vscode'
import fs from 'fs'
import path from 'path'

const STORAGE_FILE_NAME = 'pre-code.json'

export const readStorage = (context: vscode.ExtensionContext) => {
  const globalStoragePath = context.globalStorageUri.fsPath
  const dataFilePath = path.join(globalStoragePath, STORAGE_FILE_NAME)

  let result: string = ''
  // 先创建文件夹
  if (!fs.existsSync(globalStoragePath)) {
    fs.mkdirSync(globalStoragePath)
  }
  // 检查数据文件是否存在
  if (fs.existsSync(dataFilePath)) {
    // 读取数据文件
    result = fs.readFileSync(dataFilePath, 'utf8')
  } else {
    result = JSON.stringify({})
    fs.writeFileSync(dataFilePath, result, { flag: 'w' })
  }
  return JSON.parse(result)
}

export const saveStorage = (
  context: vscode.ExtensionContext,
  data: Record<string, any>
) => {
  const globalStoragePath = context.globalStorageUri.fsPath
  const dataFilePath = path.join(globalStoragePath, STORAGE_FILE_NAME)
  fs.writeFileSync(dataFilePath, JSON.stringify(data), 'utf8')
}

export const getStorageData = (context: vscode.ExtensionContext) => {
  return (
    (readStorage(context) as StorageData) || {
      defaultConfigId: '',
      configList: []
    }
  )
}

export const saveStorageData = (
  context: vscode.ExtensionContext,
  data: StorageData
) => {
  return saveStorage(context, data)
}

export const getConfigList = (context: vscode.ExtensionContext) => {
  return (readStorage(context).configList as Config[]) || []
}

export const saveConfigList = (
  context: vscode.ExtensionContext,
  configList: string
) => {
  const data = readStorage(context)
  data.configList = configList
  return saveStorage(context, data)
}
