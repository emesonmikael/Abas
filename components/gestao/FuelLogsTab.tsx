'use client';

import React, { useState } from 'react';
import { FuelTransaction } from '@/types/fuel';
import { History, Search, Filter, ShieldCheck, AlertTriangle, CheckCircle2, Eye, FileText, ArrowDownRight } from 'lucide-react';

interface FuelLogsTabProps {
  transactions: FuelTransaction[];
  onSelectTransaction: (tx: FuelTransaction) => void;
}

export const FuelLogsTab: React.FC<FuelLogsTabProps> = ({
  transactions,
  onSelectTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = transactions.filter(tx => {
    const matchesQuery = tx.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.protocolNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.stationName.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesQuery;
    return matchesQuery && tx.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="text-xl font-light text-white italic flex items-center space-x-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>Histórico de Abastecimentos por NFC</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro auditável de todas as autorizações de abastecimento efetuadas via cartão NFC e PIN
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-amber-500">
            R$ {transactions.reduce((acc, t) => acc + t.totalValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 uppercase font-medium tracking-wider">Total Acumulado em Abastecimentos</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por placa, motorista, protocolo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filtrar Auditoria:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todas as Transações</option>
            <option value="approved">Aprovados Sem Alertas</option>
            <option value="flagged">Com Alerta / Auditoria</option>
            <option value="rejected">Rejeitados</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black text-slate-400 uppercase font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Protocolo / Data</th>
                <th className="p-4">Veículo</th>
                <th className="p-4">Motorista (PIN)</th>
                <th className="p-4">Combustível / Litros</th>
                <th className="p-4">Valor (R$)</th>
                <th className="p-4">Média KM/L</th>
                <th className="p-4">Status Auditoria</th>
                <th className="p-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((tx) => {
                const hasFlags = tx.flags && tx.flags.length > 0;

                return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    
                    <td className="p-4 font-mono">
                      <div className="font-bold text-amber-500">{tx.protocolNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono font-bold text-white">{tx.vehiclePlate}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{tx.vehicleModel}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-200">{tx.driverName}</div>
                      <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Autenticado por PIN
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-white uppercase">{tx.liters.toFixed(2)}L ({tx.fuelType})</div>
                      <div className="text-[10px] text-slate-400">R$ {tx.pricePerLiter.toFixed(2)}/L</div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-sm">
                      R$ {tx.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="p-4 font-mono">
                      <div className="font-bold text-emerald-400">{tx.calculatedKmPerLiter} KM/L</div>
                      <div className="text-[10px] text-slate-400">{tx.kmDriven} KM rodados</div>
                    </td>

                    <td className="p-4">
                      {hasFlags ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
                          <AlertTriangle className="w-3 h-3" /> Auditado ({tx.flags?.length})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Ok
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectTransaction(tx)}
                        className="p-2 bg-white/5 hover:bg-amber-500 hover:text-black hover:border-amber-500 text-slate-300 rounded-lg transition-colors border border-white/10 cursor-pointer"
                        title="Ver comprovante detalhado"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Nenhum abastecimento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
