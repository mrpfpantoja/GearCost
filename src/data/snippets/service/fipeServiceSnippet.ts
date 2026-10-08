import { CodeSnippet } from '../types';

export const fipeServiceSnippet: CodeSnippet = {
    id: 'fipe-service',
    title: '4. Service de Integração com a Tabela Fipe (com Cache Offline)',
    fileName: 'lib/data/datasources/remote/fipe_service.dart',
    language: 'dart',
    category: 'service',
    description: 'Consumo assíncrono encadeado da API Pública Fipe com fallback automático em banco SQLite.',
    code: `import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:sqflite/sqflite.dart';
import '../local/database_helper.dart';

class FipeItem {
  final String codigo;
  final String nome;

  const FipeItem({required this.codigo, required this.nome});

  factory FipeItem.fromJson(Map<String, dynamic> json) {
    return FipeItem(
      codigo: json['codigo'].toString(),
      nome: json['nome'] as String,
    );
  }

  Map<String, dynamic> toJson() => {'codigo': codigo, 'nome': nome};
}

class FipeService {
  static const String _baseUrl = 'https://parallelum.com.br/fipe/api/v1/carros';
  final http.Client _client;

  FipeService({http.Client? client}) : _client = client ?? http.Client();

  /// 1. Busca todas as marcas de carros disponíveis (com cache SQLite)
  Future<List<FipeItem>> getMarcas() async {
    const String cacheKey = 'marcas_carros';
    final cached = await _obterDoCache(cacheKey);
    if (cached != null) return cached;

    try {
      final uri = Uri.parse('$_baseUrl/marcas');
      final response = await _client.get(uri).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final marcas = data.map((item) => FipeItem.fromJson(item)).toList();
        
        // Persistir cache para acesso offline
        await _salvarNoCache(cacheKey, 'MARCAS', response.body);
        return marcas;
      } else {
        throw HttpException('Falha ao consultar marcas FIPE (Status: \${response.statusCode})');
      }
    } catch (e) {
      // Se a conexão falhar, tenta ler do cache mesmo que expirado
      final offlineData = await _obterDoCache(cacheKey, ignorarExpiracao: true);
      if (offlineData != null) return offlineData;
      rethrow;
    }
  }

  /// 2. Busca os modelos de uma marca selecionada (com cache)
  Future<List<FipeItem>> getModelos(String codigoMarca) async {
    final String cacheKey = 'modelos_\$codigoMarca';
    final cached = await _obterDoCache(cacheKey);
    if (cached != null) return cached;

    try {
      final uri = Uri.parse('$_baseUrl/marcas/\$codigoMarca/modelos');
      final response = await _client.get(uri).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> listaModelos = data['modelos'] ?? [];
        final modelos = listaModelos.map((item) => FipeItem.fromJson(item)).toList();

        await _salvarNoCache(cacheKey, 'MODELOS', jsonEncode(listaModelos));
        return modelos;
      } else {
        throw HttpException('Falha ao obter modelos da marca \$codigoMarca');
      }
    } catch (e) {
      final offlineData = await _obterDoCache(cacheKey, ignorarExpiracao: true);
      if (offlineData != null) return offlineData;
      rethrow;
    }
  }

  /// 3. Busca os anos e motorizações/versões do modelo selecionado
  Future<List<FipeItem>> getAnos(String codigoMarca, String codigoModelo) async {
    final String cacheKey = 'anos_\${codigoMarca}_\$codigoModelo';
    final cached = await _obterDoCache(cacheKey);
    if (cached != null) return cached;

    try {
      final uri = Uri.parse('$_baseUrl/marcas/\$codigoMarca/modelos/\$codigoModelo/anos');
      final response = await _client.get(uri).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final anos = data.map((item) => FipeItem.fromJson(item)).toList();

        await _salvarNoCache(cacheKey, 'ANOS', response.body);
        return anos;
      } else {
        throw HttpException('Falha ao obter anos para o modelo \$codigoModelo');
      }
    } catch (e) {
      final offlineData = await _obterDoCache(cacheKey, ignorarExpiracao: true);
      if (offlineData != null) return offlineData;
      rethrow;
    }
  }

  // --- Helpers de Cache no SQLite Local ---
  Future<List<FipeItem>?> _obterDoCache(String chave, {bool ignorarExpiracao = false}) async {
    try {
      final db = await DatabaseHelper.instance.database;
      final results = await db.query(
        'fipe_cache',
        where: 'chave = ?',
        whereArgs: [chave],
        limit: 1,
      );

      if (results.isNotEmpty) {
        final payload = results.first['payload_json'] as String;
        final List<dynamic> data = jsonDecode(payload);
        return data.map((item) => FipeItem.fromJson(item)).toList();
      }
    } catch (_) {}
    return null;
  }

  Future<void> _salvarNoCache(String chave, String tipo, String jsonPayload) async {
    try {
      final db = await DatabaseHelper.instance.database;
      await db.insert(
        'fipe_cache',
        {
          'chave': chave,
          'tipo': tipo,
          'payload_json': jsonPayload,
          'atualizado_em': DateTime.now().toIso8601String(),
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (_) {}
  }
}`
  };
