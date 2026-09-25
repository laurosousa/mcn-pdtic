export type Classification = 'Obrigatório' | 'Recomendado' | 'Complementar';
export type Compliance = 'Conforme' | 'Conforme Parcial' | 'Não Conforme' | 'Não Aplicável' | 'Não Avaliado';
export type Dimension = 'Normativa' | 'Estratégica' | 'Operacional' | 'Governança';
export type SourceType =
  | 'Lei, decreto ou portaria'
  | 'Instrução normativa de contratação'
  | 'Guia ou orientação técnica'
  | 'Jurisprudência ou referencial'
  | 'Ato institucional';
export type Natureza =
  | 'Regra de elaboração do PDTIC'
  | 'Contratação/execução'
  | 'Transparência'
  | 'Governança'
  | 'Orientação'
  | 'Boa prática';

export const MATRIX_VERSION_ID = '1.0';
export const MATRIX_VERSION = 'MCN-PDTIC 1.0 — versão auditada (80 requisitos; corte 2023-11-06; manutenção 2026-09-15)';

export interface Requirement {
  id: string;
  dimension: Dimension;
  description: string;
  normativeSource: string;
  classification: Classification;
  verificationCriterion?: string;
  relatedRequirementIds?: string[];
  temporalNote?: string;
  sourceType: SourceType;
  natureza: Natureza;
  issuer: string;
  sourceTitle: string;
  validityAtCutoff: string;
  legalBasis: string;
  officialSourceUrls: string[];
  compliance: Compliance;
  observation: string;
  evidenceLocation?: string; // localização da evidência no documento (seção, página, citação)
  gapPatterns?: GapPatternId[]; // padrões de lacuna (análise do avaliador; itens CP e NC)
}

export interface EvaluationState {
  institutionName: string;
  pdticPeriod: string;
  evaluatorName: string;
  evaluationDate: string;
  normativeCutoffDate: string;
  requirements: Requirement[];
  cgdDeliberation?: CgdDeliberation; // registro da deliberação do CGD sobre o relatório
}

export interface CgdDeliberation {
  meetingDate: string;
  decision: string;
  followUps: string;
  responsibles: string;
}

export const COMPLIANCE_SCORE: Record<Compliance, number | null> = {
  'Conforme': 1.0,
  'Conforme Parcial': 0.5,
  'Não Conforme': 0.0,
  'Não Aplicável': null,
  'Não Avaliado': null,
};

export const DIMENSIONS: Dimension[] = ['Normativa', 'Estratégica', 'Operacional', 'Governança'];

export const CLASSIFICATIONS: Classification[] = ['Obrigatório', 'Recomendado', 'Complementar'];

export const CLASSIFICATION_COLOR: Record<Classification, string> = {
  'Obrigatório': '#C62828',
  'Recomendado': '#1565C0',
  'Complementar': '#2E7D32',
};

// ─── PADRÕES DE LACUNA (Quadro 16 da dissertação, Seção 4.7) ────────────────
// Agrupamento analítico dos itens Conforme Parcial e Não Conforme. A atribuição
// a um requisito é análise do avaliador (leitura conjunta), não propriedade
// a priori da matriz; por isso o campo é opcional e multi-valorado.
export type GapPatternId =
  | 'formulacao-sem-operacionalizacao'
  | 'governanca-formal-incompleta'
  | 'integracao-insuficiente-planejamento'
  | 'transparencia-gestao-documental'
  | 'controles-transversais';

export interface GapPattern {
  id: GapPatternId;
  name: string;
  manifestation: string;
  dimensions: Dimension[];
  implication: string;
}

export const GAP_PATTERNS: GapPattern[] = [
  {
    id: 'formulacao-sem-operacionalizacao',
    name: 'Formulação sem operacionalização',
    manifestation: 'Objetivos e ações sem custo, fonte, responsável e cronograma individualizado.',
    dimensions: ['Estratégica', 'Operacional'],
    implication: 'Reduz a exequibilidade e dificulta o monitoramento.',
  },
  {
    id: 'governanca-formal-incompleta',
    name: 'Governança formal incompleta',
    manifestation: 'CGD citado sem evidência de deliberação; papéis, prestação de contas e auditoria insuficientes.',
    dimensions: ['Normativa', 'Governança'],
    implication: 'Fragiliza legitimidade, responsabilização e controle.',
  },
  {
    id: 'integracao-insuficiente-planejamento',
    name: 'Integração insuficiente do planejamento',
    manifestation: 'Ausência de correspondência explícita entre PDTIC, PCA, contratações, PDI e referenciais digitais.',
    dimensions: ['Normativa', 'Estratégica', 'Operacional'],
    implication: 'Favorece decisões fragmentadas e baixa rastreabilidade.',
  },
  {
    id: 'transparencia-gestao-documental',
    name: 'Transparência e gestão documental frágeis',
    manifestation: 'Sem comprovação de publicação aberta, histórico de versões e relatório anual consolidado.',
    dimensions: ['Normativa', 'Governança'],
    implication: 'Limita controle social, atualização e auditabilidade.',
  },
  {
    id: 'controles-transversais',
    name: 'Controles transversais pouco desenvolvidos',
    manifestation: 'Continuidade, mudanças, dados pessoais, acessibilidade e maturidade sem tratamento estruturado.',
    dimensions: ['Estratégica', 'Operacional', 'Governança'],
    implication: 'Mantém riscos relevantes sem resposta documental suficiente.',
  },
];

export const DIMENSION_DESCRIPTIONS: Record<Dimension, string> = {
  'Normativa': 'Aderência formal ao arcabouço normativo federal e institucional que disciplina a elaboração de PDTICs no âmbito do SISP e das IFES.',
  'Estratégica': 'Alinhamento do PDTIC aos objetivos institucionais, às políticas de governo digital e à missão da instituição, com diagnóstico situacional e portfólio de iniciativas.',
  'Operacional': 'Materialização do plano por meio de metas, ações, responsáveis, prazos, custos e mecanismos de monitoramento e controle da execução.',
  'Governança': 'Estruturas de decisão, controle, transparência, gestão de riscos e prestação de contas que sustentam o ciclo de vida do PDTIC.',
};

export const DIMENSION_COLOR: Record<Dimension, string> = {
  'Normativa': '#1565C0',
  'Estratégica': '#2E7D32',
  'Operacional': '#E65100',
  'Governança': '#6A1B9A',
};

export const COMPLIANCE_COLOR: Record<Compliance, string> = {
  'Conforme': '#2E7D32',
  'Conforme Parcial': '#F9A825',
  'Não Conforme': '#C62828',
  'Não Aplicável': '#546E7A',
  'Não Avaliado': '#757575',
};

// Escala de conformidade da dissertação (5 faixas): 90–100 Excelente · 75–89 Adequada ·
// 60–74 Parcial · 40–59 Insuficiente · 0–39 Crítica.
export function getConformityLabel(index: number): { label: string; color: string; bg: string } {
  if (index >= 0.90) return { label: 'Conformidade Excelente', color: '#1B5E20', bg: '#E8F5E9' };
  if (index >= 0.75) return { label: 'Conformidade Adequada', color: '#2E7D32', bg: '#E8F5E9' };
  if (index >= 0.60) return { label: 'Conformidade Parcial', color: '#E65100', bg: '#FFF3E0' };
  if (index >= 0.40) return { label: 'Conformidade Insuficiente', color: '#BF360C', bg: '#FBE9E7' };
  return { label: 'Conformidade Crítica', color: '#B71C1C', bg: '#FFEBEE' };
}

// Formata o ICD (0–1) como percentual brasileiro com 2 casas: 0.538461 → "53,85%".
export function formatICDPercent(index: number | null): string {
  if (index === null) return 'N/A';
  return (index * 100).toFixed(2).replace('.', ',') + '%';
}

// Formata um número decimal no padrão brasileiro: 0.5385 → "0,5385".
export function formatDecimalBR(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace('.', ',');
}

export function calculateIndex(requirements: Requirement[], dimension?: Dimension): number | null {
  const filtered = dimension ? requirements.filter(r => r.dimension === dimension) : requirements;
  const evaluated = filtered.filter(r => COMPLIANCE_SCORE[r.compliance] !== null);
  if (evaluated.length === 0) return null;
  const score = evaluated.reduce(
    (sum, requirement) => sum + (COMPLIANCE_SCORE[requirement.compliance] as number),
    0,
  );
  return score / evaluated.length;
}

// ICD por natureza (Obrigatório/Recomendado/Complementar): metadado analítico,
// sem peso no ICD geral (mesma fórmula da média simples).
export function calculateIndexByClassification(requirements: Requirement[], classification: Classification): number | null {
  return calculateIndex(requirements.filter(r => r.classification === classification));
}

export function countByCompliance(requirements: Requirement[], dimension?: Dimension) {
  const filtered = dimension ? requirements.filter(r => r.dimension === dimension) : requirements;
  const counts: Record<Compliance, number> = {
    'Conforme': 0,
    'Conforme Parcial': 0,
    'Não Conforme': 0,
    'Não Aplicável': 0,
    'Não Avaliado': 0,
  };
  filtered.forEach(r => counts[r.compliance]++);
  return counts;
}

// ─── MCN COMPLETA — 80 REQUISITOS ────────────────────────────────────────────
// N=20 · E=20 · O=20 · G=20
// BASE_REQUIREMENTS guarda apenas identidade e estado inicial de cada requisito;
// descrição, fundamento, classificação e demais atributos auditados vêm de
// AUDIT_REVISIONS (sincronizada com o apêndice canônico) via REQUIREMENTS_FULL.
type BaseRequirement = Pick<Requirement, 'id' | 'dimension' | 'compliance' | 'observation'>;
const BASE_REQUIREMENTS: BaseRequirement[] = [
  { id: 'N01', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N02', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N03', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N04', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N05', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N06', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N07', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N08', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N09', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N10', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N11', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N12', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N13', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N14', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N15', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N16', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N17', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N18', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N19', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'N20', dimension: 'Normativa', compliance: 'Não Avaliado', observation: '' },
  { id: 'E01', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E02', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E03', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E04', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E05', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E06', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E07', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E08', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E09', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E10', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E11', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E12', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E13', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E14', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E15', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E16', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E17', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E18', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E19', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'E20', dimension: 'Estratégica', compliance: 'Não Avaliado', observation: '' },
  { id: 'O01', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O02', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O03', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O04', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O05', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O06', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O07', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O08', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O09', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O10', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O11', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O12', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O13', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O14', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O15', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O16', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O17', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O18', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O19', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'O20', dimension: 'Operacional', compliance: 'Não Avaliado', observation: '' },
  { id: 'G01', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G02', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G03', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G04', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G05', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G06', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G07', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G08', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G09', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G10', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G11', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G12', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G13', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G14', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G15', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G16', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G17', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G18', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G19', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
  { id: 'G20', dimension: 'Governança', compliance: 'Não Avaliado', observation: '' },
];

const DEFAULT_VERIFICATION_CRITERION =
  'Localizar no PDTIC ou em documento expressamente referenciado no corpus evidência clara e verificável que satisfaça integralmente o enunciado. Evidência incompleta ou superficial deve ser classificada como Conforme Parcial.';

const REQUIREMENT_METADATA: Record<string, Pick<Requirement, 'verificationCriterion' | 'relatedRequirementIds' | 'temporalNote'>> = {
  N03: {
    verificationCriterion: 'Identificar ato ou manifestação de aprovação pelo CGD. A assinatura da autoridade competente, avaliada em N17, não substitui a deliberação do colegiado.',
    relatedRequirementIds: ['N17', 'G04', 'N20'],
  },
  N04: {
    verificationCriterion: 'Confirmar evidência de publicação e acesso público. O formato aberto e a facilidade de acesso são avaliados separadamente em N11 e G09.',
    relatedRequirementIds: ['N11', 'G09'],
  },
  N06: {
    verificationCriterion: 'Verificar se o PDTIC declara integração ao PCA. A correspondência detalhada entre ações e contratações é avaliada em O10.',
    relatedRequirementIds: ['O10', 'G15'],
  },
  N08: {
    verificationCriterion: 'Verificar referência aos eixos e objetivos da EGD aplicável na data de corte. A vinculação de objetivos e iniciativas concretas é avaliada em E03.',
    relatedRequirementIds: ['E03', 'E19'],
  },
  N10: {
    verificationCriterion: 'Verificar a presença de diretrizes ou ações de adequação à LGPD. O mapeamento e os controles de governança de dados pessoais são avaliados em G13.',
    relatedRequirementIds: ['G13'],
  },
  N12: {
    verificationCriterion: 'Verificar declaração formal de alinhamento ao PDI. A demonstração de vínculos entre objetivos é avaliada em E02 e E05.',
    relatedRequirementIds: ['E02', 'E05'],
  },
  E03: {
    verificationCriterion: 'Identificar vínculos explícitos entre objetivos ou iniciativas do PDTIC e objetivos da EGD, sem repetir a mera referência normativa avaliada em N08 e E19.',
    relatedRequirementIds: ['N08', 'E19'],
  },
  E17: {
    verificationCriterion: 'Aplicar somente quando a política de IA indicada já existia na data de corte normativa ou quando a análise estiver explicitamente identificada como aderência normativa atual.',
    relatedRequirementIds: [],
    temporalNote: 'O PBIA 2024-2028 é posterior à aprovação do PDTIC UFRR 2023-2025 em 06/11/2023; na análise originária, classificar como Não Aplicável e justificar.',
  },
  E19: {
    verificationCriterion: 'Verificar a identificação expressa do ato normativo da EGD aplicável. O alinhamento substantivo aos objetivos é avaliado em E03.',
    relatedRequirementIds: ['N08', 'E03'],
  },
  O10: {
    verificationCriterion: 'Identificar correspondência documental entre ações do PDTIC e contratações do PCA, além da declaração geral de integração avaliada em N06.',
    relatedRequirementIds: ['N06', 'G15'],
  },
  G04: {
    verificationCriterion: 'Identificar evidência do processo deliberativo do CGD, como ata ou resolução. A assinatura da autoridade e o ato final de instituição são avaliados em N17 e N20.',
    relatedRequirementIds: ['N03', 'N17', 'N20'],
  },
  G09: {
    verificationCriterion: 'Verificar evidência de transparência ativa e disponibilização em formato aberto. A existência da publicação é avaliada em N04 e a facilidade de acesso em N11.',
    relatedRequirementIds: ['N04', 'N11'],
  },
  G13: {
    verificationCriterion: 'Verificar controles documentados de governança e mapeamento de dados pessoais. Diretrizes gerais de adequação à LGPD são avaliadas em N10.',
    relatedRequirementIds: ['N10'],
  },
};

export const NORMATIVE_CUTOFF_DATE = '2023-11-06';
export const MATRIX_MAINTENANCE_DATE = '2026-09-15';
export const CURRENT_NORMATIVE_MAINTENANCE_NOTE =
  'Manutenção documental em 15/09/2026: atos supervenientes são registrados para aderência atual, sem retroagir à avaliação com corte em 06/11/2023.';

// ─── REGISTRO DE MANUTENÇÃO DA MATRIZ (item 8) ──────────────────────────────
// Histórico de alterações da matriz de requisitos. Entradas normativas usam
// somente informação registrada no apêndice canônico
// (docs/apendice-canonico-mcn-pdtic.md) e devem ser acrescentadas também lá;
// entradas de planejamento de versão registram decisão do autor.
export interface MatrixMaintenanceEntry {
  date: string; // ISO (aaaa-mm-dd)
  title: string;
  details: string[];
}

export const MATRIX_MAINTENANCE_REGISTRY: MatrixMaintenanceEntry[] = [
  {
    date: '2026-09-25',
    title: 'Planejado para a versão 1.1',
    details: [
      'Campos texto literal, fonte secundária e indicador típico de evidência ficam para a versão 1.1; a v1.0 mantém o código por dimensão (N01–G20) e a natureza Obrigatório/Recomendado/Complementar.',
    ],
  },
  {
    date: '2026-09-15',
    title: 'Manutenção documental da matriz',
    details: [
      'Atos supervenientes — EFGD 2024–2027, Decreto nº 12.198/2024, iESGo e PBIA 2024–2028 — registrados apenas para análise atual; não produzem não conformidade retroativa (E17 permanece Não Aplicável no corte histórico).',
      'Portaria SGD/ME nº 778/2019: revogou a Portaria STI/MP nº 19/2017, foi alterada pela Portaria SGD/ME nº 18.152/2020 e permanece sendo usada como referência pelo portal oficial.',
      'Decreto nº 10.332/2020 foi revogado pelo Decreto nº 12.198/2024, que instituiu o ciclo EFGD 2024–2027; essa superveniência não retroage ao corte.',
    ],
  },
  {
    date: '2023-11-06',
    title: 'Definição do corte normativo',
    details: [
      'Os 80 requisitos foram aferidos na vigência dos atos aplicáveis em 06/11/2023; normas supervenientes não produzem não conformidade retroativa.',
    ],
  },
];

const P778_URL = 'https://www.gov.br/governodigital/pt-br/estrategias-e-governanca-digital/sisp/portaria-sgd-me-no-778-de-4-de-abril-de-2019';
const GUIDE_URL = 'https://www.gov.br/governodigital/pt-br/estrategias-e-governanca-digital/sisp/guia-do-gestor/documentos/guia-de-pdtic-do-sisp-2-1/view';
const D7579_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7579.htm';
const D10332_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10332.htm';
const D11260_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/Decreto/D11260.htm';
const IN94_URL = 'https://www.in.gov.br/en/web/dou/-/instrucao-normativa-sgd/me-n-94-de-23-de-dezembro-de-2022-454510332';
const LAI_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm';
const LGPD_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm';
const GOVDIGITAL_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm';
const PDI_LEI_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10861.htm';
const PDI_DECREE_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/decreto/d9235.htm';
const L14133_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm';
const D10947_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/decreto/d10947.htm';
const IN65_URL = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/legislacao/instrucoes-normativas/instrucoes-normativas/instrucao-normativa-seges-me-no-65-de-7-de-julho-de-2021';
const PNSI_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9637.htm';
const INC1_URL = 'https://repositorio.cgu.gov.br/handle/1/33947';
const CGU8_URL = 'https://www.gov.br/cgu/pt-br/assuntos/auditoria-e-fiscalizacao/normas-de-auditoria-interna';
const TCU_RISK_URL = 'https://portal.tcu.gov.br/publicacoes-institucionais/cartilha-manual-ou-tutorial/referencial-basico-de-gestao-de-riscos';
const TCU1233_URL = 'https://pesquisa.apps.tcu.gov.br/resultado/todas-bases/Ac%C3%B3rd%C3%A3o%201233%2F2012?pb=publicacao';
const TCU2308_URL = 'https://pesquisa.apps.tcu.gov.br/resultado/todas-bases/Ac%C3%B3rd%C3%A3o%202308%2F2010?pb=publicacao';
const PBIA_URL = 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/plano-brasileiro-de-inteligencia-artificial';
const OUVIDORIA_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm';

type AuditRevision = Omit<Requirement, 'id' | 'dimension' | 'compliance' | 'observation' | 'verificationCriterion' | 'relatedRequirementIds'>;
const audit = (
  description: string,
  normativeSource: string,
  classification: Classification,
  sourceType: SourceType,
  natureza: Natureza,
  issuer: string,
  sourceTitle: string,
  validityAtCutoff: string,
  legalBasis: string,
  officialSourceUrls: string[],
  temporalNote?: string,
): AuditRevision => ({
  description, normativeSource, classification, sourceType, natureza, issuer, sourceTitle,
  validityAtCutoff, legalBasis, officialSourceUrls, temporalNote,
});

/*
 * Auditoria documental item a item. A classificação abaixo mede a exigência
 * do conteúdo do PDTIC, e não a obrigação material externa de executar uma
 * contratação, manter um controle ou cumprir uma lei transversal.
 */
const AUDIT_REVISIONS: Record<string, AuditRevision> = {
  N01: audit('As contratações de TIC decorrentes do PDTIC observam, quando regidas pela Lei nº 14.133/2021, a IN SGD/ME nº 94/2022.', 'IN SGD/ME nº 94/2022 — contratação; Portaria SGD/ME nº 778/2019, art. 6º', 'Complementar', 'Instrução normativa de contratação', 'Contratação/execução', 'Secretaria de Governo Digital/ME', 'IN SGD/ME nº 94/2022 — processo de contratação de soluções de TIC no SISP', 'Vigente no corte para contratações sob a Lei nº 14.133/2021', 'O ato disciplina contratação, não elaboração do PDTIC; sua incidência depende do regime jurídico da contratação.', [IN94_URL, P778_URL]),
  N02: audit('O PDTIC observa a Portaria SGD/ME nº 778/2019, com a alteração da Portaria SGD/ME nº 18.152/2020, no que diz respeito à governança e ao conteúdo mínimo do plano.', 'Portaria SGD/ME nº 778/2019, art. 6º, texto alterado pela Portaria SGD/ME nº 18.152/2020', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria SGD/ME nº 778/2019 — implantação da Governança de TIC no SISP', 'Vigente no corte; texto alterado pela Portaria SGD/ME nº 18.152/2020', 'Art. 6º é a âncora primária dos requisitos mínimos de elaboração; não atribuir essa matéria à IN 94/2022.', [P778_URL]),
  N03: audit('O PDTIC registra deliberação do CGD ou da instância equivalente competente, com evidência documental.', 'Portaria SGD/ME nº 778/2019, arts. 4º–5º; Decreto nº 10.332/2020, art. 2º', 'Recomendado', 'Lei, decreto ou portaria', 'Governança', 'SGD/ME; Presidência da República', 'Governança de TIC no SISP e Comitê de Governança Digital da EGD', 'Vigente no corte', 'Os atos atribuem governança/deliberação ao CGD, mas não estabelecem fórmula federal uniforme de aprovação do PDTIC; ato interno pode torná-la obrigatória.', [P778_URL, D10332_URL]),
  N04: audit('O PDTIC é publicado no portal institucional, com eventual conteúdo não público segregado ou classificado conforme a lei.', 'Portaria SGD/ME nº 778/2019, art. 4º, V; Lei nº 12.527/2011, art. 8º', 'Obrigatório', 'Lei, decreto ou portaria', 'Transparência', 'SGD/ME; Congresso Nacional/Presidência da República', 'Portaria de Governança de TIC; Lei de Acesso à Informação', 'Vigente no corte', 'A Portaria determina a publicação do PDTIC; a LAI disciplina transparência ativa e ressalvas legais.', [P778_URL, LAI_URL]),
  N05: audit('O PDTIC identifica a inserção da instituição no SISP e observa os atos aplicáveis do órgão central.', 'Decreto nº 7.579/2011; Portaria SGD/ME nº 778/2019', 'Complementar', 'Lei, decreto ou portaria', 'Orientação', 'Presidência da República; SGD/ME', 'Decreto de organização do SISP', 'Vigente no corte', 'O Decreto organiza o SISP, mas não impõe que o PDTIC contenha uma declaração de alinhamento ao próprio decreto.', [D7579_URL, P778_URL]),
  N06: audit('O PDTIC explicita correspondência com o PCA quando houver iniciativa de TIC que demande contratação.', 'Lei nº 14.133/2021, arts. 12, VII, e 18; Decreto nº 10.947/2022; IN SGD/ME nº 94/2022, arts. 6º–7º', 'Recomendado', 'Lei, decreto ou portaria', 'Contratação/execução', 'Congresso Nacional/Presidência da República; SGD/ME', 'Lei de Licitações; Sistema de Planejamento e Gerenciamento de Contratações; IN de contratação de TIC', 'Vigente no corte', 'PCA e contratação são obrigatórios quando incidentes, mas não há exigência de correspondência integral dentro do PDTIC; não usar IN SEGES/ME nº 65/2021, que trata de pesquisa de preços.', [L14133_URL, D10947_URL, IN94_URL, IN65_URL]),
  N07: audit('As contratações previstas no PDTIC indicam o regime jurídico aplicável e observam a Lei nº 14.133/2021 quando forem por ela regidas.', 'Lei nº 14.133/2021', 'Obrigatório', 'Lei, decreto ou portaria', 'Contratação/execução', 'Congresso Nacional/Presidência da República', 'Lei de Licitações e Contratos Administrativos', 'Vigente no corte, com regime de transição então aplicável', 'A exigência incide sobre a contratação, não transforma a Lei de Licitações em requisito textual geral do PDTIC; processos regularmente regidos pelo regime anterior não retroagem.', [L14133_URL]),
  N08: audit('O PDTIC está alinhado à EGD 2020–2023 aplicável em 06/11/2023, indicando objetivos ou iniciativas pertinentes.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Decreto nº 10.332/2020, alterado pelo Decreto nº 11.260/2022', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME; Presidência da República', 'Estratégia de Governo Digital 2020–2023', 'Vigente no corte; revogação posterior não retroativa', 'A Portaria exige alinhamento à EGD; no corte a estratégia era 2020–2023, não “EGD 2023–2026”.', [P778_URL, D10332_URL, D11260_URL]),
  N09: audit('O PDTIC contempla, quando aplicáveis às competências institucionais, ações de governo digital e digitalização de serviços.', 'Lei nº 14.129/2021, arts. 1º–3º', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Congresso Nacional/Presidência da República', 'Lei do Governo Digital', 'Vigente no corte', 'A lei impõe princípios e instrumentos às entidades abrangidas, mas não enumera seção ou campos obrigatórios do PDTIC.', [GOVDIGITAL_URL]),
  N10: audit('O PDTIC identifica medidas de privacidade e proteção de dados pessoais aplicáveis às suas ações.', 'Lei nº 13.709/2018, arts. 23–30, 37 e 46–50', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Congresso Nacional/Presidência da República', 'Lei Geral de Proteção de Dados Pessoais', 'Vigente no corte; alterações da Lei nº 13.853/2019 consideradas', 'A conformidade material com a LGPD é cogente, mas o enunciado mede a presença de conteúdo no PDTIC e não pode converter dever transversal em campo obrigatório sem ato específico.', [LGPD_URL]),
  N11: audit('O PDTIC publicado utiliza formato eletrônico aberto e não proprietário quando aplicável; facilidade de compreensão é critério separado de qualidade.', 'Lei nº 12.527/2011, art. 8º, § 3º, II–III; Portaria SGD/ME nº 778/2019, art. 4º, V', 'Obrigatório', 'Lei, decreto ou portaria', 'Transparência', 'Congresso Nacional/Presidência da República; SGD/ME', 'Lei de Acesso à Informação; Portaria de Governança de TIC', 'Vigente no corte', 'A publicação e os formatos abertos têm suporte legal; “fácil compreensão” é recomendação, não obrigação textual autônoma.', [LAI_URL, P778_URL]),
  N12: audit('O PDTIC explicita alinhamento ao PDI vigente, quando pertinente à estratégia institucional.', 'Lei nº 10.861/2004; Decreto nº 9.235/2017', 'Recomendado', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Congresso Nacional/Presidência da República', 'SINAES e regulação das instituições de educação superior', 'Vigente no corte', 'Os atos exigem ou regulam PDI, mas não tornam obrigatório, por si sós, o vínculo textual entre PDI e PDTIC.', [PDI_LEI_URL, PDI_DECREE_URL]),
  N13: audit('O PDTIC tem vigência mínima de dois anos e prevê revisão anual.', 'Portaria SGD/ME nº 778/2019, art. 6º, VI, texto alterado pela Portaria SGD/ME nº 18.152/2020', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O art. 6º, VI sustenta expressamente duração mínima e revisão anual; não usar o art. 9º da IN 94 para essa matéria.', [P778_URL]),
  N14: audit('O processo de elaboração observa, no que couber, o Guia de PDTIC do SISP v2.1 (30/09/2021).', 'Portaria SGD/ME nº 778/2019, art. 6º, I; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Guia disponível e referenciado no corte; não é lei autônoma', 'O Guia é orientação técnica; sua observância decorre da remissão “no que couber” da Portaria, não de obrigação de citar uma versão no documento.', [P778_URL, GUIDE_URL]),
  N15: audit('O PDTIC informa seu período de cobertura e atende à vigência mínima de dois anos.', 'Portaria SGD/ME nº 778/2019, art. 6º, VI', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'A duração mínima é cogente; datas explícitas de início e término são critério documental recomendável para demonstrá-la.', [P778_URL]),
  N16: audit('O PDTIC identifica a unidade competente e o gestor responsável pelo planejamento, desenvolvimento, execução e monitoramento de TIC.', 'Portaria SGD/ME nº 778/2019, art. 4º, IV', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O ato atribui responsabilidades ao gestor de TIC; o item não presume estrutura ou nomenclatura organizacional específica.', [P778_URL]),
  N17: audit('O PDTIC registra aprovação pela autoridade ou instância competente, com data e evidência documental, quando exigido pelo ato interno.', 'Portaria SGD/ME nº 778/2019, arts. 5º–6º; ato interno da instituição', 'Recomendado', 'Ato institucional', 'Governança', 'SGD/ME; instituição', 'Portaria de Governança de TIC e ato interno de aprovação', 'Portaria vigente no corte; ato interno deve ser conferido no corpus', 'Não há assinatura nominada uniforme de reitor ou pró-reitor no ato federal; a exigência pode decorrer do regimento ou ato interno.', [P778_URL]),
  N18: audit('O PDTIC registra eventual cadastro ou envio ao sistema do órgão central somente quando houver solicitação administrativa formal identificável.', 'Orientação específica do órgão central, se existente', 'Complementar', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME/MGI, conforme o ato identificado', 'Orientação administrativa de registro de PDTIC', 'Nenhum ato primário geral localizado no corte', 'Não atribuir à IN 94/2022 uma obrigação de cadastro de PDTIC; a ausência de orientação oficial identificada impede classificá-lo como obrigatório.', []),
  N19: audit('O PDTIC identifica versão, data, aprovador e histórico de revisões para permitir rastreabilidade documental.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'Rastreabilidade é orientação/boa prática documental; COBIT não é fundamento jurídico geral.', [GUIDE_URL]),
  N20: audit('O PDTIC referencia o ato interno que o aprovou, quando esse ato existir no corpus institucional.', 'Ato interno da instituição (regimento, resolução ou portaria)', 'Complementar', 'Ato institucional', 'Governança', 'Instituição', 'Ato institucional de aprovação do PDTIC', 'Depende do ato interno vigente no corte', 'Não há ato federal uniforme que obrigue citar o número do ato; a competência e a forma de aprovação dependem da organização interna.', []),

  E01: audit('O PDTIC documenta diagnóstico de TIC e inventário de necessidades priorizado, sem impor a técnica SWOT.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'A Portaria exige inventário de necessidades priorizado, mas não exige diagnóstico “robusto” nem SWOT.', [P778_URL, GUIDE_URL]),
  E02: audit('O PDTIC demonstra alinhamento ao PEI vigente ou, na ausência deste, ao PPA; registra sua relação com o PDI quando pertinente.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Lei nº 10.861/2004; Decreto nº 9.235/2017', 'Recomendado', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME; Congresso Nacional/Presidência da República', 'Portaria de Governança de TIC; SINAES e PDI', 'Vigentes no corte', 'O alinhamento PEI/PPA é o núcleo cogente; PDI é recomendação neste enunciado, pois os atos educacionais não impõem vínculo PDTIC–PDI.', [P778_URL, PDI_LEI_URL, PDI_DECREE_URL]),
  E03: audit('O PDTIC vincula objetivos ou iniciativas de TIC aos objetivos pertinentes da EGD 2020–2023 vigente no corte.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Decreto nº 10.332/2020, alterado pelo Decreto nº 11.260/2022', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME; Presidência da República', 'Estratégia de Governo Digital 2020–2023', 'Vigente no corte; estratégias posteriores não retroagem', 'O alinhamento à EGD é exigido; o item avalia vínculo substantivo, distinto da mera identificação do ato em N08/E19.', [P778_URL, D10332_URL, D11260_URL]),
  E04: audit('Para cada objetivo estratégico ou necessidade de TIC, o PDTIC apresenta meta(s) com indicador, valor e prazo.', 'Portaria SGD/ME nº 778/2019, art. 6º, IV', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O texto reproduz o núcleo do art. 6º, IV; não depende de classificar objetivos como “SMART”.', [P778_URL]),
  E05: audit('O PDTIC evidencia, por matriz ou instrumento equivalente, o alinhamento entre TIC e estratégias organizacionais.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'A matriz é artefato metodológico recomendado; o Acórdão TCU nº 1.233/2012 é referencial de controle, não regulamento geral.', [P778_URL, GUIDE_URL, TCU1233_URL]),
  E06: audit('O PDTIC contém inventário de necessidades de TIC priorizado, contemplando as áreas pertinentes da instituição.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', '“Inventário de necessidades priorizado” é conteúdo mínimo expresso; a forma de coleta por área é operacionalização.', [P778_URL, GUIDE_URL]),
  E07: audit('O PDTIC explicita o método ou os critérios usados para priorizar necessidades, com justificativa e ordem resultante.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'A priorização é obrigatória, mas urgência, impacto, viabilidade e explicitação do método são detalhamento metodológico recomendável.', [P778_URL, GUIDE_URL, TCU1233_URL]),
  E08: audit('Cada meta do PDTIC possui indicador, valor de referência ou alvo e prazo para acompanhamento.', 'Portaria SGD/ME nº 778/2019, art. 6º, IV', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O requisito reproduz os três atributos expressos para cada meta.', [P778_URL]),
  E09: audit('O diagnóstico pode registrar fatores externos relevantes que fundamentem prioridades de TIC.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'Análise externa regulatória, tecnológica, política ou socioeconômica não é conteúdo mínimo literal do art. 6º da Portaria.', [GUIDE_URL]),
  E10: audit('O diagnóstico pode registrar estrutura, pessoas, infraestrutura e capacidades internas relevantes às necessidades de TIC.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a e c; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Plano de gestão de pessoas é mínimo no núcleo próprio; o enunciado de diagnóstico interno não o transforma em análise formal obrigatória.', [P778_URL, GUIDE_URL]),
  E11: audit('O PDTIC contém plano de metas e ações para sua vigência, com unidade demandante e unidade responsável pela execução.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, b; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O núcleo obrigatório é o plano de metas e ações; portfólio de projetos com escopo detalhado é extensão metodológica.', [P778_URL, GUIDE_URL]),
  E12: audit('O PDTIC relaciona objetivos ou necessidades de TIC às metas correspondentes; vínculo individual de cada projeto é recomendado quando houver projetos.', 'Portaria SGD/ME nº 778/2019, art. 6º, IV; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'A Portaria exige metas para objetivos/necessidades, mas não exige vínculo textual de cada projeto como enunciado original.', [P778_URL, GUIDE_URL, TCU1233_URL]),
  E13: audit('O PDTIC considera, quando pertinente, transformação e digitalização de serviços segundo a Lei nº 14.129/2021 e a EGD 2020–2023.', 'Lei nº 14.129/2021; Portaria SGD/ME nº 778/2019, art. 6º, II; Decreto nº 10.332/2020, alterado pelo Decreto nº 11.260/2022', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Congresso Nacional/Presidência da República; SGD/ME', 'Lei do Governo Digital; Estratégia de Governo Digital 2020–2023', 'Vigentes no corte', 'Não há exigência geral de “tecnologias emergentes”; a referência “EGD 2023–2026” é inexistente para o corte.', [GOVDIGITAL_URL, P778_URL, D10332_URL, D11260_URL]),
  E14: audit('O PDTIC pode apresentar análise de lacunas entre capacidades atuais e desejadas.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Complementar', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'Gap analysis não é conteúdo mínimo da Portaria; COBIT não é fonte oficial cogente.', [GUIDE_URL]),
  E15: audit('O PDTIC pode registrar visão de TIC coerente com as estratégias institucionais.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Complementar', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponível no corte', 'Visão, missão e valores não integram o rol mínimo literal; são boa prática de coerência estratégica.', [P778_URL, GUIDE_URL]),
  E16: audit('O PDTIC identifica a unidade responsável e descreve, quando pertinente, seu papel na governança e gestão de TIC.', 'Portaria SGD/ME nº 778/2019, arts. 2º–4º e 6º; Decreto nº 7.579/2011', 'Complementar', 'Lei, decreto ou portaria', 'Boa prática', 'SGD/ME; Presidência da República', 'Portaria de Governança de TIC; Decreto de organização do SISP', 'Vigentes no corte', 'Os atos sustentam a unidade/gestor e a governança, não uma declaração autônoma de missão e papel estratégico dentro do PDTIC.', [P778_URL, D7579_URL]),
  E17: audit('O PDTIC pode considerar políticas de IA vigentes na data de sua elaboração; o PBIA 2024–2028 é apenas referência prospectiva.', 'Plano Brasileiro de Inteligência Artificial 2024–2028 (política posterior)', 'Complementar', 'Lei, decreto ou portaria', 'Orientação', 'MCTI', 'Plano Brasileiro de Inteligência Artificial 2024–2028', 'Inexistente no corte de 06/11/2023; divulgado posteriormente', 'O PBIA é superveniente e não pode gerar não conformidade retroativa; na avaliação histórica este item é Não Aplicável.', [PBIA_URL], 'Superveniente ao corte: PBIA 2024–2028 não existia em 06/11/2023; manter Não Aplicável na avaliação histórica e separar eventual análise atual.'),
  E18: audit('O PDTIC considera acessibilidade e acesso inclusivo nas iniciativas e serviços digitais pertinentes.', 'Lei nº 14.129/2021, arts. 2º, II, e 3º, I', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Congresso Nacional/Presidência da República', 'Lei do Governo Digital', 'Vigente no corte', 'A lei orienta serviços digitais acessíveis, mas não exige seção específica de inclusão/equidade no PDTIC; retirar “EGD 2023–2026”.', [GOVDIGITAL_URL]),
  E19: audit('O PDTIC identifica, para rastreabilidade, a EGD 2020–2023 e o Decreto nº 10.332/2020, com a alteração do Decreto nº 11.260/2022, quando invocados.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; Decretos nº 10.332/2020 e nº 11.260/2022', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'SGD/ME; Presidência da República', 'Estratégia de Governo Digital 2020–2023', 'Vigentes no corte', 'Identificar o ato melhora a rastreabilidade, mas a obrigação federal é o alinhamento à EGD, não a citação formal do número do decreto.', [P778_URL, D10332_URL, D11260_URL]),
  E20: audit('O PDTIC pode registrar participação, demandas e impactos das partes interessadas na priorização.', 'Portaria SGD/ME nº 778/2019, art. 3º, I, e art. 6º; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Complementar', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Foco nas partes interessadas é princípio de governança, mas análise formal de stakeholders não é conteúdo mínimo; Freeman não é fonte oficial.', [P778_URL, GUIDE_URL]),

  O01: audit('O PDTIC contém plano de metas e ações, com necessidades priorizadas, unidade demandante e unidade responsável pela execução.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a–b; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'É conteúdo mínimo de elaboração; não é evidência de que as ações foram executadas.', [P778_URL, GUIDE_URL]),
  O02: audit('Cada meta possui indicador, valor ou alvo e prazo.', 'Portaria SGD/ME nº 778/2019, art. 6º, IV', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'A redação é restrita aos atributos expressos para metas; não exige KPI de qualidade para toda ação.', [P778_URL]),
  O03: audit('Cada ação ou meta identifica a unidade demandante e a unidade responsável pela execução; nome e função individuais são detalhamento recomendável.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, b; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O art. 6º, III, b sustenta unidades, não exige responsável nominal em cada item.', [P778_URL, GUIDE_URL]),
  O04: audit('As metas têm prazo; ações e projetos possuem cronograma quando aplicável.', 'Portaria SGD/ME nº 778/2019, art. 6º, IV; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Prazo da meta é cogente; início e término de cada projeto são detalhamento do Guia quando aplicável.', [P778_URL, GUIDE_URL]),
  O05: audit('O PDTIC contém plano orçamentário das ações, com estimativas e premissas compatíveis com o planejamento.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, d; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O plano orçamentário é mínimo; não se presume autorização, dotação ou execução financeira.', [P778_URL, GUIDE_URL]),
  O06: audit('O diagnóstico registra recursos e capacidades de TIC existentes relevantes às necessidades identificadas.', 'Guia de PDTIC do SISP v2.1 (30/09/2021); Portaria SGD/ME nº 778/2019, art. 6º, III, a', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Guia de PDTIC do SISP; Portaria de Governança de TIC', 'Vigentes/disponíveis no corte', 'A Portaria exige inventário de necessidades, não inventário detalhado de ativos; hardware, software e conectividade são insumos recomendáveis.', [GUIDE_URL, P778_URL]),
  O07: audit('O PDTIC contém plano de gestão de pessoas de TIC, com ações necessárias às metas; dimensionamento e competências entram quando aplicáveis.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, c; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O plano de gestão de pessoas é conteúdo mínimo; a granularidade de dimensionamento/competências é metodológica.', [P778_URL, GUIDE_URL]),
  O08: audit('O PDTIC prevê ações de capacitação e desenvolvimento da equipe de TIC quando necessárias ao plano.', 'Decreto nº 7.579/2011, art. 2º, VII; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Presidência da República; SGD/ME', 'Decreto de organização do SISP; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Capacitação pode integrar o plano de pessoas, mas não há exigência de carga horária e temas dentro do PDTIC.', [D7579_URL, GUIDE_URL]),
  O09: audit('O PDTIC identifica dependências ou necessidades de contratação de TIC e riscos de contratos críticos, quando pertinentes.', 'IN SGD/ME nº 94/2022, arts. 8º–38; Lei nº 14.133/2021', 'Complementar', 'Instrução normativa de contratação', 'Contratação/execução', 'SGD/ME; Congresso Nacional/Presidência da República', 'IN de contratação de soluções de TIC; Lei de Licitações', 'Vigentes no corte nos respectivos regimes', 'A IN disciplina planejamento, seleção e gestão contratual, não exige estratégia de contratos como conteúdo mínimo do PDTIC.', [IN94_URL, L14133_URL]),
  O10: audit('O PDTIC registra correspondência documental entre ações e contratações do PCA quando houver demanda contratável.', 'IN SGD/ME nº 94/2022, arts. 6º–7º; Decreto nº 10.947/2022', 'Recomendado', 'Instrução normativa de contratação', 'Contratação/execução', 'SGD/ME; Presidência da República', 'IN de contratação de soluções de TIC; Sistema de Planejamento e Gerenciamento de Contratações', 'Vigentes no corte', 'A contratação deve estar em consonância com PDTIC e PCA, mas a matriz ação↔PCA é recomendável no conteúdo do plano. IN SEGES/ME nº 65/2021 trata de pesquisa de preços.', [IN94_URL, D10947_URL, IN65_URL]),
  O11: audit('O PDTIC identifica serviços críticos e ações ou referência de continuidade quando aplicável.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, e; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Continuidade é boa governança e pode ser ação de risco; não é conteúdo mínimo nominal além do plano de riscos.', [P778_URL, GUIDE_URL]),
  O12: audit('O PDTIC define ou referencia abordagem de gerenciamento para projetos derivados, quando houver projetos.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'O Guia admite abordagem de gestão; não há obrigação geral de PMI, PMBOK ou metodologia específica.', [GUIDE_URL]),
  O13: audit('Cada meta tem indicador, valor e prazo, e o processo acompanha implementação, recursos e entrega de serviços.', 'Portaria SGD/ME nº 778/2019, arts. 6º, IV–V', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O requisito combina os atributos de metas e o acompanhamento formal; não presume KPI de qualidade para toda ação.', [P778_URL]),
  O14: audit('Há processo formal para monitorar e avaliar implementação, recursos, serviços, alcance de metas e correção de desvios.', 'Portaria SGD/ME nº 778/2019, art. 6º, V', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'Secretaria de Governo Digital/ME', 'Portaria de Governança de TIC no SISP', 'Vigente no corte', 'O processo formal de acompanhamento é expresso; periodicidade detalhada é orientação, não requisito literal adicional.', [P778_URL]),
  O15: audit('O PDTIC contém plano orçamentário das ações, com estimativas e premissas; categorias e períodos são detalhados quando pertinentes.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, d; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O núcleo é o plano orçamentário; investimento/custeio por período é detalhamento metodológico e não autorização de gasto.', [P778_URL, GUIDE_URL]),
  O16: audit('O PDTIC pode identificar fontes de financiamento e premissas para as ações de TIC.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, d; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Plano orçamentário é obrigatório, mas Tesouro, emendas e convênios não são quadro obrigatório no PDTIC nem garantem disponibilidade.', [P778_URL, GUIDE_URL]),
  O17: audit('O PDTIC explicita os critérios usados para priorizar e ordenar demandas, para transparência e rastreabilidade.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, a; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Orientação', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'O inventário priorizado é mínimo; explicitar critérios é recomendação metodológica, e o Acórdão TCU é apenas referencial.', [P778_URL, GUIDE_URL, TCU1233_URL]),
  O18: audit('O PDTIC considera integração e interoperabilidade com sistemas corporativos pertinentes, observando a EGD 2020–2023 quando incidente.', 'Decreto nº 10.332/2020, alterado pelo Decreto nº 11.260/2022; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Presidência da República; SGD/ME', 'Estratégia de Governo Digital 2020–2023; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', '“EGD 2023–2026” é referência incorreta; integração concreta depende das necessidades institucionais e não é universal.', [D10332_URL, D11260_URL, GUIDE_URL]),
  O19: audit('O PDTIC planeja o ciclo de vida dos ativos quando isso for identificado como necessidade ou risco.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'Não há obrigação geral no art. 6º da Portaria; COBIT é referencial privado.', [GUIDE_URL]),
  O20: audit('O PDTIC descreve comunicação, publicação e participação necessárias à elaboração ou ao acompanhamento, quando pertinentes.', 'Portaria SGD/ME nº 778/2019, art. 4º, V; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Complementar', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Publicação é obrigatória, mas plano de comunicação interna e engajamento não são conteúdo mínimo autônomo.', [P778_URL, GUIDE_URL]),

  G01: audit('O PDTIC referencia o ato de instituição ou designação do CGD ou da estrutura equivalente.', 'Portaria SGD/ME nº 778/2019, arts. 4º–5º; Decreto nº 10.332/2020, art. 2º', 'Recomendado', 'Lei, decreto ou portaria', 'Governança', 'SGD/ME; Presidência da República', 'Portaria de Governança de TIC; Comitê de Governança Digital da EGD', 'Vigentes no corte', 'CGD/equivalente é governança cogente, mas a obrigação de inserir o ato como conteúdo do PDTIC é documentalmente indireta; ato interno pode elevá-la.', [P778_URL, D10332_URL]),
  G02: audit('O PDTIC referencia ato que identifique composição e competências do CGD ou da estrutura equivalente, quando existente.', 'Portaria SGD/ME nº 778/2019, art. 5º; Decreto nº 10.332/2020, art. 2º', 'Recomendado', 'Lei, decreto ou portaria', 'Governança', 'SGD/ME; Presidência da República', 'Portaria de Governança de TIC; Comitê de Governança Digital da EGD', 'Vigentes no corte', 'Os atos não exigem universalmente regimento com todos os campos; o ato constitutivo é evidência recomendada.', [P778_URL, D10332_URL]),
  G03: audit('O PDTIC define periodicidade de acompanhamento pelo CGD ou instância equivalente, se adotada pela instituição.', 'Portaria SGD/ME nº 778/2019, art. 4º, III; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Nenhum ato federal identificado fixa periodicidade mínima de reuniões; a periodicidade é boa governança.', [P778_URL, GUIDE_URL]),
  G04: audit('O PDTIC contém ou referencia ato ou ata que demonstre deliberação pela instância competente, conforme o ato interno.', 'Portaria SGD/ME nº 778/2019, arts. 5º–6º; ato institucional', 'Recomendado', 'Ato institucional', 'Governança', 'SGD/ME; instituição', 'Portaria de Governança de TIC e ato/ata institucional de deliberação', 'Portaria vigente no corte; ato interno depende do corpus', 'A Portaria exige deliberação de assuntos de governança, mas não prescreve literalmente ata, resolução ou aprovação do PDTIC.', [P778_URL]),
  G05: audit('O PDTIC contém plano de gestão de riscos de TIC.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, e; IN Conjunta MP/CGU nº 1/2016', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME; MP/CGU', 'Portaria de Governança de TIC; Política de gestão de riscos e controles internos', 'Vigentes no corte', 'Plano de gestão de riscos é conteúdo mínimo expresso; o Referencial Básico de Gestão de Riscos do TCU é orientação subsidiária.', [P778_URL, INC1_URL, TCU_RISK_URL]),
  G06: audit('O PDTIC identifica, avalia, trata e monitora riscos relevantes segundo metodologia institucional.', 'Portaria SGD/ME nº 778/2019, art. 6º, III, e; IN Conjunta MP/CGU nº 1/2016; Decreto nº 9.637/2018', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'SGD/ME; MP/CGU; Presidência da República', 'Plano de gestão de riscos; Política Nacional de Segurança da Informação', 'Vigentes no corte', 'O plano de riscos é obrigatório, mas matriz probabilidade/impacto e tratamentos listados são granularidade metodológica, não texto mínimo universal.', [P778_URL, INC1_URL, PNSI_URL, TCU_RISK_URL]),
  G07: audit('O PDTIC prevê avaliação ou assurance conforme riscos e competência da auditoria interna.', 'IN SFC/CGU nº 8/2017; Decreto nº 3.591/2000; Portaria SGD/ME nº 778/2019', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'CGU; Presidência da República; SGD/ME', 'Manual de Orientações Técnicas da Atividade de Auditoria Interna Governamental', 'Ato vigente no corte; não é norma de conteúdo de PDTIC', 'A IN correta é SFC/CGU nº 8/2017; ela disciplina auditoria interna, não impõe auditoria interna dentro do PDTIC.', [CGU8_URL, P778_URL]),
  G08: audit('O PDTIC define informações ou relatórios para monitorar e prestar contas da execução, conforme governança institucional.', 'Portaria SGD/ME nº 778/2019, arts. 3º, V, e 6º, V; Acórdãos TCU nº 2.308/2010 e nº 1.233/2012', 'Recomendado', 'Jurisprudência ou referencial', 'Boa prática', 'SGD/ME; TCU', 'Portaria de Governança de TIC; acórdãos de auditoria/levantamento do TCU', 'Portaria vigente; acórdãos são referenciais contextuais no corte', 'Os acórdãos não criam obrigação universal de processo no PDTIC; prestação de contas é princípio e boa governança.', [P778_URL, TCU2308_URL, TCU1233_URL]),
  G09: audit('O PDTIC é disponibilizado em transparência ativa e formato aberto no portal institucional, ressalvadas restrições legais.', 'Portaria SGD/ME nº 778/2019, art. 4º, V; Lei nº 12.527/2011, art. 8º', 'Obrigatório', 'Lei, decreto ou portaria', 'Transparência', 'SGD/ME; Congresso Nacional/Presidência da República', 'Portaria de Governança de TIC; Lei de Acesso à Informação', 'Vigentes no corte', 'A publicação no portal é direta na Portaria; a LAI sustenta transparência ativa e formato aberto quando aplicável.', [P778_URL, LAI_URL]),
  G10: audit('O PDTIC tem vigência mínima de dois anos e processo de revisão anual, com alterações formalmente registradas.', 'Portaria SGD/ME nº 778/2019, art. 6º, VI; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Obrigatório', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'A Portaria exige mínimo de dois anos e revisão anual; “ordinária/extraordinária” é detalhamento, não fundamento da obrigação.', [P778_URL, GUIDE_URL]),
  G11: audit('O PDTIC define papéis e responsabilidades por matriz ou instrumento equivalente, sem exigir RACI.', 'Portaria SGD/ME nº 778/2019, art. 4º, III–IV; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Ato distribui papéis de CGD e gestor, mas não impõe matriz RACI; COBIT e Weill–Ross são referências privadas.', [P778_URL, GUIDE_URL]),
  G12: audit('O PDTIC referencia a Política de Segurança da Informação e ações de segurança aplicáveis, quando existentes.', 'Decreto nº 9.637/2018, arts. 15–18, alterado pelo Decreto nº 10.641/2021', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Presidência da República', 'Política Nacional de Segurança da Informação', 'Vigente no corte; Decreto nº 11.856/2023 é posterior ao corte', 'A PNSI exige estruturas e política institucionais, mas não exige que o PDTIC sempre referencie a PSI; NBR ISO 27001 não é fonte jurídica primária.', [PNSI_URL]),
  G13: audit('O PDTIC prevê ações de proteção de dados, registros ou avaliação de operações e controles proporcionais.', 'Lei nº 13.709/2018, arts. 23, 37, 46–50', 'Recomendado', 'Lei, decreto ou portaria', 'Orientação', 'Congresso Nacional/Presidência da República', 'Lei Geral de Proteção de Dados Pessoais', 'Vigente no corte', 'A LGPD é cogente, mas não exige mapeamento de dados dentro do PDTIC; o art. 50 prevê boas práticas como faculdade.', [LGPD_URL]),
  G14: audit('O PDTIC descreve participação ou consulta das áreas interessadas na elaboração, revisão ou monitoramento.', 'Portaria SGD/ME nº 778/2019, art. 3º, I; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Portaria de Governança de TIC; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'Participação é princípio/recomendação, não mecanismo formal obrigatório em cada PDTIC.', [P778_URL, GUIDE_URL]),
  G15: audit('O PDTIC se alinha ao PEI/PPA; iniciativas contratáveis são compatibilizadas com o PCA e o PDI/PAA é considerado quando pertinente.', 'Portaria SGD/ME nº 778/2019, art. 6º, II; IN SGD/ME nº 94/2022, arts. 6º–7º; Decreto nº 10.947/2022', 'Recomendado', 'Lei, decreto ou portaria', 'Regra de elaboração do PDTIC', 'SGD/ME; Presidência da República', 'Portaria de Governança de TIC; IN de contratação; Sistema de Contratações', 'Vigentes no corte', 'PEI/PPA é núcleo cogente; PCA incide em contratação; não há fonte federal para obrigar o conjunto PDI, PAA e PCA como portfólio do PDTIC.', [P778_URL, IN94_URL, D10947_URL]),
  G16: audit('O PDTIC referencia processo institucional de gestão de mudanças, quando aplicável.', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Guia ou orientação técnica', 'Boa prática', 'SGD/ME', 'Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Orientação disponível no corte', 'COBIT e ITIL são frameworks privados; não há conteúdo mínimo de gestão de mudanças na Portaria 778.', [GUIDE_URL]),
  G17: audit('O PDTIC pode incluir diagnóstico de maturidade e nível-alvo de governança de TIC.', 'Portaria SGD/ME nº 778/2019, art. 4º, I; Referencial Básico de Governança Organizacional do TCU', 'Recomendado', 'Jurisprudência ou referencial', 'Boa prática', 'SGD/ME; TCU', 'Portaria de Governança de TIC; Referencial de Governança do TCU', 'Vigentes/disponíveis no corte', 'A Portaria manda considerar práticas conforme especificidades e maturidade, mas não exige avaliação formal ou nível-alvo.', [P778_URL, TCU1233_URL]),
  G18: audit('O PDTIC pode registrar benchmarking documental com fontes oficiais disponíveis na data de corte.', 'Fontes oficiais de benchmarking identificadas no corpus', 'Complementar', 'Jurisprudência ou referencial', 'Boa prática', 'TCU/SGD, conforme fonte identificada', 'Benchmarking institucional — fonte oficial a identificar no corpus', 'A fonte deve ser comprovada e vigente no corte; iESGo de 2024 é superveniente', 'Não foi localizado ato geral chamado “Levantamento iGovTIC-IFES” nem painel identificável que imponha benchmarking; não usar iESGo retroativamente.', [TCU1233_URL]),
  G19: audit('O PDTIC referencia canal de ouvidoria ou processo institucional para recebimento e tratamento de demandas, distinguindo demandas internas e manifestações externas.', 'Lei nº 13.460/2017, art. 10; Guia de PDTIC do SISP v2.1 (30/09/2021)', 'Recomendado', 'Lei, decreto ou portaria', 'Boa prática', 'Congresso Nacional/Presidência da República; SGD/ME', 'Código de Defesa dos Usuários de Serviços Públicos; Guia de PDTIC do SISP', 'Vigentes/disponíveis no corte', 'LAI e Lei do Governo Digital não exigem canal específico de demandas internas de TIC; a Lei 13.460 é mais pertinente para ouvidoria.', [OUVIDORIA_URL, GUIDE_URL]),
  G20: audit('O PDTIC define acompanhamento e avaliação formal com periodicidade; relatório anual é adotado quando previsto pela instituição.', 'Portaria SGD/ME nº 778/2019, art. 6º, V; Acórdão TCU nº 1.233/2012', 'Recomendado', 'Lei, decreto ou portaria', 'Boa prática', 'SGD/ME; TCU', 'Portaria de Governança de TIC; Acórdão de auditoria/levantamento do TCU', 'Portaria vigente; acórdão é referencial no corte', 'A Portaria exige processo formal de acompanhamento, não um relatório anual com formato predeterminado.', [P778_URL, TCU1233_URL]),
};

export const REQUIREMENTS_FULL: Requirement[] = BASE_REQUIREMENTS.map(requirement => ({
  ...requirement,
  ...AUDIT_REVISIONS[requirement.id],
  verificationCriterion:
    REQUIREMENT_METADATA[requirement.id]?.verificationCriterion ?? DEFAULT_VERIFICATION_CRITERION,
  relatedRequirementIds: REQUIREMENT_METADATA[requirement.id]?.relatedRequirementIds,
  temporalNote: AUDIT_REVISIONS[requirement.id]?.temporalNote ?? REQUIREMENT_METADATA[requirement.id]?.temporalNote,
}));

// Alias para compatibilidade
export const INITIAL_REQUIREMENTS = REQUIREMENTS_FULL;

export const DEFAULT_STATE: EvaluationState = {
  institutionName: '',
  pdticPeriod: '',
  evaluatorName: '',
  evaluationDate: new Date().toISOString().split('T')[0],
  normativeCutoffDate: NORMATIVE_CUTOFF_DATE,
  requirements: REQUIREMENTS_FULL.map(r => ({ ...r })),
};
