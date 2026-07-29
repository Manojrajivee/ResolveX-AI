export const ROUTES = {
  LANDING: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: '/dashboard',
  RUNBOOKS: {
    LIST: '/runbooks',
    DETAILS: (id: string) => `/runbooks/${id}`,
  },
  CHAT: '/chat',
  TIMELINE: '/timeline',
  REPORTS: {
    LIST: '/reports',
    DETAILS: (id: string) => `/reports/${id}`,
  },
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  SETTINGS: {
    INDEX: '/settings',
    PROFILE: '/settings/profile',
    SECURITY: '/settings/security',
    APPEARANCE: '/settings/appearance',
    PREFERENCES: '/settings/preferences',
  },
  ADMIN: {
    INDEX: '/admin',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    RUNBOOKS: '/admin/runbooks',
    REPORTS: '/admin/reports',
  },
};
