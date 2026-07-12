<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useTerminalStore } from '@/stores/terminal'

const terminalStore = useTerminalStore()

const terminalElement = ref<HTMLDivElement | null>(null)

let terminal: Terminal | null = null
let fitAddon: FitAddon | null = null

let currentInput = ''
let pendingInput = ''
let historyIndex = -1

const emit = defineEmits<{ commandExecuted: [] }>()

function writePrompt(): void {
  if (!terminal) {
    return
  }

  terminal.write(terminalStore.prompt)
}

function writeOutput(output: string): void {
  if (!terminal) {
    return
  }

  const normalizedOutput = output.replace(/\r\n/g, '\n')
  const lines = normalizedOutput.split('\n')
  const endsWithNewline = normalizedOutput.endsWith('\n')
  const lineCount = endsWithNewline ? lines.length - 1 : lines.length

  for (let index = 0; index < lineCount; index += 1) {
    terminal.writeln(lines[index] ?? '')
  }
}

function replaceCurrentInput(nextInput: string): void {
  if (!terminal) {
    return
  }

  while (currentInput.length > 0) {
    terminal.write('\b \b')
    currentInput = currentInput.slice(0, -1)
  }

  currentInput = nextInput
  terminal.write(currentInput)
}

function runCommand(): void {
  if (!terminal) {
    return
  }

  terminal.write('\r\n')

  const result = terminalStore.execute(currentInput)

  for (const outputLine of result.output) {
    writeOutput(outputLine)
  }

  if (result.clear) {
    terminal.clear()
  }

  currentInput = ''
  pendingInput = ''
  historyIndex = -1

  writePrompt()

  emit('commandExecuted')
}

onMounted(() => {
  if (!terminalElement.value) {
    return
  }

  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    fontFamily: 'Cascadia Code, JetBrains Mono, Consolas, monospace',
  })

  fitAddon = new FitAddon()

  terminal.loadAddon(fitAddon)
  terminal.open(terminalElement.value)

  fitAddon.fit()

  writePrompt()

  terminal.onData((data) => {
    if (!terminal) {
      return
    }

    if (data === '\r') {
      runCommand()
      return
    }

    if (data === '\u007F') {
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1)

        terminal.write('\b \b')
      }
      return
    }

    if (data === '\u001b[A') {
      if (terminalStore.history.length === 0) {
        return
      }

      if (historyIndex === -1) {
        pendingInput = currentInput
        historyIndex = terminalStore.history.length - 1
      } else {
        historyIndex = Math.max(0, historyIndex - 1)
      }

      replaceCurrentInput(terminalStore.history[historyIndex] ?? '')
      return
    }

    if (data === '\u001b[B') {
      if (historyIndex === -1) {
        return
      }

      if (historyIndex >= terminalStore.history.length - 1) {
        historyIndex = -1
        replaceCurrentInput(pendingInput)
        return
      }

      historyIndex += 1

      replaceCurrentInput(terminalStore.history[historyIndex] ?? '')
      return
    }

    if (data < ' ') {
      return
    }

    if (historyIndex !== -1) {
      historyIndex = -1
      pendingInput = ''
      replaceCurrentInput('')
    }

    currentInput += data
    terminal.write(data)
  })
})

onBeforeUnmount(() => {
  terminal?.dispose()
})
</script>

<template>
  <div ref="terminalElement" class="terminal-container"></div>
</template>
