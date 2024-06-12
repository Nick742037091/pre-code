import { CloseCircleOutlined } from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { useConfig } from '@/stores/config'

export default function EditTemplate(props: {
  visible: boolean
  onClose: () => void
}) {
  const { templateCode, setTemplateCode } = useConfig()
  return (
    <div
      className="position-fixed flex flex-col h-100vh w-100vw box-border
      bg-white z-1000"
      css={{
        top: props.visible ? '0' : '-100vh',
        transition: 'all ease 0.3s'
      }}
    >
      <CloseCircleOutlined
        className="cursor-pointer text-24px position-absolute top-5px right-20px z-1000 color-primary"
        onClick={props.onClose}
      />
      <Editor
        options={{
          fontSize: 13,
          minimap: {
            enabled: false
          }
        }}
        theme="vs-dark"
        className="flex-1 mb-10px"
        defaultLanguage="typescript"
        value={templateCode}
        onChange={(val) => {
          setTemplateCode(val || '')
        }}
      />
    </div>
  )
}
