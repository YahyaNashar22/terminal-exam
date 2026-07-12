export type FileSystemNodeType = 'file' | 'directory'

export interface FileSystemNode {
  type: FileSystemNodeType
  content?: string
}

export interface TerminalState {
  currentDirectory: string
  nodes: Record<string, FileSystemNode>
  history: string[]
}

export interface CommandResult {
  output: string[]
  clear?: boolean
}
