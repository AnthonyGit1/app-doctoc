'use client';

import { useState, useCallback, useMemo } from 'react';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface UsePatientVerificationOptions {
  orgID: string;
}

interface UsePatientVerificationReturn {
  isLoading: boolean;
  error: string | null;
  verifyAndCreatePatient: (userData: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<string | null>; // Devuelve el patient_id o null si hay error
}

export const usePatientVerification = ({ orgID }: UsePatientVerificationOptions): UsePatientVerificationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar API usando useMemo para evitar recreación en cada render
  const api = useMemo(() => {
    return new DoctocApi(new DoctocApiClient());
  }, []);

  const verifyAndCreatePatient = useCallback(async (
    userData: { name: string; email: string; phone?: string }
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Primero, obtener TODOS los pacientes para ver qué hay
      console.log('📋 Obteniendo todos los pacientes para debugging...');
      const getAllRequest = {
        orgID,
        action: 'getAll' as const,
        limit: 50
      };

      const allPatientsResponse = await api.getAllPatients(getAllRequest);
      console.log('📋 Todos los pacientes:', allPatientsResponse);
      console.log('👤 Primeros 5 pacientes:', allPatientsResponse.patients?.slice(0, 5));
      console.log('🔍 Buscando paciente con email:', userData.email);
      
      // Buscar manualmente en todos los pacientes
      const existingPatientByEmail = allPatientsResponse.patients?.find(
        (patient: { mail?: string; email?: string; patient_id: string }) => 
          patient.mail === userData.email || patient.email === userData.email
      );
      
      if (existingPatientByEmail) {
        console.log('✅ Paciente encontrado en lista completa:', existingPatientByEmail);
        return existingPatientByEmail.patient_id;
      } else {
        throw new Error(`No se encontró paciente con email: ${userData.email}. Por favor registra al paciente primero.`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error verifying/creating patient:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [orgID, api]);

  return {
    isLoading,
    error,
    verifyAndCreatePatient
  };
};