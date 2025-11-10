import { PatientRepository } from '../repositories/PatientRepository';
import { Patient } from '../entities/Patient';
import { 
  CreatePatientRequestDTO,
  UpdatePatientRequestDTO 
} from '../../application/dto/patients.dto';

// Caso de uso para crear un nuevo paciente
export class CreatePatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(request: CreatePatientRequestDTO): Promise<Patient> {
    // Validaciones de negocio
    this.validatePatientRequest(request);
    
    // Verificar que no exista un paciente con el mismo DNI (si se proporciona)
    if (request.dni) {
      const existsByDNI = await this.patientRepository.existsByDNI(request.orgID, request.dni);
      if (existsByDNI) {
        throw new Error('Ya existe un paciente con este DNI');
      }
    }

    // Verificar que no exista un paciente con el mismo email (si se proporciona)
    if (request.mail) {
      const existsByEmail = await this.patientRepository.existsByEmail(request.orgID, request.mail);
      if (existsByEmail) {
        throw new Error('Ya existe un paciente con este email');
      }
    }

    // Crear el paciente
    const patient = await this.patientRepository.create(request);
    return patient;
  }

  private validatePatientRequest(request: CreatePatientRequestDTO): void {
    if (!request.orgID) {
      throw new Error('El ID de la organización es requerido');
    }
    if (!request.names) {
      throw new Error('El nombre es requerido');
    }
    if (!request.surnames) {
      throw new Error('Los apellidos son requeridos');
    }
    if (request.mail && !this.isValidEmail(request.mail)) {
      throw new Error('El formato del email no es válido');
    }
    if (request.birth_date && !this.isValidDate(request.birth_date)) {
      throw new Error('El formato de la fecha de nacimiento no es válido (YYYY-MM-DD)');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date) && !isNaN(Date.parse(date));
  }
}

// Caso de uso para actualizar un paciente
export class UpdatePatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(request: UpdatePatientRequestDTO): Promise<Patient> {
    this.validateUpdateRequest(request);

    // Si se actualiza el email, verificar que no exista otro paciente con el mismo
    if (request.mail) {
      const existsByEmail = await this.patientRepository.existsByEmail(request.orgID, request.mail);
      if (existsByEmail) {
        throw new Error('Ya existe otro paciente con este email');
      }
    }

    const patient = await this.patientRepository.update(request);
    return patient;
  }

  private validateUpdateRequest(request: UpdatePatientRequestDTO): void {
    if (!request.patient_id) {
      throw new Error('El ID del paciente es requerido para actualizar');
    }
    if (!request.orgID) {
      throw new Error('El ID de la organización es requerido');
    }
    if (request.mail && !this.isValidEmail(request.mail)) {
      throw new Error('El formato del email no es válido');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Caso de uso para buscar pacientes
export class SearchPatientsUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(orgID: string, searchTerm: string): Promise<Patient[]> {
    if (!orgID) {
      throw new Error('El ID de la organización es requerido');
    }
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
    }

    const patients = await this.patientRepository.searchByTerm({
      action: 'search',
      orgID,
      type: 'nombre',
      text: searchTerm.trim(),
      limit: 10
    });

    return patients;
  }
}

// Caso de uso para obtener un paciente por ID
export class GetPatientByIdUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(orgID: string, patientId: string): Promise<Patient | null> {
    if (!orgID || !patientId) {
      throw new Error('El ID de la organización y del paciente son requeridos');
    }

    const patient = await this.patientRepository.getById({
      action: 'search',
      orgID,
      type: 'id',
      text: patientId,
      limit: 1
    });

    return patient;
  }
}

// Caso de uso para buscar paciente por DNI
export class SearchPatientByDNIUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(orgID: string, dni: string): Promise<Patient[]> {
    if (!orgID || !dni) {
      throw new Error('El ID de la organización y el DNI son requeridos');
    }

    const patients = await this.patientRepository.searchByDNI({
      action: 'search',
      orgID,
      type: 'dni',
      text: dni.trim(),
      limit: 10
    });

    return patients;
  }
}