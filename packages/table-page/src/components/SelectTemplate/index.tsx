import { Button } from 'antd'
import { useState } from 'react'
import { nanoid } from 'nanoid'

export default function SelectTemplate(props: {
  onChangeTemplate: (path: string) => void
}) {
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
      props.onChangeTemplate(message.content)
    })
  }
  // TODO 组件中unocss属性样式无效
  return (
    <div className="flex items-center mb-10px">
      <Button type="primary" onClick={handleSelectTemplate}>
        选择模板
      </Button>
      <div className="ml-20px">{templatePath}</div>
    </div>
  )
}
