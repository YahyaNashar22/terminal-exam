import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { CommandResult, FileSystemNode, TerminalState } from '@/types/terminal'

import { getBaseName, getParentPath, normalizePath } from '@/services/pathUtils'
import { parseCommand } from '@/services/commandParser'

function createInitialNodes(): Record<string, FileSystemNode> {
  return {
    '/': {
      type: 'directory',
    },

    '/home': {
      type: 'directory',
    },

    '/home/student': {
      type: 'directory',
    },

    '/home/student/readme.txt': {
      type: 'file',
      content: 'Welcome to the terminal exam.\n',
    },
  }
}

export const useTerminalStore = defineStore('terminal', () => {
  const currentDirectory = ref('/home/student')

  const nodes = ref<Record<string, FileSystemNode>>(createInitialNodes())

  const history = ref<string[]>([])

  const prompt = computed(() => {
    const displayPath = currentDirectory.value.replace('/home/student', '~') || '~'

    return `student@exam:${displayPath}$ `
  })

  function exists(path: string): boolean {
    return Boolean(nodes.value[path])
  }

  function isDirectory(path: string): boolean {
    return nodes.value[path]?.type === 'directory'
  }

  function listDirectory(path: string): string[] {
    return Object.keys(nodes.value)
      .filter((candidatePath) => {
        if (candidatePath === path) {
          return false
        }

        return getParentPath(candidatePath) === path
      })
      .map((candidatePath) => {
        const node = nodes.value[candidatePath]
        const name = getBaseName(candidatePath)

        return node?.type === 'directory' ? `${name}/` : name
      })
      .sort()
  }

  function writeFile(path: string, content: string, append: boolean = false): boolean {
    const parentPath = getParentPath(path)

    if (!isDirectory(parentPath)) {
      return false
    }

    const previousContent = nodes.value[path]?.content ?? ''

    nodes.value[path] = {
      type: 'file',
      content: append ? previousContent + content : content,
    }

    return true
  }

  function execute(rawCommand: string): CommandResult {
    const commandLine = rawCommand.trim()

    if (!commandLine) {
      return {
        output: [],
      }
    }

    history.value.push(commandLine)

    const parsed = parseCommand(commandLine)

    const command = parsed.command
    const args = parsed.args

    switch (command) {
      case 'pwd':
        return {
          output: [currentDirectory.value],
        }

      case 'whoami':
        return {
          output: ['student'],
        }

      case 'help':
        return {
          output: [
            'Available commands:',
            ' pwd',
            ' whoami',
            ' ls [path]',
            ' cd [path]',
            ' mkdir <directory>',
            ' touch <file>',
            ' cat <file>',
            ' echo <text>',
            ' clear',
            ' history',
          ],
        }

      case 'ls': {
        const inputPath = args[0] ?? '.'

        const targetPath = normalizePath(currentDirectory.value, inputPath)

        if (!exists(targetPath)) {
          return {
            output: [`ls: cannot access '${inputPath}': No such file or directory`],
          }
        }

        if (!isDirectory(targetPath)) {
          return {
            output: [getBaseName(targetPath)],
          }
        }

        return {
          output: [listDirectory(targetPath).join(' ')],
        }
      }

      case 'cd': {
        const inputPath = args[0] ?? '/home/student'

        const expandedPath = inputPath.startsWith('~')
          ? inputPath.replace('~', '/home/student')
          : inputPath

        const targetPath = normalizePath(currentDirectory.value, expandedPath)

        if (!exists(targetPath)) {
          return {
            output: [`cd: ${inputPath}: No such file or directory`],
          }
        }

        if (!isDirectory(targetPath)) {
          return {
            output: [`cd: ${inputPath}: Not a directory`],
          }
        }

        currentDirectory.value = targetPath

        return {
          output: [],
        }
      }

      case 'mkdir': {
        if (args.length === 0) {
          return {
            output: ['mkdir: missing operand'],
          }
        }

        const output: string[] = []

        for (const argument of args) {
          const targetPath = normalizePath(currentDirectory.value, argument)

          if (exists(targetPath)) {
            output.push(`mkdir: cannot create directory '${argument}': File exists`)
            continue
          }

          nodes.value[targetPath] = {
            type: 'directory',
          }
        }

        return {
          output,
        }
      }

      case 'touch': {
        if (args.length === 0) {
          return {
            output: ['touch: missing file operand'],
          }
        }

        const output: string[] = []

        for (const argument of args) {
          const targetPath = normalizePath(currentDirectory.value, argument)

          const parentPath = getParentPath(targetPath)

          if (!isDirectory(parentPath)) {
            output.push(`touch: cannot touch '${argument}': No such file or directory`)
            continue
          }

          if (isDirectory(targetPath)) {
            output.push(`touch: cannot touch '${argument}': Is a directory`)
            continue
          }

          if (!exists(targetPath)) {
            nodes.value[targetPath] = {
              type: 'file',
              content: '',
            }
          }
        }

        return {
          output,
        }
      }

      case 'cat': {
        if (args.length === 0) {
          return {
            output: ['cat: missing file operand'],
          }
        }

        const output: string[] = []

        for (const argument of args) {
          const targetPath = normalizePath(currentDirectory.value, argument)

          const node = nodes.value[targetPath]

          if (!node) {
            output.push(`cat: ${argument}: No such file or directory`)
            continue
          }

          if (node.type === 'directory') {
            output.push(`cat: ${argument}: Is a directory`)
            continue
          }

          output.push(node.content ?? '')
        }

        return {
          output,
        }
      }

      case 'echo': {
        const text = args.join(' ')

        if (!parsed.redirect) {
          return {
            output: [text],
          }
        }
        const targetPath = normalizePath(currentDirectory.value, parsed.redirect.target)

        const success = writeFile(targetPath, `${text}\n`, parsed.redirect.append)

        if (!success) {
          return {
            output: [`bash: ${parsed.redirect.target}: No such file or directory`],
          }
        }
        return {
          output: [],
        }
      }

      case 'history':
        return {
          output: history.value.map((item, index) => `${index + 1} ${item}`),
        }

      case 'clear':
        return {
          output: [],
          clear: true,
        }

      default:
        return {
          output: [`${command}: command not found`],
        }
    }
  }

  function getSnapshot(): TerminalState {
    const snapshotNodes = Object.fromEntries(
      Object.entries(nodes.value).map(([path, node]) => [
        path,
        {
          type: node.type,
          content: node.content,
        },
      ]),
    )

    return {
      currentDirectory: currentDirectory.value,
      nodes: snapshotNodes,
      history: [...history.value],
    }
  }

  function reset(): void {
    currentDirectory.value = '/home/student'
    nodes.value = createInitialNodes()
    history.value = []
  }

  return {
    currentDirectory,
    nodes,
    history,
    prompt,
    execute,
    getSnapshot,
    reset,
  }
})
