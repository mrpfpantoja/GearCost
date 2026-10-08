import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'data/datasources/local/database_helper.dart';
import 'features/finance/data/repositories/despesa_repository.dart';
import 'features/garage/data/repositories/pecas_repository.dart';
import 'features/garage/data/repositories/veiculo_repository.dart';
import 'features/garage/presentation/controllers/garagem_controller.dart';
import 'features/garage/presentation/screens/garagem_admin_screen.dart';
import 'features/stages/data/repositories/stages_repository.dart';

void main() async {
  // Garante a inicialização das bindings do Flutter antes do acesso ao SQLite
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa o banco de dados local SQLite (habilita chaves estrangeiras)
  await DatabaseHelper.instance.database;

  runApp(const GearCostApp());
}

class GearCostApp extends StatelessWidget {
  const GearCostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // 1. Provedores dos Repositórios (Injeção de Dependências desacoplada)
        Provider<VeiculoRepository>(
          create: (_) => VeiculoRepository(),
        ),
        Provider<DespesaRepository>(
          create: (_) => DespesaRepository(),
        ),
        Provider<PecasRepository>(
          create: (_) => PecasRepository(),
        ),
        Provider<StagesRepository>(
          create: (_) => StagesRepository(),
        ),

        // 2. Provedor de Estado Reativo (ChangeNotifier)
        // Conecta os repositórios injetados e dispara o carregamento inicial dos veículos
        ChangeNotifierProvider<GaragemController>(
          create: (context) {
            final controller = GaragemController(
              veiculoRepo: context.read<VeiculoRepository>(),
              despesaRepo: context.read<DespesaRepository>(),
              pecasRepo: context.read<PecasRepository>(),
              stagesRepo: context.read<StagesRepository>(),
            );
            // Carrega os dados locais do SQLite imediatamente
            controller.carregarVeiculos();
            return controller;
          },
        ),
      ],
      child: MaterialApp(
        title: 'GearCost',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.dark,
        darkTheme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFFE11D48), // Rose 600 (Automotive Red)
            secondary: Color(0xFF38BDF8), // Sky 400 (Telemetry Cyan)
            surface: Color(0xFF1E293B), // Slate 800
            background: Color(0xFF0F172A),
          ),
          cardTheme: CardTheme(
            color: const Color(0xFF1E293B),
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF0F172A),
            elevation: 0,
            centerTitle: true,
          ),
        ),
        home: const PlaceholderHomeScreen(),
      ),
    );
  }
}

/// Tela de entrada temporária orquestrada pelo controller
class PlaceholderHomeScreen extends StatelessWidget {
  const PlaceholderHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<GaragemController>(
      builder: (context, controller, child) {
        if (controller.isLoading && !controller.temVeiculoAtivo) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(color: Color(0xFFE11D48)),
            ),
          );
        }

        final veiculo = controller.veiculoAtivo;

        return Scaffold(
          appBar: AppBar(
            title: Text(veiculo != null
                ? '${veiculo.marca} ${veiculo.modelo}'
                : 'GearCost Garagem'),
            actions: [
              IconButton(
                icon: const Icon(Icons.garage_rounded, color: Colors.orange),
                tooltip: 'Administrar Garagem / Frota',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const GaragemAdminScreen(),
                    ),
                  );
                },
              ),
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () => controller.carregarVeiculos(),
              ),
            ],
          ),
          body: veiculo == null
              ? const Center(
                  child: Text('Nenhum veículo cadastrado na garagem local.'),
                )
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Card do Odômetro
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ODÔMETRO ATUAL',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${veiculo.kmAtual.toStringAsFixed(0)} KM',
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF38BDF8),
                              ),
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              onPressed: () {
                                // Exemplo de atualização de odômetro via Controller
                                controller.atualizarKm(veiculo.kmAtual + 150);
                              },
                              icon: const Icon(Icons.add_road),
                              label: const Text('Simular +150 km rodados'),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Resumo Financeiro
                    Card(
                      child: ListTile(
                        title: const Text('Custo Total Acumulado'),
                        subtitle: Text(
                          'R\$ / KM: R\$ ${controller.custoPorKm.toStringAsFixed(2)}',
                        ),
                        trailing: Text(
                          'R\$ ${controller.custoTotal.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF10B981),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Alertas Críticos de Telemetria
                    Card(
                      child: ListTile(
                        leading: Icon(
                          Icons.warning_amber_rounded,
                          color: controller.totalAlertasCriticos > 0
                              ? const Color(0xFFEF4444)
                              : Colors.green,
                        ),
                        title: const Text('Alertas Críticos de Peças'),
                        subtitle: Text(
                          '${controller.totalAlertasCriticos} componente(s) necessitando troca (>=90%)',
                        ),
                      ),
                    ),
                  ],
                ),
        );
      },
    );
  }
}
