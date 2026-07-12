import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { exercises } from '@/data/exercises'
import type { TerminalState } from '@/types/terminal'
import type { Exercise } from '@/types/exercise'

export const useExamStore = defineStore('exam', () => {
  const currentExerciseIndex = ref(0)
  const submissions = ref<Record<number, TerminalState>>({})

  const startedAt = ref<number | null>(null)
  const finishedAt = ref<number | null>(null)

  const currentExercise = computed(() => {
    return exercises[currentExerciseIndex.value]
  })

  const results = computed(() => {
    return exercises.map((exercise: Exercise) => {
      const submission = submissions.value[exercise.id]
      const passed = submission ? exercise.validate(submission) : false

      return {
        id: exercise.id,
        title: exercise.title,
        points: exercise.points,
        earnedPoints: passed ? exercise.points : 0,
        submitted: Boolean(submission),
      }
    })
  })

  const score = computed(() => {
    return results.value.reduce((total, result) => total + result.earnedPoints, 0)
  })

  const maximumScore = computed(() => {
    return exercises.reduce((total: number, exercise: Exercise) => total + exercise.points, 0)
  })

  const canGoToPreviousExercise = computed(() => currentExerciseIndex.value > 0)
  const canGoToNextExercise = computed(() => currentExerciseIndex.value < exercises.length - 1)

  const isFinished = computed(() => {
    return finishedAt.value !== null
  })

  function startExam(): void {
    if (startedAt.value === null) {
      startedAt.value = Date.now()
    }
  }

  function saveCurrentSubmission(terminalState: TerminalState): void {
    const exercise = currentExercise.value

    if (!exercise) {
      return
    }

    submissions.value[exercise.id] = terminalState
  }

  function goToPreviousExercise(): void {
    if (canGoToPreviousExercise.value) {
      currentExerciseIndex.value -= 1
    }
  }

  function goToNextExercise(): void {
    if (canGoToNextExercise.value) {
      currentExerciseIndex.value += 1
    }
  }

  function completeExam(): void {
    if (finishedAt.value === null) {
      finishedAt.value = Date.now()
    }
  }

  function resetExam(): void {
    currentExerciseIndex.value = 0
    submissions.value = {}
    startedAt.value = null
    finishedAt.value = null
  }

  return {
    exercises,
    currentExerciseIndex,
    currentExercise,
    submissions,
    startedAt,
    finishedAt,
    results,
    score,
    maximumScore,
    canGoToPreviousExercise,
    canGoToNextExercise,
    isFinished,
    startExam,
    saveCurrentSubmission,
    goToPreviousExercise,
    goToNextExercise,
    completeExam,
    resetExam,
  }
})
