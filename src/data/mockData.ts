import { Veiculo, Usuario } from '../types/gearcost';

export const DEFAULT_USUARIO: Usuario = {
  id: 'u_1',
  nome: 'Marcus Vinícius Silva',
  email: 'marcus.racing@gearcost.app',
  telefone: '(11) 98452-1920',
  apelidoPiloto: 'MarcusGT #19',
  nivelGearhead: 'Stage 2 Pro',
  criadoEm: '2024-03-10',
  lembrarAcesso: true,
};

export const INITIAL_VEICULOS: Veiculo[] = [
  {
    id: '1',
    marca: 'VW - VolksWagen',
    modelo: 'Golf GTI 2.0 TSI 16V 4p Aut.',
    anoFabricacao: 2020,
    motorizacao: '2.0 TSI EA888 Gen 3 (230cv)',
    kmAtual: 58400,
    placa: 'BRA2E19',
    capacidadeTanqueLitros: 50.0,
    pecas: [
      {
        id: 'p1',
        veiculoId: '1',
        nome: 'Pneus Michelin Pilot Sport 4',
        tipoPeca: 'PNEU',
        posicao: 'Dianteiro Esquerdo',
        dot: '1223',
        medida: '225/45 R17',
        kmInstalacao: 20000,
        vidaUtilEstimadaKm: 40000, // (58400 - 20000) / 40000 = 38400 / 40000 = 96% -> Alerta crítico!
      },
      {
        id: 'p2',
        veiculoId: '1',
        nome: 'Pneus Michelin Pilot Sport 4',
        tipoPeca: 'PNEU',
        posicao: 'Dianteiro Direito',
        dot: '1223',
        medida: '225/45 R17',
        kmInstalacao: 20000,
        vidaUtilEstimadaKm: 40000, // 96% -> Alerta crítico!
      },
      {
        id: 'p3',
        veiculoId: '1',
        nome: 'Pastilhas de Freio Cerâmica Brembo',
        tipoPeca: 'GENERICO',
        categoria: 'Freios',
        intervaloMaximoMeses: 24,
        kmInstalacao: 35000,
        vidaUtilEstimadaKm: 30000, // (58400 - 35000) / 30000 = 23400 / 30000 = 78% -> Atenção
      },
      {
        id: 'p4',
        veiculoId: '1',
        nome: 'Óleo Motul 8100 X-cess 5W-40 + Filtro Mann',
        tipoPeca: 'GENERICO',
        categoria: 'Fluidos e Filtros',
        intervaloMaximoMeses: 12,
        kmInstalacao: 52000,
        vidaUtilEstimadaKm: 8000, // (58400 - 52000) / 8000 = 6400 / 8000 = 80%
      },
      {
        id: 'p5',
        veiculoId: '1',
        nome: 'Velas de Ignição NGK Laser Iridium (Grau 8)',
        tipoPeca: 'GENERICO',
        categoria: 'Ignição',
        intervaloMaximoMeses: 36,
        kmInstalacao: 45000,
        vidaUtilEstimadaKm: 30000, // (58400 - 45000) / 30000 = 13400 / 30000 = 44.6% -> OK
      }
    ],
    despesas: [
      {
        id: 'd1',
        veiculoId: '1',
        data: '2026-03-15',
        valor: 340.50,
        kmRegistro: 58400,
        tipo: 'COMBUSTIVEL',
        litros: 46.5,
        precoPorLitro: 7.32,
        tipoCombustivel: 'Gasolina Podium/Octapro',
        observacoes: 'Posto Petrobras - Tanque cheio pré-trackday'
      },
      {
        id: 'd2',
        veiculoId: '1',
        data: '2026-02-20',
        valor: 320.00,
        kmRegistro: 57920,
        tipo: 'COMBUSTIVEL',
        litros: 45.0,
        precoPorLitro: 7.11,
        tipoCombustivel: 'Gasolina Podium/Octapro'
      },
      {
        id: 'd3',
        veiculoId: '1',
        data: '2026-01-10',
        valor: 1450.00,
        kmRegistro: 52000,
        tipo: 'MANUTENCAO',
        oficina: 'PitStop Garage & Motorsport',
        pecasTrocadas: ['Óleo Motul 8100 5W40', 'Filtro Óleo Mann', 'Filtro de Cabine'],
        garantiaDias: 90,
        observacoes: 'Troca preventiva de fluidos com flush de motor'
      },
      {
        id: 'd4',
        veiculoId: '1',
        data: '2026-01-05',
        valor: 3890.00,
        kmRegistro: 51800,
        tipo: 'IMPOSTO_SEGURO',
        observacoes: 'IPVA 2026 cota única + Licenciamento'
      },
      {
        id: 'd5',
        veiculoId: '1',
        data: '2025-11-12',
        valor: 2400.00,
        kmRegistro: 48500,
        tipo: 'UPGRADE_STAGE',
        observacoes: 'Downpipe 3" em Inox 304 com manta térmica'
      }
    ],
    stages: [
      {
        id: 's1',
        veiculoId: '1',
        nomeModificacao: 'Remap ECU Stage 1 (ArmaSpeed / Revo)',
        nivelStage: 1,
        custoEstimado: 3200.00,
        dataPlanejada: '2025-05-10',
        status: 'INSTALADO'
      },
      {
        id: 's2',
        veiculoId: '1',
        nomeModificacao: 'Filtro de Ar Inbox K&N de Alto Fluxo',
        nivelStage: 1,
        custoEstimado: 650.00,
        dataPlanejada: '2025-05-15',
        status: 'INSTALADO'
      },
      {
        id: 's3',
        veiculoId: '1',
        nomeModificacao: 'Downpipe 3" Inox 304 + Catback Esportivo',
        nivelStage: 2,
        custoEstimado: 4500.00,
        dataPlanejada: '2025-11-12',
        status: 'COMPRADO'
      },
      {
        id: 's4',
        veiculoId: '1',
        nomeModificacao: 'Intercooler Frontal Maior Capacidade (Wagner Tuning)',
        nivelStage: 2,
        custoEstimado: 5800.00,
        dataPlanejada: '2026-06-30',
        status: 'PLANEJADO'
      },
      {
        id: 's5',
        veiculoId: '1',
        nomeModificacao: 'Turbina Híbrida IS38 + Remap TCU DSG DQ250',
        nivelStage: 3,
        custoEstimado: 12500.00,
        dataPlanejada: '2026-12-01',
        status: 'PLANEJADO'
      }
    ],
    manutencoesFuturas: [
      {
        id: 'm1',
        veiculoId: '1',
        descricaoServico: 'Substituição Pneus Dianteiros (Desgaste Crítico)',
        kmLimite: 59000,
        dataLimite: '2026-04-15',
        concluida: false
      },
      {
        id: 'm2',
        veiculoId: '1',
        descricaoServico: 'Troca de Óleo de Câmbio DSG (60.000 KM)',
        kmLimite: 60000,
        dataLimite: '2026-06-01',
        concluida: false
      },
      {
        id: 'm3',
        veiculoId: '1',
        descricaoServico: 'Descarbonização das Válvulas de Admissão',
        kmLimite: 65000,
        dataLimite: '2026-09-30',
        concluida: false
      }
    ]
  },
  {
    id: '2',
    marca: 'BMW',
    modelo: '320i M Sport 2.0 Turbo Flex 16V Aut.',
    anoFabricacao: 2022,
    motorizacao: '2.0 B48 Turbo (184cv original -> 260cv)',
    kmAtual: 34100,
    placa: 'RJS7F88',
    capacidadeTanqueLitros: 59.0,
    pecas: [
      {
        id: 'pb1',
        veiculoId: '2',
        nome: 'Pneus Pirelli P Zero RunFlat',
        tipoPeca: 'PNEU',
        posicao: 'Traseiro Direito',
        dot: '3422',
        medida: '255/40 R18',
        kmInstalacao: 0,
        vidaUtilEstimadaKm: 40000, // 34100 / 40000 = 85.25%
      },
      {
        id: 'pb2',
        veiculoId: '2',
        nome: 'Óleo Motor BMW TwinPower Turbo 0W-30',
        tipoPeca: 'GENERICO',
        categoria: 'Fluidos e Filtros',
        intervaloMaximoMeses: 12,
        kmInstalacao: 30000,
        vidaUtilEstimadaKm: 10000, // 4100 / 10000 = 41%
      }
    ],
    despesas: [
      {
        id: 'db1',
        veiculoId: '2',
        data: '2026-02-14',
        valor: 410.00,
        kmRegistro: 34100,
        tipo: 'COMBUSTIVEL',
        litros: 55.0,
        precoPorLitro: 7.45,
        tipoCombustivel: 'Gasolina Podium/Octapro'
      }
    ],
    stages: [
      {
        id: 'sb1',
        veiculoId: '2',
        nomeModificacao: 'Bootmod3 Stage 1 (Mapa 98 RON)',
        nivelStage: 1,
        custoEstimado: 3800.00,
        status: 'INSTALADO'
      }
    ],
    manutencoesFuturas: [
      {
        id: 'mb1',
        veiculoId: '2',
        descricaoServico: 'Revisão 40.000 KM Concessionária',
        kmLimite: 40000,
        dataLimite: '2026-08-10',
        concluida: false
      }
    ]
  }
];

export function calcularDesgastePeca(kmAtual: number, kmInstalacao: number, vidaUtil: number): number {
  if (vidaUtil <= 0) return 0;
  const desgaste = ((kmAtual - kmInstalacao) / vidaUtil) * 100;
  return Math.min(Math.max(desgaste, 0), 100);
}

export function precisaSubstituicao(desgastePercent: number): boolean {
  return desgastePercent >= 90;
}
