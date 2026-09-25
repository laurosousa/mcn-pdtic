import {
  EvaluationState,
  Compliance,
  CgdDeliberation,
  GapPatternId,
  MATRIX_VERSION,
  REQUIREMENTS_FULL,
  calculateIndex,
  countByCompliance,
} from '@/data/mcn';

// Envelope do arquivo de avaliação exportado/importado (.json).
// Os campos da matriz (descrição, fonte, natureza etc.) não são serializados:
// na importação eles são re-hidratados a partir de REQUIREMENTS_FULL, do mesmo
// modo que o loadState faz com o localStorage.
const SCHEMA = 'mcn-pdtic/avaliacao';
const FORMAT_VERSION = 1;

const VALID_COMPLIANCE: Compliance[] = [
  'Conforme',
  'Conforme Parcial',
  'Não Conforme',
  'Não Aplicável',
  'Não Avaliado',
];

// Classificações usadas antes da nomenclatura atual (Seção 3.6.3 da dissertação).
const LEGACY_COMPLIANCE: Record<string, Compliance> = {
  'Atendido': 'Conforme',
  'Parcialmente Atendido': 'Conforme Parcial',
  'Não Atendido': 'Não Conforme',
};

function migrateCompliance(compliance: unknown): Compliance {
  if (typeof compliance !== 'string') return 'Não Avaliado';
  const mapped = LEGACY_COMPLIANCE[compliance] ?? compliance;
  return VALID_COMPLIANCE.includes(mapped as Compliance) ? (mapped as Compliance) : 'Não Avaliado';
}

// Reconstrói um EvaluationState a partir de um objeto parseado, tolerando campos
// ausentes (mesma tolerância do loadState). Usado pelo import e pelo loadState.
export function buildStateFromParsed(parsed: {
  institutionName?: unknown;
  pdticPeriod?: unknown;
  evaluatorName?: unknown;
  evaluationDate?: unknown;
  normativeCutoffDate?: unknown;
  requirements?: unknown;
  cgdDeliberation?: unknown;
}): EvaluationState {
  const reqs = Array.isArray(parsed.requirements) ? parsed.requirements : [];
  const savedById = new Map(
    reqs
      .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
      .map(r => [
        String(r.id),
        {
          compliance: migrateCompliance(r.compliance),
          observation: typeof r.observation === 'string' ? r.observation : '',
          evidenceLocation: typeof r.evidenceLocation === 'string' ? r.evidenceLocation : '',
          gapPatterns: Array.isArray(r.gapPatterns) ? (r.gapPatterns as GapPatternId[]) : [],
        },
      ])
  );

  const requirements = REQUIREMENTS_FULL.map(r => {
    const saved = savedById.get(r.id);
    if (saved) return { ...r, ...saved };
    return { ...r, evidenceLocation: '', gapPatterns: [] };
  });

  const d = (parsed.cgdDeliberation ?? {}) as Record<string, unknown>;
  const cgdDeliberation: CgdDeliberation = {
    meetingDate: typeof d.meetingDate === 'string' ? d.meetingDate : '',
    decision: typeof d.decision === 'string' ? d.decision : '',
    followUps: typeof d.followUps === 'string' ? d.followUps : '',
    responsibles: typeof d.responsibles === 'string' ? d.responsibles : '',
  };

  return {
    institutionName: typeof parsed.institutionName === 'string' ? parsed.institutionName : '',
    pdticPeriod: typeof parsed.pdticPeriod === 'string' ? parsed.pdticPeriod : '',
    evaluatorName: typeof parsed.evaluatorName === 'string' ? parsed.evaluatorName : '',
    evaluationDate:
      typeof parsed.evaluationDate === 'string'
        ? parsed.evaluationDate
        : new Date().toISOString().split('T')[0],
    normativeCutoffDate:
      typeof parsed.normativeCutoffDate === 'string' ? parsed.normativeCutoffDate : '2023-11-06',
    requirements,
    cgdDeliberation,
  };
}

function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    // remove marcas combinantes (diacríticos), ex.: "ão" → "ao"
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'ifes';
}

export function buildExportFileName(state: EvaluationState): string {
  const parts = [
    'avaliacao-mcn-pdtic',
    slugify(state.institutionName),
    slugify(state.pdticPeriod),
    new Date().toISOString().split('T')[0].replace(/-/g, ''),
  ].filter(Boolean);
  return `${parts.join('-')}.json`;
}

export function serializeEvaluation(state: EvaluationState): string {
  const envelope = {
    schema: SCHEMA,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    matrixVersion: MATRIX_VERSION,
    normativeCutoffDate: state.normativeCutoffDate,
    state: {
      institutionName: state.institutionName,
      pdticPeriod: state.pdticPeriod,
      evaluatorName: state.evaluatorName,
      evaluationDate: state.evaluationDate,
      normativeCutoffDate: state.normativeCutoffDate,
      requirements: state.requirements.map(r => ({
        id: r.id,
        compliance: r.compliance,
        observation: r.observation ?? '',
        evidenceLocation: r.evidenceLocation ?? '',
        gapPatterns: r.gapPatterns ?? [],
      })),
      cgdDeliberation: state.cgdDeliberation ?? {
        meetingDate: '',
        decision: '',
        followUps: '',
        responsibles: '',
      },
    },
  };
  return JSON.stringify(envelope, null, 2);
}

export function downloadEvaluation(state: EvaluationState): void {
  const blob = new Blob([serializeEvaluation(state)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = buildExportFileName(state);
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportSummary {
  exportedAt: string | null;
  matrixVersion: string | null;
  matrixVersionMatches: boolean;
  institutionName: string;
  pdticPeriod: string;
  evaluatorName: string;
  evaluationDate: string;
  normativeCutoffDate: string;
  counts: Record<Compliance, number>;
  evaluatedCount: number;
  icd: number | null;
}

export type ParseResult =
  | { ok: true; state: EvaluationState; summary: ImportSummary }
  | { ok: false; error: string };

export function parseEvaluationFile(text: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'O arquivo selecionado não é um JSON válido.' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'O conteúdo do arquivo não é um objeto JSON.' };
  }
  const envelope = parsed as Record<string, unknown>;
  if (envelope.schema !== SCHEMA) {
    return {
      ok: false,
      error: 'Este arquivo não é uma avaliação exportada pelo MCN-PDTIC (campo "schema" ausente ou desconhecido).',
    };
  }
  if (envelope.version !== FORMAT_VERSION) {
    return {
      ok: false,
      error: `Versão do formato não suportada (${String(envelope.version)}; esperado ${FORMAT_VERSION}).`,
    };
  }
  if (!envelope.state || typeof envelope.state !== 'object' || !Array.isArray((envelope.state as Record<string, unknown>).requirements)) {
    return { ok: false, error: 'O arquivo não contém a lista de requisitos da avaliação.' };
  }

  const state = buildStateFromParsed(envelope.state as Parameters<typeof buildStateFromParsed>[0]);
  const counts = countByCompliance(state.requirements);
  const summary: ImportSummary = {
    exportedAt: typeof envelope.exportedAt === 'string' ? envelope.exportedAt : null,
    matrixVersion: typeof envelope.matrixVersion === 'string' ? envelope.matrixVersion : null,
    matrixVersionMatches: envelope.matrixVersion === MATRIX_VERSION,
    institutionName: state.institutionName,
    pdticPeriod: state.pdticPeriod,
    evaluatorName: state.evaluatorName,
    evaluationDate: state.evaluationDate,
    normativeCutoffDate: state.normativeCutoffDate,
    counts,
    evaluatedCount: state.requirements.filter(r => r.compliance !== 'Não Avaliado').length,
    icd: calculateIndex(state.requirements),
  };
  return { ok: true, state, summary };
}
