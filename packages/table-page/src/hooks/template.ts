import { nativeCommond } from '@/utils/bridge'
import { current } from 'immer'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
export interface Template {
  templateName: string
  templatePath: string
}

// TODO 抽取到共享数据
export const useTemplateList = () => {
  const [templateList, setTemplateList] = useImmer<Template[]>([])
  async function getTemlateList() {
    const result = await nativeCommond<{ templateList: Template[] }>({
      command: 'getTemplateList'
    })
    setTemplateList(result.templateList)
  }
  useEffect(() => {
    getTemlateList()
  }, [])
  function deleteTemplate(index: number) {
    setTemplateList((draft) => {
      draft.splice(index, 1)
      nativeCommond({
        command: 'updateTemplateList',
        params: {
          // 需要取出源数据再传递
          templateList: current(draft)
        }
      })
    })
  }
  return {
    templateList,
    getTemlateList,
    deleteTemplate
  }
}
