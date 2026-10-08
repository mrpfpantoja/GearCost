import 'package:sqflite/sqflite.dart';
import '../../../../data/datasources/local/database_helper.dart';
import '../../../../domain/models/models.dart';

/// Repositório para peças monitoradas e telemetria de componentes / pneus
class PecasRepository {
  final DatabaseHelper _dbHelper;

  PecasRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Insere uma nova peça monitorada (Pneu ou ComponenteGenerico)
  Future<int> inserirPeca(PecaMonitorada peca) async {
    final db = await _dbHelper.database;
    return await db.insert(
      'pecas_monitoradas',
      peca.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Atualiza todos os dados de uma peça existente
  Future<int> atualizarPeca(PecaMonitorada peca) async {
    final db = await _dbHelper.database;
    return await db.update(
      'pecas_monitoradas',
      peca.toMap(),
      where: 'id = ?',
      whereArgs: [peca.id],
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Zera o desgaste da peça ao marcar substituição, definindo km_instalacao = kmAtual
  Future<int> substituirPeca(int pecaId, double kmAtual) async {
    final db = await _dbHelper.database;
    return await db.update(
      'pecas_monitoradas',
      {'km_instalacao': kmAtual},
      where: 'id = ?',
      whereArgs: [pecaId],
    );
  }

  /// Remove uma peça do monitoramento de telemetria
  Future<int> removerPeca(int pecaId) async {
    final db = await _dbHelper.database;
    return await db.delete(
      'pecas_monitoradas',
      where: 'id = ?',
      whereArgs: [pecaId],
    );
  }

  /// Lista todas as peças associadas a um veículo
  Future<List<PecaMonitorada>> listarPorVeiculo(int veiculoId) async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'pecas_monitoradas',
      where: 'veiculo_id = ?',
      whereArgs: [veiculoId],
      orderBy: 'id ASC',
    );

    return List.generate(maps.length, (i) => PecaMonitorada.fromMap(maps[i]));
  }
}
