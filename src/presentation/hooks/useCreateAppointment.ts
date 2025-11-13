'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePatientVerification } from './usePatientVerification';

interface CreateAppointmentData {
  dayKey: string;           // "10-04-2025"
  scheduledStart: string;   // "2025-04-10T20:07:00.000Z"
  scheduledEnd: string;     // "2025-04-10T21:07:00.000Z"
  userId: string;           // ID del doctor
  type: string;             // Nombre del tipo
  typeId: string;           // ID del tipo
  motive: string;           // Motivo de la consulta
  locationId: string;       // ID de la sede
}

interface CreateAppointmentRequest {
  action: 'create';
  orgID: string;
  dayKey: string;
  scheduledStart: string;
  scheduledEnd: string;
  patient: string;
  userId: string;
  type: string;
  typeId: string;
  motive: string;
  status: 'pendiente';
  version: 'v2';
  locationId: string;
  recipeID: '';
  category: 'cita';
  personaEjecutante: string;
}

interface UseCreateAppointmentOptions {
  orgID: string;
}

interface UseCreateAppointmentReturn {
  isCreating: boolean;
  error: string | null;
  createAppointment: (data: CreateAppointmentData) => Promise<boolean>;
  clearError: () => void;
}

export const useCreateAppointment = ({ orgID }: UseCreateAppointmentOptions): UseCreateAppointmentReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { verifyAndCreatePatient } = usePatientVerification({ orgID });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createAppointment = useCallback(async (data: CreateAppointmentData): Promise<boolean> => {
    if (!user) {
      setError('Usuario no autenticado');
      return false;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Primero verificar/crear el paciente
      console.log('🏥 Creando cita para usuario:', user);
      const patientId = await verifyAndCreatePatient({
        name: user.displayName || user.name || 'Usuario Sin Nombre',
        email: user.email || '',
        phone: '' // Por ahora sin teléfono hasta que se implemente en User
      });

      if (!patientId) {
        throw new Error('Error al verificar o crear el paciente');
      }

      console.log('✅ Patient ID obtenido para crear cita:', patientId);

      const request: CreateAppointmentRequest = {
        action: 'create',
        orgID,
        dayKey: data.dayKey,
        scheduledStart: data.scheduledStart,
        scheduledEnd: data.scheduledEnd,
        patient: patientId, // Usar el patient_id real, no el user.uid
        userId: data.userId,
        type: data.type,
        typeId: data.typeId,
        motive: data.motive,
        status: 'pendiente',
        version: 'v2',
        locationId: data.locationId,
        recipeID: '',
        category: 'cita',
        personaEjecutante: user.displayName || user.name || 'Usuario'
      };

      console.log('📝 Creating appointment with request:', request);

      // Usamos la API de manageQuotesAPIV2
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success || result.status === 'success') {
        return true;
      } else {
        throw new Error(result.message || 'Error al crear la cita');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear la cita';
      setError(errorMessage);
      console.error('Error creating appointment:', err);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [orgID, user, verifyAndCreatePatient]);

  return {
    isCreating,
    error,
    createAppointment,
    clearError
  };
};