import { Button, Divider, Modal, Select } from 'antd'
import { Template, useTemplateList } from '@/hooks/template'
import { CloseOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAddTemplate } from '@/pages/template-list/components/AddTemplate/index'
import { MouseEvent } from 'react'
import { useGenerateCodeStore } from '@/stores/generateCodeStore'

export default function SelectTemplate() {
  const store = useGenerateCodeStore()

  const { templateList, getTemlateList, deleteTemplate } = useTemplateList()
  const optionList = templateList.map((item) => ({
    value: item.templateName,
    label: item.templateName
  }))

  const { context: addTemplateContext, showModal: showTemplateForm } =
    useAddTemplate({
      updateList: getTemlateList
    })
  const handleAddTemplate = (event: MouseEvent) => {
    event.stopPropagation()
    showTemplateForm('add')
  }
  const handleEditTemplate = (event: MouseEvent, template: Template) => {
    event.stopPropagation()
    showTemplateForm('edit', template)
  }
  const handleDeleteTemplate = async (event: MouseEvent, index: number) => {
    event.stopPropagation()
    await Modal.confirm({
      title: '是否删除模板？',
      onOk: () => deleteTemplate(index)
    })
  }
  function handleSelectTemplate(val: string) {
    const template = templateList.find((item) => item.templateName === val)
    if (template) {
      store.setTemplateName(template.templateName)
      store.setTemplatePath(template.templatePath)
    }
  }
  return (
    <div className="flex items-center mr-10px">
      {addTemplateContext}
      <div className="mr-10px">模板</div>
      <Select
        defaultValue={store.templateName}
        className="w-200px mr-10px"
        showSearch
        options={optionList}
        onChange={(val) => handleSelectTemplate(val)}
        optionRender={(option, info) => (
          <div className="flex items-center">
            <div className="mr-auto">{option.label}</div>
            <EditOutlined
              className="mr-10px"
              onClick={(e) => handleEditTemplate(e, templateList[info.index])}
            />
            <CloseOutlined
              onClick={(e) => handleDeleteTemplate(e, info.index)}
            />
          </div>
        )}
        dropdownRender={(menu) => (
          <div>
            <div className="px-0px">
              <Button
                className="w-full text-left"
                type="text"
                icon={<PlusOutlined />}
                onClick={handleAddTemplate}
              >
                新增模板
              </Button>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            {menu}
          </div>
        )}
      />
    </div>
  )
}
