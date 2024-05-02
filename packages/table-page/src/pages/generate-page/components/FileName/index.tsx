import { useGenerateCodeStore } from '@/stores/generateCodeStore'
import { Input, Select } from 'antd'
const { Option } = Select

function FileName() {
  const store = useGenerateCodeStore()
  const fileTypeList = (
    <Select
      className="w-80px"
      defaultValue={store.fileType}
      onChange={(val) => store.setFileType(val)}
    >
      <Option value=".vue">.vue</Option>
      <Option value=".react">.react</Option>
    </Select>
  )
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 mr-10px">页面名称</div>
      <Input
        className="w-300px"
        addonAfter={fileTypeList}
        value={store.fileName}
        onChange={(e) => store.setFileName(e.target.value)}
      />
    </div>
  )
}

export default FileName
