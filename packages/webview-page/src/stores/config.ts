import { nativeCommond } from '@/utils/bridge'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { WritableDraft } from 'immer'
import computed from 'zustand-computed'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import type {
  FileType,
  Config,
  StorageData,
  TemplateItem,
  ColumnAttrItem,
  FormItem
} from 'pre-code/src/types/config'
export type { Config, TemplateItem }

export enum ConfigType {
  Table,
  Form
}

export const ConfigTypeNames = {
  [ConfigType.Table]: '表格',
  [ConfigType.Form]: '表单'
}

interface State {
  isLoaded: boolean
  configList: Config[]
  addConfig: (config: Config) => void
  updateConfig: (config: Config) => void
  deleteConfig: (index: number) => void
  currentConfigId: string
  setCurrentConfigId: (config: string) => void
  addTemplate: (template: TemplateItem) => void
  updateTemplate: (template: TemplateItem) => void
  deleteTemplate: (index: number) => void
  currentTemplateId: string
  setCurrentTemplateId: (templateId: string) => void
  fileType: FileType | ''
  setFileType: (fileType: FileType) => void
  setTableColumnList: (tableColumnList: ColumnAttrItem[]) => void
  addTableColumn: (tableColumn: ColumnAttrItem) => void
  updateTableColumn: (tableColumn: ColumnAttrItem) => void
  deleteTableColumn: (index: number) => void
  addFormItem: (formItem: FormItem) => void
  updateFormItem: (formItem: FormItem) => void
  deleteFormItem: (index: number) => void
}

export const useConfig = create<State>()(
  computed(
    immer((set) => {
      const isLoaded = false
      const configList: Config[] = []
      nativeCommond<{ data: StorageData }>({
        command: 'getStorageData'
      }).then((result) => {
        set((state) => {
          console.log('getStorageData', result.data)
          // 同步配置列表和默认配置
          state.configList = result.data.configList || []
          state.currentConfigId = result.data.defaultConfigId || ''
          const currentConfig = getCurrentConfig(state)
          state.currentTemplateId = currentConfig?.defaultTemplateId || ''
          if (!state.fileType) {
            state.fileType = currentConfig?.fileType || '.vue'
          }
          state.isLoaded = true
        })
      })
      /*** 配置 ***/
      const addConfig = (config: Config) => {
        set((state) => {
          state.configList.push(config)
        })
      }
      const updateConfig = (config: Config) => {
        set((state) => {
          const index = state.configList.findIndex(
            (item) => item.id === config.id
          )
          if (index === -1) return
          state.configList.splice(index, 1, config)
        })
      }
      const deleteConfig = (index: number) => {
        if (index === -1) return
        set((state) => {
          state.configList.splice(index, 1)
        })
      }

      const currentConfigId = ''
      const setCurrentConfigId = (configId: string) => {
        set((state) => {
          state.currentConfigId = configId
          const currentConfig = getCurrentConfig(state)
          state.currentTemplateId = currentConfig?.defaultTemplateId || ''
          state.fileType = currentConfig?.fileType || '.vue'
        })
      }
      const getCurrentConfig = (state: WritableDraft<State>) => {
        // 在immer的state中才能修改，不能通过get修改
        const currentConfig = state.configList.find(
          (item) => item.id === state.currentConfigId
        )
        return currentConfig
      }

      /*** 模板 ***/
      const addTemplate = (template: TemplateItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.templateList.push(template)
          currentConfig.defaultTemplateId = template.id
          state.currentTemplateId = template.id
          updateConfigStorage(state)
        })
      }
      const updateTemplate = (template: TemplateItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          const index = currentConfig.templateList.findIndex(
            (item) => item.id === template.id
          )
          if (index === -1) return
          currentConfig.templateList.splice(index, 1, template)
          updateConfigStorage(state)
        })
      }
      const deleteTemplate = (index: number) => {
        if (index === -1) return
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.templateList.splice(index, 1)
          updateConfigStorage(state)
        })
      }

      const currentTemplateId = ''
      const setCurrentTemplateId = (templateId: string) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          state.currentTemplateId = templateId
          currentConfig.defaultTemplateId = templateId
          updateConfigStorage(state)
        })
      }

      let fileType: FileType | '' = ''
      const { openFilePath } = window.injectParams
      if (openFilePath) {
        const pathParts = openFilePath.split('/')
        const lastPath = pathParts[pathParts.length - 1]
        fileType = ('.' + lastPath.split('.')[1]) as FileType
      }
      const setFileType = (fileType: FileType) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.fileType = fileType
          updateConfigStorage(state)
        })
      }

      /*** 表格列 ***/
      const setTableColumnList = (tableColumnList: ColumnAttrItem[]) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.tableColumnList = tableColumnList
          updateConfigStorage(state)
        })
      }
      const addTableColumn = (tableColumn: ColumnAttrItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.tableColumnList.push(tableColumn)
          updateConfigStorage(state)
        })
      }

      const updateTableColumn = (tableColumn: ColumnAttrItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          const index = currentConfig.tableColumnList.findIndex(
            (item) => item.id === tableColumn.id
          )
          if (index === -1) return
          currentConfig.tableColumnList.splice(index, 1, tableColumn)
          updateConfigStorage(state)
        })
      }

      const deleteTableColumn = (index: number) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.tableColumnList.splice(index, 1)
          updateConfigStorage(state)
        })
      }

      /* 表单列表 */
      const addFormItem = (form: FormItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.formItemList.push(form)
          updateConfigStorage(state)
        })
      }

      const updateFormItem = (form: FormItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          const index = currentConfig.formItemList.findIndex(
            (item) => item.id === form.id
          )
          if (index === -1) return
          currentConfig.formItemList.splice(index, 1, form)
          updateConfigStorage(state)
        })
      }

      const deleteFormItem = (index: number) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.formItemList.splice(index, 1)
          updateConfigStorage(state)
        })
      }

      // 更新配置项，触发本地保存
      const updateConfigStorage = (state: WritableDraft<State>) => {
        const currentConfig = getCurrentConfig(state)
        if (!currentConfig) return
        const index = state.configList.findIndex(
          (item) => item.id === currentConfig.id
        )
        state.configList.splice(index, 1, currentConfig)
      }

      return {
        isLoaded,
        configList,
        addConfig,
        updateConfig,
        deleteConfig,
        currentConfigId,
        setCurrentConfigId,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        currentTemplateId,
        setCurrentTemplateId,
        fileType,
        setFileType,
        setTableColumnList,
        addTableColumn,
        updateTableColumn,
        deleteTableColumn,
        addFormItem,
        updateFormItem,
        deleteFormItem
      }
    }),
    (state) => {
      const currentConfig = state.configList.find(
        (item) => item.id === state.currentConfigId
      )
      const templateList = currentConfig?.templateList || []
      const currentTemplate = templateList.find(
        (item) => item.id === state.currentTemplateId
      )
      const tableColumnList = currentConfig?.tableColumnList || []
      const formItemList = currentConfig?.formItemList || []
      return {
        currentConfig,
        currentTemplate,
        templateList,
        tableColumnList,
        formItemList
      }
    }
  )
)

// 监听配置更新进行，持久化
useConfig.subscribe((state, preState) => {
  if (
    JSON.stringify(state.configList) !== JSON.stringify(preState.configList) ||
    JSON.stringify(state.currentConfigId) !==
      JSON.stringify(preState.currentConfigId)
  ) {
    const data = {
      defaultConfigId: state.currentConfigId,
      configList: state.configList
    }
    if (state.configList.length === 0) {
      data.defaultConfigId = ''
    }
    console.log('subscribe config', data)
    nativeCommond({
      command: 'saveStorageData',
      params: {
        data
      }
    })
  }
})

mountStoreDevtool('config', useConfig)
