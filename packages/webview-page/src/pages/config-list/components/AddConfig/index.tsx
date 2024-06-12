import { Config, ConfigType, useConfig } from '@/stores/config'
import { Form, Input, Modal, Select, message } from 'antd'
import { nanoid } from 'nanoid'
import { ColumnAttrItem, ColumnAttrType } from 'pre-code/src/types/config'
import { useState } from 'react'

const createDefaultTableAttrs = () => {
  return [
    {
      id: nanoid(),
      attrKey: 'prop',
      attrLabel: '字段',
      attrType: ColumnAttrType.Input,
      attrOptions: []
    },
    {
      id: nanoid(),
      attrKey: 'label',
      attrLabel: '标题',
      attrType: ColumnAttrType.Input,
      attrOptions: []
    }
  ] as ColumnAttrItem[]
}
export const useAddConfig = () => {
  const { addConfig, updateConfig } = useConfig()
  const [messageApi, msgContextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [config, setConfig] = useState<Config | null>(null)
  const [type, setType] = useState<'add' | 'edit'>('add')

  const showModal = (showType: typeof type = 'add', configData?: Config) => {
    setType(showType)
    if (showType === 'add') {
      setConfigName('')
      setConfigType(ConfigType.Table)
    } else {
      setConfig(configData!)
      setConfigName(configData!.configName)
      setConfigType(configData!.configType)
    }
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    if (!configName) {
      messageApi.error('配置名称不能为空')
      return
    }
    setIsModalOpen(false)
    if (type === 'add') {
      addConfig({
        id: nanoid(),
        configName,
        configType,
        templateCode: '',
        defaultTemplateId: '',
        defaultFileType: '.vue',
        tableColAttrList: createDefaultTableAttrs(),
        formItemList: [],
        globalAttrList: []
      })
    } else {
      updateConfig({
        ...config!,
        configName,
        configType
      })
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [configName, setConfigName] = useState('')
  const [configType, setConfigType] = useState<ConfigType>(ConfigType.Table)
  const configTypeOptions = [
    {
      value: ConfigType.Table,
      label: '表格'
    },
    {
      value: ConfigType.Form,
      label: '表单'
    }
  ]
  const context = (
    <Modal
      title={type === 'add' ? '添加配置' : '编辑配置'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form name="configForm" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item<Config>
          label="配置名称"
          rules={[{ required: true, message: '请输入配置名称' }]}
        >
          <Input
            allowClear
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
        </Form.Item>

        <Form.Item<Config>
          label="配置类型"
          rules={[{ required: true, message: '请选择配置类型' }]}
        >
          <Select
            disabled={type === 'edit'}
            options={configTypeOptions}
            value={configType}
            onChange={(val: ConfigType) => setConfigType(val)}
          />
        </Form.Item>
      </Form>
      {msgContextHolder}
    </Modal>
  )
  return {
    showModal,
    context
  }
}
