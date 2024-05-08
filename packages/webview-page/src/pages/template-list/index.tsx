import {
  CloseCircleOutlined,
  CloseOutlined,
  FormOutlined
} from '@ant-design/icons'
import { Button, Card, Popconfirm } from 'antd'
import { useAddTemplate } from './components/AddTemplate'
import { useTemplateList } from '../../hooks/template'

function Header(props: { addTemplate: () => void; onClose: () => void }) {
  return (
    <div
      className="flex items-center text-20px py-15px px-10px"
      css={{
        borderBottom: 'solid 2px #eee'
      }}
    >
      模板列表
      <Button type="primary" ml-20px onClick={props.addTemplate}>
        添加模板
      </Button>
      <CloseCircleOutlined ml-auto cursor-pointer onClick={props.onClose} />
    </div>
  )
}
// 暂时不需要展示页面
export default function TemplateList(props: {
  show: boolean
  setShow: (val: boolean) => void
}) {
  const { templateList, getTemlateList, deleteTemplate } = useTemplateList()
  const { context: addTemplateContext, showModal } = useAddTemplate({
    updateList: getTemlateList
  })
  return (
    <div
      className="position-fixed h-100vh w-100vw box-border overflow-auto bg-white z-1000 px-20px"
      css={{
        top: props.show ? '0' : '-100vh',
        transition: 'all ease 0.3s'
      }}
    >
      {addTemplateContext}
      <Header
        addTemplate={() => showModal('add')}
        onClose={() => props.setShow(false)}
      />
      <div className="flex flex-wrap">
        {templateList.map((item, index) => {
          return (
            <Card
              key={item.templateName}
              title={item.templateName}
              bordered={false}
              extra={
                <div>
                  <FormOutlined
                    className="cursor-pointer mr-20px"
                    onClick={() => showModal('edit', item)}
                  />
                  <Popconfirm
                    title="是否删除模板？"
                    onConfirm={() => deleteTemplate(index)}
                    okText="是"
                    cancelText="否"
                    placement="bottom"
                  >
                    <CloseOutlined className="cursor-pointer" />
                  </Popconfirm>
                </div>
              }
              className="m-10px bg-#ddd"
              css={{
                width: 'calc((100% - 40px)/2)'
              }}
            >
              <div>模板文件：{item.templatePath}</div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
