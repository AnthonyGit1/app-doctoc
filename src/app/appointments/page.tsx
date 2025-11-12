'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import { useAuth } from '../../infrastructure/auth/AuthContext';
import { DoctocApiClient } from '../../infrastructure/api/api-client';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { API_CONFIG } from '../../config/constants';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';

interface Appointment {
  id: string;
  patientId: string;
  userId: string;
  date: string;
  startDate: string;
  endDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  type: string;
  typeId?: string;
  category: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  version: string;
  locationId: string;
  recipeID?: string;
  personaEjecutante: string;
  patient?: string;
  medico?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  history?: Array<{
    action: string;
    timestamp: {
      _seconds: number;
      _nanoseconds: number;
    };
    userId: string;
  }>;
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pendiente' | 'confirmada' | 'completada'>('all');
  const [doctocApi] = useState(() => new DoctocApi(new DoctocApiClient()));

  // Obtener el orgID desde la configuración
  const ORG_ID = API_CONFIG.DEFAULT_ORG_ID;

  // Función para obtener el ID del paciente desde el perfil
  const getPatientId = useCallback(async () => {
    try {
      if (!user?.email) return null;

      // Buscar el paciente por email para obtener su ID
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

      // Fallback: buscar en todos los pacientes
      const allPatientsResult = await doctocApi.getAllPatients({
        action: 'getAll' as const,
        orgID: ORG_ID,
        limit: 50
      });

      if (allPatientsResult?.patients?.length > 0) {
        const patient = allPatientsResult.patients.find(p => 
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

  // Función para obtener las citas del paciente
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.uid) {
        throw new Error('No hay usuario autenticado');
      }

      // Primero obtener el ID del paciente
      const pid = await getPatientId();
      if (!pid) {
        throw new Error('No se encontró el perfil del paciente');
      }

      // Obtener las citas del paciente
      const appointmentsResult = await doctocApi.getPatientAppointments({
        orgID: ORG_ID,
        patientID: pid
      });

      if (appointmentsResult?.quotes) {
        // Mapear los datos para que coincidan con la interfaz Appointment
        const mappedAppointments: Appointment[] = appointmentsResult.quotes.map(quote => ({
          id: quote.id,
          patientId: quote.patientId,
          userId: quote.userId,
          date: quote.date,
          startDate: quote.startDate,
          endDate: quote.endDate,
          scheduledStart: quote.startDate, // Usar startDate como scheduledStart
          scheduledEnd: quote.endDate, // Usar endDate como scheduledEnd
          type: quote.type,
          typeId: '',
          category: 'cita',
          motive: quote.motive,
          status: quote.status as 'pendiente' | 'confirmada' | 'completada' | 'cancelada',
          version: quote.version,
          locationId: quote.locationId,
          recipeID: quote.recipeID,
          personaEjecutante: 'No especificado',
          createdAt: quote.createdAt,
          history: quote.history
        }));
        setAppointments(mappedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar las citas';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [user, getPatientId, doctocApi, ORG_ID]);

  useEffect(() => {
    if (user?.uid) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  // Filtrar citas según el estado seleccionado
  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'confirmada':
        return <CheckCircle className="w-4 h-4" />;
      case 'completada':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelada':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

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
            <p className="text-gray-400">Cargando citas...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
              {error}
            </div>
            <button 
              onClick={fetchAppointments}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mis Citas</h1>
                <p className="text-gray-400">Gestiona y revisa todas tus citas médicas</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-white font-bold text-lg">{appointments.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Pendientes</p>
                    <p className="text-white font-bold text-lg">
                      {appointments.filter(a => a.status === 'pendiente').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Confirmadas</p>
                    <p className="text-white font-bold text-lg">
                      {appointments.filter(a => a.status === 'confirmada').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Completadas</p>
                    <p className="text-white font-bold text-lg">
                      {appointments.filter(a => a.status === 'completada').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">Filtrar por estado:</span>
              </div>
              
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Todas' },
                  { key: 'pendiente', label: 'Pendientes' },
                  { key: 'confirmada', label: 'Confirmadas' },
                  { key: 'completada', label: 'Completadas' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key as 'all' | 'pendiente' | 'confirmada' | 'completada')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.key
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Citas */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 shadow-xl text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {filter === 'all' ? 'No tienes citas' : `No tienes citas ${filter}s`}
              </h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? 'Aún no has programado ninguna cita médica.' 
                  : `No hay citas con estado ${filter}.`
                }
              </p>
              <Button 
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mx-auto"
                onClick={() => window.location.href = '/#buscador-doctores'}
              >
                <Plus className="w-5 h-5" />
                Programar primera cita
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {appointment.type || 'Consulta Médica'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {appointment.motive || 'Sin motivo especificado'}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        {formatDate(appointment.scheduledStart || appointment.startDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        {formatTime(appointment.scheduledStart || appointment.startDate)} - {formatTime(appointment.scheduledEnd || appointment.endDate)}
                      </span>
                    </div>

                    {appointment.locationId && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{appointment.locationId}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-300">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Ejecutante: {appointment.personaEjecutante || 'No especificado'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {appointment.createdAt && (
                        <span>
                          Creada: {new Date(appointment.createdAt._seconds * 1000).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                        Ver detalles
                      </button>
                      {appointment.status === 'pendiente' && (
                        <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}