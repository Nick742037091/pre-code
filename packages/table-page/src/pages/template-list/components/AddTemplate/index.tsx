import { nativeCommond } from '@/utils/bridge'
import { Button, Form, Input, InputRef, Modal, message } from 'antd'
import { useEffect, useRef, useState } from 'react'

export const useAddTemplate = (props: { updateList: () => void }) => {
  const [messageApi, msgContextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'add' | 'edit'>('add')
  const showModal = (
    showType: typeof type = 'add',
    templateData?: { templateName: string; templatePath: string }
  ) => {
    setType(showType)
    if (showType === 'add') {
      setTemplateName('')
      setTemplatePath('')
    } else {
      setTemplateName(templateData!.templateName)
      setTemplatePath(templateData!.templatePath)
    }
    setIsModalOpen(true)
  }
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        templateNameInput.current?.focus()
      }, 100)
    }
  }, [isModalOpen])

  const handleOk = async () => {
    if (!templateName) {
      messageApi.error('模板名称不能为空')
      return
    }
    if (!templatePath) {
      messageApi.error('请选择模板')
      return
    }

    await nativeCommond({
      command: type === 'add' ? 'addTemplate' : 'editTemplate',
      params: {
        templateName,
        templatePath
      }
    })
    props.updateList()
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [templateName, setTemplateName] = useState('')
  const [templatePath, setTemplatePath] = useState('')
  const handleSelectTemplate = async () => {
    const result = await nativeCommond<{ path: string }>({
      command: 'pickFile'
    })
    setTemplatePath(result.path)
  }

  type FieldType = {
    templateName: string
    templatePath: string
  }

  const templateNameInput = useRef<InputRef>(null)

  const context = (
    <Modal
      title={type === 'add' ? '添加模板' : '编辑模板'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item<FieldType>
          label="模板名称"
          rules={[{ required: true, message: '请输入模板名称' }]}
        >
          <Input
            ref={templateNameInput}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="模板文件"
          rules={[{ required: true, message: '请选择文件' }]}
        >
          <div className="flex flex-col items-start">
            {templatePath && (
              <div className="h-32px line-height-32px mb-10px px-10px">
                {templatePath}
              </div>
            )}
            <Button onClick={handleSelectTemplate}>选择文件</Button>
          </div>
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
