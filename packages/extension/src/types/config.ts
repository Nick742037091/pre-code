export type FileType = '.vue' | '.react'

export enum ConfigType {
  Table,
  Form
}

export enum ColumnAttrType {
  Input = 0,
  Number,
  Switch,
  Select
}

export interface ColumnAttrItem {
  id: string
  attrKey: string
  attrLabel: string
  attrType: ColumnAttrType
  attrOptions: string[]
}

export interface TemplateItem {
  id: string
  templateName: string
  templatePath: string
}

export type Config = {
  id: string
  configName: string
  configType: ConfigType
  fileType: FileType
  templateList: TemplateItem[]
  defaultTemplateId: string
  tablePropList: ColumnAttrItem[]
}

export type StorageData = {
  defaultConfigId: string
  configList: Config[]
}
