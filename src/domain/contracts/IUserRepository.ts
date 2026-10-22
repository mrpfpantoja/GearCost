import { Usuario } from '../../types/gearcost';

/**
 * [ISP - Interface Segregation Principle]
 * Contrato de persistência de credenciais e sessão do usuário
 */
export interface IUserRepository {
  getUsuario(): Promise<Usuario | null> | Usuario | null;
  saveUsuario(usuario: Usuario | null): Promise<void> | void;
}
