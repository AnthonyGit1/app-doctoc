'use client';

import { useOrganization } from '../../hooks/useOrganization';
import { HeroSection, SpecialtiesSection, LocationsSection } from '../features/landing';
import { Navigation, Footer } from '../layouts';
import Link from 'next/link';

interface LandingPageProps {
  orgId?: string;
}

export const LandingPage = ({ orgId }: LandingPageProps) => {
  const { organization, basicInfo, locations, specialties, isLoading, error } = useOrganization(orgId);

  // Si hay error, mostrar estado de error
  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5z"/>
              <path d="M11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar la información
          </h3>
          <p className="text-gray-600 mb-4">
            No pudimos cargar la información de la organización.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navegación Superior */}
      <Navigation 
        organizationName={basicInfo?.name || organization?.name}
        logo={basicInfo?.logo || organization?.logo}
        transparent={true}
      />

      {/* Hero Section */}
      <HeroSection 
        organizationName={basicInfo?.name || organization?.name}
        description={basicInfo?.description || organization?.description}
        logo={basicInfo?.logo || organization?.logo}
        onSearchDoctors={() => window.location.href = '/doctors/browse'}
      />

      {/* Especialidades Section */}
      <section id="especialidades">
        <SpecialtiesSection 
          specialties={specialties || organization?.specialties || []}
          isLoading={isLoading}
          onSpecialtyClick={(specialty) => {
            // Redirigir a página pública de doctores con filtro
            window.location.href = `/doctors/browse?specialty=${encodeURIComponent(specialty.name)}`;
          }}
        />
      </section>

      {/* Ubicaciones Section */}
      <section id="ubicaciones">
        <LocationsSection 
          locations={locations || organization?.locations || []}
          isLoading={isLoading}
        />
      </section>

      {/* Stats & Footer CTA */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Miles de pacientes confían en nosotros. Agenda tu cita hoy mismo y únete 
            a nuestra comunidad de salud y bienestar.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {organization?.doctors?.length || '100+'}
              </div>
              <div className="text-blue-200">Doctores Especialistas</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {organization?.specialties?.length || '20+'}
              </div>
              <div className="text-blue-200">Especialidades Médicas</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {organization?.locations?.length || '5+'}
              </div>
              <div className="text-blue-200">Sedes Disponibles</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/doctors/browse"
              className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Doctores
            </Link>
            <Link
              href="/login" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Agendar Cita
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer organization={basicInfo || organization || undefined} />
    </div>
  );
};