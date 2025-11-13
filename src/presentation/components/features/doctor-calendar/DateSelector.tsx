'use client';

import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  availableDates: Array<{
    date: string;
    displayDate: string;
    dayName: string;
    sedeId: string;
    sedeName: string;
    sedeDistrito?: string;
    sedeDepartamento?: string;
    sedeDireccion?: string;
  }>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const DateSelector = ({ availableDates, selectedDate, onDateSelect }: DateSelectorProps) => {
  if (availableDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-gray-500" />
        </div>
        <p className="text-gray-400 text-lg">No hay fechas disponibles</p>
        <p className="text-gray-500 text-sm mt-2">Por favor intenta con otro doctor</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <label className="text-xl font-semibold text-white">
          Seleccionar fecha disponible
        </label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableDates.map((dateInfo) => (
          <button
            key={dateInfo.date}
            onClick={() => onDateSelect(dateInfo.date)}
            className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
              selectedDate === dateInfo.date
                ? 'bg-linear-to-br from-green-500/20 to-emerald-600/20 border-green-500 text-green-400 shadow-xl shadow-green-500/25'
                : 'bg-linear-to-br from-slate-800/80 to-slate-900/80 border-slate-600 text-gray-300 hover:bg-linear-to-br hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-500'
            }`}
          >
            <div className="relative z-10">
              <div className="font-bold text-xl mb-2">{dateInfo.displayDate}</div>
              <div className={`text-sm capitalize mb-2 ${
                selectedDate === dateInfo.date ? 'text-green-300' : 'text-gray-400'
              }`}>
                {dateInfo.dayName}
              </div>
              
              {/* Información de la sede */}
              <div className={`space-y-1 ${
                selectedDate === dateInfo.date ? 'text-green-200' : 'text-gray-500'
              }`}>
                <div className="text-xs font-medium">
                  📍 {dateInfo.sedeName}
                </div>
                {(dateInfo.sedeDistrito || dateInfo.sedeDepartamento) && (
                  <div className="text-xs">
                    🏢 {dateInfo.sedeDistrito && `${dateInfo.sedeDistrito}, `}{dateInfo.sedeDepartamento || 'Lima'}
                  </div>
                )}
                {dateInfo.sedeDireccion && (
                  <div className="text-xs">
                    📍 {dateInfo.sedeDireccion}
                  </div>
                )}
              </div>
            </div>
            
            {/* Decoración de fondo */}
            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full transition-all duration-300 ${
              selectedDate === dateInfo.date
                ? 'bg-green-500'
                : 'bg-gray-600 group-hover:bg-gray-500'
            }`}>
              {selectedDate === dateInfo.date && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};