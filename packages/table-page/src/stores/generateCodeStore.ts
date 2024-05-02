import { create } from 'zustand'
export type FileType = '.vue' | '.react'

interface State {
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
  return {
    templateName: '',
    setTemplateName: (templateName: string) => {
      set({ templateName })
    },
    templatePath: '',
    setTemplatePath: (templatePath: string) => {
      set({ templatePath: templatePath })
    },
    fileName: '',
    setFileName: (fileName: string) => {
      set({ fileName })
    },
    fileType: '.vue',
    setFileType: (fileType: FileType) => {
      set({ fileType })
    }
  }
})
