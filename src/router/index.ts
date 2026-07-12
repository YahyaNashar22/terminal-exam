import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/exam',
      name: 'exam',
      component: () => import('@/views/ExamView.vue'),
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('@/views/ResultsView.vue'),
    },
  ],
})

export default router
