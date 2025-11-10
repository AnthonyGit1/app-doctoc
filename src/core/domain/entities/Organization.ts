// Organization entity - Define la estructura de la organización/clínica según la API de Doctoc
export interface Organization {
  id: string;
  name: string;
  razonSocial: string;
  ruc: string;
  description: string;
  role: string;
  website: string;
  logo: string;
  socialMedia: SocialMedia;
  locations: OrganizationLocation[];
  specialties: OrganizationSpecialty[];
  doctors: OrganizationDoctor[];
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface OrganizationLocation {
  id: string;
  name: string;
  phone: string;
  isPhoneValid: boolean;
  email: string;
  country: string;
  department: string;
  district: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
  isExpanded: boolean;
}

export interface OrganizationSpecialty {
  name: string;
  description: string;
  photo: {
    name: string;
    url: string;
    type: string;
  };
}

export interface OrganizationDoctor {
  id: string;
  name: string;
  gender: string;
  role: string;
  specialty: string;
  photo: string;
  isActive: boolean;
}