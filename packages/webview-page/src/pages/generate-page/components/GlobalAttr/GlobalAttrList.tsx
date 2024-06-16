import { Button, Card, Table, Tag, message } from 'antd'
import { useConfig } from '@/stores/config'
import { ColumnAttrItem, ColumnAttrType } from 'pre-code/src/types/config'
import SortableTaleContext, {
  createSortableTableProps
} from '@/components/SortableTaleContext'
import { arrayMove } from '@dnd-kit/sortable'
import { AttrTypeOptionsMap, useAttrModal } from '../AttrModal/index'

export default function GlobalAttrList() {
  const [messageApi, msgContextHolder] = message.useMessage()
  const {
    globalAttrList,
    setGlobalAttrList,
    addGlobalAttr,
    updateGlobalAttr,
    deleteGlobalAttr
  } = useConfig()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = globalAttrList.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      addGlobalAttr(info)
      return true
    }
  }

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = globalAttrList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      updateGlobalAttr(info)
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
    deleteGlobalAttr(index)
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
      title="全局属性"
      extra={
        <Button type="primary" onClick={handleAddColAttr}>
          添加属性
        </Button>
      }
    >
      <SortableTaleContext
        list={globalAttrList}
        rowKey="id"
        onDragEnd={(activeIndex, overIndex) => {
          setGlobalAttrList(arrayMove(globalAttrList, activeIndex, overIndex))
        }}
      >
        <Table
          {...createSortableTableProps()}
          rowKey="id"
          dataSource={globalAttrList}
          columns={columns}
          pagination={false}
        />
      </SortableTaleContext>

      {msgContextHolder}
      {columnAttrContext}
    </Card>
  )
}
