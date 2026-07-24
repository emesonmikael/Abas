'use client';

import React, { useState } from 'react';
import { Driver, Vehicle } from '@/types/fuel';
import { Users, Plus, Search, KeyRound, ShieldCheck, UserX, Phone, Truck, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DriversTabProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onAddDriver: (newDriver: Driver) => void;
  onUpdateDriver: (updatedDriver: Driver) => void;
}

export const DriversTab: React.FC<DriversTabProps> = ({
  drivers,
  vehicles,
  onAddDriver,
  onUpdateDriver
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [cnh, setCnh] = useState('');
  const [cnhCategory, setCnhCategory] = useState('B');
  const [pin, setPin] = useState('1234');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [assignedVehiclePlate, setAssignedVehiclePlate] = useState('');

  const openAddModal = () => {
    setEditingDriver(null);
    setName('');
    setCnh('');
    setCnhCategory('B');
    setPin(Math.floor(1000 + Math.random() * 9000).toString());
    setPhone('(11) 98000-0000');
    setStatus('active');
    setAssignedVehiclePlate('');
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setCnh(driver.cnh);
    setCnhCategory(driver.cnhCategory);
    setPin(driver.pin);
    setPhone(driver.phone);
    setStatus(driver.status);
    setAssignedVehiclePlate(driver.assignedVehiclePlate || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnh) return;

    if (editingDriver) {
      onUpdateDriver({
        ...editingDriver,
        name,
        cnh,
        cnhCategory,
        pin,
        phone,
        status,
        assignedVehiclePlate: assignedVehiclePlate || undefined
      });
    } else {
      const newDriver: Driver = {
        id: `drv-${Date.now()}`,
        name,
        cnh,
        cnhCategory,
        pin,
        phone,
        status,
        assignedVehiclePlate: assignedVehiclePlate || undefined
      };
      onAddDriver(newDriver);
    }

    setIsModalOpen(false);
  };

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.cnh.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="text-xl font-light text-white italic flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Gestão de Motoristas & Autenticação PIN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre os condutores autorizados a abastecer a frota e gerencie suas senhas de autorização
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-white hover:bg-slate-200 text-black font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Motorista</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#141414] p-4 rounded-xl border border-white/10 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome do motorista ou CNH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-[#141414] border border-white/10 rounded-xl p-5 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">{driver.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">CNH: {driver.cnh} ({driver.cnhCategory})</p>
                  </div>
                </div>

                {driver.status === 'active' ? (
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Ativo
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded">
                    Suspenso
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs font-mono mb-4">
                <div className="bg-black p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Senha (PIN):
                  </span>
                  <span className="font-bold text-amber-500 text-sm tracking-widest">{driver.pin}</span>
                </div>

                <div className="bg-black p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Veículo Habitual:
                  </span>
                  <span className="font-bold text-white">{driver.assignedVehiclePlate || 'Livre / Qualquer'}</span>
                </div>

                <div className="bg-black p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telefone:
                  </span>
                  <span className="text-slate-300">{driver.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => openEditModal(driver)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg text-xs font-medium border border-white/10 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Editar Dados & PIN</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-lg font-light text-white italic">
                  {editingDriver ? 'Editar Motorista' : 'Cadastrar Novo Motorista'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">CNH (Número) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 04829301928"
                      value={cnh}
                      onChange={(e) => setCnh(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Categoria CNH</label>
                    <select
                      value={cnhCategory}
                      onChange={(e) => setCnhCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                    >
                      <option value="B">B (Carros Leves)</option>
                      <option value="C">C (Caminhões Peq)</option>
                      <option value="D">D (Ônibus/Vans)</option>
                      <option value="E">E (Articulados/Pesados)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-500 font-medium mb-1">Senha (PIN 4 Dígitos) *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Ex: 1234"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-black border border-amber-500/40 rounded-lg px-3 py-2 text-amber-500 font-mono font-bold text-center tracking-widest text-sm focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Telefone / Celular</label>
                    <input
                      type="text"
                      placeholder="(11) 98765-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Veículo Habitual (Opcional)</label>
                  <select
                    value={assignedVehiclePlate}
                    onChange={(e) => setAssignedVehiclePlate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-500/50"
                  >
                    <option value="">Nenhum (Pode dirigir qualquer veículo)</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.plate}>
                        {v.plate} - {v.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-amber-500/50"
                  >
                    <option value="active">Ativo (Autorizado a Abastecer)</option>
                    <option value="suspended">Suspenso / Inativo</option>
                  </select>
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
                    Salvar Motorista
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
