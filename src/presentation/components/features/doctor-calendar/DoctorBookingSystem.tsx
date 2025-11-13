"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Calendar, User, LogIn } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAppointmentTypes } from "../../../hooks/useAppointmentTypes";
import { useCreateAppointment } from "../../../hooks/useCreateAppointment";
import { useOrganizationSedes } from "../../../hooks/useOrganizationSedes";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { TypeSelector } from "./TypeSelector";
import { AppointmentSummary } from "./AppointmentSummary";
import { API_CONFIG } from "../../../../config/constants";

interface DoctorBookingSystemProps {
  doctor: {
    id: string;
    name: string;
  };
  horarios: {
    fijos?: {
      [day: string]: Array<{
        startTime: string;
        endTime: string;
      }>;
    };
  };
}

type BookingStep =
  | "auth-check"
  | "date"
  | "time"
  | "type"
  | "motive"
  | "summary"
  | "success";

const DAYS_MAP = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const DoctorBookingSystem = ({
  doctor,
  horarios,
}: DoctorBookingSystemProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("auth-check");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [motive, setMotive] = useState<string>("");

  const {
    isAuthenticated,
    isLoading: authLoading,
    redirectToLogin,
    user,
  } = useAuth();
  const router = useRouter();

  const {
    types,
    isLoading: typesLoading,
    getTypes,
  } = useAppointmentTypes({
    orgID: API_CONFIG.DEFAULT_ORG_ID,
  });

  const { sedes, getSedes } = useOrganizationSedes({
    orgID: API_CONFIG.DEFAULT_ORG_ID,
  });

  const {
    isCreating,
    error: createError,
    createAppointment,
    clearError,
  } = useCreateAppointment({
    orgID: API_CONFIG.DEFAULT_ORG_ID,
  });

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        setCurrentStep("date");
        getTypes();
        getSedes(); // Cargar sedes disponibles
      } else {
        setCurrentStep("auth-check");
      }
    }
  }, [isAuthenticated, authLoading, getTypes, getSedes]);

  // Generar fechas disponibles
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const hasSchedule =
        horarios.fijos?.[dayName] && horarios.fijos[dayName].length > 0;

      if (hasSchedule) {
        dates.push({
          date: date.toISOString().split("T")[0],
          displayDate: date.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          dayName: DAYS_MAP[dayName as keyof typeof DAYS_MAP] || dayName,
        });
      }
    }

    return dates;
  };

  const getAvailableSlots = () => {
    const selectedDateObj = new Date(selectedDate);
    const dayNameEn = selectedDateObj
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return horarios.fijos?.[dayNameEn] || [];
  };

  const handleLogin = () => {
    const currentUrl = `/doctor/${doctor.id}/calendar`;
    redirectToLogin(currentUrl);
  };

  const handleCreateAppointment = async () => {
    const selectedTypeData = types.find((t) => t.id === selectedType);
    if (!selectedTypeData) {
      toast.error("Tipo de cita no seleccionado");
      return;
    }

    // Obtener la sede por defecto o la primera disponible
    const defaultSede = sedes.find((s) => s.default) || sedes[0];
    if (!defaultSede) {
      toast.error("No hay sedes disponibles");
      return;
    }

    // Verificar si el usuario tiene perfil de paciente, si no, crearlo
    if (!user) {
      toast.error("Usuario no autenticado");
      return;
    }

    // Nota: La verificación y creación del paciente ahora se maneja
    // automáticamente dentro de useCreateAppointment

    const [hours, minutes] = selectedTime.split(":").map(Number);

    // Crear la fecha correctamente sin problemas de zona horaria
    const [year, month, day] = selectedDate.split("-").map(Number);
    const startDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(
      endDateTime.getMinutes() + selectedTypeData.durationMinutes
    );

    const appointmentData = {
      dayKey: `${day.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}`, // Formato DD-MM-YYYY
      scheduledStart: startDateTime.toISOString(),
      scheduledEnd: endDateTime.toISOString(),
      userId: doctor.id,
      type: selectedTypeData.name,
      typeId: selectedTypeData.id,
      motive: motive.trim(),
      locationId: defaultSede.id,
    };

    const success = await createAppointment(appointmentData);
    if (success) {
      setCurrentStep("success");
      toast.success("¡Cita agendada exitosamente!");
    } else {
      toast.error(createError || "Error al agendar la cita");
    }
  };

  const resetForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
    setMotive("");
    setCurrentStep("date");
    clearError();
  };

  const availableDates = getAvailableDates();
  const availableSlots = selectedDate ? getAvailableSlots() : [];
  const selectedTypeData = types.find((t) => t.id === selectedType) || null;

  // Pantalla de verificación de autenticación
  if (currentStep === "auth-check") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-linear-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30">
            <LogIn className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">
            Inicia sesión para agendar tu cita
          </h2>

          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Para agendar una cita con{" "}
            <span className="font-semibold text-blue-400">
              Dr. {doctor.name}
            </span>
            , necesitas tener una cuenta activa o crear una nueva.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-semibold">Iniciar Sesión</span>
            </button>

            <button
              onClick={() =>
                router.push(
                  `/register?returnUrl=${encodeURIComponent(
                    `/doctor/${doctor.id}/calendar`
                  )}`
                )
              }
              className="flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <User className="w-5 h-5" />
              <span className="font-semibold">Crear Cuenta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (currentStep === "success") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-linear-to-br from-green-500/15 via-emerald-500/10 to-green-600/15 border border-green-500/30 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <Calendar className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">
            ¡Cita agendada exitosamente!
          </h2>

          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Tu cita con{" "}
            <span className="font-semibold text-green-400">
              Dr. {doctor.name}
            </span>{" "}
            ha sido programada correctamente. Recibirás una confirmación por
            email con todos los detalles.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => router.push("/appointments")}
              className="px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
            >
              Ver Mis Citas
            </button>

            <button
              onClick={resetForm}
              className="px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
            >
              Agendar Otra Cita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de resumen
  if (currentStep === "summary") {
    return (
      <AppointmentSummary
        doctor={doctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedType={selectedTypeData}
        motive={motive}
        onConfirm={handleCreateAppointment}
        onBack={() => setCurrentStep("motive")}
        isCreating={isCreating}
      />
    );
  }

  // Pasos del formulario
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header del doctor mejorado */}
      <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dr. {doctor.name}
            </h1>
            <p className="text-green-400 text-lg font-medium">
              Agendar nueva cita médica
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de progreso mejorado */}
      <div className="bg-linear-to-r from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          {[
            { step: "date", label: "Fecha", number: 1 },
            { step: "time", label: "Horario", number: 2 },
            { step: "type", label: "Tipo", number: 3 },
            { step: "motive", label: "Motivo", number: 4 },
          ].map(({ step, label, number }) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep === step
                    ? "bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                    : "bg-slate-700 text-gray-400"
                }`}
              >
                {number}
              </div>
              <span
                className={`text-sm mt-2 font-medium transition-colors ${
                  currentStep === step ? "text-green-400" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-green-500 to-emerald-600 transition-all duration-500 rounded-full shadow-lg"
            style={{
              width:
                currentStep === "date"
                  ? "25%"
                  : currentStep === "time"
                  ? "50%"
                  : currentStep === "type"
                  ? "75%"
                  : currentStep === "motive"
                  ? "100%"
                  : "0%",
            }}
          />
        </div>
      </div>

      {/* Contenido del paso actual mejorado */}
      <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
        {currentStep === "date" && (
          <div>
            <DateSelector
              availableDates={availableDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setCurrentStep("time")}
                disabled={!selectedDate}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                Continuar al horario
              </button>
            </div>
          </div>
        )}

        {currentStep === "time" && (
          <div>
            <TimeSelector
              availableSlots={availableSlots}
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              selectedDate={selectedDate}
            />

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep("date")}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep("type")}
                disabled={!selectedTime}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                Continuar al tipo
              </button>
            </div>
          </div>
        )}

        {currentStep === "type" && (
          <div>
            <TypeSelector
              types={types}
              selectedType={selectedType}
              onTypeSelect={setSelectedType}
              isLoading={typesLoading}
            />

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep("time")}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep("motive")}
                disabled={!selectedType}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                Continuar al motivo
              </button>
            </div>
          </div>
        )}

        {currentStep === "motive" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                <LogIn className="w-4 h-4 text-white" />
              </div>
              <label className="text-xl font-semibold text-white">
                Motivo de la consulta
              </label>
            </div>

            <div className="bg-linear-to-br from-slate-700/80 to-slate-800/80 rounded-2xl p-6 border border-slate-600/50">
              <textarea
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                placeholder="Describe detalladamente el motivo de tu consulta. Esto ayudará al doctor a prepararse mejor para tu cita..."
                className="w-full px-6 py-4 bg-slate-800/80 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-300 text-lg leading-relaxed"
                rows={6}
              />
            </div>

            {/* Error mejorado */}
            {createError && (
              <div className="bg-linear-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-2xl p-6">
                <p className="text-red-400 text-lg">{createError}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep("type")}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep("summary")}
                disabled={!motive.trim()}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                Revisar cita
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
