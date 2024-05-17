import { Button, Modal, Table, Tag, message, Form, Input } from 'antd'
import {
  ColumnAttrItem,
  ColumnAttrType,
  FormAttrItem,
  FormItem
} from 'pre-code/src/types/config'
import {
  AttrTypeOptionsMap,
  useColumnAtrr
} from '@/pages/generate-page/components/TableColumnList/ColumnAttr'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { useConfig } from '@/stores/config'
import { nanoid } from 'nanoid'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import { ColumnsType } from 'antd/lib/table'
import SortableTaleContext, {
  sortableTableProps
} from '@/components/SortableTaleContext'

export function useFormItemModal() {
  const [messageApi, msgContextHolder] = message.useMessage()
  const [visible, setVisible] = useState(false)
  const [formItemId, setFormItemId] = useState('')
  const [form] = Form.useForm<{ name: string; type: '' }>()
  const name = Form.useWatch('name', form)
  const type = Form.useWatch('type', form)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const showModal = (
    showType: typeof modalType = 'add',
    formItemData?: FormItem
  ) => {
    if (formItemData) {
      setFormItemId(formItemData.id)
      form.setFieldValue('name', formItemData.name)
      form.setFieldValue('type', formItemData.type)
      setFormAttrList(cloneDeep(formItemData.attrList))
    } else {
      setFormItemId('')
      form.setFieldValue('name', '')
      form.setFieldValue('type', '')
      setFormAttrList([])
    }
    setModalType(showType)
    setVisible(true)
  }
  const [formAttrList, setFormAttrList] = useImmer<FormAttrItem[]>([])
  const configStore = useConfig()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = formAttrList.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      setFormAttrList((draft) => {
        draft.push(info)
      })
      return true
    }
  }

  const columns: ColumnsType<ColumnAttrItem> = [
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

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = formAttrList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.error('该键值已存在')
      return false
    } else {
      setFormAttrList((draft) => {
        const index = draft.findIndex((item) => item.id === info.id)
        draft.splice(index, 1, info)
      })
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
    setFormAttrList((draft) => {
      draft.splice(index, 1)
    })
  }

  const handleOk = () => {
    if (!name) {
      return messageApi.error('请输入表单项名称')
    }
    if (!modalType) {
      return messageApi.error('请输入表单项类型')
    }
    if (modalType === 'edit') {
      configStore.updateFormItem({
        id: formItemId,
        name,
        type,
        attrList: formAttrList
      })
    } else {
      configStore.addFormItem({
        id: nanoid(),
        type,
        name,
        attrList: formAttrList
      })
    }
    setVisible(false)
  }

  const context = (
    <Modal
      title={modalType === 'add' ? '添加表单项' : '编辑表单项'}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      width={900}
    >
      <div>
        <Form form={form}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input className="w-250px" />
          </Form.Item>
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请输入类型' }]}
          >
            <Input className="w-250px" />
          </Form.Item>
        </Form>

        <div className="flex items-center mb-10px">
          <div className="font-bold text-15px">属性列表</div>
          <Button type="primary" className="ml-20px" onClick={handleAddColAttr}>
            添加属性
          </Button>
        </div>
        <SortableTaleContext
          list={formAttrList}
          rowKey="id"
          onDragEnd={(activeIndex, overIndex) => {
            setFormAttrList((draft) => {
              return arrayMove(draft, activeIndex, overIndex)
            })
          }}
        >
          <Table
            {...sortableTableProps}
            rowKey="id"
            dataSource={formAttrList}
            columns={columns}
            pagination={false}
          />
        </SortableTaleContext>
      </div>
      {msgContextHolder}
      {columnAttrContext}
    </Modal>
  )
  return {
    context,
    showModal
  }
}
