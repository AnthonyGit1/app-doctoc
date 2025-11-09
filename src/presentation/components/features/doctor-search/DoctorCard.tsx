'use client';

import Image from 'next/image';
import { Doctor } from '../../../../core/domain/entities/Doctor';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/Card';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile?: (doctorId: string) => void;
  onScheduleAppointment?: (doctorId: string) => void;
}

export function DoctorCard({ 
  doctor, 
  onViewProfile, 
  onScheduleAppointment 
}: DoctorCardProps) {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(doctor.userId);
    }
  };

  const handleScheduleAppointment = () => {
    if (onScheduleAppointment) {
      onScheduleAppointment(doctor.userId);
    }
  };

  // Función para mostrar las estrellas de rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-xl border-l-4 border-l-[#0066ff] bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          {/* Foto del doctor */}
          <div className="shrink-0">
            {doctor.photo ? (
              <Image
                src={doctor.photo}
                alt={`Dr. ${doctor.name}`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#0066ff]/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#0052cc]/20 flex items-center justify-center border-2 border-[#0066ff]/20">
                <svg
                  className="w-8 h-8 text-[#0066ff]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Información básica */}
          <div className="grow min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Dr. {doctor.name}
            </h3>
            <p className="text-[#0066ff] font-medium">
              {doctor.speciality}
            </p>
            
            {/* Rating - solo mostrar si existe y es mayor a 0 */}
            {doctor.rating && doctor.rating > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {renderStars(doctor.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        {/* Información adicional si está disponible */}
        <div className="space-y-3">
          {doctor.email && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-3 text-[#0066ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{doctor.email}</span>
            </div>
          )}

          {/* Estado de disponibilidad */}
          <div className="flex items-center text-sm">
            <div className={`w-2.5 h-2.5 rounded-full mr-3 ${
              doctor.userId ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className={
              doctor.userId ? 'text-green-700 font-medium' : 'text-gray-600'
            }>
              {doctor.userId ? 'Disponible para citas' : 'No disponible'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewProfile}
          className="flex-1 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white"
        >
          Ver perfil
        </Button>
        <Button
          size="sm"
          onClick={handleScheduleAppointment}
          className="flex-1 bg-[#0066ff] hover:bg-[#0066ff]/90"
          disabled={!doctor.userId}
        >
          Agendar cita
        </Button>
      </CardFooter>
    </Card>
  );
}
