import { Button, Divider, Modal, Select } from 'antd'
import { TemplateItem } from '@/stores/config'
import { CloseOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAddTemplate } from '../AddTemplate/index'
import { MouseEvent, useEffect } from 'react'
import { useConfig } from '@/stores/config'

export default function SelectTemplate() {
  const {
    templateList,
    currentTemplate,
    deleteTemplate,
    setCurrentTemplateId,
    currentTemplateId
  } = useConfig()

  const optionList = templateList.map((item) => ({
    value: item.id,
    label: item.templateName
  }))

  const { context: addTemplateContext, showModal: showTemplateForm } =
    useAddTemplate()
  const handleAddTemplate = (event: MouseEvent) => {
    event.stopPropagation()
    showTemplateForm('add')
  }
  const handleEditTemplate = (event: MouseEvent, template: TemplateItem) => {
    event.stopPropagation()
    showTemplateForm('edit', template)
  }
  const handleDeleteTemplate = async (event: MouseEvent, index: number) => {
    event.stopPropagation()
    await Modal.confirm({
      title: '是否删除模板？',
      onOk: () => {
        deleteTemplate(index)
      }
    })
  }
  function handleSelectTemplate(val: string) {
    setCurrentTemplateId(val)
  }
  useEffect(() => {
    setCurrentTemplateId(currentTemplateId)
  }, [])
  return (
    <div className="flex items-center mr-10px">
      {addTemplateContext}
      <div className="mr-10px">模板</div>
      <Select
        value={currentTemplate?.id || ''}
        className="w-200px mr-10px"
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
