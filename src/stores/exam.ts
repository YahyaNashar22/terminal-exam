import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { exercises } from '@/data/exercises'
import type { TerminalState } from '@/types/terminal'
import type { Exercise } from '@/types/exercise'

export const useExamStore = defineStore('exam', () => {
  const currentExerciseIndex = ref(0)
  const completedExerciseIds = ref<number[]>([])

  const startedAt = ref<number | null>(null)
  const finishedAt = ref<number | null>(null)

  const currentExercise = computed(() => {
    return exercises[currentExerciseIndex.value]
  })

  const score = computed(() => {
    return exercises
      .filter((exercise: Exercise) => completedExerciseIds.value.includes(exercise.id))
      .reduce((total: number, exercise: Exercise) => total + exercise.points, 0)
  })

  const maximumScore = computed(() => {
    return exercises.reduce((total: number, exercise: Exercise) => total + exercise.points, 0)
  })

  const isFinished = computed(() => {
    return completedExerciseIds.value.length === exercises.length
  })

  function startExam(): void {
    startedAt.value = Date.now()
  }

  function evaluateCurrentExercise(terminalState: TerminalState): boolean {
    const exercise = currentExercise.value

    if (!exercise) {
      return false
    }

    const passed = exercise.validate(terminalState)

    if (!passed) {
      return false
    }

    if (!completedExerciseIds.value.includes(exercise.id)) {
      completedExerciseIds.value.push(exercise.id)
    }

    if (currentExerciseIndex.value < exercises.length - 1) {
      currentExerciseIndex.value++
    } else {
      finishedAt.value = Date.now()
    }

    return true
  }

  function resetExam(): void {
    currentExerciseIndex.value = 0
    completedExerciseIds.value = []
    startedAt.value = null
    finishedAt.value = null
  }

  return {
    exercises,
    currentExerciseIndex,
    currentExercise,
    completedExerciseIds,
    startedAt,
    finishedAt,
    score,
    maximumScore,
    isFinished,
    startExam,
    evaluateCurrentExercise,
    resetExam,
  }
})
