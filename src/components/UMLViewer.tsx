import React, { useState } from 'react';
import { Layers, Box, Cpu, Wrench, ShieldAlert, Sparkles, ChevronRight, Activity } from 'lucide-react';

export const UMLViewer: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [activeClassDetail, setActiveClassDetail] = useState<string | null>('Veiculo');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-100 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Diagrama UML de Classes & Arquitetura de Domínio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Espelho fidedigno das especificações e diagramas UML fornecidos (Herança, Polimorfismo e Agregação Raiz)
          </p>
        </div>

        {/* Filtro por Módulo */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs">
          {[
            { id: 'all', label: 'Visão Completa' },
            { id: 'garagem', label: 'A. Garagem & Catálogo' },
            { id: 'financeiro', label: 'B. Módulo Financeiro' },
            { id: 'telemetria', label: 'C. Telemetria de Peças' },
            { id: 'stages', label: 'D. Stages & Upgrades' },
            { id: 'revisoes', label: 'E. Revisões Futuras' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedModule(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedModule === tab.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Classes UML Estilo Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        
        {/* ENUMS */}
        {(selectedModule === 'all' || selectedModule === 'financeiro' || selectedModule === 'stages') && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 relative overflow-hidden">
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                &laquo;enumeration&raquo;
              </div>
              <h3 className="text-sm font-bold text-cyan-200 mt-0.5">TipoDespesa</h3>
              <div className="mt-2.5 pt-2 border-t border-cyan-500/20 space-y-1 text-xs font-mono text-cyan-300">
                <div>• COMBUSTIVEL</div>
                <div>• MANUTENCAO</div>
                <div>• IMPOSTO_SEGURO</div>
                <div>• ESTETICA</div>
                <div>• UPGRADE_STAGE</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 relative overflow-hidden">
              <div className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-semibold">
                &laquo;enumeration&raquo;
              </div>
              <h3 className="text-sm font-bold text-purple-200 mt-0.5">StatusStage</h3>
              <div className="mt-2.5 pt-2 border-t border-purple-500/20 space-y-1 text-xs font-mono text-purple-300">
                <div>• PLANEJADO</div>
                <div>• COMPRADO</div>
                <div>• INSTALADO</div>
              </div>
            </div>
          </div>
        )}

        {/* CATÁLOGO: MARCA & MODELO CARRO */}
        {(selectedModule === 'all' || selectedModule === 'garagem') && (
          <div className="space-y-4">
            {/* MARCA */}
            <div 
              onClick={() => setActiveClassDetail('Marca')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'Marca' ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400' : 'border-amber-500/30 bg-amber-950/15 hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400">Classe Domínio</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Composição 1..*</span>
              </div>
              <h3 className="text-base font-bold text-amber-200 mt-1">Marca</h3>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- int id</div>
                <div>- String nome</div>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-amber-300/80 space-y-0.5">
                <div>+ getId(): int</div>
                <div>+ getNome(): String</div>
              </div>
            </div>

            {/* MODELO CARRO */}
            <div 
              onClick={() => setActiveClassDetail('ModeloCarro')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'ModeloCarro' ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400' : 'border-amber-500/30 bg-amber-950/15 hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400">Classe Domínio</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Referência Modelo</span>
              </div>
              <h3 className="text-base font-bold text-amber-200 mt-1">ModeloCarro</h3>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- int id</div>
                <div>- String nome</div>
                <div>- String motorizacaoPadrao</div>
                <div>- double capacidadeTanqueLitros</div>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-amber-300/80 space-y-0.5">
                <div>+ getNome(): String</div>
                <div>+ getMotorizacaoPadrao(): String</div>
                <div>+ getCapacidadeTanqueLitros(): double</div>
              </div>
            </div>
          </div>
        )}

        {/* AGREGADOR RAIZ: VEÍCULO */}
        {(selectedModule === 'all' || selectedModule === 'garagem') && (
          <div 
            onClick={() => setActiveClassDetail('Veiculo')}
            className={`p-5 rounded-xl border xl:col-span-1 transition-all cursor-pointer ${
              activeClassDetail === 'Veiculo' ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400' : 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                Agregador Raiz (Root Aggregate)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">1 : N Collections</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-200 mt-1 flex items-center gap-1.5">
              <span>Veiculo</span>
              <span className="text-xs font-normal text-emerald-400/80">(Core Entity)</span>
            </h3>

            <div className="mt-3 pt-2.5 border-t border-emerald-500/20 text-xs font-mono text-slate-300 space-y-1">
              <div>- String id</div>
              <div>- String placa (UNIQUE)</div>
              <div>- int anoFabricacao</div>
              <div>- double quilometragemAtual</div>
              <div>- String motorizacao</div>
              <div>- ModeloCarro modelo</div>
              <div className="text-emerald-400/90 font-semibold pt-1">Coleções associadas:</div>
              <div className="pl-2 border-l border-emerald-500/30 text-[11px] text-slate-400">
                <div>• despesas: List&lt;Despesa&gt;</div>
                <div>• pecas: List&lt;PecaMonitorada&gt;</div>
                <div>• stages: List&lt;ItemStage&gt;</div>
                <div>• manutencoesFuturas: List&lt;ManutencaoProgramada&gt;</div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-500/20 text-xs font-mono text-emerald-300/90 space-y-1">
              <div className="font-semibold text-emerald-200">Métodos e Regras de Negócio:</div>
              <div>+ atualizarQuilometragem(novoKm: double): void</div>
              <div>+ registrarDespesa(d: Despesa): void</div>
              <div>+ adicionarPeca(p: PecaMonitorada): void</div>
              <div>+ agendarManutencao(m: ManutencaoProgramada): void</div>
              <div>+ planejarItemStage(item: ItemStage): void</div>
              <div>+ calcularCustoTotal(): double <span className="text-slate-400 text-[10px]">(Somatório)</span></div>
              <div>+ calcularCustoPorKm(): double <span className="text-slate-400 text-[10px]">(Total / ΔKM)</span></div>
            </div>
          </div>
        )}

        {/* HERANÇA E POLIMORFISMO: DESPESA */}
        {(selectedModule === 'all' || selectedModule === 'financeiro') && (
          <div className="space-y-4 xl:col-span-1">
            <div 
              onClick={() => setActiveClassDetail('Despesa')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'Despesa' ? 'border-blue-400 bg-blue-950/30 ring-1 ring-blue-400' : 'border-blue-500/30 bg-blue-950/15 hover:border-blue-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-400">Superclasse Abstrata</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">Herança</span>
              </div>
              <h3 className="text-base font-bold text-blue-200 mt-1">Despesa</h3>
              <div className="mt-2 pt-2 border-t border-blue-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- String id</div>
                <div>- DateTime data</div>
                <div>- double valor</div>
                <div>- double kmRegistro</div>
                <div>- TipoDespesa tipo</div>
              </div>
              <div className="mt-2 pt-2 border-t border-blue-500/20 text-xs font-mono text-blue-300/80 space-y-0.5">
                <div>+ getValor(): double</div>
                <div>+ getKmRegistro(): double</div>
                <div>+ getTipo(): TipoDespesa</div>
              </div>
            </div>

            {/* Subclasses de Despesa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-blue-500/40">
              <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-950/10 text-xs font-mono">
                <span className="text-[10px] text-blue-400 font-semibold block">extends Despesa</span>
                <span className="font-bold text-white text-sm">Abastecimento</span>
                <div className="mt-1.5 text-slate-300 space-y-0.5 text-[11px]">
                  <div>- double litros</div>
                  <div>- double precoPorLitro</div>
                  <div>- String tipoCombustivel</div>
                </div>
                <div className="mt-1.5 text-blue-300 text-[10px]">
                  + calcularConsumoMedio(kmAnterior): double
                </div>
              </div>

              <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-950/10 text-xs font-mono">
                <span className="text-[10px] text-blue-400 font-semibold block">extends Despesa</span>
                <span className="font-bold text-white text-sm">ManutencaoRealizada</span>
                <div className="mt-1.5 text-slate-300 space-y-0.5 text-[11px]">
                  <div>- String oficina</div>
                  <div>- List&lt;String&gt; pecasTrocadas</div>
                  <div>- int garantiaDias</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TELEMETRIA: PEÇA MONITORADA */}
        {(selectedModule === 'all' || selectedModule === 'telemetria') && (
          <div className="space-y-4 xl:col-span-1">
            <div 
              onClick={() => setActiveClassDetail('PecaMonitorada')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'PecaMonitorada' ? 'border-rose-400 bg-rose-950/30 ring-1 ring-rose-400' : 'border-rose-500/30 bg-rose-950/15 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-rose-400">&laquo;abstract&raquo;</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Telemetria</span>
              </div>
              <h3 className="text-base font-bold text-rose-200 mt-1">PecaMonitorada</h3>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- String id</div>
                <div>- String nome</div>
                <div>- double kmInstalacao</div>
                <div>- double vidaUtilEstimadaKm</div>
              </div>
              <div className="mt-2 pt-2 border-t border-rose-500/20 text-xs font-mono text-rose-300/80 space-y-1">
                <div>+ calcularPercentualDesgaste(kmAtual): double</div>
                <div className="text-[10px] text-slate-400 bg-black/30 p-1.5 rounded">
                  Desgaste = ((kmAtual - kmInstalacao) / vidaUtil) * 100
                </div>
                <div>+ precisaSubstituicao(kmAtual): boolean</div>
                <div className="text-[10px] text-rose-400 font-semibold">
                  &gt; Dispara alerta quando Desgaste &gt;= 90%
                </div>
              </div>
            </div>

            {/* Subclasses de Peça */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-rose-500/40">
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-950/10 text-xs font-mono">
                <span className="text-[10px] text-rose-400 font-semibold block">extends PecaMonitorada</span>
                <span className="font-bold text-white text-sm">Pneu</span>
                <div className="mt-1.5 text-slate-300 space-y-0.5 text-[11px]">
                  <div>- String posicao (ex: D. Direito)</div>
                  <div>- String dot</div>
                  <div>- String medida (225/45 R17)</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-950/10 text-xs font-mono">
                <span className="text-[10px] text-rose-400 font-semibold block">extends PecaMonitorada</span>
                <span className="font-bold text-white text-sm">ComponenteGenerico</span>
                <div className="mt-1.5 text-slate-300 space-y-0.5 text-[11px]">
                  <div>- String categoria (Freios, Óleo)</div>
                  <div>- int intervaloMaximoMeses</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGES & REVISÕES */}
        {(selectedModule === 'all' || selectedModule === 'stages' || selectedModule === 'revisoes') && (
          <div className="space-y-4">
            {/* ITEM STAGE */}
            <div 
              onClick={() => setActiveClassDetail('ItemStage')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'ItemStage' ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400' : 'border-amber-500/30 bg-amber-950/15 hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400">Upgrade & Tuning</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Stage 1/2/3</span>
              </div>
              <h3 className="text-base font-bold text-amber-200 mt-1">ItemStage</h3>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- String id</div>
                <div>- String nomeModificacao</div>
                <div>- int nivelStage (1, 2, 3)</div>
                <div>- double custoEstimado</div>
                <div>- DateTime dataPlanejada</div>
                <div>- StatusStage status</div>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-amber-300/80 space-y-0.5">
                <div>+ atualizarStatus(novoStatus): void</div>
                <div>+ getCustoEstimado(): double</div>
              </div>
            </div>

            {/* MANUTENÇÃO PROGRAMADA */}
            <div 
              onClick={() => setActiveClassDetail('ManutencaoProgramada')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeClassDetail === 'ManutencaoProgramada' ? 'border-purple-400 bg-purple-950/30 ring-1 ring-purple-400' : 'border-purple-500/30 bg-purple-950/15 hover:border-purple-500/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400">Revisões Futuras</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Agenda</span>
              </div>
              <h3 className="text-base font-bold text-purple-200 mt-1">ManutencaoProgramada</h3>
              <div className="mt-2 pt-2 border-t border-purple-500/20 text-xs font-mono text-slate-300 space-y-1">
                <div>- String id</div>
                <div>- String descricaoServico</div>
                <div>- double kmLimite</div>
                <div>- DateTime dataLimite</div>
                <div>- boolean concluida</div>
              </div>
              <div className="mt-2 pt-2 border-t border-purple-500/20 text-xs font-mono text-purple-300/80 space-y-0.5">
                <div>+ verificarVencimento(kmAtual, dataAtual): boolean</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Painel Informativo de Fórmula de Desgaste */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Algoritmo Crítico de Telemetria de Desgaste</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Desgaste (%) = ((km_atual - km_instalacao) / vida_util_estimada_km) * 100
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-rose-500/10 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 font-medium">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Gatilho de Alerta Crítico em &ge; 90%</span>
        </div>
      </div>
    </div>
  );
};
