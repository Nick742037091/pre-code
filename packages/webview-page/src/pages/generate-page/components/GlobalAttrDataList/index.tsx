import { Flex, Form, Input, InputNumber, Select, Switch } from 'antd'
import { ColumnAttrType } from 'pre-code/src/types/config'
import { ReactNode, useState } from 'react'
import { useConfig } from '@/stores/config'
import TextArea from 'antd/es/input/TextArea'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import { CaretDownOutlined } from '@ant-design/icons'

type FormType = Record<string, any>

export function useGlobalAttrDataList(blockStyle: string) {
  const [expand, setExpand] = useState(true)
  const { globalAttrList } = useConfig()
  const [form] = Form.useForm<FormType>()
  const [globalAttrs, setGlobalAttrs] = useImmer<FormType>({})
  const handleValuesChange = (_: any, values: Record<string, any>) => {
    setGlobalAttrs(values)
  }

  const context = globalAttrList.length ? (
    <div className={classNames(blockStyle)}>
      <div className="flex items-center font-bold">
        全局属性
        <CaretDownOutlined
          onClick={() => setExpand(!expand)}
          className="ml-10px text-18px transition-all cursor-pointer"
          css={{
            transform: expand ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </div>
      {expand && (
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          className="mt-20px"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Flex wrap="wrap" gap="small">
            {globalAttrList.map((item) => {
              let formElement: ReactNode | null = null
              switch (item.attrType) {
                case ColumnAttrType.Input:
                  formElement = <Input className="w-100%" allowClear />
                  break
                case ColumnAttrType.Code:
                  formElement = (
                    <TextArea className="w-100%" rows={1} allowClear />
                  )
                  break
                case ColumnAttrType.Switch:
                  formElement = <Switch></Switch>
                  break
                case ColumnAttrType.Number:
                  formElement = <InputNumber className="w-100%"></InputNumber>
                  break
                case ColumnAttrType.Select:
                  formElement = (
                    <Select
                      className="w-100%"
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
                  className="w-32%"
                  key={item.attrKey}
                  label={item.attrLabel}
                  name={item.attrKey}
                >
                  {formElement}
                </Form.Item>
              )
            })}
          </Flex>
        </Form>
      )}
    </div>
  ) : null
  return {
    context,
    globalAttrs
  }
}
