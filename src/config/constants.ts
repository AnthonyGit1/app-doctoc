// Constantes de configuración del proyecto
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_DOCTOC_API_URL || 'https://us-central1-doctoc-main.cloudfunctions.net',
  AUTH_TOKEN: process.env.NEXT_PUBLIC_DOCTOC_API_TOKEN || '',
  TIMEOUT: 10000,
  DEFAULT_ORG_ID: process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || 'rFQpBRoNGiv0V9KnHZV6',
} as const;

// Endpoints específicos de la API de Doctoc
export const API_ENDPOINTS = {
  APPOINTMENTS: {
    MANAGE: '/manageQuotesAPIV2',
    GET_PATIENT: '/getPatientQuoteAPIV2',
    GET_DAY: '/getDayQuotesAPIV2',
  },
  PATIENTS: {
    MANAGE: '/managePatientsAPIV2',
    MANAGE_SINGLE: '/managePatientAPIV2', // Para update específico
  },
  USERS: {
    MANAGE_INFO: '/manageUserInfoAPIV2',
  },
  ORGANIZATION: {
    GET_INFO: '/getOrgInfoAPIV2',
  },
  PRICES: {
    GET: '/getPricesAPIV2',
  },
  PAYMENTS: {
    MANAGE: '/managePaymentAPIV2',
    GET_PATIENT: '/getPatientPaymentsAPIV2',
    GET_DAY: '/getDayPaymentsAPIV2',
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
  },
  PATIENT: {
    PROFILE: '/patient/profile',
    APPOINTMENTS: '/patient/appointments',
    NEW_APPOINTMENT: '/patient/appointments/new',
  },
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTA: 'Consulta',
  TELECONSULTA: 'Teleconsulta',
  PROCEDIMIENTO: 'Procedimiento',
} as const;

export const APPOINTMENT_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;

export const PATIENT_GENDERS = {
  MASCULINO: 'Masculino',
  FEMENINO: 'Femenino',
  OTRO: 'Otro',
} as const;

// Configuración de horarios
export const SCHEDULE_CONFIG = {
  DEFAULT_APPOINTMENT_DURATION: 60, // minutos
  MIN_APPOINTMENT_DURATION: 15, // minutos
  MAX_APPOINTMENT_DURATION: 240, // minutos
  BUSINESS_HOURS: {
    START: '08:00',
    END: '18:00',
  },
  DAYS_ADVANCE_BOOKING: 30, // días hacia adelante que se puede agendar
} as const;

// Configuración de validaciones
export const VALIDATION_CONFIG = {
  PATIENT_NAME_MIN_LENGTH: 2,
  PATIENT_NAME_MAX_LENGTH: 100,
  SEARCH_MIN_LENGTH: 2,
  DNI_MIN_LENGTH: 7,
  DNI_MAX_LENGTH: 15,
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 20,
} as const;