import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { Appointment } from '../entities/Appointment';
import { 
  CreateAppointmentRequestDTO,
  UpdateAppointmentRequestDTO,
  CancelAppointmentRequestDTO 
} from '../../application/dto/appointments.dto';

// Caso de uso para crear una nueva cita médica
export class CreateAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(request: CreateAppointmentRequestDTO): Promise<Appointment> {
    // Validaciones de negocio
    this.validateAppointmentRequest(request);
    
    // Verificar disponibilidad del slot
    const isAvailable = await this.appointmentRepository.isSlotAvailable(
      request.orgID,
      request.userId,
      request.scheduledStart,
      request.scheduledEnd
    );

    if (!isAvailable) {
      throw new Error('El horario seleccionado no está disponible');
    }

    // Crear la cita
    const appointment = await this.appointmentRepository.create(request);
    return appointment;
  }

  private validateAppointmentRequest(request: CreateAppointmentRequestDTO): void {
    if (!request.orgID) {
      throw new Error('El ID de la organización es requerido');
    }
    if (!request.patient) {
      throw new Error('El ID del paciente es requerido');
    }
    if (!request.userId) {
      throw new Error('El ID del doctor es requerido');
    }
    if (!request.scheduledStart || !request.scheduledEnd) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }
    if (new Date(request.scheduledStart) >= new Date(request.scheduledEnd)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    if (new Date(request.scheduledStart) < new Date()) {
      throw new Error('No se puede agendar citas en el pasado');
    }
  }
}

// Caso de uso para actualizar una cita existente
export class UpdateAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(request: UpdateAppointmentRequestDTO): Promise<Appointment> {
    this.validateUpdateRequest(request);
    
    // Si se cambia la hora, verificar disponibilidad
    const isAvailable = await this.appointmentRepository.isSlotAvailable(
      request.orgID,
      request.userId,
      request.scheduledStart,
      request.scheduledEnd
    );

    if (!isAvailable) {
      throw new Error('El nuevo horario no está disponible');
    }

    const appointment = await this.appointmentRepository.update(request);
    return appointment;
  }

  private validateUpdateRequest(request: UpdateAppointmentRequestDTO): void {
    if (!request.quoteID) {
      throw new Error('El ID de la cita es requerido para actualizar');
    }
    if (new Date(request.scheduledStart) >= new Date(request.scheduledEnd)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
  }
}

// Caso de uso para cancelar una cita
export class CancelAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(request: CancelAppointmentRequestDTO): Promise<boolean> {
    if (!request.quoteID) {
      throw new Error('El ID de la cita es requerido para cancelar');
    }

    const result = await this.appointmentRepository.cancel(request);
    return result;
  }
}

// Caso de uso para obtener citas de un paciente
export class GetPatientAppointmentsUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(orgID: string, patientID: string): Promise<Appointment[]> {
    if (!orgID || !patientID) {
      throw new Error('El ID de organización y paciente son requeridos');
    }

    const appointments = await this.appointmentRepository.getPatientAppointments({
      orgID,
      patientID
    });

    return appointments;
  }
}

// Caso de uso para obtener horarios disponibles de un doctor
export class GetDoctorAvailabilityUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(orgID: string, userId: string, startDate: string): Promise<Array<{
    date: string;
    availableSlots: Array<{
      start: string;
      end: string;
    }>;
  }>> {
    if (!orgID || !userId) {
      throw new Error('El ID de organización y doctor son requeridos');
    }

    // TODO: Implementar lógica completa de disponibilidad
    // 1. Obtener slots ocupados del doctor
    // 2. Obtener horario base del doctor
    // 3. Calcular intersección y retornar slots disponibles
    
    await this.appointmentRepository.getDoctorOccupiedSlots({
      orgID,
      dayKey: startDate, // Usar el formato de fecha requerido por la API
      userId,
      format: 'busy_ranges'
    });

    // Por ahora retorno una estructura básica - implementar lógica completa en siguiente iteración
    return [];
  }
}