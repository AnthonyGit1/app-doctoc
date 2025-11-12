'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Organization } from '../../../core/domain/entities/Organization';
import { useAuth } from '../../../infrastructure/auth/AuthContext';

interface FooterProps {
  organization?: Partial<Organization>;
}

export const Footer = ({ organization }: FooterProps) => {
  const { user } = useAuth();
  
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {organization?.logo && (
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <Image 
                    src={organization.logo} 
                    alt="Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {organization?.name || 'Clínica Doctoc'}
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {organization?.description || 
               'Tu salud es nuestra prioridad. Brindamos atención médica de calidad con doctores especializados y tecnología de vanguardia.'}
            </p>
            
            {/* Social Media */}
            {organization?.socialMedia && (
              <div className="flex gap-6">
                {organization.socialMedia.facebook && (
                  <a 
                    href={organization.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 border border-gray-700 hover:border-green-500"
                  >
                    <span className="text-sm font-medium">FB</span>
                  </a>
                )}
                {organization.socialMedia.twitter && (
                  <a 
                    href={organization.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 border border-gray-700 hover:border-green-500"
                  >
                    <span className="text-sm font-medium">TW</span>
                  </a>
                )}
                {organization.socialMedia.instagram && (
                  <a 
                    href={organization.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 border border-gray-700 hover:border-green-500"
                  >
                    <span className="text-sm font-medium">IG</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Enlaces de Servicios */}
          <div>
            <h4 className="text-lg font-bold text-green-400 mb-6 border-b border-gray-700 pb-2">Servicios</h4>
            <ul className="space-y-3">
              {user ? (
                // Usuario logueado
                <>
                  <li>
                    <Link href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Mi Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/appointments" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Mis Citas
                    </Link>
                  </li>
                  <li>
                    <a href="#buscador-doctores" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Buscar Doctores
                    </a>
                  </li>
                  <li>
                    <Link href="/profile" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Mi Perfil
                    </Link>
                  </li>
                </>
              ) : (
                // Usuario no logueado
                <>
                  <li>
                    <a href="#buscador-doctores" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Buscar Doctores
                    </a>
                  </li>
                  <li>
                    <a href="#especialidades" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Especialidades
                    </a>
                  </li>
                  <li>
                    <a href="#ubicaciones" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Ubicaciones
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-lg font-bold text-green-400 mb-6 border-b border-gray-700 pb-2">
              {user ? 'Mi Cuenta' : 'Información'}
            </h4>
            <ul className="space-y-3">
              {user ? (
                // Usuario logueado 
                <>
                  <li>
                    <span className="text-gray-300 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></span>
                      Bienvenido, {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </li>
                  <li>
                    <Link href="/profile" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Configuración
                    </Link>
                  </li>
                  {organization?.website && (
                    <li>
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                        Sitio Web
                      </a>
                    </li>
                  )}
                </>
              ) : (
                // Usuario no logueado
                <>
                  <li>
                    <Link href="/register" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Crear Cuenta
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                      Iniciar Sesión
                    </Link>
                  </li>
                  {organization?.website ? (
                    <li>
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center group"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                        Sitio Web
                      </a>
                    </li>
                  ) : (
                    <li>
                      <span className="text-gray-400 flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3"></span>
                        Información próximamente
                      </span>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2025 {organization?.name || 'Clínica Doctoc'}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};