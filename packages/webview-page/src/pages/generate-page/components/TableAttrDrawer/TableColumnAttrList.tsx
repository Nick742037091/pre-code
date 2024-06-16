import { Button, Card, Table, Tag, message } from 'antd'
import { AttrTypeOptionsMap, useAttrModal } from '../AttrModal/index'
import { useConfig } from '@/stores/config'
import { ColumnAttrItem, ColumnAttrType } from 'pre-code/src/types/config'
import SortableTaleContext, {
  createSortableTableProps
} from '@/components/SortableTaleContext'
import { arrayMove } from '@dnd-kit/sortable'

export function TableColumnAttrList() {
  const [messageApi, msgContextHolder] = message.useMessage()
  const {
    tableColAttrList,
    addTableColAttr,
    updateTableColAttr,
    deleteTableColAttr,
    setTableColAttrList
  } = useConfig()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = tableColAttrList.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      addTableColAttr(info)
      return true
    }
  }

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = tableColAttrList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      updateTableColAttr(info)
      return true
    }
  }

  const { context: columnAttrContext, showModal: showColumnAttrModal } =
    useAttrModal({
      onConfirmAdd: handleConfirmAddColAttr,
      onConfirmUpdate: handleConfirmUpdateColAttr
    })

  const handleAddColAttr = () => {
    showColumnAttrModal('add')
  }

  const handleDeleteAttr = (index: number) => {
    deleteTableColAttr(index)
  }
  const columns = [
    {
      title: '排序',
      dataIndex: 'sortable',
      key: 'sortable'
    },
    {
      title: '键值',
      dataIndex: 'attrKey',
      key: 'attrKey'
    },
    {
      title: '标题',
      dataIndex: 'attrLabel',
      key: 'attrLabel'
    },
    {
      title: '类型',
      dataIndex: 'attrType',
      key: 'attrType',
      render(text: ColumnAttrType) {
        return <span>{AttrTypeOptionsMap[text]}</span>
      }
    },
    {
      title: '选项',
      dataIndex: 'attrOptions',
      key: 'attrOptins',
      render(text: string[]) {
        return text.map((item, index) => {
          return (
            <Tag key={index} color="#1677ff" className="m-5px">
              {item}
            </Tag>
          )
        })
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render(text: string, record: ColumnAttrItem, index: number) {
        return (
          <div className="flex items-center">
            <Button
              size="small"
              type="primary"
              onClick={() => showColumnAttrModal('edit', record)}
            >
              编辑
            </Button>
            <Button
              size="small"
              className="m-5px"
              danger
              onClick={() => handleDeleteAttr(index)}
            >
              删除
            </Button>
          </div>
        )
      }
    }
  ]
  return (
    <Card
      title="表格列属性"
      extra={
        <Button type="primary" onClick={handleAddColAttr}>
          添加
        </Button>
      }
    >
      <SortableTaleContext
        list={tableColAttrList}
        rowKey="id"
        onDragEnd={(activeIndex, overIndex) => {
          setTableColAttrList(
            arrayMove(tableColAttrList, activeIndex, overIndex)
          )
        }}
      >
        <Table
          {...createSortableTableProps()}
          rowKey="id"
          dataSource={tableColAttrList}
          columns={columns}
          pagination={false}
        />
      </SortableTaleContext>

      {msgContextHolder}
      {columnAttrContext}
    </Card>
  )
}
