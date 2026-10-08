import { CodeSnippet } from '../types';

export const repositoriesSnippet: CodeSnippet = {
  id: 'repositories',
  title: 'Repositórios Locais SQLite (CRUD & Transações sqflite)',
  fileName: 'lib/features/data/repositories/*.dart',
  language: 'dart',
  category: 'database',
  description: 'Camada de acesso a dados locais com operações assíncronas puras, queries relacionais e transações ACID.',
  code: `// ============================================================================
// 1. VEICULO REPOSITORY
// ============================================================================
import 'package:sqflite/sqflite.dart';
import '../../../../data/datasources/local/database_helper.dart';
import '../../../../domain/models/models.dart';

class VeiculoRepository {
  final DatabaseHelper _dbHelper;
  VeiculoRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  Future<List<Veiculo>> obterTodos() async {
    final db = await _dbHelper.database;
    final maps = await db.query('veiculos', orderBy: 'id DESC');
    return List.generate(maps.length, (i) => Veiculo.fromMap(maps[i]));
  }

  Future<Veiculo?> obterPorId(int id) async {
    final db = await _dbHelper.database;
    final maps = await db.query('veiculos', where: 'id = ?', whereArgs: [id], limit: 1);
    if (maps.isEmpty) return null;

    final veiculo = Veiculo.fromMap(maps.first);
    final resultados = await Future.wait([
      db.query('despesas', where: 'veiculo_id = ?', whereArgs: [id], orderBy: 'data DESC'),
      db.query('pecas_monitoradas', where: 'veiculo_id = ?', whereArgs: [id]),
      db.query('itens_stage', where: 'veiculo_id = ?', whereArgs: [id], orderBy: 'nivel_stage ASC'),
    ]);

    veiculo.despesas.addAll(resultados[0].map((m) => Despesa.fromMap(m)));
    veiculo.pecas.addAll(resultados[1].map((m) => PecaMonitorada.fromMap(m)));
    veiculo.stages.addAll(resultados[2].map((m) => ItemStage.fromMap(m)));
    return veiculo;
  }

  Future<int> atualizarKm(int id, double novoKm) async {
    final db = await _dbHelper.database;
    return await db.update('veiculos', {'km_atual': novoKm}, where: 'id = ?', whereArgs: [id]);
  }

  Future<int> inserirVeiculo(Veiculo veiculo) async {
    final db = await _dbHelper.database;
    return await db.transaction<int>((txn) async {
      final veiculoId = await txn.insert('veiculos', veiculo.toMap());
      for (final peca in veiculo.pecas) {
        final map = peca.toMap()..['veiculo_id'] = veiculoId;
        await txn.insert('pecas_monitoradas', map);
      }
      return veiculoId;
    });
  }
}

// ============================================================================
// 2. DESPESA REPOSITORY
// ============================================================================
class DespesaRepository {
  final DatabaseHelper _dbHelper;
  DespesaRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  Future<int> inserirDespesa(Despesa despesa) async {
    final db = await _dbHelper.database;
    return await db.insert('despesas', despesa.toMap());
  }

  Future<int> removerDespesa(int id) async {
    final db = await _dbHelper.database;
    return await db.delete('despesas', where: 'id = ?', whereArgs: [id]);
  }

  Future<List<Despesa>> listarPorVeiculo(int veiculoId) async {
    final db = await _dbHelper.database;
    final maps = await db.query('despesas', where: 'veiculo_id = ?', whereArgs: [veiculoId], orderBy: 'data DESC');
    return List.generate(maps.length, (i) => Despesa.fromMap(maps[i]));
  }
}

// ============================================================================
// 3. PECAS REPOSITORY
// ============================================================================
class PecasRepository {
  final DatabaseHelper _dbHelper;
  PecasRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  Future<int> inserirPeca(PecaMonitorada peca) async {
    final db = await _dbHelper.database;
    return await db.insert('pecas_monitoradas', peca.toMap());
  }

  Future<int> substituirPeca(int pecaId, double kmAtual) async {
    final db = await _dbHelper.database;
    return await db.update('pecas_monitoradas', {'km_instalacao': kmAtual}, where: 'id = ?', whereArgs: [pecaId]);
  }

  Future<int> removerPeca(int pecaId) async {
    final db = await _dbHelper.database;
    return await db.delete('pecas_monitoradas', where: 'id = ?', whereArgs: [pecaId]);
  }
}

// ============================================================================
// 4. STAGES REPOSITORY
// ============================================================================
class StagesRepository {
  final DatabaseHelper _dbHelper;
  StagesRepository({DatabaseHelper? dbHelper})
      : _dbHelper = dbHelper ?? DatabaseHelper.instance;

  Future<int> atualizarStatus(int stageId, StatusStage novoStatus) async {
    final db = await _dbHelper.database;
    return await db.update('itens_stage', {'status': novoStatus.valorBanco}, where: 'id = ?', whereArgs: [stageId]);
  }
}
`
};
