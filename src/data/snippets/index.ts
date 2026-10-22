import { CodeSnippet } from './types';
import { folderStructureSnippet } from './architecture/folderStructureSnippet';
import { pubspecYamlSnippet } from './architecture/pubspecYamlSnippet';
import { solidArchitectureSnippet } from './architecture/solidArchitectureSnippet';
import { databaseHelperSnippet } from './database/databaseHelperSnippet';
import { repositoriesSnippet } from './database/repositoriesSnippet';
import { fipeServiceSnippet } from './service/fipeServiceSnippet';
import { dataModelsSnippet } from './models/dataModelsSnippet';
import { garagemControllerSnippet } from './state/garagemControllerSnippet';
import { veiculoFormSnippet } from './ui/veiculoFormSnippet';
import { garagemOdometroSnippet } from './ui/garagemOdometroSnippet';
import { financeiroHistoricoSnippet } from './ui/financeiroHistoricoSnippet';
import { telemetriaPecasSnippet } from './ui/telemetriaPecasSnippet';
import { authScreenSnippet } from './ui/authScreenSnippet';

export * from './types';
export {
  folderStructureSnippet,
  pubspecYamlSnippet,
  solidArchitectureSnippet,
  databaseHelperSnippet,
  repositoriesSnippet,
  fipeServiceSnippet,
  dataModelsSnippet,
  garagemControllerSnippet,
  veiculoFormSnippet,
  garagemOdometroSnippet,
  financeiroHistoricoSnippet,
  telemetriaPecasSnippet,
  authScreenSnippet,
};

export const FLUTTER_CODE_SNIPPETS: CodeSnippet[] = [
  folderStructureSnippet,
  pubspecYamlSnippet,
  solidArchitectureSnippet,
  databaseHelperSnippet,
  repositoriesSnippet,
  fipeServiceSnippet,
  dataModelsSnippet,
  garagemControllerSnippet,
  veiculoFormSnippet,
  garagemOdometroSnippet,
  financeiroHistoricoSnippet,
  telemetriaPecasSnippet,
  authScreenSnippet,
];
