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
  templateList: TemplateItem[]
  defaultTemplateId: string
  tablePropList: ColumnAttrItem[]
}
