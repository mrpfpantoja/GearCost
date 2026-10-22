import { Veiculo, Despesa, TipoDespesa } from '../../types/gearcost';

/**
 * [SRP - Single Responsibility Principle]
 * Responsável unicamente por cálculos matemáticos, financeiros e métricas de consumo de veículos
 */
export class VehicleMetricsCalculator {
  /**
   * Calcula o custo financeiro total acumulado
   */
  static calculateTotalCost(despesas: Despesa[]): number {
    return despesas.reduce((acc, d) => acc + (d.valor || 0), 0);
  }

  /**
   * Calcula o custo por quilômetro rodado (R$ / KM)
   */
  static calculateCostPerKm(veiculo: Veiculo): number {
    if (!veiculo || veiculo.kmAtual <= 0) return 0;
    const total = this.calculateTotalCost(veiculo.despesas || []);
    return total / veiculo.kmAtual;
  }

  /**
   * Agrupa e soma despesas por categoria
   */
  static calculateExpensesByType(despesas: Despesa[]): Record<TipoDespesa, number> {
    const categories: Record<TipoDespesa, number> = {
      COMBUSTIVEL: 0,
      MANUTENCAO: 0,
      IMPOSTO_SEGURO: 0,
      ESTETICA: 0,
      UPGRADE_STAGE: 0,
    };

    despesas.forEach((d) => {
      if (categories[d.tipo] !== undefined) {
        categories[d.tipo] += d.valor || 0;
      }
    });

    return categories;
  }

  /**
   * Calcula consumo médio em KM/L a partir dos abastecimentos
   */
  static calculateAverageConsumptionKmL(despesas: Despesa[]): number {
    const abastecimentos = despesas.filter((d) => d.tipo === 'COMBUSTIVEL' && 'litros' in d && d.litros > 0);
    if (abastecimentos.length < 2) return 0;

    // Ordena por odômetro crescente
    const ordenados = [...abastecimentos].sort((a, b) => a.kmRegistro - b.kmRegistro);
    const deltaKm = ordenados[ordenados.length - 1].kmRegistro - ordenados[0].kmRegistro;
    const totalLitros = ordenados.slice(1).reduce((acc, curr) => acc + (('litros' in curr ? (curr.litros as number) : 0) || 0), 0);

    if (totalLitros <= 0 || deltaKm <= 0) return 0;
    return deltaKm / totalLitros;
  }
}
