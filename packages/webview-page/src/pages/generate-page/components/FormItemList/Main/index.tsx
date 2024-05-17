import { useDroppable } from '@dnd-kit/core'
import { FormItemConfig } from '../index'
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useConfig } from '@/stores/config'
import { useMemo } from 'react'
import { listToMap } from '@/utils'
import { SortableContext } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Droppable(props: {
  id: string
  isSorting: boolean
  index?: number
  className?: string
  data?: FormItemConfig
  children?: React.ReactNode
}) {
  const {
    listeners: sortableListeners,
    setNodeRef: sortableSetNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props.id
  })

  const { isOver, setNodeRef: setDropNodeRef } = useDroppable({
    id: props.id,
    data: {
      index: props.index
    }
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  }

  return (
    <div ref={setDropNodeRef} className={props.className || ''}>
      {/* 显示添加元素绿色提示块 */}
      {!props.isSorting && isOver && (
        <div className="bg-emerald h-24px mx-10px rounded-4px"></div>
      )}
      <div
        ref={sortableSetNodeRef}
        style={style}
        {...{
          ...sortableListeners
        }}
        className={props.className || ''}
      >
        {props.children}
      </div>
    </div>
  )
}

export default function Main(props: {
  activeId: string
  formConfigList: FormItemConfig[]
  isSorting: boolean
  onDelete: (index: number) => void
  onCopy: (index: number) => void
  onSelect: (index: number) => void
  onSetFormItemConfigList: (list: FormItemConfig[]) => void
}) {
  const iconClass = 'icon cursor-pointer text-20px hidden'
  const { formItemList } = useConfig()
  const formNameMap = useMemo(() => {
    return listToMap(formItemList, 'id', 'name')
  }, [formItemList])

  return (
    <div className="flex-1 flex flex-col px-10px">
      <div className="text-20px font-bold py-10px text-center">表单配置</div>
      <div className="flex-1  flex flex-col overflow-auto">
        <SortableContext items={props.formConfigList.map((item) => item.id)}>
          {props.formConfigList.map((item, index) => (
            <Droppable
              key={item.id}
              id={item.id}
              data={item}
              index={index}
              isSorting={props.isSorting}
            >
              <div
                className="flex flex-col relative rounded-4px"
                css={{
                  '&:hover': {
                    '.item': {
                      backgroundColor: '#eee'
                    },
                    '.icon': {
                      display: 'inline-block'
                    }
                  }
                }}
                onClick={() => {
                  props.onSelect(index)
                }}
              >
                <div
                  className="item line-height-36px mx-10px my-6px  rounded-4px text-center 
                  border-solid border-slate-200  border-1px select-none"
                  css={{
                    backgroundColor:
                      props.activeId === item.id
                        ? 'rgb(22,119,255,0.1)'
                        : 'transparent'
                  }}
                >
                  {formNameMap[item.componentId]}
                </div>
                <div className="position-absolute right-15px top-0px  z-1000">
                  <PlusCircleOutlined
                    className={classNames(iconClass, 'color-primary mr-10px')}
                    onClick={() => {
                      props.onCopy(index)
                    }}
                  />
                  <CloseCircleOutlined
                    className={classNames(iconClass, 'color-error')}
                    onClick={() => {
                      props.onDelete(index)
                    }}
                  />
                </div>
              </div>
            </Droppable>
          ))}
        </SortableContext>
        <Droppable
          className="flex-1"
          id="containier"
          isSorting={props.isSorting}
        ></Droppable>
      </div>
    </div>
  )
}
