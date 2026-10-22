import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  Boxes, 
  Split, 
  Minimize2, 
  Cpu, 
  Sparkles,
  GitBranch,
  Key,
  Flame,
  Code
} from 'lucide-react';

interface SolidPrinciple {
  letter: 'S' | 'O' | 'L' | 'I' | 'D';
  name: string;
  tagline: string;
  color: string;
  borderColor: string;
  bgColor: string;
  accentBg: string;
  problemSummary: string;
  solutionSummary: string;
  gearCostImplementation: string[];
  codeExample: {
    title: string;
    description: string;
    code: string;
  };
}

const SOLID_PRINCIPLES: SolidPrinciple[] = [
  {
    letter: 'S',
    name: 'Single Responsibility Principle',
    tagline: 'Uma classe deve ter um, e apenas um, motivo para mudar.',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-950/20',
    accentBg: 'bg-rose-500/20 text-rose-300',
    problemSummary: 'Antes, o GaragemController misturava estado de tela, validação de odômetro, regras de exclusão de frota, cálculos matemáticos de R$/KM e cálculo de desgaste de peças.',
    solutionSummary: 'Criamos UseCases isolados no domínio (CalcularCustoPorKmUseCase, AvaliarTelemetriaPecasUseCase, ValidarRegrasVeiculoUseCase) e no React (VehicleMetricsCalculator, TelemetryEvaluator).',
    gearCostImplementation: [
      'CalcularCustoPorKmUseCase: isolado para métricas financeiras e distribuição por tipo de despesa.',
      'AvaliarTelemetriaPecasUseCase: isolado para limiares de alerta e cálculo do índice de saúde da frota.',
      'ValidarRegrasVeiculoUseCase: isolado para invariantes de quilometragem e regras de integridade cadastral.',
      'GaragemController focado unicamente na orquestração reativa do estado de UI.'
    ],
    codeExample: {
      title: 'Use Case Especializado (SRP)',
      description: 'Cálculo de custos desacoplado do controller e das classes de visualização.',
      code: `// lib/domain/usecases/calcular_custo_por_km_usecase.dart
class CalcularCustoPorKmUseCase {
  const CalcularCustoPorKmUseCase();

  double executar(Veiculo veiculo) {
    if (veiculo.kmAtual <= 0) return 0.0;
    final custoTotal = veiculo.despesas.fold(0.0, (acc, d) => acc + d.valor);
    return custoTotal / veiculo.kmAtual;
  }
}`
    }
  },
  {
    letter: 'O',
    name: 'Open/Closed Principle',
    tagline: 'Entidades de software devem ser abertas para extensão, mas fechadas para modificação.',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-950/20',
    accentBg: 'bg-amber-500/20 text-amber-300',
    problemSummary: 'Adicionar novas fórmulas de desgaste (ex: pneus com tração dianteira, degradação temporal de fluidos de freio/óleo) exigiria modificar diretamente a classe PecaMonitorada ou o controller.',
    solutionSummary: 'Implementamos o Strategy Pattern (IDesgasteStrategy / IWearCalculationStrategy). Novas lógicas de desgaste são adicionadas criando novas estratégias sem tocar no código existente.',
    gearCostImplementation: [
      'IDesgasteStrategy: contrato extensível para algoritmos de cálculo de desgaste.',
      'QuilometragemLinearStrategy: cálculo padrão linear por KM rodado.',
      'DesgastePneuEixoStrategy: fator de aceleração por eixo motriz (1.15x na tração).',
      'DesgasteFluidoTemporalStrategy: cálculo híbrido tempo (meses) vs odômetro (km).'
    ],
    codeExample: {
      title: 'Strategy Pattern para Desgaste (OCP)',
      description: 'Novas regras de telemetria criadas por extensão, sem alterar classes existentes.',
      code: `// lib/domain/strategies/desgaste_strategy.dart
abstract class IDesgasteStrategy {
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
  });
}

class DesgastePneuEixoStrategy implements IDesgasteStrategy {
  final bool isEixoTracao;
  const DesgastePneuEixoStrategy({this.isEixoTracao = true});

  @override
  double calcularDesgaste(...) {
    final fator = isEixoTracao ? 1.15 : 0.90;
    return (((kmAtual - kmInstalacao) * fator) / vidaUtilEstimadaKm) * 100.0;
  }
}`
    }
  },
  {
    letter: 'L',
    name: 'Liskov Substitution Principle',
    tagline: 'Subclasses devem poder substituir suas classes base sem quebrar a consistência do programa.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-950/20',
    accentBg: 'bg-emerald-500/20 text-emerald-300',
    problemSummary: 'Garantir que tipos derivados como Abastecimento, ManutencaoRealizada e DespesaGeral cumpram todos os invariantes da classe base Despesa sem lançar exceções inesperadas.',
    solutionSummary: 'Polimorfismo estrito em Despesa e PecaMonitorada. Qualquer rotina que itere sobre Despesa ou PecaMonitorada opera uniformemente sem checagem de tipos que viole substitutibilidade.',
    gearCostImplementation: [
      'Abastecimento, ManutencaoRealizada e DespesaGeral honram toMap() e campos obrigatórios de Despesa.',
      'Pneu e ComponenteGenerico honram calcularPercentualDesgaste() e registrarSubstituicao().',
      'LocalStorageVehicleRepository substitui perfeitamente qualquer implementação de IVehicleRepository.'
    ],
    codeExample: {
      title: 'Polimorfismo Estrito & Substituibilidade (LSP)',
      description: 'Classes derivadas preservam o contrato sem efeitos colaterais.',
      code: `// Qualquer subclasse de Despesa opera transparentemente no motor financeiro
abstract class Despesa {
  final int? id;
  final int veiculoId;
  final double valor;
  Map<String, dynamic> toMap();
}

// Abastecimento substitui Despesa sem alterar expectativas de quem consome:
class Abastecimento extends Despesa {
  final double litros;
  final double precoPorLitro;
  ...
}`
    }
  },
  {
    letter: 'I',
    name: 'Interface Segregation Principle',
    tagline: 'Clientes não devem ser forçados a depender de métodos que não utilizam.',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-950/20',
    accentBg: 'bg-cyan-500/20 text-cyan-300',
    problemSummary: 'Repositórios monolíticos ("God Repositories") forçam componentes que apenas leem dados a depender de métodos perigosos de exclusão e mutação.',
    solutionSummary: 'Fatiamento de interfaces coesas: IVeiculoReader (consultas), IVeiculoWriter (mutações) e IOdometroUpdater (telemetria veloz). Os clientes injetam somente o contrato que necessitam.',
    gearCostImplementation: [
      'IVeiculoReader: exclusivo para consultas de catálogo (obterTodos, obterPorId).',
      'IVeiculoWriter: exclusivo para mutações estruturais (inserir, atualizar, deletar).',
      'IOdometroUpdater: interface enxuta e focada para a atualização veloz do odômetro.',
      'IVeiculoRepository: agrega as interfaces especializadas para o controller principal.'
    ],
    codeExample: {
      title: 'Interfaces Segregadas (ISP)',
      description: 'Interfaces granulares para leitura, escrita e odômetro.',
      code: `// lib/domain/contracts/i_veiculo_repository.dart
abstract class IVeiculoReader {
  Future<List<Veiculo>> obterTodos();
  Future<Veiculo?> obterPorId(int id);
}

abstract class IVeiculoWriter {
  Future<int> inserirVeiculo(Veiculo veiculo);
  Future<int> deletarVeiculo(int id);
}

abstract class IOdometroUpdater {
  Future<int> atualizarKm(int id, double novoKm);
}

// Agregador para quem necessita do conjunto completo:
abstract class IVeiculoRepository
    implements IVeiculoReader, IVeiculoWriter, IOdometroUpdater {}`
    }
  },
  {
    letter: 'D',
    name: 'Dependency Inversion Principle',
    tagline: 'Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.',
    color: 'text-violet-400',
    borderColor: 'border-violet-500/40',
    bgColor: 'bg-violet-950/20',
    accentBg: 'bg-violet-500/20 text-violet-300',
    problemSummary: 'Antes, GaragemController instanciava diretamente new VeiculoRepository() e new DespesaRepository(), acoplando o controller ao SQLite nativo e inviabilizando testes unitários.',
    solutionSummary: 'Inversão total de controle. O GaragemController agora recebe abstrações (IVeiculoRepository, IDespesaRepository, etc.). A amarração é feita via MultiProvider no Flutter e ServiceContainer no React.',
    gearCostImplementation: [
      'GaragemController recebe IVeiculoRepository no construtor via injeção de dependência.',
      'main.dart registra Provider<IVeiculoRepository>(create: (_) => VeiculoRepository()).',
      'Permite trocar facilmente a persistência local (SQLite) por API REST, Firebase ou Mock para testes.',
      'ServiceContainer no React gerencia instâncias de repositórios desacoplados.'
    ],
    codeExample: {
      title: 'Inversão de Dependência (DIP)',
      description: 'Controller amarrado apenas aos contratos abstratos via Provider.',
      code: `// lib/main.dart
MultiProvider(
  providers: [
    // Injeção de Contratos Abstratos (DIP)
    Provider<IVeiculoRepository>(create: (_) => VeiculoRepository()),
    Provider<IDespesaRepository>(create: (_) => DespesaRepository()),
    
    // Controller consome apenas as abstrações:
    ChangeNotifierProvider<GaragemController>(
      create: (ctx) => GaragemController(
        veiculoRepo: ctx.read<IVeiculoRepository>(),
        despesaRepo: ctx.read<IDespesaRepository>(),
        calculoUseCase: ctx.read<CalcularCustoPorKmUseCase>(),
      ),
    ),
  ],
  child: const GearCostApp(),
)`
    }
  }
];

export const SolidArchitectureViewer: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<'S' | 'O' | 'L' | 'I' | 'D'>('S');

  const activePrinciple = SOLID_PRINCIPLES.find(p => p.letter === selectedLetter) || SOLID_PRINCIPLES[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Informativo de Arquitetura */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-400 font-mono text-xs font-bold border border-orange-500/30">
                SOLID REFACTORING ENGINE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Zero Acoplamento
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Arquitetura SOLID & Princípios de Engenharia Limpa
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Aplicação rigorosa dos 5 princípios arquiteturais em Dart/Flutter (SQLite & Provider) e TypeScript/React (IoC Container & Repositories).
            </p>
          </div>

          {/* Cards de Métricas Arquiteturais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Acoplamento</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">Baixo / Mínimo</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Coesão</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">Alta (UseCases)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Extensibilidade</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">Aberta (OCP)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Testabilidade</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">100% Mockável</div>
            </div>
          </div>
        </div>

        {/* Barra de Navegação dos 5 Princípios */}
        <div className="grid grid-cols-5 gap-2 mt-6 pt-5 border-t border-slate-800/80">
          {SOLID_PRINCIPLES.map((principle) => {
            const isSelected = selectedLetter === principle.letter;
            return (
              <button
                key={principle.letter}
                onClick={() => setSelectedLetter(principle.letter)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? `${principle.bgColor} ${principle.borderColor} ring-1 ring-white/10 shadow-lg` 
                    : 'bg-slate-950/50 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-black font-mono ${principle.color}`}>
                    {principle.letter}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  {principle.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {principle.tagline.slice(0, 28)}...
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalhamento do Princípio Ativo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Diagnóstico Arquitetural (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card Conceitual */}
          <div className={`p-5 rounded-2xl border ${activePrinciple.borderColor} ${activePrinciple.bgColor}`}>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-black ${activePrinciple.accentBg}`}>
                PRINCÍPIO [{activePrinciple.letter}]
              </span>
              <h3 className="text-lg font-black text-white">
                {activePrinciple.name}
              </h3>
            </div>
            <p className="text-xs text-slate-300 italic mt-2 border-l-2 border-orange-500/50 pl-3 py-0.5">
              "{activePrinciple.tagline}"
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Antes (Problema de Acoplamento)
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activePrinciple.problemSummary}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Depois (Solução Arquitetural)
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activePrinciple.solutionSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist de Implementações no GearCost */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-orange-400" />
              Impacto Prático no GearCost
            </h4>
            <div className="mt-3 space-y-2">
              {activePrinciple.gearCostImplementation.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Código & Exemplo Técnico (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
            
            {/* Header da Janela de Código */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                  {activePrinciple.codeExample.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                Dart & TypeScript
              </span>
            </div>

            {/* Descrição Curta */}
            <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/50 text-xs text-slate-400">
              {activePrinciple.codeExample.description}
            </div>

            {/* Código com Syntax Highlight */}
            <div className="p-4 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
              <pre>
                <code>{activePrinciple.codeExample.code}</code>
              </pre>
            </div>

            {/* Rodapé da Janela */}
            <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Em conformidade com Clean Architecture & Uncle Bob SOLID
              </span>
              <span className="font-mono text-slate-500">lib/domain/</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
