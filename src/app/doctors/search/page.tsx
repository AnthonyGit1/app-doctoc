'use client';

import SidebarLayout from '../../../presentation/components/layouts/SidebarLayout';
import { DoctorSearchForm, DoctorList } from '../../../presentation/components/features/doctor-search';
import { useSearchDoctors } from '../../../presentation/hooks/useSearchDoctors';
import { API_CONFIG } from '../../../config/constants';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function DoctorSearchPage() {
  const router = useRouter();
  
  // Usar el organizationID por defecto de la configuración
  const orgID = API_CONFIG.DEFAULT_ORG_ID;
  
  // Hook personalizado para manejar la búsqueda
  const {
    doctors,
    specialties,
    isLoading,
    error,
    searchDoctors
  } = useSearchDoctors({ orgID });

  // Handlers para las acciones de los doctores
  const handleViewProfile = (doctorId: string) => {
    router.push(`/doctors/${doctorId}/profile`);
  };

  const handleScheduleAppointment = (doctorId: string) => {
    router.push(`/appointments/schedule?doctorId=${doctorId}`);
  };

  const handleSearch = useCallback(async (searchParams: { name?: string; specialtyId?: string }) => {
    // Convertir specialtyId a specialty name para la API
    const specialtyName = searchParams.specialtyId 
      ? specialties.find(s => s.id === searchParams.specialtyId)?.name || ''
      : '';
    
    await searchDoctors({
      name: searchParams.name || '',
      specialty: specialtyName
    });
  }, [specialties, searchDoctors]);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Buscar Doctores
          </h1>
          <p className="text-gray-600">
            Encuentra el doctor perfecto para tus necesidades médicas
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <DoctorSearchForm
            specialties={specialties}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Lista de resultados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <DoctorList
            doctors={doctors}
            isLoading={isLoading}
            error={error}
            onViewProfile={handleViewProfile}
            onScheduleAppointment={handleScheduleAppointment}
          />
        </div>

        {/* Footer informativo */}
        {!isLoading && doctors.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Cómo elegir el doctor adecuado?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Revisa las especialidades
                </h4>
                <p>
                  Cada doctor tiene especialidades específicas. Asegúrate de elegir uno que se especialice en tu condición.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Verifica la disponibilidad
                </h4>
                <p>
                  Los doctores con indicador verde están disponibles para citas. Revisa sus horarios antes de agendar.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Lee los perfiles
                </h4>
                <p>
                  Conoce más sobre la experiencia y formación del doctor visitando su perfil detallado.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}