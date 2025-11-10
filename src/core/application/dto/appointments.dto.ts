// DTOs para la gestión de citas médicas según la API de Doctoc

// =================== REQUESTS ===================

export interface CreateAppointmentRequestDTO {
  action: 'create';
  orgID: string;
  dayKey: string; // Formato DD-MM-YYYY
  scheduledStart: string; // ISO string
  scheduledEnd: string; // ISO string
  patient: string;
  userId: string;
  type: string;
  typeId?: string;
  motive: string;
  status: 'pendiente' | 'confirmada';
  version: 'v2';
  locationId?: string;
  recipeID?: string;
  category?: string;
  personaEjecutante?: string;
}

export interface UpdateAppointmentRequestDTO {
  action: 'update';
  orgID: string;
  quoteID: string;
  dayKey: string;
  oldDayKey?: string; // Si se cambia de día
  scheduledStart: string;
  scheduledEnd: string;
  patient: string;
  userId: string;
  type: string;
  typeId?: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada';
  locationId?: string;
  recipeID?: string;
  category?: string;
  personaEjecutante?: string;
}

export interface CancelAppointmentRequestDTO {
  action: 'cancel';
  orgID: string;
  dayKey: string;
  userId: string;
  quoteID: string;
  cancelReason?: string;
  personaEjecutante?: string;
}

export interface GetPatientAppointmentsRequestDTO {
  orgID: string;
  patientID: string;
}

export interface GetDayAppointmentsRequestDTO {
  orgID: string;
  dayKey: string; // Formato DD-MM-YYYY
  userId?: string; // Opcional: para filtrar por doctor
  citaID?: string; // Opcional: para obtener cita específica
}

// DTO específico para obtener una cita por ID
export interface GetAppointmentByIdRequestDTO {
  orgID: string;
  dayKey: string;
  citaID: string;
}

// DTO específico para obtener citas de un usuario en un día específico
export interface GetUserAppointmentsByDayRequestDTO {
  orgID: string;
  dayKey: string;
  userId: string;
}

export interface GetDoctorOccupiedSlotsRequestDTO {
  orgID: string;
  dayKey: string; // Formato DD-MM-YYYY
  userId?: string; // Opcional: para obtener slots de doctor específico
  format: 'busy_ranges';
}

// =================== RESPONSES ===================

export interface DoctocAPIResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  action?: string;
  total?: number;
  data?: T;
}

export interface CreateAppointmentResponseDTO extends DoctocAPIResponse {
  action: 'create';
  quote: {
    id: string;
    patientId: string;
    userId: string;
    date: string;
    startDate: string;
    endDate: string;
    type: string;
    motive: string;
    status: string;
    version: string;
    locationId: string;
    history: Array<{
      action: string;
      timestamp: {
        _seconds: number;
        _nanoseconds: number;
      };
      userId: string;
    }>;
  };
}

export interface GetAppointmentsResponseDTO extends DoctocAPIResponse {
  quotes: Array<{
    id: string;
    patientId: string;
    userId: string;
    date: string;
    startDate: string;
    endDate: string;
    type: string;
    motive: string;
    status: string;
    version: string;
    locationId: string;
    history: Array<{
      action: string;
      timestamp: {
        _seconds: number;
        _nanoseconds: number;
      };
      userId: string;
    }>;
    recipeID?: string;
    createdAt?: {
      _seconds: number;
      _nanoseconds: number;
    };
  }>;
}

export type GetDoctorOccupiedSlotsResponseDTO = Array<{
  start: string; // ISO string
  end: string; // ISO string
}>;