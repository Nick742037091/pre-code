import { Button, Modal, message } from 'antd'
import ejs from 'ejs'
import { nativeCommond } from '@/utils/bridge'
import { useAppStore } from '@/stores/app'
import { useConfig } from '@/stores/config'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { TableColumnProp } from '../TableColumnList/index'
import { FormItemConfig } from '../FormItemList/index'
import { useState } from 'react'
import JSONView from 'react-json-view'
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'

function useExportData(
  tableColumnList: TableColumnProp[],
  formItemConfigList: FormItemConfig[],
  globalAttrs: Record<string, any>
) {
  const {
    tableColAttrList,
    formItemMap,
    globalAttrMap: globalAttrItemMap
  } = useConfig()
  const tableColList = tableColumnList.map((tableColumn) => {
    const attrList = tableColAttrList.map((column) => {
      const { attrKey } = column
      const value = tableColumn[attrKey] ?? ''
      // 字符串增加双引号，缺失值为空字符串
      // 其他类型缺省值为null
      const attrValue = [ColumnAttrType.Select, ColumnAttrType.Input].includes(
        column.attrType
      )
        ? `"${value || ''}"`
        : value || null
      return {
        attrKey,
        attrValue
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...attrMap } = tableColumn
    return {
      attrList,
      attrMap: attrMap || {}
    }
  })

  const formItemList = formItemConfigList.map((formItemConfig) => {
    const component = formItemMap[formItemConfig.componentId] || {}
    function createAttrList(key: 'attrList' | 'elementAttrList') {
      return (component?.[key] || []).map((attr) => {
        const value = formItemConfig.attrs[attr.attrKey]
        // 字符串增加双引号，缺失值为空字符串
        // 其他类型缺省值为null
        const attrValue = [
          ColumnAttrType.Select,
          ColumnAttrType.Input
        ].includes(attr.attrType)
          ? `"${value ?? ''}"`
          : value ?? null
        return {
          attrKey: attr.attrKey,
          attrValue
        }
      })
    }

    return {
      type: component.type,
      attrList: createAttrList('attrList'),
      elementAttrList: createAttrList('elementAttrList'),
      attrMap: formItemConfig.attrs || {},
      elementAttrMap: formItemConfig.elementAttrs || {}
    }
  })

  const globalAttrMap: Record<string, any> = {}
  for (const key in globalAttrs) {
    const globalAttrItem = globalAttrItemMap[key] || {}
    const value = globalAttrs[key] ?? ''
    // 字符串增加双引号，缺失值为空字符串
    // 其他类型缺省值为null
    const attrValue = [ColumnAttrType.Select, ColumnAttrType.Input].includes(
      globalAttrItem.attrType
    )
      ? `"${value || ''}"`
      : value || null
    globalAttrMap[key] = attrValue
  }

  const injectData = {
    tableColList,
    formItemList,
    ...globalAttrMap
  }
  return injectData
}

function GenerateCode(props: {
  getTableColumnList: () => TableColumnProp[]
  getFormItemConfigList: () => FormItemConfig[]
  globalAttrs: Record<string, any>
}) {
  const [messageApi, msgContext] = message.useMessage()
  const { fileName, filePath } = useAppStore()
  const { currentTemplate, fileType } = useConfig()
  const exportData = useExportData(
    props.getTableColumnList(),
    props.getFormItemConfigList(),
    props.globalAttrs
  )
  const [exportDateVisible, setExportDateVisible] = useState(false)
  const handleGenerateCode = async () => {
    if (!fileName) {
      messageApi.error('请输入页面名称')
      return
    }
    if (!currentTemplate?.templatePath) {
      messageApi.error('请选择模板')
      return
    }

    const cmdResult = await nativeCommond<{ content: string }>({
      command: 'readFile',
      params: {
        filePath: currentTemplate?.templatePath
      }
    })
    if (!cmdResult) {
      messageApi.error('读取模板失败')
      return
    }

    const code = ejs.render(cmdResult.content, exportData)
    nativeCommond({
      command: 'generateCode',
      params: {
        fileName,
        fileType,
        filePath,
        code
      }
    })
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={() => setExportDateVisible(true)}
        className="mr-10px"
        icon={<EyeOutlined />}
      >
        预览导出数据
      </Button>
      <Button
        type="primary"
        onClick={handleGenerateCode}
        icon={<CheckOutlined />}
      >
        生成代码
      </Button>
      <Modal
        title="预览导出数据"
        open={exportDateVisible}
        footer={null}
        width={800}
        style={{ top: '5vh' }}
        onCancel={() => setExportDateVisible(false)}
      >
        <div className="h-80vh overflow-auto">
          <JSONView src={exportData} displayDataTypes={false} />
        </div>
      </Modal>
      {msgContext}
    </div>
  )
}

export default GenerateCode
