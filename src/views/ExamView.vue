<script setup lang="ts">
import { ref } from 'vue'
import { useTerminalStore } from '@/stores/terminal'

const terminalStore = useTerminalStore()

const command = ref('')
const output = ref<string[]>([])

function submitCommand() {
  const result = terminalStore.execute(command.value)

  output.value.push(`${terminalStore.prompt}${command.value}`)

  output.value.push(...result.output)

  command.value = ''
}
</script>

<template>
  <main>
    <div v-for="(line, index) in output" :key="index">
      {{ line }}
    </div>

    <form @submit.prevent="submitCommand">
      <span>{{ terminalStore.prompt }}</span>
      <input v-model="command" autofocus />
    </form>
  </main>
</template>
