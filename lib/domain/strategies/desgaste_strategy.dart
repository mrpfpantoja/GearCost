import '../models/models.dart';

/// [OCP - Open/Closed Principle]
/// Estratégia extensível para cálculo de desgaste de componentes
abstract class IDesgasteStrategy {
  /// Retorna o percentual de desgaste calculado (0 a 100%)
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
    Map<String, dynamic>? parametrosExtras,
  });

  /// Define se o componente atingiu limiar de alerta
  bool precisaSubstituicao(double desgastePercentual, {double limiar = 90.0});
}

/// Estratégia Padrão baseada na Quilometragem linear
class QuilometragemLinearStrategy implements IDesgasteStrategy {
  const QuilometragemLinearStrategy();

  @override
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
    Map<String, dynamic>? parametrosExtras,
  }) {
    if (vidaUtilEstimadaKm <= 0) return 0.0;
    final rodado = kmAtual - kmInstalacao;
    if (rodado <= 0) return 0.0;
    final perc = (rodado / vidaUtilEstimadaKm) * 100.0;
    return perc.clamp(0.0, 100.0);
  }

  @override
  bool precisaSubstituicao(double desgastePercentual, {double limiar = 90.0}) {
    return desgastePercentual >= limiar;
  }
}

/// Estratégia Híbrida para Pneus com fator de desgaste por eixo (Tração vs Livre)
class DesgastePneuEixoStrategy implements IDesgasteStrategy {
  final bool isEixoTracao;

  const DesgastePneuEixoStrategy({this.isEixoTracao = true});

  @override
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
    Map<String, dynamic>? parametrosExtras,
  }) {
    if (vidaUtilEstimadaKm <= 0) return 0.0;
    final rodado = kmAtual - kmInstalacao;
    if (rodado <= 0) return 0.0;

    // Fator de aceleração de desgaste no eixo motriz (ex: dianteiro em tração dianteira)
    final fator = isEixoTracao ? 1.15 : 0.90;
    final perc = ((rodado * fator) / vidaUtilEstimadaKm) * 100.0;
    return perc.clamp(0.0, 100.0);
  }

  @override
  bool precisaSubstituicao(double desgastePercentual, {double limiar = 90.0}) {
    return desgastePercentual >= limiar;
  }
}

/// Estratégia Temporal + Quilometragem para Óleos e Fluidos
class DesgasteFluidoTemporalStrategy implements IDesgasteStrategy {
  final int maxMeses;
  final DateTime dataInstalacao;

  const DesgasteFluidoTemporalStrategy({
    this.maxMeses = 12,
    required this.dataInstalacao,
  });

  @override
  double calcularDesgaste({
    required double kmAtual,
    required double kmInstalacao,
    required double vidaUtilEstimadaKm,
    Map<String, dynamic>? parametrosExtras,
  }) {
    // Desgaste por KM
    final desgasteKm = vidaUtilEstimadaKm > 0
        ? (((kmAtual - kmInstalacao) / vidaUtilEstimadaKm) * 100.0).clamp(0.0, 100.0)
        : 0.0;

    // Desgaste por tempo decorrido em meses
    final diasDecorridos = DateTime.now().difference(dataInstalacao).inDays;
    final mesesDecorridos = diasDecorridos / 30.44;
    final desgasteTempo = maxMeses > 0
        ? ((mesesDecorridos / maxMeses) * 100.0).clamp(0.0, 100.0)
        : 0.0;

    // Prevalece o fator mais crítico (KM ou tempo)
    return desgasteKm > desgasteTempo ? desgasteKm : desgasteTempo;
  }

  @override
  bool precisaSubstituicao(double desgastePercentual, {double limiar = 90.0}) {
    return desgastePercentual >= limiar;
  }
}
