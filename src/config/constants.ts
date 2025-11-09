// Constantes de configuración del proyecto
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 10000,
};

export const APP_ROUTES = {
  HOME: '/',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
  },
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;