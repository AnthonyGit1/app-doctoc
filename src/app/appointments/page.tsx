'use client';

import { useState, useEffect } from 'react';
import { usePatientAppointments } from '../../presentation/hooks/usePatientAppointments';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import { API_CONFIG } from '../../config/constants';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Eye,
  X
} from 'lucide-react';
import Link from 'next/link';

interface PatientAppointment {
  id: string;
  patient: string;
  medico: string;
  scheduledStart: string;
  scheduledEnd: string;
  type: string;
  motive: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  date?: string;
  startDate?: string;
  endDate?: string;
  patientId?: string;
  userId?: string;
  version?: string;
  locationId?: string;
  history?: Array<{
    action: string;
    timestamp: {
      _seconds: number;
      _nanoseconds: number;
    };
    userId?: string;
  }>;
  recipeID?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

type FilterType = 'todas' | 'pendientes' | 'confirmadas' | 'completadas';

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const [filter, setFilter] = useState<FilterType>('todas');
  
  const { 
    appointments, 
    isLoading, 
    error, 
    getMyAppointments 
  } = usePatientAppointments({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  useEffect(() => {
    console.log('🔄 useEffect triggered, calling getMyAppointments...');
    getMyAppointments();
  }, [getMyAppointments]);

  // Filtrar citas según el filtro seleccionado
  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'todas') return true;
    if (filter === 'pendientes') return appointment.status === 'pendiente';
    if (filter === 'confirmadas') return appointment.status === 'confirmada';
    if (filter === 'completadas') return appointment.status === 'completada';
    return true;
  });

  // Obtener estadísticas
  const stats = {
    total: appointments.length,
    pendientes: appointments.filter(a => a.status === 'pendiente').length,
    confirmadas: appointments.filter(a => a.status === 'confirmada').length,
    completadas: appointments.filter(a => a.status === 'completada').length
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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

  // Función para obtener el ícono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'confirmada':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'completada':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'cancelada':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmada':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completada':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelada':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
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
          <div className="text-center">
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 mb-4">Error: {error}</p>
              <button 
                onClick={getMyAppointments}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mis Citas Médicas</h1>
              <p className="text-gray-400 text-lg">Gestiona y revisa todas tus citas médicas de manera profesional</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={getMyAppointments}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Actualizar
              </button>
              
              <Link 
                href="/#buscador-doctores"
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Nueva Cita
              </Link>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Calendar className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-gray-400 font-medium">Total de Citas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Clock className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.pendientes}</p>
                  <p className="text-sm text-gray-400 font-medium">Pendientes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.confirmadas}</p>
                  <p className="text-sm text-gray-400 font-medium">Confirmadas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <CheckCircle className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.completadas}</p>
                  <p className="text-sm text-gray-400 font-medium">Completadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-white font-semibold text-lg">Filtrar citas:</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {([
                  { key: 'todas', label: 'Todas', count: stats.total, color: 'blue' },
                  { key: 'pendientes', label: 'Pendientes', count: stats.pendientes, color: 'yellow' },
                  { key: 'confirmadas', label: 'Confirmadas', count: stats.confirmadas, color: 'green' },
                  { key: 'completadas', label: 'Completadas', count: stats.completadas, color: 'purple' }
                ] as const).map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                      filter === filterOption.key
                        ? `bg-${filterOption.color}-500 text-white shadow-lg shadow-${filterOption.color}-500/25 scale-105`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {filterOption.label}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        filter === filterOption.key
                          ? 'bg-white/20'
                          : 'bg-gray-600'
                      }`}>
                        {filterOption.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de citas */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-16 text-center border border-gray-700 shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-linear-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <Calendar className="w-12 h-12 text-green-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  {filter === 'todas' ? 'No tienes citas programadas' : `No hay citas ${filter}`}
                </h3>
                
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {filter === 'todas' 
                    ? 'Comienza tu cuidado médico agendando tu primera cita con nuestros profesionales especializados.'
                    : `En este momento no tienes citas con estado ${filter}. Puedes agendar una nueva o cambiar el filtro.`
                  }
                </p>
                
                {filter === 'todas' && (
                  <Link 
                    href="/#buscador-doctores"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Programar mi primera cita
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="group bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${
                        appointment.status === 'pendiente' ? 'from-yellow-500/20 to-yellow-600/20' :
                        appointment.status === 'confirmada' ? 'from-green-500/20 to-green-600/20' :
                        appointment.status === 'completada' ? 'from-purple-500/20 to-purple-600/20' :
                        'from-gray-500/20 to-gray-600/20'
                      } border border-opacity-30 ${
                        appointment.status === 'pendiente' ? 'border-yellow-500' :
                        appointment.status === 'confirmada' ? 'border-green-500' :
                        appointment.status === 'completada' ? 'border-purple-500' :
                        'border-gray-500'
                      }`}>
                        {getStatusIcon(appointment.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                            {appointment.type}
                          </h3>
                          <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4 text-lg">{appointment.motive}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <Calendar className="w-5 h-5 text-green-400" />
                            <div>
                              <p className="text-xs text-gray-400 font-medium">FECHA</p>
                              <p className="text-white font-semibold">{formatDate(appointment.scheduledStart)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-xs text-gray-400 font-medium">HORA</p>
                              <p className="text-white font-semibold">{formatTime(appointment.scheduledStart)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setSelectedAppointment(appointment)}
                        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles mejorado */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            {/* Header del modal mejorado */}
            <div className="relative p-8 border-b border-gray-700">
              <div className="flex items-start gap-6">
                <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br ${
                  selectedAppointment.status === 'pendiente' ? 'from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' :
                  selectedAppointment.status === 'confirmada' ? 'from-green-500/20 to-green-600/20 border border-green-500/30' :
                  selectedAppointment.status === 'completada' ? 'from-purple-500/20 to-purple-600/20 border border-purple-500/30' :
                  'from-gray-500/20 to-gray-600/20 border border-gray-500/30'
                }`}>
                  {getStatusIcon(selectedAppointment.status)}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedAppointment.type}</h2>
                  <p className="text-gray-400 text-lg mb-3">Información completa de tu cita médica</p>
                  <span className={`px-4 py-2 rounded-xl font-semibold border ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </span>
                </div>
                
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="p-3 hover:bg-gray-700 rounded-xl transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* Contenido del modal mejorado */}
            <div className="p-8 space-y-8">
              {/* Información principal con diseño mejorado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Fecha de la Cita</label>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Calendar className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{formatDate(selectedAppointment.scheduledStart)}</p>
                        <p className="text-gray-400">Día programado</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Horario</label>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">
                          {formatTime(selectedAppointment.scheduledStart)} - {formatTime(selectedAppointment.scheduledEnd)}
                        </p>
                        <p className="text-gray-400">Duración estimada</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAppointment.locationId && (
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                      <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Ubicación</label>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <MapPin className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white">{selectedAppointment.locationId}</p>
                          <p className="text-gray-400">Sede médica</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Motivo de Consulta</label>
                    <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-600">
                      <p className="text-white text-lg leading-relaxed">{selectedAppointment.motive}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Información Técnica</label>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">ID de Cita:</span>
                        <span className="text-white font-mono text-sm bg-gray-700 px-2 py-1 rounded">{selectedAppointment.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Versión:</span>
                        <span className="text-white">{selectedAppointment.version || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">Paciente ID:</span>
                        <span className="text-white font-mono text-sm bg-gray-700 px-2 py-1 rounded">{selectedAppointment.patient}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional y historial */}
              {selectedAppointment.createdAt && (
                <div className="bg-linear-to-br from-gray-800/50 to-gray-700/30 rounded-2xl p-6 border border-gray-700">
                  <h4 className="font-bold text-white mb-4 text-lg">Información de Creación</h4>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Cita creada el:</p>
                      <p className="text-white font-semibold">
                        {new Date(selectedAppointment.createdAt._seconds * 1000).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Historial mejorado */}
              {selectedAppointment.history && selectedAppointment.history.length > 0 && (
                <div className="bg-linear-to-br from-gray-800/50 to-gray-700/30 rounded-2xl p-6 border border-gray-700">
                  <h4 className="font-bold text-white mb-6 text-lg">Historial de la Cita</h4>
                  <div className="space-y-4">
                    {selectedAppointment.history.map((entry, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-600">
                        <div className="w-3 h-3 bg-linear-to-r from-green-400 to-emerald-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white font-semibold capitalize">{entry.action}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(entry.timestamp._seconds * 1000).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal mejorado */}
            <div className="flex justify-end gap-4 p-8 border-t border-gray-700">
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="px-8 py-3 bg-linear-to-r from-gray-700 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-200 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}