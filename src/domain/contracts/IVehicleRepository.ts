import { Veiculo } from '../../types/gearcost';

/**
 * [ISP - Interface Segregation Principle]
 * Segregação de leitura de veículos
 */
export interface IVehicleReader {
  getVeiculos(): Promise<Veiculo[]> | Veiculo[];
  getVeiculoById(id: string): Promise<Veiculo | null> | Veiculo | null;
}

/**
 * [ISP - Interface Segregation Principle]
 * Segregação de mutação cadastral de veículos
 */
export interface IVehicleWriter {
  saveVeiculos(veiculos: Veiculo[]): Promise<void> | void;
  addVeiculo(veiculo: Veiculo): Promise<void> | void;
  updateVeiculo(veiculo: Veiculo): Promise<void> | void;
  deleteVeiculo(id: string): Promise<void> | void;
}

/**
 * [ISP - Interface Segregation Principle]
 * Segregação de telemetria de odômetro
 */
export interface IOdometerUpdater {
  updateKm(veiculoId: string, novoKm: number): Promise<void> | void;
}

/**
 * [DIP - Dependency Inversion Principle]
 * Contrato unificado do Repositório de Veículos
 */
export interface IVehicleRepository extends IVehicleReader, IVehicleWriter, IOdometerUpdater {}
