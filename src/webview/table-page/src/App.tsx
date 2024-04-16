import { useImmer } from 'use-immer'
import './App.css'
import { Button, Input, Switch, Table } from 'antd'

interface TableColumnProp {
  cname: string | null
  name: string | null
  custom: boolean | null
  width: number | null
}

function App() {
  const createInputRender = (props: keyof TableColumnProp) => {
    return (text: string, record: TableColumnProp, index: number) => {
      return (
        <Input
          value={text}
          onChange={(e) => onChangeValue(e.target.value, index, props)}
        />
      )
    }
  }

  const createSwitchRender = (props: keyof TableColumnProp) => {
    return (text: boolean, record: TableColumnProp, index: number) => {
      return (
        <Switch
          value={text}
          onChange={(value) => onChangeValue(value, index, props)}
        />
      )
    }
  }

  const columns = [
    {
      title: '中文名称',
      dataIndex: 'cname',
      key: 'cname',
      render: createInputRender('cname')
    },
    {
      title: '英文名称',
      dataIndex: 'name',
      key: 'name',
      render: createInputRender('name')
    },
    {
      title: '宽度',
      dataIndex: 'width',
      key: 'width',
      render: createInputRender('width')
    },
    {
      title: '是否自定义',
      dataIndex: 'custom',
      key: 'custom',
      render: createSwitchRender('custom')
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 80,
      render(text, record, index) {
        return (
          <Button danger onClick={() => handleDeleteCol(index)}>
            删除
          </Button>
        )
      }
    }
  ]
  const [dataSource, setDataSource] = useImmer<TableColumnProp[]>([])

  const onChangeValue = (
    value: string | boolean,
    index: number,
    props: keyof TableColumnProp
  ) => {
    setDataSource((draft) => {
      draft.splice(index, 1, {
        ...draft[index],
        [props]: value
      })
    })
  }
  const handleDeleteCol = (index: number) => {
    setDataSource((draft) => {
      draft.splice(index, 1)
    })
  }
  const handleAddCol = () => {
    setDataSource((draft) => {
      draft.push({
        cname: '',
        name: '',
        custom: false,
        width: null
      })
    })
  }
  const handleGenerateCode = () => {
    window.vscode.postMessage({
      command: 'generateCode',
      text: '🐛  generateCode'
    })
  }
  // FIXME flex属性报错
  return (
    <div p-20px>
      <div flex items-center color-black mb-15px>
        <span text-24px font-bold>
          配置表格页面
        </span>
        <Button ml-auto onClick={handleAddCol}>
          添加表头
        </Button>
        <Button ml-10px type="primary" onClick={handleGenerateCode}>
          生成代码
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  )
}

export default App
