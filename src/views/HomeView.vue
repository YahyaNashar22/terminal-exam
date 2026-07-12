<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useExamStore } from '@/stores/exam'
import { useTerminalStore } from '@/stores/terminal'

const router = useRouter()

const examStore = useExamStore()
const terminalStore = useTerminalStore()

function startExam(): void {
  examStore.resetExam()
  terminalStore.reset()
  examStore.startExam()

  router.push({
    name: 'exam',
  })
}
</script>

<template>
  <main class="page page-home">
    <section class="hero-panel">
      <p class="eyebrow">Vue Terminal Assessment</p>
      <h1 class="hero-title">Terminal Exam</h1>
      <p class="hero-copy">
        Move through shell exercises, save your work when you want, and get the full score
        breakdown only at the end.
      </p>

      <div class="hero-actions">
        <button class="btn btn-primary" @click="startExam">Start Exam</button>
      </div>
    </section>
  </main>
</template>
