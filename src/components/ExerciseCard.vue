<script setup lang="ts">
import type { Exercise } from '@/types/exercise'

defineProps<{
  exercise: Exercise
  currentNumber: number
  total: number
  message?: string
}>()
</script>

<template>
  <section class="exercise-card">
    <small> Exercise {{ currentNumber }} of {{ total }} </small>

    <h1>
      {{ exercise.title }}
    </h1>

    <p>
      {{ exercise.description }}
    </p>

    <strong> {{ exercise.points }} points </strong>

    <p v-if="message">
      {{ message }}
    </p>
  </section>
</template>
