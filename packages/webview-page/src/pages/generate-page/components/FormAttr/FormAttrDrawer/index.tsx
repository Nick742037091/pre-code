import { Drawer } from 'antd'
import { useState } from 'react'
import GlobalAttrList from '../../GlobalAttr/GlobalAttrList'
import { FormAttrList } from './FormAttrList'

export function useFormAttrDrawer() {
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const context = (
    <Drawer
      title="编辑属性"
      open={visible}
      footer={null}
      onClose={() => setVisible(false)}
      placement="right"
      width="95vw"
    >
      <GlobalAttrList />

      <div className="mt-10px" />
      <FormAttrList />
    </Drawer>
  )
  return {
    context,
    showModal
  }
}
