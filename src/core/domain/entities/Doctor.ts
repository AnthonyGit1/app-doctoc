// Doctor entity - Define la estructura del doctor según las APIs de Doctoc
export interface Doctor {
  id: string;
  name: string;
  email?: string;
  speciality: string;
  photo?: string;
  rating?: number;
  // Propiedades adicionales según la API de Doctoc
}