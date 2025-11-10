// DTOs para la información de organización según la API de Doctoc

// =================== REQUESTS ===================

// Obtener información básica de la organización
export interface GetOrganizationBasicInfoRequestDTO {
  orgID: string;
  sections: ['basic'];
}

// Obtener sedes de la organización
export interface GetOrganizationLocationsRequestDTO {
  orgID: string;
  sections: ['sedes'];
}

// Obtener especialidades de la organización
export interface GetOrganizationSpecialtiesRequestDTO {
  orgID: string;
  sections: ['specialties'];
}

// Obtener usuarios de la organización
export interface GetOrganizationUsersRequestDTO {
  orgID: string;
  sections: ['users'];
}

// =================== RESPONSES ===================

// Respuesta de información básica
export interface OrganizationBasicInfoResponseDTO {
  org_name: string;
  org_razon_social: string;
  org_ruc: string;
  org_description: string;
  org_role: string;
  org_web: string;
  org_image: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

// Respuesta de sedes/ubicaciones
export interface OrganizationLocationsResponseDTO {
  sedes: Array<{
    id: string;
    nombre: string;
    celular: {
      phoneNumber: string;
      isValidNumber: boolean;
    };
    correo: string;
    pais: string;
    departamento: string;
    distrito: string;
    direccion: string;
    locationCoordinates: {
      lat: number;
      lng: number;
    };
    default: boolean;
    expanded: boolean;
  }>;
}

// Respuesta de especialidades
export interface OrganizationSpecialtiesResponseDTO {
  specialties: Array<{
    photo: {
      name: string;
      url: string;
      type: string;
    };
    description: string;
    name: string;
  }>;
}

// Respuesta de usuarios
export interface OrganizationUsersResponseDTO {
  users: Array<{
    uid: string;
    gender: string;
    role: string;
    name: string;
    specialty: string;
    disabled: boolean;
    photo: string;
  }>;
}