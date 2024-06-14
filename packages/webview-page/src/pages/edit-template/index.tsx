import { CloseCircleOutlined } from '@ant-design/icons'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useConfig } from '@/stores/config'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

function LanguageSelect(props: {
  language: string
  setLanguage: (value: string) => void
}) {
  const wrapperClass = 'border-solid border-2px p-4px'
  const activeClass = classNames(wrapperClass, 'border-primary')
  const inactiveClass = classNames(
    wrapperClass,
    'border-transparent opacity-50'
  )
  const iconList = [
    {
      value: 'html',
      icon: 'i-vscode-icons:file-type-vue'
    },
    {
      value: 'typescript',
      icon: 'i-vscode-icons:file-type-reactjs'
    }
  ]
  return (
    <div className="flex items-center text-24px">
      {iconList.map((item) => (
        <div
          key={item.value}
          className={classNames(
            props.language === item.value ? activeClass : inactiveClass,
            'cursor-pointer'
          )}
          onClick={() => props.setLanguage(item.value)}
        >
          <div className={item.icon} />
        </div>
      ))}
    </div>
  )
}

export default function EditTemplate(props: {
  visible: boolean
  onClose: () => void
}) {
  const { templateCode, setTemplateCode } = useConfig()
  const [language, setLanguage] = useState('html')
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
      <div className="text-24px position-absolute top-5px right-20px z-1000 flex items-center">
        <LanguageSelect language={language} setLanguage={setLanguage} />
        <CloseCircleOutlined
          className="cursor-pointer text-24px ml-10px color-primary"
          onClick={props.onClose}
        />
      </div>

      <Editor
        options={{
          fontSize: 14,
          minimap: {
            enabled: false
          }
        }}
        language={language}
        defaultLanguage="html"
        className="flex-1 mb-10px"
        value={templateCode}
        theme="vs-dark"
        onChange={(val) => {
          setTemplateCode(val || '')
        }}
      />
    </div>
  )
}
