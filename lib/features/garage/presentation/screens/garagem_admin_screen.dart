import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../domain/models/models.dart';
import '../controllers/garagem_controller.dart';

/// Tela de Administração de Frota e Garagem (Material Design 3 Dark Mode)
/// Permite listar todos os carros cadastrados, alternar o veículo ativo,
/// editar dados básicos e excluir veículos indesejados com confirmação crítica.
class GaragemAdminScreen extends StatelessWidget {
  const GaragemAdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final controller = context.watch<GaragemController>();
    final veiculos = controller.veiculos;
    final veiculoAtivoId = controller.veiculoAtivo?.id;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      appBar: AppBar(
        title: const Text(
          'Administração da Garagem',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.orange),
            tooltip: 'Recarregar Garagem',
            onPressed: () => controller.carregarVeiculos(),
          ),
        ],
      ),
      body: controller.isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orange))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // 1. Cabeçalho com Métricas da Garagem
                _buildMetricasHeader(context, veiculos.length),
                const SizedBox(height: 16),

                // Mensagem de Erro caso exista
                if (controller.errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE11D48).withOpacity(0.15),
                      border: Border.all(color: const Color(0xFFE11D48).withOpacity(0.4)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: Color(0xFFE11D48), size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            controller.errorMessage!,
                            style: const TextStyle(color: Color(0xFFFDA4AF), fontSize: 12),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70, size: 16),
                          onPressed: () => controller.limparErro(),
                        ),
                      ],
                    ),
                  ),
                ],

                // 2. Lista de Cards de Veículos
                const Text(
                  'VEÍCULOS CADASTRADOS',
                  style: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 8),

                ...veiculos.map((veiculo) {
                  final isAtivo = veiculo.id == veiculoAtivoId;
                  return _buildVeiculoCard(context, controller, veiculo, isAtivo);
                }),

                if (veiculos.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 40),
                      child: Text(
                        'Nenhum veículo cadastrado na garagem.',
                        style: TextStyle(color: Color(0xFF64748B)),
                      ),
                    ),
                  ),
              ],
            ),
    );
  }

  /// Cabeçalho com métricas da frota e botão de adicionar
  Widget _buildMetricasHeader(BuildContext context, int total) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.orange.withOpacity(0.3)),
                ),
                child: const Icon(Icons.directions_car, color: Colors.orange),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'TOTAL DA FROTA',
                    style: TextStyle(
                      color: Color(0xFF94A3B8),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '$total ${total == 1 ? "Veículo" : "Veículos"}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ],
          ),
          ElevatedButton.icon(
            onPressed: () {
              // Navega para a tela de cadastro FIPE
              Navigator.pushNamed(context, '/cadastro-veiculo');
            },
            icon: const Icon(Icons.add, size: 16),
            label: const Text('+ Adicionar Veículo'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  /// Card individual de administração do veículo
  Widget _buildVeiculoCard(
    BuildContext context,
    GaragemController controller,
    Veiculo veiculo,
    bool isAtivo,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isAtivo ? const Color(0xFF1E293B) : const Color(0xFF111827),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isAtivo ? Colors.orange.withOpacity(0.5) : const Color(0xFF334155),
          width: isAtivo ? 1.5 : 1,
        ),
        boxShadow: isAtivo
            ? [
                BoxShadow(
                  color: Colors.orange.withOpacity(0.12),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                )
              ]
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Linha Superior: Marca, Modelo, Badge Ativo e Placa
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          veiculo.marca.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.orange,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                        if (isAtivo) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.orange.withOpacity(0.4)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.check_circle, size: 10, color: Colors.orange),
                                SizedBox(width: 4),
                                Text(
                                  'VEÍCULO ATIVO',
                                  style: TextStyle(
                                    color: Colors.orange,
                                    fontSize: 9,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      veiculo.modelo,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      '${veiculo.motorizacao} • Ano ${veiculo.anoFabricacao}',
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                  ],
                ),
              ),
              // Placa
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Text(
                  veiculo.placa,
                  style: const TextStyle(
                    color: Color(0xFF34D399), // Emerald
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Odômetro e Métricas
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A).withOpacity(0.6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.speed, size: 16, color: Colors.orange),
                    const SizedBox(width: 6),
                    const Text('Odômetro:', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    const SizedBox(width: 4),
                    Text(
                      '${veiculo.kmAtual.toStringAsFixed(0)} KM',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ],
                ),
                Text(
                  '${veiculo.despesas.length} despesas • ${veiculo.pecas.length} peças',
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // Ações do Card
          Row(
            children: [
              // Botão Selecionar / Ativar
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: isAtivo ? null : () => controller.selecionarVeiculo(veiculo.id!),
                  icon: Icon(isAtivo ? Icons.check : Icons.drive_eta, size: 15),
                  label: Text(isAtivo ? 'Veículo Selecionado' : 'Selecionar / Ativar'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: isAtivo ? Colors.orange : Colors.white,
                    side: BorderSide(
                      color: isAtivo ? Colors.orange.withOpacity(0.4) : const Color(0xFF475569),
                    ),
                    backgroundColor: isAtivo ? Colors.orange.withOpacity(0.1) : Colors.transparent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Botão Editar
              IconButton(
                onPressed: () => _abrirModalEdicao(context, controller, veiculo),
                icon: const Icon(Icons.edit_outlined, size: 18),
                color: const Color(0xFFCBD5E1),
                tooltip: 'Editar Veículo',
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFF334155).withOpacity(0.6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(width: 6),

              // Botão Excluir (Alerta Vermelho)
              IconButton(
                onPressed: () => _abrirModalConfirmacaoExclusao(context, controller, veiculo),
                icon: const Icon(Icons.delete_outline, size: 18),
                color: const Color(0xFFE11D48), // Alerta Rose
                tooltip: 'Excluir Veículo da Garagem',
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48).withOpacity(0.12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Modal Crítico de Confirmação de Exclusão (com integridade e regras)
  void _abrirModalConfirmacaoExclusao(
    BuildContext context,
    GaragemController controller,
    Veiculo veiculo,
  ) {
    final isUnicoCarro = controller.veiculos.length <= 1;

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Color(0xFFE11D48), size: 24),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Excluir Veículo da Garagem?',
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.directions_car, color: Colors.orange, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Esta ação é irreversível. Todas as despesas, manutenções, peças monitoradas e projetos de Stages vinculados a este carro serão excluídos permanentemente.',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, height: 1.4),
              ),
              if (isUnicoCarro) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.amber.withOpacity(0.4)),
                  ),
                  child: const Text(
                    'Atenção: Não é permitido excluir o único carro da garagem sem antes cadastrar outro.',
                    style: TextStyle(color: Colors.amber, fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancelar', style: TextStyle(color: Color(0xFF94A3B8))),
            ),
            ElevatedButton(
              onPressed: isUnicoCarro
                  ? null
                  : () async {
                      Navigator.pop(ctx);
                      await controller.deletarVeiculo(veiculo.id!);
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${veiculo.modelo} excluído com sucesso.'),
                            backgroundColor: const Color(0xFFE11D48),
                          ),
                        );
                      }
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Confirmar Exclusão'),
            ),
          ],
        );
      },
    );
  }

  /// Modal de Edição Rápida de Veículo (Placa, Specs, KM)
  void _abrirModalEdicao(
    BuildContext context,
    GaragemController controller,
    Veiculo veiculo,
  ) {
    final placaController = TextEditingController(text: veiculo.placa);
    final motorizacaoController = TextEditingController(text: veiculo.motorizacao);
    final kmController = TextEditingController(text: veiculo.kmAtual.toStringAsFixed(0));
    final formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Editar ${veiculo.modelo}',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white70),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Placa
                TextFormField(
                  controller: placaController,
                  textCapitalization: TextCapitalization.characters,
                  decoration: const InputDecoration(
                    labelText: 'Placa do Veículo',
                    labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                    enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF475569))),
                    focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
                  ),
                  style: const TextStyle(color: Colors.white, fontFamily: 'monospace'),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Informe a placa' : null,
                ),
                const SizedBox(height: 12),

                // Motorização
                TextFormField(
                  controller: motorizacaoController,
                  decoration: const InputDecoration(
                    labelText: 'Motorização / Specs',
                    labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                    enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF475569))),
                    focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
                  ),
                  style: const TextStyle(color: Colors.white),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Informe as especificações' : null,
                ),
                const SizedBox(height: 12),

                // Odômetro
                TextFormField(
                  controller: kmController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Odômetro Atual (KM)',
                    labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                    enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF475569))),
                    focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
                  ),
                  style: const TextStyle(color: Colors.white),
                  validator: (v) {
                    if (v == null || double.tryParse(v) == null) return 'Informe um valor válido';
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (!formKey.currentState!.validate()) return;
                      final novoKm = double.tryParse(kmController.text) ?? veiculo.kmAtual;

                      final veiculoAtualizado = Veiculo(
                        id: veiculo.id,
                        marca: veiculo.marca,
                        modelo: veiculo.modelo,
                        anoFabricacao: veiculo.anoFabricacao,
                        motorizacao: motorizacaoController.text.trim(),
                        kmAtual: novoKm,
                        placa: placaController.text.toUpperCase().trim(),
                        capacidadeTanqueLitros: veiculo.capacidadeTanqueLitros,
                        despesas: veiculo.despesas,
                        pecas: veiculo.pecas,
                        stages: veiculo.stages,
                        manutencoesFuturas: veiculo.manutencoesFuturas,
                      );

                      Navigator.pop(ctx);
                      await controller.editarVeiculo(veiculoAtualizado);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Salvar Alterações', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
