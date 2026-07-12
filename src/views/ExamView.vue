<script setup lang="ts">
import { ref } from 'vue'
import { useTerminalStore } from '@/stores/terminal'
import { useExamStore } from '@/stores/exam'
import TerminalPanel from '@/components/TerminalPanel.vue'

const terminalStore = useTerminalStore()
const examStore = useExamStore()

const command = ref('')
const output = ref<string[]>([])

function submitCommand() {
  const result = terminalStore.execute(command.value)

  output.value.push(`${terminalStore.prompt}${command.value}`)

  output.value.push(...result.output)

  const passed = examStore.evaluateCurrentExercise(terminalStore.getSnapshot())

  if (passed) {
    output.value.push('Exercise completed.')
  }

  command.value = ''
}
</script>

<template>
  <main>
    <section v-if="examStore.currentExercise">
      <h2>
        {{ examStore.currentExercise.title }}
      </h2>

      <p>
        {{ examStore.currentExercise.description }}
      </p>

      <strong> {{ examStore.currentExercise.points }} points </strong>
    </section>

    <TerminalPanel />

    <div v-for="(line, index) in output" :key="index">
      {{ line }}
    </div>

    <form @submit.prevent="submitCommand">
      <span>{{ terminalStore.prompt }}</span>
      <input v-model="command" autofocus />
    </form>
  </main>
</template>
