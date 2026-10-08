import { FipeMarca, FipeModelo, FipeAno } from '../types/gearcost';

const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

// Cache em memória para evitar chamadas redundantes (espelho da camada de cache local)
const cacheMarcas: { data: FipeMarca[] | null } = { data: null };
const cacheModelos: Record<string, FipeModelo[]> = {};
const cacheAnos: Record<string, FipeAno[]> = {};

// Dados offline de fallback para resiliência caso a API externa tenha CORS ou instabilidade
const FALLBACK_MARCAS: FipeMarca[] = [
  { codigo: '59', nome: 'VW - VolksWagen' },
  { codigo: '7', nome: 'BMW' },
  { codigo: '6', nome: 'Audi' },
  { codigo: '25', nome: 'Honda' },
  { codigo: '56', nome: 'Toyota' },
  { codigo: '23', nome: 'GM - Chevrolet' },
  { codigo: '22', nome: 'Ford' },
  { codigo: '47', nome: 'Porsche' },
  { codigo: '44', nome: 'Nissan' },
  { codigo: '55', nome: 'Subaru' },
];

const FALLBACK_MODELOS: Record<string, FipeModelo[]> = {
  '59': [
    { codigo: 4321, nome: 'Golf GTI 2.0 TSI 16V 4p Aut.' },
    { codigo: 4322, nome: 'Jetta GLI 350 TSI 2.0 16V 4p Aut.' },
    { codigo: 4323, nome: 'Polo GTS 1.4 TSI 16V Flex Aut.' },
    { codigo: 4324, nome: 'Passat CC 3.6 V6 300cv FSI Tiptronic' },
    { codigo: 4325, nome: 'Golf R 2.0 TSI 4Motion' }
  ],
  '7': [
    { codigo: 7101, nome: '320i M Sport 2.0 Turbo Flex 16V Aut.' },
    { codigo: 7102, nome: 'M3 Competition 3.0 Bi-Turbo 510cv' },
    { codigo: 7103, nome: 'M2 Coupe 3.0 Bi-Turbo Aut.' },
    { codigo: 7104, nome: '135i Coupe 3.0 24V 306cv' }
  ],
  '6': [
    { codigo: 6101, nome: 'S3 Sportback 2.0 TFSI Quattro S-tronic' },
    { codigo: 6102, nome: 'RS3 Sedan 2.5 TFSI Quattro S-tronic' },
    { codigo: 6103, nome: 'A4 Sedan 2.0 TFSI 190cv S-tronic' }
  ],
  '25': [
    { codigo: 2501, nome: 'Civic Si 2.4 16V 206cv 4p' },
    { codigo: 2502, nome: 'Civic Type R 2.0 Turbo 297cv' },
    { codigo: 2503, nome: 'Civic Touring 1.5 Turbo 16V 4p Aut.' }
  ],
  '47': [
    { codigo: 4701, nome: '911 Carrera S 3.0 Bi-Turbo PDK' },
    { codigo: 4702, nome: '718 Cayman GTS 4.0 400cv PDK' }
  ]
};

const FALLBACK_ANOS: Record<string, FipeAno[]> = {
  '4321': [
    { codigo: '2023-1', nome: '2023 Gasolina' },
    { codigo: '2020-1', nome: '2020 Gasolina' },
    { codigo: '2019-1', nome: '2019 Gasolina' },
    { codigo: '2018-1', nome: '2018 Gasolina' },
    { codigo: '2017-1', nome: '2017 Gasolina' }
  ],
  '7101': [
    { codigo: '2024-1', nome: '2024 Gasolina' },
    { codigo: '2023-1', nome: '2023 Gasolina' },
    { codigo: '2022-1', nome: '2022 Gasolina' },
    { codigo: '2021-1', nome: '2021 Gasolina' }
  ]
};

export async function fetchFipeMarcas(): Promise<{ marcas: FipeMarca[]; isFromCacheOrFallback: boolean }> {
  if (cacheMarcas.data && cacheMarcas.data.length > 0) {
    return { marcas: cacheMarcas.data, isFromCacheOrFallback: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${FIPE_BASE_URL}/marcas`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: FipeMarca[] = await res.json();
    cacheMarcas.data = data;
    return { marcas: data, isFromCacheOrFallback: false };
  } catch (err) {
    console.warn('API Fipe marcas offline ou bloqueada por CORS, utilizando catálogo offline resguardado.', err);
    return { marcas: FALLBACK_MARCAS, isFromCacheOrFallback: true };
  }
}

export async function fetchFipeModelos(marcaCodigo: string): Promise<{ modelos: FipeModelo[]; isFromCacheOrFallback: boolean }> {
  if (cacheModelos[marcaCodigo]) {
    return { modelos: cacheModelos[marcaCodigo], isFromCacheOrFallback: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${FIPE_BASE_URL}/marcas/${marcaCodigo}/modelos`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    const modelos: FipeModelo[] = data.modelos || [];
    cacheModelos[marcaCodigo] = modelos;
    return { modelos, isFromCacheOrFallback: false };
  } catch (err) {
    console.warn(`API Fipe modelos offline para marca ${marcaCodigo}, utilizando catálogo de fallback.`, err);
    const fallback = FALLBACK_MODELOS[marcaCodigo] || [
      { codigo: 9901, nome: 'Modelo Esportivo 2.0 Turbo' },
      { codigo: 9902, nome: 'Modelo Track Edition 1.6 16V' },
      { codigo: 9903, nome: 'Modelo Gran Turismo 3.0 6 Cil' }
    ];
    return { modelos: fallback, isFromCacheOrFallback: true };
  }
}

export async function fetchFipeAnos(marcaCodigo: string, modeloCodigo: number): Promise<{ anos: FipeAno[]; isFromCacheOrFallback: boolean }> {
  const key = `${marcaCodigo}_${modeloCodigo}`;
  if (cacheAnos[key]) {
    return { anos: cacheAnos[key], isFromCacheOrFallback: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${FIPE_BASE_URL}/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: FipeAno[] = await res.json();
    cacheAnos[key] = data;
    return { anos: data, isFromCacheOrFallback: false };
  } catch (err) {
    console.warn(`API Fipe anos offline para modelo ${modeloCodigo}, utilizando fallback.`, err);
    const fallback = FALLBACK_ANOS[modeloCodigo.toString()] || [
      { codigo: '2024-1', nome: '2024 Gasolina' },
      { codigo: '2023-1', nome: '2023 Gasolina' },
      { codigo: '2022-1', nome: '2022 Gasolina' },
      { codigo: '2021-1', nome: '2021 Gasolina' },
      { codigo: '2020-1', nome: '2020 Gasolina' }
    ];
    return { anos: fallback, isFromCacheOrFallback: true };
  }
}
