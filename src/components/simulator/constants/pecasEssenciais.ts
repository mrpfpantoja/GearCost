export interface PecaCatalogoItem {
  nome: string;
  categoria: string;
  tipoPeca: 'GENERICO' | 'PNEU';
  vidaUtilKm: number;
  intervaloMeses?: number;
  descricao: string;
  icone: string;
  badge: string;
  posicao?: 'Dianteiro Esquerdo' | 'Dianteiro Direito' | 'Traseiro Esquerdo' | 'Traseiro Direito';
  medida?: string;
  dot?: string;
}

export interface CategoriaCatalogo {
  categoriaTipo: string;
  categoriaLabel: string;
  icone: string;
  itens: PecaCatalogoItem[];
}

// Catálogo de Peças e Fluidos Essenciais para Acompanhamento e Manutenção Preventiva
export const PECAS_ESSENCIAIS_CATALOGO: CategoriaCatalogo[] = [
  {
    categoriaTipo: 'OLEO_FLUIDOS',
    categoriaLabel: 'Óleo do Motor & Fluidos',
    icone: '🛢️',
    itens: [
      {
        nome: 'Óleo Sintético 5W-40 + Filtro Mann',
        categoria: 'Oleo & Fluidos',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 8000,
        intervaloMeses: 12,
        descricao: 'Lubrificante 100% sintético para motor com troca de filtro',
        icone: '🛢️',
        badge: '8.000 KM • Motor',
      },
      {
        nome: 'Fluido de Freio Alta Performance DOT 5.1',
        categoria: 'Oleo & Fluidos',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 20000,
        intervaloMeses: 24,
        descricao: 'Fluido sintético de alta temperatura (>260°C) para frenagens intensas',
        icone: '💧',
        badge: '20.000 KM • Freios',
      },
      {
        nome: 'Líquido de Arrefecimento Inugel Orgânico',
        categoria: 'Oleo & Fluidos',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 40000,
        intervaloMeses: 24,
        descricao: 'Fluido anticorrosivo para radiador e controle térmico',
        icone: '❄️',
        badge: '40.000 KM • Arrefecimento',
      },
      {
        nome: 'Óleo de Câmbio / Transmissão DSG / MT',
        categoria: 'Transmissão',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 60000,
        intervaloMeses: 36,
        descricao: 'Fluido para mecatrônica e pacote de embreagens banhadas a óleo',
        icone: '⚙️',
        badge: '60.000 KM • Câmbio',
      },
    ],
  },
  {
    categoriaTipo: 'FREIOS',
    categoriaLabel: 'Pastilhas & Discos de Freio',
    icone: '🛑',
    itens: [
      {
        nome: 'Pastilhas de Freio Dianteiras Cerâmica',
        categoria: 'Freios',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 30000,
        intervaloMeses: 24,
        descricao: 'Pastilhas dianteiras cerâmicas de alta resposta sem fadiga térmica',
        icone: '🛑',
        badge: '30.000 KM • Dianteiras',
      },
      {
        nome: 'Pastilhas de Freio Traseiras Cerâmica',
        categoria: 'Freios',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 40000,
        intervaloMeses: 36,
        descricao: 'Pastilhas traseiras para pinças e freio de mão elétrico',
        icone: '🛑',
        badge: '40.000 KM • Traseiras',
      },
      {
        nome: 'Discos de Freio Ventilados Dianteiros',
        categoria: 'Freios',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 60000,
        intervaloMeses: 48,
        descricao: 'Par de rotores dianteiros ventilados de 312mm',
        icone: '💿',
        badge: '60.000 KM • Dianteiros',
      },
      {
        nome: 'Discos de Freio Sólidos Traseiros',
        categoria: 'Freios',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 70000,
        intervaloMeses: 48,
        descricao: 'Par de rotores traseiros com espessura nominal segura',
        icone: '💿',
        badge: '70.000 KM • Traseiros',
      },
    ],
  },
  {
    categoriaTipo: 'PNEUS',
    categoriaLabel: 'Pneus & Rodas',
    icone: '🛞',
    itens: [
      {
        nome: 'Pneus Dianteiros Esportivos (DE + DD)',
        categoria: 'Pneus',
        tipoPeca: 'PNEU',
        posicao: 'Dianteiro Esquerdo',
        medida: '225/45 R17',
        dot: '1026',
        vidaUtilKm: 40000,
        descricao: 'Par dianteiro com composto macio e rodízio preventivo',
        icone: '🛞',
        badge: '40.000 KM • Dianteiros',
      },
      {
        nome: 'Pneus Traseiros Esportivos (TE + TD)',
        categoria: 'Pneus',
        tipoPeca: 'PNEU',
        posicao: 'Traseiro Esquerdo',
        medida: '225/45 R17',
        dot: '1026',
        vidaUtilKm: 45000,
        descricao: 'Par traseiro para tração e estabilidade lateral',
        icone: '🛞',
        badge: '45.000 KM • Traseiros',
      },
    ],
  },
  {
    categoriaTipo: 'FILTROS',
    categoriaLabel: 'Filtros & Admissão',
    icone: '💨',
    itens: [
      {
        nome: 'Filtro de Ar do Motor de Alta Vazão',
        categoria: 'Filtros',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 15000,
        intervaloMeses: 12,
        descricao: 'Elemento filtrante de admissão direta esportivo / inbox',
        icone: '💨',
        badge: '15.000 KM • Motor',
      },
      {
        nome: 'Filtro de Cabine / Ar-Condicionado',
        categoria: 'Filtros',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 15000,
        intervaloMeses: 12,
        descricao: 'Filtro purificador com carvão ativado antimicrobiano',
        icone: '💨',
        badge: '15.000 KM • Cabine',
      },
      {
        nome: 'Filtro de Combustível Linha Principal',
        categoria: 'Filtros',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 20000,
        intervaloMeses: 24,
        descricao: 'Proteção contra impurezas para a bomba de alta pressão',
        icone: '💨',
        badge: '20.000 KM • Combustível',
      },
    ],
  },
  {
    categoriaTipo: 'IGNICAO',
    categoriaLabel: 'Motor & Ignição',
    icone: '⚡',
    itens: [
      {
        nome: 'Velas de Ignição Laser Iridium',
        categoria: 'Ignição',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 35000,
        intervaloMeses: 36,
        descricao: 'Eletrodo fino de irídio com queima otimizada e sem falhas',
        icone: '⚡',
        badge: '35.000 KM • Velas',
      },
      {
        nome: 'Correia Dentada & Tensor de Sincronismo',
        categoria: 'Correias',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 60000,
        intervaloMeses: 48,
        descricao: 'Sincronismo de comando de válvulas do cabeçote',
        icone: '🔗',
        badge: '60.000 KM • Correia',
      },
    ],
  },
  {
    categoriaTipo: 'SUSPENSAO',
    categoriaLabel: 'Suspensão & Chassi',
    icone: '🔩',
    itens: [
      {
        nome: 'Amortecedores Pressurizados a Gás',
        categoria: 'Suspensão',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 60000,
        intervaloMeses: 48,
        descricao: 'Conjunto pressurizado dianteiro/traseiro com batentes',
        icone: '🔩',
        badge: '60.000 KM • Amortecedor',
      },
      {
        nome: 'Buchas de Bandeja & Barra Estabilizadora',
        categoria: 'Suspensão',
        tipoPeca: 'GENERICO',
        vidaUtilKm: 50000,
        intervaloMeses: 36,
        descricao: 'Borrachas de sustentação e geometria de suspensão',
        icone: '🔩',
        badge: '50.000 KM • Buchas',
      },
    ],
  },
];
