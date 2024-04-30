import { router } from '@/router'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useAddTemplate } from './components/AddTemplate'

function Header(props: { addTemplate: () => void }) {
  const handleClose = () => {
    router.navigate('/')
  }
  return (
    <div
      className="flex items-center text-20px p-10px"
      css={{
        borderBottom: 'solid 2px #eee'
      }}
    >
      模板列表
      <Button type="primary" ml-20px onClick={() => props.addTemplate()}>
        添加模板
      </Button>
      <CloseCircleOutlined ml-auto cursor-pointer onClick={handleClose} />
    </div>
  )
}
export default function TemplateList() {
  const { context, showModal } = useAddTemplate()
  return (
    <div className="p-20px">
      <Header addTemplate={showModal} />
      {context}
    </div>
  )
}
