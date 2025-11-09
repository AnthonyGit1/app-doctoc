import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';

export default function PatientsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600">
            Administra los perfiles y historiales médicos de tus pacientes
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👥</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Sistema de Gestión de Pacientes
            </h2>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad estará disponible próximamente. Podrás gestionar 
              perfiles de pacientes, historiales médicos y seguimiento completo.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>📋 Perfiles completos de pacientes</p>
              <p>🏥 Historiales médicos digitales</p>
              <p>📊 Seguimiento de tratamientos</p>
              <p>🔒 Seguridad y privacidad garantizada</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}