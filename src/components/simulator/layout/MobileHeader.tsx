import React from 'react';
import { User } from 'lucide-react';
import { Veiculo, Usuario } from '../../../types/gearcost';

interface MobileHeaderProps {
  veiculos: Veiculo[];
  veiculoAtual: Veiculo;
  selectedVeiculoId: string;
  onSelectVeiculo: (id: string) => void;
  usuarioLogado: Usuario | null | undefined;
  onOpenPerfil: () => void;
  onNavigateAuth: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  veiculos,
  veiculoAtual,
  selectedVeiculoId,
  onSelectVeiculo,
  usuarioLogado,
  onOpenPerfil,
  onNavigateAuth,
}) => {
  return (
    <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-orange-600/30">
          G
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-sm tracking-tight text-white">GearCost</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-orange-500/20 text-orange-400 rounded-md border border-orange-500/30">
              STAGE 2
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
            {veiculoAtual.modelo}
          </p>
        </div>
      </div>

      {/* Seletor de Carro e Perfil de Usuário / Piloto */}
      <div className="flex items-center gap-1.5">
        <select
          value={selectedVeiculoId}
          onChange={(e) => onSelectVeiculo(e.target.value)}
          className="bg-slate-800/90 text-[11px] text-orange-300 font-semibold py-1 px-1.5 rounded-lg border border-slate-700 focus:outline-none max-w-[105px] truncate cursor-pointer"
          title="Alternar veículo ativo na garagem"
        >
          {veiculos.map((v) => (
            <option key={v.id} value={v.id} className="bg-slate-900 text-white">
              {v.placa} • {v.modelo.split(' ')[0]}
            </option>
          ))}
        </select>

        {/* Botão de Perfil / Acesso de Conta */}
        <button
          type="button"
          onClick={() => {
            if (usuarioLogado) {
              onOpenPerfil();
            } else {
              onNavigateAuth();
            }
          }}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
            usuarioLogado
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
          title={
            usuarioLogado
              ? `Perfil: ${usuarioLogado.nome} (${usuarioLogado.apelidoPiloto || 'Piloto'})`
              : 'Fazer Login / Cadastro'
          }
        >
          <div className="relative">
            <User className="w-3.5 h-3.5" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                usuarioLogado ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
          </div>
          <span className="hidden sm:inline max-w-[65px] truncate text-[10px]">
            {usuarioLogado
              ? usuarioLogado.apelidoPiloto || usuarioLogado.nome.split(' ')[0]
              : 'Entrar'}
          </span>
        </button>
      </div>
    </div>
  );
};
