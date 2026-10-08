export type SnippetCategory = 'architecture' | 'database' | 'service' | 'models' | 'ui' | 'state';

export interface CodeSnippet {
  id: string;
  title: string;
  fileName: string;
  language: string;
  category: SnippetCategory;
  description: string;
  code: string;
}
