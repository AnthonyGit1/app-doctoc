'use client';

import React, { useState, useEffect } from 'react';

interface Specialty {
  id: string;
  name: string;
}

interface SearchFilters {
  name?: string;
  specialtyId?: string;
}

interface DoctorSearchFormProps {
  specialties: Specialty[];
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export const DoctorSearchForm: React.FC<DoctorSearchFormProps> = ({
  specialties,
  onSearch,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Búsqueda automática cuando cambian los valores
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch({
        name: searchTerm,
        specialtyId: selectedSpecialty,
      });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialty, onSearch]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Buscar Doctores
      </h2>
      
      <div className="space-y-4">
        {/* Campo de búsqueda por nombre */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar doctor por nombre..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Selector de especialidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especialidad
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff] focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">Todas las especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>

        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0066ff]"></div>
            <span className="ml-2 text-gray-600">Buscando...</span>
          </div>
        )}

        {/* Botón para limpiar */}
        {(searchTerm || selectedSpecialty) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('');
            }}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};