'use client';

import { useState, useCallback, useMemo } from 'react';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  distrito?: string;
  departamento?: string;
  default: boolean;
}

interface OrganizationResponse {
  sedes: Sede[];
}

interface UseOrganizationSedesOptions {
  orgID: string;
}

interface UseOrganizationSedesReturn {
  sedes: Sede[];
  isLoading: boolean;
  error: string | null;
  getSedes: () => Promise<void>;
}

export const useOrganizationSedes = ({ orgID }: UseOrganizationSedesOptions): UseOrganizationSedesReturn => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar API usando useMemo para evitar recreación en cada render
  const api = useMemo(() => {
    return new DoctocApi(new DoctocApiClient());
  }, []);

  const getSedes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const request = {
        orgID,
        sections: ['sedes'] as ['sedes']
      };

      const response = await api.getOrganizationLocations(request);
      
      if (response && typeof response === 'object' && 'sedes' in response) {
        const organizationData = response as OrganizationResponse;
        setSedes(organizationData.sedes || []);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching sedes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orgID, api]);

  return {
    sedes,
    isLoading,
    error,
    getSedes
  };
};