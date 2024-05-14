import { useDroppable } from '@dnd-kit/core'
import { FormConfig } from '../index'
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useConfig } from '@/stores/config'
import { useMemo } from 'react'
import { listToMap } from '@/utils'

function Droppable(props: {
  id: string
  index?: number
  className?: string
  data?: FormConfig
  children?: React.ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      index: props.index
    }
  })
  const style = {}
  return (
    <div ref={setNodeRef} style={style} className={props.className || ''}>
      {/* 悬浮提示 */}
      {isOver && <div className="bg-emerald h-24px mx-10px rounded-4px"></div>}
      {props?.children}
    </div>
  )
}

export default function Main(props: {
  activeId: string
  formConfigList: FormConfig[]
  onDelete: (index: number) => void
  onCopy: (index: number) => void
  onSelect: (index: number) => void
}) {
  const iconClass = 'icon cursor-pointer text-20px hidden'
  const { formItemList } = useConfig()
  const formNameMap = useMemo(() => {
    return listToMap(formItemList, 'id', 'formName')
  }, [formItemList])
  return (
    <div className="flex-1 flex flex-col px-10px">
      <div className="text-20px font-bold py-10px text-center">表单配置</div>
      <div className="flex-1  flex flex-col overflow-auto">
        {props.formConfigList.map((item, index) => (
          <Droppable key={item.id} id={item.id} data={item} index={index}>
            <div
              className="flex flex-col relative rounded-4px "
              onClick={() => props.onSelect(index)}
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
            >
              <div
                className="item line-height-36px mx-10px my-6px  rounded-4px text-center cursor-pointer 
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
                  onClick={() => props.onCopy(index)}
                />
                <CloseCircleOutlined
                  className={classNames(iconClass, 'color-error')}
                  onClick={() => props.onDelete(index)}
                />
              </div>
            </div>
          </Droppable>
        ))}
        <Droppable className="flex-1" id="containier"></Droppable>
      </div>
    </div>
  )
}
