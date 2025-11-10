"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../presentation/components/ui/Button";
import { Input } from "../../../presentation/components/ui/Input";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import toast from 'react-hot-toast';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, user } = useAuth();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Toast de loading
    const loadingToast = toast.loading('Creando cuenta...');

    try {
      await register(formData.email, formData.password, formData.name);
      
      toast.dismiss(loadingToast);
      toast.success('¡Bienvenido a Doctoc! Cuenta creada exitosamente.');
      
      // Como Firebase registra y autentica automáticamente,
      // esperamos un momento para que el useEffect detecte el user
      // y redirija al dashboard
      
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Personalizar mensajes de error de Firebase
      if (errorMessage.includes('email-already-in-use')) {
        toast.error("Ya existe una cuenta con este email.");
      } else if (errorMessage.includes('weak-password')) {
        toast.error("La contraseña es muy débil.");
      } else if (errorMessage.includes('invalid-email')) {
        toast.error("Email inválido.");
      } else {
        toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            Crear Cuenta
          </h2>
          <p className="text-gray-600">
            Únete a nuestra plataforma médica
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nombre completo del paciente"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre y apellidos completos"
              required
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="paciente@ejemplo.com"
              required
            />

            <Input
              label="Contraseña segura"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirma tu contraseña"
              required
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#0066ff] focus:ring-[#0066ff] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Acepto los{" "}
                <Link href="/terms" className="text-[#0066ff] hover:text-[#0052cc]">
                  términos y condiciones
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || !formData.name || !formData.email || !formData.password}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-[#0066ff] hover:text-[#0052cc]"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}