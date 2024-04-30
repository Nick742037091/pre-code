import { Button, Form, Input, Modal, message } from 'antd'
import { nanoid } from 'nanoid'
import { useState } from 'react'

export const useAddTemplate = () => {
  const [messageApi, msgContextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (!templateName) {
      messageApi.error('模板名称不能为空')
      return
    }
    if (!templatePath) {
      messageApi.error('请选择模板')
      return
    }

    const commandId = nanoid()
    window.vscode.postMessage({
      command: 'addTemplate',
      commandId: commandId,
      templateName,
      templatePath
    })
    // TODO 封装成桥接函数，传入回调，自动完成添加注册和取消注册
    window.addEventListener('message', (event) => {
      const message = event.data
      if (message.command !== 'callbackResult') return
      if (message.commandId !== commandId) return
      setIsModalOpen(false)
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [templateName, setTemplateName] = useState('')

  const [templatePath, setTemplatePath] = useState('')
  const handleSelectTemplate = () => {
    const commandId = nanoid()
    window.vscode.postMessage({
      command: 'pickFile',
      commandId: commandId
    })
    // TODO 封装成桥接函数，传入回调，自动完成添加注册和取消注册
    window.addEventListener('message', (event) => {
      const message = event.data
      if (message.command !== 'callbackResult') return
      if (message.commandId !== commandId) return
      setTemplatePath(message.path)
    })
  }

  type FieldType = {
    templateName: string
    templatePath: string
  }

  const context = (
    <Modal
      title="添加模板"
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
              <div className="h-32px line-height-32px mb-10px">
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
