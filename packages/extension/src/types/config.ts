export type FileType = '.vue' | '.js' | '.jsx' | '.ts' | '.tsx'

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
  Select,
  Code
}

export interface ColumnAttrItem {
  id: string
  attrKey: string
  attrLabel: string
  attrType: ColumnAttrType
  attrOptions: string[]
}

export type FormAttrItem = ColumnAttrItem

export interface FormItem {
  id: string
  name: string
  type: string
  attrList: FormAttrItem[]
  elementAttrList: FormAttrItem[]
}
export type Config = {
  id: string
  configName: string
  configType: ConfigType
  defaultFileType: FileType
  templateCode: string
  defaultTemplateId: string
  globalAttrList: ColumnAttrItem[]
  tableColAttrList: ColumnAttrItem[]
  formItemList: FormItem[]
}

export type StorageData = {
  defaultConfigId: string
  configList: Config[]
}
