'use client';

import React from 'react';
import { Fuel, Truck, Users, History, BarChart3, Wifi, WifiOff, RefreshCw, Smartphone } from 'lucide-react';
import { useIsWebNfcSupported } from '@/lib/nfc-helper';

export type ActiveTab = 'frentista' | 'veiculos' | 'motoristas' | 'historico' | 'analise';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetData: () => void;
  vehicleCount: number;
  transactionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetData,
  vehicleCount,
  transactionCount
}) => {
  const hasNfcSupport = useIsWebNfcSupported();

  return (
    <header className="bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('frentista')}>
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-black font-bold text-lg italic shadow-sm">
              F
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg text-white tracking-tight">FUELCORE <span className="text-amber-500 font-extrabold">PRO</span></span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded uppercase">
                  NFC Ativo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Controle de Abastecimento de Frota</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('frentista')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'frentista'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Totem Frentista</span>
            </button>

            <button
              onClick={() => setActiveTab('veiculos')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'veiculos'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Veículos ({vehicleCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('motoristas')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'motoristas'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Motoristas</span>
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'historico'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico ({transactionCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('analise')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analise'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & IA</span>
            </button>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center space-x-3">
            {/* NFC Hardware Status Indicator */}
            <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full border ${
              hasNfcSupport
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              {hasNfcSupport ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden lg:inline font-medium">NFC Hardware On</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                  <span className="hidden lg:inline font-medium text-slate-300">Simulador NFC</span>
                </>
              )}
            </div>

            {/* Reset data button */}
            <button
              onClick={onResetData}
              title="Restaurar dados de demonstração"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center space-x-1 border border-white/5"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-white/10 overflow-x-auto space-x-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('frentista')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'frentista' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Frentista</span>
          </button>
          <button
            onClick={() => setActiveTab('veiculos')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'veiculos' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Veículos</span>
          </button>
          <button
            onClick={() => setActiveTab('motoristas')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'motoristas' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Motoristas</span>
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'historico' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Histórico</span>
          </button>
          <button
            onClick={() => setActiveTab('analise')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'analise' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

      </div>
    </header>
  );
};
