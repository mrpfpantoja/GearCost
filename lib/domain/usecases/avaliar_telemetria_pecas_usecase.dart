import '../models/models.dart';
import '../strategies/desgaste_strategy.dart';

/// [SRP - Single Responsibility Principle]
/// Responsável exclusivamente por avaliar o estado de saúde e alertas críticos de telemetria
class AvaliarTelemetriaPecasUseCase {
  final IDesgasteStrategy _estrategiaPadrao;

  const AvaliarTelemetriaPecasUseCase({
    IDesgasteStrategy estrategiaPadrao = const QuilometragemLinearStrategy(),
  }) : _estrategiaPadrao = estrategiaPadrao;

  /// Retorna as peças que atingiram o limiar crítico (>= 90% de desgaste)
  List<PecaMonitorada> obterPecasCriticas(
    List<PecaMonitorada> pecas,
    double kmAtual, {
    double limiarCritico = 90.0,
  }) {
    return pecas.where((peca) {
      final desgaste = peca.calcularPercentualDesgaste(kmAtual);
      return desgaste >= limiarCritico;
    }).toList();
  }

  /// Retorna o total de alertas críticos
  int contarAlertasCriticos(List<PecaMonitorada> pecas, double kmAtual) {
    return obterPecasCriticas(pecas, kmAtual).length;
  }

  /// Calcula o índice de saúde geral da frota/veículo (0 a 100%)
  double calcularIndiceSaude(List<PecaMonitorada> pecas, double kmAtual) {
    if (pecas.isEmpty) return 100.0;
    final totalDesgaste = pecas.fold(0.0, (acc, p) {
      return acc + p.calcularPercentualDesgaste(kmAtual);
    });
    final desgasteMedio = totalDesgaste / pecas.length;
    final saude = 100.0 - desgasteMedio;
    return saude.clamp(0.0, 100.0);
  }
}
