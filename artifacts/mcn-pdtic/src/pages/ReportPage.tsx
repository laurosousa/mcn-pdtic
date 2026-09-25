import { useEvaluation } from '@/context/EvaluationContext';
import { DIMENSIONS, DIMENSION_COLOR, CLASSIFICATIONS, CLASSIFICATION_COLOR, COMPLIANCE_COLOR, COMPLIANCE_SCORE, GAP_PATTERNS, Classification, getConformityLabel, formatICDPercent, formatDecimalBR, MATRIX_VERSION } from '@/data/mcn';
import { IndexGauge } from '@/components/IndexGauge';
import { ComplianceBadge } from '@/components/ComplianceBadge';
import { Download, FileText, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { downloadEvaluation } from '@/lib/evaluationIO';

export function ReportPage() {
  const { state, overallIndex, dimensionIndices, classificationIndices, totalEvaluated, totalRequirements, setCgdDeliberation } = useEvaluation();

  const nonConformities = state.requirements.filter(r => r.compliance === 'Não Conforme');
  const partial = state.requirements.filter(r => r.compliance === 'Conforme Parcial');
  const attended = state.requirements.filter(r => r.compliance === 'Conforme');
  const notApplicable = state.requirements.filter(r => r.compliance === 'Não Aplicável');
  const notEvaluated = state.requirements.filter(r => r.compliance === 'Não Avaliado');

  // Lacunas (CP + NC) agrupadas pelos padrões da dissertação (Quadro 16, Seção 4.7)
  const gapItems = [...nonConformities, ...partial];
  const gapItemsByPattern = GAP_PATTERNS.map(p => ({
    pattern: p,
    items: gapItems.filter(r => (r.gapPatterns ?? []).includes(p.id)),
  }));
  const gapItemsUnassigned = gapItems.filter(r => (r.gapPatterns ?? []).length === 0);

  // Priorização para deliberação do CGD: natureza (Obrigatório → Recomendado →
  // Complementar) e, dentro de cada natureza, Não Conforme antes de Conforme Parcial.
  const NATUREZA_RANK: Record<Classification, number> = { 'Obrigatório': 0, 'Recomendado': 1, 'Complementar': 2 };
  const GAP_COMPLIANCE_RANK: Record<string, number> = { 'Não Conforme': 0, 'Conforme Parcial': 1 };
  const prioritizedGaps = [...gapItems].sort((a, b) =>
    NATUREZA_RANK[a.classification] - NATUREZA_RANK[b.classification] ||
    GAP_COMPLIANCE_RANK[a.compliance] - GAP_COMPLIANCE_RANK[b.compliance] ||
    DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension) ||
    a.id.localeCompare(b.id),
  );

  const exportCSV = () => {
    const headers = [
      'ID', 'Dimensão', 'Classificação', 'Descrição', 'Referência Normativa',
      'Critério de Verificação', 'Conformidade', 'Score', 'Localização da Evidência', 'Padrão de Lacuna', 'Justificativa'
    ];
    const rows = state.requirements.map(r => {
      const score = COMPLIANCE_SCORE[r.compliance];
      return [
        r.id,
        r.dimension,
        r.classification,
        `"${r.description.replace(/"/g, '""')}"`,
        `"${r.normativeSource.replace(/"/g, '""')}"`,
        `"${(r.verificationCriterion ?? '').replace(/"/g, '""')}"`,
        r.compliance,
        score !== null ? score.toFixed(2) : 'N/A',
        `"${(r.evidenceLocation ?? '').replace(/"/g, '""')}"`,
        `"${(r.gapPatterns ?? []).map(pid => GAP_PATTERNS.find(p => p.id === pid)?.name ?? pid).join(' | ')}"`,
        `"${r.observation.replace(/"/g, '""')}"`,
      ].join(';');
    });

    const summaryRows = [
      '',
      ';;; RESUMO EXECUTIVO',
      `Instituição;${state.institutionName || 'Não informado'}`,
      `Período PDTIC;${state.pdticPeriod || 'Não informado'}`,
      `Avaliador;${state.evaluatorName || 'Não informado'}`,
      `Data;${state.evaluationDate || 'Não informado'}`,
      `Data de Corte Normativa;${state.normativeCutoffDate || 'Não informado'}`,
      `Total de Requisitos;${totalRequirements}`,
      `Requisitos Avaliados;${totalEvaluated}`,
      `Não Conforme;${nonConformities.length}`,
      `Conforme Parcial;${partial.length}`,
      `Conforme;${attended.length}`,
      `Não Aplicável;${notApplicable.length}`,
      `Não Avaliado;${notEvaluated.length}`,
      `ICD Geral;${overallIndex !== null ? overallIndex.toFixed(4) : 'N/A'}`,
      ...DIMENSIONS.map(d => `ICD — ${d};${dimensionIndices[d] !== null ? (dimensionIndices[d] as number).toFixed(4) : 'N/A'}`),
      ...CLASSIFICATIONS.map(c => `ICD por natureza — ${c};${classificationIndices[c] !== null ? (classificationIndices[c] as number).toFixed(4) : 'N/A'}`),
    ];

    const csvContent = [headers.join(';'), ...rows, ...summaryRows].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const inst = state.institutionName ? state.institutionName.replace(/\s+/g, '_').substring(0, 20) : 'IFES';
    a.download = `MCN_PDTIC_${inst}_${state.evaluationDate || 'avaliacao'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTextReport = () => {
    const lines: string[] = [];
    lines.push('================================================================================');
    lines.push('MCN-PDTIC | MATRIZ DE CONFORMIDADE NORMATIVA PARA PDTIC EM IFES');
    lines.push(MATRIX_VERSION);
    lines.push('Data-Analytica-Export · PROFIAP/CAPES Área 27 · CC BY-SA 4.0');
    lines.push('Dissertação: "Matriz de Conformidade Normativa para PDTIC: proposta de');
    lines.push('instrumento de avaliação na UFRR" · Francisco Laurenilson Sousa Silva (2026)');
    lines.push('================================================================================');
    lines.push('');
    lines.push('DADOS DA AVALIAÇÃO');
    lines.push(`Instituição : ${state.institutionName || 'Não informado'}`);
    lines.push(`Período PDTIC: ${state.pdticPeriod || 'Não informado'}`);
    lines.push(`Avaliador   : ${state.evaluatorName || 'Não informado'}`);
    lines.push(`Data        : ${state.evaluationDate || 'Não informado'}`);
    lines.push(`Corte norm. : ${state.normativeCutoffDate || 'Não informado'}`);
    lines.push('');
    lines.push('RESUMO EXECUTIVO');
    lines.push(`Total de requisitos : ${totalRequirements}`);
    lines.push(`Requisitos avaliados: ${totalEvaluated} (${Math.round(totalEvaluated / totalRequirements * 100)}%)`);
    lines.push(`Conforme            : ${attended.length}`);
    lines.push(`Conforme Parcial    : ${partial.length}`);
    lines.push(`Não Conforme        : ${nonConformities.length}`);
    lines.push(`Não Aplicável       : ${notApplicable.length}`);
    lines.push(`Não Avaliado        : ${notEvaluated.length}`);
    lines.push('');
    lines.push('ÍNDICE DE CONFORMIDADE DOCUMENTAL (ICD)');
    lines.push('Fórmula: média simples dos scores 1,00, 0,50 e 0,00; itens Não Aplicáveis ou Não Avaliados são excluídos do denominador.');
    lines.push(`ICD Geral: ${overallIndex !== null ? formatICDPercent(overallIndex) + ' (' + formatDecimalBR(overallIndex, 4) + ')' : 'N/A'}`);
    if (overallIndex !== null) {
      const { label } = getConformityLabel(overallIndex);
      lines.push(`Classificação: ${label}`);
    }
    lines.push('');
    DIMENSIONS.forEach(d => {
      const idx = dimensionIndices[d];
      const label = idx !== null ? getConformityLabel(idx).label : 'N/A';
      lines.push(`ICD — ${d}: ${idx !== null ? formatICDPercent(idx) + ' — ' + label : 'N/A'}`);
    });
    lines.push('ICD POR NATUREZA (metadado analítico; sem peso no ICD geral)');
    CLASSIFICATIONS.forEach(c => {
      const idx = classificationIndices[c];
      lines.push(`${c}: ${idx !== null ? formatICDPercent(idx) : 'N/A'}`);
    });
    lines.push('');
    lines.push('================================================================================');
    lines.push('AGRUPAMENTO DAS LACUNAS POR PADRÃO (ITENS CP E NC)');
    lines.push('================================================================================');
    if (gapItems.length === 0) {
      lines.push('Nenhuma lacuna (CP ou NC) identificada.');
    } else {
      gapItemsByPattern.forEach(({ pattern, items }, i) => {
        lines.push(`${i + 1}. ${pattern.name} (${pattern.dimensions.join(', ')})`);
        lines.push(`   Manifestação: ${pattern.manifestation}`);
        lines.push(`   Itens: ${items.map(r => r.id).join(', ') || '—'}`);
        lines.push('');
      });
      lines.push(`Sem padrão atribuído: ${gapItemsUnassigned.map(r => r.id).join(', ') || '—'}`);
    }
    lines.push('');
    lines.push('================================================================================');
    lines.push('LACUNAS PRIORIZADAS PARA DELIBERAÇÃO DO CGD (ITENS NC E CP)');
    lines.push('Ordenação: natureza (Obrigatório → Recomendado → Complementar);');
    lines.push('dentro de cada natureza, Não Conforme antes de Conforme Parcial.');
    lines.push('================================================================================');
    if (prioritizedGaps.length === 0) {
      lines.push('Nenhuma lacuna (CP ou NC) identificada.');
    } else {
      prioritizedGaps.forEach((r, i) => {
        lines.push('');
        lines.push(`[${i + 1}] ${r.id} | ${r.dimension} | ${r.classification} — ${r.compliance.toUpperCase()}`);
        lines.push(`Requisito: ${r.description}`);
        lines.push(`Normativa: ${r.normativeSource}`);
        if (r.evidenceLocation) lines.push(`Evidência: ${r.evidenceLocation}`);
        if (r.observation) lines.push(`Justificativa: ${r.observation}`);
        lines.push('---');
      });
    }
    lines.push('');
    lines.push('================================================================================');
    lines.push('ITENS NÃO APLICÁVEIS E JUSTIFICATIVAS');
    lines.push('================================================================================');
    if (notApplicable.length === 0) {
      lines.push('Nenhum item classificado como Não Aplicável.');
    } else {
      notApplicable.forEach(r => {
        lines.push(`[${r.id}] ${r.observation || 'ERRO: justificativa não registrada'}`);
      });
    }
    lines.push('');
    lines.push('LIMITAÇÕES: o ICD mede conformidade documental do corpus analisado; não mede execução material, resultados, maturidade institucional ou efetividade das ações de TIC.');
    lines.push('');
    lines.push('================================================================================');
    lines.push('DELIBERAÇÃO DO COMITÊ DE GOVERNANÇA DIGITAL (CGD)');
    lines.push('================================================================================');
    lines.push(`Data da reunião : ${state.cgdDeliberation?.meetingDate || '____/____/______'}`);
    lines.push(`Decisão         : ${state.cgdDeliberation?.decision || '(a preencher pelo CGD)'}`);
    lines.push(`Encaminhamentos : ${state.cgdDeliberation?.followUps || '(a preencher pelo CGD)'}`);
    lines.push(`Responsáveis    : ${state.cgdDeliberation?.responsibles || '(a preencher pelo CGD)'}`);
    lines.push('');
    lines.push('================================================================================');
    lines.push(`Relatório gerado pelo MCN-PDTIC | Data-Analytica-Export · ${new Date().toLocaleString('pt-BR')}`);
    lines.push('================================================================================');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const inst = state.institutionName ? state.institutionName.replace(/\s+/g, '_').substring(0, 20) : 'IFES';
    a.download = `Relatorio_MCN_PDTIC_${inst}_${state.evaluationDate || 'avaliacao'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gray-800 text-white px-6 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">MCN-PDTIC</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Relatório de Conformidade</h1>
          <p className="text-gray-300 mt-1 text-sm">Síntese executiva e registro de não conformidades do PDTIC avaliado.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Cabeçalho do relatório */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Dados da Avaliação</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {[
                  ['Instituição', state.institutionName || 'Não informado'],
                  ['Período PDTIC', state.pdticPeriod || 'Não informado'],
                  ['Avaliador(a)', state.evaluatorName || 'Não informado'],
                  ['Data', state.evaluationDate || 'Não informado'],
                  ['Corte normativo', state.normativeCutoffDate || 'Não informado'],
                  ['Requisitos avaliados', `${totalEvaluated} / ${totalRequirements}`],
                  ['Progresso', `${Math.round(totalEvaluated / totalRequirements * 100)}%`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-xs text-gray-500 font-semibold">{k}</span>
                    <p className="text-sm text-gray-800 font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => downloadEvaluation(state)}
                className="flex items-center gap-2 px-4 py-2 border border-ufrr text-ufrr bg-white rounded-lg text-sm font-semibold hover:bg-ufrr/5 transition-colors shadow-sm"
                title="Baixar a avaliação completa em arquivo JSON (backup e transferência entre máquinas)"
              >
                <Download size={16} />
                Exportar JSON
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-ufrr text-white rounded-lg text-sm font-semibold hover:bg-ufrr/90 transition-colors shadow-sm"
              >
                <Download size={16} />
                Exportar CSV
              </button>
              <button
                onClick={exportTextReport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
              >
                <FileText size={16} />
                Exportar TXT
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <h2 className="text-sm font-bold text-blue-900">Escopo e limitações</h2>
          <p className="text-xs text-blue-800 mt-1">
            {MATRIX_VERSION}. O ICD mede somente a conformidade documental do corpus analisado.
            Não mede execução material, resultados, maturidade institucional ou efetividade das ações de TIC.
            A classificação Obrigatório/Recomendado/Complementar é analítica e não atribui peso ao cálculo.
          </p>
        </div>

        {/* ICD por Dimensão */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Índices de Conformidade Documental (ICD)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
            <IndexGauge value={overallIndex} size="md" label="Geral" />
            {DIMENSIONS.map(d => (
              <IndexGauge key={d} value={dimensionIndices[d]} size="sm" label={d} />
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">ICD por Natureza (analítico)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CLASSIFICATIONS.map(c => {
                const idx = classificationIndices[c];
                const color = CLASSIFICATION_COLOR[c];
                return (
                  <div key={c} className="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{c}</span>
                    <span className="text-sm font-bold" style={{ color }}>{formatICDPercent(idx)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">A natureza é metadado analítico e não atribui peso ao ICD geral.</p>
          </div>
        </div>

        {/* Contagem de conformidade */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Conforme', count: attended.length, color: '#2E7D32', bg: '#E8F5E9', Icon: CheckCircle },
            { label: 'Conforme Parcial', count: partial.length, color: '#F9A825', bg: '#FFFDE7', Icon: AlertCircle },
            { label: 'Não Conforme', count: nonConformities.length, color: '#C62828', bg: '#FFEBEE', Icon: AlertTriangle },
            { label: 'Não Aplicável', count: notApplicable.length, color: '#546E7A', bg: '#ECEFF1', Icon: FileText },
            { label: 'Não Avaliado', count: notEvaluated.length, color: '#757575', bg: '#F5F5F5', Icon: FileText },
          ].map(({ label, count, color, bg, Icon }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: bg }}>
              <Icon size={24} className="mx-auto mb-2" style={{ color }} />
              <p className="text-3xl font-bold" style={{ color }}>{count}</p>
              <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Lacunas priorizadas para deliberação do CGD */}
        {gapItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-800 text-white">
              <h3 className="font-bold">Lacunas Priorizadas para Deliberação do CGD</h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Ordenação: natureza (Obrigatório → Recomendado → Complementar); dentro de cada natureza, Não Conforme antes de Conforme Parcial.
              </p>
            </div>
            <ol className="divide-y divide-gray-100">
              {prioritizedGaps.map((req, i) => (
                <li key={req.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: COMPLIANCE_COLOR[req.compliance] }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1 items-center">
                        <span className="text-xs font-bold text-gray-700">{req.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded text-white" style={{ backgroundColor: DIMENSION_COLOR[req.dimension] }}>{req.dimension}</span>
                        <span className="text-xs px-2 py-0.5 rounded text-white" style={{ backgroundColor: CLASSIFICATION_COLOR[req.classification] }}>{req.classification}</span>
                        <ComplianceBadge value={req.compliance} />
                      </div>
                      <p className="text-sm text-gray-800">{req.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{req.normativeSource}</p>
                      {req.evidenceLocation && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-100">
                          <strong>Evidência:</strong> {req.evidenceLocation}
                        </div>
                      )}
                      {req.observation && (
                        <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-800 border border-amber-100">
                          <strong>Justificativa:</strong> {req.observation}
                        </div>
                      )}
                      {(req.gapPatterns ?? []).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(req.gapPatterns ?? []).map(pid => (
                            <span key={pid} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {GAP_PATTERNS.find(p => p.id === pid)?.name ?? pid}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Lacunas por padrão (Quadro 16 da dissertação, Seção 4.7) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800">Lacunas por Padrão</h2>
          <p className="text-xs text-gray-400 mb-4">
            Agrupamento analítico dos itens Conforme Parcial e Não Conforme. A atribuição é feita pelo avaliador ao classificar cada requisito.
          </p>
          {gapItems.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma lacuna (CP ou NC) identificada.</p>
          ) : (
            <div className="space-y-4">
              {gapItemsByPattern.map(({ pattern, items }, i) => (
                <div key={pattern.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/60">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-800">{i + 1}. {pattern.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                      {items.length} {items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{pattern.manifestation}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Dimensões: {pattern.dimensions.join(', ')} · {pattern.implication}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {items.length > 0 ? items.map(r => (
                      <span key={r.id} className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700">{r.id}</span>
                    )) : <span className="text-xs text-gray-400">Nenhum item atribuído.</span>}
                  </div>
                </div>
              ))}
              <div className={`p-4 rounded-lg border ${gapItemsUnassigned.length > 0 ? 'border-amber-200 bg-amber-50/60' : 'border-gray-100 bg-gray-50/60'}`}>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-800">Sem padrão atribuído</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                    {gapItemsUnassigned.length} {gapItemsUnassigned.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Itens CP e NC ainda não classificados em nenhum padrão de lacuna.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {gapItemsUnassigned.length > 0 ? gapItemsUnassigned.map(r => (
                    <span key={r.id} className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700">{r.id}</span>
                  )) : <span className="text-xs text-gray-400">Todos os itens CP e NC têm padrão atribuído.</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {notApplicable.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-600 text-white">
              <h3 className="font-bold">Itens Não Aplicáveis</h3>
              <p className="text-xs text-slate-200 mt-0.5">Excluídos do denominador mediante justificativa registrada.</p>
            </div>
            <div className="divide-y divide-gray-100">
              {notApplicable.map(req => (
                <div key={req.id} className="p-4">
                  <p className="text-sm font-bold text-gray-800">{req.id} · {req.dimension}</p>
                  <p className="text-xs text-gray-600 mt-1">{req.description}</p>
                  <p className="text-xs text-slate-700 mt-2"><strong>Justificativa:</strong> {req.observation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {nonConformities.length === 0 && partial.length === 0 && totalEvaluated > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
            <CheckCircle size={40} className="mx-auto text-green-600 mb-3" />
            <h3 className="text-lg font-bold text-green-800">Nenhuma não conformidade identificada!</h3>
            <p className="text-sm text-green-600 mt-1">Todos os requisitos aplicáveis avaliados foram classificados como Conforme.</p>
          </div>
        )}

        {totalEvaluated === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-600">Avaliação não iniciada</h3>
            <p className="text-sm text-gray-400 mt-1">Acesse as abas das Dimensões para avaliar os 80 requisitos da MCN.</p>
          </div>
        )}

        {/* Deliberação do CGD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800">Deliberação do Comitê de Governança Digital</h2>
          <p className="text-xs text-gray-400 mb-4">
            Registro da deliberação sobre este relatório. Os campos ficam salvos com a avaliação e são incluídos no relatório exportado.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Data da reunião</label>
              <input
                type="date"
                value={state.cgdDeliberation?.meetingDate ?? ''}
                onChange={e => setCgdDeliberation({ meetingDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Decisão</label>
              <textarea
                rows={3}
                placeholder="Deliberação do colegiado sobre as lacunas priorizadas (ex.: acatar, reclassificar, priorizar tratamento)."
                value={state.cgdDeliberation?.decision ?? ''}
                onChange={e => setCgdDeliberation({ decision: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Encaminhamentos</label>
              <textarea
                rows={3}
                placeholder="Ações acordadas, prazos e instrumentos afetados (ex.: revisão do PDTIC, atualização do plano de riscos)."
                value={state.cgdDeliberation?.followUps ?? ''}
                onChange={e => setCgdDeliberation({ followUps: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Responsáveis</label>
              <textarea
                rows={2}
                placeholder="Unidades ou agentes responsáveis por cada encaminhamento."
                value={state.cgdDeliberation?.responsibles ?? ''}
                onChange={e => setCgdDeliberation({ responsibles: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
