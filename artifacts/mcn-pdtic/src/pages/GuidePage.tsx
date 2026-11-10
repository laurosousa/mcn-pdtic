import { BookOpen, ChevronRight, ClipboardList, Users, Target, BarChart2, FileDown, RefreshCw, Scale } from 'lucide-react';
import { MatrixMaintenanceCard } from '@/components/MatrixMaintenanceCard';

export function GuidePage() {
  const sections = [
    {
      id: 1,
      icon: Target,
      title: '1. Objeto e Finalidade da MCN',
      color: '#006030',
      content: `A Matriz de Conformidade Normativa para PDTIC (MCN-PDTIC) é um instrumento de avaliação documental desenvolvido para verificar o grau de aderência dos Planos Diretores de Tecnologia da Informação e Comunicação (PDTICs) elaborados por Instituições Federais de Ensino Superior (IFES) ao arcabouço normativo federal vigente.

A MCN organiza 80 requisitos de conformidade em quatro dimensões avaliativas:
• Dimensão Normativa — 20 requisitos (N01-N20): aderência ao marco legal e regulatório federal e institucional;
• Dimensão Estratégica — 20 requisitos (E01-E20): alinhamento estratégico e planejamento;
• Dimensão Operacional — 20 requisitos (O01-O20): execução, metas, monitoramento e controle;
• Dimensão de Governança — 20 requisitos (G01-G20): estruturas de decisão, riscos e transparência.

O instrumento é derivado das principais normativas que regem a elaboração de PDTICs no SISP. A aplicabilidade de cada norma deve ser verificada segundo a data de corte registrada, evitando penalização retroativa por normas supervenientes.`,
    },
    {
      id: 2,
      icon: Users,
      title: '2. Público-Alvo e Aplicabilidade',
      color: '#1565C0',
      content: `A MCN destina-se prioritariamente aos seguintes perfis profissionais:

GESTORES DE TIC: Diretores e gerentes de Centros/Departamentos de Tecnologia da Informação de IFES, responsáveis pela elaboração, coordenação e monitoramento do PDTIC.

COMITÊ DE GOVERNANÇA DIGITAL: Membros de CGDs que necessitam avaliar a qualidade e aderência do PDTIC às exigências normativas antes da aprovação formal.

AUDITORES E CONTROLADORES: Equipes das unidades de auditoria interna (AUDIN), controladores e fiscais de contratos que realizam fiscalização de rotina ou especial sobre a gestão de TIC.

PESQUISADORES E CONSULTORES: Profissionais de mestrado profissional em Administração Pública (PROFIAP), pesquisadores de governança de TIC no setor público e consultores especializados.

A MCN é replicável em qualquer órgão integrante do SISP, especialmente em IFES vinculadas ao Ministério da Educação (MEC), com as devidas adaptações ao contexto institucional. A aplicação pode ser realizada individualmente ou em equipe, sendo recomendada a participação de ao menos um representante da unidade de TIC.`,
    },
    {
      id: 3,
      icon: BookOpen,
      title: '3. Pré-Requisitos para Aplicação',
      color: '#E65100',
      content: `Antes de iniciar a avaliação, o avaliador deve reunir os seguintes documentos e informações:

CORPUS DOCUMENTAL:
• PDTIC vigente (versão aprovada) — em formato digital (PDF ou equivalente);
• Documentos institucionais expressamente referenciados pelo PDTIC e previamente incluídos no corpus;
• Ato de aprovação e portaria que institui o PDTIC.

O escopo é estritamente documental. A MCN verifica o que o PDTIC contém, descreve ou referencia, e não o funcionamento material de comitês, canais, controles ou práticas operacionais.

REFERÊNCIAS NORMATIVAS PARA CONSULTA:
• IN SGD/ME nº 94/2022 (principal referência);
• Guia de PDTIC do SISP v2.1 (30/09/2021);
• Acórdãos TCU nº 2.308/2010 e 1.233/2012.`,
    },
    {
      id: 4,
      icon: BarChart2,
      title: '4. Procedimento de Avaliação (Passo a Passo)',
      color: '#6A1B9A',
      content: `PASSO 1 — PREENCHIMENTO DOS DADOS (Dashboard)
Acesse o Dashboard e informe os dados da avaliação: nome da instituição, período do PDTIC, nome do avaliador(a) e data da avaliação. Esses dados serão incorporados automaticamente ao relatório exportável.

PASSO 2 — AVALIAÇÃO DOS REQUISITOS (Dimensões)
Para cada uma das quatro dimensões (Normativa, Estratégica, Operacional, Governança):
a) Acesse a aba da dimensão correspondente;
b) Clique em cada requisito para expandi-lo;
c) Consulte o PDTIC e os documentos correlatos;
d) Selecione o nível de conformidade conforme a tabela de pontuação abaixo;
e) Registre observações, evidências e justificativas no campo correspondente.

TABELA DE PONTUAÇÃO:
• Conforme (1,00): O requisito está plenamente satisfeito, com evidências documentais claras e verificáveis;
• Conforme Parcial (0,50): O requisito está satisfeito de forma incompleta, superficial ou com lacunas relevantes;
• Não Conforme (0,00): O requisito não está satisfeito — ausente, inconsistente ou não verificável no corpus;
• Não Aplicável: O requisito não se aplica ao caso ou à data de corte. Exige justificativa e é excluído do denominador;
• Não Avaliado: O requisito ainda não foi objeto de análise. É excluído do cálculo, mas mantém a avaliação incompleta.

PASSO 3 — ANÁLISE DOS RESULTADOS (Relatório)
Ao concluir a avaliação, acesse o Relatório para verificar o Índice de Conformidade Documental (ICD) geral e por dimensão, a distribuição dos requisitos por nível de conformidade e a listagem das não conformidades identificadas.

PASSO 4 — EXPORTAÇÃO DO RELATÓRIO
Exporte os dados em formato CSV (para análise em planilha) ou em TXT (relatório executivo completo) por meio dos botões disponíveis na aba Relatório.`,
    },
    {
      id: 5,
      icon: ClipboardList,
      title: '5. Etapas da Aplicação e Segundo Avaliador',
      color: '#2E7D32',
      content: `ETAPAS DA APLICAÇÃO (Seção 5.5 da dissertação):
O guia organiza a aplicação em seis etapas:
a) delimitação do corpus e da data de corte: reunir o PDTIC vigente e os documentos que comprovam sua aprovação, deliberação colegiada, publicação e revisões, e fixar a data de corte normativo;
b) verificação da atualidade da matriz: conferir, no registro de manutenção, se os fundamentos normativos permanecem vigentes na data de corte;
c) classificação dos requisitos: atribuir a cada requisito uma das categorias Conforme, Conforme Parcial, Não Conforme ou Não Aplicável, registrando a evidência documental e sua localização e justificando as exclusões por inaplicabilidade;
d) cálculo e interpretação dos índices: a aplicação web calcula o ICD geral e o ICD por dimensão e os posiciona na escala do Quadro 8;
e) análise das lacunas: examinar os itens parciais e não conformes segundo sua natureza e agrupá-los pelos padrões de lacuna;
f) relatório e deliberação: emitir o relatório de conformidade priorizado e submetê-lo ao CGD, reaplicando o instrumento a cada revisão anual do plano.

SEGUNDO AVALIADOR (Seção 5.5 da dissertação):
Para mitigar o viés de avaliador único, discutido na Seção 3.9, o guia recomenda que a classificação seja revisada por um segundo avaliador, com registro das divergências e de sua resolução, procedimento coerente com os critérios de confiabilidade adotados na Seção 3.7.`,
    },
    {
      id: 6,
      icon: Scale,
      title: '6. Fórmula de Cálculo do ICD',
      color: '#006030',
      content: `O Índice de Conformidade Documental (ICD) é calculado pela média simples dos scores dos requisitos aplicáveis avaliados.

FÓRMULA:
ICD = Σ score_i / n

onde n é o número de requisitos classificados como Conforme, Conforme Parcial ou Não Conforme. “Não Aplicável” e “Não Avaliado” não entram no denominador.

REGISTRO OBRIGATÓRIO (por requisito):
• Localização da evidência — onde a evidência está no documento (seção, página ou citação); é obrigatória para classificar como "Conforme";
• Justificativa — fundamentação da classificação; é obrigatória para "Não Aplicável".

REGRAS DE DECISÃO (Seção 3.6.3 da dissertação):
1. Presunção de conformidade: "C" só com evidência explícita e suficiente;
2. Dúvida razoável: ambiguidade ou incompletude leva a "CP"; "NC" só para ausência inequívoca;
3. Multiplicidade de evidências: basta uma seção do PDTIC suficiente.

CLASSIFICAÇÃO ANALÍTICA:
• Obrigatório, Recomendado e Complementar permanecem como metadados para análise qualitativa;
• Essas categorias não atribuem pesos e não alteram o ICD.

ESCALA DE CLASSIFICAÇÃO DO ICD:
• 90 a 100% → Conformidade Excelente: O PDTIC atende de forma exemplar ao arcabouço normativo avaliado;
• 75 a 89% → Conformidade Adequada: O PDTIC atende satisfatoriamente ao normativo avaliado;
• 60 a 74% → Conformidade Parcial: O PDTIC apresenta lacunas relevantes que devem ser sanadas;
• 40 a 59% → Conformidade Insuficiente: O PDTIC apresenta déficits substanciais de conformidade;
• 0 a 39% → Conformidade Crítica: O PDTIC não atende satisfatoriamente ao arcabouço normativo avaliado.

LIMITAÇÕES DO INSTRUMENTO:
O ICD mensura a conformidade documental — i.e., a presença e a qualidade formal dos elementos normativos no PDTIC. O instrumento não avalia a efetividade da implementação, a qualidade técnica dos projetos ou o impacto das ações de TIC. Recomenda-se que a avaliação de conformidade documental seja complementada por instrumentos de avaliação de resultados e de maturidade em governança de TIC.`,
    },
    {
      id: 7,
      icon: RefreshCw,
      title: '7. Customização e Atualização da MCN',
      color: '#1565C0',
      content: `A MCN foi projetada para ser replicável e adaptável a diferentes contextos institucionais no âmbito do SISP e das IFES. Para customização:

ADAPTAÇÃO INSTITUCIONAL:
• A matriz canônica possui 80 requisitos; exclusões ou inclusões produzem uma versão adaptada e devem ser declaradas no relatório;
• A inaplicabilidade deve ser decidida item a item, com justificativa, e nunca automaticamente pela classificação do requisito;
• As observações registradas em cada requisito devem referenciar os documentos e artefatos consultados, garantindo rastreabilidade e auditabilidade do processo avaliativo.

ATUALIZAÇÃO NORMATIVA:
O gestor responsável pela aplicação deve informar a data de corte e verificar periodicamente:
• Edição ou revogação de Instruções Normativas da SGD/ME ou órgão equivalente;
• Novos acórdãos ou orientações do TCU sobre governança e gestão de TIC em IFES;
• Atualização da Estratégia de Governo Digital (EGD) ou de outros marcos estratégicos federais;
• Alterações na legislação aplicável (LGPD, Lei de Licitações, Lei do Governo Digital).

CICLO DE REVISÃO RECOMENDADO:
Recomenda-se a revisão anual da MCN, em consonância com o ciclo de revisão do próprio PDTIC e as atualizações normativas do SISP.

CITAÇÃO DO INSTRUMENTO:
ALVES, Victor Hugo Lima; SILVA, Francisco Laurenilson Sousa. MCN-PDTIC: Matriz de Conformidade Normativa para Planos Diretores de TIC. Boa Vista: Universidade Federal de Roraima, 2026. Programa de computador. Registro INPI: BR512026009724-0.`,
    },
    {
      id: 8,
      icon: BookOpen,
      title: '8. Como a Seção 4 da Dissertação Fundamenta a MCN',
      color: '#6A1B9A',
      content: `A Seção 4 aplica COBIT 2019, iESGo e iGOVSISP ao PDTIC da UFRR. A comparação mostra que cada framework captura apenas parte do conteúdo necessário e identifica sete insuficiências convergentes: planejamento orçamentário, governança colegiada, legitimidade da liderança, integridade, governança de dados, detalhamento das contratações e interoperabilidade federal.

CONTRIBUIÇÕES PARA A MCN:
• Justifica a necessidade de um instrumento integrado, pois nenhum dos três frameworks cobre isoladamente o objeto;
• Sustenta analiticamente as quatro dimensões da MCN;
• Orienta a abrangência de requisitos sobre orçamento, CGD, dados, PCA e alinhamento à EGD;
• Apoia a replicabilidade por generalização analítica, sem pretender generalização estatística para todas as IFES.

LIMITES:
A Seção 4 não atribui conformidade aos 80 requisitos, não substitui a fonte normativa de cada item e não valida sozinha o conteúdo da MCN. A derivação normativa vem do marco apresentado na Seção 2.5 e da matriz de rastreabilidade.

VALIDAÇÃO DE CONTEÚDO:
O painel reúne de 3 a 4 gestores de TIC de IFES da região Norte, de 3 a 4 profissionais de auditoria e controle e de 3 a 4 pesquisadores doutores. O IVC sintetiza oito critérios: clareza, relevância, abrangência, aplicabilidade técnica, aderência ao PROFIAP, impacto, aplicabilidade/reprodutibilidade e inovação/complexidade. O delineamento atual da dissertação não utiliza kappa.`,
    },
    {
      id: 9,
      icon: FileDown,
      title: '9. Informações sobre o PTT',
      color: '#E65100',
      content: `PRODUTO TÉCNICO-TECNOLÓGICO (PTT)
Tipo: Software/Aplicativo — Área 27 (Administração Pública), CAPES
Plataforma: Aplicação web de acesso aberto, publicada em laurosousa.github.io/mcn-pdtic

REGISTRO DE PROGRAMA DE COMPUTADOR (INPI):
Processo: BR512026009724-0
Título: MCN-PDTIC: Matriz de Conformidade Normativa para Planos Diretores de TIC
Titular: Universidade Federal de Roraima
Autores: Victor Hugo Lima Alves; Francisco Laurenilson Sousa Silva
Data de criação: 27/04/2026 · Certificado expedido em 03/11/2026
Base legal: Lei nº 9.609/1998
© 2026 Universidade Federal de Roraima. Todos os direitos reservados.

VINCULAÇÃO À PESQUISA:
Este PTT é o Produto Técnico-Tecnológico derivado da dissertação de mestrado:
"MATRIZ DE CONFORMIDADE NORMATIVA PARA PDTIC: proposta de instrumento de avaliação na UFRR"
Programa: PROFIAP — Mestrado Profissional em Administração Pública
Instituição: Universidade Federal de Roraima (UFRR)
Período: 2026

AUTORIA E ORIENTAÇÃO:
Autores do programa (INPI): Victor Hugo Lima Alves; Francisco Laurenilson Sousa Silva
Na dissertação: Francisco Laurenilson Sousa Silva (mestrando) e Prof. Dr. Victor Hugo Lima Alves (orientador)
Instituição: UFRR / PROFIAP

DADOS TÉCNICOS:
• 80 requisitos de conformidade em 4 dimensões avaliativas (N=20, E=20, O=20, G=20);
• Escala Conforme, Conforme Parcial, Não Conforme, Não Aplicável e Não Avaliado;
• Classificação normativa mantida como metadado, sem ponderação;
• Cálculo automático do ICD (Índice de Conformidade Documental) geral e por dimensão;
• Exportação de relatório de não conformidades em CSV e TXT;
• Persistência dos dados em localStorage (sem necessidade de cadastro ou servidor);
• Compatível com todos os navegadores modernos.

FUNDAMENTAÇÃO TÉCNICA:
IN SGD/ME nº 94/2022 · Estratégia de Governo Digital vigente na data de corte · Decreto nº 7.579/2011 (SISP) · Guia SISP v2.1 · Acórdãos TCU nº 2.308/2010 e 1.233/2012 · COBIT 2019 · Lei nº 14.129/2021 · Lei nº 13.709/2018 (LGPD) · Lei nº 12.527/2011 (LAI) · Lei nº 14.133/2021`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-ufrr to-green-800 text-white px-6 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold font-semibold text-xs uppercase tracking-widest">MCN-PDTIC</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Guia de Aplicação</h1>
          <p className="text-green-200 mt-1 text-sm">Instruções completas para aplicação, interpretação e customização da Matriz de Conformidade Normativa para PDTIC em IFES.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {sections.map(({ id, icon: Icon, title, color, content }) => (
          <div key={id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100" style={{ borderLeftWidth: 4, borderLeftColor: color, borderLeftStyle: 'solid' }}>
              <Icon size={20} style={{ color }} />
              <h2 className="font-bold text-gray-800">{title}</h2>
            </div>
            <div className="px-6 py-5">
              {content.split('\n\n').map((paragraph, i) => (
                <div key={i} className={i > 0 ? 'mt-4' : ''}>
                  {paragraph.startsWith('•') || paragraph.includes('\n•') ? (
                    <div>
                      {paragraph.split('\n').map((line, j) => (
                        line.startsWith('•') ? (
                          <div key={j} className="flex items-start gap-2 mb-1.5">
                            <ChevronRight size={14} className="flex-shrink-0 mt-0.5" style={{ color }} />
                            <p className="text-sm text-gray-700">{line.substring(2)}</p>
                          </div>
                        ) : (
                          <p key={j} className="text-sm font-semibold text-gray-800 mb-2">{line}</p>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {paragraph.split('\n').map((line, j) => (
                        <span key={j}>
                          {line.includes(':') && line.length < 50 && !line.startsWith(' ') ? (
                            <strong>{line}</strong>
                          ) : line}
                          {j < paragraph.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 10. Registro de manutenção da matriz (versão, corte e histórico) */}
        <MatrixMaintenanceCard />
      </div>
    </div>
  );
}
