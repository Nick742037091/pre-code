import ConfigList from '../config-list/index'
import SelectTemplate from './components/SelectTemplate/index'
import FileName from './components/FileName/index'
import GenerateCode from './components/GenerateCode/index'
import { useEffect, useRef, useState } from 'react'
import { EditOutlined, SwapOutlined } from '@ant-design/icons'
import { ConfigType, useConfig } from '@/stores/config'
import TableColumnList from './components/TableColumnList'
import type { TableColumnListRef } from './components/TableColumnList'
import FormItemList, { FormItemListRef } from './components/FormItemList'
import { Button, Spin } from 'antd'
import { useGlobalAttr } from './components/GlobalAttr'

function GeneratePage() {
  const [configListVisible, setConfigListVisible] = useState(false)
  const { currentConfig, isLoaded } = useConfig()
  const {
    showModal: showGlobalAttr,
    context: globalAttrContext,
    globalAttrs
  } = useGlobalAttr()

  // 当前未选中配置，需要弹出配置列表
  useEffect(() => {
    if (isLoaded && !currentConfig) {
      setConfigListVisible(true)
    }
  }, [isLoaded])

  const tableColuAttrListRef = useRef<TableColumnListRef>(null)
  const formItemListRef = useRef<FormItemListRef>(null)
  // 未加载完成时显示loading
  if (!isLoaded)
    return (
      <div className="w-100vw h-100vh flex flex-center">
        <Spin size="large" />
      </div>
    )

  const blockStyle =
    'mt-10px mx-10px py-10px px-15px rounded-10px border-normal'
  const configListDom = (
    <ConfigList visible={configListVisible} setVisible={setConfigListVisible} />
  )

  if (!currentConfig) {
    return configListDom
  }

  const getTableolumnList = () => {
    return tableColuAttrListRef.current?.getTableColumnList() || []
  }

  const getFormItemConfigList = () => {
    return formItemListRef.current?.getFormItemList() || []
  }

  return (
    <div key={currentConfig.id}>
      {configListDom}
      {globalAttrContext}
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
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="ml-auto mr-10px"
              onClick={() => showGlobalAttr()}
            >
              全局属性
            </Button>
            <GenerateCode
              getTableColumnList={getTableolumnList}
              getFormItemConfigList={getFormItemConfigList}
              globalAttrs={globalAttrs}
            />
          </div>
          <div className="flex items-center color-black">
            <SelectTemplate />
            <FileName />
          </div>
        </div>
        {currentConfig.configType === ConfigType.Table && (
          <TableColumnList blockStyle={blockStyle} ref={tableColuAttrListRef} />
        )}
        {currentConfig.configType === ConfigType.Form && (
          <FormItemList blockStyle={blockStyle} ref={formItemListRef} />
        )}
      </div>
    </div>
  )
}

export default GeneratePage
