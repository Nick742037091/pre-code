import { create } from 'zustand'

interface State {
  filePath: string
  fileName: string
  setFileName: (fileName: string) => void
}

export const useGenerateCodeStore = create<State>((set) => {
  let filePath = ''
  let fileName = ''
  const { openFilePath } = window.injectParams
  if (openFilePath) {
    filePath = openFilePath
    const pathParts = openFilePath.split('/')
    const lastPath = pathParts[pathParts.length - 1]
    fileName = lastPath.split('.')[0]
  }

  return {
    filePath,
    fileName,
    setFileName: (fileName: string) => {
      set({ fileName })
    }
  }
})
