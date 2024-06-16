import { Drawer } from 'antd'
import { useState } from 'react'
import GlobalAttrList from './GlobalAttrList'
import { TableColumnAttrList } from './TableColumnAttrList'

export function useTableAttrDrawer() {
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
      <TableColumnAttrList />
    </Drawer>
  )
  return {
    context,
    showModal
  }
}
