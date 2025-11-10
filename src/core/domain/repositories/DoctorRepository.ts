import { Doctor } from '../entities/Doctor';
import {
  GetUserBasicInfoRequestDTO,
  GetUserCalendarInfoRequestDTO,
  GetUserTypesRequestDTO,
  UpdateUserCalendarRequestDTO,
  UserCalendarData
} from '../../application/dto/doctors.dto';

// Repository interface para la gestión de doctores/usuarios
export interface DoctorRepository {
  // Información básica del doctor
  getBasicInfo(request: GetUserBasicInfoRequestDTO): Promise<Doctor | null>;
  
  // Gestión de calendario
  getCalendarInfo(request: GetUserCalendarInfoRequestDTO): Promise<UserCalendarData | null>;
  updateCalendarInfo(request: UpdateUserCalendarRequestDTO): Promise<boolean>;
  
  // Gestión de tipos de consulta/servicios
  getTypes(request: GetUserTypesRequestDTO): Promise<Array<{
    typeId: string;
    name: string;
    duration?: number;
    price?: number;
    description?: string;
  }>>;
  
  // Consultas específicas para búsqueda
  getAllByOrganization(orgID: string): Promise<Doctor[]>;
  searchBySpecialty(orgID: string, specialty: string): Promise<Doctor[]>;
  
  // Validaciones de disponibilidad
  isAvailable(
    orgID: string,
    userId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean>;
  
  // Gestión de horarios específicos
  getAvailableSlots(
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
  }>>;
}