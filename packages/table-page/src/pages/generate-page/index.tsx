import { useImmer } from 'use-immer'
import { Button, Flex, Input, Switch, Table } from 'antd'
import SelectTemplate from './components/SelectTemplate/index'
import FileName from './components/FileName/index'
import GenerateCode from './components/GenerateCode/index'
import { nanoid } from 'nanoid'

export interface TableColumnProp {
  id: string
  cname?: string
  name: string
  custom?: boolean
  width?: number
}

function GeneratePage() {
  const createInputRender = (props: keyof TableColumnProp) => {
    return (text: string, record: TableColumnProp, index: number) => {
      return (
        <Input
          value={text}
          allowClear
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
      render(text: string, record: TableColumnProp, index: number) {
        return (
          <Button danger onClick={() => handleDeleteCol(index)}>
            删除
          </Button>
        )
      }
    }
  ]
  const [tableDataList, setTableDataList] = useImmer<TableColumnProp[]>([])

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

  return (
    <div className="m-10px rounded-10px border-1px border-solid border-slate-200">
      <div className="p-20px">
        <div className="text-24px font-bold mb-15px">配置表格页面</div>
        <div className="flex items-center color-black mb-15px">
          <SelectTemplate />
          <FileName />
          <Button className="ml-auto" onClick={handleAddCol}>
            添加表头
          </Button>
          <GenerateCode tableDataList={tableDataList} />
        </div>

        <Table
          rowKey="id"
          dataSource={tableDataList}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default GeneratePage
