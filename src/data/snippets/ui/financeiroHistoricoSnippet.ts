import { CodeSnippet } from '../types';

export const financeiroHistoricoSnippet: CodeSnippet = {
    id: 'financeiro-historico-screen',
    title: '8. FinanceiroHistoricoScreen (Histórico de Despesas, Busca em Tempo Real & Filtros)',
    fileName: 'lib/presentation/screens/despesas/financeiro_historico_screen.dart',
    language: 'dart',
    category: 'ui',
    description: 'Tela de extrato com busca em tempo real, chips de categoria, modal de filtros avançados por data e KM, e cálculo de totais.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// Modelo representativo de um lançamento financeiro
class RegistroFinanceiro {
  final String id;
  final String titulo;
  final String categoria; // 'OLEO', 'PNEUS', 'COMBUSTIVEL', 'MANUTENCAO', 'STAGE'
  final double valor;
  final double kmRegistrado;
  final DateTime data;
  final String? detalhes;

  RegistroFinanceiro({
    required this.id,
    required this.titulo,
    required this.categoria,
    required this.valor,
    required this.kmRegistrado,
    required this.data,
    this.detalhes,
  });
}

class FinanceiroHistoricoScreen extends StatefulWidget {
  const FinanceiroHistoricoScreen({Key? key}) : super(key: key);

  @override
  State<FinanceiroHistoricoScreen> createState() => _FinanceiroHistoricoScreenState();
}

class _FinanceiroHistoricoScreenState extends State<FinanceiroHistoricoScreen> {
  final TextEditingController _buscaController = TextEditingController();
  final NumberFormat _formatoMoeda = NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$');
  final NumberFormat _formatoKm = NumberFormat("#,##0", "pt_BR");
  final DateFormat _formatoData = DateFormat('dd/MM/yyyy');

  String _categoriaSelecionada = 'TODOS';
  DateTimeRange? _filtroPeriodo;
  double? _kmMin;
  double? _kmMax;

  // Base de exemplo/dados locais
  final List<RegistroFinanceiro> _todosRegistros = [
    RegistroFinanceiro(
      id: '1',
      titulo: 'Troca de Óleo Motul 8100 + Filtro Mann',
      categoria: 'OLEO',
      valor: 480.00,
      kmRegistrado: 58200,
      data: DateTime(2026, 9, 20),
      detalhes: 'Oficina Garagem Racing - 5.7 Litros 5w40',
    ),
    RegistroFinanceiro(
      id: '2',
      titulo: 'Par de Pneus Michelin Pilot Sport 4',
      categoria: 'PNEUS',
      valor: 2150.00,
      kmRegistrado: 55000,
      data: DateTime(2026, 8, 14),
      detalhes: 'Montagem dianteira + Alinhamento 3D',
    ),
    RegistroFinanceiro(
      id: '3',
      titulo: 'Abastecimento Gasolina Octapro',
      categoria: 'COMBUSTIVEL',
      valor: 310.50,
      kmRegistrado: 58400,
      data: DateTime(2026, 10, 2),
      detalhes: 'Posto Ipiranga - 42.5 Litros',
    ),
    RegistroFinanceiro(
      id: '4',
      titulo: 'Substituição Pastilhas de Freio Brembo',
      categoria: 'MANUTENCAO',
      valor: 890.00,
      kmRegistrado: 52000,
      data: DateTime(2026, 7, 05),
      detalhes: 'Eixo Dianteiro e Traseiro + Sangria de Fluido DOT 5.1',
    ),
    RegistroFinanceiro(
      id: '5',
      titulo: 'Downpipe Inox 3" + Remap ECU Stage 2',
      categoria: 'STAGE',
      valor: 4500.00,
      kmRegistrado: 56300,
      data: DateTime(2026, 8, 28),
      detalhes: 'Potência aferida no dinamômetro: 295cv',
    ),
  ];

  // Regra de Filtragem Combinada
  List<RegistroFinanceiro> get _registrosFiltrados {
    return _todosRegistros.where((item) {
      final textoBusca = _buscaController.text.toLowerCase();
      final combinaTexto = item.titulo.toLowerCase().contains(textoBusca) ||
          (item.detalhes?.toLowerCase().contains(textoBusca) ?? false);

      final combinaCategoria = _categoriaSelecionada == 'TODOS' ||
          item.categoria == _categoriaSelecionada;

      final combinaData = _filtroPeriodo == null ||
          (item.data.isAfter(_filtroPeriodo!.start.subtract(const Duration(days: 1))) &&
              item.data.isBefore(_filtroPeriodo!.end.add(const Duration(days: 1))));

      final combinaKmMin = _kmMin == null || item.kmRegistrado >= _kmMin!;
      final combinaKmMax = _kmMax == null || item.kmRegistrado <= _kmMax!;

      return combinaTexto && combinaCategoria && combinaData && combinaKmMin && combinaKmMax;
    }).toList();
  }

  // Modal com Filtros de Data e KM
  void _abrirModalFiltrosAvancados() {
    final kmMinCtrl = TextEditingController(text: _kmMin?.toInt().toString() ?? '');
    final kmMaxCtrl = TextEditingController(text: _kmMax?.toInt().toString() ?? '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E1E24),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
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
                      const Text(
                        "Filtros de Pesquisa",
                        style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _filtroPeriodo = null;
                            _kmMin = null;
                            _kmMax = null;
                          });
                          Navigator.pop(ctx);
                        },
                        child: const Text("Limpar", style: TextStyle(color: Color(0xFFEA580C))),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Seletor de Período
                  const Text("Intervalo de Datas", style: TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 8),
                  InkWell(
                    onTap: () async {
                      final picked = await showDateRangePicker(
                        context: context,
                        firstDate: DateTime(2020),
                        lastDate: DateTime(2030),
                        initialDateRange: _filtroPeriodo,
                        builder: (context, child) {
                          return Theme(
                            data: ThemeData.dark().copyWith(
                              colorScheme: const ColorScheme.dark(
                                primary: Color(0xFFEA580C),
                                surface: Color(0xFF202026),
                              ),
                            ),
                            child: child!,
                          );
                        },
                      );
                      if (picked != null) {
                        setModalState(() => _filtroPeriodo = picked);
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF121214),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_month, color: Color(0xFFEA580C), size: 20),
                          const SizedBox(width: 10),
                          Text(
                            _filtroPeriodo == null
                                ? "Selecionar período..."
                                : "\${_formatoData.format(_filtroPeriodo!.start)} até \${_formatoData.format(_filtroPeriodo!.end)}",
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                  // Seletor de KM
                  const Text("Faixa de Quilometragem (KM)", style: TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: kmMinCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: "KM Mínimo",
                            hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
                            filled: true,
                            fillColor: const Color(0xFF121214),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextField(
                          controller: kmMaxCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: "KM Máximo",
                            hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
                            filled: true,
                            fillColor: const Color(0xFF121214),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEA580C),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        setState(() {
                          _kmMin = double.tryParse(kmMinCtrl.text);
                          _kmMax = double.tryParse(kmMaxCtrl.text);
                        });
                        Navigator.pop(ctx);
                      },
                      child: const Text("Aplicar Filtros", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  // Modal BottomSheet: Cadastrar Nova Despesa (Polimórfico)
  void _abrirModalNovaDespesa(BuildContext context) {
    final formKey = GlobalKey<FormState>();
    final tituloCtrl = TextEditingController();
    final valorCtrl = TextEditingController(text: "280.00");
    final kmCtrl = TextEditingController(text: "58400");
    final detalhesCtrl = TextEditingController();
    String categoriaSelecionada = 'COMBUSTIVEL';
    DateTime dataSelecionada = DateTime.now();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E1E24),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
              ),
              child: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.add_circle_outline, color: Color(0xFFEA580C)),
                              SizedBox(width: 8),
                              Text(
                                "Registrar Nova Despesa",
                                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.grey),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Seletor de Categoria
                      const Text("Categoria do Lançamento", style: TextStyle(color: Colors.grey, fontSize: 12)),
                      const SizedBox(height: 6),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          {'key': 'COMBUSTIVEL', 'label': '⛽ Combustível'},
                          {'key': 'MANUTENCAO', 'label': '🔧 Manutenção'},
                          {'key': 'OLEO', 'label': '🛢️ Troca de Óleo'},
                          {'key': 'PNEUS', 'label': '🛞 Pneus'},
                          {'key': 'STAGE', 'label': '⚡ Stage/Upgrade'},
                        ].map((cat) {
                          final isSel = categoriaSelecionada == cat['key'];
                          return ChoiceChip(
                            label: Text(cat['label']!),
                            selected: isSel,
                            selectedColor: const Color(0xFFEA580C).withOpacity(0.25),
                            backgroundColor: const Color(0xFF121214),
                            labelStyle: TextStyle(
                              color: isSel ? const Color(0xFFEA580C) : Colors.white70,
                              fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
                              fontSize: 11,
                            ),
                            side: BorderSide(color: isSel ? const Color(0xFFEA580C) : const Color(0xFF282830)),
                            onSelected: (val) {
                              if (val) setModalState(() => categoriaSelecionada = cat['key']!);
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 14),

                      // Título / Descrição
                      TextFormField(
                        controller: tituloCtrl,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration("Título / Descrição", Icons.description_outlined),
                        validator: (val) => (val == null || val.trim().isEmpty) ? "Informe um título" : null,
                      ),
                      const SizedBox(height: 12),

                      // Valor (R$) e KM
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: valorCtrl,
                              keyboardType: const TextInputType.numberWithOptions(decimal: true),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              decoration: _inputDecoration("Valor (R$)", Icons.attach_money),
                              validator: (val) {
                                if (val == null || double.tryParse(val.replaceAll(',', '.')) == null) {
                                  return "Valor inválido";
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: TextFormField(
                              controller: kmCtrl,
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white),
                              decoration: _inputDecoration("KM Odômetro", Icons.speed),
                              validator: (val) => (val == null || double.tryParse(val) == null) ? "KM inválido" : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Detalhes Opcionais (Oficina, Peças, Litros)
                      TextFormField(
                        controller: detalhesCtrl,
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration("Detalhes (Oficina, Peças, Litros)", Icons.build_circle_outlined),
                      ),
                      const SizedBox(height: 20),

                      // Botão Salvar
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEA580C),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          icon: const Icon(Icons.check, color: Colors.white),
                          label: const Text(
                            "Salvar Despesa no SQLite",
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          onPressed: () async {
                            if (!formKey.currentState!.validate()) return;

                            final novoRegistro = RegistroFinanceiro(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              titulo: tituloCtrl.text.trim(),
                              categoria: categoriaSelecionada,
                              valor: double.parse(valorCtrl.text.replaceAll(',', '.')),
                              kmRegistrado: double.parse(kmCtrl.text),
                              data: dataSelecionada,
                              detalhes: detalhesCtrl.text.trim().isEmpty ? null : detalhesCtrl.text.trim(),
                            );

                            setState(() {
                              _todosRegistros.insert(0, novoRegistro);
                            });

                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                behavior: SnackBarBehavior.floating,
                                backgroundColor: const Color(0xFF10B981),
                                content: Text("Despesa \"\${novoRegistro.titulo}\" registrada com sucesso!"),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
      prefixIcon: Icon(icon, color: const Color(0xFFEA580C), size: 18),
      filled: true,
      fillColor: const Color(0xFF121214),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFEA580C), width: 1.5)),
    );
  }

  // Diálogo de confirmação para exclusão de despesa
  void _confirmarExclusao(BuildContext context, RegistroFinanceiro item) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E1E24),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.delete_outline, color: Color(0xFFE11D48), size: 24),
              SizedBox(width: 8),
              Text(
                "Excluir Lançamento?",
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Deseja realmente excluir o lançamento \"\${item.titulo}\" no valor de \${_formatoMoeda.format(item.valor)}?",
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
              ),
              const SizedBox(height: 8),
              const Text(
                "Esta operação removerá o registro permanentemente do banco de dados SQLite.",
                style: TextStyle(color: Color(0xFF64748B), fontSize: 11),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancelar", style: TextStyle(color: Colors.white70)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () async {
                Navigator.pop(ctx);
                await _excluirRegistro(item.id);
              },
              child: const Text("Excluir", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  // Remove o registro local e do SQLite
  Future<void> _excluirRegistro(String id) async {
    setState(() {
      _todosRegistros.removeWhere((r) => r.id == id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: Color(0xFF10B981),
        content: Text("Lançamento excluído com sucesso!"),
      ),
    );
  }

  // Ícone e cor contextual por categoria
  Widget _iconePorCategoria(String categoria) {
    IconData icone;
    Color cor;

    switch (categoria) {
      case 'OLEO':
        icone = Icons.oil_barrel;
        cor = Colors.amber;
        break;
      case 'PNEUS':
        icone = Icons.album;
        cor = Colors.cyan;
        break;
      case 'COMBUSTIVEL':
        icone = Icons.local_gas_station;
        cor = Colors.green;
        break;
      case 'STAGE':
        icone = Icons.speed;
        cor = const Color(0xFFEA580C);
        break;
      default:
        icone = Icons.build;
        cor = Colors.blueAccent;
    }

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: cor.withOpacity(0.12),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Icon(icone, color: cor, size: 22),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double totalFiltrado = _registrosFiltrados.fold(0.0, (acc, item) => acc + item.valor);

    return Scaffold(
      backgroundColor: const Color(0xFF121214),
      appBar: AppBar(
        title: const Text("Histórico Financeiro", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF18181C),
        elevation: 0,
        actions: [
          IconButton(
            tooltip: "Filtros Avançados",
            icon: Stack(
              children: [
                const Icon(Icons.tune, color: Colors.white),
                if (_filtroPeriodo != null || _kmMin != null || _kmMax != null)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(color: Color(0xFFEA580C), shape: BoxShape.circle),
                    ),
                  )
              ],
            ),
            onPressed: _abrirModalFiltrosAvancados,
          ),
          IconButton(
            tooltip: "Registrar Nova Despesa",
            icon: const Icon(Icons.add_circle, color: Color(0xFFEA580C)),
            onPressed: () => _abrirModalNovaDespesa(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Campo de Busca com Botão de Filtro
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _buscaController,
              onChanged: (_) => setState(() {}),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Buscar serviço, peça, oficina...",
                hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
                prefixIcon: const Icon(Icons.search, color: Color(0xFFEA580C)),
                suffixIcon: _buscaController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: Colors.grey),
                        onPressed: () {
                          _buscaController.clear();
                          setState(() {});
                        },
                      )
                    : null,
                filled: true,
                fillColor: const Color(0xFF1E1E24),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ),

          // 2. Chips de Categorias Rápidas
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                _filtroChip("Todos", "TODOS"),
                _filtroChip("Troca de Óleo", "OLEO"),
                _filtroChip("Pneus", "PNEUS"),
                _filtroChip("Combustível", "COMBUSTIVEL"),
                _filtroChip("Manutenção", "MANUTENCAO"),
                _filtroChip("Stages & Upgrades", "STAGE"),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // 3. Resumo da Consulta Atual
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "\${_registrosFiltrados.length} registro(s) encontrado(s)",
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                ),
                Text(
                  "Total: \${_formatoMoeda.format(totalFiltrado)}",
                  style: const TextStyle(color: Color(0xFFEA580C), fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // 4. Lista de Despesas / Serviços
          Expanded(
            child: _registrosFiltrados.isEmpty
                ? const Center(
                    child: Text(
                      "Nenhum registro encontrado para este filtro.",
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _registrosFiltrados.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final item = _registrosFiltrados[index];
                      return Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFF18181C),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF282830)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _iconePorCategoria(item.categoria),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.titulo,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  if (item.detalhes != null) ...[
                                    const SizedBox(height: 3),
                                    Text(
                                      item.detalhes!,
                                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                    ),
                                  ],
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      const Icon(Icons.speed, color: Color(0xFF64748B), size: 14),
                                      const SizedBox(width: 4),
                                      Text(
                                        "\${_formatoKm.format(item.kmRegistrado)} KM",
                                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                                      ),
                                      const SizedBox(width: 14),
                                      const Icon(Icons.calendar_today, color: Color(0xFF64748B), size: 13),
                                      const SizedBox(width: 4),
                                      Text(
                                        _formatoData.format(item.data),
                                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  _formatoMoeda.format(item.valor),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                InkWell(
                                  onTap: () => _confirmarExclusao(context, item),
                                  borderRadius: BorderRadius.circular(6),
                                  child: Padding(
                                    padding: const EdgeInsets.all(4),
                                    child: const Icon(
                                      Icons.delete_outline,
                                      color: Color(0xFFE11D48),
                                      size: 18,
                                    ),
                                  ),
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _abrirModalNovaDespesa(context),
        backgroundColor: const Color(0xFFEA580C),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          "Nova Despesa",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  // Componente de Chip Selecionável
  Widget _filtroChip(String label, String categoriaKey) {
    final isSelected = _categoriaSelecionada == categoriaKey;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (val) {
          setState(() {
            _categoriaSelecionada = categoriaKey;
          });
        },
        backgroundColor: const Color(0xFF1E1E24),
        selectedColor: const Color(0xFFEA580C).withOpacity(0.2),
        checkmarkColor: const Color(0xFFEA580C),
        labelStyle: TextStyle(
          color: isSelected ? const Color(0xFFEA580C) : const Color(0xFF94A3B8),
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? const Color(0xFFEA580C) : const Color(0xFF282830),
          ),
        ),
      ),
    );
  }
}
`
  };
