import { Button, Modal, Table, Tag, message } from 'antd'
import { ColumnAttrItem, useColumnAtrr, AttrTypeOptions } from '../ColumnAttr'
import { useConfig } from '@/stores/config'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { listToMap } from '@/utils'

const AttrTypeOptionsMap = listToMap(AttrTypeOptions, 'value', 'label')

function ColumnAttrList(props: {
  visible: boolean
  setVisible: (val: boolean) => void
}) {
  const [messageApi, msgContextHolder] = message.useMessage()
  const {
    tableColumnList,
    addTableColumn,
    updateTableColumn,
    deleteTableColumn
  } = useConfig()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = tableColumnList.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
      return false
    } else {
      addTableColumn(info)
      return true
    }
  }

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = tableColumnList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
      return false
    } else {
      updateTableColumn(info)
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
    deleteTableColumn(index)
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
      <Table
        rowKey="id"
        dataSource={tableColumnList}
        columns={columns}
        pagination={false}
      />
      {msgContextHolder}
      {columnAttrContext}
    </Modal>
  )
}

export default ColumnAttrList
