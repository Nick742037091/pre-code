import { Button, message } from 'antd'
import { TableColumnProp } from '../../index'
import handlebars from 'handlebars'
import { nativeCommond } from '@/utils/bridge'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'
import { useConfig } from '@/stores/config'

function GenerateCode(props: { getTableDataList: () => TableColumnProp[] }) {
  const [messageApi, contextHolder] = message.useMessage()
  const { fileName, filePath } = useGenerateCodeStore()
  const { currentTemplate, fileType } = useConfig()
  const handleGenerateCode = async () => {
    if (!fileName) {
      messageApi.error('请输入页面名称')
      return
    }
    if (!currentTemplate?.templatePath) {
      messageApi.error('请选择模板')
      return
    }
    const tableDataList = props.getTableDataList()
    if (!tableDataList.length) {
      messageApi.error('请先添加表头')
      return
    }

    const columnList = tableDataList.map((item, index) => {
      return {
        ...item,
        // 补充字段用于判断首尾
        isFirst: index === 0,
        isLast: tableDataList.length - 1 === index
      }
    })
    const cmdResult = await nativeCommond<{ content: string }>({
      command: 'readFile',
      params: {
        filePath: currentTemplate?.templatePath
      }
    })
    const template = handlebars.compile(cmdResult.content)
    const code = template({ columnList: columnList })
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
