'use client';

import React from 'react';
import { Vehicle, Driver } from '@/types/fuel';
import { Truck, Fuel, Gauge, ShieldAlert, AlertTriangle, Building, User } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  assignedDriver?: Driver;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, assignedDriver }) => {
  const isBlocked = vehicle.status === 'blocked';
  const isMaintenance = vehicle.status === 'maintenance';

  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Top Banner Warning if vehicle issue */}
      {isBlocked && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-bold flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
          <span>VEÍCULO BLOQUEADO PARA ABASTECIMENTO: Verifique com o gestor de frota antes de prosseguir.</span>
        </div>
      )}

      {isMaintenance && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <span>VEÍCULO EM MANUTENÇÃO: Abastecimento sujeito à autorização especial de oficina.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center space-x-4">
          
          {/* Brazilian Style License Plate Badge */}
          <div className="bg-black border border-white/20 rounded-lg p-2 min-w-[130px] text-center">
            <div className="bg-blue-700 text-[9px] text-white font-bold tracking-widest uppercase py-0.5 px-1 rounded-t-xs flex items-center justify-between">
              <span>BRASIL</span>
              <span className="text-[7px]">BR</span>
            </div>
            <div className="text-xl font-black font-mono text-white tracking-wider py-1">
              {vehicle.plate}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">{vehicle.model}</h3>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <span>{vehicle.brand} ({vehicle.year})</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-300">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{vehicle.department}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Status Tag */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            {vehicle.fuelType.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
            TAG: {vehicle.nfcTagId}
          </span>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        
        <div className="bg-black p-3.5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>Último Hodômetro</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicle.currentOdometerKm.toLocaleString('pt-BR')} <span className="text-xs text-slate-400 font-normal">KM</span>
          </div>
        </div>

        <div className="bg-black p-3.5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Fuel className="w-4 h-4 text-emerald-400" />
            <span>Capacidade Tanque</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicle.tankCapacityLiters} <span className="text-xs text-slate-400 font-normal">Litros</span>
          </div>
        </div>

        <div className="bg-black p-3.5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Média Estimada</span>
          </div>
          <div className="text-base font-bold font-mono text-white">
            {vehicle.avgKmPerLiterEstimate} <span className="text-xs text-slate-400 font-normal">KM/L</span>
          </div>
        </div>

        <div className="bg-black p-3.5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <User className="w-4 h-4 text-slate-400" />
            <span>Motorista Habitual</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {assignedDriver ? assignedDriver.name : 'Qualquer cadastrado'}
          </div>
        </div>

      </div>

    </div>
  );
};
