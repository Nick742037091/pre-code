import { Button, Modal, message } from 'antd'
import ejs from 'ejs'
import { nativeCommond } from '@/utils/bridge'
import { useAppStore } from '@/stores/app'
import { useConfig } from '@/stores/config'
import { useState } from 'react'
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { ExportData, usePreviewData } from '../PreviewData'

function GenerateCode(props: { exportData: ExportData }) {
  const [messageApi, msgContext] = message.useMessage()
  const { fileName, filePath } = useAppStore()
  const { templateCode, fileType } = useConfig()

  const { context: previewDataContext, showModal: showPreviewData } =
    usePreviewData({ exportData: props.exportData })
  const [exportErrorVisible, setExportErrorVisible] = useState(false)
  const [exportError, setExportError] = useState('')

  const handleGenerateCode = async () => {
    if (!templateCode) {
      messageApi.error('请编辑模板')
      return
    }
    try {
      const code = ejs.render(templateCode, props.exportData)
      nativeCommond({
        command: 'generateCode',
        params: {
          fileName,
          fileType,
          filePath,
          line: window.injectParams?.position?.line || 0,
          character: window.injectParams?.position?.character || 0,
          code
        }
      })
    } catch (e) {
      setExportError((e as any).message)
      setExportErrorVisible(true)
    }
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={() => showPreviewData()}
        className="mr-10px"
        icon={<EyeOutlined />}
      >
        预览导出数据
      </Button>
      <Button
        type="primary"
        onClick={handleGenerateCode}
        icon={<CheckOutlined />}
      >
        生成代码
      </Button>

      <Modal
        title={<div className="color-red text-20px">生成代码出错</div>}
        open={exportErrorVisible}
        width={800}
        footer={null}
        style={{ top: '5vh' }}
        onCancel={() => setExportErrorVisible(false)}
      >
        <div
          className="mt-10px max-h-80vh px-10px 
          bg-white color-red 
          border-normal border-rounded-10px"
        >
          <pre className="overflow-auto px-10px pb-10px">{exportError}</pre>
        </div>
      </Modal>
      {msgContext}
      {previewDataContext}
    </div>
  )
}

export default GenerateCode
