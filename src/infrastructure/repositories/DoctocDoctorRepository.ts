import { DoctorRepository } from '../../core/domain/repositories/DoctorRepository';
import { Doctor } from '../../core/domain/entities/Doctor';
import {
  GetUserBasicInfoRequestDTO,
  GetUserCalendarInfoRequestDTO,
  GetUserTypesRequestDTO,
  UpdateUserCalendarRequestDTO,
  UserCalendarData,
  UserBasicInfoResponseDTO,
  UserCalendarInfoResponseDTO,
  UserTypesResponseDTO
} from '../../core/application/dto/doctors.dto';
import {
  GetOrganizationUsersRequestDTO,
  GetOrganizationSpecialtiesRequestDTO,
  OrganizationUsersResponseDTO,
  OrganizationSpecialtiesResponseDTO
} from '../../core/application/dto/organization.dto';
import { DoctocApi } from '../api/doctoc-api';

/**
 * Implementación concreta del repositorio de doctores usando la API de Doctoc
 */
export class DoctocDoctorRepository implements DoctorRepository {
  constructor(private doctocApi: DoctocApi) {}

  /**
   * Obtiene información básica de un doctor específico
   */
  async getBasicInfo(request: GetUserBasicInfoRequestDTO): Promise<Doctor | null> {
    try {
      const response: UserBasicInfoResponseDTO = await this.doctocApi.getUserBasicInfo(request);
      if (response.status !== 'success' || !response.userInfo) {
        return null;
      }

      // Transformar los datos de la API al entity Doctor
      const userData = response.userInfo;
      return {
        userId: userData.userId || '',
        orgID: request.orgID,
        name: userData.name || '',
        email: userData.email || '',
        speciality: userData.speciality || '',
        photo: userData.photo || '',
        rating: 0 // No disponible en esta respuesta
      };
    } catch (error) {
      console.error('Error obteniendo información básica del doctor:', error);
      return null;
    }
  }

  /**
   * Obtiene todos los doctores de una organización
   */
  async getAllByOrganization(orgID: string): Promise<Doctor[]> {
    try {
      const request: GetOrganizationUsersRequestDTO = {
        orgID,
        sections: ['users']
      };

      const response: OrganizationUsersResponseDTO = await this.doctocApi.getOrganizationUsers(request);

      if (!response.users || response.users.length === 0) {
        return [];
      }

      // Transformar cada usuario a Doctor, filtrando solo doctores
      const doctors: Doctor[] = [];
      for (const userData of response.users) {
        if (userData.role === 'doctor' && !userData.disabled) {
          const doctor: Doctor = {
            userId: userData.uid,
            orgID: orgID,
            name: userData.name,
            email: '', // No disponible en esta respuesta
            speciality: userData.specialty,
            photo: userData.photo,
            rating: 0 // No disponible en esta respuesta
          };
          doctors.push(doctor);
        }
      }

      return doctors;
    } catch (error) {
      console.error('Error obteniendo doctores por organización:', error);
      return [];
    }
  }

  /**
   * Busca doctores por especialidad
   */
  async searchBySpecialty(orgID: string, specialty: string): Promise<Doctor[]> {
    try {
      // Primero obtenemos todas las especialidades disponibles
      const specialtiesRequest: GetOrganizationSpecialtiesRequestDTO = {
        orgID,
        sections: ['specialties']
      };

      const specialtiesResponse: OrganizationSpecialtiesResponseDTO = 
        await this.doctocApi.getOrganizationSpecialties(specialtiesRequest);

      let targetSpecialtyName: string | undefined;
      if (specialtiesResponse.specialties) {
        // Buscar la especialidad que coincida (insensible a mayúsculas)
        const foundSpecialty = specialtiesResponse.specialties.find(spec => 
          spec.name.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(spec.name.toLowerCase())
        );
        targetSpecialtyName = foundSpecialty?.name;
      }

      // Obtener todos los doctores y filtrar por especialidad
      const doctors = await this.getAllByOrganization(orgID);
      
      if (!targetSpecialtyName) {
        // Filtro directo por nombre de especialidad si no encontramos coincidencia exacta
        return doctors.filter(doctor => 
          doctor.speciality?.toLowerCase().includes(specialty.toLowerCase()) || false
        );
      }

      return doctors.filter(doctor => doctor.speciality === targetSpecialtyName);
    } catch (error) {
      console.error('Error buscando doctores por especialidad:', error);
      return [];
    }
  }

  /**
   * Obtiene información del calendario de un doctor
   */
  async getCalendarInfo(request: GetUserCalendarInfoRequestDTO): Promise<UserCalendarData | null> {
    try {
      const response: UserCalendarInfoResponseDTO = await this.doctocApi.getUserCalendarInfo(request);
      if (response.status !== 'success') {
        return null;
      }
      return response.calendar;
    } catch (error) {
      console.error('Error obteniendo información del calendario:', error);
      return null;
    }
  }

  /**
   * Actualiza información del calendario de un doctor
   */
  async updateCalendarInfo(request: UpdateUserCalendarRequestDTO): Promise<boolean> {
    try {
      const response = await this.doctocApi.updateUserCalendar(request);
      return response.status === 'success';
    } catch (error) {
      console.error('Error actualizando información del calendario:', error);
      return false;
    }
  }

  /**
   * Obtiene los tipos de consulta disponibles
   */
  async getTypes(request: GetUserTypesRequestDTO): Promise<Array<{
    typeId: string;
    name: string;
    duration?: number;
    price?: number;
    description?: string;
  }>> {
    try {
      const response: UserTypesResponseDTO = await this.doctocApi.getUserTypes(request);
      if (response.status !== 'success' || !response.types) {
        return [];
      }

      return response.types.map((tipo) => ({
        typeId: tipo.typeId,
        name: tipo.name,
        duration: tipo.duration,
        price: tipo.price,
        description: tipo.description
      }));
    } catch (error) {
      console.error('Error obteniendo tipos de consulta:', error);
      return [];
    }
  }

  /**
   * Verifica disponibilidad de un doctor
   */
  async isAvailable(
    orgID: string,
    userId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      // Obtener información del calendario del doctor
      const calendarInfo = await this.getCalendarInfo({
        action: 'get',
        orgID,
        uid: userId,
        type: 'user',
        sections: ['calendarInfo']
      });

      if (!calendarInfo) {
        return false;
      }

      // Aquí implementarías la lógica de verificación de disponibilidad
      // basada en los horarios y citas existentes
      // Por ahora, verificamos que el usuario tenga calendario configurado
      void date; void startTime; void endTime; // Para evitar warning de parámetros no usados
      return true;
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return false;
    }
  }

  /**
   * Obtiene los slots disponibles de un doctor en un rango de fechas
   */
  async getAvailableSlots(
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
    try {
      // Obtener información del calendario del doctor
      const calendarInfo = await this.getCalendarInfo({
        action: 'get',
        orgID,
        uid: userId,
        type: 'user',
        sections: ['calendarInfo']
      });

      if (!calendarInfo) {
        return [];
      }

      // Implementación básica - en producción necesitaría lógica más compleja
      // para calcular slots basada en horarios y citas existentes
      const slots: Array<{
        date: string;
        slots: Array<{
          startTime: string;
          endTime: string;
          isAvailable: boolean;
        }>;
      }> = [];

      // Para evitar warning de parámetros no usados
      void startDate; void endDate;
      
      return slots;
    } catch (error) {
      console.error('Error obteniendo slots disponibles:', error);
      return [];
    }
  }

  /**
   * Obtiene las especialidades disponibles en la organización
   */
  async getAvailableSpecialties(orgID: string): Promise<Array<{
    id: string;
    name: string;
    description?: string;
  }>> {
    try {
      const request: GetOrganizationSpecialtiesRequestDTO = {
        orgID,
        sections: ['specialties']
      };

      const response: OrganizationSpecialtiesResponseDTO = 
        await this.doctocApi.getOrganizationSpecialties(request);

      if (!response.specialties) {
        return [];
      }

      return response.specialties.map((specialty) => ({
        id: specialty.name, // Usando name como id ya que no hay id específico
        name: specialty.name,
        description: specialty.description
      }));
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
      return [];
    }
  }
}