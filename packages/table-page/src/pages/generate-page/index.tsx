import { useImmer } from 'use-immer'
import { Button, Input, Select, Switch, Table } from 'antd'
import SelectTemplate from './components/SelectTemplate/index'
import FileName from './components/FileName/index'
import GenerateCode from './components/GenerateCode/index'
import { nanoid } from 'nanoid'
import classnames from 'classnames'
import {
  ColumnAttrItem,
  ColumnAttrType,
  useColumnAtrr
} from './components/ColumnAttr'
import { ColumnsType } from 'antd/es/table'
import { ColumnType } from 'antd/lib/table'
import { useState } from 'react'
import ColumnAttrList from './components/ColumnAttrList'

export interface TableColumnProp {
  id: string
  title?: string
  label: string
  prop: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any
}

function GeneratePage() {
  const createInputRender = (prop: keyof TableColumnProp) => {
    return (text: string, record: TableColumnProp, index: number) => {
      return (
        <Input
          value={text}
          allowClear
          onChange={(e) => onChangeValue(e.target.value, index, prop)}
        />
      )
    }
  }

  const createSwitchRender = (prop: keyof TableColumnProp) => {
    return (text: boolean, record: TableColumnProp, index: number) => {
      return (
        <Switch
          value={text}
          onChange={(value) => onChangeValue(value, index, prop)}
        />
      )
    }
  }

  const createSelectRender = (
    prop: keyof TableColumnProp,
    options: string[]
  ) => {
    return (text: string, record: TableColumnProp, index: number) => {
      return (
        <Select
          className="min-w-100px!"
          options={options.map((item) => ({ label: item, value: item }))}
          value={text}
          onChange={(value) => onChangeValue(value, index, prop)}
        />
      )
    }
  }

  const [customColumnAttrs, setCustomColumnAttrs] = useImmer<ColumnAttrItem[]>(
    []
  )
  // TODO customColumnAttrs更新后进行持久化保存

  const customColumns = customColumnAttrs.map((item) => {
    let render: ColumnType<TableColumnProp>['render'] | undefined = undefined
    switch (item.attrType) {
      case ColumnAttrType.Input:
        render = createInputRender(item.attrKey)
        break
      case ColumnAttrType.Switch:
        render = createSwitchRender(item.attrKey)
        break
      case ColumnAttrType.Select:
        render = createSelectRender(item.attrKey, item.attrOptions)
        break
    }
    return {
      title: item.attrLabel,
      dataIndex: item.attrKey,
      key: item.attrKey,
      render
    }
  })

  const defaultColumns: ColumnsType<TableColumnProp> = [
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
    }
  ]

  const columnOperation: ColumnType<TableColumnProp> = {
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
  const columns = [...defaultColumns, ...customColumns, columnOperation]

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

  const handleAddColumAttr = (info: ColumnAttrItem) => {
    setCustomColumnAttrs((draft) => {
      draft.push(info)
    })
  }
  const handleUpdateColumAttr = (info: ColumnAttrItem) => {
    setCustomColumnAttrs((draft) => {
      const index = draft.findIndex((item) => item.id === info.id)
      draft.splice(index, 1, info)
    })
  }
  const handleDeleteAttr = (index: number) => {
    setCustomColumnAttrs((draft) => {
      draft.splice(index)
    })
  }

  const [columnAttrListVisible, setColumnAttrListVisible] = useState(false)

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

  const handleDeleteCol = (index: number) => {
    setTableDataList((draft) => {
      draft.splice(index, 1)
    })
  }

  const blockStyle =
    'm-10px p-20px rounded-10px border-1px border-solid border-slate-200'
  return (
    <div key="columnAttr">
      <ColumnAttrList
        list={customColumnAttrs}
        deleteColumnAtrr={handleDeleteAttr}
        visible={columnAttrListVisible}
        setVisible={(val: boolean) => setColumnAttrListVisible(val)}
        addColumAttr={handleAddColumAttr}
        updateColumAttr={handleUpdateColumAttr}
      />
      <div className={blockStyle}>
        <div className="text-24px font-bold mb-15px">配置表格页面</div>
        <div className="flex items-center color-black">
          <SelectTemplate />
          <FileName />
          <GenerateCode tableDataList={tableDataList} />
        </div>
      </div>
      <div className={classnames(blockStyle)}>
        <div className="flex items-center mb-10px">
          表格列
          <Button
            className="ml-auto"
            type="primary"
            onClick={() => setColumnAttrListVisible(true)}
          >
            属性列表
          </Button>
          <Button className="ml-10px" type="primary" onClick={handleAddCol}>
            添加列
          </Button>
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
