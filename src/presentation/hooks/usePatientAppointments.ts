'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePatientVerification } from './usePatientVerification';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface PatientAppointment {
  id: string;
  patient: string;
  medico: string;
  scheduledStart: string;
  scheduledEnd: string;
  type: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  date?: string;
  startDate?: string;
  endDate?: string;
  patientId?: string;
  userId?: string;
  version?: string;
  locationId?: string;
  history?: Array<{
    action: string;
    timestamp: {
      _seconds: number;
      _nanoseconds: number;
    };
    userId?: string;
  }>;
  recipeID?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}



interface UsePatientAppointmentsOptions {
  orgID: string;
}

interface UsePatientAppointmentsReturn {
  appointments: PatientAppointment[];
  isLoading: boolean;
  error: string | null;
  getMyAppointments: () => Promise<boolean>;
  refreshAppointments: () => Promise<void>;
}

export const usePatientAppointments = ({ orgID }: UsePatientAppointmentsOptions): UsePatientAppointmentsReturn => {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { verifyAndCreatePatient } = usePatientVerification({ orgID });
  
  // Configurar API usando useMemo para evitar recreación en cada render
  const api = useMemo(() => {
    return new DoctocApi(new DoctocApiClient());
  }, []);

  const getMyAppointments = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('Usuario no autenticado');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Primero obtener el patient_id correcto
      const patientId = await verifyAndCreatePatient({
        name: user.displayName || user.name || 'Usuario',
        email: user.email || '',
        phone: ''
      });

      if (!patientId) {
        throw new Error('No se pudo obtener el ID del paciente');
      }

      console.log('🔍 Buscando citas para paciente:', patientId);
      console.log('📧 Email del usuario:', user.email);
      console.log('👤 Datos del usuario:', { name: user.displayName || user.name, email: user.email });

      // Obtener las citas del paciente usando la API directamente
      const result = await api.getPatientAppointments({
        orgID,
        patientID: patientId
      });

      console.log('📋 Resultado de getPatientAppointments:', result);
      
      if (result.status === 'success') {
        // Mapear los datos al formato esperado por la interfaz
        const mappedAppointments: PatientAppointment[] = (result.quotes || []).map(quote => ({
          id: quote.id,
          patient: quote.patientId, // En la respuesta es patientId
          medico: quote.userId, // En la respuesta es userId (del doctor)
          scheduledStart: quote.startDate, // En la respuesta es startDate
          scheduledEnd: quote.endDate, // En la respuesta es endDate
          type: quote.type,
          motive: quote.motive,
          status: quote.status as PatientAppointment['status'],
          date: quote.date,
          startDate: quote.startDate,
          endDate: quote.endDate,
          patientId: quote.patientId,
          userId: quote.userId,
          version: quote.version,
          locationId: quote.locationId,
          history: quote.history,
          recipeID: quote.recipeID,
          createdAt: quote.createdAt
        }));
        
        setAppointments(mappedAppointments);
        return true;
      } else {
        throw new Error('Error al obtener las citas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error getting patient appointments:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [orgID, user, verifyAndCreatePatient, api]);

  const refreshAppointments = useCallback(async () => {
    await getMyAppointments();
  }, [getMyAppointments]);

  return {
    appointments,
    isLoading,
    error,
    getMyAppointments,
    refreshAppointments
  };
};