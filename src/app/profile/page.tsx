'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';
import { useAuth } from '../../infrastructure/auth/AuthContext';
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
  FileText,
  CreditCard
} from 'lucide-react';

interface UserProfile {
  patient_id: string;
  name: string;
  names: string;
  surnames: string;
  dni?: string;
  birth_date?: string;
  gender?: string; // Cambiado para ser más flexible con la API
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
      if (!patientFound && user.displayName) {
        try {
          searchResult = await doctocApi.searchPatients({
            action: 'search' as const,
            orgID: ORG_ID,
            type: 'nombre' as const,
            text: user.displayName.split(' ')[0],
            limit: 10
          });
          
          if (searchResult?.patients?.length > 0) {
            const patientByName = searchResult.patients.find(p => 
              p.mail?.toLowerCase() === user.email?.toLowerCase() ||
              p.name?.toLowerCase().includes(user.displayName?.toLowerCase() || '')
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
        setCanEdit(false); // Deshabilitar edición si no se encuentra el paciente
        throw new Error('No se encontró el perfil del paciente en el sistema');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Si hay problemas de conectividad, deshabilitar edición
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

      // Usar el endpoint principal para actualizar
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
      // Si hay error de API, deshabilitar edición
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando perfil...</p>
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
              onClick={fetchUserProfile}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
                <p className="text-gray-400">Gestiona tu información personal y profesional</p>
              </div>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Guardar
                    </button>
                  </>
                ) : (
                  canEdit && (
                    <button
                      onClick={handleEditToggle}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar Perfil
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Foto de perfil y información básica */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile.image == null ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={profile.image} 
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {isEditing && canEdit && (
                  <button className="absolute -bottom-2 -right-2 p-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-green-400 font-medium">{profile.role || 'Paciente'}</p>
                <p className="text-gray-400">{profile.mail}</p>
                {profile.dni && (
                  <p className="text-gray-500 text-sm">DNI: {profile.dni}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mensaje informativo si no se puede editar */}
          {!canEdit && (
            <div className="mb-6 bg-yellow-900 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-sm">
                  ⚠️
                </div>
                <div>
                  <p className="text-yellow-200 font-medium">Modo solo lectura</p>
                  <p className="text-yellow-300 text-sm">La funcionalidad de edición no está disponible en este momento.</p>
                </div>
              </div>
            </div>
          )}

          {/* Información del perfil */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información personal */}
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nombre completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4" />
                    Correo electrónico
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile?.mail || ''}
                      onChange={(e) => handleInputChange('mail', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.mail}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.phone || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <CreditCard className="w-4 h-4" />
                    DNI
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.dni || ''}
                      onChange={(e) => handleInputChange('dni', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Número de DNI"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.dni || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de nacimiento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile?.birth_date || ''}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <p className="text-white font-medium">
                      {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('es-ES') : 'No especificada'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    Género
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium">{profile.gender || 'No especificado'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información profesional */}
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Información Adicional
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Shield className="w-4 h-4" />
                    Tipo de Usuario
                  </label>
                  <p className="text-white font-medium">{profile.role || 'Paciente'}</p>
                </div>

                {profile.document_type && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de documento</label>
                    <p className="text-white font-medium">{profile.document_type}</p>
                  </div>
                )}

                {profile.document_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Número de documento</label>
                    <p className="text-white font-medium">{profile.document_number}</p>
                  </div>
                )}

                {profile.nhc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Número de Historia Clínica</label>
                    <p className="text-white font-medium">{profile.nhc}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Miembro desde</label>
                  <p className="text-white font-medium">
                    {profile.created_at ? new Date(profile.created_at * 1000).toLocaleDateString('es-ES') : 'No disponible'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Estado de la cuenta</span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      profile.disabled 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {profile.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </div>
                </div>

                {profile.updated_at && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Última actualización</label>
                    <p className="text-white text-sm">
                      {new Date(profile.updated_at * 1000).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}