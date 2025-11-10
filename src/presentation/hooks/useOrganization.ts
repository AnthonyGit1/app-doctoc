'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Organization } from '../../core/domain/entities/Organization';
import { DoctocOrganizationRepository } from '../../infrastructure/repositories/DoctocOrganizationRepository';
import { API_CONFIG } from '../../config/constants';

interface UseOrganizationReturn {
  organization: Organization | null;
  basicInfo: Partial<Organization> | null;
  locations: Organization['locations'] | null;
  specialties: Organization['specialties'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrganization = (orgId?: string): UseOrganizationReturn => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [basicInfo, setBasicInfo] = useState<Partial<Organization> | null>(null);
  const [locations, setLocations] = useState<Organization['locations'] | null>(null);
  const [specialties, setSpecialties] = useState<Organization['specialties'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new DoctocOrganizationRepository(), []);
  const targetOrgId = orgId || API_CONFIG.DEFAULT_ORG_ID;

  const fetchOrganizationData = useCallback(async () => {
    if (!targetOrgId) {
      setError('Organization ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for better performance
      const [fullOrg, basic, locs, specs] = await Promise.all([
        repository.getOrganizationInfo(targetOrgId).catch(() => null),
        repository.getBasicInfo(targetOrgId).catch(() => null),
        repository.getLocations(targetOrgId).catch(() => null),
        repository.getSpecialties(targetOrgId).catch(() => null)
      ]);

      setOrganization(fullOrg);
      setBasicInfo(basic);
      setLocations(locs);
      setSpecialties(specs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading organization data');
      console.error('Error fetching organization data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetOrgId, repository]);

  useEffect(() => {
    fetchOrganizationData();
  }, [fetchOrganizationData]);

  return {
    organization,
    basicInfo,
    locations,
    specialties,
    isLoading,
    error,
    refetch: fetchOrganizationData
  };
};

// Hook específico para información básica (más liviano)
export const useOrganizationBasicInfo = (orgId?: string) => {
  const [basicInfo, setBasicInfo] = useState<Partial<Organization> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new DoctocOrganizationRepository(), []);
  const targetOrgId = orgId || API_CONFIG.DEFAULT_ORG_ID;

  const fetchBasicInfo = useCallback(async () => {
    if (!targetOrgId) {
      setError('Organization ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const info = await repository.getBasicInfo(targetOrgId);
      setBasicInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading organization basic info');
      console.error('Error fetching organization basic info:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetOrgId, repository]);

  useEffect(() => {
    fetchBasicInfo();
  }, [fetchBasicInfo]);

  return {
    basicInfo,
    isLoading,
    error,
    refetch: fetchBasicInfo
  };
};

// Hook específico para especialidades
export const useOrganizationSpecialties = (orgId?: string) => {
  const [specialties, setSpecialties] = useState<Organization['specialties'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new DoctocOrganizationRepository(), []);
  const targetOrgId = orgId || API_CONFIG.DEFAULT_ORG_ID;

  const fetchSpecialties = useCallback(async () => {
    if (!targetOrgId) {
      setError('Organization ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const specs = await repository.getSpecialties(targetOrgId);
      setSpecialties(specs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading specialties');
      console.error('Error fetching specialties:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetOrgId, repository]);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  return {
    specialties,
    isLoading,
    error,
    refetch: fetchSpecialties
  };
};

// Hook específico para ubicaciones
export const useOrganizationLocations = (orgId?: string) => {
  const [locations, setLocations] = useState<Organization['locations'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new DoctocOrganizationRepository(), []);
  const targetOrgId = orgId || API_CONFIG.DEFAULT_ORG_ID;

  const fetchLocations = useCallback(async () => {
    if (!targetOrgId) {
      setError('Organization ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const locs = await repository.getLocations(targetOrgId);
      setLocations(locs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading locations');
      console.error('Error fetching locations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetOrgId, repository]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    isLoading,
    error,
    refetch: fetchLocations
  };
};