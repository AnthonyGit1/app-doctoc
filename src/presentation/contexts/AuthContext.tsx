'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
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
  logout: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuario autenticado, crear información básica primero
        const userInfo: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          name: firebaseUser.displayName || undefined,
          displayName: firebaseUser.displayName || undefined,
          orgID: API_CONFIG.DEFAULT_ORG_ID
        };

        // Establecer usuario inmediatamente con datos de Firebase
        setUser(userInfo);

        // Solo buscar información adicional en la API si no tenemos displayName
        if (!firebaseUser.displayName && firebaseUser.email) {
          try {
            const doctocApi = new DoctocApi(new DoctocApiClient());
            const searchResult = await doctocApi.searchPatients({
              action: 'search' as const,
              orgID: API_CONFIG.DEFAULT_ORG_ID,
              type: 'nombre' as const,
              text: firebaseUser.email,
              limit: 10
            });

            const patientFound = searchResult?.patients?.find(p => 
              p.mail?.toLowerCase() === firebaseUser.email?.toLowerCase()
            );

            if (patientFound) {
              const names = patientFound.names || '';
              const surnames = patientFound.surnames || '';
              const fullDisplayName = names && surnames ? `${names} ${surnames}`.trim() : patientFound.name;

              if (fullDisplayName) {
                setUser(prev => prev ? {
                  ...prev,
                  name: patientFound.name || prev.name,
                  displayName: fullDisplayName
                } : null);
              }
            }
          } catch (apiError) {
            console.warn('Error obteniendo información del paciente:', apiError);
            // No hacer nada más, mantener la información de Firebase
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario logueado correctamente:', userCredential.user.email);
      return true;
    } catch (error: unknown) {
      console.error('Error en login:', error);
      throw error; // Lanzar el error para que el componente pueda manejarlo
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Actualizar el estado local inmediatamente con la información correcta
      const newUser: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || undefined,
        name: name,
        displayName: name,
        orgID: API_CONFIG.DEFAULT_ORG_ID
      };
      
      setUser(newUser);

      console.log('Usuario registrado correctamente:', userCredential.user.email);
      return true;
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      throw error; // Lanzar el error para que el componente pueda manejarlo
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error en logout:', error);
    }
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