import classNames from 'classnames'
import { forwardRef, useState } from 'react'
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

export default forwardRef(function FormItemList(props: { blockStyle: string }) {
  const [activeId, setActiveId] = useState('')
  const [formConfigList, setFormConfigList] = useImmer<FormConfig[]>([])

  function handleDragStart(event: DragStartEvent) {
    if (event.active.id) {
      setActiveId(event.active.id + '')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId('')
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
  return (
    <div
      className={classNames(
        props.blockStyle,
        'p-10px flex-1 flex items-stretch'
      )}
      css={{ height: 'calc(100vh - 162px)' }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <LeftList activeId={activeId} />
        <Main
          formConfigList={formConfigList}
          onDelete={(index: number) => {
            setFormConfigList((draft) => {
              draft.splice(index, 1)
            })
          }}
          onCopy={(index: number) => {
            setFormConfigList((draft) => {
              const config = draft[index]
              draft.push({
                ...config,
                id: nanoid()
              })
            })
          }}
        />
        <RightList />
      </DndContext>
    </div>
  )
})
