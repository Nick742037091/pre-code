import { useImmer } from 'use-immer'
import { Button, Input, Switch, Table } from 'antd'
import SelectTemplate from './components/SelectTemplate/index'
import FileName from './components/FileName/index'
import GenerateCode from './components/GenerateCode/index'
import { nanoid } from 'nanoid'
import classnames from 'classnames'

export interface TableColumnProp {
  id: string
  label?: string
  prop: string
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
      title: '列名称',
      dataIndex: 'prop',
      key: 'prop',
      render: createInputRender('prop')
    },
    {
      title: '列标题',
      dataIndex: 'label',
      key: 'label',
      render: createInputRender('label')
    },
    {
      title: '列宽度',
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
        label: '',
        prop: '',
        custom: false,
        width: undefined
      })
    })
  }

  const blockStyle =
    'm-10px p-20px rounded-10px border-1px border-solid border-slate-200'
  return (
    <div>
      <div className={blockStyle}>
        <div className="text-24px font-bold mb-15px">配置页面</div>
        <div className="flex items-center color-black">
          <SelectTemplate />
          <FileName />
          <Button className="ml-auto" onClick={handleAddCol}>
            添加列
          </Button>
          <GenerateCode tableDataList={tableDataList} />
        </div>
      </div>
      <div className={classnames(blockStyle)}>
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
