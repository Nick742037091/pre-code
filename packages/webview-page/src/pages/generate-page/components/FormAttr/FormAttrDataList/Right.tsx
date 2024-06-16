import { useConfig } from '@/stores/config'
import { FormItemConfig } from './index'
import { Form, Input, InputNumber, Select, Switch, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { ColumnAttrItem, ColumnAttrType } from 'pre-code/src/types/config'
import { useEffect } from 'react'
const { TextArea } = Input

export type AttrsKey = 'attrs' | 'elementAttrs'

function FormItemAttrList(props: {
  config: FormItemConfig | undefined
  attrList: ColumnAttrItem[]
  attrsKey: AttrsKey
  onUpdateAttrs: (attrs: Record<string, any>, key: AttrsKey) => void
}) {
  const [form] = Form.useForm<Record<string, any>>()
  const handleValuesChange = (_: any, values: Record<string, any>) => {
    props.onUpdateAttrs(values, props.attrsKey)
  }
  // 选择表单项时更新数据
  useEffect(() => {
    if (!props.config) return
    form.setFieldsValue(props.config[props.attrsKey])
  }, [props.config, form, props.attrsKey])
  return (
    <div className="w-350px flex flex-col bg-white">
      <div className="flex-1 overflow-auto px-10px pt-10px">
        <Form form={form} onValuesChange={handleValuesChange}>
          {props.attrList.map((item) => {
            let content = null
            switch (item.attrType) {
              case ColumnAttrType.Input:
                content = <Input allowClear></Input>
                break
              case ColumnAttrType.Code:
                content = <TextArea rows={3} allowClear />
                break
              case ColumnAttrType.Switch:
                content = <Switch></Switch>
                break
              case ColumnAttrType.Number:
                content = <InputNumber></InputNumber>
                break
              case ColumnAttrType.Select:
                content = (
                  <Select
                    options={item.attrOptions.map((item) => ({
                      value: item,
                      label: item
                    }))}
                  ></Select>
                )
                break
            }
            return (
              <Form.Item
                key={item.attrKey}
                label={item.attrLabel}
                name={item.attrKey}
                labelCol={{ span: 8 }}
              >
                {content}
              </Form.Item>
            )
          })}
        </Form>
      </div>
    </div>
  )
}

export default function RightList(props: {
  config: FormItemConfig | undefined
  onUpdateAttrs: (attrs: Record<string, any>, key: AttrsKey) => void
}) {
  const { formItemMap } = useConfig()
  const formItem = formItemMap[props.config?.componentId || '']
  const handleValuesChange = (values: Record<string, any>, key: AttrsKey) => {
    props.onUpdateAttrs(values, key)
  }
  const tabItems: TabsProps['items'] = [
    {
      key: 'formItemAttrList',
      label: <div className="font-bold ">表单项属性</div>,
      children: (
        <FormItemAttrList
          config={props.config}
          attrList={formItem?.attrList || []}
          attrsKey="attrs"
          onUpdateAttrs={handleValuesChange}
        />
      )
    },
    {
      key: 'elementItemAttrList',
      label: <div className="font-bold">表单元素属性</div>,
      children: (
        <FormItemAttrList
          config={props.config}
          attrList={formItem?.elementAttrList || []}
          attrsKey="elementAttrs"
          onUpdateAttrs={handleValuesChange}
        />
      )
    }
  ]
  return (
    <Tabs
      defaultActiveKey="formItemAttrList"
      centered
      items={tabItems}
      className="border-l-1px border-l-solid border-l-slate-200"
    />
  )
}
