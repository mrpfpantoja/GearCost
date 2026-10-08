import React, { useState } from 'react';
import { 
  Gauge, 
  Sparkles, 
  PlusCircle, 
  Trash2, 
  Pencil, 
  RotateCcw 
} from 'lucide-react';
import { Veiculo, PecaMonitorada, ComponenteGenerico, Pneu } from '../../../types/gearcost';
import { calcularDesgastePeca, precisaSubstituicao } from '../../../data/mockData';

interface TelemetriaTabProps {
  veiculoAtual: Veiculo;
  onResetPeca: (veiculoId: string, pecaId: string) => void;
  onOpenNovaPeca: () => void;
  onOpenPecasEssenciais: () => void;
  onEditarPeca: (peca: PecaMonitorada) => void;
  onExcluirPeca: (peca: PecaMonitorada) => void;
}

export const TelemetriaTab: React.FC<TelemetriaTabProps> = ({
  veiculoAtual,
  onResetPeca,
  onOpenNovaPeca,
  onOpenPecasEssenciais,
  onEditarPeca,
  onExcluirPeca,
}) => {
  const [buscaTelemetria, setBuscaTelemetria] = useState('');
  const [filtroCategoriaPeca, setFiltroCategoriaPeca] = useState<string>('TODOS');

  const getCategoriaPeca = (
    peca: PecaMonitorada
  ): 'OLEO_FLUIDOS' | 'FREIOS' | 'PNEUS' | 'FILTROS' | 'IGNICAO' | 'SUSPENSAO' | 'OUTROS' => {
    if (peca.tipoPeca === 'PNEU') return 'PNEUS';
    const cat = ((peca as ComponenteGenerico).categoria || '').toLowerCase();
    const nome = (peca.nome || '').toLowerCase();

    // 1. Pastilhas e Discos de Freio
    if (
      nome.includes('pastilha') ||
      nome.includes('disco') ||
      (cat.includes('freio') && !nome.includes('fluido') && !nome.includes('dot') && !nome.includes('óleo')) ||
      (nome.includes('freio') && !nome.includes('fluido') && !nome.includes('dot') && !nome.includes('óleo'))
    ) {
      return 'FREIOS';
    }

    // 2. Óleo do motor, fluído de freio, líquido de arrefecimento e fluidos de câmbio
    if (
      cat.includes('fluido') ||
      cat.includes('óleo') ||
      cat.includes('oleo') ||
      nome.includes('óleo') ||
      nome.includes('oleo') ||
      nome.includes('fluido') ||
      nome.includes('motul') ||
      nome.includes('arrefecimento') ||
      nome.includes('dot') ||
      nome.includes('lubrificante') ||
      cat.includes('transmissão') ||
      cat.includes('transmissao')
    ) {
      return 'OLEO_FLUIDOS';
    }

    // 3. Filtros
    if (
      cat.includes('filtro') ||
      nome.includes('filtro') ||
      nome.includes('mann') ||
      nome.includes('intake') ||
      nome.includes('k&n')
    ) {
      return 'FILTROS';
    }

    // 4. Ignição e Correias
    if (
      cat.includes('ignição') ||
      cat.includes('ignicao') ||
      nome.includes('vela') ||
      nome.includes('bobina') ||
      nome.includes('iridium') ||
      cat.includes('correia') ||
      nome.includes('correia')
    ) {
      return 'IGNICAO';
    }

    // 5. Suspensão
    if (
      cat.includes('suspensão') ||
      cat.includes('suspensao') ||
      nome.includes('amortecedor') ||
      nome.includes('mola') ||
      nome.includes('coilovers') ||
      nome.includes('bucha')
    ) {
      return 'SUSPENSAO';
    }

    return 'OUTROS';
  };

  const pecasFiltradas = veiculoAtual.pecas.filter((peca) => {
    const catPeca = getCategoriaPeca(peca);
    const bateCategoria = filtroCategoriaPeca === 'TODOS' || catPeca === filtroCategoriaPeca;
    const texto = buscaTelemetria.toLowerCase().trim();
    const bateBusca =
      !texto ||
      peca.nome.toLowerCase().includes(texto) ||
      (peca.tipoPeca === 'GENERICO' &&
        (peca as ComponenteGenerico).categoria.toLowerCase().includes(texto)) ||
      (peca.tipoPeca === 'PNEU' &&
        ((peca as Pneu).posicao.toLowerCase().includes(texto) ||
          (peca as Pneu).medida.toLowerCase().includes(texto)));
    return bateCategoria && bateBusca;
  });

  const countOleo = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'OLEO_FLUIDOS').length;
  const countFreios = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'FREIOS').length;
  const countPneus = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'PNEUS').length;
  const countFiltros = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'FILTROS').length;
  const countIgnicao = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'IGNICAO').length;
  const countSuspensao = veiculoAtual.pecas.filter((p) => getCategoriaPeca(p) === 'SUSPENSAO').length;

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* Header da Aba com Odômetro e Botões de Adição */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-orange-400" />
            Telemetria de Desgaste
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Painel:{' '}
            <span className="font-mono text-orange-400 font-bold">
              {veiculoAtual.kmAtual.toLocaleString('pt-BR')} KM
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPecasEssenciais}
            className="px-2.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            title="Catálogo de Peças Essenciais (Óleo, Freios, Pneus, Fluidos...)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Essenciais</span>
          </button>
          <button
            onClick={onOpenNovaPeca}
            className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-[11px] flex items-center gap-1 border border-slate-700/80 transition-all cursor-pointer"
            title="Adicionar componente personalizado"
          >
            <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
            <span>Nova</span>
          </button>
        </div>
      </div>

      {/* Banner Hero: Adicionar Peças Essenciais em 1-Clique */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 via-slate-900/90 to-slate-900 border border-orange-500/30 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/40">
            <Sparkles className="w-4 h-4 text-orange-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="truncate">Peças & Fluidos Essenciais</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono shrink-0">
                1-Clique
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Óleo do motor, pastilha de freio, pneus, fluidos e velas
            </p>
          </div>
        </div>
        <button
          onClick={onOpenPecasEssenciais}
          className="px-2.5 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-white border border-orange-500/40 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
        >
          Ver Catálogo
        </button>
      </div>

      {/* 1. Campo de Busca em Tempo Real da Telemetria */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-orange-400 text-xs">🔍</span>
        </div>
        <input
          type="text"
          value={buscaTelemetria}
          onChange={(e) => setBuscaTelemetria(e.target.value)}
          placeholder="Buscar peça, óleo, freio, pneu..."
          className="w-full pl-8 pr-8 py-2 rounded-xl bg-[#1E1E24] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
        />
        {buscaTelemetria && (
          <button
            onClick={() => setBuscaTelemetria('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Chips de Categorização e Tipos de Peças/Fluidos */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 flex gap-1.5 custom-scrollbar">
        {[
          { key: 'TODOS', label: `Todos (${veiculoAtual.pecas.length})`, icon: '⚡' },
          { key: 'OLEO_FLUIDOS', label: `Óleo & Fluidos (${countOleo})`, icon: '🛢️' },
          { key: 'FREIOS', label: `Pastilhas & Freios (${countFreios})`, icon: '🛑' },
          { key: 'PNEUS', label: `Pneus & Rodas (${countPneus})`, icon: '🛞' },
          { key: 'FILTROS', label: `Filtros (${countFiltros})`, icon: '💨' },
          { key: 'IGNICAO', label: `Motor & Ignição (${countIgnicao})`, icon: '⚡' },
          { key: 'SUSPENSAO', label: `Suspensão (${countSuspensao})`, icon: '🔩' },
        ].map((chip) => {
          const isSelected = filtroCategoriaPeca === chip.key;
          return (
            <button
              key={chip.key}
              onClick={() => setFiltroCategoriaPeca(chip.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border shrink-0 flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold shadow-xs'
                  : 'bg-[#1E1E24] border-[#282830] text-slate-400 hover:text-white'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Lista de Peças Monitoradas */}
      <div className="space-y-3">
        {pecasFiltradas.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Nenhum componente nesta categoria</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Acompanhe o desgaste e período de troca adicionando peças essenciais.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={onOpenPecasEssenciais}
                className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Peças Essenciais</span>
              </button>
              <button
                onClick={onOpenNovaPeca}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-700/80 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                <span>Personalizada</span>
              </button>
            </div>
          </div>
        ) : (
          pecasFiltradas.map((peca) => {
            const desgaste = calcularDesgastePeca(
              veiculoAtual.kmAtual,
              peca.kmInstalacao,
              peca.vidaUtilEstimadaKm
            );
            const isCritico = precisaSubstituicao(desgaste);
            const kmRodados = Math.max(0, veiculoAtual.kmAtual - peca.kmInstalacao);
            const catPeca = getCategoriaPeca(peca);

            const configCat: Record<string, { label: string; icon: string; badgeColor: string }> = {
              OLEO_FLUIDOS: {
                label: 'Óleo & Fluidos',
                icon: '🛢️',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              },
              FREIOS: {
                label: 'Freios',
                icon: '🛑',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
              },
              PNEUS: {
                label: 'Pneu',
                icon: '🛞',
                badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
              },
              FILTROS: {
                label: 'Filtro',
                icon: '💨',
                badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
              },
              IGNICAO: {
                label: 'Ignição',
                icon: '⚡',
                badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
              },
              SUSPENSAO: {
                label: 'Suspensão',
                icon: '🔩',
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
              },
              OUTROS: {
                label: 'Componente',
                icon: '🔧',
                badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600',
              },
            };
            const curCfg = configCat[catPeca] || configCat.OUTROS;

            return (
              <div
                key={peca.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCritico
                    ? 'bg-rose-950/25 border-rose-500/50 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                    : desgaste > 70
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Topo do Card: Categoria, Nome e Percentual */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${curCfg.badgeColor}`}
                      >
                        <span>{curCfg.icon}</span>
                        <span>
                          {peca.tipoPeca === 'PNEU'
                            ? (peca as Pneu).posicao
                            : (peca as ComponenteGenerico).categoria || curCfg.label}
                        </span>
                      </span>
                      {isCritico && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                          TROCA IMEDIATA
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1 leading-tight">{peca.nome}</h4>
                    {peca.tipoPeca === 'PNEU' && (
                      <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                        Medida: {(peca as Pneu).medida} • DOT: {(peca as Pneu).dot}
                      </div>
                    )}
                  </div>

                  {/* Percentual de Desgaste */}
                  <div className="text-right shrink-0">
                    <div
                      className={`text-base font-black font-mono ${
                        isCritico
                          ? 'text-rose-400'
                          : desgaste > 70
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {desgaste.toFixed(1)}%
                    </div>
                    <div className="text-[9px] text-slate-400">de desgaste</div>
                  </div>
                </div>

                {/* Barra de Progresso de Desgaste */}
                <div className="mt-2.5">
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritico
                          ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                          : desgaste > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, desgaste)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span>Instalado: {peca.kmInstalacao.toLocaleString('pt-BR')} KM</span>
                    <span>
                      Rodou: {kmRodados.toLocaleString('pt-BR')} /{' '}
                      {peca.vidaUtilEstimadaKm.toLocaleString('pt-BR')} KM
                    </span>
                  </div>
                </div>

                {/* Barra de Ações: Editar, Substituir e Excluir */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <button
                    onClick={() => onExcluirPeca(peca)}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer active:scale-95"
                    title="Remover monitoramento desta peça"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                    <span>Excluir</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditarPeca(peca)}
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer active:scale-95"
                      title="Editar especificações e vida útil da peça"
                    >
                      <Pencil className="w-3 h-3 text-amber-400" />
                      <span>Editar</span>
                    </button>

                    <button
                      onClick={() => onResetPeca(veiculoAtual.id, peca.id)}
                      className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 transition-all cursor-pointer active:scale-95"
                      title="Registrar troca da peça e zerar desgaste para o KM atual"
                    >
                      <RotateCcw className="w-3 h-3 text-orange-400" />
                      <span>Substituir (Zerar)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
