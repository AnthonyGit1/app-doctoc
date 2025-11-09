// Appointment entity - Define la estructura de una cita médica
export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  // Propiedades adicionales según las APIs de Doctoc
}