import { Input, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface Result {
  confirm: boolean
  value: string
}

export const usePrompt = () => {
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleOk = () => {
    promptResolve.current?.({ confirm: true, value: inputValue })
    setConfirmLoading(true)
  }
  const handleCancel = () => {
    promptResolve.current?.({ confirm: false, value: '' })
    setVisible(false)
  }
  const [title, setTitle] = useState('')
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    if (!visible) {
      setTitle('')
      setInputValue('')
      setConfirmLoading(false)
      promptResolve.current = undefined
    }
  }, [visible])
  const context = (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Input
        className="w-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </Modal>
  )
  const promptResolve = useRef<(result: Result) => void>()
  const showPrompt = (options?: { title: string; defaultValue?: string }) => {
    setVisible(true)
    if (options?.title) {
      setTitle(options?.title)
    }
    if (options?.defaultValue) {
      setInputValue(options?.defaultValue)
    }
    return new Promise<Result>((resolve) => {
      promptResolve.current = resolve
    })
  }
  return {
    context,
    showPrompt,
    setPromptVisible: setVisible
  }
}
