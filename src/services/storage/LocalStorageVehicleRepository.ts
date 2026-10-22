import { IVehicleRepository } from '../../domain/contracts/IVehicleRepository';
import { Veiculo } from '../../types/gearcost';
import { INITIAL_VEICULOS } from '../../data/mockData';

const STORAGE_KEY = '@GearCost:veiculos';

/**
 * [LSP & DIP] Implementação concreta de IVehicleRepository baseada em LocalStorage
 */
export class LocalStorageVehicleRepository implements IVehicleRepository {
  getVeiculos(): Veiculo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveVeiculos(INITIAL_VEICULOS);
        return INITIAL_VEICULOS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      this.saveVeiculos(INITIAL_VEICULOS);
      return INITIAL_VEICULOS;
    } catch (error) {
      console.error('[LocalStorageVehicleRepository] Erro ao obter veículos:', error);
      return INITIAL_VEICULOS;
    }
  }

  getVeiculoById(id: string): Veiculo | null {
    const list = this.getVeiculos();
    return list.find((v) => v.id === id) || null;
  }

  saveVeiculos(veiculos: Veiculo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(veiculos));
    } catch (error) {
      console.error('[LocalStorageVehicleRepository] Erro ao salvar veículos:', error);
    }
  }

  addVeiculo(veiculo: Veiculo): void {
    const list = this.getVeiculos();
    list.unshift(veiculo);
    this.saveVeiculos(list);
  }

  updateVeiculo(veiculo: Veiculo): void {
    const list = this.getVeiculos();
    const idx = list.findIndex((v) => v.id === veiculo.id);
    if (idx !== -1) {
      list[idx] = veiculo;
      this.saveVeiculos(list);
    }
  }

  deleteVeiculo(id: string): void {
    const list = this.getVeiculos();
    const updated = list.filter((v) => v.id !== id);
    this.saveVeiculos(updated);
  }

  updateKm(veiculoId: string, novoKm: number): void {
    const list = this.getVeiculos();
    const idx = list.findIndex((v) => v.id === veiculoId);
    if (idx !== -1) {
      list[idx].kmAtual = novoKm;
      this.saveVeiculos(list);
    }
  }
}
