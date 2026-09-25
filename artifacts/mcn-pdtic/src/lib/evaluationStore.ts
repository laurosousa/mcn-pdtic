import { EvaluationState, CgdDeliberation, MATRIX_VERSION, REQUIREMENTS_FULL } from '@/data/mcn';
import { buildStateFromParsed } from '@/lib/evaluationIO';
import { UFRR_EVALUATION } from '@/data/evaluations/ufrr-pdtic-2023-2025';

// Chaves do localStorage. A v1 guardava UMA avaliação; a v2 guarda a lista
// (item 6b). A v1 não é apagada após a migração: fica como réplica de segurança.
export const STORAGE_KEY = 'mcn_pdtic_evaluations_v2';
export const LEGACY_STORAGE_KEY = 'mcn_pdtic_full_v1';

export interface EvaluationEntry {
  id: string;
  createdAt: string;
  // Versão da matriz no momento em que a avaliação entrou no app (criação,
  // migração da v1 ou importação). É um snapshot: é o que permite avisar sobre
  // matrizes divergentes na comparação entre ciclos.
  matrixVersion: string;
  state: EvaluationState;
}

export interface EvaluationsStorage {
  version: 2;
  activeId: string;
  evaluations: EvaluationEntry[];
}

export function newId(): string {
  return `avaliacao-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function freshDeliberation(): CgdDeliberation {
  return { meetingDate: '', decision: '', followUps: '', responsibles: '' };
}

export function freshState(): EvaluationState {
  return {
    institutionName: '',
    pdticPeriod: '',
    evaluatorName: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    normativeCutoffDate: '2023-11-06',
    requirements: REQUIREMENTS_FULL.map(r => ({ ...r, evidenceLocation: r.evidenceLocation ?? '', gapPatterns: [] })),
    cgdDeliberation: freshDeliberation(),
  };
}

export function makeEntry(state: EvaluationState, matrixVersion: string = MATRIX_VERSION): EvaluationEntry {
  return { id: newId(), createdAt: new Date().toISOString(), matrixVersion, state };
}

// Estado inicial de um novo ciclo da UFRR: parte da avaliação de referência
// 2023–2025 (classificações, evidências e justificativas como baseline a revisar),
// com identificação do novo ciclo e deliberação do CGD em branco.
export function ufrrReferenceState(institutionName = '', pdticPeriod = ''): EvaluationState {
  return {
    ...UFRR_EVALUATION,
    institutionName: institutionName || UFRR_EVALUATION.institutionName,
    pdticPeriod,
    evaluatorName: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    cgdDeliberation: freshDeliberation(),
    requirements: UFRR_EVALUATION.requirements.map(r => ({ ...r, gapPatterns: r.gapPatterns ? [...r.gapPatterns] : [] })),
  };
}

// Rótulo derivado do conteúdo — instituição e período são editáveis, então o
// rótulo acompanha sem precisar de campo persistido.
export function entryLabel(entry: EvaluationEntry): string {
  const inst = entry.state.institutionName || 'Avaliação sem nome';
  return entry.state.pdticPeriod ? `${inst} · ${entry.state.pdticPeriod}` : inst;
}

// "MCN-PDTIC 1.0 — versão auditada (...)" → "MCN-PDTIC 1.0"
export function shortMatrixVersion(matrixVersion: string): string {
  return matrixVersion.split('—')[0].trim() || matrixVersion;
}

function toEntry(raw: unknown): EvaluationEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== 'string' || !p.id) return null;
  return {
    id: p.id,
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString(),
    matrixVersion: typeof p.matrixVersion === 'string' ? p.matrixVersion : MATRIX_VERSION,
    state: buildStateFromParsed((p.state ?? p) as Parameters<typeof buildStateFromParsed>[0]),
  };
}

// Tolerante a campos ausentes/estranhos; devolve null se não houver avaliações.
export function normalizeStorage(parsed: unknown): EvaluationsStorage | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const p = parsed as Record<string, unknown>;
  if (!Array.isArray(p.evaluations)) return null;
  const evaluations = p.evaluations.map(toEntry).filter((e): e is EvaluationEntry => e !== null);
  if (evaluations.length === 0) return null;
  const activeId =
    typeof p.activeId === 'string' && evaluations.some(e => e.id === p.activeId)
      ? p.activeId
      : evaluations[0].id;
  return { version: 2, activeId, evaluations };
}

export function migrateLegacyState(rawV1: string): EvaluationsStorage | null {
  try {
    const entry = makeEntry(buildStateFromParsed(JSON.parse(rawV1)));
    return { version: 2, activeId: entry.id, evaluations: [entry] };
  } catch {
    return null;
  }
}

export function loadStorage(): EvaluationsStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const normalized = normalizeStorage(JSON.parse(raw));
      if (normalized) return normalized;
    }
  } catch {
    // storage corrompido: cai para a migração da v1 e, por fim, avaliação nova
  }
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = migrateLegacyState(legacy);
      if (migrated) return migrated;
    }
  } catch {
    // sem v1: segue para a avaliação nova
  }
  const entry = makeEntry(freshState());
  return { version: 2, activeId: entry.id, evaluations: [entry] };
}

export function createFreshStorage(): EvaluationsStorage {
  const entry = makeEntry(freshState());
  return { version: 2, activeId: entry.id, evaluations: [entry] };
}
