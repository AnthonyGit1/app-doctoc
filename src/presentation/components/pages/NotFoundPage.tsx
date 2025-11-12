'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Navigation } from '../layouts/Navigation';
import { Footer } from '../layouts/Footer';
import { Home, ArrowLeft, FileX } from 'lucide-react';

export function NotFoundPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoBack = () => {
    if (isClient && window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navigation transparent={true} />

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <FileX className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Página no encontrada
            </h2>
            <p className="text-gray-400">La página que buscas no existe</p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-800 py-8 px-6 shadow-xl sm:rounded-2xl sm:px-8 border border-gray-700">
              {/* Número 404 */}
              <div className="text-center mb-6">
                <h1 className="text-6xl font-bold text-white mb-3">
                  4<span className="text-green-500">0</span>4
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Lo sentimos, la página que buscas no existe.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="space-y-6">
                <Link href="/" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium">
                    <Home className="mr-2 h-5 w-5" />
                    Ir al inicio
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleGoBack}
                  variant="outline" 
                  className="w-full border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white py-3 rounded-lg font-medium"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver atrás
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}