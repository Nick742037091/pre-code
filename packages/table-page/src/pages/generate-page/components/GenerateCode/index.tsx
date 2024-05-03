import { Button, message } from 'antd'
import { TableColumnProp } from '../../index'
import handlebars from 'handlebars'
import { nativeCommond } from '@/utils/bridge'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'

function GenerateCode(props: { tableDataList: TableColumnProp[] }) {
  const [messageApi, contextHolder] = message.useMessage()
  const store = useGenerateCodeStore()
  const handleGenerateCode = async () => {
    if (!store.fileName) {
      messageApi.error('请输入页面名称')
      return
    }
    if (!store.templatePath) {
      messageApi.error('请选择模板')
      return
    }
    if (!props.tableDataList.length) {
      messageApi.error('请先添加表头')
      return
    }

    const columnList = props.tableDataList.map((item, index) => {
      return {
        ...item,
        // 补充字段用于判断首尾
        isFirst: index === 0,
        isLast: props.tableDataList.length - 1 === index
      }
    })
    const cmdResult = await nativeCommond<{ content: string }>({
      command: 'readFile',
      params: {
        filePath: store.templatePath
      }
    })
    const template = handlebars.compile(cmdResult.content)
    const code = template({ columnList: columnList })
    nativeCommond({
      command: 'generateCode',
      params: {
        fileName: store.fileName,
        fileType: store.fileType,
        filePath: store.filePath,
        code
      }
    })
  }
  return (
    <div className="ml-10px">
      {contextHolder}
      <Button type="primary" onClick={handleGenerateCode}>
        生成代码
      </Button>
    </div>
  )
}

export default GenerateCode
