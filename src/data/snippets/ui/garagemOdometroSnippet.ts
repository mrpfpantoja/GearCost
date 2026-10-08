import { CodeSnippet } from '../types';

export const garagemOdometroSnippet: CodeSnippet = {
    id: 'garagem-odometro-card',
    title: '7. GaragemOdometroCard (Widget Modular de Odômetro com BottomSheet & Validação)',
    fileName: 'lib/presentation/widgets/garagem_odometro_card.dart',
    language: 'dart',
    category: 'ui',
    description: 'Componente visual do odômetro com modal bottom sheet, formatação NumberFormat pt_BR e validação estrita de KM.',
    code: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class GaragemOdometroCard extends StatefulWidget {
  final double quilometragemAtual;
  final int anoModelo;
  final Function(double novoKm) onKmAtualizado;

  const GaragemOdometroCard({
    Key? key,
    required this.quilometragemAtual,
    required this.anoModelo,
    required this.onKmAtualizado,
  }) : super(key: key);

  @override
  State<GaragemOdometroCard> createState() => _GaragemOdometroCardState();
}

class _GaragemOdometroCardState extends State<GaragemOdometroCard> {
  final NumberFormat _formatadorKm = NumberFormat("#,##0", "pt_BR");

  // Modal para entrada do novo KM do veículo
  void _abrirDialogAtualizacaoKm(BuildContext context) {
    final TextEditingController controller = TextEditingController(
      text: widget.quilometragemAtual.toInt().toString(),
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E1E24),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Atualizar Odômetro",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                "Informe a quilometragem atual do painel para recalcular a vida útil das peças e alertas de revisão.",
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: controller,
                keyboardType: TextInputType.number,
                autofocus: true,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.speed, color: Color(0xFFEA580C)),
                  suffixText: "KM",
                  suffixStyle: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
                  filled: true,
                  fillColor: const Color(0xFF121214),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEA580C),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onPressed: () {
                    final double? kmDigitado = double.tryParse(controller.text.replaceAll('.', ''));
                    if (kmDigitado != null && kmDigitado >= widget.quilometragemAtual) {
                      widget.onKmAtualizado(kmDigitado);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: const Color(0xFF10B981),
                          content: Text("Odômetro atualizado para \${_formatadorKm.format(kmDigitado)} KM!"),
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          backgroundColor: Color(0xFFE11D48),
                          content: Text("O novo KM deve ser igual ou superior ao KM anterior."),
                        ),
                      );
                    }
                  },
                  child: const Text(
                    "Salvar e Recalcular Telemetria",
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF18181C),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF282830)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Lado Esquerdo: Ícone + Leitura do KM
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEA580C).withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.speed,
                      color: Color(0xFFEA580C),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "ODÔMETRO ATUAL",
                        style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            _formatadorKm.format(widget.quilometragemAtual),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.1,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            "KM",
                            style: TextStyle(
                              color: Color(0xFFEA580C),
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),

              // Lado Direito: Ano do Modelo
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    "Ano Modelo",
                    style: TextStyle(color: Color(0xFF64748B), fontSize: 11),
                  ),
                  Text(
                    "\${widget.anoModelo}",
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 14),
          const Divider(color: Color(0xFF282830), height: 1),
          const SizedBox(height: 12),

          // Botão Ação: Registro Rápido
          InkWell(
            onTap: () => _abrirDialogAtualizacaoKm(context),
            borderRadius: BorderRadius.circular(8),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF202026),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.edit_road, color: Color(0xFFEA580C), size: 18),
                  SizedBox(width: 8),
                  Text(
                    "Registrar Nova Quilometragem",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}`
  };
