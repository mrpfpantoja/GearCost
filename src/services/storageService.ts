import { Veiculo, Usuario } from '../types/gearcost';
import { INITIAL_VEICULOS, DEFAULT_USUARIO } from '../data/mockData';

const STORAGE_KEYS = {
  VEICULOS: '@GearCost:veiculos',
  SELECTED_VEICULO_ID: '@GearCost:selectedVeiculoId',
  USUARIO: '@GearCost:usuario',
} as const;

export class StorageService {
  /**
   * Obtém a lista de veículos gravada no localStorage.
   * Se nenhuma lista for encontrada ou se houver erro no parse,
   * inicializa com a lista mockada INITIAL_VEICULOS e salva no storage.
   */
  static getVeiculos(): Veiculo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VEICULOS);
      if (!data) {
        StorageService.saveVeiculos(INITIAL_VEICULOS);
        return INITIAL_VEICULOS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      StorageService.saveVeiculos(INITIAL_VEICULOS);
      return INITIAL_VEICULOS;
    } catch (error) {
      console.error('[StorageService] Erro ao carregar veículos do localStorage:', error);
      return INITIAL_VEICULOS;
    }
  }

  /**
   * Persiste a lista completa de veículos no localStorage.
   */
  static saveVeiculos(veiculos: Veiculo[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VEICULOS, JSON.stringify(veiculos));
    } catch (error) {
      console.error('[StorageService] Erro ao salvar veículos no localStorage:', error);
    }
  }

  /**
   * Obtém o ID do veículo atualmente selecionado.
   * Se não existir, retorna o defaultId fornecido e o persiste.
   */
  static getSelectedVeiculoId(defaultId: string = '1'): string {
    try {
      const id = localStorage.getItem(STORAGE_KEYS.SELECTED_VEICULO_ID);
      if (id) {
        return id;
      }
      StorageService.saveSelectedVeiculoId(defaultId);
      return defaultId;
    } catch (error) {
      console.error('[StorageService] Erro ao carregar veículo selecionado:', error);
      return defaultId;
    }
  }

  /**
   * Persiste o ID do veículo selecionado no localStorage.
   */
  static saveSelectedVeiculoId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VEICULO_ID, id);
    } catch (error) {
      console.error('[StorageService] Erro ao salvar veículo selecionado:', error);
    }
  }

  /**
   * Obtém o usuário autenticado salvo no localStorage.
   * Caso não haja registro prévio, retorna o usuário padrão (DEFAULT_USUARIO).
   */
  static getUsuario(): Usuario | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USUARIO);
      if (!data) {
        StorageService.saveUsuario(DEFAULT_USUARIO);
        return DEFAULT_USUARIO;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('[StorageService] Erro ao carregar usuário do localStorage:', error);
      return DEFAULT_USUARIO;
    }
  }

  /**
   * Persiste os dados do usuário autenticado ou limpa a chave se null.
   */
  static saveUsuario(usuario: Usuario | null): void {
    try {
      if (usuario === null) {
        localStorage.removeItem(STORAGE_KEYS.USUARIO);
      } else {
        localStorage.setItem(STORAGE_KEYS.USUARIO, JSON.stringify(usuario));
      }
    } catch (error) {
      console.error('[StorageService] Erro ao salvar usuário no localStorage:', error);
    }
  }

  /**
   * Limpa todos os dados salvos pelo GearCost no localStorage e restaura os padrões.
   */
  static clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.VEICULOS);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_VEICULO_ID);
      localStorage.removeItem(STORAGE_KEYS.USUARIO);
    } catch (error) {
      console.error('[StorageService] Erro ao limpar dados do localStorage:', error);
    }
  }
}
