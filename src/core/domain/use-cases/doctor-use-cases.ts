import { DoctorRepository } from '../repositories/DoctorRepository';
import { Doctor } from '../entities/Doctor';
import { UserCalendarData } from '../../application/dto/doctors.dto';

// Caso de uso para obtener información básica de un doctor
export class GetDoctorBasicInfoUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(orgID: string, userId: string): Promise<Doctor | null> {
    if (!orgID || !userId) {
      throw new Error('El ID de la organización y del doctor son requeridos');
    }

    const doctor = await this.doctorRepository.getBasicInfo({
      action: 'get',
      orgID,
      uid: userId,
      type: 'user',
      sections: ['basic', 'professional']
    });

    return doctor;
  }
}

// Caso de uso para obtener todos los doctores de una organización
export class GetDoctorsByOrganizationUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(orgID: string): Promise<Doctor[]> {
    if (!orgID) {
      throw new Error('El ID de la organización es requerido');
    }

    const doctors = await this.doctorRepository.getAllByOrganization(orgID);
    return doctors;
  }
}

// Caso de uso para buscar doctores por especialidad
export class SearchDoctorsBySpecialtyUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(orgID: string, specialty: string): Promise<Doctor[]> {
    if (!orgID) {
      throw new Error('El ID de la organización es requerido');
    }
    if (!specialty || specialty.trim().length < 2) {
      throw new Error('La especialidad debe tener al menos 2 caracteres');
    }

    const doctors = await this.doctorRepository.searchBySpecialty(orgID, specialty.trim());
    return doctors;
  }
}

// Caso de uso para obtener información del calendario de un doctor
export class GetDoctorCalendarUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(orgID: string, userId: string): Promise<UserCalendarData | null> {
    if (!orgID || !userId) {
      throw new Error('El ID de la organización y del doctor son requeridos');
    }

    const calendar = await this.doctorRepository.getCalendarInfo({
      action: 'get',
      orgID,
      uid: userId,
      type: 'user',
      sections: ['calendarInfo']
    });

    return calendar;
  }
}

// Caso de uso para obtener tipos de consulta de un doctor
export class GetDoctorTypesUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(orgID: string, userId: string): Promise<Array<{
    typeId: string;
    name: string;
    duration?: number;
    price?: number;
    description?: string;
  }>> {
    if (!orgID || !userId) {
      throw new Error('El ID de la organización y del doctor son requeridos');
    }

    const types = await this.doctorRepository.getTypes({
      action: 'get',
      orgID,
      sections: ['tipos']
    });

    return types;
  }
}

// Caso de uso para verificar disponibilidad de un doctor
export class CheckDoctorAvailabilityUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(
    orgID: string,
    userId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    if (!orgID || !userId || !date || !startTime || !endTime) {
      throw new Error('Todos los parámetros son requeridos para verificar disponibilidad');
    }

    // Validar formato de fecha
    if (!this.isValidDate(date)) {
      throw new Error('El formato de fecha no es válido (YYYY-MM-DD)');
    }

    // Validar que no sea una fecha pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date) < today) {
      throw new Error('No se puede verificar disponibilidad en fechas pasadas');
    }

    const isAvailable = await this.doctorRepository.isAvailable(
      orgID,
      userId,
      date,
      startTime,
      endTime
    );

    return isAvailable;
  }

  private isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date) && !isNaN(Date.parse(date));
  }
}

// Caso de uso para obtener slots disponibles de un doctor
export class GetDoctorAvailableSlotsUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(
    orgID: string,
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  }>> {
    if (!orgID || !userId || !startDate || !endDate) {
      throw new Error('Todos los parámetros son requeridos');
    }

    // Validar que la fecha de inicio sea anterior a la de fin
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    // Validar que no sean fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(startDate) < today) {
      throw new Error('Las fechas no pueden ser pasadas');
    }

    const slots = await this.doctorRepository.getAvailableSlots(
      orgID,
      userId,
      startDate,
      endDate
    );

    return slots;
  }
}