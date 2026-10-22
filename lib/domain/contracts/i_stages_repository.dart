import '../models/models.dart';

/// [ISP - Interface Segregation Principle]
/// Leitura do roadmap de upgrades
abstract class IStagesReader {
  Future<List<ItemStage>> listarPorVeiculo(int veiculoId);
}

/// [ISP - Interface Segregation Principle]
/// Gestão e transição de status de modificações (Stages)
abstract class IStagesWriter {
  Future<int> inserirStage(ItemStage stage);
  Future<int> atualizarStatus(int stageId, StatusStage novoStatus);
  Future<int> removerStage(int stageId);
}

/// [DIP - Dependency Inversion Principle]
/// Contrato unificado do Repositório de Stages & Upgrades
abstract class IStagesRepository implements IStagesReader, IStagesWriter {}
