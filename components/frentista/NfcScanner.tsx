'use client';

import React, { useState, useEffect } from 'react';
import { Radio, CreditCard, Search, Wifi, AlertCircle, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { Vehicle } from '@/types/fuel';
import { useIsWebNfcSupported, startWebNfcScan, NfcScanResult } from '@/lib/nfc-helper';
import { motion, AnimatePresence } from 'motion/react';

interface NfcScannerProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  selectedVehicle: Vehicle | null;
}

export const NfcScanner: React.FC<NfcScannerProps> = ({
  vehicles,
  onSelectVehicle,
  selectedVehicle
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string>('Aguardando leitura do cartão NFC...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);

  const hasNativeNfc = useIsWebNfcSupported();

  // Handle native Web NFC scanning
  useEffect(() => {
    let controller: AbortController | null = null;

    if (hasNativeNfc && isScanning) {
      controller = new AbortController();
      startWebNfcScan(
        (result: NfcScanResult) => {
          setScanMessage('Cartão lido com sucesso!');
          // Match vehicle by nfcTagId, plate, or payload
          const tagId = result.payload?.nfcTagId || result.serialNumber || result.rawText;
          const plate = result.payload?.plate;

          const matched = vehicles.find(v => 
            (tagId && v.nfcTagId.toLowerCase() === tagId.toLowerCase()) ||
            (plate && v.plate.toLowerCase() === plate.toLowerCase()) ||
            (result.rawText && v.nfcTagId.toLowerCase() === result.rawText.toLowerCase())
          );

          if (matched) {
            onSelectVehicle(matched);
            setIsScanning(false);
          } else {
            setErrorMessage(`Cartão NFC lido (${tagId || plate}), porém não cadastrado na frota.`);
          }
        },
        (err) => {
          setErrorMessage(err);
          setIsScanning(false);
        },
        controller.signal
      );
    }

    return () => {
      controller?.abort();
    };
  }, [isScanning, hasNativeNfc, vehicles, onSelectVehicle]);

  // Handle virtual card tap
  const handleVirtualTap = (vehicle: Vehicle) => {
    setErrorMessage(null);
    setScanMessage(`Cartão NFC lido: ${vehicle.plate}`);
    onSelectVehicle(vehicle);
  };

  // Handle manual plate search selection
  const handleManualSelect = (vehicle: Vehicle) => {
    setErrorMessage(null);
    onSelectVehicle(vehicle);
    setIsManualOpen(false);
    setSearchQuery('');
  };

  const filteredVehicles = vehicles.filter(v =>
    v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.nfcTagId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-base font-semibold text-white tracking-tight">Leitor de Cartão NFC do Veículo</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Encoste o cartão/tag NFC do veículo ou selecione um cartão virtual abaixo para simular
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasNativeNfc && (
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsScanning(!isScanning);
              }}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all ${
                isScanning
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500 text-black hover:bg-amber-400'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>{isScanning ? 'Parar Leitor NFC' : 'Ativar Leitor NFC Físico'}</span>
            </button>
          )}

          <button
            onClick={() => setIsManualOpen(!isManualOpen)}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>Busca por Placa</span>
          </button>
        </div>
      </div>

      {/* Active NFC Radar Scanner Area */}
      <div className="py-8 flex flex-col items-center justify-center text-center">
        
        {/* Radar Animation */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-black border border-white/10 flex items-center justify-center relative z-10">
            <CreditCard className={`w-12 h-12 ${selectedVehicle ? 'text-amber-500' : 'text-slate-500'}`} />
          </div>

          {/* Pulse Waves */}
          <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
          <div className="absolute -inset-4 rounded-full border border-amber-500/20 animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-white/5" />
        </div>

        {/* Status text */}
        <h3 className="text-base font-semibold text-white mb-1">
          {selectedVehicle ? (
            <span className="text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 inline" /> Veículo Identificado: {selectedVehicle.plate}
            </span>
          ) : (
            'Aproxime o Cartão NFC do Veículo'
          )}
        </h3>

        <p className="text-xs text-slate-400 max-w-md">
          {selectedVehicle
            ? `${selectedVehicle.model} (${selectedVehicle.fuelType.toUpperCase()}) • Tanque: ${selectedVehicle.tankCapacityLiters}L`
            : scanMessage}
        </p>

        {/* Error message if any */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-center space-x-2 max-w-md"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </div>

      {/* Virtual NFC Cards Bar (Instant simulator for testability on any desktop/mobile) */}
      <div className="mt-2 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Simulador de Cartões NFC da Frota (Toque para testar)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">{vehicles.length} Veículos Disponíveis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vehicles.slice(0, 6).map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id;
            const isBlocked = vehicle.status === 'blocked';
            const isMaintenance = vehicle.status === 'maintenance';

            return (
              <motion.button
                key={vehicle.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleVirtualTap(vehicle)}
                className={`p-3.5 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-black hover:bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                {/* Status indicator badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected ? 'bg-amber-500 text-black' : 'bg-white/10 text-amber-500'
                    }`}>
                      NFC
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wider text-white font-mono">{vehicle.plate}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px]">{vehicle.model}</div>
                    </div>
                  </div>

                  {isBlocked && (
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
                      Bloqueado
                    </span>
                  )}
                  {isMaintenance && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                      Revisão
                    </span>
                  )}
                  {!isBlocked && !isMaintenance && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                      Pronto
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 mt-1">
                  <span className="capitalize">{vehicle.fuelType} ({vehicle.tankCapacityLiters}L)</span>
                  <span className="font-mono text-slate-200">{vehicle.currentOdometerKm.toLocaleString('pt-BR')} KM</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Manual Search Modal */}
      <AnimatePresence>
        {isManualOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#141414] border border-white/10 rounded-xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                  <Search className="w-5 h-5 text-amber-500" />
                  <span>Localizar Veículo por Placa ou Tag</span>
                </h3>
                <button
                  onClick={() => setIsManualOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded bg-white/5"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                autoFocus
                placeholder="Digite a placa (ex: BRA-2E19), modelo ou código NFC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 mb-4"
              />

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleManualSelect(vehicle)}
                    className="p-3 bg-black hover:bg-white/5 rounded-lg border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-amber-500 text-sm">{vehicle.plate}</div>
                      <div className="text-xs text-slate-300">{vehicle.model} • {vehicle.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-mono">{vehicle.currentOdometerKm.toLocaleString('pt-BR')} KM</div>
                      <span className="text-[10px] text-amber-500 font-semibold uppercase">{vehicle.fuelType}</span>
                    </div>
                  </div>
                ))}

                {filteredVehicles.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">Nenhum veículo encontrado para a busca.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
