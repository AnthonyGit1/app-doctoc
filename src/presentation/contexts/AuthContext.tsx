'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DoctocApiClient } from '../../infrastructure/api/api-client';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { API_CONFIG } from '../../config/constants';

interface User {
  uid: string;
  email?: string;
  name?: string;
  displayName?: string;
  orgID?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  redirectToLogin: (returnUrl?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simular verificación de sesión desde localStorage o cookie
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      // Buscar el paciente en la API para obtener su nombre completo real
      let patientName = 'Usuario'; // Fallback por si no se encuentra
      let fullDisplayName = 'Usuario'; // Nombre completo (names + surnames)
      let patientId = 'QI0H3vOu8rbeyAkXMG9WIDf9GRX2'; // ID por defecto
      
      try {
        const doctocApi = new DoctocApi(new DoctocApiClient());
        const ORG_ID = API_CONFIG.DEFAULT_ORG_ID;

        // Primero intentar búsqueda directa por email
        const searchResult = await doctocApi.searchPatients({
          action: 'search' as const,
          orgID: ORG_ID,
          type: 'nombre' as const,
          text: email,
          limit: 10
        });
        
        let patientFound = null;
        if (searchResult?.patients?.length > 0) {
          patientFound = searchResult.patients.find(p => 
            p.mail?.toLowerCase() === email.toLowerCase()
          );
        }

        // Si no se encuentra por búsqueda directa, buscar en todos los pacientes
        if (!patientFound) {
          try {
            const allPatientsResult = await doctocApi.getAllPatients({
              action: 'getAll' as const,
              orgID: ORG_ID,
              limit: 50
            });
            
            if (allPatientsResult?.patients?.length > 0) {
              patientFound = allPatientsResult.patients.find(p => 
                p.mail?.toLowerCase() === email.toLowerCase()
              );
            }
          } catch (error) {
            console.warn('Error obteniendo todos los pacientes:', error);
          }
        }

        // Si se encontró el paciente, usar su información real completa
        if (patientFound) {
          // Usar name como base, pero construir displayName completo
          patientName = patientFound.name || 'Usuario';
          
          // Construir nombre completo: names + surnames
          const names = patientFound.names || '';
          const surnames = patientFound.surnames || '';
          
          if (names && surnames) {
            fullDisplayName = `${names} ${surnames}`.trim();
          } else if (names) {
            fullDisplayName = names;
          } else if (surnames) {
            fullDisplayName = surnames;
          } else {
            fullDisplayName = patientFound.name || patientName;
          }
          
          patientId = patientFound.patient_id || patientId;
          console.log('Paciente encontrado:', { 
            name: patientName, 
            fullName: fullDisplayName, 
            id: patientId,
            names: names,
            surnames: surnames
          });
        } else {
          console.warn('Paciente no encontrado en la API, usando nombre del email');
          // Formatear el nombre del email como fallback
          const emailName = email.split('@')[0].replace(/[._-]/g, ' ');
          patientName = emailName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          fullDisplayName = patientName;
        }
      } catch (apiError) {
        console.error('Error buscando paciente en la API:', apiError);
        // Usar nombre del email como fallback
        const emailName = email.split('@')[0].replace(/[._-]/g, ' ');
        patientName = emailName.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        fullDisplayName = patientName;
      }
      
      const mockUser: User = {
        uid: patientId,
        email,
        name: patientName,
        displayName: fullDisplayName, // Nombre completo real del usuario
        orgID: API_CONFIG.DEFAULT_ORG_ID
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    try {
      // TODO: Implementar registro real con la API de Doctoc
      // Por ahora simulamos registro + creación de paciente
      const mockUser: User = {
        uid: 'newuser_' + Date.now(), // ID temporal
        email,
        name,
        displayName: name,
        orgID: API_CONFIG.DEFAULT_ORG_ID
      };

      // Crear el paciente automáticamente al registrarse
      try {
        const createPatientResponse = await fetch('/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'create',
            orgID: mockUser.orgID,
            uid: mockUser.uid,
            name: name,
            email: email,
            phone: '', // Opcional por ahora
            documentType: 'dni',
            documentNumber: '', // Se puede completar después
            birthDate: '', // Se puede completar después
            address: '', // Se puede completar después
            emergencyContact: {
              name: '',
              phone: ''
            }
          })
        });

        if (!createPatientResponse.ok) {
          console.warn('No se pudo crear el paciente automáticamente, pero el usuario se registró');
        }
      } catch (patientError) {
        console.warn('Error al crear paciente automáticamente:', patientError);
      }
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  const redirectToLogin = (returnUrl?: string) => {
    const params = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    router.push(`/login${params}`);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    redirectToLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};