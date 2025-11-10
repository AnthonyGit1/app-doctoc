import { AppointmentRepository } from '../../core/domain/repositories/AppointmentRepository';
import { Appointment } from '../../core/domain/entities/Appointment';
import { DoctocApi } from '../api/doctoc-api';
import { 
  CreateAppointmentRequestDTO, 
  UpdateAppointmentRequestDTO, 
  CancelAppointmentRequestDTO,
  GetPatientAppointmentsRequestDTO,
  GetDayAppointmentsRequestDTO,
  GetDoctorOccupiedSlotsRequestDTO 
} from '../../core/application/dto/appointments.dto';

// Implementación concreta del repositorio de citas usando la API de Doctoc
export class DoctocAppointmentRepository implements AppointmentRepository {
  constructor(private doctocApi: DoctocApi) {}

  async create(request: CreateAppointmentRequestDTO): Promise<Appointment> {
    const response = await this.doctocApi.createAppointment(request);
    
    if (response.status !== 'success') {
      throw new Error('Error al crear la cita');
    }

    return this.mapResponseToAppointment(response.quote);
  }

  async update(request: UpdateAppointmentRequestDTO): Promise<Appointment> {
    const response = await this.doctocApi.updateAppointment(request);
    
    if (response.status !== 'success') {
      throw new Error('Error al actualizar la cita');
    }

    return this.mapResponseToAppointment(response.quote);
  }

  async cancel(request: CancelAppointmentRequestDTO): Promise<boolean> {
    const response = await this.doctocApi.cancelAppointment(request);
    return response.status === 'success';
  }

  async getPatientAppointments(request: GetPatientAppointmentsRequestDTO): Promise<Appointment[]> {
    const response = await this.doctocApi.getPatientAppointments(request);
    
    if (response.status !== 'success') {
      throw new Error('Error al obtener las citas del paciente');
    }

    return response.quotes.map(quote => this.mapResponseToAppointment(quote));
  }

  async getDayAppointments(request: GetDayAppointmentsRequestDTO): Promise<Appointment[]> {
    const response = await this.doctocApi.getDayAppointments(request);
    
    if (response.status !== 'success') {
      throw new Error('Error al obtener las citas del día');
    }

    return response.quotes.map(quote => this.mapResponseToAppointment(quote));
  }

  async getAppointmentById(orgID: string, appointmentId: string, dayKey: string): Promise<Appointment | null> {
    const response = await this.doctocApi.getDayAppointments({
      orgID,
      dayKey,
      citaID: appointmentId
    });

    if (response.status !== 'success' || !response.quotes.length) {
      return null;
    }

    return this.mapResponseToAppointment(response.quotes[0]);
  }

  async getDoctorAppointmentsByDay(orgID: string, userId: string, dayKey: string): Promise<Appointment[]> {
    const response = await this.doctocApi.getDayAppointments({
      orgID,
      dayKey,
      userId
    });

    if (response.status !== 'success') {
      throw new Error('Error al obtener las citas del doctor');
    }

    return response.quotes.map(quote => this.mapResponseToAppointment(quote));
  }

  async getDoctorOccupiedSlots(request: GetDoctorOccupiedSlotsRequestDTO): Promise<Array<{
    start: string;
    end: string;
    appointmentId?: string;
  }>> {
    const response = await this.doctocApi.getDoctorOccupiedSlots(request);

    // La respuesta es directamente un array de slots ocupados
    return response.map(slot => ({
      start: slot.start,
      end: slot.end
    }));
  }

  async isSlotAvailable(
    orgID: string, 
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<boolean> {
    try {
      const occupiedSlots = await this.getDoctorOccupiedSlots({
        orgID,
        dayKey: startDate.split('T')[0], // Extraer solo la fecha del ISO string
        userId,
        format: 'busy_ranges'
      });

      // Verificar si hay solapamiento con slots existentes
      const requestStart = new Date(startDate).getTime();
      const requestEnd = new Date(endDate).getTime();

      for (const slot of occupiedSlots) {
        const slotStart = new Date(slot.start).getTime();
        const slotEnd = new Date(slot.end).getTime();

        // Verificar solapamiento
        if (
          (requestStart >= slotStart && requestStart < slotEnd) ||
          (requestEnd > slotStart && requestEnd <= slotEnd) ||
          (requestStart <= slotStart && requestEnd >= slotEnd)
        ) {
          return false; // Hay solapamiento
        }
      }

      return true; // No hay solapamiento, slot disponible
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return false; // En caso de error, asumir no disponible
    }
  }

  private mapResponseToAppointment(quote: {
    id: string;
    patientId: string;
    userId: string;
    date: string;
    startDate: string;
    endDate: string;
    type: string;
    typeId?: string;
    motive: string;
    status: string;
    version?: string;
    locationId?: string;
    recipeID?: string;
    category?: string;
    createdAt?: {
      _seconds: number;
      _nanoseconds: number;
    };
    history?: Array<{
      action: string;
      timestamp: {
        _seconds: number;
        _nanoseconds: number;
      };
      userId: string;
    }>;
  }): Appointment {
    return {
      id: quote.id,
      patientId: quote.patientId,
      userId: quote.userId,
      orgID: '', // Se asume que viene del contexto
      date: quote.date,
      dayKey: quote.date,
      scheduledStart: quote.startDate,
      scheduledEnd: quote.endDate,
      startDate: quote.startDate,
      endDate: quote.endDate,
      type: quote.type,
      typeId: quote.typeId,
      motive: quote.motive,
      status: quote.status as 'pendiente' | 'confirmada' | 'completada' | 'cancelada',
      version: quote.version || 'v2',
      locationId: quote.locationId || '',
      recipeID: quote.recipeID,
      category: quote.category,
      createdAt: quote.createdAt || {
        _seconds: Math.floor(Date.now() / 1000),
        _nanoseconds: 0
      },
      history: (quote.history || []).map(h => ({
        action: h.action as 'created' | 'edited' | 'cancelled' | 'completed',
        timestamp: h.timestamp,
        userId: h.userId
      }))
    };
  }
}