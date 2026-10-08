import React, { useState } from 'react';
import { 
  User, 
  LogIn, 
  LogOut, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound, 
  UserPlus, 
  Fingerprint, 
  Car, 
  RefreshCw 
} from 'lucide-react';
import { Usuario } from '../../../types/gearcost';

interface AuthTabProps {
  usuarioLogado: Usuario | null | undefined;
  onLogin: (usuario: Usuario) => void;
  onRegister?: (novoUsuario: Usuario) => void;
  onLogout?: () => void;
  onNavigateGaragem: () => void;
  onOpenPerfil: () => void;
  onOpenEsqueciSenha: (email: string) => void;
  onToast: (msg: string, isError: boolean) => void;
}

export const AuthTab: React.FC<AuthTabProps> = ({
  usuarioLogado,
  onLogin,
  onRegister,
  onLogout,
  onNavigateGaragem,
  onOpenPerfil,
  onOpenEsqueciSenha,
  onToast,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'cadastro'>('login');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Formulário de Login
  const [loginEmail, setLoginEmail] = useState('marcus.racing@gearcost.app');
  const [loginSenha, setLoginSenha] = useState('Stage2@2026');
  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
  const [lembrarAcesso, setLembrarAcesso] = useState(true);

  // Formulário de Cadastro
  const [cadNome, setCadNome] = useState('');
  const [cadApelido, setCadApelido] = useState('');
  const [cadEmail, setCadEmail] = useState('');
  const [cadTelefone, setCadTelefone] = useState('');
  const [cadNivelGearhead, setCadNivelGearhead] = useState<
    'Entusiasta' | 'Trackday Hero' | 'Stage 2 Pro' | 'Mestre Mecânico'
  >('Stage 2 Pro');
  const [cadSenha, setCadSenha] = useState('');
  const [cadConfirmarSenha, setCadConfirmarSenha] = useState('');
  const [mostrarSenhaCad, setMostrarSenhaCad] = useState(false);
  const [mostrarConfirmarSenhaCad, setMostrarConfirmarSenhaCad] = useState(false);
  const [cadTermosAceitos, setCadTermosAceitos] = useState(true);

  // Avaliação de Força da Senha
  const getForcaSenha = (senha: string) => {
    if (!senha) {
      return { score: 0, label: 'Digite uma senha segura', cor: 'bg-slate-700', textoCor: 'text-slate-400', pct: '0%' };
    }
    if (senha.length < 6) {
      return { score: 1, label: 'Muito curta (mínimo 6 caracteres)', cor: 'bg-rose-500', textoCor: 'text-rose-400', pct: '33%' };
    }
    const temNumero = /\d/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const complexidade = (temNumero ? 1 : 0) + (temEspecial ? 1 : 0) + (temMaiuscula ? 1 : 0);

    if (complexidade >= 2 && senha.length >= 8) {
      return { score: 3, label: 'Senha Forte (Alta Segurança)', cor: 'bg-emerald-500', textoCor: 'text-emerald-400', pct: '100%' };
    }
    return { score: 2, label: 'Senha Média (Adicione símbolos ou números)', cor: 'bg-amber-500', textoCor: 'text-amber-400', pct: '66%' };
  };

  const handleExecutarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginSenha.trim()) {
      onToast('Informe seu e-mail e senha de acesso.', true);
      return;
    }

    setLoadingAuth(true);
    setTimeout(() => {
      setLoadingAuth(false);
      const usuario: Usuario = {
        id: `u_${Date.now()}`,
        nome: loginEmail.toLowerCase().includes('marcus') ? 'Marcus Vinícius Silva' : loginEmail.split('@')[0],
        email: loginEmail.trim(),
        apelidoPiloto: loginEmail.toLowerCase().includes('marcus') ? 'MarcusGT #19' : 'Piloto Gearhead',
        telefone: '(11) 98452-1920',
        nivelGearhead: 'Stage 2 Pro',
        criadoEm: '2024-03-10',
        lembrarAcesso,
      };

      onLogin(usuario);
      onToast(`Bem-vindo à garagem GearCost, ${usuario.nome}!`, false);
      onNavigateGaragem();
    }, 550);
  };

  const handleLoginDemo = () => {
    const usuarioDemo: Usuario = {
      id: 'u_demo',
      nome: 'Marcus Vinícius Silva',
      email: 'marcus.racing@gearcost.app',
      telefone: '(11) 98452-1920',
      apelidoPiloto: 'MarcusGT #19',
      nivelGearhead: 'Stage 2 Pro',
      criadoEm: '2024-03-10',
      lembrarAcesso: true,
    };
    onLogin(usuarioDemo);
    onToast('Autenticado com sucesso como Piloto Demo (MarcusGT #19)!', false);
    onNavigateGaragem();
  };

  const handleExecutarCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadNome.trim() || !cadEmail.trim() || !cadSenha.trim()) {
      onToast('Por favor, preencha nome, e-mail e senha.', true);
      return;
    }

    if (cadSenha.length < 6) {
      onToast('A senha de acesso deve ter pelo menos 6 caracteres.', true);
      return;
    }

    if (cadSenha !== cadConfirmarSenha) {
      onToast('A confirmação de senha não confere.', true);
      return;
    }

    if (!cadTermosAceitos) {
      onToast('Aceite os termos para criar sua garagem.', true);
      return;
    }

    setLoadingAuth(true);
    setTimeout(() => {
      setLoadingAuth(false);
      const novoUsuario: Usuario = {
        id: `u_${Date.now()}`,
        nome: cadNome.trim(),
        email: cadEmail.trim(),
        telefone: cadTelefone.trim() || '(11) 98888-7777',
        apelidoPiloto: cadApelido.trim() || cadNome.split(' ')[0],
        nivelGearhead: cadNivelGearhead,
        criadoEm: new Date().toISOString().split('T')[0],
        lembrarAcesso: true,
      };

      if (onRegister) onRegister(novoUsuario);
      else onLogin(novoUsuario);

      onToast(`Garagem criada com sucesso! Seja bem-vindo, ${novoUsuario.nome}!`, false);
      onNavigateGaragem();
    }, 700);
  };

  const handleLoginBiometria = () => {
    setLoadingAuth(true);
    setTimeout(() => {
      setLoadingAuth(false);
      handleLoginDemo();
      onToast('Face ID / Biometria autenticada com sucesso!', false);
    }, 600);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Hero da Garagem & Piloto */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 mx-auto flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-orange-600/30 mb-2.5">
          G
        </div>
        <h3 className="text-sm font-black text-white tracking-tight flex items-center justify-center gap-1.5">
          <span>GearCost Automotive OS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold">
            OFFLINE-FIRST
          </span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
          Gerenciamento financeiro, telemetria e desgaste de componentes na nuvem ou no SQLite local.
        </p>
      </div>

      {/* Status de Sessão Se o Usuário Já Estiver Autenticado */}
      {usuarioLogado && (
        <div className="p-3.5 rounded-2xl bg-[#18181C] border border-orange-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm border border-orange-500/40">
                {usuarioLogado.apelidoPiloto?.[0] || usuarioLogado.nome[0] || 'P'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{usuarioLogado.nome}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Conectado
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {usuarioLogado.apelidoPiloto || 'Piloto Gearhead'} • {usuarioLogado.nivelGearhead}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={onNavigateGaragem}
              className="py-2 px-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Ir para a Garagem</span>
            </button>
            <button
              type="button"
              onClick={onOpenPerfil}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Ver Perfil</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Alternar conta ou registrar nova garagem:</span>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Sair da Conta
              </button>
            )}
          </div>
        </div>
      )}

      {/* Segmented Control: Toggle Login / Cadastro */}
      <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'login'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Acessar (Login)</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('cadastro')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === 'cadastro'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Criar Garagem</span>
        </button>
      </div>

      {/* MODO 1: TELA DE LOGIN */}
      {authMode === 'login' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <form onSubmit={handleExecutarLogin} className="space-y-3 text-xs">
            {/* Campo E-mail */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                E-mail do Piloto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="piloto@gearcost.app"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-xs"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-300">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => onOpenEsqueciSenha(loginEmail || 'marcus.racing@gearcost.app')}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={mostrarSenhaLogin ? 'text' : 'password'}
                  required
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {mostrarSenhaLogin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar Acesso */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lembrarAcesso}
                  onChange={(e) => setLembrarAcesso(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400">Lembrar neste dispositivo</span>
              </label>
              <span className="text-[9px] text-slate-500 font-mono">SQLite Local</span>
            </div>

            {/* Botão Principal Entrar */}
            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              {loadingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Autenticando Garagem...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Acessar Garagem GearCost</span>
                </>
              )}
            </button>
          </form>

          {/* Atalho de 1-Clique: Piloto Demo MarcusGT */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleLoginDemo}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/30 text-orange-300 font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-left">
                <span className="text-base">⚡</span>
                <div>
                  <div className="text-[11px] font-bold text-white group-hover:text-orange-200">
                    Acesso Rápido de Teste (Piloto Demo)
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    MarcusGT #19 • Stage 2 Pro • Golf GTI
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold shrink-0">
                1-Clique
              </span>
            </button>
          </div>

          {/* Divisor */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-950 px-2 text-slate-500 font-mono">ou autentique com</span>
            </div>
          </div>

          {/* Autenticação Biométrica & Social */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleLoginBiometria}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-orange-400" />
              <span>Biometria / Face ID</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('piloto.google@gearcost.app');
                onToast('Autenticado via Google OAuth!', false);
                handleLoginDemo();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="font-bold text-rose-400">G</span>
              <span>Google ID</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthMode('cadastro')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Ainda não tem conta?{' '}
              <span className="text-orange-400 font-bold hover:underline">
                Criar Garagem agora
              </span>
            </button>
          </div>
        </div>
      )}

      {/* MODO 2: TELA DE CADASTRO */}
      {authMode === 'cadastro' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-orange-400" />
              Criar Nova Garagem & Perfil de Piloto
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Preencha os dados abaixo para configurar seus veículos, telemetria e histórico.
            </p>
          </div>

          <form onSubmit={handleExecutarCadastro} className="space-y-3 text-xs">
            {/* Nome Completo */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={cadNome}
                  onChange={(e) => setCadNome(e.target.value)}
                  placeholder="ex: Marcus Vinícius Silva"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>
            </div>

            {/* Apelido de Piloto */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                Apelido de Piloto / Tag na Pista (opcional)
              </label>
              <input
                type="text"
                value={cadApelido}
                onChange={(e) => setCadApelido(e.target.value)}
                placeholder="ex: MarcusGT #19, Turbo_Leo, Alemão_R"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
              />
            </div>

            {/* E-mail e WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">
                  E-mail Principal *
                </label>
                <input
                  type="email"
                  required
                  value={cadEmail}
                  onChange={(e) => setCadEmail(e.target.value)}
                  placeholder="piloto@gearcost.app"
                  className="w-full px-2.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={cadTelefone}
                  onChange={(e) => setCadTelefone(e.target.value)}
                  placeholder="(11) 98452-1920"
                  className="w-full px-2.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
                />
              </div>
            </div>

            {/* Nível Gearhead */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                Nível Gearhead / Estilo de Condução
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { nivel: 'Entusiasta', icone: '🔰', desc: 'Uso diário & preventivas' },
                  { nivel: 'Trackday Hero', icone: '🏁', desc: 'Pista, freios & pneus' },
                  { nivel: 'Stage 2 Pro', icone: '⚡', desc: 'Remap & telemetria' },
                  { nivel: 'Mestre Mecânico', icone: '🔧', desc: 'Oficina & restauração' },
                ].map((item) => {
                  const isSel = cadNivelGearhead === item.nivel;
                  return (
                    <button
                      key={item.nivel}
                      type="button"
                      onClick={() => setCadNivelGearhead(item.nivel as any)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSel
                          ? 'bg-orange-500/15 border-orange-500 text-white shadow-sm ring-1 ring-orange-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span>{item.icone}</span>
                        <span>{item.nivel}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Senha e Medidor de Força */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-300">
                  Senha de Acesso (mín. 6 dígitos) *
                </label>
                {cadSenha && (
                  <span className={`text-[10px] font-bold ${getForcaSenha(cadSenha).textoCor}`}>
                    {getForcaSenha(cadSenha).label}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={mostrarSenhaCad ? 'text' : 'password'}
                  required
                  value={cadSenha}
                  onChange={(e) => setCadSenha(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhaCad(!mostrarSenhaCad)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {mostrarSenhaCad ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {cadSenha && (
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getForcaSenha(cadSenha).cor}`}
                    style={{ width: getForcaSenha(cadSenha).pct }}
                  />
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 block mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={mostrarConfirmarSenhaCad ? 'text' : 'password'}
                  required
                  value={cadConfirmarSenha}
                  onChange={(e) => setCadConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-900 border rounded-xl text-white placeholder-slate-500 focus:outline-none text-xs font-mono ${
                    cadConfirmarSenha && cadSenha !== cadConfirmarSenha
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-800 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenhaCad(!mostrarConfirmarSenhaCad)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {mostrarConfirmarSenhaCad ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {cadConfirmarSenha && cadSenha !== cadConfirmarSenha && (
                <span className="text-[10px] text-rose-400 mt-1 block">
                  As senhas informadas não conferem.
                </span>
              )}
            </div>

            {/* Termos de Uso */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cadTermosAceitos}
                  onChange={(e) => setCadTermosAceitos(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 leading-tight">
                  Concordo com os Termos de Uso e Armazenamento Local Seguro no SQLite nativo (Offline-First, em conformidade com LGPD).
                </span>
              </label>
            </div>

            {/* Botão Cadastrar */}
            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] mt-2"
            >
              {loadingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Criando Garagem...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Garagem & Conectar</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Já possui uma garagem criada?{' '}
              <span className="text-orange-400 font-bold hover:underline">Fazer Login</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
