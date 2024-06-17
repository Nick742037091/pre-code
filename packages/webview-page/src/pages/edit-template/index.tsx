import { CloseCircleOutlined, DatabaseOutlined } from '@ant-design/icons'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useConfig } from '@/stores/config'
import { useEffect, useState } from 'react'
import { LanguageSelect } from './components/LanguageSelect'
import { ExportData } from '../generate-page/components/PreviewData'
import JSONView from 'react-json-view'

export default function EditTemplate(props: {
  visible: boolean
  exportData: ExportData
  onClose: () => void
}) {
  const { templateCode, setTemplateCode } = useConfig()
  const [language, setLanguage] = useState('html')
  const monacoRef = useMonaco()
  useEffect(() => {
    if (!monacoRef) return
    monacoRef.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    })
    monacoRef.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    })
  }, [monacoRef])
  const [defaultPreviewDataWidth, setDefaultPreviewDataWidth] = useState(500)
  const [previewDataWidth, setPreviewDataWidth] = useState(0)
  const showPreviewData = previewDataWidth > 0
  const togglePreviewData = () => {
    if (showPreviewData) {
      setDefaultPreviewDataWidth(previewDataWidth)
      setPreviewDataWidth(0)
    } else {
      setPreviewDataWidth(defaultPreviewDataWidth)
    }
    monacoRef?.editor.getEditors().forEach((editor) => {
      editor.layout()
    })
  }
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
      <DatabaseOutlined
        className="position-absolute bottom-20px right-20px z-1000 
        text-24px color-primary cursor-pointer"
        onClick={togglePreviewData}
      />
      <div className="h-100vh w-100vw flex">
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
          css={{ width: `calc(100vw - ${previewDataWidth}px)!important` }}
          value={templateCode}
          theme="vs-dark"
          onChange={(val) => {
            setTemplateCode(val || '')
          }}
        />
        <div
          className="transition-all flex-shrink-0"
          css={{ width: previewDataWidth + 'px' }}
        >
          <div className="m-10px">
            <JSONView src={props.exportData} displayDataTypes={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
