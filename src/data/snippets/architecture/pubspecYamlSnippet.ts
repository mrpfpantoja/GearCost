import { CodeSnippet } from '../types';

export const pubspecYamlSnippet: CodeSnippet = {
    id: 'pubspec-yaml',
    title: '2. Arquivo pubspec.yaml Completo',
    fileName: 'pubspec.yaml',
    language: 'yaml',
    category: 'architecture',
    description: 'Declaração completa de dependências com versões compatíveis e null-safety estrita.',
    code: `name: gearcost
description: "Gestão Financeira Veicular, Telemetria de Desgaste e Planejamento de Upgrades"
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'
  flutter: ">=3.19.0"

dependencies:
  flutter:
    sdk: flutter

  # Persistência Relacional Local (ACID com Foreign Keys)
  sqflite: ^2.3.3+1
  path: ^1.9.0

  # Comunicação de Rede & Consumo da API Tabela Fipe
  http: ^1.2.1

  # Gerenciamento de Estado Reativo
  provider: ^6.1.2

  # Formatação de Datas e Valores Monetários (BRL R$ e km)
  intl: ^0.19.0

  # Identificadores Únicos Universais
  uuid: ^4.4.0

  # Ícones Automotivos e UI Moderna
  font_awesome_flutter: ^10.7.0
  cupertino_icons: ^1.0.8

  # Utilitários Visuais
  google_fonts: ^6.2.1
  flutter_spinkit: ^5.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
    - assets/images/`
  };
