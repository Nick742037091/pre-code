import { useConfig } from '@/stores/config'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'
import { Input, Select } from 'antd'
const { Option } = Select

function FileName() {
  const store = useGenerateCodeStore()
  const { fileType, setFileType } = useConfig()

  const disabled = !!window.injectParams.openFilePath
  const fileTypeList = (
    <Select
      className="w-80px"
      disabled={disabled}
      defaultValue={fileType}
      onChange={setFileType}
    >
      <Option value=".vue">.vue</Option>
      <Option value=".react">.react</Option>
    </Select>
  )
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 mr-10px">页面名称</div>
      <Input
        disabled={disabled}
        className="w-300px"
        addonAfter={fileTypeList}
        value={store.fileName}
        onChange={(e) => store.setFileName(e.target.value)}
      />
    </div>
  )
}

export default FileName
