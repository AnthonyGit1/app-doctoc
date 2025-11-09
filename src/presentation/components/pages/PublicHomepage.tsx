'use client';

import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PublicHomepage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // useEffect manejará la redirección
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navegación superior */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Doctoc
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#0066ff] font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto principal */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Gestiona tu práctica médica de manera
                <span className="text-[#0066ff] block">inteligente</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Doctoc es la plataforma integral que conecta doctores y pacientes, 
                facilitando la gestión de citas, historiales médicos y consultorios 
                de manera eficiente y segura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] inline-flex items-center justify-center"
                >
                  Comenzar ahora
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#features"
                  className="border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] inline-flex items-center justify-center"
                >
                  Ver características
                </Link>
              </div>
            </div>

            {/* Imagen/Gráficos */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  {/* Simulación de tarjeta de doctor */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-[#0052cc] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      👨‍⚕️
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. Juan Pérez</h3>
                      <p className="text-gray-600">Cardiología</p>
                      <div className="flex items-center text-yellow-500">
                        ⭐⭐⭐⭐⭐ <span className="text-gray-500 ml-1">4.9</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulación de calendario */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 font-medium">Lun</div>
                      <div className="mt-1 p-2 bg-[#0066ff]/10 rounded text-[#0066ff] font-semibold">15</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 font-medium">Mar</div>
                      <div className="mt-1 p-2 bg-gray-100 rounded text-gray-400 font-semibold">16</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 font-medium">Mié</div>
                      <div className="mt-1 p-2 bg-[#0066ff] text-white rounded font-semibold">17</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en una plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doctoc facilita la gestión integral de tu práctica médica con herramientas 
              modernas y una interfaz intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Búsqueda de Doctores
              </h3>
              <p className="text-gray-600">
                Encuentra el especialista ideal por ubicación, especialidad y disponibilidad 
                con nuestra potente herramienta de búsqueda.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gestión de Citas
              </h3>
              <p className="text-gray-600">
                Programa, modifica y cancela citas de manera sencilla con nuestro 
                calendario inteligente y notificaciones automáticas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gestión de Pacientes
              </h3>
              <p className="text-gray-600">
                Mantén un registro completo de tus pacientes con historiales médicos 
                seguros y accesibles desde cualquier dispositivo.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Seguridad Garantizada
              </h3>
              <p className="text-gray-600">
                Todos los datos están protegidos con cifrado de nivel empresarial 
                y cumplimos con las normativas de privacidad médica.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Reportes y Análisis
              </h3>
              <p className="text-gray-600">
                Obtén insights valiosos sobre tu práctica con reportes detallados 
                y métricas de rendimiento en tiempo real.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-[#0066ff]/5 transition-colors">
              <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Acceso Móvil
              </h3>
              <p className="text-gray-600">
                Gestiona tu consulta desde cualquier lugar con nuestra aplicación 
                web responsive optimizada para todos los dispositivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0066ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para modernizar tu práctica médica?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Únete a miles de profesionales de la salud que ya confían en Doctoc 
            para gestionar sus consultorios de manera eficiente.
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-50 text-[#0066ff] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] inline-flex items-center"
          >
            Comenzar gratis hoy
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#0066ff] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  D
                </div>
                <span className="ml-3 text-xl font-bold">Doctoc</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                La plataforma líder en gestión médica que conecta a profesionales 
                de la salud con sus pacientes de manera eficiente y segura.
              </p>
            </div>

            {/* Enlaces */}
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Doctoc. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
