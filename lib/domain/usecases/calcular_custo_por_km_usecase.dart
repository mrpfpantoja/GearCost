import '../models/models.dart';

/// [SRP - Single Responsibility Principle]
/// Responsável exclusivamente por calcular as métricas financeiras agregadas do veículo
class CalcularCustoPorKmUseCase {
  const CalcularCustoPorKmUseCase();

  double executar(Veiculo veiculo) {
    if (veiculo.kmAtual <= 0) return 0.0;
    final custoTotal = veiculo.despesas.fold(0.0, (acc, d) => acc + d.valor);
    return custoTotal / veiculo.kmAtual;
  }

  double calcularCustoTotal(List<Despesa> despesas) {
    return despesas.fold(0.0, (acc, d) => acc + d.valor);
  }

  Map<TipoDespesa, double> calcularDistribuicaoPorCategoria(List<Despesa> despesas) {
    final map = <TipoDespesa, double>{};
    for (final tipo in TipoDespesa.values) {
      map[tipo] = 0.0;
    }
    for (final d in despesas) {
      map[d.tipo] = (map[d.tipo] ?? 0.0) + d.valor;
    }
    return map;
  }
}
