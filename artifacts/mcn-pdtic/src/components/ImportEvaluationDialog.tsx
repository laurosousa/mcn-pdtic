import { useRef, useState } from 'react';
import { AlertTriangle, FileJson, Upload, X } from 'lucide-react';
import { useEvaluation } from '@/context/EvaluationContext';
import { ParseResult, ImportSummary, parseEvaluationFile } from '@/lib/evaluationIO';
import { MATRIX_VERSION, formatICDPercent } from '@/data/mcn';

interface ImportEvaluationDialogProps {
  // applied=false fecha sem alterar nada; applied=true informa o summary do arquivo importado.
  onDone: (result: { applied: boolean; summary?: ImportSummary }) => void;
}

export function ImportEvaluationDialog({ onDone }: ImportEvaluationDialogProps) {
  const { importEvaluation } = useEvaluation();
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileError('');
    setParseResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setFileName(file.name);
      setParseResult(parseEvaluationFile(text));
    };
    reader.onerror = () => {
      setFileError('Não foi possível ler o arquivo selecionado.');
    };
    reader.readAsText(file, 'utf-8');
  };

  const summary = parseResult?.ok ? parseResult.summary : null;

  const fmtDate = (iso: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString('pt-BR');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-ufrr/10 flex items-center justify-center">
            <Upload size={22} className="text-ufrr" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Importar Avaliação (.json)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Selecione um arquivo exportado pelo MCN-PDTIC. A avaliação entra como uma nova
              entrada na lista de avaliações salvas — a atual permanece intacta.
            </p>
          </div>
        </div>

        {!parseResult && (
          <div>
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-ufrr hover:bg-ufrr/5 transition-colors"
            >
              <FileJson size={28} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Escolher arquivo JSON</span>
              <span className="text-xs text-gray-400">Somente arquivos exportados por este app</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
            {fileError && <p className="text-sm text-red-600 mt-3">{fileError}</p>}
          </div>
        )}

        {parseResult && !parseResult.ok && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{parseResult.error}</p>
            </div>
            <p className="text-xs text-gray-400 break-all">Arquivo: {fileName}</p>
          </div>
        )}

        {parseResult?.ok && summary && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avaliação no arquivo</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <span className="text-gray-500">Instituição</span>
                <span className="text-gray-800 font-medium">{summary.institutionName || 'Não informado'}</span>
                <span className="text-gray-500">Período do PDTIC</span>
                <span className="text-gray-800 font-medium">{summary.pdticPeriod || 'Não informado'}</span>
                <span className="text-gray-500">Avaliador(a)</span>
                <span className="text-gray-800 font-medium">{summary.evaluatorName || 'Não informado'}</span>
                <span className="text-gray-500">Data da avaliação</span>
                <span className="text-gray-800 font-medium">{summary.evaluationDate || 'Não informado'}</span>
                <span className="text-gray-500">ICD</span>
                <span className="text-gray-800 font-medium">
                  {formatICDPercent(summary.icd)} · {summary.evaluatedCount} requisitos avaliados
                </span>
                <span className="text-gray-500">C / CP / NC / NA</span>
                <span className="text-gray-800 font-medium">
                  {summary.counts['Conforme']} / {summary.counts['Conforme Parcial']} / {summary.counts['Não Conforme']} / {summary.counts['Não Aplicável']}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm pt-2 border-t border-gray-200 mt-3">
                <span className="text-gray-500">Exportado em</span>
                <span className="text-gray-800 font-medium">{fmtDate(summary.exportedAt)}</span>
                <span className="text-gray-500">Versão da matriz</span>
                <span className="text-gray-800 font-medium">{summary.matrixVersion ?? 'Não informada'}</span>
              </div>
            </div>

            {!summary.matrixVersionMatches && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Este arquivo usa uma versão da matriz diferente da atual (
                  <span className="font-semibold">{summary.matrixVersion ?? 'não informada'}</span> ×{' '}
                  <span className="font-semibold">{MATRIX_VERSION}</span>). Os requisitos serão re-hidratados pela
                  matriz atual; confira os dados antes de prosseguir.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => onDone({ applied: false })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <X size={14} /> Cancelar
              </button>
              <button
                onClick={() => {
                  if (parseResult.ok) {
                    importEvaluation(parseResult.state, parseResult.summary.matrixVersion ?? undefined);
                    onDone({ applied: true, summary: parseResult.summary });
                  }
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-ufrr text-white text-sm font-bold hover:bg-ufrr/90 transition-colors"
              >
                <Upload size={14} /> Importar como nova avaliação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
