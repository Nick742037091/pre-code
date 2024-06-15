import { Modal } from 'antd'
import { useState } from 'react'
import GlobalAttrList from './GlobalAttrList'
import { TableColumnAttrList } from './TableColumnAttrList'

export function useTableAttrModal() {
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const context = (
    <Modal
      title="编辑属性"
      open={visible}
      footer={null}
      onOk={() => {
        setVisible(false)
      }}
      onCancel={() => setVisible(false)}
      width={900}
    >
      <GlobalAttrList />
      <div className="mt-10px" />
      <TableColumnAttrList />
    </Modal>
  )
  return {
    context,
    showModal
  }
}
