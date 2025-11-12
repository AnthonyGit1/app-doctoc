'use client';

import { ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../ui/Button';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  organizationName?: string;
  description?: string;
  logo?: string;
  onSearchDoctors?: () => void;
}

export const HeroSection = ({ 
  organizationName = 'Clínica Doctoc',
  description = 'Tu salud es nuestra prioridad. Encuentra el mejor doctor para ti.',
  logo,
  onSearchDoctors 
}: HeroSectionProps) => {
  const router = useRouter();

  const handleSearchClick = () => {
    if (onSearchDoctors) {
      onSearchDoctors();
    } else {
      router.push('/doctors/search');
    }
  };

  return (
    <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full translate-y-32 -translate-x-32"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4 mb-8">
              {logo && (
                <Image 
                  src={logo} 
                  alt={`${organizationName} logo`}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              )}
              <h1 className="text-3xl lg:text-4xl font-bold">
                {organizationName}
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              {description}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={handleSearchClick}
                size="lg"
                className="bg-green-500 text-white hover:bg-green-600 px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Ver Doctores
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={handleSearchClick}
                className="border-green-500 text-green-500 hover:text-white hover:bg-green-500 px-8 py-4 text-lg font-semibold"
              >
                <Users className="w-5 h-5 mr-2" />
                Agendar Cita
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold mb-1 text-green-400">100+</div>
                <div className="text-gray-400">Doctores Especialistas</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold mb-1 text-green-400">20+</div>
                <div className="text-gray-400">Especialidades</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold mb-1 text-green-400">5+</div>
                <div className="text-gray-400">Ubicaciones</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative lg:pl-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12">
              {/* Medical Icons Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-white space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium">Citas Online</span>
                </div>
                
                <div className="flex flex-col items-center text-white space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium">Doctores Expertos</span>
                </div>
                
                <div className="flex flex-col items-center text-white space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium">Múltiples Sedes</span>
                </div>
                
                <div className="flex flex-col items-center text-white space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Alta Calidad</span>
                </div>
              </div>
              
              {/* Central Element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8h3l-4-4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};