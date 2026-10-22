import '../models/models.dart';

/// [ISP - Interface Segregation Principle]
/// Segrega leitura para clientes que necessitam apenas de consultas
abstract class IVeiculoReader {
  Future<List<Veiculo>> obterTodos();
  Future<Veiculo?> obterPorId(int id);
}

/// [ISP - Interface Segregation Principle]
/// Segrega mutações cadastrais do veículo
abstract class IVeiculoWriter {
  Future<int> inserirVeiculo(Veiculo veiculo);
  Future<int> atualizarVeiculo(Veiculo veiculo);
  Future<int> deletarVeiculo(int id);
}

/// [ISP - Interface Segregation Principle]
/// Segrega atualização rápida de odômetro / telemetria
abstract class IOdometroUpdater {
  Future<int> atualizarKm(int id, double novoKm);
}

/// [DIP - Dependency Inversion Principle]
/// Contrato unificado do Repositório de Veículos para injeção de dependências
abstract class IVeiculoRepository
    implements IVeiculoReader, IVeiculoWriter, IOdometroUpdater {}
