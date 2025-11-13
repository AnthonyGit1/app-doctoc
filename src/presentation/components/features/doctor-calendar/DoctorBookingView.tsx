'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAppointmentTypes } from '../../../hooks/useAppointmentTypes';
import { useCreateAppointment } from '../../../hooks/useCreateAppointment';
import { API_CONFIG } from '../../../../config/constants';

interface DoctorBookingViewProps {
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

const DAYS_MAP = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export const DoctorBookingView = ({ doctor, horarios }: DoctorBookingViewProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [motive, setMotive] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { types, isLoading: typesLoading, getTypes } = useAppointmentTypes({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  const { isCreating, error: createError, createAppointment, clearError } = useCreateAppointment({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  // Generar las próximas 7 fechas disponibles
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) { // Próximas 2 semanas
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const hasSchedule = horarios.fijos?.[dayName] && horarios.fijos[dayName].length > 0;
      
      if (hasSchedule) {
        dates.push({
          date: date.toISOString().split('T')[0],
          displayDate: date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          }),
          dayName
        });
      }
    }
    
    return dates;
  };

  // Obtener horarios disponibles para un día
  const getAvailableSlots = (dayName: string) => {
    return horarios.fijos?.[dayName] || [];
  };

  const availableDates = getAvailableDates();

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedType || !motive.trim()) {
      return;
    }

    const selectedTypeData = types.find(t => t.id === selectedType);
    if (!selectedTypeData) return;

    // Calcular hora de inicio y fin
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + selectedTypeData.durationMinutes);

    const appointmentData = {
      dayKey: selectedDate.split('-').reverse().join('-'), // DD-MM-YYYY
      scheduledStart: startDateTime.toISOString(),
      scheduledEnd: endDateTime.toISOString(),
      patient: "temp_patient_id", // Se necesitaría el ID del paciente real
      userId: doctor.id,
      type: selectedTypeData.name,
      typeId: selectedTypeData.id,
      motive: motive.trim(),
      locationId: "sede_default" // Se necesitaría la sede real
    };

    const success = await createAppointment(appointmentData);
    if (success) {
      setBookingSuccess(true);
      setShowBookingForm(false);
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedType('');
      setMotive('');
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-linear-to-br from-green-500/15 via-emerald-500/10 to-green-600/15 border border-green-500/30 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-6">
            ¡Cita agendada exitosamente!
          </h3>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Tu cita con <span className="font-semibold text-green-400">Dr. {doctor.name}</span> ha sido programada 
            correctamente. Recibirás una confirmación por email.
          </p>
          
          <button
            onClick={() => setBookingSuccess(false)}
            className="px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
          >
            Agendar otra cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Dr. {doctor.name}</h2>
              <p className="text-green-400 text-lg font-medium">Calendario de Atención</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 ${
              showBookingForm 
                ? 'bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {showBookingForm ? 'Cancelar' : 'Agendar Cita'}
          </button>
        </div>

        {/* Horarios disponibles */}
        {!showBookingForm && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Horarios de Atención
              </h3>
            </div>
            
            <div className="grid gap-6">
              {Object.entries(horarios.fijos || {}).map(([day, schedules]) => 
                schedules.length > 0 && (
                  <div key={day} className="bg-linear-to-r from-slate-700/80 to-slate-800/80 rounded-2xl p-6 border border-slate-600/50">
                    <h4 className="text-xl font-bold text-white mb-4 capitalize">
                      {DAYS_MAP[day as keyof typeof DAYS_MAP] || day}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-gray-300 bg-linear-to-r from-slate-600/80 to-slate-700/80 rounded-xl p-4 border border-slate-500/30">
                          <Clock className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="font-medium">{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Tipos de consulta */}
            {!typesLoading && types.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Tipos de Consulta
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {types.map((type) => (
                    <div key={type.id} className="bg-linear-to-br from-slate-700/80 to-slate-800/80 rounded-2xl p-6 border border-slate-600/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{type.name}</h4>
                          <p className="text-gray-400 leading-relaxed">{type.description}</p>
                        </div>
                        <div className="bg-linear-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full">
                          <span className="text-white font-bold">S/ {type.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-600/60 rounded-lg w-fit">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-medium">{type.durationMinutes} minutos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulario de agendamiento mejorado */}
        {showBookingForm && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Agendar Nueva Cita
              </h3>
            </div>

            {/* Seleccionar fecha */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Seleccionar fecha disponible
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDates.map((dateInfo) => (
                  <button
                    key={dateInfo.date}
                    onClick={() => setSelectedDate(dateInfo.date)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                      selectedDate === dateInfo.date
                        ? 'bg-linear-to-br from-green-500/20 to-emerald-600/20 border-green-500 text-green-400 shadow-xl shadow-green-500/25'
                        : 'bg-linear-to-br from-slate-700/80 to-slate-800/80 border-slate-600 text-gray-300 hover:bg-linear-to-br hover:from-slate-600/80 hover:to-slate-700/80'
                    }`}
                  >
                    <div className="text-xl font-bold">{dateInfo.displayDate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seleccionar hora */}
            {selectedDate && (
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-white">
                  Seleccionar horario
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {getAvailableSlots(availableDates.find(d => d.date === selectedDate)?.dayName || '').map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(slot.startTime)}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                        selectedTime === slot.startTime
                          ? 'bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/50'
                          : 'bg-linear-to-br from-slate-700 to-slate-800 text-gray-300 hover:from-green-600/30 hover:to-green-700/30'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seleccionar tipo de consulta */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Tipo de consulta
              </label>
              <div className="space-y-4">
                {types.map((type) => (
                  <label key={type.id} className={`flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedType === type.id
                      ? 'bg-linear-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500'
                      : 'bg-linear-to-br from-slate-700/80 to-slate-800/80 border-2 border-slate-600 hover:border-slate-500'
                  }`}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="mr-4 text-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xl font-bold ${selectedType === type.id ? 'text-green-400' : 'text-white'}`}>
                          {type.name}
                        </span>
                        <span className={`text-xl font-bold ${selectedType === type.id ? 'text-green-400' : 'text-green-500'}`}>
                          S/ {type.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-gray-400">
                        <span>{type.description}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {type.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white">
                Motivo de la consulta
              </label>
              <div className="bg-linear-to-br from-slate-700/80 to-slate-800/80 rounded-2xl p-6 border border-slate-600/50">
                <textarea
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  placeholder="Describe detalladamente el motivo de tu consulta. Esta información ayudará al doctor a prepararse mejor para tu cita..."
                  className="w-full px-6 py-4 bg-slate-800/80 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-300"
                  rows={5}
                />
              </div>
            </div>

            {/* Error */}
            {createError && (
              <div className="bg-linear-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-2xl p-6">
                <p className="text-red-400 text-lg">{createError}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-6">
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || !selectedType || !motive.trim() || isCreating}
                className="flex-1 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                {isCreating ? 'Agendando cita...' : 'Confirmar Cita'}
              </button>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  clearError();
                }}
                className="px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};