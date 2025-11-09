"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useAuth } from "../../../contexts/AuthContext";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      
      // Redireccionar al login con mensaje de éxito
      router.push("/login?message=Cuenta creada exitosamente. Ahora puedes iniciar sesión.");
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Personalizar mensajes de error de Firebase
      if (errorMessage.includes('email-already-in-use')) {
        setError("Ya existe una cuenta con este email.");
      } else if (errorMessage.includes('weak-password')) {
        setError("La contraseña es muy débil.");
      } else if (errorMessage.includes('invalid-email')) {
        setError("Email inválido.");
      } else {
        setError("Error al crear la cuenta. Inténtalo de nuevo.");
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
              <span className="text-white text-xl font-bold">+</span>
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
                  {error}
                </div>
              </div>
            )}

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