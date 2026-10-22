/**
 * [ISP - Interface Segregation Principle]
 * Contrato de preferências da garagem (ex: veículo ativo selecionado)
 */
export interface IPreferenceRepository {
  getSelectedVeiculoId(defaultId?: string): Promise<string> | string;
  saveSelectedVeiculoId(id: string): Promise<void> | void;
}
