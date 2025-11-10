import { OrganizationRepository } from '../../core/domain/repositories/OrganizationRepository';
import { Organization } from '../../core/domain/entities/Organization';
import { DoctocApi } from '../api/doctoc-api';
import { DoctocApiClient } from '../api/api-client';
import { API_CONFIG } from '../../config/constants';

export class DoctocOrganizationRepository implements OrganizationRepository {
  private api: DoctocApi;

  constructor() {
    const apiClient = new DoctocApiClient(
      API_CONFIG.BASE_URL,
      API_CONFIG.AUTH_TOKEN
    );
    this.api = new DoctocApi(apiClient);
  }

  async getOrganizationInfo(orgId: string): Promise<Organization> {
    try {
      // Obtener información básica
      const basicInfo = await this.api.getOrganizationBasicInfo({
        orgID: orgId,
        sections: ['basic']
      });

      // Obtener sedes
      const locationsInfo = await this.api.getOrganizationLocations({
        orgID: orgId,
        sections: ['sedes']
      });

      // Obtener especialidades
      const specialtiesInfo = await this.api.getOrganizationSpecialties({
        orgID: orgId,
        sections: ['specialties']
      });

      // Obtener usuarios/doctores
      const usersInfo = await this.api.getOrganizationUsers({
        orgID: orgId,
        sections: ['users']
      });

      // Mapear a entidad de dominio
      const organization: Organization = {
        id: orgId,
        name: basicInfo.org_name,
        razonSocial: basicInfo.org_razon_social,
        ruc: basicInfo.org_ruc,
        description: basicInfo.org_description,
        role: basicInfo.org_role,
        website: basicInfo.org_web,
        logo: basicInfo.org_image,
        socialMedia: basicInfo.socialMedia,
        locations: locationsInfo.sedes.map(sede => ({
          id: sede.id,
          name: sede.nombre,
          phone: sede.celular.phoneNumber,
          isPhoneValid: sede.celular.isValidNumber,
          email: sede.correo,
          country: sede.pais,
          department: sede.departamento,
          district: sede.distrito,
          address: sede.direccion,
          coordinates: sede.locationCoordinates,
          isDefault: sede.default,
          isExpanded: sede.expanded
        })),
        specialties: specialtiesInfo.specialties.map(specialty => ({
          name: specialty.name,
          description: specialty.description,
          photo: specialty.photo
        })),
        doctors: usersInfo.users
          .filter(user => !user.disabled)
          .map(user => ({
            id: user.uid,
            name: user.name,
            gender: user.gender,
            role: user.role,
            specialty: user.specialty,
            photo: user.photo,
            isActive: !user.disabled
          }))
      };

      return organization;
    } catch (error) {
      console.error('Error getting organization info:', error);
      throw new Error('Failed to get organization information');
    }
  }

  async getBasicInfo(orgId: string): Promise<Partial<Organization>> {
    try {
      const basicInfo = await this.api.getOrganizationBasicInfo({
        orgID: orgId,
        sections: ['basic']
      });

      return {
        id: orgId,
        name: basicInfo.org_name,
        razonSocial: basicInfo.org_razon_social,
        description: basicInfo.org_description,
        website: basicInfo.org_web,
        logo: basicInfo.org_image,
        socialMedia: basicInfo.socialMedia
      };
    } catch (error) {
      console.error('Error getting basic organization info:', error);
      throw new Error('Failed to get basic organization information');
    }
  }

  async getLocations(orgId: string): Promise<Organization['locations']> {
    try {
      const locationsInfo = await this.api.getOrganizationLocations({
        orgID: orgId,
        sections: ['sedes']
      });

      return locationsInfo.sedes.map(sede => ({
        id: sede.id,
        name: sede.nombre,
        phone: sede.celular.phoneNumber,
        isPhoneValid: sede.celular.isValidNumber,
        email: sede.correo,
        country: sede.pais,
        department: sede.departamento,
        district: sede.distrito,
        address: sede.direccion,
        coordinates: sede.locationCoordinates,
        isDefault: sede.default,
        isExpanded: sede.expanded
      }));
    } catch (error) {
      console.error('Error getting organization locations:', error);
      throw new Error('Failed to get organization locations');
    }
  }

  async getSpecialties(orgId: string): Promise<Organization['specialties']> {
    try {
      const specialtiesInfo = await this.api.getOrganizationSpecialties({
        orgID: orgId,
        sections: ['specialties']
      });

      return specialtiesInfo.specialties.map(specialty => ({
        name: specialty.name,
        description: specialty.description,
        photo: specialty.photo
      }));
    } catch (error) {
      console.error('Error getting organization specialties:', error);
      throw new Error('Failed to get organization specialties');
    }
  }
}