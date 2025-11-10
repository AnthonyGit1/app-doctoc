'use client';

import Image from 'next/image';
import Link from 'next/link';

interface NavigationProps {
  organizationName?: string;
  logo?: string;
  transparent?: boolean;
}

export const Navigation = ({ 
  organizationName = 'Clínica Doctoc', 
  logo,
  transparent = false 
}: NavigationProps) => {
  return (
    <nav className={`${transparent ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} border-b border-gray-200 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logo && (
                <Image 
                  src={logo} 
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain mr-3"
                />
              )}
              <span className="text-xl font-bold text-gray-900">
                {organizationName}
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#especialidades" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Especialidades
            </a>
            <a href="#ubicaciones" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Ubicaciones
            </a>
            <Link href="/doctors/browse" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Ver Doctores
            </Link>
          </div>

          {/* Botones de autenticación */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};