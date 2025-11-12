'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import { User, ChevronDown, LogOut, Calendar, Settings } from 'lucide-react';

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
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };
  return (
    <nav className={`${transparent ? 'bg-gray-900/95 backdrop-blur-md border-gray-800' : 'bg-linear-to-r from-gray-900 via-gray-800 to-gray-900'} border-b border-gray-800 sticky top-0 z-50 shadow-xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              {logo && (
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 border border-green-500/30 group-hover:bg-green-500/30 transition-all duration-300">
                  <Image 
                    src={logo} 
                    alt="Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-xl font-bold bg-linear-to-r from-white via-green-400 to-white bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-green-100 transition-all duration-300">
                {organizationName}
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#especialidades" className="text-gray-300 hover:text-green-400 font-medium transition-all duration-300 relative group">
              Especialidades
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/#ubicaciones" className="text-gray-300 hover:text-green-400 font-medium transition-all duration-300 relative group">
              Ubicaciones
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/#buscador-doctores" className="text-gray-300 hover:text-green-400 font-medium transition-all duration-300 relative group">
              Buscar Doctores
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </div>

          {/* Botones de autenticación / Perfil de usuario */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Usuario logueado - Mostrar dropdown del perfil
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500 group"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:from-green-400 group-hover:to-green-500 transition-all duration-300">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium hidden sm:inline group-hover:text-white transition-colors">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 backdrop-blur-sm">
                    <div className="py-2">
                      {/* Info del usuario */}
                      <div className="px-4 py-3 border-b border-gray-700 bg-linear-to-r from-gray-800 to-gray-900 rounded-t-xl">
                        <p className="text-sm font-medium text-white">
                          {user.displayName || 'Usuario'}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Opciones del menú */}
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Calendar className="w-4 h-4 mr-3 text-gray-400 group-hover:text-green-400 transition-colors" />
                        Dashboard
                      </Link>

                      <Link
                        href="/appointments"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 transition-all duration-200 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-green-400 transition-colors" />
                        Mis Citas
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group rounded-b-xl"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-300 transition-colors" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Usuario no logueado - Mostrar botones de login/register
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-green-400 font-medium transition-all duration-300 relative group"
                >
                  Iniciar Sesión
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  href="/register"
                  className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 border border-green-500/30 hover:border-green-400"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};