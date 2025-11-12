"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../presentation/components/ui/Button";
import { useAuth } from "../../../infrastructure/auth/AuthContext";
import { Navigation } from "../../../presentation/components/layouts/Navigation";
import { Footer } from "../../../presentation/components/layouts/Footer";
import { DoctocApi } from "../../../infrastructure/api/doctoc-api";
import { DoctocApiClient } from "../../../infrastructure/api/api-client";
import { API_CONFIG } from "../../../config/constants";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  Calendar,
  Phone,
  CreditCard,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Credenciales de acceso (Step 1)
    email: "",
    password: "",
    confirmPassword: "",
    // Información personal (Step 2)
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    birthDate: "",
    gender: "Masculino",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, user } = useAuth();

  useEffect(() => {
    // Redirigir si ya está autenticado
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleNextStep = () => {
    // Validar Step 1
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!formData.email) {
      toast.error("El correo electrónico es requerido");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar campos requeridos del Step 2
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dni ||
      !formData.phone
    ) {
      toast.error("Todos los campos son requeridos");
      setIsLoading(false);
      return;
    }

    // Toast de loading
    const loadingToast = toast.loading("Creando cuenta...");

    try {
      // 1. Crear usuario en Firebase
      await register(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`
      );

      // 2. Crear paciente en API de Doctoc
      const apiClient = new DoctocApiClient(
        API_CONFIG.BASE_URL,
        API_CONFIG.AUTH_TOKEN
      );
      const doctocApi = new DoctocApi(apiClient);

      const patientData = {
        orgID: API_CONFIG.DEFAULT_ORG_ID,
        action: "create" as const,
        names: formData.firstName,
        surnames: formData.lastName,
        dni: formData.dni,
        phone: formData.phone,
        mail: formData.email,
        birth_date: formData.birthDate,
        gender: formData.gender as "Masculino" | "Femenino" | "Otro",
      };

      await doctocApi.createPatient(patientData);

      toast.dismiss(loadingToast);
      toast.success("¡Cuenta creada exitosamente!");

      router.push("/");
    } catch (error: unknown) {
      console.error("Error en registro:", error);
      toast.dismiss(loadingToast);

      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          toast.error("Este correo ya está registrado");
        } else if (error.message.includes("weak-password")) {
          toast.error("La contraseña es muy débil");
        } else {
          toast.error("Error al crear la cuenta. Intenta de nuevo.");
        }
      } else {
        toast.error("Error inesperado. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navigation transparent={true} />

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Crea tu Cuenta</h2>
          <p className="text-gray-400">
            Únete para agendar citas médicas en línea
          </p>

          {/* Progress Steps */}
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center ${
                  step >= 1 ? "text-green-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= 1
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-500 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  Cuenta
                </span>
              </div>
              <div className="w-8 h-0.5 bg-gray-600"></div>
              <div
                className={`flex items-center ${
                  step >= 2 ? "text-green-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= 2
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-500 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  Información Personal
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-6 shadow-xl sm:rounded-2xl sm:px-8 border border-gray-700">
            {step === 1 ? (
              // Step 1: Credenciales de Acceso
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Credenciales de Acceso
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Crea tu cuenta de acceso
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rosaspiscanthony@gmail.com"
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
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Mín. 6 caracteres"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repetir contraseña"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    Siguiente Paso
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              // Step 2: Información Personal
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Datos Personales
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Completa tu información personal
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombres
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Juan Carlos"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Apellidos
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Pérez López"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      DNI
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Género
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+51 999 999 999"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 bg-gray-600 border-gray-600 text-gray-300 hover:bg-gray-700 py-3 rounded-lg font-medium flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Volver
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium"
                    >
                      {isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-green-500 hover:text-green-400 font-medium"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
