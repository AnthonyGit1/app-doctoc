import { Appointment } from '../entities/Appointment';
import { 
  CreateAppointmentRequestDTO, 
  UpdateAppointmentRequestDTO, 
  CancelAppointmentRequestDTO,
  GetPatientAppointmentsRequestDTO,
  GetDayAppointmentsRequestDTO,
  GetDoctorOccupiedSlotsRequestDTO 
} from '../../application/dto/appointments.dto';

// Repository interface para la gestión de citas médicas
export interface AppointmentRepository {
  // Operaciones CRUD principales
  create(request: CreateAppointmentRequestDTO): Promise<Appointment>;
  update(request: UpdateAppointmentRequestDTO): Promise<Appointment>;
  cancel(request: CancelAppointmentRequestDTO): Promise<boolean>;
  
  // Consultas específicas
  getPatientAppointments(request: GetPatientAppointmentsRequestDTO): Promise<Appointment[]>;
  getDayAppointments(request: GetDayAppointmentsRequestDTO): Promise<Appointment[]>;
  getAppointmentById(orgID: string, appointmentId: string, dayKey: string): Promise<Appointment | null>;
  getDoctorAppointmentsByDay(orgID: string, userId: string, dayKey: string): Promise<Appointment[]>;
  
  // Gestión de disponibilidad
  getDoctorOccupiedSlots(request: GetDoctorOccupiedSlotsRequestDTO): Promise<Array<{
    start: string;
    end: string;
    appointmentId?: string;
  }>>;
  
  // Validaciones
  isSlotAvailable(
    orgID: string, 
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<boolean>;
}