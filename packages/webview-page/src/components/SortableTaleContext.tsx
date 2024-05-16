/** 拖拽相关依赖 */
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

export default function SortableTaleContext(props: {
  children: React.ReactNode
  list: any[]
  rowKey: string
  onDragEnd: (activeIndex: number, overIndex: number) => void
}) {
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = props.list.findIndex((i) => i.id === active.id)
      const overIndex = props.list.findIndex((i) => i.id === over?.id)
      props.onDragEnd(activeIndex, overIndex)
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5 // 按住不动移动5px时才进行拖拽, 这样就可以拖拽元素内部的点击事件
      }
    })
  )
  return (
    <DndContext
      // 使拖拽元素内部点击事件可以生效
      sensors={sensors}
      // 只在垂直方向可以拖拽
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={props.list.map((item) => item[props.rowKey])}>
        {props.children}
      </SortableContext>
    </DndContext>
  )
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}
export const SortableTableRow = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 100 } : {})
  }

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

export const sortableTableProps = {
  components: { body: { row: SortableTableRow } }
}
