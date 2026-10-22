import 'package:sqflite/sqflite.dart';
import '../../../../data/datasources/local/database_helper.dart';
import '../../../../domain/contracts/i_veiculo_repository.dart';
import '../../../../domain/models/models.dart';

/// Repositório de acesso a dados locais para a entidade Veiculo
/// Implementa o contrato IVeiculoRepository (ISP e DIP)
class VeiculoRepository implements IVeiculoRepository {
  final DatabaseHelper _dbHelper;

  VeiculoRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  /// Busca todos os veículos cadastrados no SQLite ordenados por ID decrescente
  Future<List<Veiculo>> obterTodos() async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'veiculos',
      orderBy: 'id DESC',
    );

    return List.generate(maps.length, (i) => Veiculo.fromMap(maps[i]));
  }

  /// Busca o veículo agregador por ID com todas as suas coleções associadas:
  /// despesas, peças monitoradas e itens de stage
  Future<Veiculo?> obterPorId(int id) async {
    final db = await _dbHelper.database;

    final List<Map<String, dynamic>> maps = await db.query(
      'veiculos',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (maps.isEmpty) return null;

    final veiculo = Veiculo.fromMap(maps.first);

    // Carregar em paralelo as coleções filhas associadas via chave estrangeira
    final resultados = await Future.wait([
      db.query(
        'despesas',
        where: 'veiculo_id = ?',
        whereArgs: [id],
        orderBy: 'data DESC, id DESC',
      ),
      db.query(
        'pecas_monitoradas',
        where: 'veiculo_id = ?',
        whereArgs: [id],
        orderBy: 'id ASC',
      ),
      db.query(
        'itens_stage',
        where: 'veiculo_id = ?',
        whereArgs: [id],
        orderBy: 'nivel_stage ASC, id ASC',
      ),
    ]);

    veiculo.despesas.clear();
    veiculo.despesas.addAll(resultados[0].map((m) => Despesa.fromMap(m)).toList());

    veiculo.pecas.clear();
    veiculo.pecas.addAll(resultados[1].map((m) => PecaMonitorada.fromMap(m)).toList());

    veiculo.stages.clear();
    veiculo.stages.addAll(resultados[2].map((m) => ItemStage.fromMap(m)).toList());

    return veiculo;
  }

  /// Atualiza exclusivamente a coluna km_atual do veículo no banco
  Future<int> atualizarKm(int id, double novoKm) async {
    final db = await _dbHelper.database;
    return await db.update(
      'veiculos',
      {'km_atual': novoKm},
      where: 'id = ?',
      whereArgs: [id],
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Insere um novo veículo e retorna o id gerado (chama transação caso venha com peças iniciais)
  Future<int> inserirVeiculo(Veiculo veiculo) async {
    final db = await _dbHelper.database;

    return await db.transaction<int>((txn) async {
      final veiculoId = await txn.insert(
        'veiculos',
        veiculo.toMap(),
        conflictAlgorithm: ConflictAlgorithm.abort,
      );

      // Inserir peças iniciais vinculadas caso existam
      for (final peca in veiculo.pecas) {
        final pecaMap = peca.toMap();
        pecaMap['veiculo_id'] = veiculoId;
        await txn.insert('pecas_monitoradas', pecaMap);
      }

      // Inserir estágios iniciais vinculados caso existam
      for (final stage in veiculo.stages) {
        final stageMap = stage.toMap();
        stageMap['veiculo_id'] = veiculoId;
        await txn.insert('itens_stage', stageMap);
      }

      return veiculoId;
    });
  }

  /// Atualiza dados básicos do veículo (placa, motorização, odômetro, capacidade do tanque)
  Future<int> atualizarVeiculo(Veiculo veiculo) async {
    final db = await _dbHelper.database;
    return await db.update(
      'veiculos',
      {
        'marca': veiculo.marca,
        'modelo': veiculo.modelo,
        'ano_fabricacao': veiculo.anoFabricacao,
        'motorizacao': veiculo.motorizacao,
        'km_atual': veiculo.kmAtual,
        'placa': veiculo.placa,
        'capacidade_tanque_litros': veiculo.capacidadeTanqueLitros,
      },
      where: 'id = ?',
      whereArgs: [veiculo.id],
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Remove o veículo pelo ID (a deleção das despesas e peças é cascata via foreign keys)
  Future<int> removerVeiculo(int id) async {
    final db = await _dbHelper.database;
    return await db.delete(
      'veiculos',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Alias de conveniência para exclusão com integridade referencial em cascata
  Future<int> deletarVeiculo(int id) async => await removerVeiculo(id);
}
