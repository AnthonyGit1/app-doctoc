"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../components/ui/Button";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect se encargará de la redirección
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#0066ff] rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0066ff]">Doctoc</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bienvenido, {user.displayName || user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a Doctoc!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu plataforma para gestión de citas médicas
            </p>
            
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Información de tu cuenta
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Usuario:</strong> {user.displayName || 'Sin nombre'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email verificado:</strong> {user.emailVerified ? 'Sí' : 'No'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Buscar Doctores
                </h3>
                <p className="text-gray-600 mb-4">
                  Encuentra doctores por especialidad y disponibilidad
                </p>
                <Button className="w-full">
                  Próximamente
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mis Citas
                </h3>
                <p className="text-gray-600 mb-4">
                  Ver y gestionar tus citas programadas
                </p>
                <Button className="w-full" variant="outline">
                  Próximamente
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mi Perfil
                </h3>
                <p className="text-gray-600 mb-4">
                  Actualiza tu información personal
                </p>
                <Button className="w-full" variant="outline">
                  Próximamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}