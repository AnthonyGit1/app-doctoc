'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navigation, Footer } from '../../../../presentation/components/layouts';
import { DoctorBookingSystem } from '../../../../presentation/components/features/doctor-calendar/DoctorBookingSystem';
import { useDoctorCalendar } from '../../../../presentation/hooks/useDoctorCalendar';
import { API_CONFIG } from '../../../../config/constants';

export default function CalendarPage() {
  const params = useParams();
  const doctorId = params?.doctorId as string;

  const { calendarData, isLoading, error, getDoctorCalendar } = useDoctorCalendar({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  useEffect(() => {
    if (doctorId) {
      getDoctorCalendar(doctorId);
    }
  }, [doctorId, getDoctorCalendar]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl border border-green-500/30 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
            <p className="text-white font-medium">Cargando información del doctor...</p>
            <p className="text-gray-400 text-sm mt-1">Esto solo tomará un momento</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !calendarData?.datosCalendarioCompletos) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5z"/>
                <path d="M11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Error al cargar el calendario
            </h1>
            <p className="text-gray-400 mb-6">
              {error || 'No se pudo cargar la información del doctor'}
            </p>
            <button 
              onClick={() => getDoctorCalendar(doctorId)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-900 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorBookingSystem 
            doctor={calendarData.datosCalendarioCompletos.doctor}
            horarios={calendarData.datosCalendarioCompletos.horarios}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}