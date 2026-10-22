import { IPreferenceRepository } from '../../domain/contracts/IPreferenceRepository';

const STORAGE_KEY = '@GearCost:selectedVeiculoId';

/**
 * [LSP & DIP] Implementação concreta de IPreferenceRepository baseada em LocalStorage
 */
export class LocalStoragePreferenceRepository implements IPreferenceRepository {
  getSelectedVeiculoId(defaultId: string = '1'): string {
    try {
      const id = localStorage.getItem(STORAGE_KEY);
      if (id) {
        return id;
      }
      this.saveSelectedVeiculoId(defaultId);
      return defaultId;
    } catch (error) {
      console.error('[LocalStoragePreferenceRepository] Erro ao carregar veículo ativo:', error);
      return defaultId;
    }
  }

  saveSelectedVeiculoId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (error) {
      console.error('[LocalStoragePreferenceRepository] Erro ao salvar veículo ativo:', error);
    }
  }
}
