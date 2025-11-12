'use client';

import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { OrganizationLocation } from '../../../../core/domain/entities/Organization';

interface LocationsSectionProps {
  locations: OrganizationLocation[];
  isLoading?: boolean;
  onLocationClick?: (location: OrganizationLocation) => void;
}

export const LocationsSection = ({ 
  locations = [], 
  isLoading = false,
  onLocationClick 
}: LocationsSectionProps) => {
  
  const handleLocationClick = (location: OrganizationLocation) => {
    if (onLocationClick) {
      onLocationClick(location);
    } else {
      // Abrir en Google Maps por defecto
      const { lat, lng } = location.coordinates;
      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
    }
  };

  const formatPhone = (phone: string) => {
    // Formato básico para teléfonos peruanos
    if (phone.length === 9 && phone.startsWith('9')) {
      return `+51 ${phone}`;
    }
    return phone;
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Nuestras Ubicaciones
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos cerca de ti. Encuentra la sede más conveniente para tu consulta médica.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6 animate-pulse bg-gray-800 border-gray-700">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="mt-4 h-10 bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {locations.map((location, index) => (
                <Card 
                  key={location.id || index}
                  className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:shadow-xl transition-all duration-300 border-t-4 border-t-green-500"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex-1">
                      {location.name}
                      {location.isDefault && (
                        <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                          Principal
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* Address */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                      <div className="text-gray-300 text-sm leading-relaxed">
                        <div>{location.address}</div>
                        <div className="text-gray-400">
                          {location.district}, {location.department}, {location.country}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    {location.phone && location.isPhoneValid && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-400 shrink-0" />
                        <a 
                          href={`tel:${location.phone}`}
                          className="text-gray-300 text-sm hover:text-green-400 transition-colors"
                        >
                          {formatPhone(location.phone)}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {location.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-400 shrink-0" />
                        <a 
                          href={`mailto:${location.email}`}
                          className="text-gray-300 text-sm hover:text-green-400 transition-colors"
                        >
                          {location.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLocationClick(location)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ver en Mapa
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Map CTA */}
            {locations.length > 0 && (
              <div className="bg-linear-to-r from-green-900/50 to-gray-800/50 rounded-2xl p-8 text-center border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Necesitas direcciones?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Todas nuestras sedes cuentan con fácil acceso y estacionamiento disponible.
                  Usa nuestro mapa interactivo para planificar tu visita.
                </p>
                <Button size="lg" className="px-8 bg-green-500 hover:bg-green-600 text-white">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Mapa Completo
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && locations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay ubicaciones disponibles
            </h3>
            <p className="text-gray-400">
              La información de ubicaciones se cargará pronto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};