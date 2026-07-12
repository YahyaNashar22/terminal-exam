<script setup lang="ts">
import { useExamStore } from '@/stores/exam'
import TerminalPanel from '@/components/TerminalPanel.vue'
import { useRouter } from 'vue-router'
import { useTerminalStore } from '@/stores/terminal'
import { computed, onMounted } from 'vue'
import ExerciseCard from '@/components/ExerciseCard.vue'

const router = useRouter()

const examStore = useExamStore()
const terminalStore = useTerminalStore()

const nextLabel = computed(() => {
  return examStore.canGoToNextExercise ? 'Save And Next' : 'Finish Exam'
})

onMounted(() => {
  examStore.startExam()
})

function saveCurrentExercise(): void {
  examStore.saveCurrentSubmission(terminalStore.getSnapshot())
}

function goToPreviousExercise(): void {
  examStore.goToPreviousExercise()
}

function goToNextExercise(): void {
  saveCurrentExercise()

  if (examStore.canGoToNextExercise) {
    examStore.goToNextExercise()
    return
  }

  examStore.completeExam()
  router.push({ name: 'results' })
}
</script>

<template>
  <main class="page page-exam">
    <section class="exam-grid">
      <aside class="sidebar-panel">
        <ExerciseCard
          v-if="examStore.currentExercise"
          :exercise="examStore.currentExercise"
          :current-number="examStore.currentExerciseIndex + 1"
          :total="examStore.exercises.length"
        />
      </aside>

      <section class="workspace-panel">
        <div class="terminal-shell">
          <div class="terminal-header">
            <span>student@exam</span>
            <span>interactive shell</span>
          </div>

          <TerminalPanel />
        </div>

        <div class="action-row">
          <button
            class="btn"
            :disabled="!examStore.canGoToPreviousExercise"
            @click="goToPreviousExercise"
          >
            Previous
          </button>

          <button class="btn btn-accent" @click="saveCurrentExercise">Save Answer</button>

          <button class="btn btn-primary" @click="goToNextExercise">{{ nextLabel }}</button>
        </div>
      </section>
    </section>
  </main>
</template>
