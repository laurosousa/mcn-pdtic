import { useState, useRef, useCallback } from 'react';
import { useEvaluation } from '@/context/EvaluationContext';
import { DIMENSIONS, DIMENSION_COLOR, formatICDPercent } from '@/data/mcn';
import {
  Upload, FileText, Loader2, X, BookOpen, BarChart3, Info,
} from 'lucide-react';

async function extractTextFromPDF(file: File, onPage: (p: number) => void, onTotal: (t: number) => void): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  onTotal(pdf.numPages);
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => (item as { str?: string }).str || '')
      .join(' ');
    fullText += pageText + '\n';
    onPage(i);
  }
  return fullText;
}

export function AnalyzePage() {
  const {
    pdticText, pdticFileName, pdticWordCount,
    setPdticDocument, clearPdticDocument,
    state, dimensionIndices,
  } = useEvaluation();

  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setErrorMsg('Selecione um arquivo PDF.');
      return;
    }
    setErrorMsg('');
    setExtracting(true);
    setExtractProgress(0);
    setTotalPages(0);
    try {
      const text = await extractTextFromPDF(file, setExtractProgress, setTotalPages);
      setPdticDocument(text, file.name);
    } catch {
      setErrorMsg('Erro ao extrair o texto. Verifique se o PDF não está protegido ou é baseado em imagem (escaneado).');
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [setPdticDocument]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
  }, [handleFileChange]);

  const paragraphCount = pdticText
    ? pdticText.split(/\n{2,}/).filter(p => p.trim().length > 50).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-8 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-300 text-xs uppercase tracking-widest font-semibold">MCN-PDTIC · Documento</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 flex items-center gap-3">
            <BookOpen size={28} className="text-blue-300" />
            Anexar PDTIC para Avaliação
          </h1>
          <p className="text-blue-200 mt-1 text-sm">
            Carregue o PDTIC em PDF para localização automática de evidências nos 80 requisitos da MCN.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── Upload do PDF ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload size={18} className="text-blue-700" />
            Arquivo PDF do PDTIC
          </h2>

          {pdticText ? (
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <FileText size={40} className="text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{pdticFileName}</p>
                <div className="flex gap-4 mt-1 flex-wrap">
                  <span className="text-sm text-gray-500">{pdticWordCount.toLocaleString('pt-BR')} palavras</span>
                  <span className="text-sm text-gray-500">{paragraphCount} parágrafos indexados</span>
                </div>
                {pdticWordCount < 200 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠ Texto muito curto — o PDF pode ser baseado em imagem (escaneado).
                  </p>
                )}
                <p className="text-xs text-blue-600 mt-2">
                  Evidências aparecem ao expandir qualquer requisito nas abas das Dimensões.
                </p>
              </div>
              <button
                onClick={clearPdticDocument}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Remover documento"
              >
                <X size={18} />
              </button>
            </div>
          ) : extracting ? (
            <div className="flex flex-col items-center gap-4 py-10 border-2 border-dashed border-blue-200 rounded-xl">
              <Loader2 size={36} className="text-blue-500 animate-spin" />
              <div className="text-center">
                <p className="text-gray-700 font-medium">Extraindo texto do PDF…</p>
                <p className="text-sm text-gray-500 mt-1">
                  {totalPages > 0 ? `${extractProgress} de ${totalPages} páginas` : 'Aguarde…'}
                </p>
              </div>
              {totalPages > 0 && (
                <div className="w-56 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.round((extractProgress / totalPages) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-blue-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload size={40} className="mx-auto text-blue-400 mb-3" />
              <p className="text-gray-700 font-semibold">Clique aqui ou arraste o PDF do PDTIC</p>
              <p className="text-xs text-gray-400 mt-2">Somente arquivos PDF com texto selecionável (não escaneados)</p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <Info size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* ── Progresso por Dimensão ───────────────────────────────── */}
        {pdticText && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-700" />
              Progresso da Avaliação por Dimensão
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DIMENSIONS.map(dim => {
                const reqs = state.requirements.filter(r => r.dimension === dim);
                const evaluated = reqs.filter(r => r.compliance !== 'Não Avaliado').length;
                const color = DIMENSION_COLOR[dim];
                const idx = dimensionIndices[dim];
                return (
                  <div
                    key={dim}
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold" style={{ color }}>{dim}</span>
                      {idx !== null && (
                        <span className="text-xs font-semibold" style={{ color }}>
                          {formatICDPercent(idx)}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-800">{evaluated}/{reqs.length}</div>
                    <p className="text-xs text-gray-500 mt-0.5">requisitos avaliados</p>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.round((evaluated / reqs.length) * 100)}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
              <Info size={12} />
              Acesse cada dimensão no menu superior. As evidências do documento aparecem ao expandir qualquer requisito.
            </p>
          </div>
        )}

        {/* ── Como funciona ────────────────────────────────────────── */}
        {!pdticText && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Como funciona a avaliação assistida</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: '1', title: 'Carregue o PDF',
                  desc: 'Faça upload do PDTIC em formato PDF com texto selecionável. O texto é extraído no seu navegador — nada é enviado a servidores externos.',
                  color: '#1565C0',
                },
                {
                  step: '2', title: 'Avalie com evidências',
                  desc: 'Ao expandir qualquer requisito nas abas das dimensões, trechos relevantes do PDTIC são exibidos automaticamente para embasar a avaliação.',
                  color: '#2E7D32',
                },
                {
                  step: '3', title: 'Gere o relatório',
                  desc: 'Com os 80 requisitos avaliados, acesse a aba Relatório para exportar os resultados completos da MCN.',
                  color: '#6A1B9A',
                },
              ].map(item => (
                <div key={item.step} className="rounded-lg p-4 border border-gray-100">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-800">
                <strong>Requisito para busca de evidências:</strong> o PDF deve conter texto selecionável (não pode ser escaneado como imagem). PDFs gerados por editores de texto são compatíveis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
