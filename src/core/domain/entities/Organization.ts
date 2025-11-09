// Organization entity - Define la estructura de la organización/clínica según la API de Doctoc
export interface Organization {
  orgID: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
  timezone?: string;
  locations?: OrganizationLocation[];
}

export interface OrganizationLocation {
  locationId: string;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
}