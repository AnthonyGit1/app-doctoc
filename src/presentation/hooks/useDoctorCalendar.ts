'use client';

import { useState, useCallback, useMemo } from 'react';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';
import type { GetUserCalendarInfoRequestDTO } from '../../core/application/dto/doctors.dto';

// Interfaces para la respuesta real de la API
interface ApiSchedule {
  id: number;
  start: string;
  end: string;
}

interface ApiDynamicSchedule {
  id: number;
  startDate: string;
  endDate: string;
  daySchedules: {
    [date: string]: ApiSchedule[];
  };
}

interface ApiSedeSchedule {
  default: {
    horariesFijo: {
      [day: string]: ApiSchedule[];
    };
    horariesDinamico: ApiDynamicSchedule[];
  };
}

interface ApiCalendarResponse {
  calendarInfo: {
    id: string;
    name: string;
    updatedAt: string;
    visibility: {
      internal: boolean;
      external: boolean;
    };
    horarios: {
      [sedeId: string]: ApiSedeSchedule;
    };
    exeptionsBlock: Array<{
      date: string;
      isFullDay: boolean;
      timeBlocks?: Array<{
        startTime: string;
        endTime: string;
      }>;
      reason?: string;
    }>;
    paymentMethods: Record<string, unknown>;
    customPrices: Record<string, number>;
    associatedTypes: Record<string, number>;
  };
}

interface DoctorCalendarData {
  datosCalendarioCompletos?: {
    doctor: {
      id: string;
      name: string;
    };
    info: {
      updatedAt?: string;
      isPublic?: boolean;
    };
    horarios: {
      fijos?: {
        [day: string]: Array<{
          startTime: string;
          endTime: string;
          sedeId: string;
          sedeName: string;
        }>;
      };
      dinamicos?: Array<{
        startDate: string;
        endDate: string;
        description?: string;
        horarios: {
          [day: string]: Array<{
            startTime: string;
            endTime: string;
            sedeId: string;
            sedeName: string;
          }>;
        };
      }>;
    };
    exeptionsBlock?: Array<{
      date: string;
      isFullDay: boolean;
      timeBlocks?: Array<{
        startTime: string;
        endTime: string;
      }>;
      reason?: string;
    }>;
    paymentMethods?: {
      yapeNumbers?: Array<{
        name: string;
        number: string;
      }>;
    };
    customPrices?: {
      [typeId: string]: number;
    };
    associatedTypes?: {
      [typeId: string]: number;
    };
  };
}

interface UseDoctorCalendarOptions {
  orgID: string;
}

interface UseDoctorCalendarReturn {
  calendarData: DoctorCalendarData | null;
  isLoading: boolean;
  error: string | null;
  getDoctorCalendar: (doctorId: string) => Promise<void>;
}

export const useDoctorCalendar = ({ orgID }: UseDoctorCalendarOptions): UseDoctorCalendarReturn => {
  const [calendarData, setCalendarData] = useState<DoctorCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar API usando useMemo para evitar recreación en cada render
  const api = useMemo(() => {
    return new DoctocApi(new DoctocApiClient());
  }, []);

  const getDoctorCalendar = useCallback(async (doctorId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const request: GetUserCalendarInfoRequestDTO = {
        action: 'get',
        orgID,
        uid: doctorId,
        type: 'user',
        sections: ['calendarInfo']
      };

      // La respuesta real no tiene status, viene directamente la data
      const response = await api.getUserCalendarInfo(request) as unknown as ApiCalendarResponse;
      
      if (response && response.calendarInfo) {
        const calendarInfo = response.calendarInfo;
        
        // Mapear horarios fijos con información de sede
        const horariosFijos: { [day: string]: Array<{ startTime: string; endTime: string; sedeId: string; sedeName: string; }> } = {};
        
        if (calendarInfo.horarios) {
          Object.entries(calendarInfo.horarios).forEach(([sedeId, sede]: [string, ApiSedeSchedule]) => {
            if (sede.default && sede.default.horariesFijo) {
              Object.entries(sede.default.horariesFijo).forEach(([day, schedules]: [string, ApiSchedule[]]) => {
                if (schedules && Array.isArray(schedules) && schedules.length > 0) {
                  const dayKey = day.toLowerCase();
                  if (!horariosFijos[dayKey]) {
                    horariosFijos[dayKey] = [];
                  }
                  schedules.forEach((schedule: ApiSchedule) => {
                    horariosFijos[dayKey].push({
                      startTime: schedule.start,
                      endTime: schedule.end,
                      sedeId: sedeId,
                      sedeName: `Sede ${sedeId}` // Nombre temporal, se actualizará en el componente
                    });
                  });
                }
              });
            }
          });
        }

        // Mapear horarios dinámicos (sin información de sede por ahora)
        const horariosDinamicos: Array<{
          startDate: string;
          endDate: string;
          description?: string;
          horarios: { [day: string]: Array<{ startTime: string; endTime: string; sedeId: string; sedeName: string; }> };
        }> = [];
        
        if (calendarInfo.horarios) {
          Object.entries(calendarInfo.horarios).forEach(([sedeId, sede]: [string, ApiSedeSchedule]) => {
            if (sede.default && sede.default.horariesDinamico) {
              sede.default.horariesDinamico.forEach((dinamico: ApiDynamicSchedule) => {
                const horariosDinamicosDia: { [day: string]: Array<{ startTime: string; endTime: string; sedeId: string; sedeName: string; }> } = {};
                
                if (dinamico.daySchedules) {
                  Object.entries(dinamico.daySchedules).forEach(([date, schedules]: [string, ApiSchedule[]]) => {
                    horariosDinamicosDia[date] = schedules.map((schedule: ApiSchedule) => ({
                      startTime: schedule.start,
                      endTime: schedule.end,
                      sedeId: sedeId,
                      sedeName: `Sede ${sedeId.split('_').pop()?.substring(0, 8) || 'Principal'}`
                    }));
                  });
                }
                
                horariosDinamicos.push({
                  startDate: dinamico.startDate,
                  endDate: dinamico.endDate,
                  description: `Horario especial`,
                  horarios: horariosDinamicosDia
                });
              });
            }
          });
        }
        
        const mappedData: DoctorCalendarData = {
          datosCalendarioCompletos: {
            doctor: {
              id: doctorId,
              name: calendarInfo.name || `Doctor ${doctorId}`
            },
            info: {
              updatedAt: calendarInfo.updatedAt || new Date().toISOString(),
              isPublic: calendarInfo.visibility?.external || false
            },
            horarios: {
              fijos: horariosFijos,
              dinamicos: horariosDinamicos
            },
            exeptionsBlock: calendarInfo.exeptionsBlock || [],
            paymentMethods: calendarInfo.paymentMethods || { yapeNumbers: [] },
            customPrices: calendarInfo.customPrices || {},
            associatedTypes: calendarInfo.associatedTypes || {}
          }
        };

        setCalendarData(mappedData);
      } else {
        throw new Error('Error al obtener información del calendario');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching doctor calendar:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orgID, api]);

  return {
    calendarData,
    isLoading,
    error,
    getDoctorCalendar
  };
};