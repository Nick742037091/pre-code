import { listToMap } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, InputRef, Modal, Select, Tag, message } from 'antd'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { useImmer } from 'use-immer'

export enum ColumnAttrType {
  Input = 0,
  Number,
  Switch,
  Select
}

export type ColumnAttrItem = {
  id: string
  attrKey: string
  attrLabel: string
  attrType: ColumnAttrType
  attrOptions: string[]
}

export const AttrTypeOptions = [
  {
    value: ColumnAttrType.Input,
    label: '输入框'
  },
  {
    value: ColumnAttrType.Number,
    label: '计数器'
  },
  {
    value: ColumnAttrType.Switch,
    label: '开关'
  },
  {
    value: ColumnAttrType.Select,
    label: '选择器'
  }
]

export const AttrTypeOptionsMap = listToMap(AttrTypeOptions, 'value', 'label')

// 对于弹窗而言，通过对外暴露接口用于控制展示/隐藏，有利于控制弹窗状态，
// 但是与此同时，需要在父组件添加ref用于操作弹窗组件，如果弹窗比较多，管理起来就比较麻烦。
//
// 通过hooks的方式封装弹窗，可以直接返回弹窗需要对外暴露的接口，同时暴露元素context用于嵌入父组件。
// 这种模式下，父组件传递给子组件的props通过hook入参传入。
export function useColumnAtrr(props: {
  onConfirmAdd: (item: ColumnAttrItem) => boolean
  onConfirmUpdate: (item: ColumnAttrItem) => boolean
}) {
  const [type, setType] = useState<'add' | 'edit'>('add')
  const [messageApi, msgContextHolder] = message.useMessage()
  const [id, setId] = useState<string>('')
  const [attrKey, setAttrKey] = useState<string>('')
  const [attrLabel, setAttrLabel] = useState<string>('')
  const [attrType, setAttrType] = useState<ColumnAttrType>(ColumnAttrType.Input)

  const [attrOptions, setAttrOptions] = useImmer<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = (
    showType: typeof type = 'add',
    attrData?: ColumnAttrItem
  ) => {
    setType(showType)
    if (showType === 'add') {
      setId('')
      setAttrKey('')
      setAttrLabel('')
      setAttrType(ColumnAttrType.Input)
      setAttrOptions([])
    } else {
      setId(attrData!.id)
      setAttrKey(attrData!.attrKey)
      setAttrLabel(attrData!.attrLabel)
      setAttrType(attrData!.attrType)
      setAttrOptions(attrData!.attrOptions)
    }
    setIsModalOpen(true)
  }
  const handleOk = () => {
    if (attrType === ColumnAttrType.Select && attrOptions.length === 0) {
      messageApi.warning('请至少添加一个选项')
      return
    }
    if (type === 'add') {
      const result = props.onConfirmAdd({
        id: nanoid(),
        attrKey,
        attrLabel,
        attrType,
        attrOptions
      })
      result && setIsModalOpen(false)
    } else {
      const result = props.onConfirmUpdate({
        id,
        attrKey,
        attrLabel,
        attrType,
        attrOptions
      })
      result && setIsModalOpen(false)
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleDeleteOption = (index: number) => {
    setAttrOptions((draft) => {
      draft.splice(index, 1)
    })
  }

  const [optionInputVisible, setOptionInputVisible] = useState(false)
  const optionInputRef = useRef<InputRef>(null)
  const [optionInputValue, setOptionInputValue] = useState('')
  const handleOptionInputConfirm = () => {
    setOptionInputVisible(false)
    if (optionInputValue) {
      setAttrOptions((draft) => {
        draft.push(optionInputValue)
      })
    }
    setOptionInputValue('')
  }
  const handleAddOption = () => {
    setOptionInputVisible(true)
  }

  const context = (
    <Modal
      title={type === 'add' ? '添加属性' : '编辑属性'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form
        name="columnAttrForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item<ColumnAttrItem>
          label="键值"
          rules={[{ required: true, message: '请输入键值' }]}
        >
          <Input
            className="w-200px"
            value={attrKey}
            onChange={(e) => setAttrKey(e.target.value)}
          />
        </Form.Item>
        <Form.Item<ColumnAttrItem>
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input
            className="w-200px"
            value={attrLabel}
            onChange={(e) => setAttrLabel(e.target.value)}
          />
        </Form.Item>
        <Form.Item<ColumnAttrItem>
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select
            className="w-200px!"
            value={attrType}
            options={AttrTypeOptions}
            onChange={setAttrType}
          />
        </Form.Item>

        {attrType === ColumnAttrType.Select && (
          <Form.Item<ColumnAttrItem> label="选项">
            <div className="flex items-center  flex-wrap">
              {attrOptions.map((item, index) => {
                return (
                  <Tag
                    key={index}
                    color="#1677ff"
                    className="m-5px"
                    closeIcon
                    onClose={() => handleDeleteOption(index)}
                  >
                    {item}
                  </Tag>
                )
              })}
              {optionInputVisible ? (
                <Input
                  className="w-150px"
                  ref={optionInputRef}
                  type="text"
                  size="small"
                  value={optionInputValue}
                  onChange={(e) => setOptionInputValue(e.target.value)}
                  onBlur={handleOptionInputConfirm}
                  onPressEnter={handleOptionInputConfirm}
                />
              ) : (
                <Tag icon={<PlusOutlined />} onClick={handleAddOption}></Tag>
              )}
            </div>
          </Form.Item>
        )}
      </Form>
      {msgContextHolder}
    </Modal>
  )
  return {
    context,
    showModal
  }
}
