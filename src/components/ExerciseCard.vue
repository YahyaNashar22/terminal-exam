<script setup lang="ts">
import type { Exercise } from '@/types/exercise'

defineProps<{
  exercise: Exercise
  currentNumber: number
  total: number
}>()
</script>

<template>
  <section class="exercise-card">
    <small class="eyebrow">Exercise {{ currentNumber }} of {{ total }}</small>

    <h1 class="card-title">{{ exercise.title }}</h1>

    <p class="card-copy">{{ exercise.description }}</p>

    <div class="points-badge">{{ exercise.points }} points</div>
  </section>
</template>
