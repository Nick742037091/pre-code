import classNames from 'classnames'
import { forwardRef, useImperativeHandle, useState } from 'react'
import LeftList from './Left'
import RightList from './Right'
import Main from './Main'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useImmer } from 'use-immer'
import { nanoid } from 'nanoid'
import { arrayMove } from '@dnd-kit/sortable'

export interface FormItemConfig {
  id: string
  componentId: string
  attrs: Record<string, any>
  elementAttrs: Record<string, any>
}

export interface FormItemListRef {
  getFormItemList: () => FormItemConfig[]
}

export default forwardRef(function FormItemList(
  props: {
    blockStyle: string
  },
  ref: any
) {
  useImperativeHandle(ref, () => {
    return {
      getFormItemList: () => {
        return formItemConfigList
      }
    }
  })
  const [dragId, setDragId] = useState('')
  const [activeId, setActiveId] = useState('')
  const [formItemConfigList, setFormItemConfigList] = useImmer<
    FormItemConfig[]
  >([])
  const activeFormConfig = formItemConfigList.find(
    (item) => item.id === activeId
  )

  // 是否正在对表单项排序
  const isSorting = formItemConfigList.some((item) => item.id === dragId)

  function handleDragStart(event: DragStartEvent) {
    console.log('handleDragStart')
    if (event.active.id) {
      setDragId(event.active.id + '')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log('handleDragEnd')
    const { active, over } = event
    if (isSorting) {
      // 拖拽排序
      setFormItemConfigList((draft) => {
        // TODO 存在闪烁问题
        const activeIndex = draft.findIndex((item) => item.id === active.id)
        const overIndex = draft.findIndex((item) => item.id === over?.id)
        return arrayMove(draft, activeIndex, overIndex)
      })
    } else {
      // 拖动表单组件进行添加
      if (!over) return
      if (over?.id === 'containier') {
        setFormItemConfigList((draft) => {
          draft.push({
            id: nanoid(),
            componentId: active.id + '',
            attrs: {},
            elementAttrs: {}
          })
        })
      } else {
        const index = over?.data.current?.index as number
        setFormItemConfigList((draft) => {
          draft.splice(index, 0, {
            id: nanoid(),
            componentId: active.id + '',
            attrs: {},
            elementAttrs: {}
          })
        })
      }
    }
    setDragId('')
  }

  const handleDeleteConfig = (index: number) => {
    setFormItemConfigList((draft) => {
      draft.splice(index, 1)
    })
  }

  const handleCopyConfig = (index: number) => {
    setFormItemConfigList((draft) => {
      const config = draft[index]
      draft.push({
        ...config,
        id: nanoid()
      })
    })
  }

  const handleSelectConfig = (index: number) => {
    setActiveId(formItemConfigList[index].id)
  }

  const handleUpdateAttrs = (
    attrs: Record<string, any>,
    key: 'attrs' | 'elementAttrs'
  ) => {
    setFormItemConfigList((draft) => {
      const index = draft.findIndex((item) => item.id === activeId)
      draft.splice(index, 1, {
        ...draft[index],
        [key]: attrs
      })
    })
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5 // 按住不动移动5px时才进行拖拽, 这样就可以拖拽元素内部的点击事件
      }
    })
  )
  return (
    <div
      className={classNames(
        props.blockStyle,
        'p-0px! mb-10px flex-1 flex items-stretch overflow-hidden'
      )}
      css={{ height: 'calc(100vh - 162px)' }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <LeftList dragId={dragId} />
        <Main
          isSorting={isSorting}
          activeId={activeId}
          formConfigList={formItemConfigList}
          onDelete={handleDeleteConfig}
          onCopy={handleCopyConfig}
          onSelect={handleSelectConfig}
          onSetFormItemConfigList={(list) => setFormItemConfigList(list)}
        />
        <RightList
          key={activeFormConfig?.id || ''}
          config={activeFormConfig}
          onUpdateAttrs={handleUpdateAttrs}
        />
      </DndContext>
    </div>
  )
})
