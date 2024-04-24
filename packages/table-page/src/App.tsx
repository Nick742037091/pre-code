import { useImmer } from 'use-immer'
import './App.css'
import { Button, Input, Switch, Table } from 'antd'
import SelectTemplate from './components/SelectTemplate/index'
import GenerateCode from './components/GenerateCode'
import { nanoid } from 'nanoid'

export interface TableColumnProp {
  id: string
  cname?: string
  name: string
  custom?: boolean
  width?: number
}

function App() {
  const [template, setTemplate] = useImmer(
    '/Users/nick/Documents/project/hand-wirte/templates/table.hbs'
  )
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
  const [tableDataList, setTableDataList] = useImmer<TableColumnProp[]>([
    {
      id: nanoid(),
      cname: '名称',
      name: 'name',
      custom: false
    }
  ])

  const onChangeValue = (
    value: string | boolean,
    index: number,
    props: keyof TableColumnProp
  ) => {
    setTableDataList((draft) => {
      draft.splice(index, 1, {
        ...draft[index],
        [props]: value
      })
    })
  }
  const handleDeleteCol = (index: number) => {
    setTableDataList((draft) => {
      draft.splice(index, 1)
    })
  }
  const handleAddCol = () => {
    setTableDataList((draft) => {
      draft.push({
        id: nanoid(),
        cname: '',
        name: '',
        custom: false,
        width: undefined
      })
    })
  }

  const [fileName, setFileName] = useImmer('')

  return (
    <div className="p-20px">
      <SelectTemplate onChangeTemplate={(val) => setTemplate(val)} />
      <div className="flex items-center mb-10px">
        <div className="text-18px flex-shrink-0 mr-10px">页面名称</div>
        <div w-300px>
          <Input
            addonAfter=".vue"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center color-black mb-15px">
        <span className="text-24px font-bold">配置表格页面</span>
        <Button className="ml-auto" onClick={handleAddCol}>
          添加表头
        </Button>
        <GenerateCode
          fileName={fileName}
          tableDataList={tableDataList}
          template={template}
        />
      </div>
      <Table
        rowKey="id"
        dataSource={tableDataList}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}

export default App
