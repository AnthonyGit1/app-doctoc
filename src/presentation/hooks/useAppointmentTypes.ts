'use client';

import { useState, useCallback, useMemo } from 'react';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  appointmentType: string;
  durationMinutes: number;
  price: number;
  color: string;
  externalVisibility: boolean;
  isDefault: boolean;
  createdAt: string;
  createdBy: string;
  updatedBy?: string;
  updatedAt?: string;
}

interface ApiTypesResponse {
  tipos: AppointmentType[];
}

interface UseAppointmentTypesOptions {
  orgID: string;
}

interface UseAppointmentTypesReturn {
  types: AppointmentType[];
  isLoading: boolean;
  error: string | null;
  getTypes: () => Promise<void>;
}

export const useAppointmentTypes = ({ orgID }: UseAppointmentTypesOptions): UseAppointmentTypesReturn => {
  const [types, setTypes] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => {
    return new DoctocApi(new DoctocApiClient());
  }, []);

  const getTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const request: { action: 'get'; orgID: string; sections: ['tipos'] } = {
        action: 'get',
        orgID,
        sections: ['tipos']
      };

      const response = await api.getUserTypes(request) as unknown as ApiTypesResponse;
      
      if (response && response.tipos) {
        // Filtrar solo los tipos visibles externamente para pacientes
        const visibleTypes = response.tipos.filter(type => type.externalVisibility);
        setTypes(visibleTypes);
      } else {
        throw new Error('No se pudieron cargar los tipos de citas');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar tipos';
      setError(errorMessage);
      console.error('Error fetching appointment types:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orgID, api]);

  return {
    types,
    isLoading,
    error,
    getTypes
  };
};