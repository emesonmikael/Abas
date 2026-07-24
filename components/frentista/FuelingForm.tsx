'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, FuelType } from '@/types/fuel';
import { Fuel, Gauge, DollarSign, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FuelingFormProps {
  vehicle: Vehicle;
  onSubmitForm: (formData: {
    odometerKm: number;
    fuelType: FuelType;
    liters: number;
    pricePerLiter: number;
    totalValue: number;
    stationName: string;
    pumpNumber: string;
    attendantName: string;
    flags: string[];
    calculatedKmPerLiter: number;
    kmDriven: number;
  }) => void;
}

const DEFAULT_PRICES: Record<FuelType, number> = {
  gasolina: 5.89,
  etanol: 3.99,
  diesel: 6.15,
  gnv: 4.50,
  flex: 5.89
};

export const FuelingForm: React.FC<FuelingFormProps> = ({ vehicle, onSubmitForm }) => {
  const previousKm = vehicle.currentOdometerKm;

  const [odometerKm, setOdometerKm] = useState<number | ''>(previousKm + 450); // Default reasonable jump for demo
  const [fuelType, setFuelType] = useState<FuelType>(vehicle.fuelType === 'flex' ? 'gasolina' : vehicle.fuelType);
  const [pricePerLiter, setPricePerLiter] = useState<number>(DEFAULT_PRICES[fuelType] || 5.89);
  const [liters, setLiters] = useState<number | ''>(38); // Default demo volume
  const [stationName, setStationName] = useState<string>('Posto Petrobras - Garagem Central');
  const [pumpNumber, setPumpNumber] = useState<string>('Bomba 01');
  const [attendantName, setAttendantName] = useState<string>('Marcos - Frentista');

  // Derived calculated total value
  const totalValue = (typeof liters === 'number' && liters > 0 && pricePerLiter > 0)
    ? Number((liters * pricePerLiter).toFixed(2))
    : 0;

  // Live calculations & validations
  const currentKmNum = typeof odometerKm === 'number' ? odometerKm : 0;
  const kmDriven = Math.max(0, currentKmNum - previousKm);
  const litersNum = typeof liters === 'number' ? liters : 0;
  const calculatedKmPerLiter = litersNum > 0 ? Number((kmDriven / litersNum).toFixed(2)) : 0;

  // Validation flags
  const flags: string[] = [];
  let isOdometerInvalid = false;
  let isVolumeExceeded = false;

  if (currentKmNum <= previousKm) {
    isOdometerInvalid = true;
    flags.push(`Hodômetro digitado (${currentKmNum} KM) é menor ou igual ao registrado anteriormente (${previousKm} KM)`);
  }

  if (litersNum > vehicle.tankCapacityLiters * 1.05) { // 5% margin for neck
    isVolumeExceeded = true;
    flags.push(`Volume abastecido (${litersNum}L) excede a capacidade do tanque do veículo (${vehicle.tankCapacityLiters}L)`);
  }

  if (calculatedKmPerLiter > 0 && Math.abs(calculatedKmPerLiter - vehicle.avgKmPerLiterEstimate) > vehicle.avgKmPerLiterEstimate * 0.5) {
    flags.push(`Consumo calculado (${calculatedKmPerLiter} KM/L) destoa significativamente da média estimada (${vehicle.avgKmPerLiterEstimate} KM/L)`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOdometerInvalid) return;
    if (litersNum <= 0) return;

    onSubmitForm({
      odometerKm: currentKmNum,
      fuelType,
      liters: litersNum,
      pricePerLiter,
      totalValue,
      stationName,
      pumpNumber,
      attendantName,
      flags,
      calculatedKmPerLiter,
      kmDriven
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
      <div className="flex items-center space-x-2 pb-4 border-b border-white/10 mb-6">
        <Fuel className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-light text-white italic">Informações de Abastecimento</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Hodômetro Input */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-500" /> Odômetro Atual (KM)
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">Anterior: {previousKm.toLocaleString('pt-BR')} KM</span>
          </label>
          <input
            type="number"
            required
            min={previousKm + 1}
            value={odometerKm}
            onChange={(e) => setOdometerKm(e.target.value ? Number(e.target.value) : '')}
            className={`w-full bg-black border rounded-lg px-4 py-3.5 text-2xl font-light text-amber-500 focus:outline-none transition-colors ${
              isOdometerInvalid ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-amber-500/50'
            }`}
            placeholder="Ex: 142750"
          />
          {isOdometerInvalid ? (
            <p className="text-xs text-rose-400 font-medium flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>O hodômetro deve ser maior que {previousKm.toLocaleString('pt-BR')} KM</span>
            </p>
          ) : (
            <p className="text-[10px] text-amber-500/60 font-mono">+{kmDriven}km desde o último registro</p>
          )}
        </div>

        {/* Tipo de Combustível */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold">
            Combustível Utilizado
          </label>
          <select
            value={fuelType}
            onChange={(e) => {
              const newType = e.target.value as FuelType;
              setFuelType(newType);
              setPricePerLiter(DEFAULT_PRICES[newType] || 5.89);
            }}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3.5 text-base font-medium text-white focus:outline-none focus:border-white/20 capitalize"
          >
            <option value="gasolina">Gasolina Comum / Aditivada</option>
            <option value="etanol">Etanol Hidratado</option>
            <option value="diesel">Diesel S10 / S500</option>
            <option value="gnv">GNV (M3)</option>
          </select>
        </div>

        {/* Litros Abastecidos */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center justify-between">
            <span>Volume (Litros)</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">Máx: {vehicle.tankCapacityLiters}L</span>
          </label>
          <input
            type="number"
            step="0.01"
            required
            min="0.1"
            value={liters}
            onChange={(e) => setLiters(e.target.value ? Number(e.target.value) : '')}
            className={`w-full bg-black border rounded-lg px-4 py-3.5 text-2xl font-light text-white focus:outline-none transition-colors ${
              isVolumeExceeded ? 'border-amber-500/80 text-amber-300' : 'border-white/10 focus:border-white/20'
            }`}
            placeholder="Ex: 45.0"
          />
          {isVolumeExceeded && (
            <p className="text-xs text-amber-400 font-medium flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Alerta: Volume maior que a capacidade nominal ({vehicle.tankCapacityLiters}L)</span>
            </p>
          )}
        </div>

        {/* Preço por Litro */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold">
            Preço por Litro (R$)
          </label>
          <input
            type="number"
            step="0.01"
            required
            min="0.01"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(Number(e.target.value))}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-base font-mono font-medium text-white focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Valor Total R$ (Calculado) */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Valor Total Estimado
          </label>
          <div className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-2xl font-mono font-light text-amber-500">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Posto e Bomba */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold">
            Posto / Bomba
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="bg-black border border-white/10 rounded-lg px-3 py-3 text-xs text-white focus:outline-none focus:border-white/20"
              placeholder="Nome do Posto"
            />
            <input
              type="text"
              value={pumpNumber}
              onChange={(e) => setPumpNumber(e.target.value)}
              className="bg-black border border-white/10 rounded-lg px-3 py-3 text-xs text-white focus:outline-none focus:border-white/20"
              placeholder="Bomba Ex: 01"
            />
          </div>
        </div>

      </div>

      {/* Real-time Calculation Summary Box */}
      <div className="mt-6 p-4 bg-black rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6 text-xs text-slate-300 w-full sm:w-auto">
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">Distância Percorrida:</span>
            <span className="font-mono font-bold text-white text-sm">{kmDriven.toLocaleString('pt-BR')} KM</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">Consumo Estimado:</span>
            <span className="font-mono font-bold text-amber-500 text-sm">{calculatedKmPerLiter} KM/L</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:block">
            <span className="text-slate-500 block uppercase text-[10px]">Média Padrão Veículo:</span>
            <span className="font-mono font-bold text-slate-400 text-sm">{vehicle.avgKmPerLiterEstimate} KM/L</span>
          </div>
        </div>

        {flags.length > 0 && (
          <div className="text-xs text-amber-500 font-medium flex items-center space-x-1.5 bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{flags.length} aviso(s) detectado(s)</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isOdometerInvalid || litersNum <= 0}
          className="w-full bg-white text-black font-bold py-4 rounded-lg text-base tracking-tight hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>AUTENTICAR MOTORISTA E FINALIZAR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </form>
  );
};
