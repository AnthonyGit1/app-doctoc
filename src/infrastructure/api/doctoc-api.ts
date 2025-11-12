import { DoctocApiClient } from './api-client';
import { API_ENDPOINTS } from '../../config/constants';
import {
  CreateAppointmentRequestDTO,
  UpdateAppointmentRequestDTO,
  CancelAppointmentRequestDTO,
  GetPatientAppointmentsRequestDTO,
  GetDayAppointmentsRequestDTO,
  GetAppointmentByIdRequestDTO,
  GetUserAppointmentsByDayRequestDTO,
  GetDoctorOccupiedSlotsRequestDTO,
  CreateAppointmentResponseDTO,
  GetAppointmentsResponseDTO,
  GetDoctorOccupiedSlotsResponseDTO
} from '../../core/application/dto/appointments.dto';
import {
  CreatePatientRequestDTO,
  UpdatePatientRequestDTO,
  DeletePatientRequestDTO,
  GetAllPatientsRequestDTO,
  SearchPatientsRequestDTO,
  SearchPatientsByPhoneRequestDTO,
  SearchPatientsByDNIRequestDTO,
  GetPatientByIdRequestDTO,
  CreatePatientResponseDTO,
  GetPatientsResponseDTO,
  UpdatePatientResponseDTO,
  DeletePatientResponseDTO
} from '../../core/application/dto/patients.dto';
import {
  GetUserBasicInfoRequestDTO,
  GetUserCalendarInfoRequestDTO,
  GetUserTypesRequestDTO,
  UpdateUserCalendarRequestDTO,
  UpdateFixedScheduleWithTypesRequestDTO,
  UpdateFixedScheduleWithoutTypesRequestDTO,
  UpdateDynamicScheduleWithoutTypesRequestDTO,
  UpdateDynamicScheduleWithTypesRequestDTO,
  UpdateAssociatedTypesRequestDTO,
  UserBasicInfoResponseDTO,
  UserCalendarInfoResponseDTO,
  UserTypesResponseDTO
} from '../../core/application/dto/doctors.dto';
import {
  GetOrganizationBasicInfoRequestDTO,
  GetOrganizationLocationsRequestDTO,
  GetOrganizationSpecialtiesRequestDTO,
  GetOrganizationUsersRequestDTO,
  OrganizationBasicInfoResponseDTO,
  OrganizationLocationsResponseDTO,
  OrganizationSpecialtiesResponseDTO,
  OrganizationUsersResponseDTO
} from '../../core/application/dto/organization.dto';
import {
  GetAllPricesRequestDTO,
  GetPriceCategoriesRequestDTO,
  GetPricesByCategoryRequestDTO,
  GetPricesAndCategoriesRequestDTO,
  GetAllPricesResponseDTO,
  GetPriceCategoriesResponseDTO,
  GetPricesByCategoryResponseDTO,
  GetPricesAndCategoriesResponseDTO
} from '../../core/application/dto/pricing.dto';
import {
  CreatePaymentRequestDTO,
  GetPatientPaymentsRequestDTO,
  GetDayPaymentsRequestDTO,
  CreatePaymentResponseDTO,
  GetPatientPaymentsResponseDTO,
  GetDayPaymentsResponseDTO
} from '../../core/application/dto/payments.dto';

// Implementación específica de las APIs de Doctoc
export class DoctocApi {
  private client: DoctocApiClient;

  constructor(client: DoctocApiClient) {
    this.client = client;
  }

  // =================== GESTIÓN DE CITAS ===================

  async createAppointment(request: CreateAppointmentRequestDTO): Promise<CreateAppointmentResponseDTO> {
    return this.client.post<CreateAppointmentRequestDTO, CreateAppointmentResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.MANAGE,
      request
    );
  }

  async updateAppointment(request: UpdateAppointmentRequestDTO): Promise<CreateAppointmentResponseDTO> {
    return this.client.post<UpdateAppointmentRequestDTO, CreateAppointmentResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.MANAGE,
      request
    );
  }

  async cancelAppointment(request: CancelAppointmentRequestDTO): Promise<{ status: string; action: string; quoteID: string }> {
    return this.client.post<CancelAppointmentRequestDTO, { status: string; action: string; quoteID: string }>(
      API_ENDPOINTS.APPOINTMENTS.MANAGE,
      request
    );
  }

  async getPatientAppointments(request: GetPatientAppointmentsRequestDTO): Promise<GetAppointmentsResponseDTO> {
    return this.client.post<GetPatientAppointmentsRequestDTO, GetAppointmentsResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.GET_PATIENT,
      request
    );
  }

  async getDayAppointments(request: GetDayAppointmentsRequestDTO): Promise<GetAppointmentsResponseDTO> {
    return this.client.post<GetDayAppointmentsRequestDTO, GetAppointmentsResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.GET_DAY,
      request
    );
  }

  async getDoctorOccupiedSlots(request: GetDoctorOccupiedSlotsRequestDTO): Promise<GetDoctorOccupiedSlotsResponseDTO> {
    return this.client.post<GetDoctorOccupiedSlotsRequestDTO, GetDoctorOccupiedSlotsResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.GET_DAY,
      request
    );
  }

  // Método específico para obtener slots ocupados de todos los doctores en un día
  async getAllOccupiedSlots(orgID: string, dayKey: string): Promise<GetDoctorOccupiedSlotsResponseDTO> {
    return this.getDoctorOccupiedSlots({
      orgID,
      dayKey,
      format: 'busy_ranges'
    });
  }

  // Método específico para obtener slots ocupados de un doctor específico
  async getDoctorSpecificOccupiedSlots(orgID: string, dayKey: string, userId: string): Promise<GetDoctorOccupiedSlotsResponseDTO> {
    return this.getDoctorOccupiedSlots({
      orgID,
      dayKey,
      userId,
      format: 'busy_ranges'
    });
  }

  // Método específico para obtener una cita por ID
  async getAppointmentById(request: GetAppointmentByIdRequestDTO): Promise<GetAppointmentsResponseDTO> {
    return this.client.post<GetAppointmentByIdRequestDTO, GetAppointmentsResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.GET_DAY,
      request
    );
  }

  // Método específico para obtener todas las citas de un usuario en un día
  async getUserAppointmentsByDay(request: GetUserAppointmentsByDayRequestDTO): Promise<GetAppointmentsResponseDTO> {
    return this.client.post<GetUserAppointmentsByDayRequestDTO, GetAppointmentsResponseDTO>(
      API_ENDPOINTS.APPOINTMENTS.GET_DAY,
      request
    );
  }

  // =================== GESTIÓN DE PACIENTES ===================

  async createPatient(request: CreatePatientRequestDTO): Promise<CreatePatientResponseDTO> {
    return this.client.post<CreatePatientRequestDTO, CreatePatientResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE,
      request
    );
  }

  async updatePatient(request: UpdatePatientRequestDTO): Promise<UpdatePatientResponseDTO> {
    return this.client.post<UpdatePatientRequestDTO, UpdatePatientResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE, // Usar el endpoint principal
      request
    );
  }

  async deletePatient(request: DeletePatientRequestDTO): Promise<DeletePatientResponseDTO> {
    return this.client.post<DeletePatientRequestDTO, DeletePatientResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE_SINGLE,
      request
    );
  }

  async getAllPatients(request: GetAllPatientsRequestDTO): Promise<GetPatientsResponseDTO> {
    return this.client.post<GetAllPatientsRequestDTO, GetPatientsResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE,
      request
    );
  }

  async searchPatients(request: SearchPatientsRequestDTO): Promise<GetPatientsResponseDTO> {
    return this.client.post<SearchPatientsRequestDTO, GetPatientsResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE,
      request
    );
  }

  async searchPatientsByPhone(request: SearchPatientsByPhoneRequestDTO): Promise<GetPatientsResponseDTO> {
    return this.client.post<SearchPatientsByPhoneRequestDTO, GetPatientsResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE, // Corregido: usar el endpoint correcto
      request
    );
  }

  async searchPatientsByDNI(request: SearchPatientsByDNIRequestDTO): Promise<GetPatientsResponseDTO> {
    return this.client.post<SearchPatientsByDNIRequestDTO, GetPatientsResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE, // Corregido: usar el endpoint correcto
      request
    );
  }

  async getPatientById(request: GetPatientByIdRequestDTO): Promise<GetPatientsResponseDTO> {
    return this.client.post<GetPatientByIdRequestDTO, GetPatientsResponseDTO>(
      API_ENDPOINTS.PATIENTS.MANAGE, // Corregido: usar el endpoint correcto
      request
    );
  }

  // =================== GESTIÓN DE USUARIOS/DOCTORES ===================

  async getUserBasicInfo(request: GetUserBasicInfoRequestDTO): Promise<UserBasicInfoResponseDTO> {
    return this.client.post<GetUserBasicInfoRequestDTO, UserBasicInfoResponseDTO>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  async getUserCalendarInfo(request: GetUserCalendarInfoRequestDTO): Promise<UserCalendarInfoResponseDTO> {
    return this.client.post<GetUserCalendarInfoRequestDTO, UserCalendarInfoResponseDTO>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  async getUserTypes(request: GetUserTypesRequestDTO): Promise<UserTypesResponseDTO> {
    return this.client.post<GetUserTypesRequestDTO, UserTypesResponseDTO>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  async updateUserCalendar(request: UpdateUserCalendarRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateUserCalendarRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método específico para obtener información de tipos
  async getUserTypesInfo(request: GetUserTypesRequestDTO): Promise<UserTypesResponseDTO> {
    return this.client.post<GetUserTypesRequestDTO, UserTypesResponseDTO>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método para horarios fijos con tipos
  async updateFixedScheduleWithTypes(request: UpdateFixedScheduleWithTypesRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateFixedScheduleWithTypesRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método para horarios fijos sin tipos
  async updateFixedScheduleWithoutTypes(request: UpdateFixedScheduleWithoutTypesRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateFixedScheduleWithoutTypesRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método para horarios dinámicos sin tipos
  async updateDynamicScheduleWithoutTypes(request: UpdateDynamicScheduleWithoutTypesRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateDynamicScheduleWithoutTypesRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método para horarios dinámicos con tipos
  async updateDynamicScheduleWithTypes(request: UpdateDynamicScheduleWithTypesRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateDynamicScheduleWithTypesRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // Método para tipos asociados
  async updateAssociatedTypes(request: UpdateAssociatedTypesRequestDTO): Promise<{ status: string; message: string }> {
    return this.client.post<UpdateAssociatedTypesRequestDTO, { status: string; message: string }>(
      API_ENDPOINTS.USERS.MANAGE_INFO,
      request
    );
  }

  // =================== INFORMACIÓN DE ORGANIZACIÓN ===================

  async getOrganizationBasicInfo(request: GetOrganizationBasicInfoRequestDTO): Promise<OrganizationBasicInfoResponseDTO> {
    return this.client.post<GetOrganizationBasicInfoRequestDTO, OrganizationBasicInfoResponseDTO>(
      API_ENDPOINTS.ORGANIZATION.GET_INFO,
      request
    );
  }

  async getOrganizationLocations(request: GetOrganizationLocationsRequestDTO): Promise<OrganizationLocationsResponseDTO> {
    return this.client.post<GetOrganizationLocationsRequestDTO, OrganizationLocationsResponseDTO>(
      API_ENDPOINTS.ORGANIZATION.GET_INFO,
      request
    );
  }

  async getOrganizationSpecialties(request: GetOrganizationSpecialtiesRequestDTO): Promise<OrganizationSpecialtiesResponseDTO> {
    return this.client.post<GetOrganizationSpecialtiesRequestDTO, OrganizationSpecialtiesResponseDTO>(
      API_ENDPOINTS.ORGANIZATION.GET_INFO,
      request
    );
  }

  async getOrganizationUsers(request: GetOrganizationUsersRequestDTO): Promise<OrganizationUsersResponseDTO> {
    return this.client.post<GetOrganizationUsersRequestDTO, OrganizationUsersResponseDTO>(
      API_ENDPOINTS.ORGANIZATION.GET_INFO,
      request
    );
  }

  // =================== GESTIÓN DE PRECIOS ===================

  async getAllPrices(request: GetAllPricesRequestDTO): Promise<GetAllPricesResponseDTO> {
    return this.client.post<GetAllPricesRequestDTO, GetAllPricesResponseDTO>(
      API_ENDPOINTS.PRICES.GET,
      request
    );
  }

  async getPriceCategories(request: GetPriceCategoriesRequestDTO): Promise<GetPriceCategoriesResponseDTO> {
    return this.client.post<GetPriceCategoriesRequestDTO, GetPriceCategoriesResponseDTO>(
      API_ENDPOINTS.PRICES.GET,
      request
    );
  }

  async getPricesByCategory(request: GetPricesByCategoryRequestDTO): Promise<GetPricesByCategoryResponseDTO> {
    return this.client.post<GetPricesByCategoryRequestDTO, GetPricesByCategoryResponseDTO>(
      API_ENDPOINTS.PRICES.GET,
      request
    );
  }

  async getPricesAndCategories(request: GetPricesAndCategoriesRequestDTO): Promise<GetPricesAndCategoriesResponseDTO> {
    return this.client.post<GetPricesAndCategoriesRequestDTO, GetPricesAndCategoriesResponseDTO>(
      API_ENDPOINTS.PRICES.GET,
      request
    );
  }

  // =================== GESTIÓN DE PAGOS ===================

  async createPayment(request: CreatePaymentRequestDTO): Promise<CreatePaymentResponseDTO> {
    return this.client.post<CreatePaymentRequestDTO, CreatePaymentResponseDTO>(
      API_ENDPOINTS.PAYMENTS.MANAGE,
      request
    );
  }

  async getPatientPayments(request: GetPatientPaymentsRequestDTO): Promise<GetPatientPaymentsResponseDTO> {
    return this.client.post<GetPatientPaymentsRequestDTO, GetPatientPaymentsResponseDTO>(
      API_ENDPOINTS.PAYMENTS.GET_PATIENT,
      request
    );
  }

  async getDayPayments(request: GetDayPaymentsRequestDTO): Promise<GetDayPaymentsResponseDTO> {
    return this.client.post<GetDayPaymentsRequestDTO, GetDayPaymentsResponseDTO>(
      API_ENDPOINTS.PAYMENTS.GET_DAY,
      request
    );
  }
}