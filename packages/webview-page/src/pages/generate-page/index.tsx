import ConfigList from '../config-list/index'
import SelectTemplate from './components/SelectTemplate/index'
import FileName from './components/FileName/index'
import GenerateCode from './components/GenerateCode/index'
import { useEffect, useRef, useState } from 'react'
import { SwapOutlined } from '@ant-design/icons'
import { ConfigType, useConfig } from '@/stores/config'
import TableColumnList from './components/TableColumnList'
import type { TableColumnListRef } from './components/TableColumnList'
import FormItemList from './components/FormItemList'

export interface TableColumnProp {
  id: string
  title?: string
  label: string
  prop: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any
}

function GeneratePage() {
  const [configListVisible, setConfigListVisible] = useState(false)
  const { currentConfig, isLoaded } = useConfig()
  // 当前为选中配置，需要弹出配置列表
  useEffect(() => {
    if (isLoaded && !currentConfig) {
      setConfigListVisible(true)
    }
  }, [isLoaded, currentConfig])

  const tableColumnListRef = useRef<TableColumnListRef>(null)
  const blockStyle =
    'm-10px py-10px px-15px rounded-10px border-1px border-solid border-slate-200'
  const configListDom = (
    <ConfigList visible={configListVisible} setVisible={setConfigListVisible} />
  )
  if (!currentConfig) {
    return configListDom
  }
  const getTableDataList = () => {
    return tableColumnListRef.current?.getTableDataList() || []
  }
  return (
    <div>
      {configListDom}
      <div className="h-100vh flex flex-col">
        <div className={blockStyle}>
          <div className="text-24px font-bold mb-15px flex items-center">
            {currentConfig?.configName}
            <SwapOutlined
              className="text-20px ml-20px cursor-pointer"
              onClick={() => {
                setConfigListVisible(true)
              }}
            />
          </div>
          <div className="flex items-center color-black">
            <SelectTemplate />
            <FileName />
            <GenerateCode getTableDataList={getTableDataList} />
          </div>
        </div>
        {currentConfig.configType === ConfigType.Table && (
          <TableColumnList blockStyle={blockStyle} ref={tableColumnListRef} />
        )}
        {currentConfig.configType === ConfigType.Form && (
          <FormItemList blockStyle={blockStyle} />
        )}
      </div>
    </div>
  )
}

export default GeneratePage
