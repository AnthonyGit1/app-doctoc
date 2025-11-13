'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import { useAuth } from '../../presentation/contexts/AuthContext';
import { DoctocApiClient } from '../../infrastructure/api/api-client';
import { DoctocApi } from '../../infrastructure/api/doctoc-api';
import { API_CONFIG } from '../../config/constants';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  CreditCard,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface UserProfile {
  patient_id: string;
  name: string;
  names: string;
  surnames: string;
  dni?: string;
  birth_date?: string;
  gender?: string;
  phone?: string;
  mail?: string;
  image?: string;
  document_type?: string;
  document_number?: string;
  created_at: number;
  updated_at?: number;
  nhc?: string;
  disabled: boolean;
  // Campos adicionales para la UI
  role?: string;
  speciality?: string;
  organization?: string;
}

export default function MiPerfilPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [doctocApi] = useState(() => new DoctocApi(new DoctocApiClient()));
  const [canEdit, setCanEdit] = useState(true);

  // Obtener el orgID desde la configuración o constantes
  const ORG_ID = API_CONFIG.DEFAULT_ORG_ID;

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.uid) {
        throw new Error('No hay usuario autenticado');
      }

      let searchResult = null;
      let patientFound = false;

      // Buscar por email del usuario logueado  
      if (user.email) {
        try {
          // Primero intentar búsqueda directa por email
          searchResult = await doctocApi.searchPatients({
            action: 'search' as const,
            orgID: ORG_ID,
            type: 'nombre' as const,
            text: user.email,
            limit: 10
          });
          
          if (searchResult?.patients?.length > 0) {
            const patientByEmail = searchResult.patients.find(p => 
              p.mail?.toLowerCase() === user.email?.toLowerCase()
            );
            if (patientByEmail) {
              setProfile(patientByEmail);
              setEditedProfile(patientByEmail);
              patientFound = true;
            }
          }
        } catch (error) {
          console.error('Error buscando por email:', error);
        }
      }

      // Si no se encuentra por email, buscar por nombre
      if (!patientFound && user.name) {
        try {
          searchResult = await doctocApi.searchPatients({
            action: 'search' as const,
            orgID: ORG_ID,
            type: 'nombre' as const,
            text: (user.displayName || user.name || 'U').split(' ')[0],
            limit: 10
          });
          
          if (searchResult?.patients?.length > 0) {
            const patientByName = searchResult.patients.find(p => 
              p.mail?.toLowerCase() === user.email?.toLowerCase() ||
              p.name?.toLowerCase().includes(user.displayName?.toLowerCase() || user.name?.toLowerCase() || '')
            );
            if (patientByName) {
              setProfile(patientByName);
              setEditedProfile(patientByName);
              patientFound = true;
            }
          }
        } catch (error) {
          console.error('Error buscando por nombre:', error);
        }
      }

      // Si aún no se encuentra, buscar en todos los pacientes
      if (!patientFound) {
        try {
          const allPatientsResult = await doctocApi.getAllPatients({
            action: 'getAll' as const,
            orgID: ORG_ID,
            limit: 50
          });
          
          if (allPatientsResult?.patients?.length > 0) {
            const patientByEmail = allPatientsResult.patients.find(p => 
              p.mail?.toLowerCase() === user.email?.toLowerCase()
            );
            if (patientByEmail) {
              setProfile(patientByEmail);
              setEditedProfile(patientByEmail);
              patientFound = true;
            }
          }
        } catch (error) {
          console.error('Error obteniendo todos los pacientes:', error);
        }
      }

      if (!patientFound) {
        setCanEdit(false);
        throw new Error('No se encontró el perfil del paciente en el sistema');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setCanEdit(false);
      }
      
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user, doctocApi, ORG_ID]);

  useEffect(() => {
    if (user?.uid) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProfile({ ...profile! });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!editedProfile?.patient_id) {
        toast.error('No se puede actualizar: ID de paciente no encontrado');
        return;
      }

      const updateRequest = {
        action: 'update' as const,
        orgID: ORG_ID,
        patient_id: editedProfile.patient_id,
        names: editedProfile.names,
        surnames: editedProfile.surnames,
        dni: editedProfile.dni,
        birth_date: editedProfile.birth_date,
        gender: editedProfile.gender as 'Masculino' | 'Femenino' | 'Otro' | undefined,
        phone: editedProfile.phone,
        mail: editedProfile.mail
      };

      const response = await doctocApi.updatePatient(updateRequest);
      
      if (response.status === 'success') {
        setProfile(editedProfile);
        setIsEditing(false);
        toast.success('Perfil actualizado exitosamente');
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setCanEdit(false);
        setIsEditing(false);
        toast.error('No se pudo conectar con el servidor. Edición deshabilitada.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error al guardar los cambios';
        toast.error(errorMessage);
      }
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile! });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-xl">Cargando tu perfil médico...</p>
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
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-6 mb-6 max-w-md">
              <p className="text-red-200">{error}</p>
            </div>
            <button 
              onClick={fetchUserProfile}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!profile) return null;

  return (
    <SidebarLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header con gradiente mejorado */}
          <div className="bg-linear-to-br from-emerald-500 via-green-600 to-teal-700 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
            {/* Decoraciones de fondo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  {/* Avatar mejorado */}
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-4 border-white/30 shadow-xl">
                      {profile.image == null? (
                        <Image
                          src={profile.image || '/default-profile.png'} 
                          alt={profile.name}
                          width={112}
                          height={112}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-14 h-14" />
                      )}
                    </div>
                    {isEditing && canEdit && (
                      <button className="absolute -bottom-2 -right-2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all">
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                    {/* Estado de verificación */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white/30">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                        {profile.role || 'Paciente'}
                      </span>
                      <span className="px-3 py-1 bg-emerald-600/50 text-emerald-100 rounded-lg text-sm">
                        ID: {profile.patient_id?.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-emerald-100">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{profile.mail}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 shadow-lg"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </>
                  ) : (
                    canEdit && (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar Perfil
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{profile.disabled ? 'Inactiva' : 'Activa'}</div>
                  <div className="text-emerald-100 text-sm">Estado cuenta</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{profile.nhc ? 'Sí' : 'No'}</div>
                  <div className="text-emerald-100 text-sm">Historia clínica</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.updated_at ? 'Actualizado' : 'Original'}
                  </div>
                  <div className="text-emerald-100 text-sm">Estado perfil</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje informativo si no se puede editar */}
          {!canEdit && (
            <div className="mb-6 bg-linear-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 border border-yellow-500/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Modo Solo Lectura</h3>
                  <p className="text-yellow-100">La funcionalidad de edición no está disponible en este momento.</p>
                </div>
              </div>
            </div>
          )}

          {/* Grid principal de información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información Personal - Ocupa 2 columnas */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Datos personales principales */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Información Personal</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <User className="w-4 h-4" />
                      Nombre completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Ingresa tu nombre completo"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">{profile.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <Mail className="w-4 h-4" />
                      Correo electrónico
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile?.mail || ''}
                        onChange={(e) => handleInputChange('mail', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="tu@email.com"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">{profile.mail}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="+34 123 456 789"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">{profile.phone || 'No especificado'}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <CreditCard className="w-4 h-4" />
                      DNI
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.dni || ''}
                        onChange={(e) => handleInputChange('dni', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="12345678A"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">{profile.dni || 'No especificado'}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de nacimiento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile?.birth_date || ''}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">
                          {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('es-ES') : 'No especificada'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <User className="w-4 h-4" />
                      Género
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile?.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="">Seleccionar género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-slate-700/50 rounded-xl">
                        <p className="text-white font-medium">{profile.gender || 'No especificado'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel lateral - Información adicional */}
            <div className="space-y-6">
              
              {/* Información del sistema */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Información del Sistema</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Tipo de Usuario</label>
                    <div className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg">
                      <p className="text-green-400 font-medium">{profile.role || 'Paciente'}</p>
                    </div>
                  </div>

                  {profile.document_type && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Tipo de documento</label>
                      <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                        <p className="text-white font-medium">{profile.document_type}</p>
                      </div>
                    </div>
                  )}

                  {profile.document_number && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Número de documento</label>
                      <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                        <p className="text-white font-medium">{profile.document_number}</p>
                      </div>
                    </div>
                  )}

                  {profile.nhc && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Historia Clínica</label>
                      <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                        <p className="text-blue-400 font-medium">{profile.nhc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado de la cuenta */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Estado de Cuenta</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Estado actual</label>
                    <div className={`px-4 py-2 rounded-lg border ${!profile.disabled ? 'bg-green-600/20 border-green-600/30' : 'bg-red-600/20 border-red-600/30'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${!profile.disabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`font-medium ${!profile.disabled ? 'text-green-400' : 'text-red-400'}`}>
                          {!profile.disabled ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Miembro desde</label>
                    <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                      <p className="text-white font-medium">
                        {profile.created_at ? new Date(profile.created_at * 1000).toLocaleDateString('es-ES') : 'No disponible'}
                      </p>
                    </div>
                  </div>

                  {profile.updated_at && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-2">Última actualización</label>
                      <div className="px-4 py-2 bg-slate-700/50 rounded-lg">
                        <p className="text-white font-medium">
                          {new Date(profile.updated_at * 1000).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}