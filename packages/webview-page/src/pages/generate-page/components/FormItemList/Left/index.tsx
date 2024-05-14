import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useFormItemModal } from './FormItemModal'
import { useConfig } from '@/stores/config'
import classNames from 'classnames'
import { useState } from 'react'
import { Popconfirm } from 'antd'
import { useDraggable, DragOverlay } from '@dnd-kit/core'
import { FormItem } from 'pre-code/src/types/config'

function Draggable(props: {
  isActive?: boolean
  item: FormItem
  isEditing: boolean
  iconClass: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.item.id,
    // 编辑状态不可拖动
    disabled: props.isEditing
  })
  return (
    <div
      className={classNames('flex items-center mx-10px my-15px z-1000')}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div
        className={classNames(
          'flex-1 flex flex-center',
          'p-5px  rounded-6px bg-primary color-white text-14px',
          props.isEditing || 'cursor-move',
          props.isActive && 'opacity-50'
        )}
      >
        {props.item.formName}
      </div>
      {props.isEditing && (
        <>
          <EditOutlined
            className={classNames(props.iconClass, 'ml-10px')}
            onClick={props.onEdit}
          />
          <Popconfirm title="确认删除？" onConfirm={props.onDelete}>
            <DeleteOutlined
              className={classNames(props.iconClass, 'ml-5px hover:bg-error!')}
            />
          </Popconfirm>
        </>
      )}
    </div>
  )
}
export default function LeftList(props: { activeId: string | null }) {
  const { formItemList, deleteFormItem } = useConfig()
  const activeFormItem = formItemList.find((item) => item.id === props.activeId)
  const { showModal, context: formItemModalContext } = useFormItemModal()
  const [isEditing, setIsEditing] = useState(false)

  const iconClass =
    'text-16px p-5px rounded-full hover:bg-primary hover:color-white cursor-pointer'
  return (
    <div className="flex flex-col w-300px bg-white border-1px border-solid border-slate-200 rounded-8px">
      {formItemModalContext}
      <div
        className="font-18px text-center font-500 p-10px position-relative"
        css={{
          borderBottom: '1px solid #eee'
        }}
      >
        表单项列表
        <div className="position-absolute right-10px top-50% translate-y-[-50%]">
          {isEditing ? (
            <CheckOutlined
              className={classNames(iconClass, 'mr-5px')}
              onClick={() => setIsEditing(false)}
            />
          ) : (
            <EditOutlined
              className={classNames(iconClass, 'mr-5px')}
              onClick={() => setIsEditing(true)}
            />
          )}

          <PlusOutlined
            className={classNames(iconClass)}
            onClick={() => showModal('add')}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {formItemList.map((item, index) => {
          return (
            <Draggable
              key={item.id}
              item={item}
              isEditing={isEditing}
              iconClass={iconClass}
              onEdit={() => showModal('edit', item)}
              onDelete={() => deleteFormItem(index)}
            />
          )
        })}
      </div>
      <DragOverlay>
        {activeFormItem ? (
          <Draggable
            isActive
            item={activeFormItem}
            isEditing={isEditing}
            iconClass={iconClass}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </div>
  )
}
