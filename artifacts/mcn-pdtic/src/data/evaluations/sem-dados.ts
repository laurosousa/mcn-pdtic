// Edição pública: substitui a avaliação de referência UFRR 2023–2025 por um estado vazio.
// O vite.config.ts troca o módulo ufrr-pdtic-2023-2025 por este, exceto quando VITE_EDICAO=completa,
// então nenhuma classificação, evidência ou justificativa da UFRR entra no pacote publicado.
import { REQUIREMENTS_FULL, type EvaluationState } from '../mcn';

export const UFRR_EVALUATION: EvaluationState = {
  institutionName: '',
  pdticPeriod: '',
  evaluatorName: '',
  evaluationDate: '',
  normativeCutoffDate: '2023-11-06',
  requirements: REQUIREMENTS_FULL.map(r => ({ ...r, evidenceLocation: '', gapPatterns: [] })),
};
