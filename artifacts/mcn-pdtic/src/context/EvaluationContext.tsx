import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EvaluationState,
  Compliance,
  CgdDeliberation,
  DIMENSIONS,
  CLASSIFICATIONS,
  GapPatternId,
  calculateIndex,
  calculateIndexByClassification,
} from '@/data/mcn';
import {
  EvaluationsStorage,
  EvaluationEntry,
  loadStorage,
  makeEntry,
  newId,
  freshState,
  freshDeliberation,
  createFreshStorage,
  ufrrReferenceState,
  STORAGE_KEY,
} from '@/lib/evaluationStore';

interface EvaluationContextType {
  state: EvaluationState; // avaliação ativa
  evaluations: EvaluationEntry[]; // todas as avaliações salvas (lista e comparação)
  activeId: string;
  setInstitution: (name: string) => void;
  setPdticPeriod: (period: string) => void;
  setEvaluatorName: (name: string) => void;
  setEvaluationDate: (date: string) => void;
  setNormativeCutoffDate: (date: string) => void;
  setCompliance: (id: string, compliance: Compliance) => void;
  setObservation: (id: string, observation: string) => void;
  setEvidenceLocation: (id: string, evidenceLocation: string) => void;
  setGapPatterns: (id: string, gapPatterns: GapPatternId[]) => void;
  setCgdDeliberation: (patch: Partial<CgdDeliberation>) => void;
  // A importação cria uma nova entrada na lista (nunca sobrescreve) e a torna ativa.
  importEvaluation: (imported: EvaluationState, matrixVersion?: string) => void;
  newEvaluation: (institutionName?: string, pdticPeriod?: string) => void;
  // Novo ciclo a partir da avaliação de referência UFRR 2023–2025.
  newEvaluationFromReference: (institutionName?: string, pdticPeriod?: string) => void;
  switchEvaluation: (id: string) => void;
  duplicateEvaluation: (id: string) => void;
  deleteEvaluation: (id: string) => void;
  overallIndex: number | null;
  dimensionIndices: Record<string, number | null>;
  classificationIndices: Record<string, number | null>;
  totalEvaluated: number;
  totalRequirements: number;
  pdticText: string;
  pdticFileName: string;
  pdticWordCount: number;
  setPdticDocument: (text: string, fileName: string) => void;
  clearPdticDocument: () => void;
}

const EvaluationContext = createContext<EvaluationContextType | null>(null);

export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<EvaluationsStorage>(loadStorage);

  const [pdticText, setPdticText] = useState('');
  const [pdticFileName, setPdticFileName] = useState('');
  const [pdticWordCount, setPdticWordCount] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  }, [storage]);

  const activeEntry =
    storage.evaluations.find(e => e.id === storage.activeId) ?? storage.evaluations[0];
  const state = activeEntry.state;

  // Aplica uma transformação na avaliação ativa, preservando os metadados da entrada.
  const updateActive = (fn: (s: EvaluationState) => EvaluationState) =>
    setStorage(st => ({
      ...st,
      evaluations: st.evaluations.map(e =>
        e.id === st.activeId ? { ...e, state: fn(e.state) } : e
      ),
    }));

  const setInstitution = (name: string) =>
    updateActive(s => ({ ...s, institutionName: name }));
  const setPdticPeriod = (period: string) =>
    updateActive(s => ({ ...s, pdticPeriod: period }));
  const setEvaluatorName = (name: string) =>
    updateActive(s => ({ ...s, evaluatorName: name }));
  const setEvaluationDate = (date: string) =>
    updateActive(s => ({ ...s, evaluationDate: date }));
  const setNormativeCutoffDate = (date: string) =>
    updateActive(s => ({ ...s, normativeCutoffDate: date }));

  const setCompliance = (id: string, compliance: Compliance) =>
    updateActive(s => ({
      ...s,
      requirements: s.requirements.map(r => r.id === id ? { ...r, compliance } : r),
    }));

  const setObservation = (id: string, observation: string) =>
    updateActive(s => ({
      ...s,
      requirements: s.requirements.map(r => r.id === id ? { ...r, observation } : r),
    }));

  const setEvidenceLocation = (id: string, evidenceLocation: string) =>
    updateActive(s => ({
      ...s,
      requirements: s.requirements.map(r => r.id === id ? { ...r, evidenceLocation } : r),
    }));

  const setGapPatterns = (id: string, gapPatterns: GapPatternId[]) =>
    updateActive(s => ({
      ...s,
      requirements: s.requirements.map(r => r.id === id ? { ...r, gapPatterns } : r),
    }));

  const setCgdDeliberation = (patch: Partial<CgdDeliberation>) =>
    updateActive(s => ({
      ...s,
      cgdDeliberation: { ...freshDeliberation(), ...s.cgdDeliberation, ...patch },
    }));

  // Importar sempre cria uma nova entrada: a avaliação anterior nunca é sobrescrita.
  const importEvaluation = (imported: EvaluationState, matrixVersion?: string) =>
    setStorage(st => {
      const entry = makeEntry(imported, matrixVersion);
      return { ...st, activeId: entry.id, evaluations: [...st.evaluations, entry] };
    });

  const newEvaluation = (institutionName = '', pdticPeriod = '') =>
    setStorage(st => {
      const entry = makeEntry({ ...freshState(), institutionName, pdticPeriod });
      return { ...st, activeId: entry.id, evaluations: [...st.evaluations, entry] };
    });

  const newEvaluationFromReference = (institutionName = '', pdticPeriod = '') =>
    setStorage(st => {
      const entry = makeEntry(ufrrReferenceState(institutionName, pdticPeriod));
      return { ...st, activeId: entry.id, evaluations: [...st.evaluations, entry] };
    });

  const switchEvaluation = (id: string) =>
    setStorage(st =>
      st.evaluations.some(e => e.id === id) ? { ...st, activeId: id } : st
    );

  const duplicateEvaluation = (id: string) =>
    setStorage(st => {
      const src = st.evaluations.find(e => e.id === id);
      if (!src) return st;
      const copy: EvaluationEntry = {
        ...src,
        id: newId(),
        createdAt: new Date().toISOString(),
        state: {
          ...src.state,
          requirements: src.state.requirements.map(r => ({
            ...r,
            gapPatterns: r.gapPatterns ? [...r.gapPatterns] : [],
          })),
        },
      };
      return { ...st, activeId: copy.id, evaluations: [...st.evaluations, copy] };
    });

  const deleteEvaluation = (id: string) =>
    setStorage(st => {
      const evaluations = st.evaluations.filter(e => e.id !== id);
      if (evaluations.length === st.evaluations.length) return st;
      if (evaluations.length === 0) return createFreshStorage();
      return {
        ...st,
        evaluations,
        activeId: st.activeId === id ? evaluations[0].id : st.activeId,
      };
    });

  const clearPdticDocument = () => {
    setPdticText('');
    setPdticFileName('');
    setPdticWordCount(0);
  };

  const setPdticDocument = (text: string, fileName: string) => {
    setPdticText(text);
    setPdticFileName(fileName);
    setPdticWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  const overallIndex = calculateIndex(state.requirements);

  const dimensionIndices = Object.fromEntries(
    DIMENSIONS.map(d => [d, calculateIndex(state.requirements, d)])
  );

  const classificationIndices = Object.fromEntries(
    CLASSIFICATIONS.map(c => [c, calculateIndexByClassification(state.requirements, c)])
  );

  const totalEvaluated = state.requirements.filter(r => r.compliance !== 'Não Avaliado').length;
  const totalRequirements = state.requirements.length;

  return (
    <EvaluationContext.Provider value={{
      state,
      evaluations: storage.evaluations,
      activeId: storage.activeId,
      setInstitution,
      setPdticPeriod,
      setEvaluatorName,
      setEvaluationDate,
      setNormativeCutoffDate,
      setCompliance,
      setObservation,
      setEvidenceLocation,
      setGapPatterns,
      setCgdDeliberation,
      importEvaluation,
      newEvaluation,
      newEvaluationFromReference,
      switchEvaluation,
      duplicateEvaluation,
      deleteEvaluation,
      overallIndex,
      dimensionIndices,
      classificationIndices,
      totalEvaluated,
      totalRequirements,
      pdticText,
      pdticFileName,
      pdticWordCount,
      setPdticDocument,
      clearPdticDocument,
    }}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const ctx = useContext(EvaluationContext);
  if (!ctx) throw new Error('useEvaluation must be used within EvaluationProvider');
  return ctx;
}
