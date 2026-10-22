import { PecaMonitorada } from '../../types/gearcost';
import { IWearCalculationStrategy, LinearWearStrategy } from '../strategies/WearCalculationStrategy';

/**
 * [SRP - Single Responsibility Principle]
 * Responsável unicamente pela avaliação de telemetria, desgaste e alertas de componentes
 */
export class TelemetryEvaluator {
  private strategy: IWearCalculationStrategy;

  constructor(strategy: IWearCalculationStrategy = new LinearWearStrategy()) {
    this.strategy = strategy;
  }

  /**
   * Calcula o percentual de desgaste para uma peça monitorada
   */
  calculateWear(peca: PecaMonitorada, kmAtual: number): number {
    return this.strategy.calculateWear(kmAtual, peca.kmInstalacao, peca.vidaUtilEstimadaKm);
  }

  /**
   * Filtra e retorna apenas os componentes com nível crítico (>= 90%)
   */
  getCriticalParts(pecas: PecaMonitorada[], kmAtual: number, threshold: number = 90): PecaMonitorada[] {
    return pecas.filter((p) => {
      const wear = this.calculateWear(p, kmAtual);
      return this.strategy.isCritical(wear, threshold);
    });
  }

  /**
   * Avalia a pontuação geral de saúde da telemetria (0 a 100%)
   */
  calculateHealthScore(pecas: PecaMonitorada[], kmAtual: number): number {
    if (!pecas || pecas.length === 0) return 100;
    const totalWear = pecas.reduce((acc, p) => acc + this.calculateWear(p, kmAtual), 0);
    const avgWear = totalWear / pecas.length;
    return Math.max(0, Math.min(100, Math.round(100 - avgWear)));
  }
}
