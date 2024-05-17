import { Button, message } from 'antd'
import ejs from 'ejs'
import { nativeCommond } from '@/utils/bridge'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'
import { useConfig } from '@/stores/config'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { TableColumnProp } from '../TableColumnList/index'
import { FormItemConfig } from '../FormItemList/index'

function GenerateCode(props: {
  getTableColumnList: () => TableColumnProp[]
  getFormItemConfigList: () => FormItemConfig[]
}) {
  const [messageApi, contextHolder] = message.useMessage()
  const { fileName, filePath } = useGenerateCodeStore()
  const { currentTemplate, tableColAttrList, fileType, formItemMap } =
    useConfig()
  const handleGenerateCode = async () => {
    if (!fileName) {
      messageApi.error('请输入页面名称')
      return
    }
    if (!currentTemplate?.templatePath) {
      messageApi.error('请选择模板')
      return
    }
    const tableColList = props.getTableColumnList().map((tableColumn) => {
      return tableColAttrList.map((column) => {
        const value = tableColumn[column.attrKey] ?? ''
        // 字符串增加双引号
        const attrValue =
          column.attrType === ColumnAttrType.Input ? `"${value}"` : value
        return {
          ...column,
          attrValue
        }
      })
    })

    const formItemList = props.getFormItemConfigList().map((formItemConfig) => {
      const component = formItemMap[formItemConfig.componentId]
      const attrList = (component?.attrList || []).map((attr) => {
        const value = formItemConfig.attrs[attr.attrKey]
        // 字符串增加双引号
        const attrValue =
          attr.attrType === ColumnAttrType.Input ? `"${value}"` : value
        return {
          ...attr,
          attrValue
        }
      })
      return {
        ...component,
        attrMap: formItemConfig.attrs,
        attrList
      }
    })

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
    console.log('tableColList', tableColList)
    console.log('formItemList', formItemList)
    const code = ejs.render(cmdResult.content, {
      tableColList,
      formItemList
    })
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
      {contextHolder}
      <Button type="primary" onClick={handleGenerateCode}>
        生成代码
      </Button>
    </div>
  )
}

export default GenerateCode
