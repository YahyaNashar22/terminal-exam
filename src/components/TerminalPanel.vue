<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'

const terminalElement = ref<HTMLDivElement | null>(null)

let terminal: Terminal | null = null
let fitAddon: FitAddon | null = null

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
