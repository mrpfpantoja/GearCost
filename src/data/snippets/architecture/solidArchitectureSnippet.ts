import { CodeSnippet } from '../types';

export const solidArchitectureSnippet: CodeSnippet = {
  id: 'solid-architecture',
  title: 'Arquitetura SOLID & Contratos Desacoplados',
  fileName: 'lib/domain/contracts/i_veiculo_repository.dart',
  language: 'dart',
  category: 'architecture',
  description: 'Aplica os 5 princípios SOLID: Segregação de Interfaces (ISP), Inversão de Dependência (DIP), Responsabilidade Única (SRP nos UseCases) e Aberto/Fechado (OCP com Strategy Pattern).',
  code: `// ============================================================================
// 1. [ISP - Interface Segregation Principle] & [DIP - Dependency Inversion Principle]
// Contratos segregados para leitura, gravação e telemetria
// ============================================================================

abstract class IVeiculoReader {
  Future<List<Veiculo>> obterTodos();
  Future<Veiculo?> obterPorId(int id);
}

abstract class IVeiculoWriter {
  Future<int> inserirVeiculo(Veiculo veiculo);
  Future<int> atualizarVeiculo(Veiculo veiculo);
  Future<int> deletarVeiculo(int id);
}

abstract class IOdometroUpdater {
  Future<int> atualizarKm(int id, double novoKm);
}

/// Contrato agregado de persistência de veículos
abstract class IVeiculoRepository
    implements IVeiculoReader, IVeiculoWriter, IOdometroUpdater {}

// ============================================================================
// 2. [SRP - Single Responsibility Principle]
// Use Cases isolados para regras de negócio e cálculos matemáticos
// ============================================================================

class CalcularCustoPorKmUseCase {
  const CalcularCustoPorKmUseCase();

  double executar(Veiculo veiculo) {
    if (veiculo.kmAtual <= 0) return 0.0;
    final custoTotal = veiculo.despesas.fold(0.0, (acc, d) => acc + d.valor);
    return custoTotal / veiculo.kmAtual;
  }
}

class AvaliarTelemetriaPecasUseCase {
  const AvaliarTelemetriaPecasUseCase();

  List<PecaMonitorada> obterPecasCriticas(List<PecaMonitorada> pecas, double kmAtual) {
    return pecas.where((p) => p.calcularPercentualDesgaste(kmAtual) >= 90.0).toList();
  }

  double calcularIndiceSaude(List<PecaMonitorada> pecas, double kmAtual) {
    if (pecas.isEmpty) return 100.0;
    final media = pecas.fold(0.0, (acc, p) => acc + p.calcularPercentualDesgaste(kmAtual)) / pecas.length;
    return (100.0 - media).clamp(0.0, 100.0);
  }
}

// ============================================================================
// 3. [OCP - Open/Closed Principle]
// Strategy Pattern para cálculo flexível de desgaste sem alterar a engine central
// ============================================================================

abstract class IDesgasteStrategy {
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
  });
}

class QuilometragemLinearStrategy implements IDesgasteStrategy {
  const QuilometragemLinearStrategy();
  @override
  double calcularDesgaste({required double kmAtual, required double kmInstalacao, required double vidaUtilEstimadaKm}) {
    if (vidaUtilEstimadaKm <= 0) return 0.0;
    return (((kmAtual - kmInstalacao) / vidaUtilEstimadaKm) * 100.0).clamp(0.0, 100.0);
  }
}

// ============================================================================
// 4. [DIP - Dependency Inversion via Provider no main.dart]
// ============================================================================
/*
MultiProvider(
  providers: [
    Provider<IVeiculoRepository>(create: (_) => VeiculoRepository()),
    Provider<CalcularCustoPorKmUseCase>(create: (_) => const CalcularCustoPorKmUseCase()),
    ChangeNotifierProvider<GaragemController>(
      create: (ctx) => GaragemController(
        veiculoRepo: ctx.read<IVeiculoRepository>(),
        calculoUseCase: ctx.read<CalcularCustoPorKmUseCase>(),
      ),
    ),
  ],
  child: const GearCostApp(),
)
*/`,
};
