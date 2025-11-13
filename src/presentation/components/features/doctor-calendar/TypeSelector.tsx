'use client';

import { Clock, DollarSign, Calendar } from 'lucide-react';

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  color: string;
}

interface TypeSelectorProps {
  types: AppointmentType[];
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
  isLoading?: boolean;
}

export const TypeSelector = ({ types, selectedType, onTypeSelect, isLoading }: TypeSelectorProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-linear-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 animate-pulse">
            <div className="h-6 bg-linear-to-r from-gray-600/50 to-gray-700/50 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-linear-to-r from-gray-700/50 to-gray-800/50 rounded w-2/3 mb-3"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-gray-600/50 rounded w-20"></div>
              <div className="h-3 bg-gray-600/50 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (types.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-indigo-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-gray-400 text-lg">No hay tipos de consulta disponibles</p>
        <p className="text-gray-500 text-sm mt-2">Contacta con el doctor para más información</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <label className="text-xl font-semibold text-white">
          Seleccionar tipo de consulta
        </label>
      </div>
      
      <div className="space-y-4">
        {types.map((type) => (
          <label 
            key={type.id} 
            className={`group relative block overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
              selectedType === type.id
                ? 'bg-linear-to-br from-green-500/20 via-emerald-500/15 to-green-600/20 border-green-500 shadow-xl shadow-green-500/25'
                : 'bg-linear-to-br from-slate-800/80 to-slate-900/80 border-slate-600 hover:bg-linear-to-br hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-500'
            }`}
          >
            <div className="relative p-6">
              <input
                type="radio"
                name="appointmentType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={(e) => onTypeSelect(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    selectedType === type.id ? 'text-green-400' : 'text-white'
                  }`}>
                    {type.name}
                  </h3>
                  
                  {type.description && (
                    <p className={`text-sm leading-relaxed ${
                      selectedType === type.id ? 'text-green-200/80' : 'text-gray-400'
                    }`}>
                      {type.description}
                    </p>
                  )}
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  selectedType === type.id 
                    ? 'bg-green-500/20 border-green-400 text-green-400' 
                    : 'bg-slate-700/60 border-slate-600 text-gray-300'
                }`}>
                  <DollarSign className="w-4 h-4" />
                  <span className="text-lg font-bold">{type.price}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    selectedType === type.id 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-700/60 text-gray-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.durationMinutes} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-white/30 shadow-lg"
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className={`text-sm ${
                      selectedType === type.id ? 'text-green-300' : 'text-gray-500'
                    }`}>
                      Color de categoría
                    </span>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedType === type.id
                    ? 'border-green-500 bg-green-500 scale-110'
                    : 'border-gray-500 group-hover:border-gray-400 group-hover:scale-105'
                }`}>
                  {selectedType === type.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Efecto de brillo para el tipo seleccionado */}
            {selectedType === type.id && (
              <div className="absolute inset-0 bg-linear-to-br from-green-400/10 via-emerald-400/5 to-green-500/10 pointer-events-none animate-pulse"></div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};