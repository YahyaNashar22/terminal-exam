export function normalizePath(currentDirectory: string, inputPath: string): string {
  const rawPath = inputPath.startsWith('/') ? inputPath : `${currentDirectory}/${inputPath}`

  const parts = rawPath.split('/')
  const normalizedParts: string[] = []

  for (const part of parts) {
    if (!part || part === '.') {
      continue
    }

    if (part === '..') {
      normalizedParts.pop()
      continue
    }

    normalizedParts.push(part)
  }

  return `/${normalizedParts.join('/')}`
}

export function getParentPath(path: string): string {
  if (path === '/') {
    return '/'
  }

  const parts = path.split('/').filter(Boolean)

  parts.pop()

  return `/${parts.join('/')}`
}

export function getBaseName(path: string): string {
  return path.split('/').filter(Boolean).at(-1) ?? '/'
}
