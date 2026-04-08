import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/now',
    component: () => import('@/pages/NowPage.vue'),
  },
  // Show date with order suffix: YYYY-MM-DD@N — must come before the plain date route
  {
    path: '/:showdate(\\d{4}-\\d{2}-\\d{2}@\\d+)',
    component: () => import('@/pages/ShowRedirectPage.vue'),
  },
  // Show date without order: YYYY-MM-DD
  {
    path: '/:showdate(\\d{4}-\\d{2}-\\d{2})',
    component: () => import('@/pages/ShowRedirectPage.vue'),
  },
  // Calendar day pages: jan-1, dec-31, etc.
  {
    path: '/:monthday([a-z]{3}-\\d{1,2})',
    component: () => import('@/pages/MonthDayPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]
