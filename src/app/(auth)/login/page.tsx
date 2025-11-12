"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../presentation/components/ui/Button";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import { Navigation } from "../../../presentation/components/layouts/Navigation";
import { Footer } from "../../../presentation/components/layouts/Footer";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Toast de loading
    const loadingToast = toast.loading("Iniciando sesión...");

    try {
      await login(email, password);
      toast.dismiss(loadingToast);
      toast.success("¡Bienvenido de vuelta!");
      // La redirección se maneja en useEffect
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      // Personalizar mensajes de error de Firebase
      if (errorMessage.includes("user-not-found")) {
        toast.error("No existe una cuenta con este email.");
      } else if (errorMessage.includes("wrong-password")) {
        toast.error("Contraseña incorrecta.");
      } else if (errorMessage.includes("invalid-email")) {
        toast.error("Email inválido.");
      } else if (errorMessage.includes("too-many-requests")) {
        toast.error("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      }
    } finally {
      setIsLoading(false);
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
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-400">Accede a tu cuenta médica</p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-800 py-8 px-6 shadow-xl sm:rounded-2xl sm:px-8 border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-green-500 hover:text-green-400"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  ¿No tienes cuenta?{" "}
                  <Link
                    href="/register"
                    className="text-green-500 hover:text-green-400 font-medium"
                  >
                    Crear cuenta
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
