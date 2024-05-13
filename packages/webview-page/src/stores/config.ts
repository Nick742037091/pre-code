import { nativeCommond } from '@/utils/bridge'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { WritableDraft } from 'immer'
import computed from 'zustand-computed'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import type {
  Config,
  StorageData,
  TemplateItem
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
          state.isLoaded = true
        })
      })
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
        })
      }
      const getCurrentConfig = (state: WritableDraft<State>) => {
        // 在immer的state中才能修改，不能通过get修改
        const currentConfig = state.configList.find(
          (item) => item.id === state.currentConfigId
        )
        return currentConfig
      }

      const addTemplate = (template: TemplateItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.templateList.push(template)
        })
      }
      const updateTemplate = (template: TemplateItem) => {
        set((state) => {
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          const index = currentConfig!.templateList.findIndex(
            (item) => item.templateName === template.templateName
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

      const updateConfigStorage = (state: WritableDraft<State>) => {
        const currentConfig = getCurrentConfig(state)
        if (!currentConfig) return
        const index = state.configList.findIndex(
          (item) => item.id === currentConfig.id
        )
        state.configList.splice(index, 1, currentConfig)
      }
      const currentTemplateId = ''

      const setCurrentTemplateId = (templateId: string) => {
        set((state) => {
          state.currentTemplateId = templateId
          const currentConfig = getCurrentConfig(state)
          if (!currentConfig) return
          currentConfig.defaultTemplateId = templateId
        })
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
        currentTemplateId,
        setCurrentTemplateId,
        deleteTemplate
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
      return {
        currentConfig,
        templateList,
        currentTemplate
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
