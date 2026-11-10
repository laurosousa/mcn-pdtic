import { useState } from 'react';
import { Copy, Download, FolderOpen, Landmark, Scale, Trash2, AlertTriangle, X } from 'lucide-react';
import { useEvaluation } from '@/context/EvaluationContext';
import { downloadEvaluation } from '@/lib/evaluationIO';
import { EvaluationEntry, entryLabel, shortMatrixVersion } from '@/lib/evaluationStore';
import { UFRR_EVALUATION } from '@/data/evaluations/ufrr-pdtic-2023-2025';
import { NewEvaluationDialog } from '@/components/NewEvaluationDialog';
import { EDICAO_CGTIC } from '@/lib/edicao';
import {
  DIMENSIONS,
  CLASSIFICATIONS,
  calculateIndex,
  calculateIndexByClassification,
  countByCompliance,
  formatICDPercent,
} from '@/data/mcn';

const MAX_COMPARE = 4;

function DeleteConfirmModal({
  entry,
  onConfirm,
  onCancel,
}: {
  entry: EvaluationEntry;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Excluir Avaliação?</h3>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">{entryLabel(entry)}</span> será removida
              permanentemente da lista — incluindo classificações, evidências, padrões de lacuna e
              deliberação do CGD. Esta ação não pode ser desfeita; se precisar dos dados depois,
              exporte um backup em JSON antes.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <X size={14} /> Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
          >
            <Trash2 size={14} /> Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({ selected, onClose }: { selected: EvaluationEntry[]; onClose: () => void }) {
  const { activeId } = useEvaluation();

  const matrixVersions = Array.from(new Set(selected.map(e => e.matrixVersion)));
  const divergent = matrixVersions.length > 1;

  const metrics: { label: string; value: (e: EvaluationEntry) => string; highlight?: boolean }[] = [
    { label: 'Instituição', value: e => e.state.institutionName || 'Não informado' },
    { label: 'Período do PDTIC', value: e => e.state.pdticPeriod || 'Não informado' },
    { label: 'Data da avaliação', value: e => e.state.evaluationDate || 'Não informado' },
    { label: 'Avaliador(a)', value: e => e.state.evaluatorName || 'Não informado' },
    {
      label: 'ICD geral',
      highlight: true,
      value: e => formatICDPercent(calculateIndex(e.state.requirements)),
    },
    ...DIMENSIONS.map(d => ({
      label: `ICD — ${d}`,
      value: (e: EvaluationEntry) => formatICDPercent(calculateIndex(e.state.requirements, d)),
    })),
    ...CLASSIFICATIONS.map(c => ({
      label: `ICD — ${c}`,
      value: (e: EvaluationEntry) => formatICDPercent(calculateIndexByClassification(e.state.requirements, c)),
    })),
    {
      label: 'Requisitos avaliados',
      value: e => `${e.state.requirements.filter(r => r.compliance !== 'Não Avaliado').length} / ${e.state.requirements.length}`,
    },
    {
      label: 'C / CP / NC / NA',
      value: e => {
        const c = countByCompliance(e.state.requirements);
        return `${c['Conforme']} / ${c['Conforme Parcial']} / ${c['Não Conforme']} / ${c['Não Aplicável']}`;
      },
    },
    { label: 'Versão da matriz', value: e => shortMatrixVersion(e.matrixVersion) },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Scale size={18} className="text-ufrr" />
          Comparação entre Avaliações ({selected.length})
        </h2>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
        >
          <X size={13} /> Fechar comparação
        </button>
      </div>

      {divergent && (
        <div className="flex items-start gap-3 p-3 mb-4 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            As avaliações selecionadas usam versões diferentes da matriz (
            {matrixVersions.map(v => shortMatrixVersion(v)).join(', ')}): requisitos e fontes podem
            divergir, e os índices <span className="font-semibold">não são diretamente comparáveis</span>.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider w-56">
                Indicador
              </th>
              {selected.map(e => (
                <th key={e.id} className="text-left px-3 py-2 border-b-2 border-gray-200">
                  <span className="font-bold text-gray-800">{entryLabel(e)}</span>
                  {e.id === activeId && (
                    <span className="ml-2 text-[10px] font-bold uppercase bg-ufrr/10 text-ufrr px-1.5 py-0.5 rounded">
                      Ativa
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={m.label} className={i % 2 === 0 ? 'bg-gray-50/60' : ''}>
                <td className={`px-3 py-2 font-medium text-gray-600 ${m.highlight ? 'font-bold text-ufrr' : ''}`}>
                  {m.label}
                </td>
                {selected.map(e => (
                  <td key={e.id} className={`px-3 py-2 text-gray-800 ${m.highlight ? 'font-bold' : ''}`}>
                    {m.value(e)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        ICD com 2 casas (vírgula); NA (Não Aplicável) e Não Avaliado ficam fora do denominador.
      </p>
    </div>
  );
}

export function SavedEvaluations() {
  const {
    evaluations,
    activeId,
    switchEvaluation,
    duplicateEvaluation,
    deleteEvaluation,
  } = useEvaluation();

  const [pendingDelete, setPendingDelete] = useState<EvaluationEntry | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showUfrrDialog, setShowUfrrDialog] = useState(false);

  const toggleCompare = (id: string) => {
    setShowComparison(false);
    setCompareIds(ids => {
      if (ids.includes(id)) return ids.filter(x => x !== id);
      if (ids.length >= MAX_COMPARE) return ids;
      return [...ids, id];
    });
  };

  const selected = compareIds
    .map(id => evaluations.find(e => e.id === id))
    .filter((e): e is EvaluationEntry => !!e);

  return (
    <div className="space-y-6">
      {showComparison && selected.length >= 2 && (
        <ComparisonTable selected={selected} onClose={() => setShowComparison(false)} />
      )}

      {showUfrrDialog && (
        <NewEvaluationDialog
          mode="ufrr"
          initialInstitution={UFRR_EVALUATION.institutionName}
          onDone={() => setShowUfrrDialog(false)}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FolderOpen size={20} className="text-ufrr" />
            Avaliações Salvas ({evaluations.length})
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Marque até {MAX_COMPARE} para comparar</span>
            <button
              onClick={() => selected.length >= 2 && setShowComparison(v => !v)}
              disabled={selected.length < 2}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selected.length >= 2
                  ? 'bg-ufrr text-white hover:bg-ufrr/90 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Scale size={15} />
              Comparar Selecionadas ({selected.length})
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          A avaliação ativa é a que está aberta nas abas do app. As demais permanecem salvas neste
          navegador; use <strong>Exportar JSON</strong> para transferi-las entre máquinas.
        </p>

        <div className="space-y-3">
          {evaluations.map(entry => {
            const evaluated = entry.state.requirements.filter(r => r.compliance !== 'Não Avaliado').length;
            const isActive = entry.id === activeId;
            const checked = compareIds.includes(entry.id);
            return (
              <div
                key={entry.id}
                className={`flex flex-wrap items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isActive ? 'border-ufrr/40 bg-ufrr/5' : 'border-gray-200 bg-white'
                }`}
              >
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  title="Selecionar para comparação"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCompare(entry.id)}
                    className="w-4 h-4 accent-[#006030]"
                  />
                </label>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm truncate">
                      {entryLabel(entry)}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase bg-ufrr text-white px-1.5 py-0.5 rounded">
                        Ativa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {evaluated} / {entry.state.requirements.length} avaliados · ICD{' '}
                    {formatICDPercent(calculateIndex(entry.state.requirements))} · criada em{' '}
                    {new Date(entry.createdAt).toLocaleDateString('pt-BR')} · matriz{' '}
                    {shortMatrixVersion(entry.matrixVersion)}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {!isActive ? (
                    <button
                      onClick={() => switchEvaluation(entry.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ufrr text-ufrr text-xs font-semibold hover:bg-ufrr/5 transition-colors"
                    >
                      <FolderOpen size={13} /> Abrir
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ufrr text-white text-xs font-semibold">
                      <FolderOpen size={13} /> Aberta
                    </span>
                  )}
                  <button
                    onClick={() => downloadEvaluation(entry.state)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                    title="Baixar esta avaliação em JSON"
                  >
                    <Download size={13} /> Exportar
                  </button>
                  <button
                    onClick={() => duplicateEvaluation(entry.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                    title="Criar uma cópia para não alterar o original"
                  >
                    <Copy size={13} /> Duplicar
                  </button>
                  <button
                    onClick={() => setPendingDelete(entry)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                    title="Excluir esta avaliação"
                  >
                    <Trash2 size={13} /> Excluir
                  </button>
                </div>
              </div>
            );
          })}

          {!EDICAO_CGTIC && <button
            onClick={() => setShowUfrrDialog(true)}
            className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-ufrr/40 hover:border-ufrr hover:bg-ufrr/5 text-left transition-colors"
          >
            <Landmark size={20} className="text-ufrr flex-shrink-0" />
            <span>
              <span className="block text-sm font-bold text-ufrr">
                Novo ciclo a partir da avaliação de referência UFRR 2023–2025
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Cria uma avaliação da UFRR com as classificações, evidências e justificativas da
                referência como ponto de partida do próximo ciclo — informe o novo período do PDTIC.
              </span>
            </span>
          </button>}
        </div>
      </div>

      {pendingDelete && (
        <DeleteConfirmModal
          entry={pendingDelete}
          onConfirm={() => {
            deleteEvaluation(pendingDelete.id);
            setCompareIds(ids => ids.filter(id => id !== pendingDelete.id));
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
