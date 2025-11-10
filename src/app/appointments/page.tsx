import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';

export default function AppointmentsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mis Citas
          </h1>
          <p className="text-gray-600">
            Gestiona todas tus citas médicas desde aquí
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Gestión de Citas
            </h2>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad estará disponible próximamente. Podrás programar, 
              modificar y gestionar todas tus citas médicas desde esta sección.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>✨ Programación inteligente de citas</p>
              <p>🔔 Recordatorios automáticos</p>
              <p>📝 Historial completo de consultas</p>
              <p>💬 Comunicación directa con doctores</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}