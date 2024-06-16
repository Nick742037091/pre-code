import { Drawer } from 'antd'
import {
  ColumnAttrItem,
  ColumnAttrType,
  FormItem
} from 'pre-code/src/types/config'
import { TableColumnProp } from '../TableAttr/TableColumnDataList'
import { FormItemConfig } from '../FormAttr/FormAttrDataList/index'
import { useState } from 'react'
import JSONView from 'react-json-view'

export function createExportData(
  tableColumnList: TableColumnProp[],
  formItemConfigList: FormItemConfig[],
  globalAttrs: Record<string, any>,
  tableColAttrList: ColumnAttrItem[],
  formItemMap: Record<string, FormItem>,
  globalAttrItemMap: Record<string, ColumnAttrItem>
) {
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

export type ExportData = ReturnType<typeof createExportData>

export const usePreviewData = (props: {
  exportData: ExportData
  width?: string
  mask?: boolean
}) => {
  const [visible, setVisible] = useState(false)
  const showModal = () => {
    setVisible(true)
  }
  const context = (
    <Drawer
      title="预览导出数据"
      open={visible}
      width={props.width ?? '95vw'}
      mask={props.mask ?? true}
      onClose={() => setVisible(false)}
    >
      <div className="h-80vh overflow-auto">
        <JSONView src={props.exportData} displayDataTypes={false} />
      </div>
    </Drawer>
  )
  return {
    context,
    showModal
  }
}
