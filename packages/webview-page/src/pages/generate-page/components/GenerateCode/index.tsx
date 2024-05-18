import { Button, Modal, message } from 'antd'
import ejs from 'ejs'
import { nativeCommond } from '@/utils/bridge'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'
import { useConfig } from '@/stores/config'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { TableColumnProp } from '../TableColumnList/index'
import { FormItemConfig } from '../FormItemList/index'
import { useState } from 'react'
import JSONView from 'react-json-view'

function useExportData(
  tableColumnList: TableColumnProp[],
  formItemConfigList: FormItemConfig[]
) {
  const { tableColAttrList, formItemMap } = useConfig()
  const tableColList = tableColumnList.map((tableColumn) => {
    const attrList = tableColAttrList.map((column) => {
      const { attrKey, attrType, attrLabel } = column
      const value = tableColumn[attrKey] ?? ''
      // 字符串增加双引号，缺失值为空字符串
      // 其他类型缺省值为null
      const attrValue =
        column.attrType === ColumnAttrType.Input
          ? `"${value || ''}"`
          : value || null
      return {
        attrKey,
        attrValue,
        attrLabel,
        attrType
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
        const attrValue =
          attr.attrType === ColumnAttrType.Input
            ? `"${value ?? ''}"`
            : value ?? null
        return {
          attrKey: attr.attrKey,
          attrValue,
          attrLabel: attr.attrLabel,
          attrType: attr.attrType
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
  const injectData = {
    tableColList,
    formItemList
  }
  return injectData
}

function GenerateCode(props: {
  getTableColumnList: () => TableColumnProp[]
  getFormItemConfigList: () => FormItemConfig[]
}) {
  const [messageApi, msgContext] = message.useMessage()
  const { fileName, filePath } = useGenerateCodeStore()
  const { currentTemplate, fileType } = useConfig()
  const exportData = useExportData(
    props.getTableColumnList(),
    props.getFormItemConfigList()
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
    <div className="ml-auto">
      <Button onClick={() => setExportDateVisible(true)} className="mr-10px">
        预览导出数据
      </Button>
      <Button type="primary" onClick={handleGenerateCode}>
        生成代码
      </Button>
      <Modal
        title="预览导出数据"
        open={exportDateVisible}
        footer={null}
        width={800}
        onCancel={() => setExportDateVisible(false)}
      >
        <JSONView src={exportData} displayDataTypes={false} />
      </Modal>
      {msgContext}
    </div>
  )
}

export default GenerateCode
