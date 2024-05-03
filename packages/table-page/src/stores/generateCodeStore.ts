import { create } from 'zustand'
export type FileType = '.vue' | '.react'

interface State {
  filePath: string
  templateName: string
  setTemplateName: (templateName: string) => void
  templatePath: string
  setTemplatePath: (templatePath: string) => void
  fileName: string
  setFileName: (fileName: string) => void
  fileType: FileType
  setFileType: (fileType: FileType) => void
}

export const useGenerateCodeStore = create<State>((set, get) => {
  let filePath = ''
  let fileName = ''
  let fileType = '.vue'
  const { openFilePath } = window.injectParams
  if (openFilePath) {
    filePath = openFilePath
    const pathParts = openFilePath.split('/')
    const lastPath = pathParts[pathParts.length - 1]
    fileName = lastPath.split('.')[0]
    fileType = '.' + lastPath.split('.')[1]
  }

  return {
    filePath,
    templateName: '',
    setTemplateName: (templateName: string) => {
      set({ templateName })
    },
    templatePath: '',
    setTemplatePath: (templatePath: string) => {
      set({ templatePath: templatePath })
    },
    fileName,
    setFileName: (fileName: string) => {
      set({ fileName })
    },
    fileType,
    setFileType: (fileType: FileType) => {
      set({ fileType })
    }
  }
})
