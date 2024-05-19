import { Button, Form, Input, InputNumber, Modal, Select, Switch } from 'antd'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { ReactNode, useState } from 'react'
import { useGlobalAttrList } from './GlobalAttrList'
import { useConfig } from '@/stores/config'
import TextArea from 'antd/es/input/TextArea'
import { useImmer } from 'use-immer'

type FormType = Record<string, any>

export function useGlobalAttr() {
  const { showModal: showGlobalAttrList, context: globalAttrListContext } =
    useGlobalAttrList()
  const { globalAttrList } = useConfig()
  const [form] = Form.useForm<FormType>()
  const [globalAttrs, setGlobalAttrs] = useImmer<FormType>({})
  const [curGlobalAttrs, setCurGlobalAttrs] = useImmer<FormType>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    form.setFieldsValue(globalAttrs)
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setGlobalAttrs(curGlobalAttrs)
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleValuesChange = (_: any, values: Record<string, any>) => {
    setCurGlobalAttrs(values)
  }

  const context = (
    <Modal
      title={
        <div className="flex items-center">
          <span>全局属性</span>
          <Button
            className="ml-20px"
            type="primary"
            onClick={showGlobalAttrList}
          >
            属性列表
          </Button>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={500}
    >
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        className="my-20px"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        {globalAttrList.map((item) => {
          let formElement: ReactNode | null = null
          switch (item.attrType) {
            case ColumnAttrType.Input:
              formElement = <Input className="w-200px" allowClear />
              break
            case ColumnAttrType.Code:
              formElement = <TextArea className="w-200px" rows={3} allowClear />
              break
            case ColumnAttrType.Switch:
              formElement = <Switch className="w-200px"></Switch>
              break
            case ColumnAttrType.Number:
              formElement = <InputNumber className="w-200px"></InputNumber>
              break
            case ColumnAttrType.Select:
              formElement = (
                <Select
                  className="w-200px!"
                  options={item.attrOptions.map((option) => ({
                    label: option,
                    value: option
                  }))}
                />
              )
              break
          }
          return (
            <Form.Item
              key={item.attrKey}
              label={item.attrLabel}
              name={item.attrKey}
            >
              {formElement}
            </Form.Item>
          )
        })}
      </Form>
      {globalAttrListContext}
    </Modal>
  )
  return {
    context,
    showModal,
    globalAttrs
  }
}
