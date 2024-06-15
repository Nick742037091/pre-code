import classNames from 'classnames'
import { Button, Input, InputNumber, Select, Switch, Table } from 'antd'
import { useImmer } from 'use-immer'
import { nanoid } from 'nanoid'
import { ColumnType } from 'antd/lib/table'
import { useConfig } from '@/stores/config'
import SortableTaleContext, {
  createSortableTableProps
} from '@/components/SortableTaleContext'
import { arrayMove } from '@dnd-kit/sortable'
import { ColumnAttrType } from 'pre-code/src/types/config'
const { TextArea } = Input

export interface TableColumnProp {
  id: string
  [prop: string]: any
}

export function useTableColumnDataList(blockStyle: string) {
  const { tableColAttrList } = useConfig()

  const [tableColAttrDataList, setTableColAttrDataList] = useImmer<
    TableColumnProp[]
  >([])

  const columnMinWidth = 120
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

  const createTextAreaRender = (prop: keyof TableColumnProp) => {
    return (text: string, record: TableColumnProp, index: number) => {
      return (
        <TextArea
          value={text}
          rows={1}
          allowClear
          onChange={(e) => onChangeValue(e.target.value, index, prop)}
        />
      )
    }
  }
  const createNumberRender = (prop: keyof TableColumnProp) => {
    return (text: number, record: TableColumnProp, index: number) => {
      return (
        <InputNumber
          css={{ width: '95% !important' }}
          value={text}
          onChange={(value) => onChangeValue(value || '', index, prop)}
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
          css={{ width: '95% !important' }}
          options={options.map((item) => ({ label: item, value: item }))}
          value={text}
          onChange={(value) => onChangeValue(value, index, prop)}
        />
      )
    }
  }

  const customColumns = tableColAttrList.map((item) => {
    let render: ColumnType<TableColumnProp>['render'] | undefined = undefined
    switch (item.attrType) {
      case ColumnAttrType.Input:
        render = createInputRender(item.attrKey)
        break
      case ColumnAttrType.Code:
        render = createTextAreaRender(item.attrKey)
        break
      case ColumnAttrType.Number:
        render = createNumberRender(item.attrKey)
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
      render,
      width: columnMinWidth
    }
  })

  const columnOperation: ColumnType<TableColumnProp> = {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 80,
    fixed: 'right',
    render(text: string, record: TableColumnProp, index: number) {
      return (
        <Button danger onClick={() => handleDeleteCol(index)}>
          删除
        </Button>
      )
    }
  }
  const columns = [
    {
      title: '排序',
      dataIndex: 'sortable',
      key: 'sortable',
      width: 40
    },
    ...customColumns,
    columnOperation
  ]

  const onChangeValue = (
    value: string | boolean | number | undefined,
    index: number,
    props: keyof TableColumnProp
  ) => {
    setTableColAttrDataList((draft) => {
      draft.splice(index, 1, {
        ...draft[index],
        [props]: value
      })
    })
  }

  const handleAddCol = () => {
    setTableColAttrDataList((draft) => {
      draft.push({
        id: nanoid()
      })
    })
  }

  const handleDeleteCol = (index: number) => {
    setTableColAttrDataList((draft) => {
      draft.splice(index, 1)
    })
  }

  const context = (
    <>
      <div className={classNames(blockStyle)}>
        <div className="flex items-center mb-10px">
          <div className="font-bold">表格列</div>
          <Button className="ml-auto" type="primary" onClick={handleAddCol}>
            添加列
          </Button>
        </div>
        <SortableTaleContext
          list={tableColAttrDataList}
          rowKey="id"
          onDragEnd={(activeIndex, overIndex) => {
            setTableColAttrDataList((draft) => {
              return arrayMove(draft, activeIndex, overIndex)
            })
          }}
        >
          <Table
            {...createSortableTableProps()}
            scroll={{ x: 500 }}
            rowKey="id"
            dataSource={tableColAttrDataList}
            columns={columns}
            pagination={false}
          />
        </SortableTaleContext>
      </div>
    </>
  )

  return {
    tableColAttrDataList,
    context
  }
}
