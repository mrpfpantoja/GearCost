import React, { useState, useEffect } from 'react';
import { PlusCircle, Sparkles, Check } from 'lucide-react';
import { PecaMonitorada } from '../../../types/gearcost';

interface ModalNovaPecaProps {
  isOpen: boolean;
  kmAtual: number;
  veiculoId: string;
  onClose: () => void;
  onSalvar: (novaPeca: PecaMonitorada) => void;
  onErrorToast?: (msg: string) => void;
}

export const ModalNovaPeca: React.FC<ModalNovaPecaProps> = ({
  isOpen,
  kmAtual,
  veiculoId,
  onClose,
  onSalvar,
  onErrorToast,
}) => {
  const [tipoNovaPeca, setTipoNovaPeca] = useState<'GENERICO' | 'PNEU'>('GENERICO');
  const [nomeNovaPeca, setNomeNovaPeca] = useState('');
  const [categoriaNovaPeca, setCategoriaNovaPeca] = useState<string>('Oleo & Fluidos');
  const [kmInstalacaoNovaPeca, setKmInstalacaoNovaPeca] = useState('');
  const [vidaUtilNovaPeca, setVidaUtilNovaPeca] = useState('10000');
  const [posicaoPneuNovaPeca, setPosicaoPneuNovaPeca] = useState<
    'Dianteiro Esquerdo' | 'Dianteiro Direito' | 'Traseiro Esquerdo' | 'Traseiro Direito'
  >('Dianteiro Esquerdo');
  const [medidaPneuNovaPeca, setMedidaPneuNovaPeca] = useState('225/45 R17');
  const [dotPneuNovaPeca, setDotPneuNovaPeca] = useState('1026');

  useEffect(() => {
    if (isOpen) {
      setKmInstalacaoNovaPeca(Math.round(kmAtual).toString());
      setNomeNovaPeca('');
      setTipoNovaPeca('GENERICO');
      setCategoriaNovaPeca('Oleo & Fluidos');
      setVidaUtilNovaPeca('10000');
    }
  }, [isOpen, kmAtual]);

  if (!isOpen) return null;

  const handleAplicarPresetPeca = (preset: {
    nome: string;
    categoria: string;
    tipoPeca: 'GENERICO' | 'PNEU';
    vidaUtilKm: number;
    posicao?: any;
    medida?: string;
    dot?: string;
  }) => {
    setNomeNovaPeca(preset.nome);
    setTipoNovaPeca(preset.tipoPeca);
    setCategoriaNovaPeca(preset.categoria);
    setVidaUtilNovaPeca(preset.vidaUtilKm.toString());
    setKmInstalacaoNovaPeca(Math.round(kmAtual).toString());
    if (preset.tipoPeca === 'PNEU') {
      setPosicaoPneuNovaPeca(preset.posicao || 'Dianteiro Esquerdo');
      setMedidaPneuNovaPeca(preset.medida || '225/45 R17');
      setDotPneuNovaPeca(preset.dot || '1026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovaPeca.trim()) {
      if (onErrorToast) onErrorToast('Informe o nome do componente.');
      return;
    }
    const kmInst = parseFloat(kmInstalacaoNovaPeca) || kmAtual;
    const vidaUtil = parseFloat(vidaUtilNovaPeca) || 10000;

    let nova: PecaMonitorada;
    if (tipoNovaPeca === 'PNEU') {
      nova = {
        id: `p_${Date.now()}`,
        veiculoId: veiculoId,
        nome: nomeNovaPeca.trim(),
        tipoPeca: 'PNEU',
        posicao: posicaoPneuNovaPeca,
        medida: medidaPneuNovaPeca.trim() || '225/45 R17',
        dot: dotPneuNovaPeca.trim() || '1026',
        kmInstalacao: kmInst,
        vidaUtilEstimadaKm: vidaUtil,
      };
    } else {
      nova = {
        id: `p_${Date.now()}`,
        veiculoId: veiculoId,
        nome: nomeNovaPeca.trim(),
        tipoPeca: 'GENERICO',
        categoria: categoriaNovaPeca,
        kmInstalacao: kmInst,
        vidaUtilEstimadaKm: vidaUtil,
      };
    }

    onSalvar(nova);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl max-h-[90vh] overflow-y-auto space-y-3.5 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Monitorar Peça ou Fluido
              </h3>
              <span className="text-[10px] text-slate-400">Acompanhar desgaste e período de troca</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Seção 1: Presets Essenciais Prontos (1-Clique) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Peças Essenciais Prontas (1-Clique):
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { nome: 'Óleo Sintético 5W-40 + Filtro', categoria: 'Oleo & Fluidos', tipoPeca: 'GENERICO' as const, vidaUtilKm: 10000, icone: '🛢️', tag: '10.000 KM' },
              { nome: 'Fluido de Freio DOT 5.1', categoria: 'Oleo & Fluidos', tipoPeca: 'GENERICO' as const, vidaUtilKm: 20000, icone: '🛑', tag: '20.000 KM' },
              { nome: 'Pastilhas de Freio Cerâmica', categoria: 'Freios', tipoPeca: 'GENERICO' as const, vidaUtilKm: 30000, icone: '🛑', tag: '30.000 KM' },
              { nome: 'Discos de Freio Ventilados', categoria: 'Freios', tipoPeca: 'GENERICO' as const, vidaUtilKm: 60000, icone: '💿', tag: '60.000 KM' },
              { nome: 'Pneus Dianteiros Esportivos', categoria: 'Pneus', tipoPeca: 'PNEU' as const, vidaUtilKm: 40000, icone: '🛞', tag: '40.000 KM', posicao: 'Dianteiro Esquerdo', medida: '225/45 R17', dot: '1026' },
              { nome: 'Velas de Ignição Laser Iridium', categoria: 'Ignição', tipoPeca: 'GENERICO' as const, vidaUtilKm: 30000, icone: '⚡', tag: '30.000 KM' },
              { nome: 'Filtro de Ar de Alta Vazão', categoria: 'Filtros', tipoPeca: 'GENERICO' as const, vidaUtilKm: 15000, icone: '💨', tag: '15.000 KM' },
              { nome: 'Amortecedores Pressurizados', categoria: 'Suspensão', tipoPeca: 'GENERICO' as const, vidaUtilKm: 60000, icone: '🔩', tag: '60.000 KM' },
            ].map((preset) => (
              <button
                key={preset.nome}
                type="button"
                onClick={() => handleAplicarPresetPeca(preset)}
                className="p-2 rounded-xl bg-[#121214] border border-slate-800 hover:border-orange-500/80 text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{preset.icone}</span>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-orange-300 leading-tight truncate">
                    {preset.nome.split(' ')[0]} {preset.nome.split(' ')[1] || ''}
                  </span>
                </div>
                <span className="text-[9px] text-orange-400 font-mono font-semibold mt-1">
                  {preset.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Seção 2: Formulário Customizado */}
        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs pt-1 border-t border-slate-800/80">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTipoNovaPeca('GENERICO')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] border transition-all cursor-pointer ${
                tipoNovaPeca === 'GENERICO'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-[#121214] text-slate-400 border-slate-800'
              }`}
            >
              Componente / Fluido
            </button>
            <button
              type="button"
              onClick={() => setTipoNovaPeca('PNEU')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] border transition-all cursor-pointer ${
                tipoNovaPeca === 'PNEU'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-[#121214] text-slate-400 border-slate-800'
              }`}
            >
              🛞 Pneu Específico
            </button>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              Nome da Peça ou Fluido *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Óleo Motul 8100 5W-40, Pastilhas Brembo..."
              value={nomeNovaPeca}
              onChange={(e) => setNomeNovaPeca(e.target.value)}
              className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {tipoNovaPeca === 'GENERICO' ? (
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Categoria / Tipo
              </label>
              <select
                value={categoriaNovaPeca}
                onChange={(e) => setCategoriaNovaPeca(e.target.value)}
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
          ) : (
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Posicionamento do Pneu
              </span>
              <div>
                <select
                  value={posicaoPneuNovaPeca}
                  onChange={(e) => setPosicaoPneuNovaPeca(e.target.value as any)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white cursor-pointer"
                >
                  <option value="Dianteiro Esquerdo">Dianteiro Esquerdo (DE)</option>
                  <option value="Dianteiro Direito">Dianteiro Direito (DD)</option>
                  <option value="Traseiro Esquerdo">Traseiro Esquerdo (TE)</option>
                  <option value="Traseiro Direito">Traseiro Direito (TD)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Medida</label>
                  <input
                    type="text"
                    value={medidaPneuNovaPeca}
                    onChange={(e) => setMedidaPneuNovaPeca(e.target.value)}
                    placeholder="225/45 R17"
                    className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">DOT (Semana/Ano)</label>
                  <input
                    type="text"
                    value={dotPneuNovaPeca}
                    onChange={(e) => setDotPneuNovaPeca(e.target.value)}
                    placeholder="1026"
                    className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                KM Instalação
              </label>
              <input
                type="number"
                required
                value={kmInstalacaoNovaPeca}
                onChange={(e) => setKmInstalacaoNovaPeca(e.target.value)}
                placeholder={kmAtual.toString()}
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
                value={vidaUtilNovaPeca}
                onChange={(e) => setVidaUtilNovaPeca(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

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
              Monitorar Peça no SQLite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
