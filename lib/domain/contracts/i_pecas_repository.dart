import '../models/models.dart';

/// [ISP - Interface Segregation Principle]
/// Leitura de telemetria de peças
abstract class IPecasReader {
  Future<List<PecaMonitorada>> listarPorVeiculo(int veiculoId);
}

/// [ISP - Interface Segregation Principle]
/// Gestão cadastral de componentes monitorados
abstract class IPecasWriter {
  Future<int> inserirPeca(PecaMonitorada peca);
  Future<int> atualizarPeca(PecaMonitorada peca);
  Future<int> removerPeca(int pecaId);
}

/// [ISP - Interface Segregation Principle]
/// Manutenção de telemetria e reset de desgaste (substituição)
abstract class IPecasWearResetter {
  Future<int> substituirPeca(int pecaId, double kmAtual);
}

/// [DIP - Dependency Inversion Principle]
/// Contrato unificado do Repositório de Telemetria de Peças
abstract class IPecasRepository
    implements IPecasReader, IPecasWriter, IPecasWearResetter {}
