'use client';

import { useState, useCallback } from 'react';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface BusyRange {
  start: string;
  end: string;
}

interface GetDayQuotesResponse {
  status: string;
  busy_ranges?: BusyRange[];
}

interface UseBusyRangesProps {
  orgID: string;
}

export const useBusyRanges = ({ orgID }: UseBusyRangesProps) => {
  const [busyRanges, setBusyRanges] = useState<BusyRange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBusyRanges = useCallback(async (dayKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiClient = new DoctocApiClient();
      const endpoint = 'getDayQuotesAPIV2';
      
      const requestBody = {
        orgID,
        dayKey, // formato DD-MM-YYYY
        format: 'busy_ranges'
      };

      const response = await apiClient.post<typeof requestBody, GetDayQuotesResponse>(endpoint, requestBody);

      if (response.status === 'success') {
        setBusyRanges(response.busy_ranges || []);
        return response.busy_ranges || [];
      } else {
        throw new Error('Error al obtener los horarios ocupados');
      }
    } catch (err) {
      console.error('Error fetching busy ranges:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener los horarios ocupados';
      setError(errorMessage);
      setBusyRanges([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [orgID]);

  const clearBusyRanges = useCallback(() => {
    setBusyRanges([]);
    setError(null);
  }, []);

  // Función para verificar si un slot específico está ocupado
  const isTimeSlotBusy = useCallback((date: string, time: string): boolean => {
    if (busyRanges.length === 0) return false;

    // Crear el datetime del slot
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const slotDateTime = new Date(year, month - 1, day, hours, minutes);
    const slotStart = slotDateTime.getTime();
    const slotEnd = slotStart + (30 * 60 * 1000); // 30 minutos después

    // Verificar si el slot se superpone con algún rango ocupado
    return busyRanges.some(range => {
      const busyStart = new Date(range.start).getTime();
      const busyEnd = new Date(range.end).getTime();
      
      // Verificar superposición: el slot inicia antes de que termine el rango ocupado
      // y termina después de que inicie el rango ocupado
      return slotStart < busyEnd && slotEnd > busyStart;
    });
  }, [busyRanges]);

  return {
    busyRanges,
    isLoading,
    error,
    getBusyRanges,
    clearBusyRanges,
    isTimeSlotBusy
  };
};