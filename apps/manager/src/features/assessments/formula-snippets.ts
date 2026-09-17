import {
  KATEX_PRESETS_DATA,
  FormulaPresetItem,
  searchFormulaPresets,
  getFormulaSuggestions,
} from '@cbt/shared';

export type FormulaSnippet = FormulaPresetItem;

export interface SubjectCategory {
  id: string;
  name: string;
  snippets: FormulaSnippet[];
}

export const FORMULA_CATEGORIES: SubjectCategory[] = KATEX_PRESETS_DATA.categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  snippets: KATEX_PRESETS_DATA.presets.filter((p) => p.category === cat.id),
}));

export { searchFormulaPresets, getFormulaSuggestions };
