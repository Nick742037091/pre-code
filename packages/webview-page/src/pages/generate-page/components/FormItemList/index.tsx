import classNames from 'classnames'
import { useState } from 'react'
import LeftList from './Left/index'
import RightList from './Right'
import Main from './Main'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core'
import { useImmer } from 'use-immer'
import { nanoid } from 'nanoid'

export interface FormConfig {
  id: string
  componentId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs: Record<string, any>
}

export default function FormItemList(props: { blockStyle: string }) {
  const [dragId, setDragId] = useState('')
  const [activeId, setActiveId] = useState('')
  const [formConfigList, setFormConfigList] = useImmer<FormConfig[]>([])
  const activeFormConfig = formConfigList.find((item) => item.id === activeId)

  function handleDragStart(event: DragStartEvent) {
    if (event.active.id) {
      setDragId(event.active.id + '')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setDragId('')
    const { active, over } = event
    if (!over) return
    if (over?.id === 'containier') {
      setFormConfigList((draft) => {
        draft.push({
          id: nanoid(),
          componentId: active.id + '',
          attrs: {}
        })
      })
    } else {
      const index = over?.data.current?.index as number
      setFormConfigList((draft) => {
        draft.splice(index, 0, {
          id: nanoid(),
          componentId: active.id + '',
          attrs: {}
        })
      })
    }
    console.log('dragEnd', 'active', active, 'over', over)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    console.log('dragOver', 'active', active, 'over', over)
  }

  const handleDeleteConfig = (index: number) => {
    setFormConfigList((draft) => {
      draft.splice(index, 1)
    })
  }

  const handleCopyConfig = (index: number) => {
    setFormConfigList((draft) => {
      const config = draft[index]
      draft.push({
        ...config,
        id: nanoid()
      })
    })
  }

  const handleSelectConfig = (index: number) => {
    setActiveId(formConfigList[index].id)
  }
  return (
    <div
      className={classNames(
        props.blockStyle,
        'p-0px! flex-1 flex items-stretch'
      )}
      css={{ height: 'calc(100vh - 162px)' }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <LeftList dragId={dragId} />
        <Main
          activeId={activeId}
          formConfigList={formConfigList}
          onDelete={handleDeleteConfig}
          onCopy={handleCopyConfig}
          onSelect={handleSelectConfig}
        />
        <RightList config={activeFormConfig} />
      </DndContext>
    </div>
  )
}
