import { Button, message } from 'antd'
import { TableColumnProp } from '../../App'
import handlebars from 'handlebars'

function GenerateCode(props: {
  fileName: string
  tableDataList: TableColumnProp[]
  template: string
}) {
  const [messageApi, contextHolder] = message.useMessage()
  const handleGenerateCode = () => {
    if (!props.fileName) {
      messageApi.error('请输入页面名称')
      return
    }
    if (!props.template) {
      messageApi.error('请选择模板')
      return
    }
    if (!props.tableDataList.length) {
      messageApi.error('请先添加表头')
      return
    }

    const columnList = props.tableDataList.map((item, index) => {
      return {
        prop: item.name,
        label: item.cname,
        custom: item.custom,
        isEnd: props.tableDataList.length - 1 === index
      }
    })
    const template = handlebars.compile(props.template)
    const code = template({ columnList: columnList })
    debugger
    window.vscode.postMessage({
      command: 'generateCode',
      fileName: props.fileName,
      code
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
