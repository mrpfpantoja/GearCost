import React, { useState } from 'react';
import { 
  DollarSign, 
  Sliders, 
  PlusCircle, 
  Gauge, 
  Calendar, 
  Trash2 
} from 'lucide-react';
import { Veiculo } from '../../../types/gearcost';
import { ModalFiltrosFinanceiro } from '../modals/ModalFiltrosFinanceiro';

interface FinanceiroTabProps {
  veiculoAtual: Veiculo;
  onOpenNovaDespesa: () => void;
  onSolicitarExcluirDespesa: (despesa: any) => void;
}

export const FinanceiroTab: React.FC<FinanceiroTabProps> = ({
  veiculoAtual,
  onOpenNovaDespesa,
  onSolicitarExcluirDespesa,
}) => {
  const [buscaFinanceiro, setBuscaFinanceiro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODOS');
  const [filtroPeriodoStart, setFiltroPeriodoStart] = useState<string>('');
  const [filtroPeriodoEnd, setFiltroPeriodoEnd] = useState<string>('');
  const [kmMinFiltro, setKmMinFiltro] = useState<string>('');
  const [kmMaxFiltro, setKmMaxFiltro] = useState<string>('');
  const [showModalFiltrosAvancados, setShowModalFiltrosAvancados] = useState(false);

  const getCategoriaDespesa = (d: any): string => {
    if (d.tipo === 'COMBUSTIVEL') return 'COMBUSTIVEL';
    const obs = (d.observacoes || '').toLowerCase();
    const pecas = ((d.pecasTrocadas || []) as string[]).join(' ').toLowerCase();
    if (obs.includes('óleo') || pecas.includes('óleo') || obs.includes('oleo') || pecas.includes('oleo')) return 'OLEO';
    if (obs.includes('pneu') || pecas.includes('pneu')) return 'PNEUS';
    if (d.tipo === 'UPGRADE_STAGE' || obs.includes('downpipe') || obs.includes('remap') || obs.includes('stage')) return 'STAGE';
    return 'MANUTENCAO';
  };

  const registrosFiltrados = veiculoAtual.despesas.filter((d) => {
    const cat = getCategoriaDespesa(d);
    const textoBusca = buscaFinanceiro.toLowerCase();
    const obs = (d.observacoes || '').toLowerCase();
    const oficina = ((d as any).oficina || '').toLowerCase();
    const pecas = (((d as any).pecasTrocadas || []) as string[]).join(' ').toLowerCase();

    const combinaTexto =
      !textoBusca ||
      obs.includes(textoBusca) ||
      oficina.includes(textoBusca) ||
      pecas.includes(textoBusca) ||
      d.tipo.toLowerCase().includes(textoBusca);

    const combinaCategoria = categoriaFiltro === 'TODOS' || cat === categoriaFiltro;

    const dData = new Date(d.data);
    const combinaDataStart = !filtroPeriodoStart || dData >= new Date(filtroPeriodoStart);
    const combinaDataEnd = !filtroPeriodoEnd || dData <= new Date(filtroPeriodoEnd);

    const kmMin = kmMinFiltro ? parseFloat(kmMinFiltro) : null;
    const kmMax = kmMaxFiltro ? parseFloat(kmMaxFiltro) : null;
    const combinaKmMin = kmMin === null || isNaN(kmMin) || d.kmRegistro >= kmMin;
    const combinaKmMax = kmMax === null || isNaN(kmMax) || d.kmRegistro <= kmMax;

    return combinaTexto && combinaCategoria && combinaDataStart && combinaDataEnd && combinaKmMin && combinaKmMax;
  });

  const totalFiltrado = registrosFiltrados.reduce((acc, d) => acc + d.valor, 0);
  const temFiltroAvancadoAtivo = Boolean(filtroPeriodoStart || filtroPeriodoEnd || kmMinFiltro || kmMaxFiltro);

  const limparTodosFiltros = () => {
    setBuscaFinanceiro('');
    setCategoriaFiltro('TODOS');
    setFiltroPeriodoStart('');
    setFiltroPeriodoEnd('');
    setKmMinFiltro('');
    setKmMaxFiltro('');
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Header da Barra de Ações com Título & Botão de Filtro Avançado */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#EA580C]" />
            Histórico Financeiro
          </h3>
          <p className="text-[10px] text-slate-400">Extrato detalhado de despesas</p>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Botão Filtros Avançados */}
          <button
            onClick={() => setShowModalFiltrosAvancados(true)}
            className="relative p-2 rounded-xl bg-[#1E1E24] hover:bg-[#282830] text-slate-200 transition-all border border-slate-800 cursor-pointer"
            title="Filtros de Pesquisa Avançados"
          >
            <Sliders className="w-4 h-4 text-[#EA580C]" />
            {temFiltroAvancadoAtivo && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#EA580C] rounded-full ring-2 ring-slate-950"></span>
            )}
          </button>
          {/* Botão Nova Despesa */}
          <button
            onClick={onOpenNovaDespesa}
            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            title="Registrar nova despesa"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* 1. Campo de Busca em Tempo Real */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-[#EA580C] text-sm">🔍</span>
        </div>
        <input
          type="text"
          value={buscaFinanceiro}
          onChange={(e) => setBuscaFinanceiro(e.target.value)}
          placeholder="Buscar serviço, peça, oficina..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#1E1E24] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#EA580C]"
        />
        {buscaFinanceiro && (
          <button
            onClick={() => setBuscaFinanceiro('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Chips de Categorias Rápidas */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 flex gap-1.5 custom-scrollbar">
        {[
          { key: 'TODOS', label: 'Todos' },
          { key: 'OLEO', label: 'Troca de Óleo' },
          { key: 'PNEUS', label: 'Pneus' },
          { key: 'COMBUSTIVEL', label: 'Combustível' },
          { key: 'MANUTENCAO', label: 'Manutenção' },
          { key: 'STAGE', label: 'Stages & Upgrades' },
        ].map((chip) => {
          const isSelected = categoriaFiltro === chip.key;
          return (
            <button
              key={chip.key}
              onClick={() => setCategoriaFiltro(chip.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#EA580C]/20 border-[#EA580C] text-[#EA580C] font-bold shadow-xs'
                  : 'bg-[#1E1E24] border-[#282830] text-[#94A3B8] hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* 3. Resumo da Consulta Atual */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[11px] text-[#94A3B8]">
          {registrosFiltrados.length} registro(s) encontrado(s)
        </span>
        <span className="text-xs font-bold text-[#EA580C] font-mono">
          Total: R$ {totalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* 4. Listagem Detalhada Cronológica */}
      <div className="space-y-2.5">
        {registrosFiltrados.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">Nenhum registro encontrado para este filtro.</p>
            <button
              onClick={onOpenNovaDespesa}
              className="mt-3 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>+ Registrar Nova Despesa</span>
            </button>
            {temFiltroAvancadoAtivo && (
              <div className="mt-2">
                <button
                  onClick={limparTodosFiltros}
                  className="text-xs text-[#EA580C] underline font-semibold cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        ) : (
          registrosFiltrados.map((item) => {
            const cat = getCategoriaDespesa(item);

            const configCat: Record<string, { bg: string; color: string; label: string; icon: string }> = {
              OLEO: { bg: 'bg-amber-500/15', color: 'text-amber-400', label: 'Troca de Óleo', icon: '🛢️' },
              PNEUS: { bg: 'bg-cyan-500/15', color: 'text-cyan-400', label: 'Pneus', icon: '🛞' },
              COMBUSTIVEL: { bg: 'bg-emerald-500/15', color: 'text-emerald-400', label: 'Combustível', icon: '⛽' },
              STAGE: { bg: 'bg-[#EA580C]/15', color: 'text-[#EA580C]', label: 'Stage & Upgrade', icon: '⚡' },
              MANUTENCAO: { bg: 'bg-blue-500/15', color: 'text-blue-400', label: 'Manutenção', icon: '🔧' },
            };
            const currentCfg = configCat[cat] || configCat.MANUTENCAO;

            const tituloExibicao =
              (item as any).observacoes ||
              (item.tipo === 'COMBUSTIVEL'
                ? `Abastecimento ${(item as any).tipoCombustivel || 'Gasolina'}`
                : item.tipo === 'MANUTENCAO'
                ? `Revisão ${(item as any).oficina || ''}`
                : item.tipo === 'UPGRADE_STAGE'
                ? 'Modificação de Performance'
                : 'Despesa Automotiva');

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#18181C] border border-[#282830] text-xs transition-all hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  {/* Ícone Contextual por Categoria */}
                  <div
                    className={`w-9 h-9 rounded-xl ${currentCfg.bg} flex items-center justify-center shrink-0 text-base`}
                  >
                    {currentCfg.icon}
                  </div>

                  {/* Detalhes Centrais */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs leading-tight truncate">
                      {tituloExibicao}
                    </h4>

                    {(item as any).oficina && (
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                        Oficina: {(item as any).oficina}
                      </p>
                    )}

                    {(item as any).pecasTrocadas && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        Peças: {(item as any).pecasTrocadas.join(', ')}
                      </p>
                    )}

                    {item.tipo === 'COMBUSTIVEL' && (item as any).litros && (
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        {(item as any).litros} Litros @ R${' '}
                        {(item as any).precoPorLitro?.toFixed(2)}/L
                      </p>
                    )}

                    {/* Metadados: KM e Data */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#94A3B8]">
                      <span className="flex items-center gap-1 font-mono">
                        <Gauge className="w-3 h-3 text-[#64748B]" />
                        {item.kmRegistro.toLocaleString('pt-BR')} KM
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#64748B]" />
                        {item.data.split('-').reverse().join('/')}
                      </span>
                    </div>
                  </div>

                  {/* Valor Formatado e Botão de Excluir */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-sm font-bold text-white font-mono">
                      R$ {item.valor.toFixed(2)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSolicitarExcluirDespesa(item);
                      }}
                      className="mt-2 px-2 py-1 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition-all flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
                      title="Excluir este lançamento financeiro"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Filtros Avançados */}
      <ModalFiltrosFinanceiro
        isOpen={showModalFiltrosAvancados}
        onClose={() => setShowModalFiltrosAvancados(false)}
        filtroPeriodoStart={filtroPeriodoStart}
        setFiltroPeriodoStart={setFiltroPeriodoStart}
        filtroPeriodoEnd={filtroPeriodoEnd}
        setFiltroPeriodoEnd={setFiltroPeriodoEnd}
        kmMinFiltro={kmMinFiltro}
        setKmMinFiltro={setKmMinFiltro}
        kmMaxFiltro={kmMaxFiltro}
        setKmMaxFiltro={setKmMaxFiltro}
        onLimpar={() => {
          setFiltroPeriodoStart('');
          setFiltroPeriodoEnd('');
          setKmMinFiltro('');
          setKmMaxFiltro('');
        }}
      />
    </div>
  );
};
