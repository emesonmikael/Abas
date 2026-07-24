'use client';

import React, { useState } from 'react';
import { Vehicle } from '@/types/fuel';
import { writeNfcTag, useIsWebNfcSupported } from '@/lib/nfc-helper';
import { Wifi, CreditCard, CheckCircle2, AlertCircle, X, QrCode, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NfcWriterModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const NfcWriterModal: React.FC<NfcWriterModalProps> = ({ vehicle, onClose }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string } | null>(null);
  const hasNativeNfc = useIsWebNfcSupported();

  if (!vehicle) return null;

  const handleWriteNfc = async () => {
    if (!vehicle) return;
    setIsWriting(true);
    setResultMessage(null);

    const payload = {
      type: 'FLEET_FUEL_CARD' as const,
      nfcTagId: vehicle.nfcTagId,
      plate: vehicle.plate,
      vehicleModel: vehicle.model,
      issuedAt: new Date().toISOString()
    };

    const res = await writeNfcTag(payload);
    setIsWriting(false);
    setResultMessage({
      success: res.success,
      text: res.message
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#141414] border border-white/10 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-light text-white italic">Gravador de Cartão NFC da Frota</h3>
            <p className="text-xs text-slate-400 mt-1">
              Grave o código do cartão NFC físico para associar ao veículo <span className="text-amber-500 font-mono font-bold">{vehicle.plate}</span>
            </p>
          </div>

          {/* Physical Virtual Card Graphic */}
          <div className="bg-black p-6 rounded-xl border border-white/10 shadow-2xl mb-6 relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-white text-xs tracking-wider font-mono">FLEET NFC CARD</span>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/20">
                PRO 2026
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">VEÍCULO CADASTRADO</div>
              <div className="text-2xl font-bold font-mono text-white tracking-widest">{vehicle.plate}</div>
              <div className="text-xs text-slate-300 font-medium">{vehicle.model} • {vehicle.department}</div>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <div className="text-[9px] text-slate-500 uppercase">TAG NFC ID</div>
                <div className="text-xs font-mono font-bold text-amber-500">{vehicle.nfcTagId}</div>
              </div>
              <QrCode className="w-7 h-7 text-white/80" />
            </div>
          </div>

          {/* Web NFC Write Action */}
          <div className="space-y-4">
            {hasNativeNfc ? (
              <button
                onClick={handleWriteNfc}
                disabled={isWriting}
                className="w-full py-3 bg-white hover:bg-slate-200 text-black font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Wifi className="w-4 h-4" />
                <span>{isWriting ? 'Aproxime o Cartão NFC Físico...' : 'Gravar no Cartão NFC via Web NFC'}</span>
              </button>
            ) : (
              <div className="p-3 bg-black rounded-lg border border-white/10 text-xs text-slate-400">
                <p className="text-amber-500 font-bold mb-1 flex items-center gap-1">
                  <Wifi className="w-4 h-4" /> Modo Simulador Ativo
                </p>
                <p>O cartão NFC já está configurado e pronto para uso no <b>Totem do Frentista</b>. Em dispositivos com leitor NFC físico (Android com Chrome), você pode usar a gravação Web NFC direta.</p>
              </div>
            )}

            {resultMessage && (
              <div className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
                resultMessage.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}>
                {resultMessage.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{resultMessage.text}</span>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              Concluído
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
