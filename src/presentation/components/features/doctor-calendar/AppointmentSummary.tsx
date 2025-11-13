'use client';

import { Calendar, Clock, DollarSign, User, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

interface AppointmentSummaryProps {
  doctor: {
    id: string;
    name: string;
  };
  selectedDate: string;
  selectedTime: string;
  selectedType: AppointmentType | null;
  motive: string;
  selectedSede?: {
    id: string;
    name: string;
    distrito?: string;
    departamento?: string;
  };
  onConfirm: () => void;
  onBack: () => void;
  isCreating: boolean;
}

export const AppointmentSummary = ({
  doctor,
  selectedDate,
  selectedTime,
  selectedType,
  motive,
  selectedSede,
  onConfirm,
  onBack,
  isCreating
}: AppointmentSummaryProps) => {
  const formatDate = (dateString: string) => {
    // Parsear la fecha correctamente sin problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
        
        {/* Header mejorado */}
        <div className="bg-linear-to-r from-green-500/20 via-emerald-500/15 to-green-600/20 border-b border-green-500/30 p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Confirmar Cita Médica</h2>
              <p className="text-green-400 text-lg">Revisa cuidadosamente todos los detalles</p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8 space-y-6">
          
          {/* Doctor con diseño mejorado */}
          <div className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-blue-400 text-sm font-semibold mb-1">MÉDICO ESPECIALISTA</p>
                <p className="text-2xl font-bold text-white">Dr. {doctor.name}</p>
              </div>
            </div>
          </div>

          {/* Sede */}
          {selectedSede && (
            <div className="bg-linear-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-cyan-400 text-sm font-semibold mb-1">SEDE DE ATENCIÓN</p>
                  <p className="text-2xl font-bold text-white">{selectedSede.name}</p>
                  {(selectedSede.distrito || selectedSede.departamento) && (
                    <p className="text-cyan-200 text-sm mt-1">
                      {selectedSede.distrito && selectedSede.distrito + ', '}{selectedSede.departamento || 'Lima'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fecha y hora en grid mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-purple-500/15 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-purple-400 text-sm font-semibold mb-1">FECHA DE CITA</p>
                  <p className="text-lg font-bold text-white capitalize leading-tight">{formatDate(selectedDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-orange-500/15 to-amber-500/10 border border-orange-500/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-orange-400 text-sm font-semibold mb-1">HORARIO</p>
                  <p className="text-lg font-bold text-white">
                    {selectedTime} - {selectedType ? calculateEndTime(selectedTime, selectedType.durationMinutes) : '--:--'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tipo de consulta mejorado */}
          {selectedType && (
            <div className="bg-linear-to-br from-emerald-500/15 to-green-600/10 border border-emerald-500/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-emerald-400 text-sm font-semibold mb-1">TIPO DE CONSULTA</p>
                      <p className="text-xl font-bold text-white">{selectedType.name}</p>
                    </div>
                    <div className="bg-linear-to-r from-emerald-500 to-green-500 px-4 py-2 rounded-full">
                      <span className="text-white font-bold text-xl">S/ {selectedType.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 rounded-lg">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">{selectedType.durationMinutes} minutos</span>
                    </div>
                  </div>
                  
                  {selectedType.description && (
                    <p className="text-emerald-200/70 mt-3 text-sm leading-relaxed">{selectedType.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Motivo mejorado */}
          <div className="bg-linear-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-yellow-400 text-sm font-semibold mb-2">MOTIVO DE CONSULTA</p>
                <p className="text-white text-lg leading-relaxed">{motive}</p>
              </div>
            </div>
          </div>

          {/* Total destacado */}
          <div className="bg-linear-to-r from-green-500/20 via-emerald-500/15 to-green-600/20 border-2 border-green-500/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-semibold mb-1">TOTAL A PAGAR</p>
                <span className="text-2xl font-bold text-white">Consulta médica</span>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-green-400">
                  S/ {selectedType?.price || 0}
                </span>
                <p className="text-green-300 text-sm mt-1">Pago en consulta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones mejorados */}
        <div className="p-8 bg-slate-800/60 border-t border-slate-700/50">
          <div className="flex gap-4">
            <button
              onClick={onBack}
              disabled={isCreating}
              className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-gray-300 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Atrás</span>
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isCreating}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="font-bold text-lg">Confirmando cita...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">Confirmar Cita Médica</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};