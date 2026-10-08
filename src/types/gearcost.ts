export type TipoDespesa = 
  | 'COMBUSTIVEL'
  | 'MANUTENCAO'
  | 'IMPOSTO_SEGURO'
  | 'ESTETICA'
  | 'UPGRADE_STAGE';

export type StatusStage = 'PLANEJADO' | 'COMPRADO' | 'INSTALADO';

export interface FipeMarca {
  codigo: string;
  nome: string;
}

export interface FipeModelo {
  codigo: number;
  nome: string;
}

export interface FipeAno {
  codigo: string;
  nome: string;
}

export interface ModeloCarro {
  id: number;
  nome: string;
  motorizacaoPadrao: string;
  capacidadeTanqueLitros: number;
}

export interface Marca {
  id: number;
  nome: string;
  modelos?: ModeloCarro[];
}

export interface DespesaBase {
  id: string;
  veiculoId: string;
  data: string;
  valor: number;
  kmRegistro: number;
  tipo: TipoDespesa;
  observacoes?: string;
}

export interface Abastecimento extends DespesaBase {
  tipo: 'COMBUSTIVEL';
  litros: number;
  precoPorLitro: number;
  tipoCombustivel: 'Gasolina Comum' | 'Gasolina Podium/Octapro' | 'Etanol' | 'Diesel S10';
}

export interface ManutencaoRealizada extends DespesaBase {
  tipo: 'MANUTENCAO';
  oficina: string;
  pecasTrocadas: string[];
  garantiaDias: number;
}

export interface DespesaGeral extends DespesaBase {
  tipo: 'IMPOSTO_SEGURO' | 'ESTETICA' | 'UPGRADE_STAGE';
}

export type Despesa = Abastecimento | ManutencaoRealizada | DespesaGeral;

export interface PecaMonitoradaBase {
  id: string;
  veiculoId: string;
  nome: string;
  kmInstalacao: number;
  vidaUtilEstimadaKm: number;
}

export interface Pneu extends PecaMonitoradaBase {
  tipoPeca: 'PNEU';
  posicao: 'Dianteiro Esquerdo' | 'Dianteiro Direito' | 'Traseiro Esquerdo' | 'Traseiro Direito';
  dot: string;
  medida: string;
}

export type CategoriaComponente = 
  | 'Oleo & Fluidos'
  | 'Freios' 
  | 'Fluidos e Filtros' 
  | 'Filtros'
  | 'Suspensão' 
  | 'Correias' 
  | 'Ignição' 
  | 'Transmissão'
  | string;

export interface ComponenteGenerico extends PecaMonitoradaBase {
  tipoPeca: 'GENERICO';
  categoria: CategoriaComponente;
  intervaloMaximoMeses?: number;
}

export type PecaMonitorada = Pneu | ComponenteGenerico;

export interface ItemStage {
  id: string;
  veiculoId: string;
  nomeModificacao: string;
  nivelStage: 1 | 2 | 3;
  custoEstimado: number;
  dataPlanejada?: string;
  status: StatusStage;
}

export interface ManutencaoProgramada {
  id: string;
  veiculoId: string;
  descricaoServico: string;
  kmLimite: number;
  dataLimite: string;
  concluida: boolean;
}

export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  motorizacao: string;
  kmAtual: number;
  placa: string;
  capacidadeTanqueLitros: number;
  despesas: Despesa[];
  pecas: PecaMonitorada[];
  stages: ItemStage[];
  manutencoesFuturas: ManutencaoProgramada[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  apelidoPiloto?: string;
  nivelGearhead: 'Entusiasta' | 'Trackday Hero' | 'Stage 2 Pro' | 'Mestre Mecânico';
  criadoEm: string;
  lembrarAcesso?: boolean;
}

export interface AuthSession {
  autenticado: boolean;
  usuarioAtual: Usuario | null;
  token?: string;
}
