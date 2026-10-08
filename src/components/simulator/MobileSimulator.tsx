import React, { useState } from 'react';
import { Veiculo, StatusStage, PecaMonitorada, Usuario, DespesaBase } from '../../types/gearcost';
import { calcularDesgastePeca, precisaSubstituicao } from '../../data/mockData';
import { MobileFrame } from './layout/MobileFrame';
import { MobileHeader } from './layout/MobileHeader';
import { MobileBottomNav, TabType } from './layout/MobileBottomNav';
import { SnackBarToast, SnackBarToastData } from './layout/SnackBarToast';
import { GaragemTab } from './tabs/GaragemTab';
import { TelemetriaTab } from './tabs/TelemetriaTab';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { StagesTab } from './tabs/StagesTab';
import { CadastroVeiculoTab } from './tabs/CadastroVeiculoTab';
import { AuthTab } from './tabs/AuthTab';
import { ModalAtualizarKm } from './modals/ModalAtualizarKm';
import { ModalNovaDespesa } from './modals/ModalNovaDespesa';
import { ModalExcluirDespesa } from './modals/ModalExcluirDespesa';
import { ModalPecasEssenciais } from './modals/ModalPecasEssenciais';
import { ModalNovaPeca } from './modals/ModalNovaPeca';
import { ModalEditarPeca } from './modals/ModalEditarPeca';
import { ModalExcluirPeca } from './modals/ModalExcluirPeca';
import { ModalPerfilPiloto } from './modals/ModalPerfilPiloto';
import { ModalEsqueciSenha } from './modals/ModalEsqueciSenha';
import { ModalExcluirVeiculo, ModalEditarVeiculo } from './modals/ModalGerenciamentoVeiculo';

export interface MobileSimulatorProps {
  veiculos: Veiculo[];
  selectedVeiculoId: string;
  onSelectVeiculo: (id: string) => void;
  onUpdateKm: (veiculoId: string, novoKm: number) => void;
  onAddVeiculo: (novoVeiculo: Veiculo) => void;
  onEditVeiculo?: (veiculoId: string, dadosAtualizados: Partial<Veiculo>) => void;
  onDeleteVeiculo?: (veiculoId: string) => void;
  onResetPeca: (veiculoId: string, pecaId: string) => void;
  onToggleStageStatus: (veiculoId: string, stageId: string, nextStatus: StatusStage) => void;
  onAddDespesa: (veiculoId: string, despesa: any) => void;
  onDeleteDespesa: (veiculoId: string, despesaId: string) => void;
  onAddPeca: (veiculoId: string, novaPeca: PecaMonitorada) => void;
  onEditPeca: (veiculoId: string, pecaAtualizada: PecaMonitorada) => void;
  onDeletePeca: (veiculoId: string, pecaId: string) => void;
  usuarioLogado?: Usuario | null;
  onLogin?: (usuario: Usuario) => void;
  onLogout?: () => void;
  onRegister?: (novoUsuario: Usuario) => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  veiculos,
  selectedVeiculoId,
  onSelectVeiculo,
  onUpdateKm,
  onAddVeiculo,
  onEditVeiculo,
  onDeleteVeiculo,
  onResetPeca,
  onToggleStageStatus,
  onAddDespesa,
  onDeleteDespesa,
  onAddPeca,
  onEditPeca,
  onDeletePeca,
  usuarioLogado,
  onLogin,
  onLogout,
  onRegister,
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('garagem');
  const [snackBarToast, setSnackBarToast] = useState<SnackBarToastData | null>(null);

  // Modais de Controle
  const [showModalKm, setShowModalKm] = useState(false);
  const [showModalDespesa, setShowModalDespesa] = useState(false);
  const [showModalNovaPeca, setShowModalNovaPeca] = useState(false);
  const [showModalPecasEssenciais, setShowModalPecasEssenciais] = useState(false);
  const [showModalPerfil, setShowModalPerfil] = useState(false);
  const [showModalEsqueciSenha, setShowModalEsqueciSenha] = useState(false);
  const [despesaParaExcluir, setDespesaParaExcluir] = useState<DespesaBase | null>(null);
  const [pecaParaEditar, setPecaParaEditar] = useState<PecaMonitorada | null>(null);
  const [pecaParaExcluir, setPecaParaExcluir] = useState<PecaMonitorada | null>(null);

  // Modais de Gestão de Veículos (CRUD Garagem)
  const [veiculoParaEditar, setVeiculoParaEditar] = useState<Veiculo | null>(null);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState<Veiculo | null>(null);

  const veiculoAtual = veiculos.find((v) => v.id === selectedVeiculoId) || veiculos[0] || {
    id: '1',
    marca: 'Volkswagen',
    modelo: 'Golf GTI MK7.5',
    anoFabricacao: 2019,
    motorizacao: '2.0 TSI EA888 Gen3',
    kmAtual: 58450,
    placa: 'BRA2E19',
    capacidadeTanqueLitros: 50,
    despesas: [],
    pecas: [],
    stages: [],
    manutencoesFuturas: [],
  };

  const triggerToast = (message: string, isError = false) => {
    setSnackBarToast({ message, isError });
    setTimeout(() => setSnackBarToast(null), 3500);
  };

  const pecasCriticas = veiculoAtual.pecas.filter((p) => {
    const desgaste = calcularDesgastePeca(veiculoAtual.kmAtual, p.kmInstalacao, p.vidaUtilEstimadaKm);
    return precisaSubstituicao(desgaste);
  });

  const custoTotal = veiculoAtual.despesas.reduce((acc, d) => acc + d.valor, 0);
  const custoPorKm = veiculoAtual.kmAtual > 0 ? custoTotal / veiculoAtual.kmAtual : 0;
  const abastecimentos = veiculoAtual.despesas.filter((d) => d.tipo === 'COMBUSTIVEL');
  const totalLitros = abastecimentos.reduce((acc, a: any) => acc + (a.litros || 0), 0);
  const mediaKmPorLitro = totalLitros > 0 ? (veiculoAtual.kmAtual / totalLitros).toFixed(1) : '9.8';

  return (
    <MobileFrame>
      <MobileHeader
        veiculos={veiculos}
        veiculoAtual={veiculoAtual}
        selectedVeiculoId={selectedVeiculoId}
        onSelectVeiculo={onSelectVeiculo}
        usuarioLogado={usuarioLogado}
        onOpenPerfil={() => setShowModalPerfil(true)}
        onNavigateAuth={() => setCurrentTab('auth')}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {currentTab === 'garagem' && (
          <GaragemTab
            veiculos={veiculos}
            veiculoAtual={veiculoAtual}
            selectedVeiculoId={selectedVeiculoId}
            pecasCriticas={pecasCriticas}
            custoTotal={custoTotal}
            custoPorKm={custoPorKm}
            mediaKmPorLitro={mediaKmPorLitro}
            onSelectVeiculo={onSelectVeiculo}
            onUpdateKm={onUpdateKm}
            onOpenAtualizarKm={() => setShowModalKm(true)}
            onOpenNovaDespesa={() => setShowModalDespesa(true)}
            onNavigateTelemetria={() => setCurrentTab('telemetria')}
            onNavigateCadastro={() => setCurrentTab('cadastro')}
            onEditarVeiculo={(v) => setVeiculoParaEditar(v)}
            onSolicitarExcluirVeiculo={(v) => setVeiculoParaExcluir(v)}
          />
        )}
        {currentTab === 'telemetria' && (
          <TelemetriaTab
            veiculoAtual={veiculoAtual}
            onResetPeca={(vId, pId) => {
              onResetPeca(vId, pId);
              triggerToast('Desgaste da peça zerado com sucesso!');
            }}
            onOpenNovaPeca={() => setShowModalNovaPeca(true)}
            onOpenPecasEssenciais={() => setShowModalPecasEssenciais(true)}
            onEditarPeca={setPecaParaEditar}
            onExcluirPeca={setPecaParaExcluir}
          />
        )}
        {currentTab === 'financeiro' && (
          <FinanceiroTab
            veiculoAtual={veiculoAtual}
            onOpenNovaDespesa={() => setShowModalDespesa(true)}
            onSolicitarExcluirDespesa={setDespesaParaExcluir}
          />
        )}
        {currentTab === 'stages' && (
          <StagesTab veiculoAtual={veiculoAtual} onToggleStageStatus={onToggleStageStatus} />
        )}
        {currentTab === 'cadastro' && (
          <CadastroVeiculoTab 
            onAddVeiculo={(novo) => {
              onAddVeiculo(novo);
              triggerToast(`Veículo ${novo.modelo} adicionado à garagem!`);
            }} 
            onNavigateGaragem={() => setCurrentTab('garagem')} 
          />
        )}
        {currentTab === 'auth' && (
          <AuthTab
            usuarioLogado={usuarioLogado}
            onLogin={(u) => onLogin && onLogin(u)}
            onRegister={(u) => onRegister && onRegister(u)}
            onLogout={() => {
              if (onLogout) onLogout();
              triggerToast('Sessão encerrada com sucesso.');
            }}
            onNavigateGaragem={() => setCurrentTab('garagem')}
            onOpenPerfil={() => setShowModalPerfil(true)}
            onOpenEsqueciSenha={() => setShowModalEsqueciSenha(true)}
            onToast={triggerToast}
          />
        )}
      </div>

      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pecasCriticasCount={pecasCriticas.length}
        usuarioLogado={usuarioLogado}
      />

      <SnackBarToast toast={snackBarToast} onClose={() => setSnackBarToast(null)} />

      {/* ================================================================== */}
      {/* MODAIS DE GESTÃO E EXCLUSÃO CRÍTICA DE VEÍCULOS                    */}
      {/* ================================================================== */}
      <ModalExcluirVeiculo
        isOpen={Boolean(veiculoParaExcluir)}
        veiculo={veiculoParaExcluir}
        totalVeiculos={veiculos.length}
        onClose={() => setVeiculoParaExcluir(null)}
        onConfirmar={(id) => {
          if (onDeleteVeiculo) {
            onDeleteVeiculo(id);
          }
          const modelo = veiculoParaExcluir?.modelo || 'Veículo';
          setVeiculoParaExcluir(null);
          triggerToast(`${modelo} excluído permanentemente da garagem.`);
        }}
      />

      <ModalEditarVeiculo
        isOpen={Boolean(veiculoParaEditar)}
        veiculo={veiculoParaEditar}
        onClose={() => setVeiculoParaEditar(null)}
        onSalvar={(id, dados) => {
          if (onEditVeiculo) {
            onEditVeiculo(id, dados);
          }
          setVeiculoParaEditar(null);
          triggerToast('Dados do veículo atualizados com sucesso!');
        }}
      />

      {/* Modais Globais de Telemetria e Despesas */}
      <ModalAtualizarKm
        isOpen={showModalKm}
        kmAtual={veiculoAtual.kmAtual}
        onClose={() => setShowModalKm(false)}
        onSalvar={(novoKm) => {
          if (novoKm >= veiculoAtual.kmAtual) {
            onUpdateKm(veiculoAtual.id, novoKm);
            setShowModalKm(false);
            triggerToast(`Odômetro atualizado para ${novoKm.toLocaleString('pt-BR')} KM!`);
          } else {
            triggerToast('O novo KM deve ser igual ou superior ao KM anterior.', true);
          }
        }}
      />
      <ModalNovaDespesa
        isOpen={showModalDespesa}
        veiculoAtual={veiculoAtual}
        onClose={() => setShowModalDespesa(false)}
        onSalvar={(nova) => {
          onAddDespesa(veiculoAtual.id, nova);
          setShowModalDespesa(false);
          triggerToast(`Despesa de R$ ${nova.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} salva!`);
        }}
        onErrorToast={(msg) => triggerToast(msg, true)}
      />
      <ModalExcluirDespesa
        despesa={despesaParaExcluir}
        onClose={() => setDespesaParaExcluir(null)}
        onConfirmar={(id) => {
          onDeleteDespesa(veiculoAtual.id, id);
          setDespesaParaExcluir(null);
          triggerToast('Lançamento excluído com sucesso!');
        }}
      />
      <ModalPecasEssenciais
        isOpen={showModalPecasEssenciais}
        veiculoId={veiculoAtual.id}
        kmAtual={veiculoAtual.kmAtual}
        onClose={() => setShowModalPecasEssenciais(false)}
        onAddPeca={onAddPeca}
        onAbrirNovaPecaCustom={() => setShowModalNovaPeca(true)}
        onToast={(msg) => triggerToast(msg, false)}
      />
      <ModalNovaPeca
        isOpen={showModalNovaPeca}
        kmAtual={veiculoAtual.kmAtual}
        veiculoId={veiculoAtual.id}
        onClose={() => setShowModalNovaPeca(false)}
        onSalvar={(nova) => {
          onAddPeca(veiculoAtual.id, nova);
          setShowModalNovaPeca(false);
          triggerToast(`Peça "${nova.nome}" adicionada à telemetria!`);
        }}
        onErrorToast={(msg) => triggerToast(msg, true)}
      />
      <ModalEditarPeca
        peca={pecaParaEditar}
        kmAtual={veiculoAtual.kmAtual}
        onClose={() => setPecaParaEditar(null)}
        onSalvar={(atualizada) => {
          onEditPeca(veiculoAtual.id, atualizada);
          setPecaParaEditar(null);
          triggerToast(`Peça "${atualizada.nome}" atualizada com sucesso!`);
        }}
        onErrorToast={(msg) => triggerToast(msg, true)}
      />
      <ModalExcluirPeca
        peca={pecaParaExcluir}
        onClose={() => setPecaParaExcluir(null)}
        onConfirmar={(id) => {
          onDeletePeca(veiculoAtual.id, id);
          setPecaParaExcluir(null);
          triggerToast('Peça removida da telemetria!');
        }}
      />
      <ModalPerfilPiloto
        isOpen={showModalPerfil}
        usuarioLogado={usuarioLogado}
        veiculosCount={veiculos.length}
        pecasAtivasCount={veiculoAtual.pecas.length}
        onClose={() => setShowModalPerfil(false)}
        onTrocarConta={() => {
          setShowModalPerfil(false);
          setCurrentTab('auth');
        }}
        onLogout={() => {
          if (onLogout) onLogout();
          setShowModalPerfil(false);
          setCurrentTab('auth');
          triggerToast('Sessão encerrada com sucesso.');
        }}
      />
      <ModalEsqueciSenha
        isOpen={showModalEsqueciSenha}
        onClose={() => setShowModalEsqueciSenha(false)}
        onEnviar={(email) => {
          setShowModalEsqueciSenha(false);
          triggerToast(`Link de recuperação enviado para ${email}!`);
        }}
      />
    </MobileFrame>
  );
};
