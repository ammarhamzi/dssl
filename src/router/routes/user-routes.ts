import type { RouteRecordRaw } from 'vue-router';

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    redirect: '/user/home',
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard'
    }
  },
  {
    path: '/user/home',
    name: 'user-home',
    component: () => import('@/pages/user/home/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Dashboard'
    }
  },
  {
    path: '/user/todo',
    name: 'user-todo',
    component: () => import('@/pages/user/todo/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'To Do List'
    }
  },
  {
    path: '/user/inspections',
    name: 'user-inspections',
    component: () => import('@/pages/user/forms/submit.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Inspections'
    }
  },
  {
    path: '/user/inspections-stats',
    name: 'user-inspections-stats',
    component: () => import('@/pages/user/inspections-stats/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Inspections Statistics'
    }
  },
  {
    path: '/user/reports',
    name: 'user-reports',
    component: () => import('@/pages/user/reports/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Report Analysis'
    }
  },
  {
    path: '/user/task-status',
    name: 'user-task-status',
    component: () => import('@/pages/user/task-status/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Task Status'
    }
  },
  // Legacy routes for backward compatibility
  {
    path: '/user/forms/submit',
    name: 'user-forms-submit',
    component: () => import('@/pages/user/forms/submit.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'New Inspection Form'
    }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/pages/user/profile/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Profile'
    }
  },
  {
    path: '/user/calendar',
    name: 'user-calendar',
    component: () => import('@/pages/user/calendar/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Calendar'
    }
  },
  {
    path: '/user/notifications',
    name: 'user-notifications',
    component: () => import('@/pages/user/notifications/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Notifications'
    }
  },
  {
    path: '/user/documentation',
    name: 'user-documentation',
    component: () => import('@/pages/user/documentation/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Documentation'
    }
  },
  {
    path: '/user/getting-started',
    name: 'user-getting-started',
    component: () => import('@/pages/user/getting-started/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Getting Started'
    }
  },
  {
    path: '/user/help',
    name: 'user-help',
    component: () => import('@/pages/user/help/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['user'],
      layout: 'dashboard',
      title: 'Help Center'
    }
  }
]; 