import ConfigList from '../config-list/index'
import GenerateCode from './components/GenerateCode/index'
import { useEffect, useRef, useState } from 'react'
import { EditOutlined, FileTextOutlined, SwapOutlined } from '@ant-design/icons'
import { ConfigType, useConfig } from '@/stores/config'
import { useTableColumnDataList } from './components/TableColumnDataList'
import FormItemList, { FormItemListRef } from './components/FormItemList'
import { Button, Spin } from 'antd'
import EditTemplate from '../edit-template'
import { useGlobalAttrDataList } from './components/GlobalAttrDataList'
import { useTableAttrModal } from './components/TableAttrModal'

function GeneratePage() {
  const [configListVisible, setConfigListVisible] = useState(false)
  const [editTemplateVisible, setEditTemplateVisible] = useState(false)
  const { currentConfig, isLoaded } = useConfig()
  const isTableConfig = currentConfig?.configType === ConfigType.Table
  const isFormConfig = currentConfig?.configType === ConfigType.Form
  const blockStyle =
    'mt-10px mx-10px py-10px px-15px rounded-10px border-normal'

  const { context: globalAttrContext, globalAttrs } =
    useGlobalAttrDataList(blockStyle)
  const { context: tableColumnListContext, tableColAttrDataList } =
    useTableColumnDataList(blockStyle)
  const { showModal: showTableAttr, context: tablaAttrContext } =
    useTableAttrModal()

  const showAttr = () => {
    if (isTableConfig) {
      showTableAttr()
    } else if (isFormConfig) {
    }
  }
  // 当前未选中配置，需要弹出配置列表
  useEffect(() => {
    if (isLoaded && !currentConfig) {
      setConfigListVisible(true)
    }
  }, [isLoaded])

  const formItemListRef = useRef<FormItemListRef>(null)
  // 未加载完成时显示loading
  if (!isLoaded)
    return (
      <div className="w-100vw h-100vh flex flex-center">
        <Spin size="large" />
      </div>
    )

  const configListDom = (
    <ConfigList visible={configListVisible} setVisible={setConfigListVisible} />
  )

  if (!currentConfig) {
    return configListDom
  }

  const getFormItemConfigList = () => {
    return formItemListRef.current?.getFormItemList() || []
  }

  return (
    <div key={currentConfig.id}>
      {configListDom}

      {tablaAttrContext}
      <EditTemplate
        visible={editTemplateVisible}
        onClose={() => setEditTemplateVisible(false)}
      />
      <div className="h-100vh flex flex-col">
        <div className={blockStyle}>
          <div className="text-24px font-bold flex items-center">
            {currentConfig?.configName}
            <SwapOutlined
              className="text-20px ml-20px cursor-pointer"
              onClick={() => {
                setConfigListVisible(true)
              }}
            />
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              className="ml-auto mr-10px"
              onClick={() => setEditTemplateVisible(true)}
            >
              编辑模板
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="mr-10px"
              onClick={() => showAttr()}
            >
              配置属性
            </Button>
            <GenerateCode
              tableColAttrDataList={tableColAttrDataList}
              getFormItemConfigList={getFormItemConfigList}
              globalAttrs={globalAttrs}
            />
          </div>
        </div>
        {globalAttrContext}
        {currentConfig.configType === ConfigType.Table &&
          tableColumnListContext}
        {currentConfig.configType === ConfigType.Form && (
          <FormItemList blockStyle={blockStyle} ref={formItemListRef} />
        )}
      </div>
    </div>
  )
}

export default GeneratePage
