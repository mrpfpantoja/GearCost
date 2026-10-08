import React, { useState } from 'react';
import { 
  Gauge, 
  Sliders, 
  PlusCircle, 
  AlertTriangle, 
  ChevronRight, 
  DollarSign, 
  Clock,
  Car,
  Layers,
  Sparkles
} from 'lucide-react';
import { Veiculo, PecaMonitorada } from '../../../types/gearcost';
import { GaragemAdminCard } from './GaragemAdminCard';

interface GaragemTabProps {
  veiculos: Veiculo[];
  veiculoAtual: Veiculo;
  selectedVeiculoId: string;
  pecasCriticas: PecaMonitorada[];
  custoTotal: number;
  custoPorKm: number;
  mediaKmPorLitro: string;
  onSelectVeiculo: (id: string) => void;
  onUpdateKm: (veiculoId: string, novoKm: number) => void;
  onOpenAtualizarKm: () => void;
  onOpenNovaDespesa: () => void;
  onNavigateTelemetria: () => void;
  onNavigateCadastro: () => void;
  onEditarVeiculo: (veiculo: Veiculo) => void;
  onSolicitarExcluirVeiculo: (veiculo: Veiculo) => void;
}

export const GaragemTab: React.FC<GaragemTabProps> = ({
  veiculos,
  veiculoAtual,
  selectedVeiculoId,
  pecasCriticas,
  custoTotal,
  custoPorKm,
  mediaKmPorLitro,
  onSelectVeiculo,
  onUpdateKm,
  onOpenAtualizarKm,
  onOpenNovaDespesa,
  onNavigateTelemetria,
  onNavigateCadastro,
  onEditarVeiculo,
  onSolicitarExcluirVeiculo,
}) => {
  // Aba interna para alternar entre "Visão Geral do Carro Ativo" e "Gestão da Garagem / Frota"
  const [visaoAtiva, setVisaoAtiva] = useState<'painel' | 'frota'>('painel');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* SELETOR DE MODO DA GARAGEM: PAINEL DO CARRO ATIVO vs ADMIN DA FROTA */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => setVisaoAtiva('painel')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              visaoAtiva === 'painel'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Painel Ativo</span>
          </button>
          <button
            type="button"
            onClick={() => setVisaoAtiva('frota')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              visaoAtiva === 'frota'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Gerenciar Frota ({veiculos.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onNavigateCadastro}
          className="ml-2 p-1.5 px-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          title="Cadastrar novo veículo via FIPE"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">+ Novo</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODO 1: ADMINISTRAÇÃO COMPLETA DA GARAGEM / FROTA                    */}
      {/* ==================================================================== */}
      {visaoAtiva === 'frota' && (
        <div className="space-y-3.5 animate-in fade-in-50 duration-200">
          {/* Cabeçalho com Métricas da Garagem */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#181822] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Frota da Garagem
                </h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-white">{veiculos.length}</span>
                  <span className="text-xs text-slate-400">veículo(s) registrado(s)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateCadastro}
              className="py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Adicionar Veículo</span>
            </button>
          </div>

          {/* Lista de Veículos Cadastrados */}
          <div className="space-y-2.5">
            {veiculos.map((veiculo) => (
              <GaragemAdminCard
                key={veiculo.id}
                veiculo={veiculo}
                isAtivo={veiculo.id === selectedVeiculoId}
                onSelecionar={(id) => {
                  onSelectVeiculo(id);
                  setVisaoAtiva('painel');
                }}
                onEditar={onEditarVeiculo}
                onExcluir={onSolicitarExcluirVeiculo}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODO 2: PAINEL GERAL DO VEÍCULO ATIVO (DASHBOARD COMPLETO)          */}
      {/* ==================================================================== */}
      {visaoAtiva === 'painel' && (
        <div className="space-y-4">
          {/* Card do Veículo Ativo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                  {veiculoAtual.marca}
                </span>
                <h3 className="text-base font-black text-white leading-tight mt-0.5">
                  {veiculoAtual.modelo}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {veiculoAtual.motorizacao}
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-bold tracking-widest text-emerald-400 shadow-inner">
                {veiculoAtual.placa}
              </div>
            </div>

            {/* GaragemOdometroCard */}
            <div className="mt-4 p-4 rounded-2xl bg-[#18181C] border border-[#282830] shadow-md">
              <div className="flex items-center justify-between">
                {/* Lado Esquerdo: Ícone + Leitura do KM */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EA580C]/12 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-[#EA580C]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      ODÔMETRO ATUAL
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold text-white tracking-wide">
                        {veiculoAtual.kmAtual.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs font-bold text-[#EA580C]">KM</span>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Ano do Modelo */}
                <div className="text-right">
                  <div className="text-[11px] text-[#64748B]">Ano Modelo</div>
                  <div className="text-base font-bold text-white">{veiculoAtual.anoFabricacao}</div>
                </div>
              </div>

              <div className="my-3 border-t border-[#282830]" />

              {/* Botões de Ação Rápida */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onOpenAtualizarKm}
                  className="py-2.5 px-2 rounded-xl bg-[#202026] hover:bg-[#282832] transition-colors flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Atualizar KM</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenNovaDespesa}
                  className="py-2.5 px-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-white text-[11px] font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-white" />
                  <span>+ Nova Despesa</span>
                </button>
              </div>
            </div>

            {/* Simulador Interativo do Odômetro (Arrastar para Teste Rápido) */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-orange-400" />
                  Arrasto Rápido de Teste:
                </span>
                <span className="font-mono text-orange-400 font-bold">
                  {veiculoAtual.kmAtual.toLocaleString('pt-BR')} KM
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="85000"
                step="500"
                value={veiculoAtual.kmAtual}
                onChange={(e) => onUpdateKm(veiculoAtual.id, parseFloat(e.target.value))}
                className="w-full mt-2 accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                <span>50.000 KM</span>
                <span>67.500 KM</span>
                <span>85.000 KM</span>
              </div>
            </div>
          </div>

          {/* Alerta Crítico se houver peças >= 90% */}
          {pecasCriticas.length > 0 && (
            <div
              onClick={onNavigateTelemetria}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-between cursor-pointer hover:bg-rose-500/20 transition-all shadow-md shadow-rose-950/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center animate-bounce">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-300">
                    {pecasCriticas.length} componente(s) em estado crítico (&ge;90%)
                  </div>
                  <div className="text-[10px] text-rose-400/80">
                    Clique para inspecionar telemetria e agendar substituição
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </div>
          )}

          {/* Métricas Principais (Custo Total, R$/KM, Consumo) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Total Investido</div>
              <div className="text-xs font-black text-white mt-0.5">
                R$ {custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
              <div className="text-[9px] text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5">
                <DollarSign className="w-2.5 h-2.5" /> despesas
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Custo por KM</div>
              <div className="text-xs font-black text-orange-400 mt-0.5">
                R$ {custoPorKm.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">R$ / km rodado</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">Consumo Médio</div>
              <div className="text-xs font-black text-cyan-400 mt-0.5">
                {mediaKmPorLitro} <span className="text-[9px]">km/l</span>
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">gasolina alta oct.</div>
            </div>
          </div>

          {/* Revisões Próximas */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Revisões Programadas</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {veiculoAtual.manutencoesFuturas.length} agendadas
              </span>
            </div>
            <div className="space-y-2">
              {veiculoAtual.manutencoesFuturas.map((m) => {
                const kmRestante = m.kmLimite - veiculoAtual.kmAtual;
                const vencido = kmRestante <= 0;
                return (
                  <div
                    key={m.id}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className={`font-semibold ${vencido ? 'text-rose-400' : 'text-slate-200'}`}>
                        {m.descricaoServico}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Até {m.kmLimite.toLocaleString('pt-BR')} KM • Limite: {m.dataLimite}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vencido ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {vencido ? 'VENCIDA' : `Em ${Math.round(kmRestante)} KM`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
