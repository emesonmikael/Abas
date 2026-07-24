'use client';

import React, { useState } from 'react';
import { Driver } from '@/types/fuel';
import { KeyRound, ShieldCheck, Lock, UserCheck, AlertCircle, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DriverPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: Driver[];
  preselectedDriverId?: string;
  onSuccessAuth: (authenticatedDriver: Driver) => void;
}

export const DriverPinModal: React.FC<DriverPinModalProps> = ({
  isOpen,
  onClose,
  drivers,
  preselectedDriverId,
  onSuccessAuth
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    preselectedDriverId || (drivers.length > 0 ? drivers[0].id : '')
  );
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPinHint, setShowPinHint] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const handleDigitClick = (digit: string) => {
    if (pinInput.length < 6) {
      setErrorMessage(null);
      setPinInput(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMessage(null);
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleConfirmPin = () => {
    if (!activeDriver) return;

    if (pinInput === activeDriver.pin) {
      setErrorMessage(null);
      onSuccessAuth(activeDriver);
    } else {
      setErrorMessage('Senha / PIN incorreto para o motorista selecionado. Tente novamente.');
      setPinInput('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#141414] border border-white/10 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-light text-white italic">Assinatura Digital (PIN)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Digite a senha/PIN do motorista para validar e assinar o abastecimento
            </p>
          </div>

          {/* Driver Selection */}
          <div className="mb-6 space-y-2">
            <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-500" /> Selecionar Motorista
              </span>
              {activeDriver && (
                <button
                  onClick={() => setShowPinHint(!showPinHint)}
                  className="text-[10px] text-amber-500 hover:underline flex items-center gap-1 font-mono"
                >
                  <HelpCircle className="w-3 h-3" /> VER PIN DEMO
                </button>
              )}
            </label>

            <select
              value={selectedDriverId}
              onChange={(e) => {
                setSelectedDriverId(e.target.value);
                setPinInput('');
                setErrorMessage(null);
              }}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-amber-500/50"
            >
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} (CNH: {driver.cnh.slice(0, 5)}***)
                </option>
              ))}
            </select>

            {showPinHint && activeDriver && (
              <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20 font-mono text-center">
                Dica de demonstração: A senha de <b>{activeDriver.name}</b> é <span className="font-extrabold text-white text-xs">{activeDriver.pin}</span>
              </p>
            )}
          </div>

          {/* Masked PIN Display */}
          <div className="mb-6">
            <div className="bg-black border border-white/10 rounded-lg py-4 px-6 flex items-center justify-center space-x-3">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pinInput.length > index;
                return (
                  <div
                    key={index}
                    className={`w-10 h-12 rounded border flex items-center justify-center text-xl transition-all ${
                      isFilled
                        ? 'bg-white/10 border-amber-500 text-amber-500 font-extrabold'
                        : 'bg-white/5 border-white/10 text-slate-600'
                    }`}
                  >
                    {isFilled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-rose-400 font-medium text-center flex items-center justify-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </motion.p>
            )}
          </div>

          {/* Virtual Keypad (0-9) */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitClick(digit)}
                className="h-12 bg-white/5 hover:bg-white/10 active:bg-amber-500 active:text-black text-white font-mono font-medium text-lg rounded border border-white/5 transition-all flex items-center justify-center cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-12 bg-white/5 hover:bg-rose-500/20 text-rose-400 font-medium text-xs rounded border border-white/5 transition-all flex items-center justify-center"
            >
              LIMPAR
            </button>
            <button
              onClick={() => handleDigitClick('0')}
              className="h-12 bg-white/5 hover:bg-white/10 active:bg-amber-500 text-white font-mono font-medium text-lg rounded border border-white/5 transition-all flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs rounded border border-white/5 transition-all flex items-center justify-center"
            >
              ⌫ APAGAR
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPin}
            disabled={pinInput.length < 4}
            className="w-full py-4 bg-white hover:bg-slate-200 text-black font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>CONFIRMAR ABASTECIMENTO</span>
          </button>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
