// Patient entity - Define la estructura del paciente según la API de Doctoc
export interface Patient {
  patient_id: string;
  name: string;
  names: string;
  surnames: string;
  dni?: string;
  birth_date?: string;
  gender?: 'Masculino' | 'Femenino' | 'Otro';
  phone?: string;
  mail?: string;
  image?: string;
  disabled: boolean;
  search: string[];
  created_at: number;
  updated_at: number;
  history: PatientHistoryEntry[];
}

export interface PatientHistoryEntry {
  action: 'created' | 'updated' | 'deleted';
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  userId?: string;
}