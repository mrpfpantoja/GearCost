import '../models/models.dart';

/// [ISP - Interface Segregation Principle]
/// Segrega leitura e histórico financeiro
abstract class IDespesaReader {
  Future<List<Despesa>> listarPorVeiculo(int veiculoId);
  Future<double> calcularTotalPorVeiculo(int veiculoId);
}

/// [ISP - Interface Segregation Principle]
/// Segrega inclusão e remoção de lançamentos financeiros
abstract class IDespesaWriter {
  Future<int> inserirDespesa(Despesa despesa);
  Future<int> removerDespesa(int id);
}

/// [DIP - Dependency Inversion Principle]
/// Contrato unificado do Repositório Financeiro
abstract class IDespesaRepository implements IDespesaReader, IDespesaWriter {}
