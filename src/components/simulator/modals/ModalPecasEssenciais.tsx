import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';
import { PECAS_ESSENCIAIS_CATALOGO, PecaCatalogoItem } from '../constants/pecasEssenciais';
import { PecaMonitorada } from '../../../types/gearcost';

interface ModalPecasEssenciaisProps {
  isOpen: boolean;
  veiculoId: string;
  kmAtual: number;
  onClose: () => void;
  onAddPeca: (veiculoId: string, novaPeca: PecaMonitorada) => void;
  onAbrirNovaPecaCustom: () => void;
  onToast: (msg: string) => void;
}

export const ModalPecasEssenciais: React.FC<ModalPecasEssenciaisProps> = ({
  isOpen,
  veiculoId,
  kmAtual,
  onClose,
  onAddPeca,
  onAbrirNovaPecaCustom,
  onToast,
}) => {
  if (!isOpen) return null;

  const handleAdicionarPecaCatalogo = (item: PecaCatalogoItem) => {
    const nova: PecaMonitorada =
      item.tipoPeca === 'PNEU'
        ? {
            id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            veiculoId,
            nome: item.nome,
            tipoPeca: 'PNEU',
            posicao: item.posicao || 'Dianteiro Esquerdo',
            medida: item.medida || '225/45 R17',
            dot: item.dot || '1026',
            kmInstalacao: Math.round(kmAtual),
            vidaUtilEstimadaKm: item.vidaUtilKm,
          }
        : {
            id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            veiculoId,
            nome: item.nome,
            tipoPeca: 'GENERICO',
            categoria: item.categoria,
            intervaloMaximoMeses: item.intervaloMeses || 12,
            kmInstalacao: Math.round(kmAtual),
            vidaUtilEstimadaKm: item.vidaUtilKm,
          };

    onAddPeca(veiculoId, nova);
    onToast(`"${nova.nome}" adicionada à telemetria!`);
  };

  const handleAdicionarKitCompleto = () => {
    const kit = [
      { nome: 'Óleo Sintético 5W-40 + Filtro Mann', categoria: 'Oleo & Fluidos', tipoPeca: 'GENERICO' as const, vidaUtilKm: 8000 },
      { nome: 'Pastilhas de Freio Dianteiras Cerâmica', categoria: 'Freios', tipoPeca: 'GENERICO' as const, vidaUtilKm: 30000 },
      { nome: 'Fluido de Freio Alta Performance DOT 5.1', categoria: 'Oleo & Fluidos', tipoPeca: 'GENERICO' as const, vidaUtilKm: 20000 },
      { nome: 'Pneus Dianteiros Esportivos', tipoPeca: 'PNEU' as const, posicao: 'Dianteiro Esquerdo' as const, medida: '225/45 R17', dot: '1026', vidaUtilKm: 40000 },
      { nome: 'Velas de Ignição Laser Iridium', categoria: 'Ignição', tipoPeca: 'GENERICO' as const, vidaUtilKm: 35000 },
      { nome: 'Filtro de Ar do Motor de Alta Vazão', categoria: 'Filtros', tipoPeca: 'GENERICO' as const, vidaUtilKm: 15000 },
    ];
    kit.forEach((k, idx) => {
      setTimeout(() => {
        const nova: PecaMonitorada =
          k.tipoPeca === 'PNEU'
            ? {
                id: `p_${Date.now()}_${idx}`,
                veiculoId,
                nome: k.nome,
                tipoPeca: 'PNEU',
                posicao: k.posicao,
                medida: k.medida,
                dot: k.dot,
                kmInstalacao: Math.round(kmAtual),
                vidaUtilEstimadaKm: k.vidaUtilKm,
              }
            : {
                id: `p_${Date.now()}_${idx}`,
                veiculoId,
                nome: k.nome,
                tipoPeca: 'GENERICO',
                categoria: k.categoria,
                kmInstalacao: Math.round(kmAtual),
                vidaUtilEstimadaKm: k.vidaUtilKm,
              };
        onAddPeca(veiculoId, nova);
      }, idx * 40);
    });
    onClose();
    onToast('Kit essencial completo (6 itens) cadastrado na telemetria!');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200 custom-scrollbar">
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Peças & Fluidos Essenciais
              </h3>
              <span className="text-[10px] text-slate-400">
                Telemetria e controle preventivo de desgaste
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Botão de Destaque: Pacote de Revisão Completo */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-600/25 via-amber-600/15 to-slate-900 border border-orange-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">⚡</span>
              <span className="text-xs font-black text-white">Kit Completo de Revisão Preventiva</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white">
              6 ITENS
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Adiciona instantaneamente na telemetria: Óleo 5W-40, Pastilhas de Freio Cerâmica, Fluido de Freio DOT 5.1, Pneus Dianteiros, Velas Iridium e Filtro de Ar.
          </p>
          <button
            type="button"
            onClick={handleAdicionarKitCompleto}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adicionar Todos os 6 Itens Essenciais</span>
          </button>
        </div>

        {/* Lista Categorizada do Catálogo */}
        <div className="space-y-4">
          {PECAS_ESSENCIAIS_CATALOGO.map((secao) => (
            <div key={secao.categoriaTipo} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <span>{secao.icone}</span>
                <span>{secao.categoriaLabel}</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {secao.itens.map((item) => (
                  <div
                    key={item.nome}
                    className="p-3 rounded-xl bg-[#121214] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 transition-all"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white truncate">
                          {item.nome}
                        </span>
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.descricao}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdicionarPecaCatalogo(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-200 text-[10px] font-bold border border-slate-700/80 shrink-0 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3 text-orange-400 group-hover:text-white" />
                      <span>+ Adicionar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ações de Rodapé */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onAbrirNovaPecaCustom();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1E1E24] hover:bg-slate-800 border border-slate-700 text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Cadastrar Peça Personalizada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
