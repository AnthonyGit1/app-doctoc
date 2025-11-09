// DTOs para la gestión de pacientes según la API de Doctoc

// =================== REQUESTS ===================

export interface CreatePatientRequestDTO {
  action: 'create';
  orgID: string;
  names: string;
  surnames: string;
  dni?: string;
  birth_date?: string; // Formato YYYY-MM-DD
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  phone?: string;
  mail?: string;
}

export interface UpdatePatientRequestDTO {
  action: 'update';
  orgID: string;
  patient_id: string;
  names?: string;
  surnames?: string;
  dni?: string;
  birth_date?: string;
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  phone?: string;
  mail?: string;
}

export interface DeletePatientRequestDTO {
  action: 'delete';
  orgID: string;
  patient_id: string;
}

// Nuevo DTO para obtener todos los pacientes
export interface GetAllPatientsRequestDTO {
  action: 'getAll';
  orgID: string;
  limit?: number;
  lastDoc?: string;
}

// Nuevos DTOs para búsqueda según la API real
export interface SearchPatientsRequestDTO {
  action: 'search';
  orgID: string;
  type: 'nombre' | 'dni' | 'telefono' | 'id' | 'pasaporte' | 'cedula_identidad' | 'carnet_extranjeria' | 'otro';
  text: string;
  limit?: number;
}

// Para compatibilidad, mantengo los DTOs específicos
export interface SearchPatientsByPhoneRequestDTO {
  action: 'search';
  orgID: string;
  type: 'telefono';
  text: string;
  limit?: number;
}

export interface SearchPatientsByDNIRequestDTO {
  action: 'search';
  orgID: string;
  type: 'dni';
  text: string;
  limit?: number;
}

export interface GetPatientByIdRequestDTO {
  action: 'search';
  orgID: string;
  type: 'id';
  text: string;
  limit?: number;
}

// =================== RESPONSES ===================

export interface CreatePatientResponseDTO {
  status: 'success' | 'error';
  action: 'create';
  patient_id: string;
  message: string;
}

export interface GetPatientsResponseDTO {
  status: 'success' | 'error';
  total: number;
  hasMore?: boolean;
  lastDoc?: string;
  patients: Array<{
    patient_id: string;
    name: string;
    names: string;
    surnames: string;
    dni?: string;
    image?: string;
    birth_date?: string;
    gender?: string;
    disabled: boolean;
    search: string[];
    created_at: number;
    mail?: string;
    updated_at?: number;
    phone?: string;
    nhc?: string;
    document_type?: string;
    document_number?: string;
    letter?: string;
    history?: Array<{
      action: 'created' | 'updated' | 'deleted';
      timestamp: {
        _seconds: number;
        _nanoseconds: number;
      };
      userId?: string;
    }>;
  }>;
}

export interface UpdatePatientResponseDTO {
  status: 'success' | 'error';
  action: 'update';
  patient_id: string;
  message: string;
}

export interface DeletePatientResponseDTO {
  status: 'success' | 'error';
  action: 'delete';
  patient_id: string;
  message: string;
}