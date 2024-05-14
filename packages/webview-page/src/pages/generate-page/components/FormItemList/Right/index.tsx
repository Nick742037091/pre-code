import { useConfig } from '@/stores/config'
import { FormConfig } from '../index'
import { Form, Input, InputNumber, Select, Switch } from 'antd'
import { ColumnAttrType } from 'pre-code/src/types/config'

export default function RightList(props: { config: FormConfig | undefined }) {
  const [form] = Form.useForm<Record<string, any>>()
  const { formItemList } = useConfig()
  const formItem = formItemList.find(
    (item) => item.id === props.config?.componentId
  )
  const attrList = formItem?.attrList || []
  return (
    <div className="w-350px flex flex-col bg-white border-l-1px border-l-solid border-l-slate-200">
      <div
        className="font-18px text-center font-500 p-10px"
        css={{
          borderBottom: '1px solid #eee'
        }}
      >
        表单项信息
      </div>
      <div className="flex-1 overflow-auto px-10px pt-10px">
        <Form
          form={form}
          onChange={(e) => {
            console.log('onChange', e)
          }}
        >
          {attrList.map((item) => {
            let content = null
            switch (item.attrType) {
              case ColumnAttrType.Input:
                content = <Input></Input>
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
