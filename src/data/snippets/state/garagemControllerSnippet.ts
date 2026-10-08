import { CodeSnippet } from '../types';

export const garagemControllerSnippet: CodeSnippet = {
  id: 'garagem-controller',
  title: 'GaragemController (ChangeNotifier & MultiProvider MVVM)',
  fileName: 'lib/features/garage/presentation/controllers/garagem_controller.dart',
  language: 'dart',
  category: 'state',
  description: 'Gerenciamento de estado reativo integrando SQLite nativo, eventos de UI, telemetria de desgaste e Provider.',
  code: `import 'package:flutter/foundation.dart';
import '../../../../domain/models/models.dart';
import '../../../finance/data/repositories/despesa_repository.dart';
import '../../../stages/data/repositories/stages_repository.dart';
import '../../data/repositories/pecas_repository.dart';
import '../../data/repositories/veiculo_repository.dart';

/// Controller reativo (ChangeNotifier - MVVM) para o GearCost
/// Conecta a persistência SQLite diretamente às ações da UI
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

  // --- ESTADO REATIVO ---
  List<Veiculo> _veiculos = [];
  Veiculo? _veiculoAtivo;
  bool _isLoading = false;
  String? _errorMessage;

  List<Veiculo> get veiculos => List.unmodifiable(_veiculos);
  Veiculo? get veiculoAtivo => _veiculoAtivo;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get temVeiculoAtivo => _veiculoAtivo != null;

  // Cálculos reativos derivados
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

  // --- 1. CARREGAMENTO INICIAL & SELEÇÃO ---
  Future<void> carregarVeiculos() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _veiculos = await _veiculoRepo.obterTodos();
      if (_veiculos.isNotEmpty) {
        final idAtivo = _veiculoAtivo?.id ?? _veiculos.first.id!;
        await selecionarVeiculo(idAtivo);
      } else {
        _veiculoAtivo = null;
      }
    } catch (e) {
      _errorMessage = 'Erro ao carregar veículos: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> selecionarVeiculo(int id) async {
    _isLoading = true;
    notifyListeners();
    try {
      final veiculoCompleto = await _veiculoRepo.obterPorId(id);
      if (veiculoCompleto != null) {
        _veiculoAtivo = veiculoCompleto;
        final index = _veiculos.indexWhere((v) => v.id == id);
        if (index != -1) _veiculos[index] = veiculoCompleto;
      }
    } catch (e) {
      _errorMessage = 'Erro ao buscar veículo: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // --- 2. ATUALIZAR ODÔMETRO (Recálculo dinâmico de desgaste) ---
  Future<void> atualizarKm(double novoKm) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;
    if (novoKm < _veiculoAtivo!.kmAtual) {
      _errorMessage = 'O novo KM deve ser maior ou igual ao odômetro atual.';
      notifyListeners();
      return;
    }

    try {
      // Atualiza no banco SQLite
      await _veiculoRepo.atualizarKm(_veiculoAtivo!.id!, novoKm);
      // Atualiza entidade em memória (as peças recalculam desgaste dinamicamente)
      _veiculoAtivo!.atualizarQuilometragem(novoKm);
      _errorMessage = null;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao atualizar odômetro: \$e';
      notifyListeners();
    }
  }

  // --- 3. LANÇAMENTO DE DESPESAS ---
  Future<void> adicionarDespesa(Despesa despesa) async {
    if (_veiculoAtivo == null || _veiculoAtivo!.id == null) return;

    try {
      final novoId = await _despesaRepo.inserirDespesa(despesa);
      final map = despesa.toMap();
      map['id'] = novoId;
      final despesaPersistida = Despesa.fromMap(map);

      _veiculoAtivo!.despesas.insert(0, despesaPersistida);

      if (despesa.kmRegistro > _veiculoAtivo!.kmAtual) {
        await atualizarKm(despesa.kmRegistro);
      } else {
        notifyListeners();
      }
    } catch (e) {
      _errorMessage = 'Falha ao adicionar despesa: \$e';
      notifyListeners();
    }
  }

  Future<void> removerDespesa(int id) async {
    if (_veiculoAtivo == null) return;

    try {
      await _despesaRepo.removerDespesa(id);
      _veiculoAtivo!.despesas.removeWhere((d) => d.id == id);
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao remover despesa: \$e';
      notifyListeners();
    }
  }

  // --- 4. TELEMETRIA: RESETAR DESGASTE DE PEÇA ---
  Future<void> substituirPeca(int pecaId) async {
    if (_veiculoAtivo == null) return;

    final kmAtual = _veiculoAtivo!.kmAtual;
    try {
      await _pecasRepo.substituirPeca(pecaId, kmAtual);
      final index = _veiculoAtivo!.pecas.indexWhere((p) => p.id == pecaId);
      if (index != -1) {
        _veiculoAtivo!.pecas[index].registrarSubstituicao(kmAtual);
      }
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao substituir peça: \$e';
      notifyListeners();
    }
  }

  // --- 5. STAGES: ALTERNAR STATUS DE UPGRADE ---
  Future<void> alternarStatusStage(int stageId, StatusStage novoStatus) async {
    if (_veiculoAtivo == null) return;

    try {
      await _stagesRepo.atualizarStatus(stageId, novoStatus);
      final stage = _veiculoAtivo!.stages.firstWhere((s) => s.id == stageId);
      stage.atualizarStatus(novoStatus);
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Falha ao atualizar stage: \$e';
      notifyListeners();
    }
  }
}
`
};
