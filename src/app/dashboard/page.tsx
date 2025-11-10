import SidebarLayout from '../../presentation/components/layouts/SidebarLayout';

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Header de bienvenida */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a tu Dashboard
          </h1>
          <p className="text-gray-600">
            Gestiona tu práctica médica desde un solo lugar
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}           