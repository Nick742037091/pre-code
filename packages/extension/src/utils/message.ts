export interface Message {
  command: string
  commandId: string
  params?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}
