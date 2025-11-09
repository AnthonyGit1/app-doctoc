// Appointment entity - Define la estructura de una cita médica según la API de Doctoc
export interface Appointment {
  id: string;
  patientId: string;
  userId: string; // ID del doctor/médico
  orgID: string;
  date: string; // Formato DD-MM-YYYY
  dayKey: string; // Formato DD-MM-YYYY
  scheduledStart: string; // ISO string
  scheduledEnd: string; // ISO string
  startDate: string; // ISO string
  endDate: string; // ISO string
  type: string; // 'Consulta', 'Teleconsulta', 'Procedimiento', etc.
  typeId?: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  version: string;
  locationId: string;
  recipeID?: string;
  category?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  history: AppointmentHistoryEntry[];
}

export interface AppointmentHistoryEntry {
  action: 'created' | 'edited' | 'cancelled' | 'completed';
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId: string;
}