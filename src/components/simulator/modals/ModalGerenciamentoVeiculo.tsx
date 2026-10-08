import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  Car, 
  Edit3, 
  Check, 
  Save, 
  PlusCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { Veiculo } from '../../../types/gearcost';

// ============================================================================
// MODAL DE CONFIRMAÇÃO CRÍTICA DE EXCLUSÃO DE VEÍCULO
// ============================================================================
interface ModalExcluirVeiculoProps {
  isOpen: boolean;
  veiculo: Veiculo | null;
  totalVeiculos: number;
  onClose: () => void;
  onConfirmar: (veiculoId: string) => void;
}

export const ModalExcluirVeiculo: React.FC<ModalExcluirVeiculoProps> = ({
  isOpen,
  veiculo,
  totalVeiculos,
  onClose,
  onConfirmar,
}) => {
  if (!isOpen || !veiculo) return null;

  const isUnicoCarro = totalVeiculos <= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-[#121216] border border-rose-500/30 p-5 shadow-2xl shadow-rose-950/40 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-excluir-veiculo-title"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ícone de Alerta Crítico */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
              Zona de Perigo • Exclusão Crítica
            </span>
            <h2 id="modal-excluir-veiculo-title" className="text-base font-black text-white leading-tight">
              Excluir Veículo da Garagem?
            </h2>
          </div>
        </div>

        {/* Card do Carro Selecionado para Confirmação Visual */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-snug">
                {veiculo.marca} {veiculo.modelo}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {veiculo.motorizacao} • Ano {veiculo.anoFabricacao}
              </div>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-[11px] font-bold">
            {veiculo.placa}
          </div>
        </div>

        {/* Mensagem Explicativa de Cascata */}
        <div className="mt-3 p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-[11px] text-slate-300 space-y-2">
          <div className="flex items-start gap-2 text-rose-400 font-semibold leading-tight">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Esta ação é irreversível no banco de dados.</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Todas as <strong className="text-white">{veiculo.despesas.length} despesas</strong>,{' '}
            <strong className="text-white">{veiculo.pecas.length} peças monitoradas</strong> e{' '}
            projetos de <strong className="text-white">{veiculo.stages.length} Stages</strong> vinculados a este carro 
            serão permanentemente excluídos via cascata (<span className="font-mono text-[10px] text-rose-300">ON DELETE CASCADE</span>).
          </p>
        </div>

        {/* Regra de Negócio: Bloqueio do Único Carro */}
        {isUnicoCarro && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Este é o único veículo da sua garagem. Não é permitido excluir o único carro sem antes cadastrar outro para manter a consistência da telemetria.
            </span>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isUnicoCarro}
            onClick={() => onConfirmar(veiculo.id)}
            className="py-2.5 px-3 rounded-xl bg-[#E11D48] hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-rose-950/50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE EDIÇÃO RÁPIDA DE DADOS DO VEÍCULO (PLACA, SPECS, ODÔMETRO)
// ============================================================================
interface ModalEditarVeiculoProps {
  isOpen: boolean;
  veiculo: Veiculo | null;
  onClose: () => void;
  onSalvar: (veiculoId: string, dadosAtualizados: Partial<Veiculo>) => void;
}

export const ModalEditarVeiculo: React.FC<ModalEditarVeiculoProps> = ({
  isOpen,
  veiculo,
  onClose,
  onSalvar,
}) => {
  if (!isOpen || !veiculo) return null;

  const [placa, setPlaca] = useState(veiculo.placa);
  const [motorizacao, setMotorizacao] = useState(veiculo.motorizacao);
  const [kmAtual, setKmAtual] = useState(veiculo.kmAtual.toString());
  const [capacidadeTanque, setCapacidadeTanque] = useState(veiculo.capacidadeTanqueLitros.toString());
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (veiculo) {
      setPlaca(veiculo.placa);
      setMotorizacao(veiculo.motorizacao);
      setKmAtual(veiculo.kmAtual.toString());
      setCapacidadeTanque(veiculo.capacidadeTanqueLitros.toString());
      setErro(null);
    }
  }, [veiculo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kmNum = parseFloat(kmAtual);
    const tanqueNum = parseFloat(capacidadeTanque);

    if (!placa.trim()) {
      setErro('Informe uma placa válida.');
      return;
    }
    if (isNaN(kmNum) || kmNum < 0) {
      setErro('Informe um odômetro válido.');
      return;
    }

    onSalvar(veiculo.id, {
      placa: placa.toUpperCase().trim(),
      motorizacao: motorizacao.trim() || veiculo.motorizacao,
      kmAtual: kmNum,
      capacidadeTanqueLitros: isNaN(tanqueNum) || tanqueNum <= 0 ? 50 : tanqueNum,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-[#121216] border border-slate-800 p-5 shadow-2xl shadow-black/60 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-editar-veiculo-title"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              Administração de Frota
            </span>
            <h2 id="modal-editar-veiculo-title" className="text-base font-black text-white">
              Editar Dados do Veículo
            </h2>
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="text-orange-400 font-bold">{veiculo.marca} {veiculo.modelo}</span>
          <span className="text-slate-500"> • Ano {veiculo.anoFabricacao}</span>
        </div>

        {erro && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Placa (Mercosul / Antiga)
            </label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="Ex: ABC1D23"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm uppercase focus:outline-none focus:border-orange-500"
              maxLength={8}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Motorização / Specs / Apelido
            </label>
            <input
              type="text"
              value={motorizacao}
              onChange={(e) => setMotorizacao(e.target.value)}
              placeholder="Ex: 2.0 TSI EA888 Gen3 • 230cv"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Odômetro Atual (KM)
              </label>
              <input
                type="number"
                value={kmAtual}
                onChange={(e) => setKmAtual(e.target.value)}
                min={0}
                step="any"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Tanque (Litros)
              </label>
              <input
                type="number"
                value={capacidadeTanque}
                onChange={(e) => setCapacidadeTanque(e.target.value)}
                min={10}
                max={150}
                step="0.5"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
