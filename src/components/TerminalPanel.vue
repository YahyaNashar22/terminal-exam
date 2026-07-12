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

function runCommand(): void {
  if (!terminal) {
    return
  }

  terminal.write('\r\n')

  const result = terminalStore.execute(currentInput)

  for (const outputLine of result.output) {
    terminal.writeln(outputLine)
  }

  if (result.clear) {
    terminal.clear()
  }

  currentInput = ''

  terminal.write(terminalStore.prompt)
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

  terminal.writeln('Terminal Exam')

  terminal.write(`\r\n${terminalStore.prompt}`)

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

    if (data < ' ') {
      return
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

<style scoped>
.terminal-container {
  width: 100%;
  height: 500px;
  padding: 12px;
  background-color: #0b1020;
}
</style>
