'use client';

import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useBusyRanges } from '../../../hooks/useBusyRanges';
import { API_CONFIG } from '../../../../config/constants';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBusy: boolean; // Nuevo campo para indicar si está ocupado
}

interface TimeSelectorProps {
  availableSlots: Array<{
    startTime: string;
    endTime: string;
    sedeId?: string;
    sedeName?: string;
  }>;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate: string;
}

export const TimeSelector = ({ availableSlots, selectedTime, onTimeSelect, selectedDate }: TimeSelectorProps) => {
  const { getBusyRanges, isTimeSlotBusy } = useBusyRanges({
    orgID: API_CONFIG.DEFAULT_ORG_ID
  });

  // Cargar los slots ocupados cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      // Convertir fecha de YYYY-MM-DD a DD-MM-YYYY para el API
      const [year, month, day] = selectedDate.split('-');
      const dayKey = `${day}-${month}-${year}`;
      getBusyRanges(dayKey);
    }
  }, [selectedDate, getBusyRanges]);

  // Generar slots de tiempo cada 30 minutos dentro de los rangos disponibles
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    availableSlots.forEach(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      let currentTime = startHour * 60 + startMin; // En minutos
      const endTime = endHour * 60 + endMin;
      
      while (currentTime < endTime) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // Verificar si hay al menos 30 minutos disponibles desde este punto
        const hasEnoughTime = (currentTime + 30) <= endTime;
        
        // Verificar si el slot está ocupado
        const isBusy = selectedDate ? isTimeSlotBusy(selectedDate, timeString) : false;
        
        slots.push({
          time: timeString,
          isAvailable: hasEnoughTime && !isBusy,
          isBusy: isBusy
        });
        
        currentTime += 30; // Incrementar 30 minutos
      }
    });
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!selectedDate) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-purple-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-purple-400" />
        </div>
        <p className="text-gray-400 text-lg">Selecciona una fecha primero</p>
        <p className="text-gray-500 text-sm mt-2">Luego podrás elegir el horario disponible</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-orange-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-orange-400" />
        </div>
        <p className="text-gray-400 text-lg">No hay horarios disponibles</p>
        <p className="text-gray-500 text-sm mt-2">para la fecha seleccionada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <label className="text-xl font-semibold text-white">
            Seleccionar horario
          </label>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">
            {timeSlots.filter(s => s.isAvailable).length} horarios disponibles
          </span>
        </div>
      </div>
      
      <div className="bg-linear-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-72 overflow-y-auto custom-scrollbar">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.isAvailable && onTimeSelect(slot.time)}
              disabled={!slot.isAvailable}
              className={`group relative p-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                selectedTime === slot.time
                  ? 'bg-linear-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/50 transform scale-105'
                  : slot.isAvailable
                  ? 'bg-linear-to-br from-slate-700/80 to-slate-800/80 text-gray-300 hover:bg-linear-to-br hover:from-purple-600/30 hover:to-purple-700/30 border border-slate-600 hover:border-purple-500/50 hover:text-purple-300'
                  : slot.isBusy
                  ? 'bg-linear-to-br from-red-800/50 to-red-900/50 text-red-400 cursor-not-allowed opacity-60 border border-red-700/50'
                  : 'bg-linear-to-br from-gray-800/50 to-gray-900/50 text-gray-500 cursor-not-allowed opacity-40 border border-gray-700/50'
              }`}
            >
              <div className="relative z-10">
                <Clock className={`w-3 h-3 mx-auto mb-2 ${
                  selectedTime === slot.time 
                    ? 'text-white' 
                    : slot.isAvailable 
                      ? 'text-gray-400 group-hover:text-purple-400'
                    : slot.isBusy
                      ? 'text-red-400'
                      : 'text-gray-600'
                }`} />
                <div>{slot.time}</div>
                {slot.isBusy && (
                  <div className="text-xs text-red-300 mt-1">Ocupado</div>
                )}
              </div>
              
              {/* Efecto de brillo para el botón seleccionado */}
              {selectedTime === slot.time && (
                <div className="absolute inset-0 bg-linear-to-br from-green-400/30 to-emerald-500/30 rounded-xl animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {selectedTime && (
        <div className="bg-linear-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-500/40 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-green-400 font-semibold text-lg">Horario confirmado</div>
              <div className="text-green-300 text-sm">{selectedTime} hrs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};