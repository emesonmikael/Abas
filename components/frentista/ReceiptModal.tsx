'use client';

import React from 'react';
import { FuelTransaction } from '@/types/fuel';
import { CheckCircle2, Printer, Fuel, ShieldCheck, QrCode, ArrowRight, AlertTriangle, Building, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReceiptModalProps {
  transaction: FuelTransaction | null;
  onClose: () => void;
  onNewFueling: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
  onNewFueling
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const hasFlags = transaction.flags && transaction.flags.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#141414] border border-white/10 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8 print:border-none print:shadow-none print:bg-white print:text-slate-950"
        >
          {/* Printable Header */}
          <div className="text-center pb-6 border-b border-white/10 print:border-slate-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 print:hidden">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2 print:border-slate-400 print:text-emerald-700">
              ABASTECIMENTO AUTORIZADO
            </span>

            <h2 className="text-2xl font-light text-white italic print:text-slate-950">Comprovante de Abastecimento</h2>
            <p className="text-xs font-mono text-slate-400 mt-1 print:text-slate-600">
              Protocolo: <span className="text-amber-500 font-bold">{transaction.protocolNumber}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 print:text-slate-600">
              {new Date(transaction.timestamp).toLocaleString('pt-BR')} • {transaction.stationName} ({transaction.pumpNumber})
            </p>
          </div>

          {/* Receipt Body */}
          <div className="py-6 space-y-4 font-mono text-xs">
            
            {/* Vehicle & Driver */}
            <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2 print:bg-slate-100 print:border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">PLACA DO VEÍCULO:</span>
                <span className="font-extrabold text-sm text-white print:text-slate-950">{transaction.vehiclePlate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">MODELO:</span>
                <span className="font-semibold text-slate-200 print:text-slate-800">{transaction.vehicleModel}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600">MOTORISTA:</span>
                <span className="font-bold text-amber-500 print:text-slate-950">{transaction.driverName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">AUTENTICAÇÃO:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 print:text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" /> PIN VÁLIDO
                </span>
              </div>
            </div>

            {/* Fueling Figures */}
            <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2 print:bg-slate-100 print:border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">COMBUSTÍVEL:</span>
                <span className="font-bold uppercase text-white print:text-slate-950">{transaction.fuelType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">VOLUME ABASTECIDO:</span>
                <span className="font-bold text-sm text-white print:text-slate-950">{transaction.liters.toFixed(2)} LITROS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">PREÇO UNITÁRIO:</span>
                <span className="font-semibold text-slate-300 print:text-slate-800">R$ {transaction.pricePerLiter.toFixed(2)} / L</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2 print:border-slate-300">
                <span className="text-slate-400 font-bold print:text-slate-600">VALOR TOTAL:</span>
                <span className="text-lg font-bold text-amber-500 print:text-slate-950">
                  R$ {transaction.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Mileage & Efficiency */}
            <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2 print:bg-slate-100 print:border-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">HODÔMETRO REGISTRADO:</span>
                <span className="font-bold text-white print:text-slate-950">{transaction.odometerKm.toLocaleString('pt-BR')} KM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 print:text-slate-600">PERCURSO DESDE ÚLTIMO:</span>
                <span className="font-semibold text-slate-300 print:text-slate-800">{transaction.kmDriven.toLocaleString('pt-BR')} KM</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600">EFICIÊNCIA CALCULADA:</span>
                <span className="font-bold text-emerald-400 print:text-emerald-700">{transaction.calculatedKmPerLiter} KM/L</span>
              </div>
            </div>

            {/* Flags if flagged */}
            {hasFlags && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] space-y-1 print:border-slate-400">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> OBSERVAÇÕES E ALERTAS DA AUDITORIA:
                </div>
                {transaction.flags?.map((flag, i) => (
                  <div key={i} className="pl-4 text-slate-300">• {flag}</div>
                ))}
              </div>
            )}

            {/* Security Digital Seal */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[10px] text-slate-500 print:text-slate-600">
                <p>TAG NFC: {transaction.nfcTagUsed}</p>
                <p>Atendente: {transaction.attendantName}</p>
                <p className="font-mono mt-0.5">HASH: SHA256-NFC-{transaction.protocolNumber}</p>
              </div>

              {/* QR Code Graphic placeholder */}
              <div className="w-12 h-12 bg-white p-1 rounded border border-white/20 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-1/2 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors border border-white/10"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR RECIBO</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNewFueling();
              }}
              className="w-full sm:w-1/2 py-3 bg-white hover:bg-slate-200 text-black font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <span>NOVO ABASTECIMENTO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
