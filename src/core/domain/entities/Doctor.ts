// Doctor entity - Define la estructura del doctor/usuario según las APIs de Doctoc
export interface Doctor {
  userId: string;
  orgID: string;
  name?: string;
  email?: string;
  speciality?: string;
  photo?: string;
  rating?: number;
  // Información específica del calendario y horarios
  calendar?: DoctorCalendar;
  types?: DoctorType[];
}

export interface DoctorCalendar {
  // Configuración de calendario del doctor
  // Esta estructura se define según los endpoints de calendario de usuario
  timezone?: string;
  availability?: DoctorAvailability[];
  overbooking?: boolean;
}

export interface DoctorAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DoctorType {
  typeId: string;
  name: string;
  duration?: number; // Duración en minutos
  price?: number;
}