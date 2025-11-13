'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, Grid, List, User, Star } from 'lucide-react';
import { useSearchDoctors } from '../../../hooks/useSearchDoctors';
import { API_CONFIG } from '../../../../config/constants';
import type { Doctor } from '../../../../core/domain/entities/Doctor';

interface DoctorSearchSectionProps {
  orgId?: string;
}

export const DoctorSearchSection = ({ orgId = API_CONFIG.DEFAULT_ORG_ID }: DoctorSearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    doctors, 
    specialties, 
    isLoading, 
    error, 
    searchDoctors,
    getAllDoctors,
    getSpecialties
  } = useSearchDoctors({ orgID: orgId });

  // Cargar doctores y especialidades al montar el componente
  useEffect(() => {
    getAllDoctors();
    getSpecialties();
  }, [getAllDoctors, getSpecialties]);

  // Filtrado en tiempo real cuando cambia el término de búsqueda o especialidad
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() || selectedSpecialty) {
        searchDoctors({ name: searchTerm.trim(), specialty: selectedSpecialty });
      } else {
        getAllDoctors();
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialty, searchDoctors, getAllDoctors]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
  };

  const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    if (viewMode === 'list') {
      return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              {doctor.photo ? (
                <Image 
                  src={doctor.photo} 
                  alt={`Dr. ${doctor.name}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Dr. {doctor.name || 'Doctor'}
                </h3>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-gray-300">{doctor.rating || '4.8'}</span>
                </div>
              </div>
              <p className="text-green-400 font-medium mb-2">{doctor.speciality || 'Medicina General'}</p>
              <div className="flex items-center text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Consulta Médica</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                Especialista en {doctor.speciality || 'medicina general'} con amplia experiencia.
              </p>
              <Link
                href={`/doctor/${doctor.userId}/calendar`}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-700 hover:shadow-md transition-shadow">
        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            {doctor.photo ? (
              <Image 
                src={doctor.photo} 
                alt={`Dr. ${doctor.name}`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-green-400" />
            )}
          </div>
          <div className="flex items-center justify-center text-yellow-400 mb-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm text-gray-300">{doctor.rating || '4.8'}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1 text-center">
          Dr. {doctor.name || 'Doctor'}
        </h3>
        <p className="text-green-400 font-medium text-center mb-2">{doctor.speciality || 'Medicina General'}</p>
        
        <div className="flex items-center justify-center text-gray-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Consulta Médica</span>
        </div>
        
        <p className="text-gray-400 text-sm text-center mb-4 line-clamp-3">
          Especialista en {doctor.speciality || 'medicina general'} con amplia experiencia.
        </p>
        
        <Link
          href={`/doctor/${doctor.userId}/calendar`}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Ver Calendario
        </Link>
      </div>
    );
  };

  return (
    <section id="buscador-doctores" className="py-16 bg-linear-to-br from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Encuentra tu Doctor Ideal
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Busca entre nuestros especialistas médicos y agenda tu cita de forma fácil y rápida.
          </p>
        </div>

        {/* Filtros de búsqueda */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Doctor
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  </div>
                )}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Escribe para buscar doctores..."
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Especialidad
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => handleSpecialtyFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              >
                <option value="">Todas las especialidades</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vista
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg border ${
                    viewMode === 'grid'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg border ${
                    viewMode === 'list'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          {/* Contador de resultados */}
          {!isLoading && !error && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-300 font-medium">
                  {doctors.length === 0 ? (
                    searchTerm || selectedSpecialty ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        No se encontraron resultados
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Cargando doctores...
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {doctors.length} doctor{doctors.length !== 1 ? 'es' : ''} encontrado{doctors.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                {(searchTerm || selectedSpecialty) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSpecialty('');
                    }}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl border border-green-500/30 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
              <p className="text-gray-300 font-medium">Buscando doctores...</p>
              <p className="text-gray-400 text-sm mt-1">Esto solo tomará un momento</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5z"/>
                  <path d="M11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Error al cargar doctores
              </h3>
              <p className="text-gray-400 mb-6">
                No pudimos cargar la información de los doctores. Verifica tu conexión e intenta nuevamente.
              </p>
              <button 
                onClick={() => {
                  if (searchTerm || selectedSpecialty) {
                    // Trigger search again
                    setSearchTerm(searchTerm + ' ');
                    setSearchTerm(searchTerm);
                  } else {
                    getAllDoctors();
                  }
                }}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm || selectedSpecialty ? 'No se encontraron doctores' : 'No hay doctores disponibles'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedSpecialty 
                  ? `No encontramos doctores que coincidan con "${searchTerm}" ${selectedSpecialty ? `en ${selectedSpecialty}` : ''}`
                  : 'Actualmente no hay doctores disponibles en esta organización.'
                }
              </p>
              {(searchTerm || selectedSpecialty) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialty('');
                  }}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200"
                >
                  Ver todos los doctores
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {doctors.map((doctor, index) => (
                  <DoctorCard key={index} doctor={doctor} />
                ))}
              </div>
          )}
        </div>

        {/* CTA adicional */}
        <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-gray-300 mb-4">
            Contáctanos directamente y te ayudaremos a encontrar el especialista que necesitas.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Contactar Asistencia
          </Link>
        </div>
      </div>
    </section>
  );
};