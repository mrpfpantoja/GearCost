import React, { useState } from 'react';
import { 
  Car, 
  Smartphone, 
  Code2, 
  Layers, 
  Gauge, 
  Flame, 
  Cpu, 
  ExternalLink,
  ShieldCheck,
  Activity,
  Github,
  Zap
} from 'lucide-react';
import { INITIAL_VEICULOS, DEFAULT_USUARIO, calcularDesgastePeca, precisaSubstituicao } from './data/mockData';
import { Veiculo, StatusStage, PecaMonitorada, Usuario, Despesa } from './types/gearcost';
import { StorageService } from './services/storageService';
import { MobileSimulator } from './components/simulator/MobileSimulator';
import { ArchitectureHub } from './components/ArchitectureHub';
import { UMLViewer } from './components/UMLViewer';

export default function App() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(() => StorageService.getVeiculos());
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string>(() => 
    StorageService.getSelectedVeiculoId('1')
  );
  const [activeMainTab, setActiveMainTab] = useState<'simulator' | 'architect' | 'split'>('split');
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(() => StorageService.getUsuario());

  // Seleção de Veículo ativo com persistência
  const handleSelectVeiculo = (id: string) => {
    setSelectedVeiculoId(id);
    StorageService.saveSelectedVeiculoId(id);
  };

  // Autenticação de Usuário com persistência
  const handleLogin = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
    StorageService.saveUsuario(usuario);
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    StorageService.saveUsuario(null);
  };

  const handleRegister = (novoUsuario: Usuario) => {
    setUsuarioLogado(novoUsuario);
    StorageService.saveUsuario(novoUsuario);
  };

  // Atualiza KM do veículo selecionado (odômetro) e persiste
  const handleUpdateKm = (veiculoId: string, novoKm: number) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return { ...v, kmAtual: novoKm };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Cadastra novo veículo na garagem, define como ativo e persiste
  const handleAddVeiculo = (novoVeiculo: Veiculo) => {
    setVeiculos(prev => {
      const updated = [novoVeiculo, ...prev];
      StorageService.saveVeiculos(updated);
      return updated;
    });
    setSelectedVeiculoId(novoVeiculo.id);
    StorageService.saveSelectedVeiculoId(novoVeiculo.id);
  };

  // Edita informações básicas do veículo existente e persiste
  const handleEditVeiculo = (veiculoId: string, dadosAtualizados: Partial<Veiculo>) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return { ...v, ...dadosAtualizados };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Exclui veículo da garagem com integridade referencial e fallback do carro ativo
  const handleDeleteVeiculo = (veiculoId: string) => {
    setVeiculos(prev => {
      // Regra de segurança: impede excluir se for o único carro
      if (prev.length <= 1) {
        return prev;
      }
      const updated = prev.filter(v => v.id !== veiculoId);
      StorageService.saveVeiculos(updated);

      // Se o veículo excluído era o ativo, redefinir automaticamente para o primeiro restante
      if (selectedVeiculoId === veiculoId && updated.length > 0) {
        const novoAtivoId = updated[0].id;
        setSelectedVeiculoId(novoAtivoId);
        StorageService.saveSelectedVeiculoId(novoAtivoId);
      }

      return updated;
    });
  };

  // Substituição / Reset de peça (zera KM de instalação para o KM atual) e persiste
  const handleResetPeca = (veiculoId: string, pecaId: string) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          const pecasAtualizadas = v.pecas.map(p => {
            if (p.id === pecaId) {
              return { ...p, kmInstalacao: v.kmAtual };
            }
            return p;
          });
          return { ...v, pecas: pecasAtualizadas };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Adiciona nova peça monitorada à telemetria e persiste
  const handleAddPeca = (veiculoId: string, novaPeca: PecaMonitorada) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return { ...v, pecas: [novaPeca, ...v.pecas] };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Edita peça monitorada na telemetria e persiste
  const handleEditPeca = (veiculoId: string, pecaAtualizada: PecaMonitorada) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return {
            ...v,
            pecas: v.pecas.map(p => p.id === pecaAtualizada.id ? pecaAtualizada : p)
          };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Exclui peça monitorada da telemetria e persiste
  const handleDeletePeca = (veiculoId: string, pecaId: string) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return {
            ...v,
            pecas: v.pecas.filter(p => p.id !== pecaId)
          };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Alterna status do item de Stage (PLANEJADO -> COMPRADO -> INSTALADO) e persiste
  const handleToggleStageStatus = (veiculoId: string, stageId: string, nextStatus: StatusStage) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          const stagesAtualizados = v.stages.map(s => {
            if (s.id === stageId) {
              return { ...s, status: nextStatus };
            }
            return s;
          });
          return { ...v, stages: stagesAtualizados };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Adiciona despesa no histórico do veículo e persiste
  const handleAddDespesa = (veiculoId: string, novaDespesa: Despesa) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return { ...v, despesas: [novaDespesa, ...v.despesas] };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  // Exclui despesa / lançamento do veículo e persiste
  const handleDeleteDespesa = (veiculoId: string, despesaId: string) => {
    setVeiculos(prev => {
      const updated = prev.map(v => {
        if (v.id === veiculoId) {
          return { ...v, despesas: v.despesas.filter(d => d.id !== despesaId) };
        }
        return v;
      });
      StorageService.saveVeiculos(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-orange-600/25">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">GearCost</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Lead Tech Architecture
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Gestão Financeira, Telemetria de Desgaste e Planejamento de Upgrades
              </p>
            </div>
          </div>

          {/* Seletor de Visão */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMainTab('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMainTab === 'split'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Visão Integrada (App + Código)
            </button>
            <button
              onClick={() => setActiveMainTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMainTab === 'simulator'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Simulador Mobile Flutter
            </button>
            <button
              onClick={() => setActiveMainTab('architect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMainTab === 'architect'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Arquitetura & Código Dart
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Banner de Destaque Técnico */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                  Especificação Técnica e Código Funcional
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                  Flutter 3.19+ &bull; SQLite nativo &bull; API Fipe
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                GearCost: Engenharia Automotiva & Finanças Mobile
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
                Arquitetura modular em camadas (MVVM), persistência ACID com integridade referencial <code className="text-slate-300 font-mono">PRAGMA foreign_keys = ON</code>, telemetria de desgaste de componentes com alerta crítico em &ge; 90%, e consumo cascateado assíncrono da Tabela Fipe.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Veículos na Garagem</div>
                <div className="text-base font-black text-white font-mono">
                  {veiculos.length} Carros
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Fórmula Telemetria</div>
                <div className="text-xs font-bold text-rose-400 font-mono">
                  &ge; 90% Alerta
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Condicional: Split, Mobile Only, ou Architect Only */}
        {activeMainTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Coluna Esquerda: Simulador Mobile Flutter Interativo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  Simulação do App Flutter
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Interaja com os KMs e abas
                </span>
              </div>

              <MobileSimulator
                veiculos={veiculos}
                selectedVeiculoId={selectedVeiculoId}
                onSelectVeiculo={handleSelectVeiculo}
                onUpdateKm={handleUpdateKm}
                onAddVeiculo={handleAddVeiculo}
                onEditVeiculo={handleEditVeiculo}
                onDeleteVeiculo={handleDeleteVeiculo}
                onResetPeca={handleResetPeca}
                onToggleStageStatus={handleToggleStageStatus}
                onAddDespesa={handleAddDespesa}
                onDeleteDespesa={handleDeleteDespesa}
                onAddPeca={handleAddPeca}
                onEditPeca={handleEditPeca}
                onDeletePeca={handleDeletePeca}
                usuarioLogado={usuarioLogado}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onRegister={handleRegister}
              />
            </div>

            {/* Coluna Direita: Lead Architect Code & Engineering Hub */}
            <div className="lg:col-span-7">
              <ArchitectureHub />
            </div>

          </div>
        )}

        {activeMainTab === 'simulator' && (
          <div className="max-w-xl mx-auto py-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Simulador do Aplicativo Mobile</h2>
              <p className="text-xs text-slate-400 mt-1">
                Teste em tempo real a experiência do usuário com odômetro, telemetria, despesas, upgrades e cadastro FIPE
              </p>
            </div>
            <MobileSimulator
              veiculos={veiculos}
              selectedVeiculoId={selectedVeiculoId}
              onSelectVeiculo={handleSelectVeiculo}
              onUpdateKm={handleUpdateKm}
              onAddVeiculo={handleAddVeiculo}
              onEditVeiculo={handleEditVeiculo}
              onDeleteVeiculo={handleDeleteVeiculo}
              onResetPeca={handleResetPeca}
              onToggleStageStatus={handleToggleStageStatus}
              onAddDespesa={handleAddDespesa}
              onDeleteDespesa={handleDeleteDespesa}
              onAddPeca={handleAddPeca}
              onEditPeca={handleEditPeca}
              onDeletePeca={handleDeletePeca}
              usuarioLogado={usuarioLogado}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onRegister={handleRegister}
            />
          </div>
        )}

        {activeMainTab === 'architect' && (
          <div className="max-w-6xl mx-auto">
            <ArchitectureHub />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">GearCost</span> &bull; 
            <span>Arquitetura de Software Mobile & Domínio Automotivo</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Dart &bull; Flutter &bull; SQLite &bull; Clean MVVM</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 font-mono">Null-Safety Estrita</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
