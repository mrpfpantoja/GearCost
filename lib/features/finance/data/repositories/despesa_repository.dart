import 'package:sqflite/sqflite.dart';
import '../../../../data/datasources/local/database_helper.dart';
import '../../../../domain/contracts/i_despesa_repository.dart';
import '../../../../domain/models/models.dart';

/// Repositório de acesso a dados locais para despesas (combustível, manutenção, impostos, upgrades)
/// Implementa IDespesaRepository (ISP e DIP)
class DespesaRepository implements IDespesaRepository {
  final DatabaseHelper _dbHelper;

  DespesaRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Insere uma nova despesa polimórfica (Abastecimento, ManutencaoRealizada ou DespesaGeral)
  Future<int> inserirDespesa(Despesa despesa) async {
    final db = await _dbHelper.database;
    return await db.insert(
      'despesas',
      despesa.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Remove uma despesa pelo ID
  Future<int> removerDespesa(int id) async {
    final db = await _dbHelper.database;
    return await db.delete(
      'despesas',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Lista todas as despesas vinculadas a um veículo ordenadas por data decrescente
  Future<List<Despesa>> listarPorVeiculo(int veiculoId) async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'despesas',
      where: 'veiculo_id = ?',
      whereArgs: [veiculoId],
      orderBy: 'data DESC, id DESC',
    );

    return List.generate(maps.length, (i) => Despesa.fromMap(maps[i]));
  }

  /// Retorna o somatório financeiro total para o veículo direto no SQLite
  Future<double> calcularTotalPorVeiculo(int veiculoId) async {
    final db = await _dbHelper.database;
    final result = await db.rawQuery(
      'SELECT SUM(valor) as total FROM despesas WHERE veiculo_id = ?',
      [veiculoId],
    );

    final total = result.first['total'];
    if (total == null) return 0.0;
    return (total as num).toDouble();
  }
}
