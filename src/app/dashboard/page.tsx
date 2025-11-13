'use client';

import { useState, useEffect, useCallback } from 'react';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import Link from 'next/link';
import { useAuth } from '../../presentation/contexts/AuthContext';
import { usePatientAppointments } from '../../presentation/hooks/usePatientAppointments';
import { API_CONFIG } from '../../config/constants';
import {
  Calendar,
  Clock,
  User,
  Heart,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';

// Tipos para las citas
interface Appointment {
  id: string;
  type: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  scheduledStart: string;
  doctor?: string;
  specialty?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0
  });
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);

  const { 
    appointments, 
    isLoading,
    getMyAppointments 
  } = usePatientAppointments({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  const calculateStats = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const pending = appointments.filter(apt => apt.status === 'pendiente');
    const completed = appointments.filter(apt => apt.status === 'completada');
    const todayApts = appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledStart);
      const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
      return aptDay.getTime() === today.getTime();
    });

    const upcoming = appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledStart);
      return aptDate > now && (apt.status === 'pendiente' || apt.status === 'confirmada');
    }).sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());

    setStats({
      totalAppointments: appointments.length,
      todayAppointments: todayApts.length,
      pendingAppointments: pending.length,
      completedAppointments: completed.length,
      upcomingAppointments: upcoming.length
    });

    if (upcoming.length > 0) {
      setNextAppointment(upcoming[0]);
    } else {
      setNextAppointment(null);
    }
  }, [appointments]);

  useEffect(() => {
    getMyAppointments();
  }, [getMyAppointments]);

  useEffect(() => {
    if (appointments.length > 0) {
      calculateStats();
    }
  }, [appointments, calculateStats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getDisplayName = () => {
    if (!user) return 'Usuario';
    
    // Usar el displayName o name del usuario autenticado (ya viene de la API)
    return user.displayName || user.name || 'Usuario';
  };

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-xl">Cargando tu dashboard médico...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6">
        <div className="space-y-8">
          {/* Header de bienvenida mejorado */}
          <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{getGreeting()}, {getDisplayName()}</h1>
                  <p className="text-green-100 text-lg">Bienvenido a tu panel de salud personal</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Salud al día</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>Citas gestionadas: {stats.totalAppointments}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-8 h-8" />
                  <h3 className="font-semibold">Total</h3>
                </div>
                <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                <p className="text-blue-100 text-sm">Citas médicas</p>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-8 h-8" />
                  <h3 className="font-semibold">Hoy</h3>
                </div>
                <p className="text-3xl font-bold">{stats.todayAppointments}</p>
                <p className="text-green-100 text-sm">Programadas</p>
              </div>
            </div>

            <div className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8" />
                  <h3 className="font-semibold">Pendientes</h3>
                </div>
                <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
                <p className="text-yellow-100 text-sm">Por confirmar</p>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8" />
                  <h3 className="font-semibold">Completadas</h3>
                </div>
                <p className="text-3xl font-bold">{stats.completedAppointments}</p>
                <p className="text-purple-100 text-sm">Finalizadas</p>
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-8 h-8" />
                  <h3 className="font-semibold">Próximas</h3>
                </div>
                <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
                <p className="text-indigo-100 text-sm">Por venir</p>
              </div>
            </div>
          </div>

          {/* Próxima cita destacada */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Tu Próxima Cita</h2>
              {nextAppointment && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/30">
                  {nextAppointment.status.charAt(0).toUpperCase() + nextAppointment.status.slice(1)}
                </span>
              )}
            </div>

            {nextAppointment ? (
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-linear-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{nextAppointment.type}</h3>
                  <p className="text-gray-300 mb-4">{nextAppointment.motive}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">FECHA</p>
                        <p className="text-white font-semibold">{formatDate(nextAppointment.scheduledStart)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                      <Clock className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">HORA</p>
                        <p className="text-white font-semibold">{formatTime(nextAppointment.scheduledStart)}</p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href="/appointments"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles completos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No hay citas próximas</h3>
                <p className="text-gray-400 mb-6">Programa tu próxima cita para mantener tu salud al día</p>
                <Link 
                  href="/#buscador-doctores"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Agendar nueva cita
                </Link>
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/#buscador-doctores"
              className="p-6 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-4">
                <Plus className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-lg font-bold">Nueva Cita</h3>
                  <p className="text-green-100">Agenda con especialistas</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/appointments"
              className="p-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-4">
                <Calendar className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-lg font-bold">Mis Citas</h3>
                  <p className="text-blue-100">Gestiona tus citas</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/profile"
              className="p-6 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-lg font-bold">Mi Perfil</h3>
                  <p className="text-purple-100">Datos personales</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}           