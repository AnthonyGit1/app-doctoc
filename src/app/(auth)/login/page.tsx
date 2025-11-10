"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../presentation/components/ui/Button";
import { Input } from "../../../presentation/components/ui/Input";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import toast from 'react-hot-toast';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Toast de loading
    const loadingToast = toast.loading('Iniciando sesión...');

    try {
      await login(email, password);
      toast.dismiss(loadingToast);
      toast.success('¡Bienvenido de vuelta!');
      // La redirección se maneja en useEffect
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Personalizar mensajes de error de Firebase
      if (errorMessage.includes('user-not-found')) {
        toast.error("No existe una cuenta con este email.");
      } else if (errorMessage.includes('wrong-password')) {
        toast.error("Contraseña incorrecta.");
      } else if (errorMessage.includes('invalid-email')) {
        toast.error("Email inválido.");
      } else if (errorMessage.includes('too-many-requests')) {
        toast.error("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo médico simple y limpio */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#0066ff] rounded-lg mr-3 flex items-center justify-center">
              <span className="text-white text-xl font-bold">D</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Doctoc</h1>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600">
            Accede a tu plataforma médica
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0066ff] focus:ring-[#0066ff] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#0066ff] hover:text-[#0052cc]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-[#0066ff] hover:text-[#0052cc]"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}