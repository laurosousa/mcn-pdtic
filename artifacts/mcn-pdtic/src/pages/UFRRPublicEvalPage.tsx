import { useState, useMemo } from 'react';
import { UFRR_EVALUATION } from '@/data/evaluations/ufrr-pdtic-2023-2025';
import {
  DIMENSIONS,
  DIMENSION_COLOR,
  CLASSIFICATIONS,
  CLASSIFICATION_COLOR,
  COMPLIANCE_SCORE,
  getConformityLabel,
  formatICDPercent,
  formatDecimalBR,
  MATRIX_VERSION,
  calculateIndex,
  calculateIndexByClassification,
  Dimension,
  Compliance
} from '@/data/mcn';
import { IndexGauge } from '@/components/IndexGauge';
import { ComplianceBadge } from '@/components/ComplianceBadge';
import {
  Download,
  FileText,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

export function UFRRPublicEvalPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dimensionFilter, setDimensionFilter] = useState<Dimension | 'Todas'>('Todas');
  const [complianceFilter, setComplianceFilter] = useState<Compliance | 'Todas'>('Todas');

  const state = UFRR_EVALUATION;
  
  const totalRequirements = state.requirements.length;
  const totalEvaluated = state.requirements.filter(r => r.compliance !== 'Não Avaliado').length;
  
  const overallIndex = calculateIndex(state.requirements);
  const dimensionIndices = useMemo(() => {
    const indices = {} as Record<Dimension, number | null>;
    DIMENSIONS.forEach(d => {
      indices[d] = calculateIndex(state.requirements, d);
    });
    return indices;
  }, [state.requirements]);

  const classificationIndices = useMemo(() => {
    const indices = {} as Record<string, number | null>;
    CLASSIFICATIONS.forEach(c => {
      indices[c] = calculateIndexByClassification(state.requirements, c);
    });
    return indices;
  }, [state.requirements]);

  const nonConformities = state.requirements.filter(r => r.compliance === 'Não Conforme');
  const partial = state.requirements.filter(r => r.compliance === 'Conforme Parcial');
  const attended = state.requirements.filter(r => r.compliance === 'Conforme');
  const notApplicable = state.requirements.filter(r => r.compliance === 'Não Aplicável');
  const notEvaluated = state.requirements.filter(r => r.compliance === 'Não Avaliado');

  const filteredRequirements = useMemo(() => {
    return state.requirements.filter(r => {
      const matchDim = dimensionFilter === 'Todas' || r.dimension === dimensionFilter;
      const matchComp = complianceFilter === 'Todas' || r.compliance === complianceFilter;
      const matchSearch = searchTerm === '' || 
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.observation.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDim && matchComp && matchSearch;
    });
  }, [state.requirements, dimensionFilter, complianceFilter, searchTerm]);

  const exportCSV = () => {
    const headers = [
      'ID', 'Dimensão', 'Classificação', 'Descrição', 'Referência Normativa',
      'Critério de Verificação', 'Conformidade', 'Score', 'Localização da Evidência', 'Justificativa'
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
    lines.push('================================================================================');
    lines.push('');
    lines.push('DADOS DA AVALIAÇÃO');
    lines.push(`Instituição : ${state.institutionName}`);
    lines.push(`Período PDTIC: ${state.pdticPeriod}`);
    lines.push(`Avaliador   : ${state.evaluatorName}`);
    lines.push(`Data        : ${state.evaluationDate}`);
    lines.push(`Corte norm. : ${state.normativeCutoffDate}`);
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
    lines.push('LIMITAÇÕES: o ICD mede conformidade documental do corpus analisado; não mede execução material, resultados, maturidade institucional ou efetividade das ações de TIC.');
    lines.push('');
    lines.push('================================================================================');
    lines.push('AVALIAÇÃO DETALHADA');
    lines.push('================================================================================');
    
    state.requirements.forEach(r => {
      lines.push('');
      lines.push(`[${r.id}] ${r.dimension} | ${r.classification}`);
      lines.push(`Conformidade: ${r.compliance}`);
      lines.push(`Requisito: ${r.description}`);
      lines.push(`Normativa: ${r.normativeSource}`);
      if (r.evidenceLocation) lines.push(`Evidência: ${r.evidenceLocation}`);
      if (r.observation) lines.push(`Justificativa: ${r.observation}`);
      lines.push('---');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const inst = state.institutionName ? state.institutionName.replace(/\s+/g, '_').substring(0, 20) : 'IFES';
    a.download = `Relatorio_Completo_MCN_PDTIC_${inst}_${state.evaluationDate || 'avaliacao'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-ufrr text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gold rounded-md p-1.5 shadow-sm">
                <FileText size={18} className="text-ufrr" />
              </div>
              <div>
                <h1 className="font-bold text-sm md:text-base leading-tight">MCN-PDTIC | Avaliação Pública Oficial</h1>
                <p className="text-green-300 text-xs hidden md:block leading-tight">Transparência Normativa</p>
              </div>
            </div>
            <div>
              <Link href="/" className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition-colors" data-testid="link-back-local">
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Voltar à Avaliação Local</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 space-y-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-inst-name">{state.institutionName}</h2>
              <p className="text-gray-600 font-medium text-lg" data-testid="text-pdtic-period">PDTIC {state.pdticPeriod}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-ufrr text-white rounded-lg text-sm font-semibold hover:bg-ufrr/90 transition-colors shadow-sm"
                data-testid="button-export-csv"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={exportTextReport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors shadow-sm"
                data-testid="button-export-txt"
              >
                <FileText size={16} />
                TXT (Completo)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
            <div>
              <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Avaliador</span>
              <span className="text-sm font-semibold text-gray-800" data-testid="text-evaluator">{state.evaluatorName}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Data da Avaliação</span>
              <span className="text-sm font-semibold text-gray-800" data-testid="text-eval-date">{state.evaluationDate}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Corte Normativo</span>
              <span className="text-sm font-semibold text-gray-800" data-testid="text-cutoff">{state.normativeCutoffDate}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800" data-testid="text-status">
                Avaliação documental publicada
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
          <h3 className="text-sm font-bold text-blue-900 mb-2">Escopo e Limitações Metodológicas</h3>
          <p className="text-sm text-blue-800 leading-relaxed" data-testid="text-limitations">
            {MATRIX_VERSION}. A avaliação possui caráter <strong>estritamente documental</strong> sobre o corpus publicado ou fornecido.
            O Índice de Conformidade Documental (ICD) não afere a execução material das ações, a maturidade institucional de governança ou os resultados
            efetivos alcançados pela área de TIC. Documentos mencionados no PDTIC, mas não anexados ou publicados, foram considerados
            apenas como referências textuais. A classificação Obrigatório/Recomendado/Complementar é analítica e não atribui peso ponderado ao cálculo matemático.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">Índices de Conformidade Documental (ICD)</h3>
            <div className="flex flex-wrap gap-8 justify-between md:justify-around">
              <IndexGauge value={overallIndex} size="md" label="Geral" />
              {DIMENSIONS.map(d => (
                <IndexGauge key={d} value={dimensionIndices[d]} size="sm" label={d} />
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">ICD por Natureza (analítico)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CLASSIFICATIONS.map(c => {
                  const idx = classificationIndices[c];
                  const color = CLASSIFICATION_COLOR[c];
                  return (
                    <div key={c} className="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-50" data-testid={`icd-natureza-${c.toLowerCase()}`}>
                      <span className="text-sm font-medium text-gray-700">{c}</span>
                      <span className="text-sm font-bold" style={{ color }}>{formatICDPercent(idx)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">A natureza é metadado analítico e não atribui peso ao ICD geral.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
            <h3 className="text-base font-bold text-gray-900 mb-6">Distribuição</h3>
            <div className="space-y-4">
              {[
                { label: 'Conforme', count: attended.length, color: 'text-green-700', bg: 'bg-green-100', bar: 'bg-green-600' },
                { label: 'Conforme Parcial', count: partial.length, color: 'text-amber-700', bg: 'bg-amber-100', bar: 'bg-amber-500' },
                { label: 'Não Conforme', count: nonConformities.length, color: 'text-red-700', bg: 'bg-red-100', bar: 'bg-red-600' },
                { label: 'Não Aplicável', count: notApplicable.length, color: 'text-slate-700', bg: 'bg-slate-200', bar: 'bg-slate-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3" data-testid={`stat-${item.label.toLowerCase().replace(' ', '-')}`}>
                  <div className={`w-10 h-8 rounded flex items-center justify-center font-bold text-xs ${item.bg} ${item.color}`}>
                    {item.count}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <span className="text-gray-500">{formatDecimalBR((item.count / totalRequirements) * 100, 1)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.bar}`} style={{ width: `${(item.count / totalRequirements) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhamento dos Requisitos</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID, descrição ou evidência..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ufrr/20 focus:border-ufrr outline-none"
                  data-testid="input-search"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500 hidden md:block" />
                <select
                  value={dimensionFilter}
                  onChange={e => setDimensionFilter(e.target.value as Dimension | 'Todas')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ufrr/20 outline-none"
                  data-testid="select-dimension"
                >
                  <option value="Todas">Todas as Dimensões</option>
                  {DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                
                <select
                  value={complianceFilter}
                  onChange={e => setComplianceFilter(e.target.value as Compliance | 'Todas')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ufrr/20 outline-none"
                  data-testid="select-compliance"
                >
                  <option value="Todas">Todos os Status</option>
                  <option value="Conforme">Conforme</option>
                  <option value="Conforme Parcial">Conforme Parcial</option>
                  <option value="Não Conforme">Não Conforme</option>
                  <option value="Não Aplicável">Não Aplicável</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredRequirements.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Nenhum requisito encontrado para os filtros aplicados.
              </div>
            ) : (
              filteredRequirements.map(req => (
                <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-colors" data-testid={`req-row-${req.id}`}>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="md:w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded text-white" 
                          style={{ backgroundColor: DIMENSION_COLOR[req.dimension] }}
                        >
                          {req.id}
                        </span>
                      </div>
                      <ComplianceBadge value={req.compliance} />
                      <div className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {req.dimension}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                          {req.classification}
                        </span>
                        <p className="text-sm font-medium text-gray-900">{req.description}</p>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Base Normativa: </span>
                        {req.normativeSource}
                      </div>
                      
                      {req.evidenceLocation && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Localização da Evidência</p>
                          <p className="text-sm text-gray-800">{req.evidenceLocation}</p>
                        </div>
                      )}

                      {req.observation && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Justificativa</p>
                          <p className="text-sm text-gray-800">{req.observation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
