import { CodeSnippet } from '../types';

export const folderStructureSnippet: CodeSnippet = {
    id: 'folder-structure',
    title: '1. Estrutura de Pastas do Projeto Flutter (Feature-First)',
    fileName: 'lib/ (Feature-First + Clean Architecture)',
    language: 'markdown',
    category: 'architecture',
    description: 'Arquitetura modular Feature-First + Clean Architecture fatiando arquivos monolíticos de 1000+ linhas em submódulos desacoplados de alta coesão.',
    code: `gearcost/
├── android/
├── ios/
├── assets/
│   ├── icons/
│   └── images/
├── lib/
│   ├── main.dart                                # Entrypoint e Inicialização
│   │
│   ├── core/                                    # Módulos Transversais & Infraestrutura
│   │   ├── constants/
│   │   │   ├── app_colors.dart                  # Paleta automotiva (carbon, asphalt, neon orange)
│   │   │   └── api_endpoints.dart               # URLs da API Tabela Fipe
│   │   ├── database/
│   │   │   ├── database_helper.dart             # SQLite nativo (sqflite) e migrations
│   │   │   └── table_names.dart                 # Constantes de tabelas e PRAGMA foreign_keys
│   │   ├── errors/
│   │   │   ├── exceptions.dart                  # ServerException, DatabaseException
│   │   │   └── failures.dart                    # Mapeamento para mensagens de UI
│   │   ├── network/
│   │   │   └── http_client.dart                 # Cliente HTTP com interceptors e timeout
│   │   ├── theme/
│   │   │   ├── app_theme.dart                   # Dark theme automotivo
│   │   │   └── text_styles.dart
│   │   └── utils/
│   │       ├── currency_formatter.dart          # Formatação R$ (Real Brasileiro)
│   │       ├── date_formatter.dart              # ISO8601 <-> dd/MM/yyyy
│   │       └── km_formatter.dart                # Formatação de Odômetro
│   │
│   └── features/                                # Arquitetura Dividida por Funcionalidades
│       │
│       ├── garage/                              # FEATURE: Garagem & Telemetria de Desgaste
│       │   ├── data/
│       │   │   ├── datasources/
│       │   │   │   ├── veiculo_local_datasource.dart
│       │   │   │   └── pecas_local_datasource.dart
│       │   │   ├── models/
│       │   │   │   ├── veiculo_model.dart       # toMap() e fromMap() SQLite
│       │   │   │   └── peca_monitorada_model.dart
│       │   │   └── repositories/
│       │   │       └── veiculo_repository_impl.dart
│       │   ├── domain/
│       │   │   ├── entities/
│       │   │   │   ├── veiculo_entity.dart      # Pure Dart
│       │   │   │   ├── peca_monitorada_entity.dart
│       │   │   │   └── pneu_entity.dart
│       │   │   ├── repositories/
│       │   │   │   └── i_veiculo_repository.dart
│       │   │   └── services/
│       │   │       ├── telemetria_calculadora.dart # Fórmulas puras de desgaste e alerta crítico >= 90%
│       │   │       └── odometro_service.dart
│       │   └── presentation/
│       │       ├── controllers/
│       │       │   ├── garagem_controller.dart  # ChangeNotifier / State (< 150 linhas)
│       │       │   └── telemetria_controller.dart
│       │       ├── screens/
│       │       │   ├── garagem_screen.dart      # View Orquestradora Enxuta (120 linhas)
│       │       │   ├── telemetria_pecas_screen.dart
│       │       │   └── cadastro_veiculo_screen.dart
│       │       └── widgets/
│       │           ├── garagem_odometro_card.dart # Componente isolado
│       │           ├── telemetria_peca_tile.dart  # Tile individual com desgaste e badges
│       │           ├── telemetria_filtro_chips.dart
│       │           ├── modal_pecas_essenciais.dart# BottomSheet rápida do catálogo
│       │           └── dialog_atualizar_km.dart
│       │
│       ├── finance/                             # FEATURE: Gestão Financeira & Despesas
│       │   ├── data/
│       │   │   ├── datasources/
│       │   │   │   └── despesas_local_datasource.dart
│       │   │   ├── models/
│       │   │   │   ├── despesa_model.dart
│       │   │   │   ├── abastecimento_model.dart
│       │   │   │   └── manutencao_gasto_model.dart
│       │   │   └── repositories/
│       │   │       └── despesa_repository_impl.dart
│       │   ├── domain/
│       │   │   ├── entities/
│       │   │   │   ├── despesa_entity.dart      # Pure Dart
│       │   │   │   └── tipo_despesa_enum.dart
│       │   │   ├── repositories/
│       │   │   │   └── i_despesa_repository.dart
│       │   │   └── services/
│       │   │       ├── custo_km_calculadora.dart# Regras de R$/KM e consumo médio km/L
│       │   │       └── filtro_despesas_service.dart
│       │   └── presentation/
│       │       ├── controllers/
│       │       │   ├── financeiro_controller.dart# Gerenciador de estado e filtros
│       │       │   └── nova_despesa_controller.dart
│       │       ├── screens/
│       │       │   ├── financeiro_historico_screen.dart # View Orquestradora Enxuta (150 linhas)
│       │       │   └── nova_despesa_screen.dart
│       │       └── widgets/
│       │           ├── financeiro_busca_bar.dart  # Campo de pesquisa isolado
│       │           ├── financeiro_categoria_chips.dart
│       │           ├── financeiro_kpi_banner.dart # Banner de métricas (Total, R$/KM)
│       │           ├── financeiro_item_tile.dart  # Card polimórfico de gasto
│       │           └── modal_filtros_avancados.dart # BottomSheet com data e KM
│       │
│       ├── maintenance/                         # FEATURE: Manutenções Programadas
│       │   ├── data/
│       │   │   └── models/manutencao_programada_model.dart
│       │   ├── domain/
│       │   │   ├── entities/manutencao_programada_entity.dart
│       │   │   └── services/revisao_prazo_service.dart
│       │   └── presentation/
│       │       ├── controllers/manutencao_controller.dart
│       │       └── widgets/alerta_revisao_card.dart
│       │
│       ├── stages/                              # FEATURE: Upgrades & Projetos
│       │   ├── data/
│       │   │   └── models/stage_item_model.dart
│       │   ├── domain/
│       │   │   ├── entities/stage_item_entity.dart
│       │   │   └── services/stage_investimento_service.dart
│       │   └── presentation/
│       │       ├── controllers/stages_controller.dart
│       │       ├── screens/roadmap_stages_screen.dart
│       │       └── widgets/stage_progress_tile.dart
│       │
│       └── auth/                                # FEATURE: Autenticação & Perfil de Piloto
│           ├── data/
│           │   ├── datasources/auth_local_datasource.dart
│           │   └── models/usuario_model.dart
│           ├── domain/
│           │   ├── entities/usuario_entity.dart
│           │   └── services/auth_validation_service.dart
│           └── presentation/
│               ├── controllers/auth_controller.dart
│               ├── screens/auth_screen.dart     # View Orquestradora com Login/Cadastro
│               └── widgets/
│                   ├── auth_header_banner.dart
│                   ├── password_strength_indicator.dart
│                   └── modal_perfil_piloto.dart
│
├── test/
└── pubspec.yaml`
  };
