import 'package:sqflite/sqflite.dart';
import '../../../../data/datasources/local/database_helper.dart';
import '../../../../domain/contracts/i_stages_repository.dart';
import '../../../../domain/models/models.dart';

/// Repositório para o roadmap de stages e modificações veiculares
/// Implementa IStagesRepository (ISP e DIP)
class StagesRepository implements IStagesRepository {
  final DatabaseHelper _dbHelper;

  StagesRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Atualiza o status do upgrade (PLANEJADO -> COMPRADO -> INSTALADO)
  Future<int> atualizarStatus(int stageId, StatusStage novoStatus) async {
    final db = await _dbHelper.database;
    return await db.update(
      'itens_stage',
      {'status': novoStatus.valorBanco},
      where: 'id = ?',
      whereArgs: [stageId],
    );
  }

  /// Insere um novo item de stage no projeto do carro
  Future<int> inserirStage(ItemStage stage) async {
    final db = await _dbHelper.database;
    return await db.insert(
      'itens_stage',
      stage.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Remove um item de stage
  Future<int> removerStage(int stageId) async {
    final db = await _dbHelper.database;
    return await db.delete(
      'itens_stage',
      where: 'id = ?',
      whereArgs: [stageId],
    );
  }

  /// Lista todos os stages de um veículo ordenados por nível de stage
  Future<List<ItemStage>> listarPorVeiculo(int veiculoId) async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'itens_stage',
      where: 'veiculo_id = ?',
      whereArgs: [veiculoId],
      orderBy: 'nivel_stage ASC, id ASC',
    );

    return List.generate(maps.length, (i) => ItemStage.fromMap(maps[i]));
  }
}
