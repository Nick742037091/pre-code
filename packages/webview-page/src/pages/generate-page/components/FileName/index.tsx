import { useConfig } from '@/stores/config'
import { useAppStore } from '@/stores/app'
import { Input, Select } from 'antd'
import { FileType } from 'pre-code/src/types/config'

const FileTypeList: FileType[] = ['.vue', '.tsx', '.jsx']

function FileName() {
  const store = useAppStore()
  const { fileType, setFileType } = useConfig()

  const disabled = !!window.injectParams.openFilePath
  const fileTypeList = (
    <Select
      className="w-80px"
      disabled={disabled}
      defaultValue={fileType}
      onChange={(val) => {
        setFileType(val)
      }}
      options={FileTypeList.map((item) => {
        return { label: item, value: item }
      })}
    />
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
