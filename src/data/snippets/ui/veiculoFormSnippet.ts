import { CodeSnippet } from '../types';

export const veiculoFormSnippet: CodeSnippet = {
    id: 'veiculo-form-screen',
    title: '6. Código da Tela de Cadastro de Veículo (UI Flutter com Dropdown Fipe)',
    fileName: 'lib/presentation/screens/veiculo/veiculo_form_screen.dart',
    language: 'dart',
    category: 'ui',
    description: 'Formulário completo com dropdowns encadeados (Marca -> Modelo -> Ano) consumindo a API Fipe e salvando no SQLite.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../data/datasources/remote/fipe_service.dart';
import '../../../../data/datasources/local/database_helper.dart';

class VeiculoFormScreen extends StatefulWidget {
  const VeiculoFormScreen({super.key});

  @override
  State<VeiculoFormScreen> createState() => _VeiculoFormScreenState();
}

class _VeiculoFormScreenState extends State<VeiculoFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fipeService = FipeService();

  // Controllers dos campos textuais
  final _placaController = TextEditingController();
  final _kmController = TextEditingController();
  final _motorizacaoController = TextEditingController();
  final _tanqueController = TextEditingController(text: '50.0');

  // Estados de seleção da Fipe
  List<FipeItem> _marcas = [];
  List<FipeItem> _modelos = [];
  List<FipeItem> _anos = [];

  FipeItem? _marcaSelecionada;
  FipeItem? _modeloSelecionado;
  FipeItem? _anoSelecionado;

  // Estados de carregamento
  bool _carregandoMarcas = false;
  bool _carregandoModelos = false;
  bool _carregandoAnos = false;
  bool _salvando = false;

  @override
  void initState() {
    super.initState();
    _carregarMarcas();
  }

  @override
  void dispose() {
    _placaController.dispose();
    _kmController.dispose();
    _motorizacaoController.dispose();
    _tanqueController.dispose();
    super.dispose();
  }

  /// 1. Busca inicial das marcas
  Future<void> _carregarMarcas() async {
    setState(() => _carregandoMarcas = true);
    try {
      final marcas = await _fipeService.getMarcas();
      setState(() {
        _marcas = marcas;
        _carregandoMarcas = false;
      });
    } catch (e) {
      setState(() => _carregandoMarcas = false);
      _mostrarSnackBar('Erro ao buscar marcas Fipe: \$e', isError: true);
    }
  }

  /// 2. Selecionou marca -> Busca modelos
  Future<void> _onMarcaAlterada(FipeItem? marca) async {
    setState(() {
      _marcaSelecionada = marca;
      _modeloSelecionado = null;
      _anoSelecionado = null;
      _modelos = [];
      _anos = [];
    });

    if (marca == null) return;

    setState(() => _carregandoModelos = true);
    try {
      final modelos = await _fipeService.getModelos(marca.codigo);
      setState(() {
        _modelos = modelos;
        _carregandoModelos = false;
      });
    } catch (e) {
      setState(() => _carregandoModelos = false);
      _mostrarSnackBar('Erro ao carregar modelos da marca', isError: true);
    }
  }

  /// 3. Selecionou modelo -> Busca anos
  Future<void> _onModeloAlterado(FipeItem? modelo) async {
    setState(() {
      _modeloSelecionado = modelo;
      _anoSelecionado = null;
      _anos = [];
    });

    if (modelo == null || _marcaSelecionada == null) return;

    setState(() => _carregandoAnos = true);
    try {
      final anos = await _fipeService.getAnos(_marcaSelecionada!.codigo, modelo.codigo);
      setState(() {
        _anos = anos;
        _carregandoAnos = false;
      });
    } catch (e) {
      setState(() => _carregandoAnos = false);
      _mostrarSnackBar('Erro ao carregar anos do veículo', isError: true);
    }
  }

  /// 4. Gravação no SQLite nativo com tratamento de erros
  Future<void> _salvarVeiculo() async {
    if (!_formKey.currentState!.validate()) return;

    if (_marcaSelecionada == null || _modeloSelecionado == null || _anoSelecionado == null) {
      _mostrarSnackBar('Por favor, selecione Marca, Modelo e Ano na FIPE.', isError: true);
      return;
    }

    setState(() => _salvando = true);

    try {
      // Extrai ano inteiro (ex: "2023 Gasolina" -> 2023)
      final anoStr = _anoSelecionado!.nome.split(' ').first;
      final int anoInt = int.tryParse(anoStr) ?? DateTime.now().year;

      final km = double.tryParse(_kmController.text.replaceAll(',', '.')) ?? 0.0;
      final capacidadeTanque = double.tryParse(_tanqueController.text.replaceAll(',', '.')) ?? 50.0;

      final db = await DatabaseHelper.instance.database;

      await db.insert('veiculos', {
        'marca': _marcaSelecionada!.nome,
        'modelo': _modeloSelecionado!.nome,
        'ano_fabricacao': anoInt,
        'motorizacao': _motorizacaoController.text.trim().isEmpty 
            ? 'Padrão' 
            : _motorizacaoController.text.trim(),
        'km_atual': km,
        'placa': _placaController.text.toUpperCase().trim(),
        'capacidade_tanque_litros': capacidadeTanque,
      });

      if (!mounted) return;
      _mostrarSnackBar('Veículo cadastrado na garagem com sucesso!', isError: false);
      Navigator.pop(context, true);
    } catch (e) {
      setState(() => _salvando = false);
      if (e.toString().contains('UNIQUE constraint failed')) {
        _mostrarSnackBar('Erro: Já existe um veículo cadastrado com esta placa!', isError: true);
      } else {
        _mostrarSnackBar('Erro ao gravar veículo no banco: \$e', isError: true);
      }
    }
  }

  void _mostrarSnackBar(String msg, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isError ? Colors.redAccent : Colors.tealAccent.shade700,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const bgDark = Color(0xFF121418);
    const cardDark = Color(0xFF1E222B);
    const accentOrange = Color(0xFFFF5722);

    return Scaffold(
      backgroundColor: bgDark,
      appBar: AppBar(
        title: const Text('Novo Veículo • Garagem GearCost', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: cardDark,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Banner Tabela Fipe
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blueGrey.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.blueGrey.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.directions_car, color: accentOrange),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Catálogo Oficial Tabela Fipe integrado para identificação precisa de motorização e ano.',
                          style: TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 1. DROPDOWN MARCA
                _carregandoMarcas
                    ? const Center(child: Padding(padding: EdgeInsets.all(8), child: CircularProgressIndicator(color: accentOrange)))
                    : DropdownButtonFormField<FipeItem>(
                        dropdownColor: cardDark,
                        value: _marcaSelecionada,
                        decoration: _inputDecoration('Marca do Veículo', Icons.factory_outlined),
                        items: _marcas.map((marca) => DropdownMenuItem(value: marca, child: Text(marca.nome, overflow: TextOverflow.ellipsis))).toList(),
                        onChanged: _onMarcaAlterada,
                        validator: (val) => val == null ? 'Selecione a marca' : null,
                      ),
                const SizedBox(height: 16),

                // 2. DROPDOWN MODELO (DEPENDENTE)
                _carregandoModelos
                    ? const Center(child: Padding(padding: EdgeInsets.all(8), child: CircularProgressIndicator(color: accentOrange)))
                    : DropdownButtonFormField<FipeItem>(
                        dropdownColor: cardDark,
                        value: _modeloSelecionado,
                        isExpanded: true,
                        decoration: _inputDecoration('Modelo (Fipe)', Icons.speed),
                        items: _modelos.map((modelo) => DropdownMenuItem(value: modelo, child: Text(modelo.nome, overflow: TextOverflow.ellipsis))).toList(),
                        onChanged: _marcaSelecionada == null ? null : _onModeloAlterado,
                        validator: (val) => val == null ? 'Selecione o modelo' : null,
                      ),
                const SizedBox(height: 16),

                // 3. DROPDOWN ANO/VERSÃO (DEPENDENTE)
                _carregandoAnos
                    ? const Center(child: Padding(padding: EdgeInsets.all(8), child: CircularProgressIndicator(color: accentOrange)))
                    : DropdownButtonFormField<FipeItem>(
                        dropdownColor: cardDark,
                        value: _anoSelecionado,
                        decoration: _inputDecoration('Ano Modelo / Combustível', Icons.calendar_today_outlined),
                        items: _anos.map((ano) => DropdownMenuItem(value: ano, child: Text(ano.nome))).toList(),
                        onChanged: _modeloSelecionado == null ? null : (ano) => setState(() => _anoSelecionado = ano),
                        validator: (val) => val == null ? 'Selecione o ano' : null,
                      ),
                const SizedBox(height: 16),

                // PLACA DO VEÍCULO (Mercosul ou Antiga)
                TextFormField(
                  controller: _placaController,
                  textCapitalization: TextCapitalization.characters,
                  inputFormatters: [LengthLimitingTextInputFormatter(7), FilteringTextInputFormatter.allow(RegExp(r'[A-Za-z0-9]'))],
                  decoration: _inputDecoration('Placa (ex: BRA2E19)', Icons.pin_outlined),
                  style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2),
                  validator: (val) {
                    if (val == null || val.trim().length < 7) return 'Placa inválida (7 dígitos)';
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // MOTORIZAÇÃO / CÓDIGO DO MOTOR
                TextFormField(
                  controller: _motorizacaoController,
                  decoration: _inputDecoration('Motorização / Specs (ex: 2.0 TSI EA888)', Icons.bolt_outlined),
                ),
                const SizedBox(height: 16),

                // KM ATUAL DO ODÔMETRO
                TextFormField(
                  controller: _kmController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: _inputDecoration('Quilometragem Atual (KM)', Icons.av_timer_outlined),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Informe o KM atual';
                    if (double.tryParse(val.replaceAll(',', '.')) == null) return 'Valor numérico inválido';
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // CAPACIDADE DO TANQUE (LITROS)
                TextFormField(
                  controller: _tanqueController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: _inputDecoration('Capacidade do Tanque (Litros)', Icons.local_gas_station_outlined),
                ),
                const SizedBox(height: 28),

                // BOTÃO DE SALVAMENTO
                ElevatedButton.icon(
                  onPressed: _salvando ? null : _salvarVeiculo,
                  icon: _salvando
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.check_circle_outline, color: Colors.white),
                  label: Text(
                    _salvando ? 'Salvando na Garagem...' : 'Cadastrar Veículo',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accentOrange,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white60),
      prefixIcon: Icon(icon, color: Colors.white70),
      filled: true,
      fillColor: const Color(0xFF1E222B),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFFF5722), width: 1.5)),
    );
  }
}`
  };
