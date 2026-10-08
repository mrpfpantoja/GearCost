import React from 'react';

interface ModalFiltrosFinanceiroProps {
  isOpen: boolean;
  onClose: () => void;
  filtroPeriodoStart: string;
  setFiltroPeriodoStart: (v: string) => void;
  filtroPeriodoEnd: string;
  setFiltroPeriodoEnd: (v: string) => void;
  kmMinFiltro: string;
  setKmMinFiltro: (v: string) => void;
  kmMaxFiltro: string;
  setKmMaxFiltro: (v: string) => void;
  onLimpar: () => void;
}

export const ModalFiltrosFinanceiro: React.FC<ModalFiltrosFinanceiroProps> = ({
  isOpen,
  onClose,
  filtroPeriodoStart,
  setFiltroPeriodoStart,
  filtroPeriodoEnd,
  setFiltroPeriodoEnd,
  kmMinFiltro,
  setKmMinFiltro,
  kmMaxFiltro,
  setKmMaxFiltro,
  onLimpar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[20px] p-5 space-y-4 animate-in slide-in-from-bottom duration-200 border-t border-slate-700/80 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Filtros de Pesquisa</h3>
          <button
            onClick={onLimpar}
            className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
          >
            Limpar
          </button>
        </div>

        {/* Intervalo de Datas */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium">Intervalo de Datas</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">A partir de:</span>
              <input
                type="date"
                value={filtroPeriodoStart}
                onChange={(e) => setFiltroPeriodoStart(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Até:</span>
              <input
                type="date"
                value={filtroPeriodoEnd}
                onChange={(e) => setFiltroPeriodoEnd(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>
        </div>

        {/* Faixa de Quilometragem */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium">
            Faixa de Quilometragem (KM)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="KM Mínimo"
              value={kmMinFiltro}
              onChange={(e) => setKmMinFiltro(e.target.value)}
              className="bg-[#121214] border border-slate-800 rounded-lg p-2 text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
            />
            <input
              type="number"
              placeholder="KM Máximo"
              value={kmMaxFiltro}
              onChange={(e) => setKmMaxFiltro(e.target.value)}
              className="bg-[#121214] border border-slate-800 rounded-lg p-2 text-white text-xs font-mono focus:outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>

        {/* Botão Aplicar */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-600 font-bold text-white text-xs shadow-md transition-all mt-2 cursor-pointer"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};
