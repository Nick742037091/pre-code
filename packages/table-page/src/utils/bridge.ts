import { nanoid } from 'nanoid'

export interface NativeCommandOptions {
  command: string
  params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}
interface MessageEvent {
  data: {
    command: string
    commandId: string
    params?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any
    }
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
    const listener = (event: MessageEvent) => {
      const { command, commandId, params } = event.data
      if (command !== 'nativeCallbackResult') return
      if (commandId !== commandId) return
      window.removeEventListener('message', listener)
      resolve(params as T)
    }
    window.addEventListener('message', listener)
  })
}
