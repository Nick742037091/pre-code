import { Button, Card, Table } from 'antd'
import { useConfig } from '@/stores/config'
import { FormItem } from 'pre-code/src/types/config'
import SortableTaleContext, {
  createSortableTableProps
} from '@/components/SortableTaleContext'
import { arrayMove } from '@dnd-kit/sortable'
import { useComponentModal } from './ComponentModal'

export function FormAttrList() {
  const { showModal: showFormItemModal, context: formItemModalContext } =
    useComponentModal()
  const { formItemList, deleteFormItem, setFormItemList } = useConfig()

  const handleAddColAttr = () => {
    showFormItemModal('add')
  }

  const handleDeleteAttr = (index: number) => {
    deleteFormItem(index)
  }
  const columns = [
    {
      title: '排序',
      dataIndex: 'sortable',
      key: 'sortable'
    },
    {
      title: '组件标题',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '组件类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render(text: string, record: FormItem, index: number) {
        return (
          <div className="flex items-center">
            <Button
              size="small"
              type="primary"
              onClick={() => showFormItemModal('edit', record)}
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
      title="表单组件"
      extra={
        <Button type="primary" onClick={handleAddColAttr}>
          添加
        </Button>
      }
    >
      <SortableTaleContext
        list={formItemList}
        rowKey="id"
        onDragEnd={(activeIndex, overIndex) => {
          setFormItemList(arrayMove(formItemList, activeIndex, overIndex))
        }}
      >
        <Table
          {...createSortableTableProps()}
          rowKey="id"
          dataSource={formItemList}
          columns={columns}
          pagination={false}
        />
      </SortableTaleContext>

      {formItemModalContext}
    </Card>
  )
}
