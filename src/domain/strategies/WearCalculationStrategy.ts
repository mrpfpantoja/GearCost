/**
 * [OCP - Open/Closed Principle]
 * Estratégia extensível para cálculo de desgaste de componentes
 */
export interface IWearCalculationStrategy {
  calculateWear(kmAtual: number, kmInstalacao: number, vidaUtilKm: number): number;
  isCritical(wearPercentage: number, threshold?: number): boolean;
}

/**
 * Estratégia Linear baseada em KM
 */
export class LinearWearStrategy implements IWearCalculationStrategy {
  calculateWear(kmAtual: number, kmInstalacao: number, vidaUtilKm: number): number {
    if (vidaUtilKm <= 0) return 0;
    const rodado = kmAtual - kmInstalacao;
    if (rodado <= 0) return 0;
    const perc = (rodado / vidaUtilKm) * 100;
    return Math.min(100, Math.max(0, perc));
  }

  isCritical(wearPercentage: number, threshold: number = 90): boolean {
    return wearPercentage >= threshold;
  }
}

/**
 * Estratégia para Pneus com fator de desgaste por eixo de tração
 */
export class TireWearStrategy implements IWearCalculationStrategy {
  constructor(private isDriveAxle: boolean = true) {}

  calculateWear(kmAtual: number, kmInstalacao: number, vidaUtilKm: number): number {
    if (vidaUtilKm <= 0) return 0;
    const rodado = kmAtual - kmInstalacao;
    if (rodado <= 0) return 0;
    const factor = this.isDriveAxle ? 1.15 : 0.90;
    const perc = ((rodado * factor) / vidaUtilKm) * 100;
    return Math.min(100, Math.max(0, perc));
  }

  isCritical(wearPercentage: number, threshold: number = 90): boolean {
    return wearPercentage >= threshold;
  }
}
