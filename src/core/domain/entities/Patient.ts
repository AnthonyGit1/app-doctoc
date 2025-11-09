// Patient entity - Define la estructura del paciente
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // Propiedades adicionales según los requisitos
}