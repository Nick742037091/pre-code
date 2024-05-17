import { useConfig } from '@/stores/config'
import { FormItemConfig } from '../index'
import { Form, Input, InputNumber, Select, Switch } from 'antd'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { useEffect } from 'react'
const { TextArea } = Input

export default function RightList(props: {
  config: FormItemConfig | undefined
  onUpdateAttrs: (attrs: Record<string, any>) => void
}) {
  const [form] = Form.useForm<Record<string, any>>()
  const { formItemMap } = useConfig()
  const formItem = formItemMap[props.config?.componentId || '']
  const attrList = formItem?.attrList || []
  // 选择表单项时更新数据
  useEffect(() => {
    if (!props.config) return
    form.setFieldsValue(props.config.attrs)
  }, [props.config, form])
  const handleValuesChange = (_: any, values: Record<string, any>) => {
    props.onUpdateAttrs(values)
  }
  return (
    <div className="w-350px flex flex-col bg-white border-l-1px border-l-solid border-l-slate-200">
      <div
        className="font-18px text-center font-500 p-10px"
        css={{
          borderBottom: '1px solid #eee'
        }}
      >
        表单项属性
      </div>
      <div className="flex-1 overflow-auto px-10px pt-10px">
        <Form form={form} onValuesChange={handleValuesChange}>
          {attrList.map((item) => {
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
