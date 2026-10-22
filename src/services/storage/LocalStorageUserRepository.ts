import { IUserRepository } from '../../domain/contracts/IUserRepository';
import { Usuario } from '../../types/gearcost';
import { DEFAULT_USUARIO } from '../../data/mockData';

const STORAGE_KEY = '@GearCost:usuario';

/**
 * [LSP & DIP] Implementação concreta de IUserRepository baseada em LocalStorage
 */
export class LocalStorageUserRepository implements IUserRepository {
  getUsuario(): Usuario | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveUsuario(DEFAULT_USUARIO);
        return DEFAULT_USUARIO;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('[LocalStorageUserRepository] Erro ao carregar usuário:', error);
      return DEFAULT_USUARIO;
    }
  }

  saveUsuario(usuario: Usuario | null): void {
    try {
      if (usuario === null) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
      }
    } catch (error) {
      console.error('[LocalStorageUserRepository] Erro ao salvar usuário:', error);
    }
  }
}
