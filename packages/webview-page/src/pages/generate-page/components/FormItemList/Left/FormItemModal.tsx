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

export function useFormItemModal() {
  const [messageApi, msgContextHolder] = message.useMessage()
  const [visible, setVisible] = useState(false)
  const [formItemId, setFormItemId] = useState('')
  const [form] = Form.useForm<FormItem>()
  const formName = Form.useWatch('formName', form)
  const [type, setType] = useState<'add' | 'edit'>('add')
  const showModal = (
    showType: typeof type = 'add',
    formItemData?: FormItem
  ) => {
    if (formItemData) {
      setFormItemId(formItemData.id)
      form.setFieldValue('formName', formItemData.formName)
      setFormAttrList(cloneDeep(formItemData.attrList))
    } else {
      setFormItemId('')
      form.setFieldValue('formName', '')
      setFormAttrList([])
    }
    setType(showType)
    setVisible(true)
  }
  const [formAttrList, setFormAttrList] = useImmer<FormAttrItem[]>([])
  const configStore = useConfig()
  const handleConfirmAddColAttr = (info: ColumnAttrItem) => {
    const exist = formAttrList.some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
      return false
    } else {
      setFormAttrList((draft) => {
        draft.push(info)
      })
      return true
    }
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

  const handleConfirmUpdateColAttr = (info: ColumnAttrItem) => {
    const exist = formAttrList
      .filter((item) => item.id !== info.id)
      .some((item) => item.attrKey === info.attrKey)
    if (exist) {
      messageApi.warning('该键值已存在')
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
    if (type === 'edit') {
      configStore.updateFormItem({
        formName: formName,
        attrList: formAttrList,
        id: formItemId
      })
    } else {
      configStore.addFormItem({
        id: nanoid(),
        formName: formName,
        attrList: formAttrList
      })
    }
    setVisible(false)
  }

  const context = (
    <Modal
      title={type === 'add' ? '添加表单项' : '编辑表单项'}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      width={900}
    >
      <div>
        <Form form={form}>
          <Form.Item
            label="名称"
            name="formName"
            rules={[{ required: true, message: '请输入名称' }]}
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
        <Table
          rowKey="id"
          dataSource={formAttrList}
          columns={columns}
          pagination={false}
        />
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
