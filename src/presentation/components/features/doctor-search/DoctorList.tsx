'use client';

import { useState } from 'react';
import { Doctor } from '../../../../core/domain/entities/Doctor';
import { DoctorCard } from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
  isLoading?: boolean;
  error?: string | null;
  onViewProfile?: (doctorId: string) => void;
  onScheduleAppointment?: (doctorId: string) => void;
}

type SortOption = 'name' | 'specialty' | 'rating' | 'availability';

export function DoctorList({
  doctors,
  isLoading = false,
  error = null,
  onViewProfile,
  onScheduleAppointment
}: DoctorListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Función para ordenar doctores
  const sortDoctors = (doctors: Doctor[], sortBy: SortOption): Doctor[] => {
    return [...doctors].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'specialty':
          return (a.speciality || '').localeCompare(b.speciality || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'availability':
          // Doctores disponibles primero
          if (a.userId && !b.userId) return -1;
          if (!a.userId && b.userId) return 1;
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });
  };

  const sortedDoctors = sortDoctors(doctors, sortBy);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };
  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando doctores...</p>
          </div>
        </div>
        
        {/* Skeleton cards mientras carga */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="grow min-w-0">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar doctores
          </h3>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0066ff]/90 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Estado vacío - no hay doctores
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron doctores
          </h3>
          <p className="text-gray-600 mb-4">
            No hay doctores que coincidan con tu búsqueda. Intenta con diferentes criterios.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Verifica la ortografía</p>
            <p>• Intenta con términos más generales</p>
            <p>• Prueba con una especialidad diferente</p>
          </div>
        </div>
      </div>
    );
  }

  // Lista de doctores
  return (
    <div className="space-y-8 p-6">
      {/* Encabezado con resultados */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {sortedDoctors.length === 1 
            ? '1 doctor encontrado'
            : `${sortedDoctors.length} doctores encontrados`
          }
        </h3>
        
        {/* Opciones de ordenamiento */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:border-[#0066ff] focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700 min-w-[140px]"
          >
            <option value="name">Nombre</option>
            <option value="specialty">Especialidad</option>
            <option value="rating">Rating</option>
            <option value="availability">Disponibilidad</option>
          </select>
        </div>
      </div>

      {/* Grid de cards de doctores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.userId}
            doctor={doctor}
            onViewProfile={onViewProfile}
            onScheduleAppointment={onScheduleAppointment}
          />
        ))}
      </div>

      {/* Información de resultados */}
      {sortedDoctors.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="text-sm text-gray-500">
            Mostrando {sortedDoctors.length} resultado{sortedDoctors.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}