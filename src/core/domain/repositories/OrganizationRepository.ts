import { Organization } from '../entities/Organization';

// Repository interface para la gestión de información de organizaciones
export interface OrganizationRepository {
  // Obtener información completa de la organización
  getOrganizationInfo(orgId: string): Promise<Organization>;
  
  // Obtener solo información básica
  getBasicInfo(orgId: string): Promise<Partial<Organization>>;
  
  // Obtener sedes/ubicaciones
  getLocations(orgId: string): Promise<Organization['locations']>;
  
  // Obtener especialidades
  getSpecialties(orgId: string): Promise<Organization['specialties']>;
}