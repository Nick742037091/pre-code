import { CloseCircleOutlined } from '@ant-design/icons'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useConfig } from '@/stores/config'
import { useEffect } from 'react'

export default function EditTemplate(props: {
  visible: boolean
  onClose: () => void
}) {
  const { templateCode, setTemplateCode } = useConfig()
  const monacoRef = useMonaco()
  useEffect(() => {
    monacoRef?.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    })
    monacoRef?.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    })
  }, [monacoRef])
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
        defaultLanguage="typescript"
        theme="vs-dark"
        className="flex-1 mb-10px"
        value={templateCode}
        onChange={(val) => {
          setTemplateCode(val || '')
        }}
        onValidate={(markers) => {
          markers.forEach((marker) =>
            console.log('onValidate:', marker.message)
          )
        }}
      />
    </div>
  )
}
