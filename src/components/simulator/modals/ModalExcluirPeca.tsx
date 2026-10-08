import React from 'react';
import { Trash2 } from 'lucide-react';
import { PecaMonitorada } from '../../../types/gearcost';

interface ModalExcluirPecaProps {
  peca: PecaMonitorada | null;
  onClose: () => void;
  onConfirmar: (pecaId: string) => void;
}

export const ModalExcluirPeca: React.FC<ModalExcluirPecaProps> = ({
  peca,
  onClose,
  onConfirmar,
}) => {
  if (!peca) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[320px] bg-[#1E1E24] rounded-2xl p-5 border border-slate-700/80 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Remover Componente?</h3>
            <span className="text-[11px] text-slate-400">Excluir da telemetria</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#121214] border border-slate-800 text-xs text-slate-300">
          <div className="font-bold text-white truncate">{peca.nome}</div>
          <div className="text-[11px] text-orange-400 font-mono mt-1 flex items-center justify-between">
            <span>Vida útil: {peca.vidaUtilEstimadaKm.toLocaleString('pt-BR')} KM</span>
            <span>Instalado: {peca.kmInstalacao.toLocaleString('pt-BR')} KM</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Esta peça deixará de ter o desgaste e ciclo de substituição monitorados pelo GearCost.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(peca.id)}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir Peça
          </button>
        </div>
      </div>
    </div>
  );
};
