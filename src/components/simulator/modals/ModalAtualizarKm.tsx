import React, { useState } from 'react';
import { Gauge } from 'lucide-react';

interface ModalAtualizarKmProps {
  isOpen: boolean;
  kmAtual: number;
  onClose: () => void;
  onSalvar: (novoKm: number) => void;
}

export const ModalAtualizarKm: React.FC<ModalAtualizarKmProps> = ({
  isOpen,
  kmAtual,
  onClose,
  onSalvar,
}) => {
  const [kmInput, setKmInput] = useState(() => Math.round(kmAtual).toString());

  if (!isOpen) return null;

  const handleSalvar = () => {
    const kmNum = parseFloat(kmInput.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(kmNum)) {
      onSalvar(kmNum);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[20px] p-6 space-y-4 animate-in slide-in-from-bottom duration-200 border-t border-slate-700/60 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Atualizar Odômetro</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Informe a quilometragem atual do painel para recalcular a vida útil das peças e alertas de revisão.
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Gauge className="w-5 h-5 text-[#EA580C]" />
          </div>
          <input
            type="text"
            autoFocus
            value={kmInput}
            onChange={(e) => setKmInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSalvar();
            }}
            className="w-full pl-11 pr-14 py-3.5 rounded-xl bg-[#121214] border border-slate-800 text-white text-xl font-bold font-mono tracking-wider focus:outline-none focus:border-[#EA580C]"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-bold text-slate-400">
            KM
          </div>
        </div>

        <button
          onClick={handleSalvar}
          className="w-full h-12 rounded-[10px] bg-[#EA580C] hover:bg-orange-600 active:scale-[0.99] font-bold text-white text-[15px] shadow-lg shadow-orange-600/30 flex items-center justify-center transition-all cursor-pointer"
        >
          Salvar e Recalcular Telemetria
        </button>
      </div>
    </div>
  );
};
