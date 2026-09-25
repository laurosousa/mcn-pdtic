import { useState } from 'react';
import { Building2, Calendar, Plus, X } from 'lucide-react';
import { useEvaluation } from '@/context/EvaluationContext';

interface NewEvaluationDialogProps {
  // 'ufrr' cria o novo ciclo a partir da avaliação de referência UFRR 2023–2025.
  mode: 'blank' | 'ufrr';
  initialInstitution?: string;
  onDone: () => void;
}

export function NewEvaluationDialog({ mode, initialInstitution = '', onDone }: NewEvaluationDialogProps) {
  const { newEvaluation, newEvaluationFromReference } = useEvaluation();
  const [institutionName, setInstitutionName] = useState(initialInstitution);
  const [pdticPeriod, setPdticPeriod] = useState('');

  const handleCreate = () => {
    const inst = institutionName.trim();
    if (!inst) return;
    if (mode === 'ufrr') newEvaluationFromReference(inst, pdticPeriod.trim());
    else newEvaluation(inst, pdticPeriod.trim());
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-ufrr/10 flex items-center justify-center">
            <Plus size={22} className="text-ufrr" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {mode === 'ufrr' ? 'Novo Ciclo a partir da Referência UFRR' : 'Nova Avaliação'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'ufrr'
                ? 'As classificações, evidências e justificativas da avaliação de referência UFRR 2023–2025 serão copiadas como ponto de partida — revise cada item no novo ciclo.'
                : 'A avaliação atual permanece salva na lista. Identifique a nova avaliação para criá-la.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 size={12} /> Instituição (IFES)
            </label>
            <input
              autoFocus
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
              placeholder="Ex.: Universidade Federal de Roraima"
              value={institutionName}
              onChange={e => setInstitutionName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} /> Período do PDTIC
            </label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
              placeholder={mode === 'ufrr' ? 'Ex.: 2026–2028 (não copiar 2023–2025)' : 'Ex.: 2024–2026'}
              value={pdticPeriod}
              onChange={e => setPdticPeriod(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 mt-1">Opcional aqui; pode ser preenchido depois no Dashboard.</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onDone}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <X size={14} /> Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!institutionName.trim()}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
              institutionName.trim()
                ? 'bg-ufrr text-white hover:bg-ufrr/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={14} /> Criar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}
