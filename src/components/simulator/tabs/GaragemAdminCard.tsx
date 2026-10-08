import React from 'react';
import { 
  Car, 
  PlusCircle, 
  Check, 
  Edit3, 
  Trash2, 
  Gauge, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Veiculo } from '../../../types/gearcost';

interface GaragemAdminCardProps {
  veiculo: Veiculo;
  isAtivo: boolean;
  onSelecionar: (id: string) => void;
  onEditar: (veiculo: Veiculo) => void;
  onExcluir: (veiculo: Veiculo) => void;
}

export const GaragemAdminCard: React.FC<GaragemAdminCardProps> = ({
  veiculo,
  isAtivo,
  onSelecionar,
  onEditar,
  onExcluir,
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
        isAtivo
          ? 'bg-gradient-to-br from-[#1c1c24] via-slate-900 to-slate-950 border-orange-500/50 shadow-lg shadow-orange-950/20 ring-1 ring-orange-500/30'
          : 'bg-[#15151c]/90 hover:bg-[#191922] border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Glow de fundo para o veículo ativo */}
      {isAtivo && (
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Topo do Card: Marca, Modelo e Badge de Status Ativo */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              {veiculo.marca}
            </span>
            {isAtivo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-[9px] font-black text-orange-400 uppercase tracking-wider animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-orange-400" />
                Veículo Ativo
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-white leading-tight mt-0.5 truncate">
            {veiculo.modelo}
          </h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
            {veiculo.motorizacao} • Ano {veiculo.anoFabricacao}
          </p>
        </div>

        {/* Badge da Placa */}
        <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold tracking-wider text-emerald-400 shadow-inner shrink-0">
          {veiculo.placa}
        </div>
      </div>

      {/* Odômetro e Métricas Rápidas */}
      <div className="mt-3 grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center">
        <div>
          <div className="text-[9px] text-slate-500 uppercase font-semibold">Odômetro</div>
          <div className="text-xs font-bold font-mono text-white mt-0.5">
            {veiculo.kmAtual.toLocaleString('pt-BR')} <span className="text-[9px] text-orange-400">KM</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] text-slate-500 uppercase font-semibold">Peças</div>
          <div className="text-xs font-bold text-slate-300 mt-0.5">
            {veiculo.pecas.length} ativas
          </div>
        </div>
        <div>
          <div className="text-[9px] text-slate-500 uppercase font-semibold">Despesas</div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">
            {veiculo.despesas.length} reg.
          </div>
        </div>
      </div>

      {/* Ações do Card */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
        {/* Botão Selecionar / Ativar */}
        <button
          type="button"
          disabled={isAtivo}
          onClick={() => onSelecionar(veiculo.id)}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isAtivo
              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 cursor-default'
              : 'bg-slate-800 hover:bg-slate-700 active:scale-95 text-white'
          }`}
          title={isAtivo ? 'Veículo já selecionado nesta sessão' : 'Tornar este carro o ativo da sessão'}
        >
          {isAtivo ? (
            <>
              <Check className="w-3.5 h-3.5 text-orange-400" />
              <span>Em Uso</span>
            </>
          ) : (
            <>
              <Car className="w-3.5 h-3.5 text-slate-300" />
              <span>Ativar Carro</span>
            </>
          )}
        </button>

        {/* Botão Editar Dados */}
        <button
          type="button"
          onClick={() => onEditar(veiculo)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
          title="Editar placa, specs e odômetro"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Botão Excluir (Alerta Vermelho) */}
        <button
          type="button"
          onClick={() => onExcluir(veiculo)}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[#E11D48] hover:text-rose-300 transition-colors cursor-pointer"
          title="Excluir veículo da garagem"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
