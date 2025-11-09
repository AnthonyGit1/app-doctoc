// Schedule entity - Define la estructura de horarios del doctor
export interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Domingo a Sábado)
  startTime: string;
  endTime: string;
  isDefault: boolean; // Horario por defecto
  date?: Date; // Para horarios específicos/excepciones
  isAvailable: boolean;
  allowOverbooking: boolean;
}