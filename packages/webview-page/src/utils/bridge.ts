import { nanoid } from 'nanoid'
import { Message } from 'pre-code/src/utils/message'

export interface NativeCommandOptions {
  command: string
  params?: {
    [key: string]: any
  }
}

export const nativeCommond = <T>(options: NativeCommandOptions): Promise<T> => {
  return new Promise((resolve) => {
    const { command, params } = options
    const commandId = nanoid()
    window.vscode.postMessage({
      command,
      commandId: commandId,
      params
    })
    const listener = (event: { data: Message }) => {
      const { command, commandId, params } = event.data
      if (command !== 'nativeCallbackResult') return
      if (commandId !== commandId) return
      window.removeEventListener('message', listener)
      resolve(params as T)
    }
    window.addEventListener('message', listener)
  })
}
