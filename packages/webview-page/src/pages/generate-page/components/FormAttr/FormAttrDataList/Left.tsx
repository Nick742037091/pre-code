import { useConfig } from '@/stores/config'
import classNames from 'classnames'
import { useDraggable, DragOverlay } from '@dnd-kit/core'
import { FormItem } from 'pre-code/src/types/config'

function Draggable(props: {
  isActive?: boolean
  item: FormItem
  iconClass: string
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.item.id
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
          props.isActive && 'opacity-50'
        )}
      >
        {props.item.name}
      </div>
    </div>
  )
}
export default function LeftList(props: { dragId: string | null }) {
  const { formItemList } = useConfig()
  const dragFormItem = formItemList.find((item) => item.id === props.dragId)

  const iconClass =
    'text-16px p-5px rounded-full hover:bg-primary hover:color-white cursor-pointer'
  return (
    <div className="flex flex-col w-300px bg-white border-r-1px border-r-solid border-r-slate-200">
      <div
        className="font-18px text-center font-500 p-10px position-relative"
        css={{
          borderBottom: '1px solid #eee'
        }}
      >
        表单组件列表
      </div>

      <div className="flex-1 overflow-auto">
        {formItemList.map((item) => {
          return <Draggable key={item.id} item={item} iconClass={iconClass} />
        })}
      </div>
      <DragOverlay>
        {dragFormItem ? (
          <Draggable isActive item={dragFormItem} iconClass={iconClass} />
        ) : null}
      </DragOverlay>
    </div>
  )
}
