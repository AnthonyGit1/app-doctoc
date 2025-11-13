'use client';

import { useEffect } from 'react';
import { usePatientAppointments } from '../../../hooks/usePatientAppointments';
import { API_CONFIG } from '../../../../config/constants';

export const MyAppointments = () => {
  const { 
    appointments, 
    isLoading, 
    error, 
    getMyAppointments 
  } = usePatientAppointments({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  useEffect(() => {
    getMyAppointments();
  }, [getMyAppointments]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-400">Error: {error}</p>
        <button 
          onClick={getMyAppointments}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Mis Citas</h2>
        <button 
          onClick={getMyAppointments}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Actualizar
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400">No tienes citas programadas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="bg-gray-800 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{appointment.type}</h3>
                  <p className="text-gray-400">{appointment.motive}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">
                    {new Date(appointment.scheduledStart).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-gray-400">
                    {new Date(appointment.scheduledStart).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  appointment.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                  appointment.status === 'confirmada' ? 'bg-green-500/20 text-green-400' :
                  appointment.status === 'completada' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {appointment.status.toUpperCase()}
                </span>
                
                <div className="text-gray-500">
                  <p>ID: {appointment.id}</p>
                  <p>Paciente ID: {appointment.patient}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};