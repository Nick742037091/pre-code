import { Button, Modal, Table, Tag, message } from 'antd'
import { useConfig } from '@/stores/config'
import { ColumnAttrItem, ColumnAttrType } from 'pre-code/src/types/config'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { cloneDeep } from 'lodash'
import SortableTaleContext, {
  createSortableTableProps
} from '@/components/SortableTaleContext'
import { arrayMove } from '@dnd-kit/sortable'
import {
  AttrTypeOptionsMap,
  useColumnAttr
} from '../TableColumnList/ColumnAttr'

export function useGlobalAttrList() {
  const [messageApi, msgContextHolder] = message.useMessage()
  const [curGlobalAttrList, setCurGlobalAttrList] = useImmer<ColumnAttrItem[]>(
    []
  )
  const { globalAttrList, setGlobalAttrList } = useConfig()
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
    setCurGlobalAttrList(cloneDeep(globalAttrList))
  }

  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = curGlobalAttrList.some(
      (item) => item.attrKey === info.attrKey
    )
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      setCurGlobalAttrList((draft) => {
        draft.push(info)
      })
      return true
    }
  }

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = curGlobalAttrList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      setCurGlobalAttrList((draft) => {
        const index = draft.findIndex((item) => item.id === info.id)
        draft.splice(index, 1, info)
      })
      return true
    }
  }

  const { context: columnAttrContext, showModal: showColumnAttrModal } =
    useColumnAttr({
      onConfirmAdd: handleConfirmAddColAttr,
      onConfirmUpdate: handleConfirmUpdateColAttr
    })

  const handleAddColAttr = () => {
    showColumnAttrModal('add')
  }

  const handleDeleteAttr = (index: number) => {
    setCurGlobalAttrList((draft) => {
      draft.splice(index, 1)
    })
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
  const context = (
    <Modal
      title={
        <div className="flex items-center">
          <span>全局属性列表</span>
          <Button className="ml-20px" type="primary" onClick={handleAddColAttr}>
            添加属性
          </Button>
        </div>
      }
      open={visible}
      onOk={() => {
        setGlobalAttrList(curGlobalAttrList)
        setVisible(false)
      }}
      onCancel={() => setVisible(false)}
      width={900}
    >
      <SortableTaleContext
        list={curGlobalAttrList}
        rowKey="id"
        onDragEnd={(activeIndex, overIndex) => {
          setCurGlobalAttrList((draft) => {
            return arrayMove(draft, activeIndex, overIndex)
          })
        }}
      >
        <Table
          {...createSortableTableProps()}
          rowKey="id"
          dataSource={curGlobalAttrList}
          columns={columns}
          pagination={false}
        />
      </SortableTaleContext>

      {msgContextHolder}
      {columnAttrContext}
    </Modal>
  )
  return {
    context,
    showModal
  }
}
