import { Button, Modal, Table, message } from 'antd'
import { ColumnAttrItem, useColumnAtrr } from '../ColumnAttr'

function ColumnAttrList(props: {
  list: ColumnAttrItem[]
  visible: boolean
  setVisible: (val: boolean) => void
  addColumAttr: (item: ColumnAttrItem) => void
  updateColumAttr: (item: ColumnAttrItem) => void
  deleteColumnAtrr: (index: number) => void
}) {
  const [messageApi, msgContextHolder] = message.useMessage()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = props.list.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
      return false
    } else {
      props.addColumAttr(info)
      return true
    }
  }

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = props.list
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
      return false
    } else {
      props.updateColumAttr(info)
      return true
    }
  }

  const { context: columnAttrContext, showModal: showColumnAttrModal } =
    useColumnAtrr({
      onConfirmAdd: handleConfirmAddColAttr,
      onConfirmUpdate: handleConfirmUpdateColAttr
    })

  const handleAddColAttr = () => {
    showColumnAttrModal('add')
  }

  const handleDeleteAttr = (index: number) => {
    props.deleteColumnAtrr(index)
  }
  const columns = [
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
      key: 'attrLabel'
    },
    {
      title: '选项',
      dataIndex: 'attrOptions',
      key: 'attrLabel'
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
    <Modal
      title={
        <div className="flex items-center">
          <span>属性列表</span>
          <Button className="ml-20px" type="primary" onClick={handleAddColAttr}>
            添加属性
          </Button>
        </div>
      }
      open={props.visible}
      onCancel={() => props.setVisible(false)}
      footer={() => null}
      width={900}
    >
      <Table dataSource={props.list} columns={columns} pagination={false} />
      {msgContextHolder}
      {columnAttrContext}
    </Modal>
  )
}

export default ColumnAttrList
