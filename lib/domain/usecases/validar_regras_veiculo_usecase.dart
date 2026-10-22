import '../models/models.dart';

/// [SRP - Single Responsibility Principle]
/// Responsável pelas regras e invariantes de integridade do veículo e garagem
class ValidarRegrasVeiculoUseCase {
  const ValidarRegrasVeiculoUseCase();

  /// Valida se a nova quilometragem é válida (não pode regredir)
  String? validarNovoKm(double kmAtual, double novoKm) {
    if (novoKm < 0) {
      return 'Quilometragem não pode ser negativa.';
    }
    if (novoKm < kmAtual) {
      return 'O novo KM não pode ser menor que o atual ($kmAtual km).';
    }
    return null;
  }

  /// Valida se a exclusão do veículo é permitida
  String? validarExclusaoVeiculo(List<Veiculo> veiculos, int veiculoId) {
    if (veiculos.length <= 1) {
      return 'Não é permitido excluir o único veículo da garagem.';
    }
    final existe = veiculos.any((v) => v.id == veiculoId);
    if (!existe) {
      return 'Veículo não encontrado na frota ativa.';
    }
    return null;
  }
}
