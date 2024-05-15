/** 拖拽相关依赖 */
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  return (
    <DndContext onDragEnd={onDragEnd}>
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
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
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
