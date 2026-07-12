export interface ParsedCommand {
  command: string
  args: string[]

  redirect?: {
    target: string
    append: boolean
  }
}

function tokenize(commandLine: string): string[] {
  const tokens: string[] = []
  let currentToken = ''
  let quoteCharacter: '"' | "'" | null = null

  for (let index = 0; index < commandLine.length; index += 1) {
    const character = commandLine.charAt(index)
    const nextCharacter = commandLine.charAt(index + 1)

    if (quoteCharacter) {
      if (character === quoteCharacter) {
        quoteCharacter = null
      } else {
        currentToken += character
      }
      continue
    }

    if (character === '"' || character === "'") {
      quoteCharacter = character
      continue
    }

    if (/\s/.test(character)) {
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }
      continue
    }

    if (character === '>') {
      if (currentToken) {
        tokens.push(currentToken)
        currentToken = ''
      }

      if (nextCharacter === '>') {
        tokens.push('>>')
        index += 1
      } else {
        tokens.push('>')
      }

      continue
    }

    currentToken += character
  }

  if (currentToken) {
    tokens.push(currentToken)
  }

  return tokens
}

export function parseCommand(commandLine: string): ParsedCommand {
  const tokens = tokenize(commandLine.trim())

  const redirectIndex = tokens.findIndex((token) => token === '>' || token === '>>')

  if (redirectIndex === -1) {
    return {
      command: tokens[0] ?? '',
      args: tokens.slice(1),
    }
  }

  const redirectOperator = tokens[redirectIndex]
  const target = tokens[redirectIndex + 1]

  return {
    command: tokens[0] ?? '',
    args: tokens.slice(1, redirectIndex),

    redirect: target
      ? {
          target,
          append: redirectOperator === '>>',
        }
      : undefined,
  }
}
