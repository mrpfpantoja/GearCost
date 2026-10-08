import React, { useState, useEffect } from 'react';
import { PlusCircle, Check } from 'lucide-react';
import { Veiculo, TipoDespesa } from '../../../types/gearcost';

interface ModalNovaDespesaProps {
  isOpen: boolean;
  veiculoAtual: Veiculo;
  onClose: () => void;
  onSalvar: (despesa: any) => void;
  onErrorToast?: (msg: string) => void;
}

export const ModalNovaDespesa: React.FC<ModalNovaDespesaProps> = ({
  isOpen,
  veiculoAtual,
  onClose,
  onSalvar,
  onErrorToast,
}) => {
  const [tipoNovaDespesa, setTipoNovaDespesa] = useState<TipoDespesa>('COMBUSTIVEL');
  const [valorNovaDespesa, setValorNovaDespesa] = useState('280.00');
  const [litrosNovaDespesa, setLitrosNovaDespesa] = useState('42.0');
  const [oficinaNovaDespesa, setOficinaNovaDespesa] = useState('PitStop Motorsport & Racing');
  const [tituloNovaDespesa, setTituloNovaDespesa] = useState('');
  const [dataNovaDespesa, setDataNovaDespesa] = useState(() => new Date().toISOString().split('T')[0]);
  const [kmNovaDespesa, setKmNovaDespesa] = useState('');
  const [combustivelTipo, setCombustivelTipo] = useState<'Gasolina Podium/Octapro' | 'Gasolina Comum' | 'Etanol' | 'Diesel S10'>('Gasolina Podium/Octapro');
  const [pecasTrocadasNovaDespesa, setPecasTrocadasNovaDespesa] = useState('Filtro de Óleo Mann, Óleo Motul 5W40');
  const [stageLevelNovaDespesa, setStageLevelNovaDespesa] = useState<1 | 2 | 3>(2);

  useEffect(() => {
    if (isOpen) {
      setKmNovaDespesa(Math.round(veiculoAtual.kmAtual).toString());
      setDataNovaDespesa(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, veiculoAtual.kmAtual]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpo = (valorNovaDespesa || '').toString().trim().replace(/\./g, '').replace(',', '.');
    const valor = parseFloat(limpo);
    if (isNaN(valor) || valor <= 0) {
      if (onErrorToast) {
        onErrorToast('Por favor, informe um valor monetário válido maior que zero.');
      }
      return;
    }

    const km = parseFloat((kmNovaDespesa || '').toString().trim().replace(/\./g, '').replace(',', '.')) || veiculoAtual.kmAtual;
    const dataIso = dataNovaDespesa || new Date().toISOString().split('T')[0];

    const tituloPadrao =
      tipoNovaDespesa === 'COMBUSTIVEL'
        ? `Abastecimento ${combustivelTipo}`
        : tipoNovaDespesa === 'MANUTENCAO'
        ? `Manutenção • ${oficinaNovaDespesa.trim() || 'Oficina Mecânica Especializada'}`
        : tipoNovaDespesa === 'UPGRADE_STAGE'
        ? `Upgrade Stage ${stageLevelNovaDespesa}`
        : tipoNovaDespesa === 'IMPOSTO_SEGURO'
        ? 'IPVA / Seguro Anual'
        : 'Estética & Lavagem Detalhada';

    const tituloFinal = tituloNovaDespesa.trim() || tituloPadrao;

    let nova: any = {
      id: `d_${Date.now()}`,
      veiculoId: veiculoAtual.id,
      data: dataIso,
      valor: valor,
      kmRegistro: km,
      tipo: tipoNovaDespesa,
      observacoes: tituloFinal,
    };

    if (tipoNovaDespesa === 'COMBUSTIVEL') {
      const litros = parseFloat((litrosNovaDespesa || '').toString().trim().replace(/\./g, '').replace(',', '.')) || 40.0;
      nova = {
        ...nova,
        litros: litros,
        precoPorLitro: valor / (litros || 1),
        tipoCombustivel: combustivelTipo,
      };
    } else if (tipoNovaDespesa === 'MANUTENCAO') {
      nova = {
        ...nova,
        oficina: oficinaNovaDespesa.trim() || 'Oficina Mecânica Especializada',
        pecasTrocadas: pecasTrocadasNovaDespesa.split(',').map((p) => p.trim()).filter(Boolean),
        garantiaDias: 90,
      };
    }

    onSalvar(nova);
    setTituloNovaDespesa('');
    setValorNovaDespesa('280.00');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#1E1E24] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl max-h-[88vh] overflow-y-auto space-y-3.5 animate-in slide-in-from-bottom duration-200">
        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-[#EA580C]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Registrar Despesa</h3>
              <span className="text-[10px] text-slate-400">Garagem GearCost • SQLite Local</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Seletor do Tipo / Categoria de Despesa */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tipo de Lançamento
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { key: 'COMBUSTIVEL', label: '⛽ Combustível' },
              { key: 'MANUTENCAO', label: '🔧 Manutenção' },
              { key: 'UPGRADE_STAGE', label: '⚡ Upgrade' },
              { key: 'IMPOSTO_SEGURO', label: '📋 Imposto' },
              { key: 'ESTETICA', label: '✨ Estética' },
            ].map((tipo) => {
              const isSel = tipoNovaDespesa === tipo.key;
              return (
                <button
                  key={tipo.key}
                  type="button"
                  onClick={() => setTipoNovaDespesa(tipo.key as TipoDespesa)}
                  className={`py-2 px-1.5 rounded-xl font-bold text-[11px] border transition-all text-center cursor-pointer ${
                    isSel
                      ? 'bg-[#EA580C]/20 border-[#EA580C] text-[#EA580C] shadow-sm'
                      : 'bg-[#121214] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tipo.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulário com Campos Polimórficos */}
        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          {/* Título / Descrição */}
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              Descrição do Gasto (opcional)
            </label>
            <input
              type="text"
              value={tituloNovaDespesa}
              onChange={(e) => setTituloNovaDespesa(e.target.value)}
              placeholder={
                tipoNovaDespesa === 'COMBUSTIVEL'
                  ? 'ex: Posto Shell • Tanque Cheio'
                  : tipoNovaDespesa === 'MANUTENCAO'
                  ? 'ex: Troca de Óleo Motul + Filtros'
                  : tipoNovaDespesa === 'UPGRADE_STAGE'
                  ? 'ex: Remap Stage 2 + Downpipe'
                  : 'ex: IPVA 2026 cota única'
              }
              className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Valor Total (R$) e KM Odômetro */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Valor Total (R$) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                required
                placeholder="280.00"
                value={valorNovaDespesa}
                onChange={(e) => setValorNovaDespesa(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                KM no Odômetro
              </label>
              <input
                type="number"
                value={kmNovaDespesa}
                onChange={(e) => setKmNovaDespesa(e.target.value)}
                placeholder={veiculoAtual.kmAtual.toString()}
                className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Atalhos de Valores Rápidos */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-medium">Valores Rápidos:</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {(tipoNovaDespesa === 'COMBUSTIVEL'
                ? ['100.00', '180.00', '280.00', '350.00']
                : tipoNovaDespesa === 'MANUTENCAO'
                ? ['250.00', '480.00', '890.00', '1500.00']
                : ['150.00', '300.00', '650.00', '1200.00']
              ).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValorNovaDespesa(val)}
                  className="px-2.5 py-1 rounded-lg bg-[#121214] border border-slate-800 hover:border-[#EA580C] text-[10px] text-slate-300 font-mono transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  R$ {parseFloat(val).toFixed(2)}
                </button>
              ))}
            </div>
          </div>

          {/* Data do Lançamento */}
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-1">
              Data da Despesa
            </label>
            <input
              type="date"
              value={dataNovaDespesa}
              onChange={(e) => setDataNovaDespesa(e.target.value)}
              className="w-full bg-[#121214] border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* CAMPOS ESPECÍFICOS DE COMBUSTÍVEL */}
          {tipoNovaDespesa === 'COMBUSTIVEL' && (
            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Telemetria de Abastecimento
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Litros Abastecidos</label>
                  <input
                    type="number"
                    step="0.1"
                    value={litrosNovaDespesa}
                    onChange={(e) => setLitrosNovaDespesa(e.target.value)}
                    className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Preço/Litro Calculado</label>
                  <div className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-cyan-300 font-mono font-bold">
                    R${' '}
                    {(
                      (parseFloat(valorNovaDespesa) || 0) /
                      (parseFloat(litrosNovaDespesa) || 1)
                    ).toFixed(2)}
                    /L
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tipo de Combustível</label>
                <select
                  value={combustivelTipo}
                  onChange={(e) => setCombustivelTipo(e.target.value as any)}
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white text-xs"
                >
                  <option value="Gasolina Podium/Octapro">Gasolina Podium / Octapro (Alta Octanagem)</option>
                  <option value="Gasolina Comum">Gasolina Comum / Aditivada</option>
                  <option value="Etanol">Etanol Hidratado</option>
                  <option value="Diesel S10">Diesel S10</option>
                </select>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS DE MANUTENÇÃO */}
          {tipoNovaDespesa === 'MANUTENCAO' && (
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Dados da Oficina e Manutenção
              </span>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Oficina Mecânica / Preparador
                </label>
                <input
                  type="text"
                  value={oficinaNovaDespesa}
                  onChange={(e) => setOficinaNovaDespesa(e.target.value)}
                  placeholder="ex: PitStop Motorsport"
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Peças Trocadas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={pecasTrocadasNovaDespesa}
                  onChange={(e) => setPecasTrocadasNovaDespesa(e.target.value)}
                  placeholder="ex: Pastilhas Brembo, Fluido DOT 5.1"
                  className="w-full bg-[#121214] border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS DE UPGRADE */}
          {tipoNovaDespesa === 'UPGRADE_STAGE' && (
            <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-500/20 space-y-2">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Classificação do Projeto / Stage
              </span>
              <div className="flex gap-2">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStageLevelNovaDespesa(lvl as any)}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs border cursor-pointer ${
                      stageLevelNovaDespesa === lvl
                        ? 'bg-[#EA580C] text-white border-[#EA580C]'
                        : 'bg-[#121214] text-slate-400 border-slate-800'
                    }`}
                  >
                    Stage {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botões de Ação do Modal */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="col-span-2 py-3 rounded-xl bg-[#EA580C] hover:bg-orange-600 active:scale-[0.99] font-bold text-white text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Salvar Despesa (SQLite)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
