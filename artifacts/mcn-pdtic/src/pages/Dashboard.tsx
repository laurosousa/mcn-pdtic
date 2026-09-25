import { useState } from 'react';
import { useEvaluation } from '@/context/EvaluationContext';
import { DIMENSIONS, DIMENSION_COLOR, CLASSIFICATIONS, CLASSIFICATION_COLOR, COMPLIANCE_COLOR, countByCompliance, getConformityLabel, formatICDPercent, formatDecimalBR } from '@/data/mcn';
import { IndexGauge } from '@/components/IndexGauge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { Building2, User, Calendar, ClipboardList, Plus, Download, Upload } from 'lucide-react';
import { ImportEvaluationDialog } from '@/components/ImportEvaluationDialog';
import { NewEvaluationDialog } from '@/components/NewEvaluationDialog';
import { SavedEvaluations } from '@/components/SavedEvaluations';
import { MatrixMaintenanceCard } from '@/components/MatrixMaintenanceCard';
import { downloadEvaluation } from '@/lib/evaluationIO';

export function Dashboard() {
  const { state, setInstitution, setPdticPeriod, setEvaluatorName, setEvaluationDate, setNormativeCutoffDate, overallIndex, dimensionIndices, classificationIndices, totalEvaluated, totalRequirements } = useEvaluation();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);

  const radarData = DIMENSIONS.map(d => ({
    dimension: d,
    valor: dimensionIndices[d] !== null ? Math.round((dimensionIndices[d] as number) * 10000) / 100 : 0,
    fullMark: 100,
  }));

  const barData = DIMENSIONS.map(d => ({
    name: d,
    valor: dimensionIndices[d] !== null ? Math.round((dimensionIndices[d] as number) * 10000) / 100 : 0,
    color: DIMENSION_COLOR[d],
  }));

  const counts = countByCompliance(state.requirements);
  const pieData = [
    { name: 'Conforme', value: counts['Conforme'], color: COMPLIANCE_COLOR['Conforme'] },
    { name: 'Conforme Parcial', value: counts['Conforme Parcial'], color: COMPLIANCE_COLOR['Conforme Parcial'] },
    { name: 'Não Conforme', value: counts['Não Conforme'], color: COMPLIANCE_COLOR['Não Conforme'] },
    { name: 'Não Aplicável', value: counts['Não Aplicável'], color: COMPLIANCE_COLOR['Não Aplicável'] },
    { name: 'Não Avaliado', value: counts['Não Avaliado'], color: COMPLIANCE_COLOR['Não Avaliado'] },
  ].filter(d => d.value > 0);

  const conformity = overallIndex !== null ? getConformityLabel(overallIndex) : null;
  const progress = Math.round((totalEvaluated / totalRequirements) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {showImportDialog && (
        <ImportEvaluationDialog onDone={() => setShowImportDialog(false)} />
      )}
      {showNewDialog && (
        <NewEvaluationDialog mode="blank" onDone={() => setShowNewDialog(false)} />
      )}

      {/* Header institucional */}
      <div className="bg-ufrr text-white px-6 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-md">
                  <ClipboardList size={32} className="text-ufrr" />
                </div>
              </div>
              <div>
                <p className="text-gold font-semibold text-sm tracking-widest uppercase">Produto Técnico-Tecnológico · PROFIAP/CAPES · Área 27</p>
                <h1 className="text-2xl md:text-3xl font-bold mt-1">MCN-PDTIC · Data-Analytica-Export</h1>
                <p className="text-green-200 mt-1 text-sm">Matriz de Conformidade Normativa para PDTIC em IFES</p>
                <p className="text-green-300 text-xs mt-2">Licença CC BY-SA 4.0 · UFRR/PROFIAP · 2026 · Francisco Laurenilson Sousa Silva</p>
              </div>
            </div>
            <div className="flex-shrink-0 pt-1 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => downloadEvaluation(state)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
                title="Baixar a avaliação atual em arquivo JSON"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Exportar JSON</span>
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
                title="Carregar uma avaliação de um arquivo JSON"
              >
                <Upload size={15} />
                <span className="hidden sm:inline">Importar JSON</span>
              </button>
              <button
                onClick={() => setShowNewDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors"
                title="Criar uma nova avaliação — a atual permanece salva na lista"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">Nova Avaliação</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Dados da Avaliação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-ufrr" />
            Dados da Avaliação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Instituição (IFES)</label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
                placeholder="Ex.: Universidade Federal de Roraima"
                value={state.institutionName}
                onChange={e => setInstitution(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Período do PDTIC</label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
                placeholder="Ex.: 2024–2026"
                value={state.pdticPeriod}
                onChange={e => setPdticPeriod(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><User size={12} />Avaliador(a)</label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
                placeholder="Nome do avaliador"
                value={state.evaluatorName}
                onChange={e => setEvaluatorName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} />Data da Avaliação</label>
              <input
                type="date"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
                value={state.evaluationDate}
                onChange={e => setEvaluationDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Calendar size={12} />Data de Corte Normativa</label>
              <input
                type="date"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ufrr/30"
                value={state.normativeCutoffDate}
                onChange={e => setNormativeCutoffDate(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1">Normas posteriores não geram penalização retroativa.</p>
            </div>
          </div>
        </div>

        {/* Registro de manutenção da matriz (versão, corte e histórico) */}
        <MatrixMaintenanceCard />

        {/* Progresso da avaliação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">Progresso da Avaliação</h3>
            <span className="text-sm font-bold text-ufrr">{totalEvaluated} / {totalRequirements} requisitos avaliados ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-ufrr transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalEvaluated === 0 && (
            <p className="text-xs text-gray-500 mt-2">Acesse as abas das Dimensões para iniciar a avaliação dos requisitos.</p>
          )}
        </div>

        {/* Avaliações salvas e comparação entre ciclos */}
        <SavedEvaluations />

        {/* Painel de índices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ICD Geral */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4">
            <h2 className="text-base font-bold text-gray-800">ICD Geral</h2>
            <IndexGauge value={overallIndex} size="lg" />
            {conformity && (
              <div className="text-center">
                <p className="text-xs text-gray-500">Índice de Conformidade Documental</p>
                <p className="text-xs text-gray-400 mt-1">ICD = Σ(scores) / requisitos aplicáveis avaliados</p>
              </div>
            )}
            {overallIndex === null && (
              <p className="text-xs text-gray-400 text-center">Nenhum requisito avaliado ainda.</p>
            )}
          </div>

          {/* Índices por Dimensão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">ICD por Dimensão</h2>
            <div className="space-y-4">
              {DIMENSIONS.map(d => {
                const idx = dimensionIndices[d];
                const pct = idx !== null ? Math.round(idx * 100) : 0;
                const color = DIMENSION_COLOR[d];
                const conformity = idx !== null ? getConformityLabel(idx) : null;
                return (
                  <div key={d}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{d}</span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {formatICDPercent(idx)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    {conformity && (
                      <p className="text-xs mt-0.5" style={{ color: conformity.color }}>{conformity.label}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ICD por Natureza */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">ICD por Natureza</h2>
            <div className="space-y-4">
              {CLASSIFICATIONS.map(c => {
                const idx = classificationIndices[c];
                const pct = idx !== null ? Math.round(idx * 100) : 0;
                const color = CLASSIFICATION_COLOR[c];
                const conformity = idx !== null ? getConformityLabel(idx) : null;
                return (
                  <div key={c}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{c}</span>
                      <span className="text-sm font-bold" style={{ color }}>
                        {formatICDPercent(idx)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    {conformity && (
                      <p className="text-xs mt-0.5" style={{ color: conformity.color }}>{conformity.label}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              A natureza (Obrigatório/Recomendado/Complementar) é metadado analítico e não altera o ICD geral.
            </p>
          </div>

          {/* Distribuição de conformidade */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-2">Distribuição de Conformidade</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${value}`}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} formatter={(value) => <span className="text-xs text-gray-700">{value}</span>} />
                  <Tooltip formatter={(v) => `${v} (${formatDecimalBR((Number(v) / totalRequirements) * 100, 1)}%)`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">Sem dados ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico Radar e Barras */}
        {totalEvaluated > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Radar de Conformidade</h2>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="ICD (%)" dataKey="valor" stroke="#006030" fill="#006030" fillOpacity={0.25} />
                  <Tooltip formatter={(v) => `${formatDecimalBR(Number(v))}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">ICD por Dimensão (%)</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${formatDecimalBR(Number(v))}%`} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Legenda de classificação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Escala de Classificação do ICD</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { range: '90 – 100%', label: 'Conformidade Excelente', color: '#1B5E20', bg: '#E8F5E9' },
              { range: '75 – 89%', label: 'Conformidade Adequada', color: '#2E7D32', bg: '#E8F5E9' },
              { range: '60 – 74%', label: 'Conformidade Parcial', color: '#E65100', bg: '#FFF3E0' },
              { range: '40 – 59%', label: 'Conformidade Insuficiente', color: '#BF360C', bg: '#FBE9E7' },
              { range: '0 – 39%', label: 'Conformidade Crítica', color: '#B71C1C', bg: '#FFEBEE' },
            ].map(item => (
              <div key={item.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: item.bg }}>
                <p className="text-lg font-bold" style={{ color: item.color }}>{item.range}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: item.color }}>{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-1">Metadado de classificação:</p>
            <div className="flex gap-4 flex-wrap">
              <span className="text-xs text-gray-700"><strong>Obrigatório</strong></span>
              <span className="text-xs text-gray-700"><strong>Recomendado</strong></span>
              <span className="text-xs text-gray-700"><strong>Complementar</strong></span>
            </div>
            <p className="text-xs text-gray-500 mt-2">A classificação não altera o peso. Scores: Conforme = 1,00 · Conforme Parcial = 0,50 · Não Conforme = 0,00. Não Aplicável e Não Avaliado ficam fora do denominador.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
