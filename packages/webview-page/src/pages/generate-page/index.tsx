import ConfigList from '../config-list/index'
import GenerateCode from './components/GenerateCode/index'

import { useEffect, useState } from 'react'
import { EditOutlined, FileTextOutlined, SwapOutlined } from '@ant-design/icons'
import { ConfigType, useConfig } from '@/stores/config'
import { useTableColumnDataList } from './components/TableAttr/TableColumnDataList'
import { useFormAttrDataList } from './components/FormAttr/FormAttrDataList'
import { Button, Spin } from 'antd'
import EditTemplate from '../edit-template'
import { useGlobalAttrDataList } from './components/GlobalAttr/GlobalAttrDataList'
import { useTableAttrDrawer } from './components/TableAttr/TableAttrDrawer'
import { useFormAttrDrawer } from './components/FormAttr/FormAttrDrawer'
import { createExportData } from './components/PreviewData'

function GeneratePage() {
  const [configListVisible, setConfigListVisible] = useState(false)
  const [editTemplateVisible, setEditTemplateVisible] = useState(false)
  const { currentConfig, isLoaded } = useConfig()
  const isTableConfig = currentConfig?.configType === ConfigType.Table
  const isFormConfig = currentConfig?.configType === ConfigType.Form
  const blockStyle =
    'mt-10px mx-10px py-10px px-15px rounded-10px border-normal'

  const { showModal: showTableAttrDrawer, context: tablaAttrDrawerContext } =
    useTableAttrDrawer()
  const { showModal: showFormAttrDrawer, context: formAttrDrawer } =
    useFormAttrDrawer()

  const { context: globalAttrContext, globalAttrs } =
    useGlobalAttrDataList(blockStyle)
  const { context: tableColumnListContext, tableColAttrDataList } =
    useTableColumnDataList(blockStyle)
  const { context: formAttrDataListContext, formAttrDataList } =
    useFormAttrDataList(blockStyle)

  const {
    tableColAttrList,
    formItemMap,
    globalAttrMap: globalAttrItemMap
  } = useConfig()
  const exportData = createExportData(
    tableColAttrDataList,
    formAttrDataList,
    globalAttrs,
    tableColAttrList,
    formItemMap,
    globalAttrItemMap
  )

  const showAttr = () => {
    if (isTableConfig) {
      showTableAttrDrawer()
    } else if (isFormConfig) {
      showFormAttrDrawer()
    }
  }
  // 当前未选中配置，需要弹出配置列表
  useEffect(() => {
    if (isLoaded && !currentConfig) {
      setConfigListVisible(true)
    }
  }, [isLoaded])

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

  return (
    <div key={currentConfig.id}>
      {configListDom}
      {tablaAttrDrawerContext}
      {formAttrDrawer}
      <EditTemplate
        exportData={exportData}
        visible={editTemplateVisible}
        onClose={() => setEditTemplateVisible(false)}
      />
      <div className="h-100vh flex flex-col">
        <div className={blockStyle}>
          <div className="text-24px font-bold flex items-center">
            <div className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              {currentConfig?.configName}
            </div>
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
            <GenerateCode exportData={exportData} />
          </div>
        </div>
        {globalAttrContext}
        {currentConfig.configType === ConfigType.Table &&
          tableColumnListContext}
        {currentConfig.configType === ConfigType.Form &&
          formAttrDataListContext}
      </div>
    </div>
  )
}

export default GeneratePage
