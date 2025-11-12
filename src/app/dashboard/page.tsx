'use client';

import { useState, useEffect, useCallback } from 'react';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import Link from 'next/link';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { DoctocApiClient } from '../../infrastructure/api/api-client';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { API_CONFIG } from '../../config/constants';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Heart,
  Activity,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText
} from 'lucide-react';

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  nextAppointment?: {
    id: string;
    type: string;
    date: string;
    startDate: string;
    motive: string;
    status: string;
  };
}

interface PatientProfile {
  name: string;
  email: string;
  phone?: string;
  dni?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctocApi] = useState(() => new DoctocApi(new DoctocApiClient()));

  // Obtener el orgID desde la configuración
  const ORG_ID = API_CONFIG.DEFAULT_ORG_ID;

  // Función para obtener el ID del paciente
  const getPatientId = useCallback(async () => {
    try {
      if (!user?.email) return null;

      // Buscar el paciente por email
      const searchResult = await doctocApi.searchPatients({
        action: 'search' as const,
        orgID: ORG_ID,
        type: 'nombre' as const,
        text: user.email.split('@')[0],
        limit: 10
      });

      if (searchResult?.patients?.length > 0) {
        const patient = searchResult.patients.find(p => 
          p.mail?.toLowerCase() === user.email?.toLowerCase()
        );
        return patient?.patient_id || null;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo ID del paciente:', error);
      return null;
    }
  }, [user, doctocApi, ORG_ID]);

  // Función para cargar datos del dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.uid) {
        return;
      }

      // Obtener el ID del paciente
      const pid = await getPatientId();
      if (!pid) {
        console.log('No se encontró el perfil del paciente');
        setLoading(false);
        return;
      }

      // Obtener información del perfil del paciente
      try {
        const profileResult = await doctocApi.searchPatients({
          action: 'search' as const,
          orgID: ORG_ID,
          type: 'nombre' as const,
          text: user.email?.split('@')[0] || '',
          limit: 1
        });

        if (profileResult?.patients?.length > 0) {
          const patient = profileResult.patients[0];
          setPatientProfile({
            name: patient.name || user.displayName || 'Usuario',
            email: patient.mail || user.email || '',
            phone: patient.phone || undefined,
            dni: patient.dni || undefined
          });
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
      }

      // Obtener las citas del paciente
      try {
        const appointmentsResult = await doctocApi.getPatientAppointments({
          orgID: ORG_ID,
          patientID: pid
        });

        if (appointmentsResult?.quotes) {
          const appointments = appointmentsResult.quotes;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          // Calcular estadísticas
          const totalAppointments = appointments.length;
          const todayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.startDate);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
          }).length;

          const pendingAppointments = appointments.filter(apt => apt.status === 'pendiente').length;
          const completedAppointments = appointments.filter(apt => apt.status === 'completada').length;

          // Encontrar la próxima cita
          const futureAppointments = appointments
            .filter(apt => new Date(apt.startDate) > new Date())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          const nextAppointment = futureAppointments.length > 0 ? {
            id: futureAppointments[0].id,
            type: futureAppointments[0].type,
            date: futureAppointments[0].date,
            startDate: futureAppointments[0].startDate,
            motive: futureAppointments[0].motive,
            status: futureAppointments[0].status
          } : undefined;

          setStats({
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            completedAppointments,
            nextAppointment
          });
        }
      } catch (error) {
        console.error('Error cargando citas:', error);
      }

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  }, [user, getPatientId, doctocApi, ORG_ID]);

  useEffect(() => {
    if (user?.uid) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando dashboard...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6">
        <div className="space-y-8">
          {/* Header de bienvenida personalizado */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Hola, {patientProfile?.name || user?.displayName || 'Usuario'}
                </h1>
                <p className="text-gray-400">
                  Bienvenido a tu panel de salud personal
                </p>
              </div>
            </div>
            
            {patientProfile && (
              <div className="bg-gray-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">{patientProfile.email}</span>
                </div>
                {patientProfile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{patientProfile.phone}</span>
                  </div>
                )}
                {patientProfile.dni && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">DNI: {patientProfile.dni}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Estadísticas de citas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{stats.totalAppointments}</h3>
                  <p className="text-sm text-gray-400">Total de Citas</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{stats.todayAppointments}</h3>
                  <p className="text-sm text-gray-400">Citas Hoy</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{stats.pendingAppointments}</h3>
                  <p className="text-sm text-gray-400">Pendientes</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 bg-opacity-20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">{stats.completedAppointments}</h3>
                  <p className="text-sm text-gray-400">Completadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Próxima cita */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Próxima Cita</h2>
              <p className="text-gray-400 text-sm">Tu siguiente cita médica programada</p>
            </div>
            
            <div className="p-6">
              {stats.nextAppointment ? (
                <div className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {stats.nextAppointment.type || 'Consulta Médica'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {stats.nextAppointment.motive || 'Sin motivo especificado'}
                        </p>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <Clock className="w-4 h-4" />
                      {stats.nextAppointment.status.charAt(0).toUpperCase() + stats.nextAppointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span>{formatDate(stats.nextAppointment.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span>{formatTime(stats.nextAppointment.startDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      href="/appointments"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      Ver todas mis citas
                    </Link>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                      Ver ubicación
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No hay citas próximas</h3>
                  <p className="text-gray-400 mb-6">
                    Programa tu próxima cita para mantener tu salud al día.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link 
                      href="/#buscador-doctores" 
                      className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Buscar Doctores
                    </Link>
                    
                    <Link 
                      href="/appointments" 
                      className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      Ver Historial
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}           