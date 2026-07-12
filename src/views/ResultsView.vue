<script setup lang="ts">
import { useExamStore } from '@/stores/exam'
import { useTerminalStore } from '@/stores/terminal'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const examStore = useExamStore()
const terminalStore = useTerminalStore()

const percentage = computed(() => {
  if (examStore.maximumScore === 0) {
    return 0
  }
  return Math.round((examStore.score / examStore.maximumScore) * 100)
})

const duration = computed(() => {
  if (examStore.startedAt === null) {
    return '0s'
  }

  const endTime = examStore.finishedAt ?? Date.now()
  const totalSeconds = Math.max(0, Math.floor((endTime - examStore.startedAt) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) {
    return `${seconds}s`
  }

  return `${minutes}m ${seconds}s`
})

function restartExam(): void {
  examStore.resetExam()
  terminalStore.reset()

  examStore.startExam()

  router.push({
    name: 'exam',
  })
}
</script>
<template>
  <main class="page page-results">
    <section class="results-header">
      <p class="eyebrow">Assessment Summary</p>
      <h1 class="hero-title">Exam Results</h1>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">Score</span>
        <strong class="stat-value">{{ examStore.score }} / {{ examStore.maximumScore }}</strong>
      </article>

      <article class="stat-card">
        <span class="stat-label">Percentage</span>
        <strong class="stat-value">{{ percentage }}%</strong>
      </article>

      <article class="stat-card">
        <span class="stat-label">Duration</span>
        <strong class="stat-value">{{ duration }}</strong>
      </article>

      <article class="stat-card">
        <span class="stat-label">Commands Entered</span>
        <strong class="stat-value">{{ terminalStore.history.length }}</strong>
      </article>
    </section>

    <section class="results-panel">
      <h2 class="section-title">Exercise Breakdown</h2>

      <ul class="results-list">
        <li v-for="result in examStore.results" :key="result.id" class="results-item">
          <span class="result-title">{{ result.title }}</span>
          <strong class="result-score">{{ result.earnedPoints }} / {{ result.points }}</strong>
        </li>
      </ul>
    </section>

    <div class="hero-actions">
      <button class="btn btn-primary" @click="restartExam">Restart Exam</button>
    </div>
  </main>
</template>
