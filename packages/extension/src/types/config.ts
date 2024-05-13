export type FileType = '.vue' | '.react'

export enum ConfigType {
  Table,
  Form
}

export interface TemplateItem {
  id: string
  templateName: string
  templatePath: string
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

export type FormAttrITem = ColumnAttrItem

export interface FormItem {
  id: string
  formName: string
  attrList: FormAttrITem[]
}
export type Config = {
  id: string
  configName: string
  configType: ConfigType
  fileType: FileType
  templateList: TemplateItem[]
  defaultTemplateId: string
  tableColumnList: ColumnAttrItem[]
  formItemList: FormItem[]
}

export type StorageData = {
  defaultConfigId: string
  configList: Config[]
}
