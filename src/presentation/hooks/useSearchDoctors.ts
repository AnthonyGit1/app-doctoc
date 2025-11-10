'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Doctor } from '../../core/domain/entities/Doctor';
import { 
  GetDoctorsByOrganizationUseCase, 
  SearchDoctorsBySpecialtyUseCase 
} from '../../core/domain/use-cases/doctor-use-cases';
import { DoctocDoctorRepository } from '../../infrastructure/repositories/DoctocDoctorRepository';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { DoctocApiClient } from '../../infrastructure/api/api-client';

interface UseSearchDoctorsProps {
  orgID: string;
}

interface SearchParams {
  name: string;
  specialty: string;
}

interface UseSearchDoctorsReturn {
  doctors: Doctor[];
  specialties: Array<{ id: string; name: string; description?: string }>;
  isLoading: boolean;
  error: string | null;
  searchDoctors: (params: SearchParams) => Promise<void>;
  getAllDoctors: () => Promise<void>;
  getSpecialties: () => Promise<void>;
}

export function useSearchDoctors({ orgID }: UseSearchDoctorsProps): UseSearchDoctorsReturn {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar dependencias usando useMemo para evitar recreación en cada render
  const dependencies = useMemo(() => {
    const doctocApi = new DoctocApi(new DoctocApiClient());
    const doctorRepository = new DoctocDoctorRepository(doctocApi);
    const getDoctorsUseCase = new GetDoctorsByOrganizationUseCase(doctorRepository);
    const searchBySpecialtyUseCase = new SearchDoctorsBySpecialtyUseCase(doctorRepository);

    return {
      doctorRepository,
      getDoctorsUseCase,
      searchBySpecialtyUseCase
    };
  }, []);

  // Función para obtener todas las especialidades
  const getSpecialties = useCallback(async () => {
    try {
      const availableSpecialties = await dependencies.doctorRepository.getAvailableSpecialties(orgID);
      setSpecialties(availableSpecialties);
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
      setError('Error al cargar especialidades');
    }
  }, [dependencies.doctorRepository, orgID]);

  // Función para obtener todos los doctores
  const getAllDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allDoctors = await dependencies.getDoctorsUseCase.execute(orgID);
      setDoctors(allDoctors);
    } catch (error) {
      console.error('Error obteniendo doctores:', error);
      setError('Error al cargar doctores. Por favor intenta de nuevo.');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, [dependencies.getDoctorsUseCase, orgID]);

  // Función para buscar doctores
  const searchDoctors = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      let foundDoctors: Doctor[] = [];

      if (params.specialty && params.specialty.trim()) {
        // Búsqueda por especialidad
        foundDoctors = await dependencies.searchBySpecialtyUseCase.execute(orgID, params.specialty);
        
        // Filtrar por nombre si se proporciona
        if (params.name && params.name.trim()) {
          const nameQuery = params.name.toLowerCase().trim();
          foundDoctors = foundDoctors.filter((doctor: Doctor) => 
            doctor.name?.toLowerCase().includes(nameQuery) || false
          );
        }
      } else if (params.name && params.name.trim()) {
        // Búsqueda solo por nombre - obtener todos y filtrar
        const allDoctors = await dependencies.getDoctorsUseCase.execute(orgID);
        const nameQuery = params.name.toLowerCase().trim();
        foundDoctors = allDoctors.filter((doctor: Doctor) => 
          doctor.name?.toLowerCase().includes(nameQuery) || false
        );
      } else {
        // Sin filtros - obtener todos
        foundDoctors = await dependencies.getDoctorsUseCase.execute(orgID);
      }

      setDoctors(foundDoctors);
    } catch (error) {
      console.error('Error en búsqueda de doctores:', error);
      setError('Error al buscar doctores. Por favor intenta de nuevo.');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, [dependencies.getDoctorsUseCase, dependencies.searchBySpecialtyUseCase, orgID]);

  // Cargar especialidades al montar - solo una vez
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const availableSpecialties = await dependencies.doctorRepository.getAvailableSpecialties(orgID);
        setSpecialties(availableSpecialties);
      } catch (error) {
        console.error('Error obteniendo especialidades:', error);
        setError('Error al cargar especialidades');
      }
    };

    loadSpecialties();
  }, [orgID, dependencies.doctorRepository]);

  // Cargar doctores iniciales - solo una vez
  useEffect(() => {
    const loadInitialDoctors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const allDoctors = await dependencies.getDoctorsUseCase.execute(orgID);
        setDoctors(allDoctors);
      } catch (error) {
        console.error('Error obteniendo doctores:', error);
        setError('Error al cargar doctores. Por favor intenta de nuevo.');
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialDoctors();
  }, [orgID, dependencies.getDoctorsUseCase]);

  return {
    doctors,
    specialties,
    isLoading,
    error,
    searchDoctors,
    getAllDoctors,
    getSpecialties
  };
}