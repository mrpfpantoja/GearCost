import React, { useState, useEffect } from 'react';
import { Car, CheckCircle2, RefreshCw, Check } from 'lucide-react';
import { Veiculo, FipeMarca, FipeModelo, FipeAno } from '../../../types/gearcost';
import { fetchFipeMarcas, fetchFipeModelos, fetchFipeAnos } from '../../../services/fipeApi';

interface CadastroVeiculoTabProps {
  onAddVeiculo: (novoVeiculo: Veiculo) => void;
  onNavigateGaragem: () => void;
}

export const CadastroVeiculoTab: React.FC<CadastroVeiculoTabProps> = ({
  onAddVeiculo,
  onNavigateGaragem,
}) => {
  const [fipeMarcas, setFipeMarcas] = useState<FipeMarca[]>([]);
  const [fipeModelos, setFipeModelos] = useState<FipeModelo[]>([]);
  const [fipeAnos, setFipeAnos] = useState<FipeAno[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<FipeMarca | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState<FipeModelo | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<FipeAno | null>(null);
  const [placaInput, setPlacaInput] = useState('');
  const [motorizacaoInput, setMotorizacaoInput] = useState('');
  const [kmInput, setKmInput] = useState('42000');
  const [tanqueInput, setTanqueInput] = useState('50.0');

  const [loadingFipe, setLoadingFipe] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnos, setLoadingAnos] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadMarcas() {
      setLoadingFipe(true);
      const res = await fetchFipeMarcas();
      setFipeMarcas(res.marcas);
      setLoadingFipe(false);
    }
    loadMarcas();
  }, []);

  const handleSelectMarca = async (marcaCodigo: string) => {
    const marca = fipeMarcas.find((m) => m.codigo === marcaCodigo) || null;
    setMarcaSelecionada(marca);
    setModeloSelecionado(null);
    setAnoSelecionado(null);
    setFipeModelos([]);
    setFipeAnos([]);

    if (marca) {
      setLoadingModelos(true);
      const res = await fetchFipeModelos(marca.codigo);
      setFipeModelos(res.modelos);
      setLoadingModelos(false);
    }
  };

  const handleSelectModelo = async (modeloCodigo: string) => {
    const modelo = fipeModelos.find((m) => m.codigo.toString() === modeloCodigo) || null;
    setModeloSelecionado(modelo);
    setAnoSelecionado(null);
    setFipeAnos([]);

    if (modelo && marcaSelecionada) {
      setLoadingAnos(true);
      const res = await fetchFipeAnos(marcaSelecionada.codigo, modelo.codigo);
      setFipeAnos(res.anos);
      setLoadingAnos(false);
    }
  };

  const handleSalvarVeiculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado || !placaInput) {
      alert('Preencha os campos obrigatórios da Tabela Fipe e a placa do veículo.');
      return;
    }

    const anoNum = parseInt(anoSelecionado.nome.split(' ')[0]) || 2022;
    const kmNum = parseFloat(kmInput) || 0;
    const tanqueNum = parseFloat(tanqueInput) || 50;

    const novoVeiculo: Veiculo = {
      id: Date.now().toString(),
      marca: marcaSelecionada.nome,
      modelo: modeloSelecionado.nome,
      anoFabricacao: anoNum,
      motorizacao: motorizacaoInput.trim() || 'Motor Original',
      kmAtual: kmNum,
      placa: placaInput.toUpperCase().trim(),
      capacidadeTanqueLitros: tanqueNum,
      despesas: [],
      pecas: [
        {
          id: `p_${Date.now()}_1`,
          veiculoId: Date.now().toString(),
          nome: 'Jogo de Pneus Dianteiros',
          tipoPeca: 'PNEU',
          posicao: 'Dianteiro Esquerdo',
          dot: '2423',
          medida: '225/45 R17',
          kmInstalacao: kmNum,
          vidaUtilEstimadaKm: 40000,
        },
        {
          id: `p_${Date.now()}_2`,
          veiculoId: Date.now().toString(),
          nome: 'Pastilhas de Freio Dianteiras',
          tipoPeca: 'GENERICO',
          categoria: 'Freios',
          intervaloMaximoMeses: 24,
          kmInstalacao: kmNum,
          vidaUtilEstimadaKm: 30000,
        },
        {
          id: `p_${Date.now()}_3`,
          veiculoId: Date.now().toString(),
          nome: 'Óleo de Motor Sintético 5W-40',
          tipoPeca: 'GENERICO',
          categoria: 'Fluidos e Filtros',
          intervaloMaximoMeses: 12,
          kmInstalacao: kmNum,
          vidaUtilEstimadaKm: 10000,
        },
      ],
      stages: [
        {
          id: `s_${Date.now()}_1`,
          veiculoId: Date.now().toString(),
          nomeModificacao: 'Remap ECU Stage 1',
          nivelStage: 1,
          custoEstimado: 2800.0,
          status: 'PLANEJADO',
        },
      ],
      manutencoesFuturas: [
        {
          id: `m_${Date.now()}_1`,
          veiculoId: Date.now().toString(),
          descricaoServico: 'Revisão Básica Óleo e Filtros',
          kmLimite: kmNum + 10000,
          dataLimite: '2026-12-31',
          concluida: false,
        },
      ],
    };

    onAddVeiculo(novoVeiculo);
    setFormSuccessMessage(`Veículo ${novoVeiculo.modelo} cadastrado com sucesso no banco SQLite!`);
    setTimeout(() => {
      setFormSuccessMessage(null);
      onNavigateGaragem();
    }, 1800);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Cadastrar Veículo na Garagem
          </h3>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Dropdowns encadeados consumindo a API Oficial da Tabela Fipe
        </p>
      </div>

      {formSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{formSuccessMessage}</span>
        </div>
      )}

      <form onSubmit={handleSalvarVeiculo} className="space-y-3 text-xs">
        {/* 1. SELETOR DE MARCA */}
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">
            1. Marca do Veículo (Fipe)
          </label>
          {loadingFipe ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
              Carregando marcas Fipe...
            </div>
          ) : (
            <select
              value={marcaSelecionada?.codigo || ''}
              onChange={(e) => handleSelectMarca(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="">Selecione a marca...</option>
              {fipeMarcas.map((m) => (
                <option key={m.codigo} value={m.codigo}>
                  {m.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 2. SELETOR DE MODELO */}
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">
            2. Modelo do Veículo (Dependente)
          </label>
          {loadingModelos ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
              Carregando modelos da marca...
            </div>
          ) : (
            <select
              disabled={!marcaSelecionada}
              value={modeloSelecionado?.codigo || ''}
              onChange={(e) => handleSelectModelo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-40 focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="">
                {marcaSelecionada ? 'Selecione o modelo...' : 'Primeiro selecione a marca'}
              </option>
              {fipeModelos.map((m) => (
                <option key={m.codigo} value={m.codigo}>
                  {m.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 3. SELETOR DE ANO */}
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">
            3. Ano / Motorização Fipe
          </label>
          {loadingAnos ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" />
              Carregando versões e anos...
            </div>
          ) : (
            <select
              disabled={!modeloSelecionado}
              value={anoSelecionado?.codigo || ''}
              onChange={(e) => {
                const ano = fipeAnos.find((a) => a.codigo === e.target.value) || null;
                setAnoSelecionado(ano);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-40 focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="">
                {modeloSelecionado ? 'Selecione o ano...' : 'Primeiro selecione o modelo'}
              </option>
              {fipeAnos.map((a) => (
                <option key={a.codigo} value={a.codigo}>
                  {a.nome}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* PLACA */}
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">
            Placa do Veículo (ex: BRA2E19)
          </label>
          <input
            type="text"
            maxLength={7}
            placeholder="BRA2E19"
            value={placaInput}
            onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono tracking-widest font-bold focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* MOTORIZAÇÃO */}
        <div>
          <label className="text-[10px] font-bold text-slate-300 block mb-1">
            Especificações do Motor / Trim
          </label>
          <input
            type="text"
            placeholder="ex: 2.0 TSI 230cv EA888"
            value={motorizacaoInput}
            onChange={(e) => setMotorizacaoInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* KM INICIAL */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-300 block mb-1">
              KM Odômetro Atual
            </label>
            <input
              type="number"
              value={kmInput}
              onChange={(e) => setKmInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-300 block mb-1">
              Tanque (Litros)
            </label>
            <input
              type="number"
              value={tanqueInput}
              onChange={(e) => setTanqueInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Salvar Veículo no SQLite
        </button>
      </form>
    </div>
  );
};
