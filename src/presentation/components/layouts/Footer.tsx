'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Organization } from '../../../core/domain/entities/Organization';

interface FooterProps {
  organization?: Partial<Organization>;
}

export const Footer = ({ organization }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {organization?.logo && (
                <Image 
                  src={organization.logo} 
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              )}
              <h3 className="text-xl font-bold">
                {organization?.name || 'Clínica Doctoc'}
              </h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {organization?.description || 
               'Tu salud es nuestra prioridad. Brindamos atención médica de calidad con doctores especializados.'}
            </p>
            
            {/* Social Media */}
            {organization?.socialMedia && (
              <div className="flex gap-4">
                {organization.socialMedia.facebook && (
                  <a 
                    href={organization.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {organization.socialMedia.twitter && (
                  <a 
                    href={organization.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {organization.socialMedia.instagram && (
                  <a 
                    href={organization.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/doctors/browse" className="hover:text-white transition-colors">
                  Ver Doctores
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Agendar Cita
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Mi Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                {organization?.website ? (
                  <a 
                    href={organization.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Sitio Web
                  </a>
                ) : (
                  'Información próximamente'
                )}
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Crear Cuenta
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {organization?.name || 'Clínica Doctoc'}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};