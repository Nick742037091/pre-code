import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type ConfigItem = {
  id: string
  configName: string
  configType: ConfigType
}

export enum ConfigType {
  Table,
  Form
}

export const ConfigTypeNames = {
  [ConfigType.Table]: '表格',
  [ConfigType.Form]: '表单'
}

interface State {
  configList: ConfigItem[]
  addConfig: (config: ConfigItem) => void
  updateConfig: (config: ConfigItem) => void
  deleteConfig: (index: number) => void
}

export const useConfigList = create<State>()(
  immer((set) => {
    const configList: ConfigItem[] = []
    const addConfig = (config: ConfigItem) => {
      set((state) => {
        state.configList.push(config)
      })
    }
    const updateConfig = (config: ConfigItem) => {
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
    return { configList, addConfig, updateConfig, deleteConfig }
  })
)
