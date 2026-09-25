import { REQUIREMENTS_FULL, type Compliance, type EvaluationState } from '../mcn';

const EVAL_DATA: Record<string, { compliance: Compliance; observation: string; evidenceLocation?: string }> = {
  "N01": {
    "compliance": "Não Conforme",
    "observation": "Seção 3 e apresentação: a IN SGD/ME nº 94/2022 é citada, mas o PDTIC não demonstra como as contratações decorrentes observarão seu processo. A mera referência não comprova atendimento."
  },
  "N02": {
    "compliance": "Conforme",
    "evidenceLocation": "Seções 1–4 e 9–15",
    "observation": "Seções 1–4 e 9–15: referencia a Portaria nº 778/2019 e apresenta diagnóstico, necessidades, metas, pessoas, orçamento, riscos e revisão, compatíveis com o conteúdo mínimo."
  },
  "N03": {
    "compliance": "Não Conforme",
    "observation": "A Portaria do Reitor menciona a Ata nº 1167/2023-GAB, mas o corpus não apresenta deliberação do CGD sobre o PDTIC. Aprovação pela autoridade não substitui evidência colegiada."
  },
  "N04": {
    "compliance": "Não Conforme",
    "observation": "O PDF anexado não comprova publicação do PDTIC no portal institucional. A existência do arquivo no corpus não permite inferir transparência ativa."
  },
  "N05": {
    "compliance": "Conforme Parcial",
    "observation": "Seções 1 e 3: há referências ao SISP, ao Guia e à Administração Pública Federal, sem identificação detalhada da inserção institucional e dos atos aplicáveis do órgão central."
  },
  "N06": {
    "compliance": "Não Conforme",
    "observation": "Seções 3 e 13: há menções a contratações e planejamento orçamentário, mas não existe declaração ou correspondência explícita com o Plano de Contratações Anual."
  },
  "N07": {
    "compliance": "Não Conforme",
    "observation": "A Lei nº 14.133/2021 é citada indiretamente pela descrição da IN nº 94/2022, mas o plano não identifica o regime aplicável às contratações previstas."
  },
  "N08": {
    "compliance": "Conforme Parcial",
    "observation": "Seções 3, 4 e 8: identifica a EGD 2020–2023 e ações compatíveis, mas não vincula sistematicamente objetivos ou iniciativas aos objetivos pertinentes da EGD."
  },
  "N09": {
    "compliance": "Conforme",
    "evidenceLocation": "Princípios, inventário e plano de ações do PDTIC",
    "observation": "Princípios, inventário e plano de ações contemplam processos digitais, transparência, sistemas eletrônicos, painéis e serviços digitais."
  },
  "N10": {
    "compliance": "Conforme Parcial",
    "observation": "Princípios e ações de segurança contemplam LGPD, capacitação e criação de normas, mas não detalham um conjunto estruturado de medidas de privacidade e proteção de dados."
  },
  "N11": {
    "compliance": "Não Conforme",
    "observation": "O PDF não contém evidência de disponibilização no portal em formato eletrônico aberto e não proprietário."
  },
  "N12": {
    "compliance": "Conforme",
    "evidenceLocation": "Seções 1 e 8 e Anexo I",
    "observation": "Seções 1 e 8 e Anexo I: declara alinhamento ao PDI 2021–2025 e relaciona necessidades e ações às áreas temáticas institucionais."
  },
  "N13": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 15",
    "observation": "Seção 15: vigência de 2023–2025, revisão ordinária anual e possibilidade de revisão extraordinária."
  },
  "N14": {
    "compliance": "Conforme Parcial",
    "observation": "Seção 2: adota o Guia de PDTIC do SISP versão 2.0; a MCN auditada utiliza como referência a versão 2.1 disponível no corte."
  },
  "N15": {
    "compliance": "Conforme",
    "evidenceLocation": "Portaria Normativa GR/UFRR nº 030/2023 e título do documento",
    "observation": "A Portaria e o título definem formalmente o período 2023–2025, atendendo à duração mínima."
  },
  "N16": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 5",
    "observation": "Seção 5: identifica a DTI e descreve sua responsabilidade pela gestão, planejamento, coordenação e acompanhamento das ações de TIC."
  },
  "N17": {
    "compliance": "Conforme",
    "evidenceLocation": "Portaria Normativa GR/UFRR nº 030/2023",
    "observation": "A Portaria Normativa nº 030/2023 institui o PDTIC, possui data e assinatura digital do Reitor."
  },
  "N18": {
    "compliance": "Não Aplicável",
    "observation": "Não foi identificada no corpus solicitação administrativa formal que tornasse obrigatório cadastro ou envio a sistema do órgão central."
  },
  "N19": {
    "compliance": "Não Conforme",
    "observation": "Não há número de versão nem histórico de alterações. “2023–2025” identifica a vigência, não a versão documental."
  },
  "N20": {
    "compliance": "Conforme",
    "evidenceLocation": "Próprio corpus: Portaria Normativa GR/UFRR nº 030/2023",
    "observation": "O ato interno de instituição integra o próprio corpus: Portaria Normativa GR/UFRR nº 030/2023."
  },
  "E01": {
    "compliance": "Conforme",
    "evidenceLocation": "Seções 7 e 9",
    "observation": "Seções 7 e 9: análise SWOT completa e inventário de necessidades priorizado."
  },
  "E02": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 8 e Anexo I",
    "observation": "Seção 8 e Anexo I: alinhamento explícito ao PDI e associação das necessidades às áreas temáticas institucionais."
  },
  "E03": {
    "compliance": "Conforme Parcial",
    "observation": "A EGD é citada e existem iniciativas compatíveis, mas não há vínculo explícito entre objetivos ou iniciativas da TIC e objetivos pertinentes da EGD."
  },
  "E04": {
    "compliance": "Conforme Parcial",
    "observation": "Há cinco objetivos estratégicos e indicadores de execução, mas cada objetivo não possui desdobramento próprio completo em meta, indicador, valor e prazo."
  },
  "E05": {
    "compliance": "Conforme Parcial",
    "observation": "Seção 8 e Figura 5 evidenciam a hierarquia de planejamento; não existe matriz entre objetivos de TIC e objetivos institucionais."
  },
  "E06": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 9 e Anexo I",
    "observation": "Seção 9 e Anexo I: levantamento estruturado e priorizado de necessidades de governança, segurança, infraestrutura, sistemas, suporte e pessoas."
  },
  "E07": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 9 e Quadro 4",
    "observation": "Seção 9 e Quadro 4: método GUT, critérios, escala, pontuação e ordenação."
  },
  "E08": {
    "compliance": "Conforme Parcial",
    "observation": "Quadros 5–11: indicadores e metas semestrais medem predominantemente conclusão de ações, e não resultados estratégicos de cada objetivo."
  },
  "E09": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 7",
    "observation": "A SWOT contempla ataques, mudanças normativas, restrições orçamentárias, transformação digital, nuvem, teletrabalho e ambiente governamental."
  },
  "E10": {
    "compliance": "Conforme",
    "evidenceLocation": "Seções 5, 7 e 10",
    "observation": "Seções 5, 7 e 10: estrutura, equipe, usuários, infraestrutura, capacidades e limitações internas."
  },
  "E11": {
    "compliance": "Conforme Parcial",
    "observation": "O Quadro 12 constitui portfólio de ações com metas e prazos, mas escopo e justificativa individual não são uniformes."
  },
  "E12": {
    "compliance": "Conforme",
    "evidenceLocation": "Quadro 12",
    "observation": "O Quadro 12 relaciona ações às necessidades de TIC e às áreas temáticas do PDI."
  },
  "E13": {
    "compliance": "Conforme",
    "evidenceLocation": "Plano de Transformação Digital e iniciativas de digitalização do PDTIC",
    "observation": "Há digitalização, processos eletrônicos, nuvem, painéis, integração de sistemas e implementação do Plano de Transformação Digital."
  },
  "E14": {
    "compliance": "Conforme Parcial",
    "observation": "SWOT, capacidade de execução e comparação de pessoal mostram lacunas implícitas, sem análise formal por capacidade entre situação atual e desejada."
  },
  "E15": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 7",
    "observation": "Seção 7: missão, visão e valores da TIC articulados ao papel institucional."
  },
  "E16": {
    "compliance": "Conforme",
    "evidenceLocation": "Seções 5 e 7",
    "observation": "Seções 5 e 7: identificação da DTI, atribuições e papel de gestão e sustentação da TIC."
  },
  "E17": {
    "compliance": "Não Aplicável",
    "observation": "O PBIA 2024–2028 é posterior à data de corte e não pode gerar não conformidade retroativa."
  },
  "E18": {
    "compliance": "Não Conforme",
    "observation": "Não há abordagem explícita de acessibilidade, inclusão digital ou equidade no acesso aos serviços e recursos de TIC."
  },
  "E19": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 3",
    "observation": "Seção 3 identifica a EGD 2020–2023, o Decreto nº 10.332/2020 e o Decreto nº 11.260/2022."
  },
  "E20": {
    "compliance": "Conforme Parcial",
    "observation": "O plano identifica comunidade, usuários, alta administração, áreas de negócio e demandantes, mas não analisa sistematicamente interesses, impactos e expectativas."
  },
  "O01": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 11 e Quadro 12",
    "observation": "Seção 11 e Quadro 12: plano estruturado de metas e ações vinculado às necessidades priorizadas."
  },
  "O02": {
    "compliance": "Conforme Parcial",
    "observation": "As ações possuem metas e há indicadores globais e por categoria, mas não existe indicador específico definido para cada ação."
  },
  "O03": {
    "compliance": "Não Conforme",
    "observation": "O Quadro 12 não identifica unidade demandante e unidade responsável pela execução de cada ação; responsáveis pela coleta dos indicadores não suprem essa lacuna."
  },
  "O04": {
    "compliance": "Conforme Parcial",
    "observation": "As ações possuem prazos relativos de 12, 18, 24 ou 36 meses, mas não cronograma com início e término individualizados."
  },
  "O05": {
    "compliance": "Não Conforme",
    "observation": "A seção 13 não contém estimativa de custos por ação nem premissas orçamentárias."
  },
  "O06": {
    "compliance": "Conforme Parcial",
    "observation": "Há descrição geral de pessoas, datacenter, rede, sistemas e serviços, sem inventário detalhado dos recursos existentes."
  },
  "O07": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 12",
    "observation": "A seção 12 apresenta plano de pessoas, quantitativo, dimensionamento comparativo e competências necessárias."
  },
  "O08": {
    "compliance": "Conforme Parcial",
    "observation": "O Quadro 15 define temas e coordenações para capacitação, mas não carga horária, calendário ou metas detalhadas."
  },
  "O09": {
    "compliance": "Conforme Parcial",
    "observation": "Existem necessidades e ações referentes a suporte, garantia e manutenção de contratos, sem estratégia consolidada ou mapa de contratos críticos."
  },
  "O10": {
    "compliance": "Não Conforme",
    "observation": "Não há PCA nem correspondência documentada entre cada ação contratável e a contratação prevista."
  },
  "O11": {
    "compliance": "Não Conforme",
    "observation": "O plano de riscos não identifica serviços críticos nem referencia plano de continuidade com medidas de contingência."
  },
  "O12": {
    "compliance": "Não Conforme",
    "observation": "A metodologia do SISP refere-se à elaboração do PDTIC; não há abordagem de gerenciamento para os projetos derivados."
  },
  "O13": {
    "compliance": "Conforme Parcial",
    "observation": "Existem indicadores de execução global e por área, sem KPIs de qualidade dos serviços ou resultado específico para cada meta."
  },
  "O14": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 11",
    "observation": "Acompanhamento semestral, indicadores e submissão ao CGD estão definidos na seção 11."
  },
  "O15": {
    "compliance": "Não Conforme",
    "observation": "A seção intitulada Plano Orçamentário não apresenta valores, projeções, categorias ou períodos."
  },
  "O16": {
    "compliance": "Não Conforme",
    "observation": "A menção genérica à PLOA não identifica fontes de financiamento por ação."
  },
  "O17": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 9, Quadro 4",
    "observation": "A matriz GUT explicita critérios, escala e ordenação das demandas."
  },
  "O18": {
    "compliance": "Conforme Parcial",
    "observation": "O plano contempla SIG/UFRR, integração e consolidação de sistemas, mas não documenta integração com sistemas corporativos federais específicos."
  },
  "O19": {
    "compliance": "Conforme Parcial",
    "observation": "Há aquisição, atualização, garantia e manutenção; o ciclo completo, incluindo descarte, não é estruturado."
  },
  "O20": {
    "compliance": "Não Conforme",
    "observation": "Não há plano de comunicação interna para disseminação do PDTIC e engajamento das áreas durante a execução."
  },
  "G01": {
    "compliance": "Conforme Parcial",
    "observation": "O Quadro 1 referencia a Portaria nº 578/GR/2020, que institui o CGD, mas não reproduz ou anexa o ato."
  },
  "G02": {
    "compliance": "Conforme",
    "evidenceLocation": "Quadro 1",
    "observation": "O Quadro 1 referencia a Portaria Normativa nº 013/2021, que institui o Regimento Interno do CGD e trata de suas competências."
  },
  "G03": {
    "compliance": "Conforme Parcial",
    "observation": "Prevê submissão semestral dos indicadores ao CGD, mas não estabelece periodicidade das reuniões do colegiado."
  },
  "G04": {
    "compliance": "Não Conforme",
    "observation": "A Portaria menciona a Ata nº 1167/2023-GAB, mas não apresenta ato ou ata de deliberação do CGD sobre o PDTIC."
  },
  "G05": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 14 e Quadro 16",
    "observation": "Seção 14 e Quadro 16: plano de riscos com descrição, probabilidade, impacto, ação, resposta, responsável e objetivo afetado."
  },
  "G06": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 14, Quadro 16",
    "observation": "Os riscos são classificados por probabilidade e impacto e possuem respostas e responsáveis."
  },
  "G07": {
    "compliance": "Não Conforme",
    "observation": "Fatores críticos mencionam fiscalização e maturidade, mas não há previsão de auditoria interna ou avaliação formal de conformidade das ações."
  },
  "G08": {
    "compliance": "Conforme Parcial",
    "observation": "Indicadores semestrais são submetidos ao CGD, sem processo estruturado de prestação de contas aos órgãos de controle."
  },
  "G09": {
    "compliance": "Não Conforme",
    "observation": "O corpus não comprova disponibilização do PDTIC no portal institucional em transparência ativa e formato aberto."
  },
  "G10": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 15",
    "observation": "Seção 15: revisão ordinária anual, extraordinária quando necessária e apreciação pelo CGD."
  },
  "G11": {
    "compliance": "Conforme Parcial",
    "observation": "DTI, CGD e coordenações aparecem em diferentes partes, mas não há instrumento abrangente de papéis e responsabilidades."
  },
  "G12": {
    "compliance": "Conforme Parcial",
    "observation": "O PNSI é referenciado e há ações de segurança, hardening e criação de normas, sem referência a uma PSI institucional aprovada."
  },
  "G13": {
    "compliance": "Conforme Parcial",
    "observation": "Há LGPD, proteção de dados e capacitação, sem mapeamento de dados pessoais ou controles documentados de governança de dados."
  },
  "G14": {
    "compliance": "Conforme Parcial",
    "observation": "Demandas foram obtidas por chamados, e-mails e memorandos; o próprio plano reconhece ausência de representação de todas as áreas finalísticas."
  },
  "G15": {
    "compliance": "Conforme Parcial",
    "observation": "Há alinhamento ao PDI, mas não integração documentada com PCA ou outros instrumentos anuais de planejamento."
  },
  "G16": {
    "compliance": "Não Conforme",
    "observation": "A SWOT registra deficiência de gestão de mudanças, mas não existe fluxo documentado de solicitação, impacto e aprovação."
  },
  "G17": {
    "compliance": "Não Conforme",
    "observation": "O plano menciona maturidade e prevê mensuração futura, sem diagnóstico do nível atual e definição do nível-alvo."
  },
  "G18": {
    "compliance": "Não Conforme",
    "observation": "Não foi identificado benchmarking com outras IFES ou organizações de referência."
  },
  "G19": {
    "compliance": "Conforme",
    "evidenceLocation": "Seção 9",
    "observation": "A seção 9 registra canais formais de demanda: OTRS, e-mails e memorandos."
  },
  "G20": {
    "compliance": "Conforme Parcial",
    "observation": "Há acompanhamento semestral e submissão ao CGD, sem previsão expressa de relatório anual com resultados e desvios."
  }
};

export const UFRR_EVALUATION: EvaluationState = {
  institutionName: 'Universidade Federal de Roraima',
  pdticPeriod: '2023–2025',
  evaluatorName: 'MCN-PDTIC — avaliação documental',
  evaluationDate: '2026-09-16',
  normativeCutoffDate: '2023-11-06',
  requirements: REQUIREMENTS_FULL.map(r => {
    const data = EVAL_DATA[r.id];
    if (data) {
      return {
        ...r,
        compliance: data.compliance,
        observation: data.observation,
        evidenceLocation: data.evidenceLocation ?? '',
      };
    }
    return { ...r, evidenceLocation: '', gapPatterns: [] };
  })
};
