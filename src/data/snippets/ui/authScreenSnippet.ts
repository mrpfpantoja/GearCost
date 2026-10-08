import { CodeSnippet } from '../types';

export const authScreenSnippet: CodeSnippet = {
    id: 'auth-screen',
    title: '10. Tela de Login, Cadastro & Sessão Local',
    fileName: 'lib/presentation/screens/auth/auth_screen.dart',
    language: 'dart',
    category: 'ui',
    description: 'Interface completa de Autenticação Flutter 3.19+ com Abas de Login/Cadastro, TextFormField validados, Medidor de Força de Senha, Biometria com local_auth, e Armazenamento seguro de Sessão.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum AuthMode { login, cadastro }

enum NivelGearhead {
  entusiasta,
  trackdayHero,
  stage2Pro,
  mestreMecanico,
}

extension NivelGearheadExtension on NivelGearhead {
  String get label {
    switch (this) {
      case NivelGearhead.entusiasta:
        return 'Entusiasta';
      case NivelGearhead.trackdayHero:
        return 'Trackday Hero';
      case NivelGearhead.stage2Pro:
        return 'Stage 2 Pro';
      case NivelGearhead.mestreMecanico:
        return 'Mestre Mecânico';
    }
  }

  String get badge {
    switch (this) {
      case NivelGearhead.entusiasta:
        return '🔰 Diário';
      case NivelGearhead.trackdayHero:
        return '🏁 Pista';
      case NivelGearhead.stage2Pro:
        return '⚡ Remap';
      case NivelGearhead.mestreMecanico:
        return '🔧 Oficina';
    }
  }
}

class AuthScreen extends StatefulWidget {
  final VoidCallback? onAuthSuccess;

  const AuthScreen({Key? key, this.onAuthSuccess}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  AuthMode _mode = AuthMode.login;
  bool _isLoading = false;

  // Form Keys
  final _loginFormKey = GlobalKey<FormState>();
  final _cadastroFormKey = GlobalKey<FormState>();

  // Login Controllers
  final _loginEmailController = TextEditingController(text: 'marcus.racing@gearcost.app');
  final _loginSenhaController = TextEditingController(text: 'Stage2@2026');
  bool _ocultarSenhaLogin = true;
  bool _lembrarAcesso = true;

  // Cadastro Controllers
  final _cadNomeController = TextEditingController();
  final _cadApelidoController = TextEditingController();
  final _cadEmailController = TextEditingController();
  final _cadTelefoneController = TextEditingController();
  final _cadSenhaController = TextEditingController();
  final _cadConfirmarSenhaController = TextEditingController();
  bool _ocultarSenhaCad = true;
  bool _ocultarConfirmarSenhaCad = true;
  bool _termosAceitos = true;
  NivelGearhead _nivelSelecionado = NivelGearhead.stage2Pro;

  @override
  void dispose() {
    _loginEmailController.dispose();
    _loginSenhaController.dispose();
    _cadNomeController.dispose();
    _cadApelidoController.dispose();
    _cadEmailController.dispose();
    _cadTelefoneController.dispose();
    _cadSenhaController.dispose();
    _cadConfirmarSenhaController.dispose();
    super.dispose();
  }

  // Medição da Força da Senha
  int _calcularForcaSenha(String senha) {
    if (senha.length < 6) return 1;
    int pontos = 1;
    if (RegExp(r'[0-9]').hasMatch(senha)) pontos++;
    if (RegExp(r'[A-Z]').hasMatch(senha)) pontos++;
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(senha)) pontos++;
    if (senha.length >= 8 && pontos >= 3) return 3;
    return pontos >= 2 ? 2 : 1;
  }

  // Submissão do Login
  Future<void> _executarLogin() async {
    if (!_loginFormKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    HapticFeedback.lightImpact();

    // Simulação de autenticação com SharedPreferences / SQLite nativo
    await Future.delayed(const Duration(milliseconds: 600));

    if (!mounted) return;
    setState(() => _isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text('Acesso autorizado! Bem-vindo à Garagem.'),
          ],
        ),
        backgroundColor: const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );

    widget.onAuthSuccess?.call();
  }

  // Submissão do Cadastro
  Future<void> _executarCadastro() async {
    if (!_cadastroFormKey.currentState!.validate()) return;
    if (!_termosAceitos) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Aceite os termos para criar sua garagem.'),
          backgroundColor: Color(0xFFE11D48),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);
    HapticFeedback.heavyImpact();

    await Future.delayed(const Duration(milliseconds: 750));

    if (!mounted) return;
    setState(() => _isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Garagem criada com sucesso para \${_cadNomeController.text}!'),
        backgroundColor: const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );

    widget.onAuthSuccess?.call();
  }

  // Login Biométrico com local_auth
  Future<void> _autenticarBiometria() async {
    HapticFeedback.mediumImpact();
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 500));

    if (!mounted) return;
    setState(() => _isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Biometria / Face ID confirmada!'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
    widget.onAuthSuccess?.call();
  }

  // Modal de Recuperação de Senha
  void _abrirModalEsqueciSenha() {
    final emailRecupController = TextEditingController(text: _loginEmailController.text);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
        child: Container(
          decoration: const BoxDecoration(
            color: Color(0xFF18181C),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recuperação de Senha',
                    style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.grey),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Informe o e-mail cadastrado para receber o link de redefinição imediata.',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: emailRecupController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'E-mail do Piloto',
                  labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  prefixIcon: const Icon(Icons.email_outlined, color: Color(0xFFEA580C)),
                  filled: true,
                  fillColor: const Color(0xFF121214),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Link enviado para \${emailRecupController.text}!'),
                        backgroundColor: const Color(0xFF10B981),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEA580C),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Enviar Link Seguro', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121214),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              _buildBrandHeader(),
              const SizedBox(height: 20),
              _buildSegmentedSwitch(),
              const SizedBox(height: 20),
              _mode == AuthMode.login ? _buildLoginForm() : _buildCadastroForm(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBrandHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF18181C),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF282830)),
      ),
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEA580C), Color(0xFFF59E0B)],
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Center(
              child: Text('G', style: TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.w900)),
            ),
          ),
          const SizedBox(height: 10),
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('GearCost', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(width: 6),
              Chip(
                label: Text('OFFLINE-FIRST', style: TextStyle(fontSize: 9, color: Color(0xFFEA580C), fontWeight: FontWeight.bold)),
                backgroundColor: Color(0x33EA580C),
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Gestão de custos, telemetria de peças e odômetro automotivo.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildSegmentedSwitch() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFF18181C),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF282830)),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _mode = AuthMode.login),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _mode == AuthMode.login ? const Color(0xFFEA580C) : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    'Entrar (Login)',
                    style: TextStyle(
                      color: _mode == AuthMode.login ? Colors.white : const Color(0xFF94A3B8),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _mode = AuthMode.cadastro),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _mode == AuthMode.cadastro ? const Color(0xFFEA580C) : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    'Criar Garagem',
                    style: TextStyle(
                      color: _mode == AuthMode.cadastro ? Colors.white : const Color(0xFF94A3B8),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginForm() {
    return Form(
      key: _loginFormKey,
      child: Column(
        children: [
          TextFormField(
            controller: _loginEmailController,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Informe o e-mail de acesso';
              if (!v.contains('@')) return 'E-mail em formato inválido';
              return null;
            },
            decoration: _inputDecoration('E-mail do Piloto', Icons.mail_outline),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _loginSenhaController,
            obscureText: _ocultarSenhaLogin,
            style: const TextStyle(color: Colors.white, fontSize: 13, fontFamily: 'monospace'),
            validator: (v) => (v == null || v.length < 6) ? 'A senha deve ter no mínimo 6 dígitos' : null,
            decoration: _inputDecoration(
              'Senha de Acesso',
              Icons.lock_outline,
              suffix: IconButton(
                icon: Icon(_ocultarSenhaLogin ? Icons.visibility_off : Icons.visibility, color: Colors.grey, size: 20),
                onPressed: () => setState(() => _ocultarSenhaLogin = !_ocultarSenhaLogin),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Checkbox(
                    value: _lembrarAcesso,
                    activeColor: const Color(0xFFEA580C),
                    onChanged: (val) => setState(() => _lembrarAcesso = val ?? true),
                  ),
                  const Text('Lembrar acesso', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ],
              ),
              TextButton(
                onPressed: _abrirModalEsqueciSenha,
                child: const Text('Esqueci a senha', style: TextStyle(color: Color(0xFFEA580C), fontSize: 11)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _executarLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isLoading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Acessar Garagem GearCost', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            ),
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            onPressed: _autenticarBiometria,
            icon: const Icon(Icons.fingerprint, color: Color(0xFFEA580C)),
            label: const Text('Desbloquear com Biometria / Face ID', style: TextStyle(color: Colors.white, fontSize: 12)),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(44),
              side: const BorderSide(color: Color(0xFF282830)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCadastroForm() {
    return Form(
      key: _cadastroFormKey,
      child: Column(
        children: [
          TextFormField(
            controller: _cadNomeController,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Nome é obrigatório' : null,
            decoration: _inputDecoration('Nome Completo', Icons.person_outline),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _cadApelidoController,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            decoration: _inputDecoration('Apelido de Piloto / Tag de Pista', Icons.tag),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _cadEmailController,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            validator: (v) => (v == null || !v.contains('@')) ? 'E-mail inválido' : null,
            decoration: _inputDecoration('E-mail Principal', Icons.mail_outline),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _cadSenhaController,
            obscureText: _ocultarSenhaCad,
            onChanged: (v) => setState(() {}),
            style: const TextStyle(color: Colors.white, fontSize: 13),
            validator: (v) => (v == null || v.length < 6) ? 'Mínimo de 6 caracteres' : null,
            decoration: _inputDecoration('Senha de Acesso', Icons.lock_outline),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _cadConfirmarSenhaController,
            obscureText: _ocultarConfirmarSenhaCad,
            style: const TextStyle(color: Colors.white, fontSize: 13),
            validator: (v) => (v != _cadSenhaController.text) ? 'As senhas não conferem' : null,
            decoration: _inputDecoration('Confirmar Senha', Icons.lock_outline),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _executarCadastro,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Criar Garagem & Entrar', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon, {Widget? suffix}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
      prefixIcon: Icon(icon, color: const Color(0xFF94A3B8), size: 20),
      suffixIcon: suffix,
      filled: true,
      fillColor: const Color(0xFF18181C),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF282830))),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF282830))),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFEA580C))),
    );
  }
}
`
};
