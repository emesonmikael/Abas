'use client';

import React, { useState } from 'react';
import { Vehicle, FuelTransaction } from '@/types/fuel';
import { BarChart3, Sparkles, DollarSign, Fuel, Gauge, ShieldAlert, CheckCircle2, ArrowUpRight, Bot } from 'lucide-react';

interface AnalyticsTabProps {
  vehicles: Vehicle[];
  transactions: FuelTransaction[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ vehicles, transactions }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Totals calculations
  const totalSpent = transactions.reduce((acc, t) => acc + t.totalValue, 0);
  const totalLiters = transactions.reduce((acc, t) => acc + t.liters, 0);
  const flaggedCount = transactions.filter(t => t.flags && t.flags.length > 0).length;

  const validKmL = transactions.filter(t => t.calculatedKmPerLiter > 0);
  const avgFleetKmL = validKmL.length > 0
    ? Number((validKmL.reduce((acc, t) => acc + t.calculatedKmPerLiter, 0) / validKmL.length).toFixed(2))
    : 0;

  // Breakdown by fuel type
  const fuelTypeTotals = transactions.reduce((acc, t) => {
    acc[t.fuelType] = (acc[t.fuelType] || 0) + t.totalValue;
    return acc;
  }, {} as Record<string, number>);

  const runGeminiFleetAudit = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/gemini/analyze-fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, vehicles })
      });

      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis('Erro ao obter análise da IA: ' + (data.error || 'Tente novamente.'));
      }
    } catch (e: any) {
      setAiAnalysis('Erro ao se conectar ao serviço Gemini AI.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-xl border border-white/10 shadow-2xl">
        <div>
          <h2 className="text-xl font-light text-white italic flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            <span>Dashboard & Indicadores de Consumo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visão consolidada do consumo de combustível da frota e auditoria inteligente
          </p>
        </div>

        <button
          onClick={runGeminiFleetAudit}
          disabled={isAnalyzing}
          className="px-5 py-3 bg-white hover:bg-slate-200 text-black font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-black animate-bounce" />
          <span>{isAnalyzing ? 'Analisando Frota com IA...' : 'Auditoria de Frota com Gemini AI'}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#141414] p-5 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Investido</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{transactions.length} abastecimentos realizados</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Litros Faturados</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalLiters.toFixed(1)} <span className="text-xs font-normal text-slate-400">L</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Volume total abastecido</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Média Eficiência</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {avgFleetKmL} <span className="text-xs font-normal text-slate-400">KM/L</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Média geral da frota em uso</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alertas / Anomalias</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-amber-500">
            {flaggedCount} <span className="text-xs font-normal text-slate-400">Casos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sinalizados para verificação do gestor</p>
        </div>

      </div>

      {/* Fuel Type Distribution Bars */}
      <div className="bg-[#141414] p-6 rounded-xl border border-white/10 shadow-2xl">
        <h3 className="text-sm font-semibold text-white tracking-tight mb-4">Distribuição de Gastos por Tipo de Combustível</h3>
        
        <div className="space-y-3">
          {Object.entries(fuelTypeTotals).map(([type, value]) => {
            const pct = totalSpent > 0 ? (value / totalSpent) * 100 : 0;
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="uppercase text-slate-300 font-medium">{type}</span>
                  <span className="text-amber-500">
                    R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Analysis Result Section */}
      {aiAnalysis && (
        <div className="bg-[#141414] p-6 rounded-xl border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 text-amber-500 font-semibold text-base pb-3 border-b border-white/10">
            <Bot className="w-5 h-5" />
            <span>Relatório de Auditoria Gerado por Gemini AI</span>
          </div>

          <div className="prose prose-invert prose-sm text-slate-200 leading-relaxed font-sans max-w-none whitespace-pre-wrap">
            {aiAnalysis}
          </div>
        </div>
      )}

    </div>
  );
};
