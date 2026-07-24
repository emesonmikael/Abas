'use client';

import React, { useState } from 'react';
import { Vehicle, FuelType, VehicleStatus } from '@/types/fuel';
import { Truck, Plus, Search, Filter, Edit, Wifi, ShieldAlert, AlertTriangle, CheckCircle2, Fuel, Gauge, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VehiclesTabProps {
  vehicles: Vehicle[];
  onAddVehicle: (newVehicle: Vehicle) => void;
  onUpdateVehicle: (updatedVehicle: Vehicle) => void;
  onOpenNfcWriter: (vehicle: Vehicle) => void;
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onOpenNfcWriter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [fuelType, setFuelType] = useState<FuelType>('flex');
  const [tankCapacity, setTankCapacity] = useState<number>(55);
  const [currentOdometer, setCurrentOdometer] = useState<number>(10000);
  const [avgKmPerLiter, setAvgKmPerLiter] = useState<number>(12);
  const [nfcTagId, setNfcTagId] = useState('');
  const [department, setDepartment] = useState('Operacional');
  const [status, setStatus] = useState<VehicleStatus>('active');

  const openAddModal = () => {
    setEditingVehicle(null);
    setPlate('');
    setModel('');
    setBrand('');
    setYear(2025);
    setFuelType('flex');
    setTankCapacity(55);
    setCurrentOdometer(10000);
    setAvgKmPerLiter(12);
    setNfcTagId(`NFC-TAG-${Math.floor(1000 + Math.random() * 9000)}`);
    setDepartment('Operacional');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setPlate(vehicle.plate);
    setModel(vehicle.model);
    setBrand(vehicle.brand);
    setYear(vehicle.year);
    setFuelType(vehicle.fuelType);
    setTankCapacity(vehicle.tankCapacityLiters);
    setCurrentOdometer(vehicle.currentOdometerKm);
    setAvgKmPerLiter(vehicle.avgKmPerLiterEstimate);
    setNfcTagId(vehicle.nfcTagId);
    setDepartment(vehicle.department);
    setStatus(vehicle.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !model) return;

    const formattedPlate = plate.toUpperCase().trim();

    if (editingVehicle) {
      onUpdateVehicle({
        ...editingVehicle,
        plate: formattedPlate,
        model,
        brand,
        year,
        fuelType,
        tankCapacityLiters: tankCapacity,
        currentOdometerKm: currentOdometer,
        avgKmPerLiterEstimate: avgKmPerLiter,
        nfcTagId: nfcTagId || `NFC-TAG-${formattedPlate.replace(/[^A-Z0-9]/g, '')}`,
        department,
        status
      });
    } else {
      const newVehicle: Vehicle = {
        id: `veh-${Date.now()}`,
        plate: formattedPlate,
        model,
        brand,
        year,
        fuelType,
        tankCapacityLiters: tankCapacity,
        currentOdometerKm: currentOdometer,
        avgKmPerLiterEstimate: avgKmPerLiter,
        nfcTagId: nfcTagId || `NFC-TAG-${formattedPlate.replace(/[^A-Z0-9]/g, '')}`,
        department,
        status
      };
      onAddVehicle(newVehicle);
    }

    setIsModalOpen(false);
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && v.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="text-xl font-light text-white italic flex items-center space-x-2">
            <Truck className="w-6 h-6 text-amber-500" />
            <span>Gestão de Veículos da Frota</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre novos veículos, gerencie cartões NFC associados e acompanhe a frota
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-white hover:bg-slate-200 text-black font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Veículo</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] p-4 rounded-xl border border-white/10">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo ou depto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="maintenance">Em Manutenção</option>
            <option value="blocked">Bloqueados</option>
          </select>
        </div>

      </div>

      {/* Vehicle Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
                
                {/* Plate */}
                <div className="bg-black border border-white/20 rounded px-3 py-1 font-mono font-bold text-amber-500 text-sm tracking-wider">
                  {vehicle.plate}
                </div>

                {/* Status Badge */}
                {vehicle.status === 'active' && (
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ativo
                  </span>
                )}
                {vehicle.status === 'maintenance' && (
                  <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Revisão
                  </span>
                )}
                {vehicle.status === 'blocked' && (
                  <span className="text-[10px] uppercase font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Bloqueado
                  </span>
                )}
              </div>

              {/* Vehicle Title */}
              <h3 className="text-base font-semibold text-white tracking-tight mb-1">{vehicle.model}</h3>
              <p className="text-xs text-slate-400 mb-4">{vehicle.brand} ({vehicle.year}) • {vehicle.department}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="bg-black p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase">Hodômetro</span>
                  <span className="font-bold text-white">{vehicle.currentOdometerKm.toLocaleString('pt-BR')} KM</span>
                </div>
                <div className="bg-black p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase">Tanque</span>
                  <span className="font-bold text-white">{vehicle.tankCapacityLiters} Litros</span>
                </div>
                <div className="bg-black p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase">Combustível</span>
                  <span className="font-bold text-amber-500 uppercase">{vehicle.fuelType}</span>
                </div>
                <div className="bg-black p-2.5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-500 block uppercase">Média Est.</span>
                  <span className="font-bold text-emerald-400">{vehicle.avgKmPerLiterEstimate} KM/L</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenNfcWriter(vehicle)}
                className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>Gravar Cartão NFC</span>
              </button>

              <button
                onClick={() => openEditModal(vehicle)}
                className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs border border-white/10 transition-colors cursor-pointer"
                title="Editar Veículo"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-white/10 rounded-xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-lg font-light text-white italic">
                  {editingVehicle ? 'Editar Veículo' : 'Cadastrar Novo Veículo na Frota'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Placa do Veículo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: BRA-2E19"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono uppercase focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Modelo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gol 1.0 Flex"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Marca</label>
                    <input
                      type="text"
                      placeholder="Ex: Volkswagen"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Ano</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Combustível</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as FuelType)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50 capitalize"
                    >
                      <option value="flex">Flex</option>
                      <option value="gasolina">Gasolina</option>
                      <option value="etanol">Etanol</option>
                      <option value="diesel">Diesel</option>
                      <option value="gnv">GNV</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Tanque (Litros)</label>
                    <input
                      type="number"
                      value={tankCapacity}
                      onChange={(e) => setTankCapacity(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Hodômetro Atual</label>
                    <input
                      type="number"
                      value={currentOdometer}
                      onChange={(e) => setCurrentOdometer(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Média (KM/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={avgKmPerLiter}
                      onChange={(e) => setAvgKmPerLiter(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Departamento / Setor</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Status do Veículo</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                    >
                      <option value="active">Ativo (Permite Abastecimento)</option>
                      <option value="maintenance">Em Manutenção</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código / Tag do Cartão NFC</label>
                  <input
                    type="text"
                    value={nfcTagId}
                    onChange={(e) => setNfcTagId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-amber-500 font-mono focus:border-amber-500/50"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Salvar Veículo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
