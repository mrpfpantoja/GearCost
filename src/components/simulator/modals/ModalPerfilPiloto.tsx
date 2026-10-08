import React from 'react';
import { User, KeyRound, LogOut } from 'lucide-react';
import { Usuario } from '../../../types/gearcost';

interface ModalPerfilPilotoProps {
  isOpen: boolean;
  usuarioLogado: Usuario | null | undefined;
  veiculosCount: number;
  pecasAtivasCount: number;
  onClose: () => void;
  onTrocarConta: () => void;
  onLogout: () => void;
}

export const ModalPerfilPiloto: React.FC<ModalPerfilPilotoProps> = ({
  isOpen,
  usuarioLogado,
  veiculosCount,
  pecasAtivasCount,
  onClose,
  onTrocarConta,
  onLogout,
}) => {
  if (!isOpen || !usuarioLogado) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#18181C] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-[#EA580C]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Perfil do Piloto Gearhead
              </h3>
              <span className="text-[10px] text-slate-400">Garagem GearCost • Sessão Ativa</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Card de Identificação */}
        <div className="p-3.5 rounded-2xl bg-[#121214] border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-md shrink-0">
            {usuarioLogado.apelidoPiloto?.[0] || usuarioLogado.nome[0] || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-black text-white truncate">{usuarioLogado.nome}</h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold shrink-0">
                {usuarioLogado.nivelGearhead}
              </span>
            </div>
            <p className="text-xs text-orange-400 font-mono font-bold mt-0.5">
              {usuarioLogado.apelidoPiloto || 'Piloto Gearhead'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{usuarioLogado.email}</p>
          </div>
        </div>

        {/* Informações da Garagem */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Carros</span>
            <span className="text-sm font-black text-white font-mono">{veiculosCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Peças Ativas</span>
            <span className="text-sm font-black text-orange-400 font-mono">{pecasAtivasCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[9px] text-slate-400 block">Membro Desde</span>
            <span className="text-[10px] font-bold text-slate-300 font-mono truncate block mt-0.5">
              {usuarioLogado.criadoEm}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onTrocarConta}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-orange-400" />
            <span>Trocar de Conta / Novo Login</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
