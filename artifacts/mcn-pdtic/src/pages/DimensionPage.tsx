import { useState } from 'react';
import { useEvaluation } from '@/context/EvaluationContext';
import { Dimension, Compliance, DIMENSION_COLOR, DIMENSION_DESCRIPTIONS, COMPLIANCE_COLOR, COMPLIANCE_SCORE, CLASSIFICATION_COLOR, GAP_PATTERNS, GapPatternId, formatDecimalBR } from '@/data/mcn';
import { ComplianceBadge } from '@/components/ComplianceBadge';
import { IndexGauge } from '@/components/IndexGauge';
import { ChevronDown, ChevronUp, Info, FileText, Search, AlertTriangle, Scale } from 'lucide-react';
import { findEvidences, highlightTerms } from '@/utils/pdticSearch';

const COMPLIANCE_OPTIONS: Compliance[] = ['Conforme', 'Conforme Parcial', 'Não Conforme', 'Não Aplicável', 'Não Avaliado'];

interface DimensionPageProps {
  dimension: Dimension;
}

function EvidenceSection({ normativeSource, pdticText }: { normativeSource: string; pdticText: string }) {
  const evidences = findEvidences(pdticText, normativeSource, 3);

  if (evidences.length === 0) {
    return (
      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <Search size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 italic">
          Nenhum trecho localizado no documento para os termos desta normativa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {evidences.map((ev, i) => {
        const parts = highlightTerms(ev.text, ev.matchedTerms);
        return (
          <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs leading-relaxed text-gray-800">
            <p>
              {parts.map((part, j) =>
                part.hl
                  ? <mark key={j} className="bg-yellow-200 text-gray-900 px-0.5 rounded font-semibold">{part.t}</mark>
                  : <span key={j}>{part.t}</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function DimensionPage({ dimension }: DimensionPageProps) {
  const { state, setCompliance, setObservation, setEvidenceLocation, setGapPatterns, dimensionIndices, pdticText, pdticFileName } = useEvaluation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<Compliance | 'Todos'>('Todos');

  const reqs = state.requirements.filter(r => r.dimension === dimension);
  const filtered = filter === 'Todos' ? reqs : reqs.filter(r => r.compliance === filter);
  const index = dimensionIndices[dimension];
  const color = DIMENSION_COLOR[dimension];

  const obrigatorios = reqs.filter(r => r.classification === 'Obrigatório');
  const avaliados = reqs.filter(r => r.compliance !== 'Não Avaliado');

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="text-white px-6 py-8 shadow-lg" style={{ backgroundColor: color }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Dimensão</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{dimension}</h1>
          <p className="text-white/80 mt-2 text-sm max-w-3xl">{DIMENSION_DESCRIPTIONS[dimension]}</p>
          <div className="mt-3 flex gap-4 flex-wrap items-center">
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">{reqs.length} requisitos</span>
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">{avaliados.length} avaliados</span>
            <span className="text-xs bg-white/20 rounded-full px-3 py-1">{obrigatorios.length} obrigatórios</span>
            {pdticFileName && (
              <span className="text-xs bg-white/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                <FileText size={11} />
                Evidências disponíveis: {pdticFileName.length > 30 ? pdticFileName.slice(0, 30) + '…' : pdticFileName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ICD da Dimensão */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-wrap items-start gap-8">
            <IndexGauge value={index} size="md" label={`ICD — ${dimension}`} />
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Distribuição de Conformidade</h3>
              {COMPLIANCE_OPTIONS.map(c => {
                const count = reqs.filter(r => r.compliance === c).length;
                const pct = Math.round((count / reqs.length) * 100);
                return (
                  <div key={c} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-gray-600 w-36 shrink-0">{c}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: COMPLIANCE_COLOR[c] }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: COMPLIANCE_COLOR[c] }}>{count}</span>
                  </div>
                );
              })}
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-500">
                <p><strong>Cálculo:</strong> média simples dos scores 1,00 · 0,50 · 0,00. “Não Aplicável” e “Não Avaliado” não entram no denominador.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {(['Todos', 'Não Avaliado', 'Conforme', 'Conforme Parcial', 'Não Conforme', 'Não Aplicável'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filter === f ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >
              {f} {f === 'Todos' ? `(${reqs.length})` : `(${reqs.filter(r => r.compliance === f).length})`}
            </button>
          ))}
        </div>

        {/* Tabela de Requisitos */}
        <div className="space-y-3">
          {filtered.map(req => {
            const isExpanded = expanded === req.id;
            const score = COMPLIANCE_SCORE[req.compliance];

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: color }}>
                    <span className="text-xs font-normal opacity-80">ID</span>
                    <span>{req.id}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ color: CLASSIFICATION_COLOR[req.classification], backgroundColor: `${CLASSIFICATION_COLOR[req.classification]}15` }}
                      >
                        {req.classification}
                      </span>
                      <ComplianceBadge value={req.compliance} />
                      {score !== null && (
                        <span className="text-xs text-gray-500 font-medium">
                          Score: {formatDecimalBR(score)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">{req.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{req.normativeSource}</p>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50 space-y-4">

                    {/* Regras de decisão (Seção 3.6.3 da dissertação) */}
                    <div className="flex items-start gap-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
                      <Scale size={14} className="text-violet-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-violet-900">Regras de decisão da classificação</p>
                        <ol className="text-xs text-violet-800 mt-1 space-y-0.5 list-decimal list-inside">
                          <li><strong>Presunção de conformidade:</strong> "C" só com evidência explícita e suficiente.</li>
                          <li><strong>Dúvida razoável:</strong> ambiguidade ou incompletude leva a "CP"; "NC" só para ausência inequívoca.</li>
                          <li><strong>Multiplicidade de evidências:</strong> basta uma seção do PDTIC suficiente.</li>
                        </ol>
                      </div>
                    </div>

                    {/* Seleção de Conformidade */}
                    <div>
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <Info size={12} /> Nível de Conformidade
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COMPLIANCE_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              if (opt === 'Conforme' && !(req.evidenceLocation ?? '').trim()) {
                                window.alert('Presunção de conformidade: classifique como "Conforme" somente com a localização da evidência registrada (seção, página ou citação do documento).');
                                return;
                              }
                              if (opt === 'Não Aplicável' && !req.observation.trim()) {
                                window.alert('Registre primeiro a justificativa no campo Justificativa.');
                                return;
                              }
                              setCompliance(req.id, opt);
                              if (opt !== 'Conforme Parcial' && opt !== 'Não Conforme' && (req.gapPatterns?.length ?? 0) > 0) {
                                setGapPatterns(req.id, []);
                              }
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${req.compliance === opt ? 'text-white shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                            style={req.compliance === opt ? { backgroundColor: COMPLIANCE_COLOR[opt], borderColor: 'transparent' } : {}}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <Info size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Critério de verificação documental</p>
                        <p className="text-xs text-emerald-800 mt-0.5">{req.verificationCriterion}</p>
                        {req.relatedRequirementIds && req.relatedRequirementIds.length > 0 && (
                          <p className="text-xs text-emerald-700 mt-1">
                            <strong>Requisitos relacionados:</strong> {req.relatedRequirementIds.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {req.temporalNote && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <AlertTriangle size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">Regra temporal</p>
                          <p className="text-xs text-amber-800 mt-0.5">{req.temporalNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Evidências no documento */}
                    {pdticText && (
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                          <FileText size={12} className="text-blue-600" />
                          <span className="text-blue-700">Evidências no Documento</span>
                          <span className="text-gray-400 font-normal normal-case tracking-normal">
                            — trechos do PDTIC que referenciam esta normativa
                          </span>
                        </label>
                        <EvidenceSection normativeSource={req.description} pdticText={pdticText} />
                      </div>
                    )}

                    {/* Localização da evidência + Justificativa */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                          Localização da evidência {req.compliance === 'Conforme' && <span className="text-red-600">(obrigatória)</span>}
                        </label>
                        <textarea
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30 resize-none"
                          rows={2}
                          placeholder="Onde a evidência está no documento: seção, página ou citação literal."
                          value={req.evidenceLocation ?? ''}
                          onChange={e => {
                            setEvidenceLocation(req.id, e.target.value);
                            if (req.compliance === 'Conforme' && !e.target.value.trim()) {
                              setCompliance(req.id, 'Não Avaliado');
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                          Justificativa {req.compliance === 'Não Aplicável' && <span className="text-red-600">(obrigatória)</span>}
                        </label>
                        <textarea
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30 resize-none"
                          rows={3}
                          placeholder="Fundamente a classificação: por que a evidência satisfaz (ou não) o critério de verificação. Para “Não Aplicável”, informe obrigatoriamente o motivo."
                          value={req.observation}
                          onChange={e => {
                            setObservation(req.id, e.target.value);
                            if (req.compliance === 'Não Aplicável' && !e.target.value.trim()) {
                              setCompliance(req.id, 'Não Avaliado');
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Padrões de lacuna (só para CP e NC) */}
                    {(req.compliance === 'Conforme Parcial' || req.compliance === 'Não Conforme') && (
                      <div>
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                          Padrão de lacuna <span className="text-gray-400 normal-case tracking-normal">(opcional — escolha um ou mais)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {GAP_PATTERNS.map(p => {
                            const active = (req.gapPatterns ?? []).includes(p.id);
                            return (
                              <button
                                key={p.id}
                                title={`${p.manifestation} — Dimensões: ${p.dimensions.join(', ')}.`}
                                onClick={() => {
                                  const current = req.gapPatterns ?? [];
                                  setGapPatterns(req.id, active ? current.filter(x => x !== p.id) : [...current, p.id as GapPatternId]);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${active ? 'bg-gray-800 text-white border-gray-800 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                              >
                                {p.name}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                          Agrupamento analítico dos itens CP e NC (Quadro 16 da dissertação, Seção 4.7).
                        </p>
                      </div>
                    )}

                    {/* Referência Normativa */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-blue-800">Referência Normativa</p>
                        <p className="text-xs text-blue-700 mt-0.5">{req.normativeSource}</p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">Nenhum requisito encontrado para o filtro selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
