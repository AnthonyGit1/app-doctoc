'use client';

import { ChevronRight, Stethoscope } from 'lucide-react';
import Image from 'next/image';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { OrganizationSpecialty } from '../../../../core/domain/entities/Organization';

interface SpecialtiesSectionProps {
  specialties: OrganizationSpecialty[];
  isLoading?: boolean;
  onSpecialtyClick?: (specialty: OrganizationSpecialty) => void;
}

export const SpecialtiesSection = ({ 
  specialties = [], 
  isLoading = false,
  onSpecialtyClick 
}: SpecialtiesSectionProps) => {
  
  // Mostrar solo las primeras 8 especialidades
  const displayedSpecialties = specialties.slice(0, 8);

  const handleSpecialtyClick = (specialty: OrganizationSpecialty) => {
    if (onSpecialtyClick) {
      onSpecialtyClick(specialty);
    } else {
      // Navegación por defecto a búsqueda de doctores con filtro de especialidad
      window.location.href = `/doctors/search?specialty=${encodeURIComponent(specialty.name)}`;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-linear-to-br from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Nuestras Especialidades
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Contamos con doctores expertos en diversas áreas médicas para brindarte 
            la mejor atención especializada que necesitas.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="p-6 animate-pulse bg-gray-800 border-gray-700">
                <div className="w-16 h-16 bg-gray-700 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Specialties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayedSpecialties.map((specialty, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-l-green-500"
                  onClick={() => handleSpecialtyClick(specialty)}
                >
                  {/* Icon/Image */}
                  <div className="mb-4">
                    {specialty.photo?.url ? (
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                        <Image
                          src={specialty.photo.url}
                          alt={specialty.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                        <Stethoscope className="w-8 h-8 text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {specialty.name}
                  </h3>
                  
                  {specialty.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {specialty.description}
                    </p>
                  )}

                  {/* Action */}
                  <div className="flex items-center text-green-400 text-sm font-medium group-hover:text-green-300">
                    Ver doctores
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={() => {
                  const element = document.getElementById('buscador-doctores');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 text-lg bg-green-500 hover:bg-green-600 text-white"
              >
                Ver Todas las Especialidades
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && specialties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay especialidades disponibles
            </h3>
            <p className="text-gray-600">
              Las especialidades se cargarán pronto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};