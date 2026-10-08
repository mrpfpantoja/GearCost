import { CodeSnippet } from '../types';

export const telemetriaPecasSnippet: CodeSnippet = {
    id: 'telemetria-pecas-screen',
    title: '9. TelemetriaPecasScreen (Telemetria de Desgaste, Peças Essenciais, Edição & Exclusão)',
    fileName: 'lib/presentation/screens/telemetria/telemetria_pecas_screen.dart',
    language: 'dart',
    category: 'ui',
    description: 'Tela de telemetria completa com separação por categorias de peças e fluidos, catálogo de peças essenciais em 1-clique, diálogo de exclusão, edição de parâmetros e substituição com SQLite.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../domain/models/models.dart';
import '../../../../data/datasources/local/database_helper.dart';

class TelemetriaPecasScreen extends StatefulWidget {
  final int veiculoId;
  final double kmAtual;

  const TelemetriaPecasScreen({
    Key? key,
    required this.veiculoId,
    required this.kmAtual,
  }) : super(key: key);

  @override
  State<TelemetriaPecasScreen> createState() => _TelemetriaPecasScreenState();
}

class _TelemetriaPecasScreenState extends State<TelemetriaPecasScreen> {
  final NumberFormat _formatoKm = NumberFormat("#,##0", "pt_BR");
  final TextEditingController _buscaController = TextEditingController();

  String _filtroCategoria = 'TODOS';
  List<PecaMonitorada> _pecas = [];
  bool _carregando = true;

  @override
  void initState() {
    super.initState();
    _carregarPecasDoBanco();
  }

  @override
  void dispose() {
    _buscaController.dispose();
    super.dispose();
  }

  /// Carrega as peças monitoradas do SQLite nativo
  Future<void> _carregarPecasDoBanco() async {
    setState(() => _carregando = true);
    try {
      final db = await DatabaseHelper.instance.database;
      final maps = await db.query(
        'pecas_monitoradas',
        where: 'veiculo_id = ?',
        whereArgs: [widget.veiculoId],
      );

      setState(() {
        _pecas = maps.map((m) => PecaMonitorada.fromMap(m)).toList();
        _carregando = false;
      });
    } catch (e) {
      setState(() => _carregando = false);
    }
  }

  /// Categorização de peças e fluidos
  String _obterCategoriaPeca(PecaMonitorada peca) {
    if (peca is Pneu) return 'PNEUS';
    final nome = peca.nome.toLowerCase();
    final cat = (peca is ComponenteGenerico ? peca.categoria : '').toLowerCase();

    // 1. Freios (Pastilhas e Discos)
    if (nome.contains('pastilha') || nome.contains('disco') || (cat.contains('freio') && !nome.contains('fluido') && !nome.contains('dot'))) {
      return 'FREIOS';
    }
    // 2. Óleo do Motor & Fluidos (Óleo, fluido de freio, arrefecimento)
    if (cat.contains('fluido') || cat.contains('óleo') || cat.contains('oleo') || nome.contains('óleo') || nome.contains('oleo') || nome.contains('fluido') || nome.contains('dot') || nome.contains('arrefecimento')) {
      return 'OLEO_FLUIDOS';
    }
    // 3. Filtros
    if (cat.contains('filtro') || nome.contains('filtro')) return 'FILTROS';
    // 4. Ignição & Motor
    if (cat.contains('ignição') || cat.contains('ignicao') || nome.contains('vela') || nome.contains('bobina') || nome.contains('correia')) return 'IGNICAO';
    // 5. Suspensão
    if (cat.contains('suspensão') || cat.contains('suspensao') || nome.contains('amortecedor') || nome.contains('mola')) return 'SUSPENSAO';

    return 'OUTROS';
  }

  /// Confirmação de Exclusão (showDialog / AlertDialog)
  void _confirmarExclusao(BuildContext context, PecaMonitorada peca) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: const [
            Icon(Icons.delete_outline, color: Color(0xFFE11D48)),
            SizedBox(width: 8),
            Text("Remover Componente?", style: TextStyle(color: Colors.white, fontSize: 16)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Deseja parar de monitorar \\"\${peca.nome}\\"?", style: const TextStyle(color: Colors.white70, fontSize: 13)),
            const SizedBox(height: 8),
            Text("Vida útil: \${_formatoKm.format(peca.vidaUtilEstimadaKm)} KM", style: const TextStyle(color: Color(0xFFEA580C), fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancelar", style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE11D48)),
            onPressed: () async {
              if (peca.id != null) {
                final db = await DatabaseHelper.instance.database;
                await db.delete('pecas_monitoradas', where: 'id = ?', whereArgs: [peca.id]);
                _carregarPecasDoBanco();
              }
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Peça \\"\${peca.nome}\\" removida da telemetria!")),
              );
            },
            child: const Text("Excluir", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  /// Modal de Edição de Peça Monitorada
  void _abrirModalEditarPeca(BuildContext context, PecaMonitorada peca) {
    final nomeCtrl = TextEditingController(text: peca.nome);
    final kmInstCtrl = TextEditingController(text: peca.kmInstalacao.toInt().toString());
    final vidaUtilCtrl = TextEditingController(text: peca.vidaUtilEstimadaKm.toInt().toString());

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E1E24),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Editar Componente", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                IconButton(icon: const Icon(Icons.close, color: Colors.grey), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const SizedBox(height: 12),
            TextField(
              controller: nomeCtrl,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: "Nome da Peça", labelStyle: TextStyle(color: Colors.grey)),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: kmInstCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "KM Instalação", labelStyle: TextStyle(color: Colors.grey)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: vidaUtilCtrl,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(labelText: "Vida Útil (KM)", labelStyle: TextStyle(color: Colors.grey)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            OutlinedButton.icon(
              onPressed: () {
                kmInstCtrl.text = widget.kmAtual.toInt().toString();
              },
              icon: const Icon(Icons.refresh, color: Color(0xFFEA580C), size: 16),
              label: Text("Definir Instalação para KM Atual (\${_formatoKm.format(widget.kmAtual)} KM)", style: const TextStyle(color: Color(0xFFEA580C), fontSize: 11)),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C)),
                onPressed: () async {
                  final db = await DatabaseHelper.instance.database;
                  await db.update(
                    'pecas_monitoradas',
                    {
                      'nome': nomeCtrl.text.trim(),
                      'km_instalacao': double.tryParse(kmInstCtrl.text) ?? peca.kmInstalacao,
                      'vida_util_estimada_km': double.tryParse(vidaUtilCtrl.text) ?? peca.vidaUtilEstimadaKm,
                    },
                    where: 'id = ?',
                    whereArgs: [peca.id],
                  );
                  _carregarPecasDoBanco();
                  Navigator.pop(ctx);
                },
                child: const Text("Salvar Alterações", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Catálogo de Peças Essenciais (Adição em 1-Clique)
  void _abrirCatalogoPecasEssenciais(BuildContext context) {
    final itensEssenciais = [
      {'nome': 'Óleo Sintético 5W-40 + Filtro', 'cat': 'Oleo & Fluidos', 'km': 8000, 'tipo': 'GENERICO'},
      {'nome': 'Pastilhas de Freio Dianteiras Cerâmica', 'cat': 'Freios', 'km': 30000, 'tipo': 'GENERICO'},
      {'nome': 'Fluido de Freio Alta Performance DOT 5.1', 'cat': 'Oleo & Fluidos', 'km': 20000, 'tipo': 'GENERICO'},
      {'nome': 'Pneus Dianteiros Esportivos', 'cat': 'Pneus', 'km': 40000, 'tipo': 'PNEU'},
      {'nome': 'Velas de Ignição Laser Iridium', 'cat': 'Ignição', 'km': 35000, 'tipo': 'GENERICO'},
      {'nome': 'Filtro de Ar de Alta Vazão', 'cat': 'Filtros', 'km': 15000, 'tipo': 'GENERICO'},
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E24),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Adicionar Peças Essenciais (1-Clique)", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.separated(
                itemCount: itensEssenciais.length,
                separatorBuilder: (_, __) => const Divider(color: Color(0xFF282830)),
                itemBuilder: (context, idx) {
                  final item = itensEssenciais[idx];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(item['nome'] as String, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: Text("Vida útil: \${_formatoKm.format(item['km'])} KM", style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    trailing: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C)),
                      onPressed: () async {
                        final db = await DatabaseHelper.instance.database;
                        await db.insert('pecas_monitoradas', {
                          'veiculo_id': widget.veiculoId,
                          'nome': item['nome'],
                          'tipo_peca': item['tipo'],
                          'km_instalacao': widget.kmAtual,
                          'vida_util_estimada_km': item['km'],
                          'categoria': item['cat'],
                        });
                        _carregarPecasDoBanco();
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Componente \${item['nome']} adicionado à telemetria!")),
                        );
                      },
                      child: const Text("+ Adicionar", style: TextStyle(color: Colors.white, fontSize: 11)),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pecasFiltradas = _pecas.filterByQueryAndCategory(_buscaController.text, _filtroCategoria, _obterCategoriaPeca);

    return Scaffold(
      backgroundColor: const Color(0xFF121214),
      appBar: AppBar(
        title: const Text("Telemetria de Desgaste", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF18181C),
        elevation: 0,
        actions: [
          IconButton(
            tooltip: "Peças Essenciais",
            icon: const Icon(Icons.auto_awesome, color: Color(0xFFEA580C)),
            onPressed: () => _abrirCatalogoPecasEssenciais(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Campo de Busca
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _buscaController,
              onChanged: (_) => setState(() {}),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Buscar peça, óleo, freio, pneu...",
                prefixIcon: const Icon(Icons.search, color: Color(0xFFEA580C)),
                filled: true,
                fillColor: const Color(0xFF1E1E24),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ),

          // 2. Chips de Categorias (Fluidos, Freios, Pneus...)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _filtroChip("Todos", "TODOS"),
                _filtroChip("Óleo & Fluidos", "OLEO_FLUIDOS"),
                _filtroChip("Pastilhas & Freios", "FREIOS"),
                _filtroChip("Pneus & Rodas", "PNEUS"),
                _filtroChip("Filtros", "FILTROS"),
                _filtroChip("Motor & Ignição", "IGNICAO"),
                _filtroChip("Suspensão", "SUSPENSAO"),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // 3. Lista de Componentes
          Expanded(
            child: _carregando
                ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
                : pecasFiltradas.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text("Nenhum componente nesta categoria.", style: TextStyle(color: Colors.grey)),
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C)),
                              onPressed: () => _abrirCatalogoPecasEssenciais(context),
                              icon: const Icon(Icons.add, color: Colors.white),
                              label: const Text("Adicionar Peças Essenciais", style: TextStyle(color: Colors.white)),
                            ),
                          ],
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: pecasFiltradas.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final peca = pecasFiltradas[index];
                          final desgaste = peca.calcularPercentualDesgaste(widget.kmAtual);
                          final isCritico = peca.precisaSubstituicao(widget.kmAtual);

                          return Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181C),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: isCritico ? const Color(0xFFE11D48) : const Color(0xFF282830)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        peca.nome,
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                    ),
                                    Text(
                                      "\${desgaste.toStringAsFixed(1)}%",
                                      style: TextStyle(
                                        color: isCritico ? const Color(0xFFE11D48) : (desgaste > 70 ? Colors.amber : Colors.tealAccent),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                LinearProgressIndicator(
                                  value: (desgaste / 100.0).clamp(0.0, 1.0),
                                  backgroundColor: const Color(0xFF121214),
                                  valueColor: AlwaysStoppedAnimation(
                                    isCritico ? const Color(0xFFE11D48) : (desgaste > 70 ? Colors.amber : const Color(0xFF10B981)),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text("Instalação: \${_formatoKm.format(peca.kmInstalacao)} KM", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                                    Text("Vida útil: \${_formatoKm.format(peca.vidaUtilEstimadaKm)} KM", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                                  ],
                                ),
                                const Divider(color: Color(0xFF282830), height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    TextButton.icon(
                                      onPressed: () => _confirmarExclusao(context, peca),
                                      icon: const Icon(Icons.delete_outline, color: Color(0xFFE11D48), size: 16),
                                      label: const Text("Excluir", style: TextStyle(color: Color(0xFFE11D48), fontSize: 12)),
                                    ),
                                    Row(
                                      children: [
                                        TextButton.icon(
                                          onPressed: () => _abrirModalEditarPeca(context, peca),
                                          icon: const Icon(Icons.edit, color: Colors.amber, size: 16),
                                          label: const Text("Editar", style: TextStyle(color: Colors.white70, fontSize: 12)),
                                        ),
                                        TextButton.icon(
                                          onPressed: () async {
                                            final db = await DatabaseHelper.instance.database;
                                            await db.update('pecas_monitoradas', {'km_instalacao': widget.kmAtual}, where: 'id = ?', whereArgs: [peca.id]);
                                            _carregarPecasDoBanco();
                                          },
                                          icon: const Icon(Icons.refresh, color: Color(0xFFEA580C), size: 16),
                                          label: const Text("Substituir", style: TextStyle(color: Color(0xFFEA580C), fontSize: 12)),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _filtroChip(String label, String categoriaKey) {
    final isSelected = _filtroCategoria == categoriaKey;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (val) => setState(() => _filtroCategoria = categoriaKey),
        backgroundColor: const Color(0xFF1E1E24),
        selectedColor: const Color(0xFFEA580C).withOpacity(0.2),
        checkmarkColor: const Color(0xFFEA580C),
        labelStyle: TextStyle(
          color: isSelected ? const Color(0xFFEA580C) : const Color(0xFF94A3B8),
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}

extension FilterPecasExtension on List<PecaMonitorada> {
  List<PecaMonitorada> filterByQueryAndCategory(String query, String category, String Function(PecaMonitorada) getCat) {
    return where((p) {
      final matchesCat = category == 'TODOS' || getCat(p) == category;
      final matchesQuery = query.isEmpty || p.nome.toLowerCase().contains(query.toLowerCase());
      return matchesCat && matchesQuery;
    }).toList();
  }
}
`
  };
