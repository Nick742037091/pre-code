/** 拖拽相关依赖 */
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Table } from 'antd'
import React, { Children, ReactElement, cloneElement } from 'react'
import { MenuOutlined } from '@ant-design/icons'

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
export const SortableTableRow = (
  props: RowProps & { draggableProp?: string }
) => {
  const { children, draggableProp, ...restProps } = props
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  })

  const rowChildren = Children.map(children, (_child) => {
    const child = _child as ReactElement
    if (child.key === draggableProp) {
      return React.cloneElement(child as React.ReactElement, {
        children: (
          <div
            className="w-100%"
            ref={setActivatorNodeRef}
            style={{ touchAction: 'none', cursor: 'move' }}
            {...listeners}
          >
            <MenuOutlined />
          </div>
        )
      })
    } else {
      return cloneElement(child)
    }
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 100 } : {})
  }
  if (draggableProp) {
    return (
      <tr
        id={props.id}
        {...restProps}
        {...attributes}
        style={style}
        ref={setNodeRef}
      >
        {rowChildren}
      </tr>
    )
  } else {
    return (
      <tr
        {...restProps}
        ref={setNodeRef}
        children={children}
        style={style}
        className="cursor-move"
        {...attributes}
        {...listeners}
      />
    )
  }
}

export const createSortableTableProps = (props?: {
  draggableProp?: string
  // draggableProp 排序列字段，会自动添加排序图标，不提供则整行可以拖动排序
}) => {
  return {
    components: {
      body: {
        row: (rowProps: RowProps) => (
          <SortableTableRow
            {...rowProps}
            draggableProp={props?.draggableProp || ''}
          />
        )
      }
    }
  } as Partial<typeof Table>
}
