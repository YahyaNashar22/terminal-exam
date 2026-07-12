<script setup lang="ts">
import { useExamStore } from '@/stores/exam'
import TerminalPanel from '@/components/TerminalPanel.vue'
import { useRouter } from 'vue-router'
import { useTerminalStore } from '@/stores/terminal'
import { ref } from 'vue'
import ExerciseCard from '@/components/ExerciseCard.vue'

const router = useRouter()

const examStore = useExamStore()
const terminalStore = useTerminalStore()

const message = ref<string>('')

function handleCommandExecute(): void {
  const passed = examStore.evaluateCurrentExercise(terminalStore.getSnapshot())
  if (!passed) {
    return
  }

  message.value = 'Exercise completed'

  if (examStore.isFinished) {
    router.push({ name: 'results' })
  }
}
</script>

<template>
  <main>
    <ExerciseCard
      v-if="examStore.currentExercise"
      :exercise="examStore.currentExercise"
      :current-number="examStore.currentExerciseIndex + 1"
      :total="examStore.exercises.length"
      :message="message"
    />

    <TerminalPanel @command-executed="handleCommandExecute" />
  </main>
</template>
