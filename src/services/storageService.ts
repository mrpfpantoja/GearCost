import { Veiculo, Usuario } from '../types/gearcost';
import { ServiceContainer } from './storage/ServiceContainer';

/**
 * [Facade Pattern & Backward Compatibility]
 * Fachada para compatibilidade com a interface existente do simulador web,
 * agora orquestrada de forma desacoplada pelos repositórios e serviços de domínio (SOLID).
 */
export class StorageService {
  private static vehicleRepo = ServiceContainer.getVehicleRepository();
  private static userRepo = ServiceContainer.getUserRepository();
  private static prefRepo = ServiceContainer.getPreferenceRepository();

  /**
   * Obtém a lista de veículos através do IVehicleRepository
   */
  static getVeiculos(): Veiculo[] {
    const result = StorageService.vehicleRepo.getVeiculos();
    return Array.isArray(result) ? result : [];
  }

  /**
   * Persiste a lista completa de veículos através do IVehicleRepository
   */
  static saveVeiculos(veiculos: Veiculo[]): void {
    StorageService.vehicleRepo.saveVeiculos(veiculos);
  }

  /**
   * Obtém o ID do veículo atualmente selecionado através do IPreferenceRepository
   */
  static getSelectedVeiculoId(defaultId: string = '1'): string {
    const result = StorageService.prefRepo.getSelectedVeiculoId(defaultId);
    return typeof result === 'string' ? result : defaultId;
  }

  /**
   * Persiste o ID do veículo selecionado através do IPreferenceRepository
   */
  static saveSelectedVeiculoId(id: string): void {
    StorageService.prefRepo.saveSelectedVeiculoId(id);
  }

  /**
   * Obtém o usuário autenticado através do IUserRepository
   */
  static getUsuario(): Usuario | null {
    const result = StorageService.userRepo.getUsuario();
    return result as Usuario | null;
  }

  /**
   * Persiste os dados do usuário através do IUserRepository
   */
  static saveUsuario(usuario: Usuario | null): void {
    StorageService.userRepo.saveUsuario(usuario);
  }

  /**
   * Limpa os dados do armazenamento
   */
  static clearStorage(): void {
    try {
      localStorage.removeItem('@GearCost:veiculos');
      localStorage.removeItem('@GearCost:selectedVeiculoId');
      localStorage.removeItem('@GearCost:usuario');
    } catch (error) {
      console.error('[StorageService] Erro ao limpar dados:', error);
    }
  }
}
