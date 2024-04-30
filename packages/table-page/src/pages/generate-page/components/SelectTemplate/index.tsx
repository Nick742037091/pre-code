import { Button } from 'antd'
import { useState } from 'react'
import { router } from '@/router'

export default function SelectTemplate() {
  // templatePath 改完共享数据
  const [templatePath] = useState('')
  const handleSelectTemplate = () => {
    router.navigate('/template-list')
  }
  // TODO 组件中unocss属性样式无效
  return (
    <div className="flex items-center mb-10px">
      <Button type="primary" onClick={handleSelectTemplate}>
        选择模板
      </Button>
      <div className="ml-20px">{templatePath}</div>
    </div>
  )
}
