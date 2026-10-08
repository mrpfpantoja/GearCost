import 'package:flutter/foundation.dart';
import '../../../../domain/models/models.dart';
import '../../../finance/data/repositories/despesa_repository.dart';
import '../../../stages/data/repositories/stages_repository.dart';
import '../../data/repositories/pecas_repository.dart';
import '../../data/repositories/veiculo_repository.dart';

/// Controller reativo (ChangeNotifier - MVVM) para gerenciamento da Garagem,
/// Telemetria de Desgaste, Módulo Financeiro e Roadmap de Stages.
class GaragemController extends ChangeNotifier {
  final VeiculoRepository _veiculoRepo;
  final DespesaRepository _despesaRepo;
  final PecasRepository _pecasRepo;
  final StagesRepository _stagesRepo;

  GaragemController({
    VeiculoRepository? veiculoRepo,
    DespesaRepository? despesaRepo,
    PecasRepository? pecasRepo,
    StagesRepository? stagesRepo,
  })  : _veiculoRepo = veiculoRepo ?? VeiculoRepository(),
        _despesaRepo = despesaRepo ?? DespesaRepository(),
        _pecasRepo = pecasRepo ?? PecasRepository(),
        _stagesRepo = stagesRepo ?? StagesRepository();

  // ==========================================================================
  // ESTADO REATIVO
  // ==========================================================================
  List<Veiculo> _veiculos = [];
  Veiculo? _veiculoAtivo;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters imutáveis para a View
  List<Veiculo> get veiculos => List.unmodifiable(_veiculos);
  Veiculo? get veiculoAtivo => _veiculoAtivo;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get temVeiculoAtivo => _veiculoAtivo != null;

  // Getters computados de conveniência para a UI
  double get custoTotal => _veiculoAtivo?.calcularCustoTotal() ?? 0.0;
  double get custoPorKm => _veiculoAtivo?.calcularCustoPorKm() ?? 0.0;
  double get odometroAtual => _veiculoAtivo?.kmAtual ?? 0.0;

  List<PecaMonitorada> get pecasCriticas {
    if (_veiculoAtivo == null) return [];
    return _veiculoAtivo!.pecas
        .where((p) => p.precisaSubstituicao(_veiculoAtivo!.kmAtual))
        .toList();
  }

  int get totalAlertasCriticos => pecasCriticas.length;

  // ==========================================================================
  // CARREGAMENTO E INICIALIZAÇÃO
  // ==========================================================================

  /// Carrega a lista completa de veículos do banco local SQLite
  Future<void> carregarVeiculos() async {
    _setLoading(true);
    _errorMessage = null;

    try {
      _veiculos = await _veiculoRepo.obterTodos();

      if (_veiculos.isNotEmpty) {
        // Se já tínhamos um selecionado, recarrega ele com as coleções filhas
        final idAtivo = _veiculoAtivo?.id ?? _veiculos.first.id!;
        await selecionarVeiculo(idAtivo);
      } else {
        _veiculoAtivo = null;
      }
    } catch (e) {
      _errorMessage = 'Erro ao carregar veículos: $e';
      debugPrint(_errorMessage);
    } finally {
      _setLoading(false);
    }
  }

  /// Seleciona o veículo ativo e carrega todas as suas despesas, peças e stages
  Future<void> selecionarVeiculo(int id) async {
    _setLoading(true);
    try {
      final veiculoCompleto = await _veiculoRepo.obterPorId(id);
      if (veiculoCompleto != null) {
        _veiculoAtivo = veiculoCompleto;

        // Atualiza a referência rápida na lista geral
        final index = _veiculos.indexWhere((v) => v.id == id);
        if (index != -1) {
          _veiculos[index] = veiculoCompleto;
        }
      }
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Erro ao selecionar veículo #$id: $e';
      debugPrint(_errorMessage);
    } finally {
      _setLoading(false);
    }
  }

  // ==========================================================================
  // 1. ATUALIZAR ODÔMETRO (QUILOMETRAGEM)
  // ==========================================================================

  /// Atualiza o odômetro no SQLite, recalcula o desgaste das peças em memória
  /// e notifica a interface do usuário.
  Future<void> atualizarKm(double novoKm) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;

    if (novoKm < _veiculoAtivo!.kmAtual) {
      _errorMessage = 'O novo KM não pode ser menor que o atual (${_veiculoAtivo!.kmAtual} km).';
      notifyListeners();
      return;
    }

    try {
      // 1. Persiste no SQLite
      await _veiculoRepo.atualizarKm(_veiculoAtivo!.id!, novoKm);

      // 2. Atualiza a entidade de domínio em memória
      _veiculoAtivo!.atualizarQuilometragem(novoKm);

      // 3. O recálculo de desgaste ocorre dinamicamente pois as peças usam calcularPercentualDesgaste(kmAtual)
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao atualizar odômetro: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  // ==========================================================================
  // 2. ADICIONAR DESPESA
  // ==========================================================================

  /// Insere uma nova despesa (Combustível, Manutenção, etc.) no SQLite,
  /// atualiza a lista em memória e notifica os ouvintes.
  Future<void> adicionarDespesa(Despesa despesa) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;

    try {
      // 1. Persiste no SQLite
      final novoId = await _despesaRepo.inserirDespesa(despesa);

      // 2. Clona ou vincula o ID gerado na entidade em memória
      Despesa despesaSalva;
      final map = despesa.toMap();
      map['id'] = novoId;
      despesaSalva = Despesa.fromMap(map);

      // 3. Atualiza o estado em memória (insere no topo por ordem de data)
      _veiculoAtivo!.despesas.insert(0, despesaSalva);

      // Se o KM do lançamento for maior que o atual do veículo, atualiza o odômetro
      if (despesa.kmRegistro > _veiculoAtivo!.kmAtual) {
        await atualizarKm(despesa.kmRegistro);
      }

      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao salvar despesa: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  // ==========================================================================
  // 3. REMOVER DESPESA
  // ==========================================================================

  /// Deleta a despesa no banco SQLite e remove da lista em memória
  Future<void> removerDespesa(int id) async {
    if (_veiculoAtivo == null) return;

    try {
      await _despesaRepo.removerDespesa(id);
      _veiculoAtivo!.despesas.removeWhere((d) => d.id == id);
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao excluir despesa: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  // ==========================================================================
  // 4. TELEMETRIA: SUBSTITUIR PEÇA (RESETAR DESGASTE)
  // ==========================================================================

  /// Zera o desgaste de um componente definindo kmInstalacao = kmAtual no SQLite
  /// e atualiza o estado em memória para feedback instantâneo na UI.
  Future<void> substituirPeca(int pecaId) async {
    if (_veiculoAtivo == null) return;

    final kmAtual = _veiculoAtivo!.kmAtual;

    try {
      // 1. Atualiza no SQLite nativo
      await _pecasRepo.substituirPeca(pecaId, kmAtual);

      // 2. Atualiza a peça em memória no estado ativo
      final index = _veiculoAtivo!.pecas.indexWhere((p) => p.id == pecaId);
      if (index != -1) {
        _veiculoAtivo!.pecas[index].registrarSubstituicao(kmAtual);
      }

      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao registrar substituição da peça: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  /// Cadastra uma nova peça para monitoramento na telemetria
  Future<void> adicionarPeca(PecaMonitorada peca) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;

    try {
      final novoId = await _pecasRepo.inserirPeca(peca);
      final map = peca.toMap();
      map['id'] = novoId;
      final pecaCriada = PecaMonitorada.fromMap(map);

      _veiculoAtivo!.pecas.add(pecaCriada);
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao adicionar peça: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  /// Remove o monitoramento de uma peça
  Future<void> removerPeca(int pecaId) async {
    if (_veiculoAtivo == null) return;

    try {
      await _pecasRepo.removerPeca(pecaId);
      _veiculoAtivo!.pecas.removeWhere((p) => p.id == pecaId);
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao remover peça: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  // ==========================================================================
  // 5. ROADMAP: ALTERNAR STATUS DE STAGE / UPGRADE
  // ==========================================================================

  /// Atualiza o ciclo de vida do upgrade ('PLANEJADO' -> 'COMPRADO' -> 'INSTALADO')
  Future<void> alternarStatusStage(int stageId, StatusStage novoStatus) async {
    if (_veiculoAtivo == null) return;

    try {
      // 1. Atualiza na tabela itens_stage do SQLite
      await _stagesRepo.atualizarStatus(stageId, novoStatus);

      // 2. Atualiza em memória
      final stage = _veiculoAtivo!.stages.firstWhere((s) => s.id == stageId);
      stage.atualizarStatus(novoStatus);

      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao alterar status do stage: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  /// Insere um novo item de modificação no roadmap de stages
  Future<void> adicionarStage(ItemStage stage) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;

    try {
      final novoId = await _stagesRepo.inserirStage(stage);
      final map = stage.toMap();
      map['id'] = novoId;
      final stageCriado = ItemStage.fromMap(map);

      _veiculoAtivo!.stages.add(stageCriado);
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao adicionar item de stage: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    }
  }

  // ==========================================================================
  // 6. GESTÃO E ADMINISTRAÇÃO DE FROTA (CRUD VEÍCULOS)
  // ==========================================================================

  /// Cadastra um novo veículo no SQLite e automaticamente o seleciona como ativo
  Future<void> cadastrarVeiculo(Veiculo novoVeiculo) async {
    _setLoading(true);
    try {
      final novoId = await _veiculoRepo.inserirVeiculo(novoVeiculo);
      await carregarVeiculos();
      await selecionarVeiculo(novoId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Falha ao cadastrar veículo: $e';
      debugPrint(_errorMessage);
    } finally {
      _setLoading(false);
    }
  }

  /// Edita dados de placa, motorização, odômetro e especificações do veículo
  Future<void> editarVeiculo(Veiculo veiculoAtualizado) async {
    if (veiculoAtualizado.id == null) return;
    _setLoading(true);
    try {
      await _veiculoRepo.atualizarVeiculo(veiculoAtualizado);
      
      // Atualiza na lista em memória
      final idx = _veiculos.indexWhere((v) => v.id == veiculoAtualizado.id);
      if (idx != -1) {
        _veiculos[idx] = veiculoAtualizado;
      }
      // Se for o ativo, atualiza
      if (_veiculoAtivo?.id == veiculoAtualizado.id) {
        await selecionarVeiculo(veiculoAtualizado.id!);
      }
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao atualizar veículo: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    } finally {
      _setLoading(false);
    }
  }

  /// Deleta um veículo no SQLite (com ON DELETE CASCADE em despesas, peças e stages)
  /// e ajusta automaticamente o veículo ativo para o primeiro remanescente caso o deletado estivesse ativo.
  Future<void> deletarVeiculo(int veiculoId) async {
    if (_veiculos.length <= 1) {
      _errorMessage = 'Não é permitido excluir o único veículo da garagem.';
      notifyListeners();
      return;
    }

    _setLoading(true);
    try {
      // 1. Remove do SQLite (Foreign Keys tratam a cascata)
      await _veiculoRepo.deletarVeiculo(veiculoId);

      // 2. Atualiza a lista em memória
      _veiculos.removeWhere((v) => v.id == veiculoId);

      // 3. Se o excluído era o ativo, redefinir para o primeiro restante
      if (_veiculoAtivo?.id == veiculoId) {
        if (_veiculos.isNotEmpty) {
          await selecionarVeiculo(_veiculos.first.id!);
        } else {
          _veiculoAtivo = null;
        }
      }

      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao excluir veículo da garagem: $e';
      debugPrint(_errorMessage);
      notifyListeners();
    } finally {
      _setLoading(false);
    }
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES
  // ==========================================================================
  void _setLoading(bool valor) {
    _isLoading = valor;
    notifyListeners();
  }

  void limparErro() {
    _errorMessage = null;
    notifyListeners();
  }
}
