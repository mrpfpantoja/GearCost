import React from 'react';
import { Trash2 } from 'lucide-react';
import { DespesaBase } from '../../../types/gearcost';

interface ModalExcluirDespesaProps {
  despesa: DespesaBase | null;
  onClose: () => void;
  onConfirmar: (despesaId: string) => void;
}

export const ModalExcluirDespesa: React.FC<ModalExcluirDespesaProps> = ({
  despesa,
  onClose,
  onConfirmar,
}) => {
  if (!despesa) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[320px] bg-[#1E1E24] rounded-2xl p-5 border border-slate-700/80 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Excluir Lançamento?
            </h3>
            <span className="text-[11px] text-slate-400">Esta ação é irreversível</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#121214] border border-slate-800 text-xs text-slate-300">
          <div className="font-bold text-white truncate">
            {despesa.observacoes || (despesa as any).oficina || despesa.tipo}
          </div>
          <div className="text-[11px] text-[#EA580C] font-mono mt-1 flex items-center justify-between">
            <span>R$ {despesa.valor.toFixed(2)}</span>
            <span>{despesa.kmRegistro.toLocaleString('pt-BR')} KM</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          O registro será removido permanentemente da tabela de despesas do banco SQLite e os totais serão recalculados.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(despesa.id)}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
