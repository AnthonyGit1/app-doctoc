'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Star } from 'lucide-react';
import { useOrganization } from '../../../presentation/hooks/useOrganization';
import { useSearchParams } from 'next/navigation';
import { Card } from '../../../presentation/components/ui/Card';
import { Input } from '../../../presentation/components/ui/Input';
import { Navigation, Footer } from '../../../presentation/components/layouts';
import { DoctocDoctorRepository } from '../../../infrastructure/repositories/DoctocDoctorRepository';
import { DoctocApi } from '../../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../../infrastructure/api/api-client';
import { API_CONFIG } from '../../../config/constants';
import { Doctor } from '../../../core/domain/entities/Doctor';

// Componente que usa useSearchParams
function BrowseDoctorsContent() {
  const { organization, specialties, locations } = useOrganization();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams?.get('specialty') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar el repositorio
  const doctorRepository = useState(() => {
    const apiClient = new DoctocApiClient(API_CONFIG.BASE_URL, API_CONFIG.AUTH_TOKEN);
    const api = new DoctocApi(apiClient);
    return new DoctocDoctorRepository(api);
  })[0];

  // Cargar doctores
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const orgId = API_CONFIG.DEFAULT_ORG_ID;
        let doctorList: Doctor[] = [];

        if (selectedSpecialty) {
          // Buscar por especialidad específica
          doctorList = await doctorRepository.searchBySpecialty(orgId, selectedSpecialty);
        } else {
          // Obtener todos los doctores
          doctorList = await doctorRepository.getAllByOrganization(orgId);
        }

        setDoctors(doctorList);
      } catch (error) {
        console.error('Error cargando doctores:', error);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, [selectedSpecialty, doctorRepository]);

  // Filtrar doctores basado en búsqueda
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = (doctor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.speciality || '').toLowerCase().includes(searchTerm.toLowerCase());
    // Nota: El filtro de ubicación se puede agregar cuando tengamos esa información en el API
    
    return matchesSearch;
  });

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation 
        organizationName={organization?.name}
        logo={organization?.logo}
      />

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Encuentra el Doctor Ideal
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Conoce a nuestros especialistas médicos certificados
          </p>
          
          {/* Call to Action */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-lg mb-4">¿Listo para agendar tu cita?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Crear Cuenta Gratis
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las especialidades</option>
              {specialties?.map((specialty, index) => (
                <option key={index} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled
            >
              <option value="">Todas las ubicaciones</option>
              {locations?.map((location, index) => (
                <option key={index} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.userId} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Doctor Image */}
                  <div className="flex items-center mb-4">
                    {doctor.photo ? (
                      <Image
                        src={doctor.photo}
                        alt={doctor.name || 'Doctor'}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          {(doctor.name || 'Dr').split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name || 'Nombre no disponible'}</h3>
                      <p className="text-blue-600 font-medium">{doctor.speciality || 'Especialidad no especificada'}</p>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">Disponible en múltiples sedes</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                      <span className="text-sm">Doctor Certificado</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href="/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Cita
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {!isLoading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron doctores
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 rounded-xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas agendar una cita?
          </h3>
          <p className="text-gray-600 mb-6">
            Regístrate gratis para acceder a todas las funcionalidades de agendamiento y gestión de citas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Crear Cuenta Gratis
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer organization={organization || undefined} />
    </div>
  );
}

// Loading fallback component
function BrowseDoctorsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white border-b border-gray-200 h-16"></div>
        
        {/* Hero skeleton */}
        <div className="bg-blue-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-8 bg-white/20 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-80 mx-auto mb-8"></div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function BrowseDoctorsPage() {
  return (
    <Suspense fallback={<BrowseDoctorsLoading />}>
      <BrowseDoctorsContent />
    </Suspense>
  );
}