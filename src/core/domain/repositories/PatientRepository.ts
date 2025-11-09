import { Patient } from '../entities/Patient';
import {
  CreatePatientRequestDTO,
  UpdatePatientRequestDTO,
  DeletePatientRequestDTO,
  GetAllPatientsRequestDTO,
  SearchPatientsRequestDTO,
  SearchPatientsByPhoneRequestDTO,
  SearchPatientsByDNIRequestDTO,
  GetPatientByIdRequestDTO
} from '../../application/dto/patients.dto';

// Repository interface para la gestión de pacientes
export interface PatientRepository {
  // Operaciones CRUD principales
  create(request: CreatePatientRequestDTO): Promise<Patient>;
  update(request: UpdatePatientRequestDTO): Promise<Patient>;
  delete(request: DeletePatientRequestDTO): Promise<boolean>;
  
  // Consultas y búsquedas
  getAll(request: GetAllPatientsRequestDTO): Promise<Patient[]>;
  getById(request: GetPatientByIdRequestDTO): Promise<Patient | null>;
  
  // Búsquedas específicas
  searchByTerm(request: SearchPatientsRequestDTO): Promise<Patient[]>;
  searchByPhone(request: SearchPatientsByPhoneRequestDTO): Promise<Patient[]>;
  searchByDNI(request: SearchPatientsByDNIRequestDTO): Promise<Patient[]>;
  
  // Validaciones
  existsByDNI(orgID: string, dni: string): Promise<boolean>;
  existsByEmail(orgID: string, email: string): Promise<boolean>;
  existsByPhone(orgID: string, phone: string): Promise<boolean>;
}