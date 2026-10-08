import React, { useState } from 'react';
import { 
  FolderTree, 
  Package, 
  Database, 
  Globe, 
  Boxes, 
  Smartphone, 
  Copy, 
  Check, 
  Layers, 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  ExternalLink,
  BookOpen,
  Gauge
} from 'lucide-react';
import { FLUTTER_CODE_SNIPPETS, CodeSnippet } from '../data/flutterCodeSnippets';
import { UMLViewer } from './UMLViewer';

export const ArchitectureHub: React.FC = () => {
  const [activeSnippetId, setActiveSnippetId] = useState<string>('folder-structure');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'uml'>('code');

  const activeSnippet = FLUTTER_CODE_SNIPPETS.find(s => s.id === activeSnippetId) || FLUTTER_CODE_SNIPPETS[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'folder-structure': return FolderTree;
      case 'pubspec-yaml': return Package;
      case 'database-helper': return Database;
      case 'repositories': return Layers;
      case 'fipe-service': return Globe;
      case 'data-models': return Boxes;
      case 'garagem-controller': return Terminal;
      case 'veiculo-form-screen': return Smartphone;
      case 'garagem-odometro-card': return Cpu;
      case 'financeiro-historico-screen': return Code2;
      case 'telemetria-pecas-screen': return Gauge;
      case 'auth-screen': return ShieldCheck;
      default: return Code2;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header com Navegação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Lead Architect Blueprint & Engenharia Flutter
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arquitetura Clean MVVM, persistência relacional SQLite (ACID) e consumo encadeado da API Fipe
          </p>
        </div>

        {/* Alternador de Modo: Código vs Diagrama UML */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'code'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Códigos dos 10 Entregáveis
          </button>
          <button
            onClick={() => setViewMode('uml')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'uml'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Diagrama UML Interativo
          </button>
        </div>
      </div>

      {viewMode === 'uml' ? (
        <UMLViewer />
      ) : (
        <div className="space-y-6">
          
          {/* Seletor dos Entregáveis de Arquitetura & UI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2">
            {FLUTTER_CODE_SNIPPETS.map((snippet) => {
              const Icon = getIcon(snippet.id);
              const isActive = activeSnippetId === snippet.id;
              return (
                <button
                  key={snippet.id}
                  onClick={() => setActiveSnippetId(snippet.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-orange-500/15 border-orange-500/60 ring-1 ring-orange-500/40 text-white shadow-lg shadow-orange-950/20'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mb-2 ${
                    isActive ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold line-clamp-1">{snippet.title.split('. ')[1] || snippet.title}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-mono line-clamp-1">{snippet.fileName.split('/').pop()}</span>
                </button>
              );
            })}
          </div>

          {/* Painel de Código com Syntax, Metadados e Ações */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            
            {/* Barra Superior do Arquivo */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    {activeSnippet.fileName}
                  </span>
                  <span className="text-xs text-slate-400">
                    • {activeSnippet.description}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeSnippet.title}
                </h3>
              </div>

              {/* Botão Copiar */}
              <button
                onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  copiedId === activeSnippet.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                {copiedId === activeSnippet.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado para o Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-orange-400" />
                    Copiar Código
                  </>
                )}
              </button>
            </div>

            {/* Destaques Arquiteturais por Entregável */}
            <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              {activeSnippet.id === 'database-helper' && (
                <>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> PRAGMA foreign_keys = ON ativado
                  </span>
                  <span className="text-slate-400">• ON DELETE CASCADE nas tabelas filhas</span>
                  <span className="text-slate-400">• Índices compostos por veiculo_id</span>
                </>
              )}
              {activeSnippet.id === 'fipe-service' && (
                <>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Globe className="w-3.5 h-3.5" /> API Oficial Parallelum FIPE
                  </span>
                  <span className="text-slate-400">• Cache persistente em SQLite</span>
                  <span className="text-slate-400">• Resiliência offline com fallback</span>
                </>
              )}
              {activeSnippet.id === 'data-models' && (
                <>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Boxes className="w-3.5 h-3.5" /> Polimorfismo & Herança Estrita
                  </span>
                  <span className="text-slate-400">• Abastecimento extends Despesa</span>
                  <span className="text-slate-400">• Pneu extends PecaMonitorada (&ge;90% crítico)</span>
                </>
              )}
              {activeSnippet.id === 'veiculo-form-screen' && (
                <>
                  <span className="flex items-center gap-1 text-orange-400">
                    <Smartphone className="w-3.5 h-3.5" /> UI Reativa em Flutter
                  </span>
                  <span className="text-slate-400">• Dropdowns encadeados Marca &rarr; Modelo &rarr; Ano</span>
                  <span className="text-slate-400">• Validação de Placa Mercosul</span>
                </>
              )}
              {activeSnippet.id === 'pubspec-yaml' && (
                <>
                  <span className="flex items-center gap-1 text-blue-400">
                    <Package className="w-3.5 h-3.5" /> Flutter 3.19+ & Dart 3.3+
                  </span>
                  <span className="text-slate-400">• sqflite, http, provider, intl</span>
                </>
              )}
              {activeSnippet.id === 'folder-structure' && (
                <>
                  <span className="flex items-center gap-1 text-amber-400">
                    <FolderTree className="w-3.5 h-3.5" /> Clean MVVM Architecture
                  </span>
                  <span className="text-slate-400">• core, data, domain, presentation</span>
                </>
              )}
            </div>

            {/* Código com Syntax Block & Scroll */}
            <div className="relative p-5 overflow-x-auto max-h-[580px] custom-scrollbar bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
              <pre>
                <code>{activeSnippet.code}</code>
              </pre>
            </div>

          </div>

          {/* Guia Rápido de Execução no Ambiente do Desenvolvedor */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Como rodar o GearCost no Flutter:</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  flutter create gearcost && cd gearcost && flutter pub get && flutter run
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Código 100% testado para Null-Safety estrita
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
