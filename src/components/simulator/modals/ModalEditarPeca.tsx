import React, { useState, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
import { PecaMonitorada, ComponenteGenerico, Pneu } from '../../../types/gearcost';

interface ModalEditarPecaProps {
  peca: PecaMonitorada | null;
  kmAtual: number;
  onClose: () => void;
  onSalvar: (pecaAtualizada: PecaMonitorada) => void;
  onErrorToast?: (msg: string) => void;
}

export const ModalEditarPeca: React.FC<ModalEditarPecaProps> = ({
  peca,
  kmAtual,
  onClose,
  onSalvar,
  onErrorToast,
}) => {
  const [editNomePeca, setEditNomePeca] = useState('');
  const [editKmInstalacaoPeca, setEditKmInstalacaoPeca] = useState('');
  const [editVidaUtilPeca, setEditVidaUtilPeca] = useState('');
  const [editCategoriaPeca, setEditCategoriaPeca] = useState('Oleo & Fluidos');
  const [editPosicaoPneu, setEditPosicaoPneu] = useState<
    'Dianteiro Esquerdo' | 'Dianteiro Direito' | 'Traseiro Esquerdo' | 'Traseiro Direito'
  >('Dianteiro Esquerdo');
  const [editMedidaPneu, setEditMedidaPneu] = useState('225/45 R17');
  const [editDotPneu, setEditDotPneu] = useState('1026');

  useEffect(() => {
    if (peca) {
      setEditNomePeca(peca.nome);
      setEditKmInstalacaoPeca(peca.kmInstalacao.toString());
      setEditVidaUtilPeca(peca.vidaUtilEstimadaKm.toString());
      if (peca.tipoPeca === 'PNEU') {
        const pneu = peca as Pneu;
        setEditPosicaoPneu(pneu.posicao);
        setEditMedidaPneu(pneu.medida);
        setEditDotPneu(pneu.dot);
      } else {
        const gen = peca as ComponenteGenerico;
        setEditCategoriaPeca(gen.categoria || 'Oleo & Fluidos');
      }
    }
  }, [peca]);

  if (!peca) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNomePeca.trim()) {
      if (onErrorToast) onErrorToast('Informe o nome da peça.');
      return;
    }

    const kmInst = parseFloat(editKmInstalacaoPeca) || peca.kmInstalacao;
    const vidaUtil = parseFloat(editVidaUtilPeca) || peca.vidaUtilEstimadaKm;

    let atualizada: PecaMonitorada;
    if (peca.tipoPeca === 'PNEU') {
      atualizada = {
        ...peca,
        nome: editNomePeca.trim(),
        kmInstalacao: kmInst,
        vidaUtilEstimadaKm: vidaUtil,
        posicao: editPosicaoPneu,
        medida: editMedidaPneu.trim() || (peca as Pneu).medida,
        dot: editDotPneu.trim() || (peca as Pneu).dot,
      };
    } else {
      atualizada = {
        ...peca,
        nome: editNomePeca.trim(),
        kmInstalacao: kmInst,
        vidaUtilEstimadaKm: vidaUtil,
        categoria: editCategoriaPeca || (peca as ComponenteGenerico).categoria,
      };
    }

    onSalvar(atualizada);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl max-h-[88vh] overflow-y-auto space-y-3.5 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Editar Componente</h3>
              <span className="text-[10px] text-slate-400">Ajustar parâmetros de telemetria</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              Nome do Componente / Peça *
            </label>
            <input
              type="text"
              required
              value={editNomePeca}
              onChange={(e) => setEditNomePeca(e.target.value)}
              className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] text-slate-400 font-medium block">
                  KM de Instalação *
                </label>
                <button
                  type="button"
                  onClick={() => setEditKmInstalacaoPeca(Math.round(kmAtual).toString())}
                  className="text-[9px] text-orange-400 font-bold hover:underline cursor-pointer"
                >
                  Usar Odômetro
                </button>
              </div>
              <input
                type="number"
                required
                value={editKmInstalacaoPeca}
                onChange={(e) => setEditKmInstalacaoPeca(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Vida Útil Estimada (KM) *
              </label>
              <input
                type="number"
                required
                value={editVidaUtilPeca}
                onChange={(e) => setEditVidaUtilPeca(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Ação Rápida no Modal: Substituir Peça e Zerar Desgaste */}
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-2">
            <div className="text-[10px] text-slate-300">
              <span className="font-bold text-orange-400 block">Substituição Recente?</span>
              Zera o desgaste definindo a instalação para o odômetro atual ({kmAtual.toLocaleString('pt-BR')} KM).
            </div>
            <button
              type="button"
              onClick={() => {
                setEditKmInstalacaoPeca(Math.round(kmAtual).toString());
              }}
              className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] shrink-0 active:scale-95 transition-all cursor-pointer"
            >
              Trocar Agora
            </button>
          </div>

          {peca.tipoPeca === 'PNEU' ? (
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Especificações do Pneu
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Medida</label>
                  <input
                    type="text"
                    value={editMedidaPneu}
                    onChange={(e) => setEditMedidaPneu(e.target.value)}
                    className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">DOT (Semana/Ano)</label>
                  <input
                    type="text"
                    value={editDotPneu}
                    onChange={(e) => setEditDotPneu(e.target.value)}
                    className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Categoria / Tipo
              </label>
              <select
                value={editCategoriaPeca}
                onChange={(e) => setEditCategoriaPeca(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Oleo & Fluidos">🛢️ Óleo & Fluidos (Motor, Freio, Arrefecimento)</option>
                <option value="Freios">🛑 Freios & Discos (Pastilhas, Discos, Linhas)</option>
                <option value="Filtros">💨 Filtros (Óleo, Ar, Cabine, Combustível)</option>
                <option value="Ignição">⚡ Ignição (Velas, Bobinas, Cabos)</option>
                <option value="Suspensão">🔩 Suspensão (Amortecedores, Molas, Buchas)</option>
                <option value="Correias">🔗 Correias (Dentada, Alternador, Tensores)</option>
                <option value="Transmissão">⚙️ Transmissão (Embreagem, Óleo Câmbio)</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="col-span-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] font-bold text-white text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
