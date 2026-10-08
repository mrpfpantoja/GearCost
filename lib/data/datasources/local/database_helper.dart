import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static const String _databaseName = "gearcost.db";
  static const int _databaseVersion = 1;

  // Singleton pattern
  DatabaseHelper._internal();
  static final DatabaseHelper instance = DatabaseHelper._internal();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final String databasesPath = await getDatabasesPath();
    final String path = join(databasesPath, _databaseName);

    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onConfigure: _onConfigure,
    );
  }

  /// CRÍTICO: Ativar integridade referencial com chaves estrangeiras no SQLite nativo
  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON;');
  }

  Future<void> _onCreate(Database db, int version) async {
    final batch = db.batch();

    // 1. Tabela VEICULOS (Agregador principal)
    batch.execute('''
      CREATE TABLE veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        ano_fabricacao INTEGER NOT NULL,
        motorizacao TEXT NOT NULL,
        km_atual REAL NOT NULL DEFAULT 0.0,
        placa TEXT NOT NULL UNIQUE,
        capacidade_tanque_litros REAL DEFAULT 50.0,
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
      );
    ''');

    // 2. Tabela DESPESAS (Polimórfica: Combustível, Manutenção, Imposto, Upgrade)
    batch.execute('''
      CREATE TABLE despesas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('COMBUSTIVEL', 'MANUTENCAO', 'IMPOSTO_SEGURO', 'ESTETICA', 'UPGRADE')),
        valor REAL NOT NULL,
        data TEXT NOT NULL,
        km_registro REAL NOT NULL,
        observacoes TEXT,
        -- Campos específicos para COMBUSTIVEL
        litros REAL,
        preco_litro REAL,
        tipo_combustivel TEXT,
        -- Campos específicos para MANUTENCAO
        oficina TEXT,
        pecas_trocadas TEXT,
        garantia_dias INTEGER,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
      );
    ''');

    // 3. Tabela PECAS_MONITORADAS (Telemetria de desgaste de componentes)
    batch.execute('''
      CREATE TABLE pecas_monitoradas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        tipo_peca TEXT NOT NULL CHECK(tipo_peca IN ('PNEU', 'GENERICO')),
        nome TEXT NOT NULL,
        km_instalacao REAL NOT NULL,
        vida_util_estimada_km REAL NOT NULL,
        -- Atributos de PNEU
        posicao TEXT,
        dot TEXT,
        medida TEXT,
        -- Atributos de COMPONENTE GENERICO
        categoria TEXT,
        intervalo_maximo_meses INTEGER,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
      );
    ''');

    // 4. Tabela ITENS_STAGE (Planejamento de Upgrades e Tuning)
    batch.execute('''
      CREATE TABLE itens_stage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        nome_modificacao TEXT NOT NULL,
        nivel_stage INTEGER NOT NULL CHECK(nivel_stage IN (1, 2, 3)),
        custo_estimado REAL NOT NULL,
        data_planejada TEXT,
        status TEXT NOT NULL CHECK(status IN ('PLANEJADO', 'COMPRADO', 'INSTALADO')),
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
      );
    ''');

    // 5. Tabela MANUTENCOES_PROGRAMADAS (Agenda de revisões futuras)
    batch.execute('''
      CREATE TABLE manutencoes_programadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo_id INTEGER NOT NULL,
        descricao_servico TEXT NOT NULL,
        km_limite REAL NOT NULL,
        data_limite TEXT NOT NULL,
        concluida INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
      );
    ''');

    // 6. Tabela CACHE_FIPE (Garante funcionamento 100% offline para Marcas e Modelos)
    batch.execute('''
      CREATE TABLE fipe_cache (
        chave TEXT PRIMARY KEY,
        tipo TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
      );
    ''');

    // CRIAÇÃO DE ÍNDICES OTIMIZADOS
    batch.execute('CREATE INDEX idx_despesas_veiculo ON despesas(veiculo_id);');
    batch.execute('CREATE INDEX idx_pecas_veiculo ON pecas_monitoradas(veiculo_id);');
    batch.execute('CREATE INDEX idx_stages_veiculo ON itens_stage(veiculo_id);');
    batch.execute('CREATE INDEX idx_manutencoes_veiculo ON manutencoes_programadas(veiculo_id);');

    await batch.commit(noResult: true);
  }

  Future<void> close() async {
    final db = await instance.database;
    await db.close();
  }
}
