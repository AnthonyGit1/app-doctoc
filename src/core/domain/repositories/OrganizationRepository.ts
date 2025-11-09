import { Organization } from '../entities/Organization';
import {
  GetOrganizationBasicInfoRequestDTO,
  GetOrganizationLocationsRequestDTO
} from '../../application/dto/organization.dto';

// Repository interface para la gestión de información de organizaciones
export interface OrganizationRepository {
  // Información básica de la organización
  getBasicInfo(request: GetOrganizationBasicInfoRequestDTO): Promise<Organization | null>;
  
  // Gestión de sedes/locaciones
  getLocations(request: GetOrganizationLocationsRequestDTO): Promise<Array<{
    locationId: string;
    name: string;
    address?: string;
    phone?: string;
    description?: string;
    isActive?: boolean;
  }>>;
  
  // Consultas específicas
  getAllOrganizations(): Promise<Organization[]>;
  exists(orgID: string): Promise<boolean>;
}