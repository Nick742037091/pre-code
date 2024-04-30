import { Input, Select } from 'antd'
import { useState } from 'react'
const { Option } = Select
export type FileType = '.vue' | '.react'

export const useFileName = () => {
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState<FileType>('.vue')
  const fileTypeList = (
    <Select
      w-80px
      defaultValue={fileType}
      onChange={(val) => setFileType(val as FileType)}
    >
      <Option value="vue">.vue</Option>
      <Option value="react">.react</Option>
    </Select>
  )
  const componentContext = (
    <Input
      addonAfter={fileTypeList}
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
  )
  return {
    fileName,
    fileType,
    setFileName,
    setFileType,
    componentContext
  }
}
