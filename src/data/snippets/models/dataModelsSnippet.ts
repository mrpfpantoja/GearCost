import { CodeSnippet } from '../types';

export const dataModelsSnippet: CodeSnippet = {
    id: 'data-models',
    title: '5. Modelos de Dados (Herança, Polimorfismo, Cálculos de Desgaste & Mapeamento)',
    fileName: 'lib/domain/models/models.dart',
    language: 'dart',
    category: 'models',
    description: 'Classes puras de negócio com toMap, fromMap, fórmula de desgaste de telemetria e custo total por km.',
    code: `import 'dart:convert';

// --- ENUMS ---
enum TipoDespesa {
  combustivel('COMBUSTIVEL'),
  manutencao('MANUTENCAO'),
  impostoSeguro('IMPOSTO_SEGURO'),
  estetica('ESTETICA'),
  upgradeStage('UPGRADE');

  final String valorBanco;
  const TipoDespesa(this.valorBanco);

  static TipoDespesa fromString(String val) {
    return TipoDespesa.values.firstWhere(
      (e) => e.valorBanco == val,
      orElse: () => TipoDespesa.manutencao,
    );
  }
}

enum StatusStage {
  planejado('PLANEJADO'),
  comprado('COMPRADO'),
  instalado('INSTALADO');

  final String valorBanco;
  const StatusStage(this.valorBanco);

  static StatusStage fromString(String val) {
    return StatusStage.values.firstWhere(
      (e) => e.valorBanco == val,
      orElse: () => StatusStage.planejado,
    );
  }
}

// ============================================================================
// MÓDULO DE TELEMETRIA DE PEÇAS (Herança & Polimorfismo)
// ============================================================================
abstract class PecaMonitorada {
  final int? id;
  final int veiculoId;
  final String nome;
  final double kmInstalacao;
  final double vidaUtilEstimadaKm;

  PecaMonitorada({
    this.id,
    required this.veiculoId,
    required this.nome,
    required this.kmInstalacao,
    required this.vidaUtilEstimadaKm,
  });

  /// Regra de Negócio: Desgaste (%) = ((kmAtual - kmInstalacao) / vidaUtilEstimadaKm) * 100
  double calcularPercentualDesgaste(double kmAtual) {
    if (vidaUtilEstimadaKm <= 0) return 0.0;
    final desgaste = ((kmAtual - kmInstalacao) / vidaUtilEstimadaKm) * 100.0;
    return desgaste.clamp(0.0, 100.0);
  }

  /// Dispara status crítico quando o desgaste atingir >= 90%
  bool precisaSubstituicao(double kmAtual) {
    return calcularPercentualDesgaste(kmAtual) >= 90.0;
  }

  Map<String, dynamic> toMap();

  static PecaMonitorada fromMap(Map<String, dynamic> map) {
    final tipo = map['tipo_peca'] as String?;
    if (tipo == 'PNEU') {
      return Pneu.fromMap(map);
    }
    return ComponenteGenerico.fromMap(map);
  }
}

class Pneu extends PecaMonitorada {
  final String posicao; // ex: "Dianteiro Esquerdo", "Traseiro Direito"
  final String dot;
  final String medida; // ex: "225/45 R17"

  Pneu({
    super.id,
    required super.veiculoId,
    required super.nome,
    required super.kmInstalacao,
    required super.vidaUtilEstimadaKm,
    required this.posicao,
    required this.dot,
    required this.medida,
  });

  @override
  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'tipo_peca': 'PNEU',
    'nome': nome,
    'km_instalacao': kmInstalacao,
    'vida_util_estimada_km': vidaUtilEstimadaKm,
    'posicao': posicao,
    'dot': dot,
    'medida': medida,
  };

  factory Pneu.fromMap(Map<String, dynamic> map) => Pneu(
    id: map['id'] as int?,
    veiculoId: map['veiculo_id'] as int,
    nome: map['nome'] as String,
    kmInstalacao: (map['km_instalacao'] as num).toDouble(),
    vidaUtilEstimadaKm: (map['vida_util_estimada_km'] as num).toDouble(),
    posicao: map['posicao'] as String? ?? 'Dianteiro',
    dot: map['dot'] as String? ?? '',
    medida: map['medida'] as String? ?? '',
  );
}

class ComponenteGenerico extends PecaMonitorada {
  final String categoria; // ex: "Freios", "Fluidos", "Correias"
  final int intervaloMaximoMeses;

  ComponenteGenerico({
    super.id,
    required super.veiculoId,
    required super.nome,
    required super.kmInstalacao,
    required super.vidaUtilEstimadaKm,
    required this.categoria,
    required this.intervaloMaximoMeses,
  });

  @override
  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'tipo_peca': 'GENERICO',
    'nome': nome,
    'km_instalacao': kmInstalacao,
    'vida_util_estimada_km': vidaUtilEstimadaKm,
    'categoria': categoria,
    'intervalo_maximo_meses': intervaloMaximoMeses,
  };

  factory ComponenteGenerico.fromMap(Map<String, dynamic> map) => ComponenteGenerico(
    id: map['id'] as int?,
    veiculoId: map['veiculo_id'] as int,
    nome: map['nome'] as String,
    kmInstalacao: (map['km_instalacao'] as num).toDouble(),
    vidaUtilEstimadaKm: (map['vida_util_estimada_km'] as num).toDouble(),
    categoria: map['categoria'] as String? ?? 'Outros',
    intervaloMaximoMeses: map['intervalo_maximo_meses'] as int? ?? 12,
  );
}

// ============================================================================
// MÓDULO FINANCEIRO E DESPESAS (Polimorfismo)
// ============================================================================
abstract class Despesa {
  final int? id;
  final int veiculoId;
  final DateTime data;
  final double valor;
  final double kmRegistro;
  final TipoDespesa tipo;
  final String? observacoes;

  Despesa({
    this.id,
    required this.veiculoId,
    required this.data,
    required this.valor,
    required this.kmRegistro,
    required this.tipo,
    this.observacoes,
  });

  Map<String, dynamic> toMap();

  static Despesa fromMap(Map<String, dynamic> map) {
    final tipoStr = map['tipo'] as String;
    final tipo = TipoDespesa.fromString(tipoStr);

    switch (tipo) {
      case TipoDespesa.combustivel:
        return Abastecimento.fromMap(map);
      case TipoDespesa.manutencao:
        return ManutencaoRealizada.fromMap(map);
      default:
        return DespesaGeral.fromMap(map);
    }
  }
}

class Abastecimento extends Despesa {
  final double litros;
  final double precoPorLitro;
  final String tipoCombustivel;

  Abastecimento({
    super.id,
    required super.veiculoId,
    required super.data,
    required super.valor,
    required super.kmRegistro,
    this.litros = 0.0,
    this.precoPorLitro = 0.0,
    this.tipoCombustivel = 'Gasolina',
    super.observacoes,
  }) : super(tipo: TipoDespesa.combustivel);

  /// Cálculo de consumo médio em KM/L baseado no odômetro anterior
  double calcularConsumoMedio(double kmAnterior) {
    final deltaKm = kmRegistro - kmAnterior;
    if (litros <= 0 || deltaKm <= 0) return 0.0;
    return deltaKm / litros;
  }

  @override
  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'tipo': tipo.valorBanco,
    'valor': valor,
    'data': data.toIso8601String(),
    'km_registro': kmRegistro,
    'observacoes': observacoes,
    'litros': litros,
    'preco_litro': precoPorLitro,
    'tipo_combustivel': tipoCombustivel,
  };

  factory Abastecimento.fromMap(Map<String, dynamic> map) => Abastecimento(
    id: map['id'] as int?,
    veiculoId: map['veiculo_id'] as int,
    data: DateTime.parse(map['data'] as String),
    valor: (map['valor'] as num).toDouble(),
    kmRegistro: (map['km_registro'] as num).toDouble(),
    litros: (map['litros'] as num?)?.toDouble() ?? 0.0,
    precoPorLitro: (map['preco_litro'] as num?)?.toDouble() ?? 0.0,
    tipoCombustivel: map['tipo_combustivel'] as String? ?? 'Gasolina',
    observacoes: map['observacoes'] as String?,
  );
}

class ManutencaoRealizada extends Despesa {
  final String oficina;
  final List<String> pecasTrocadas;
  final int garantiaDias;

  ManutencaoRealizada({
    super.id,
    required super.veiculoId,
    required super.data,
    required super.valor,
    required super.kmRegistro,
    this.oficina = '',
    this.pecasTrocadas = const [],
    this.garantiaDias = 90,
    super.observacoes,
  }) : super(tipo: TipoDespesa.manutencao);

  @override
  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'tipo': tipo.valorBanco,
    'valor': valor,
    'data': data.toIso8601String(),
    'km_registro': kmRegistro,
    'observacoes': observacoes,
    'oficina': oficina,
    'pecas_trocadas': jsonEncode(pecasTrocadas),
    'garantia_dias': garantiaDias,
  };

  factory ManutencaoRealizada.fromMap(Map<String, dynamic> map) {
    List<String> pecas = [];
    if (map['pecas_trocadas'] != null) {
      try {
        pecas = List<String>.from(jsonDecode(map['pecas_trocadas']));
      } catch (_) {}
    }
    return ManutencaoRealizada(
      id: map['id'] as int?,
      veiculoId: map['veiculo_id'] as int,
      data: DateTime.parse(map['data'] as String),
      valor: (map['valor'] as num).toDouble(),
      kmRegistro: (map['km_registro'] as num).toDouble(),
      oficina: map['oficina'] as String? ?? '',
      pecasTrocadas: pecas,
      garantiaDias: map['garantia_dias'] as int? ?? 90,
      observacoes: map['observacoes'] as String?,
    );
  }
}

class DespesaGeral extends Despesa {
  DespesaGeral({
    super.id,
    required super.veiculoId,
    required super.data,
    required super.valor,
    required super.kmRegistro,
    required super.tipo,
    super.observacoes,
  });

  @override
  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'tipo': tipo.valorBanco,
    'valor': valor,
    'data': data.toIso8601String(),
    'km_registro': kmRegistro,
    'observacoes': observacoes,
  };

  factory DespesaGeral.fromMap(Map<String, dynamic> map) => DespesaGeral(
    id: map['id'] as int?,
    veiculoId: map['veiculo_id'] as int,
    data: DateTime.parse(map['data'] as String),
    valor: (map['valor'] as num).toDouble(),
    kmRegistro: (map['km_registro'] as num).toDouble(),
    tipo: TipoDespesa.fromString(map['tipo'] as String),
    observacoes: map['observacoes'] as String?,
  );
}

// ============================================================================
// MÓDULO DE PROJETOS E STAGES
// ============================================================================
class ItemStage {
  final int? id;
  final int veiculoId;
  final String nomeModificacao;
  final int nivelStage; // 1, 2 ou 3
  final double custoEstimado;
  final DateTime? dataPlanejada;
  StatusStage status;

  ItemStage({
    this.id,
    required this.veiculoId,
    required this.nomeModificacao,
    required this.nivelStage,
    required this.custoEstimado,
    this.dataPlanejada,
    this.status = StatusStage.planejado,
  });

  void atualizarStatus(StatusStage novoStatus) {
    status = novoStatus;
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'veiculo_id': veiculoId,
    'nome_modificacao': nomeModificacao,
    'nivel_stage': nivelStage,
    'custo_estimado': custoEstimado,
    'data_planejada': dataPlanejada?.toIso8601String(),
    'status': status.valorBanco,
  };

  factory ItemStage.fromMap(Map<String, dynamic> map) => ItemStage(
    id: map['id'] as int?,
    veiculoId: map['veiculo_id'] as int,
    nomeModificacao: map['nome_modificacao'] as String,
    nivelStage: map['nivel_stage'] as int,
    custoEstimado: (map['custo_estimado'] as num).toDouble(),
    dataPlanejada: map['data_planejada'] != null ? DateTime.parse(map['data_planejada']) : null,
    status: StatusStage.fromString(map['status'] as String),
  );
}

// ============================================================================
// AGREGADOR RAIZ: VEÍCULO
// ============================================================================
class Veiculo {
  final int? id;
  final String marca;
  final String modelo;
  final int anoFabricacao;
  final String motorizacao;
  double kmAtual;
  final String placa;
  final double capacidadeTanqueLitros;

  // Coleções associadas (Domain Aggregate)
  final List<Despesa> despesas;
  final List<PecaMonitorada> pecas;
  final List<ItemStage> stages;

  Veiculo({
    this.id,
    required this.marca,
    required this.modelo,
    required this.anoFabricacao,
    required this.motorizacao,
    required this.kmAtual,
    required this.placa,
    this.capacidadeTanqueLitros = 50.0,
    List<Despesa>? despesas,
    List<PecaMonitorada>? pecas,
    List<ItemStage>? stages,
  })  : despesas = despesas ?? [],
        pecas = pecas ?? [],
        stages = stages ?? [];

  /// Atualiza o odômetro e automaticamente dispara o recálculo de desgaste das peças
  void atualizarQuilometragem(double novoKm) {
    if (novoKm >= kmAtual) {
      kmAtual = novoKm;
    }
  }

  /// Somatório financeiro de todas as despesas vinculadas ao veículo
  double calcularCustoTotal() {
    return despesas.fold(0.0, (total, d) => total + d.valor);
  }

  /// Custo por KM rodado (R$ / KM)
  double calcularCustoPorKm() {
    if (kmAtual <= 0) return 0.0;
    return calcularCustoTotal() / kmAtual;
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'marca': marca,
    'modelo': modelo,
    'ano_fabricacao': anoFabricacao,
    'motorizacao': motorizacao,
    'km_atual': kmAtual,
    'placa': placa.toUpperCase().trim(),
    'capacidade_tanque_litros': capacidadeTanqueLitros,
  };

  factory Veiculo.fromMap(Map<String, dynamic> map) => Veiculo(
    id: map['id'] as int?,
    marca: map['marca'] as String,
    modelo: map['modelo'] as String,
    anoFabricacao: map['ano_fabricacao'] as int,
    motorizacao: map['motorizacao'] as String,
    kmAtual: (map['km_atual'] as num).toDouble(),
    placa: map['placa'] as String,
    capacidadeTanqueLitros: (map['capacidade_tanque_litros'] as num?)?.toDouble() ?? 50.0,
  );
}`
  };
