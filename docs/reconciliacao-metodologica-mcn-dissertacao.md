# Reconciliação metodológica entre a MCN-PDTIC, o software e a dissertação

## 1. Finalidade e corpus desta reconciliação

Este documento registra as decisões necessárias para que a matriz implementada no software e a metodologia descrita na dissertação representem o mesmo instrumento antes da avaliação empírica do PDTIC UFRR 2023–2025.

Foram confrontados:

- a versão em andamento da dissertação;
- a Portaria Normativa nº 030/2023 e o PDTIC UFRR 2023–2025;
- a matriz de 80 requisitos implementada no software.

Esta análise é metodológica e documental. Ela não substitui parecer jurídico sobre vigência, hierarquia ou incidência de cada norma citada.

O inventário normativo auditado e a tabela canônica dos 80 itens estão em
[`docs/apendice-canonico-mcn-pdtic.md`](apendice-canonico-mcn-pdtic.md). A
revisão foi feita documentalmente, a partir dos quatro pareceres de pesquisa
em `.agents/tmp-*-research.md`, sem se apresentar como parecer jurídico
formal.

## 2. Versão canônica adotada no software

A versão operacional passa a ser identificada como **MCN-PDTIC 1.0 — versão auditada**, com:

- 80 requisitos;
- códigos `N01–N20`, `E01–E20`, `O01–O20` e `G01–G20`;
- 20 requisitos em cada dimensão;
- classificação analítica em Obrigatório, Recomendado e Complementar, sem ponderação;
- escala Conforme, Conforme Parcial, Não Conforme, Não Aplicável e Não Avaliado;
- escopo estritamente documental;
- data de corte normativa registrada na avaliação.

A dissertação ainda informa 15 requisitos normativos, 15 estratégicos, 28 operacionais e 22 de governança. Como o material recebido não contém uma lista de apêndice suficiente para reconstruir e validar item a item essa distribuição alternativa, não houve redistribuição arbitrária. Para a versão atual do produto, a dissertação deve ser atualizada para a lista canônica acima. Caso o apêndice consolidado venha a demonstrar outra matriz validada, será necessária uma nova decisão de versão e uma tabela de correspondência completa.

## 3. Escala e fórmula reconciliadas

| Resultado | Score | Tratamento |
|---|---:|---|
| Conforme | 1,00 | Integra numerador e denominador |
| Conforme Parcial | 0,50 | Integra numerador e denominador |
| Não Conforme | 0,00 | Integra o denominador |
| Não Aplicável | — | Excluído do denominador, com justificativa obrigatória |
| Não Avaliado | — | Excluído do cálculo, mas indica avaliação incompleta |

O Índice de Conformidade Documental é:

`ICD = soma dos scores / número de requisitos aplicáveis avaliados`

Não são utilizados pesos 3, 2 e 1. A classificação Obrigatório/Recomendado/Complementar permanece disponível para análise qualitativa, mas não altera o índice.

## 4. Regra temporal

Para a avaliação originária do PDTIC UFRR 2023–2025, a data de corte recomendada é **06/11/2023**, data de sua aprovação.

Uma norma, política ou estratégia posterior não deve produzir não conformidade retroativa. O requisito deve ser marcado como Não Aplicável, com indicação da superveniência, ou ser tratado em análise separada de aderência normativa atual.

A data de manutenção documental atual da matriz é **15/09/2026**. Ela registra
atos supervenientes apenas para a análise de aderência atual; a avaliação
histórica permanece congelada em **06/11/2023** e não recebe efeitos
retroativos.

Exemplo: o requisito referente ao PBIA 2024–2028 é superveniente à aprovação do PDTIC e, na avaliação originária, deve ser Não Aplicável com justificativa.

## 5. Escopo documental e evidência

Os enunciados devem verificar se o PDTIC **contém, descreve ou referencia** evidência. Não devem afirmar diretamente que um comitê funciona, que um canal opera, que controles são efetivos ou que ações foram executadas.

O corpus deve ser definido antes da codificação. A inclusão de atas, PDI, PCA, portarias, políticas e relatórios somente é válida quando esses documentos:

1. foram previamente definidos como parte do corpus; ou
2. são expressamente referenciados pelo PDTIC e sua consulta está prevista no protocolo.

A ausência de termos em uma busca automática não equivale, sozinha, a Não Conforme. A busca serve apenas como apoio à localização de trechos e exige julgamento documental do avaliador.

## 6. Sobreposições e critérios de distinção

Foram identificados grupos com proximidade semântica. Eles foram mantidos para preservar os 80 itens, mas receberam critérios de verificação destinados a evitar dupla contagem:

- `N08`, `E03` e `E19`: referência à EGD, vínculo substantivo e identificação do ato aplicável;
- `N12`, `E02` e `E05`: declaração de alinhamento ao PDI, correspondência entre objetivos e desdobramento estratégico;
- `N04`, `N11` e `G09`: existência da publicação, facilidade de acesso e transparência/formato aberto;
- `N03`, `N17`, `N20` e `G04`: deliberação do CGD, assinatura da autoridade, ato de instituição e evidência do processo deliberativo;
- `N06`, `O10` e `G15`: integração declarada ao PCA, correspondência entre ações e contratações e governança dessa integração;
- `N10` e `G13`: diretrizes gerais de LGPD e controles documentados de governança de dados pessoais.

Na dissertação, o apêndice da matriz deve incluir uma coluna “Critério de verificação documental” e, quando necessário, “Requisitos relacionados”.

## 7. Alterações requeridas na dissertação

### Seção 3.6 — Construção e estrutura da matriz

- declarar a versão canônica e anexar a lista completa dos 80 requisitos;
- atualizar a distribuição para 20/20/20/20 ou, se outra distribuição for posteriormente validada, versionar a nova lista e apresentar correspondência item a item;
- adotar os mesmos códigos exibidos no software;
- explicitar que a classificação normativa é metadado e não peso;
- incluir critério observável, fonte, regra temporal e relação com itens próximos.

### Seção 3.7 — Protocolo de aplicação

- definir previamente o corpus documental;
- registrar a data de corte normativa;
- distinguir busca automatizada de julgamento do avaliador;
- exigir justificativa para Não Aplicável;
- impedir que Não Avaliado seja confundido com Não Aplicável;

### Seção 3.6.3 — Escala e cálculo

- usar os cinco estados reconciliados;
- substituir qualquer média ponderada pela média simples 1/0,5/0;
- indicar explicitamente numerador e denominador;
- informar que itens Não Aplicáveis e Não Avaliados não entram no índice;
- reportar separadamente quantidade de itens Não Aplicáveis e progresso da avaliação.

### Seção 3.8 — Validação do Produto Técnico-Tecnológico

- limitar a inferência à conformidade documental;
- declarar que o ICD não mede execução, maturidade ou efetividade;
- submeter a matriz a revisão jurídica especializada quanto à vigência e incidência das fontes;
- realizar validação de conteúdo, por IVC, com 9 a 12 especialistas sobre amostra estratificada de 16 itens;
- avaliar os quatro critérios técnico-instrumentais (clareza, relevância, abrangência e aplicabilidade) e os quatro programático-institucionais (aderência ao programa, impacto, aplicabilidade/reprodutibilidade e inovação/complexidade);
- garantir de 3 a 4 especialistas em cada perfil previsto, totalizando 9 a 12 participantes;
- não incluir kappa ou dupla codificação, pois não integram o delineamento atual.

### Apêndices

- substituir versões divergentes por uma única tabela canônica;
- apontar para o [`Apêndice canônico MCN-PDTIC`](apendice-canonico-mcn-pdtic.md), que contém os mesmos 80 IDs e a rastreabilidade normativa auditada;
- incluir versão, data de corte de manutenção da matriz e histórico de revisão;
- adicionar critérios de verificação e requisitos relacionados;
- apresentar protocolo de codificação e exemplos de Conforme, Conforme Parcial, Não Conforme e Não Aplicável.

## 8. Validade das fontes normativas

As referências existentes devem passar por revisão jurídica antes da defesa e da aplicação definitiva. Em especial, devem ser conferidos:

- número, ementa, órgão emissor, vigência e redação aplicável na data de corte;
- distinção entre norma cogente, orientação técnica, referencial de boas práticas e norma voltada a contratação, execução ou governança;
- incidência específica sobre IFES e sobre o conteúdo obrigatório de um PDTIC;
- atualizações, revogações e atos supervenientes.

Até essa revisão, a MCN não deve apresentar a categoria “Obrigatório” como conclusão jurídica definitiva apenas por associação temática com uma norma. A auditoria incorporada no apêndice é uma revisão documental metodológica, não um parecer jurídico formal.

## 9. Registro para a avaliação empírica

Antes de iniciar a codificação do PDTIC UFRR 2023–2025, devem ser congelados:

1. a versão da matriz;
2. a lista dos 80 requisitos;
3. a data de corte de 06/11/2023;
4. o corpus documental;
5. o protocolo de decisão;
6. a regra de tratamento de normas supervenientes;
7. o formulário de justificativa de Não Aplicável.

Qualquer alteração posterior deve gerar nova versão e ser relatada como limitação ou mudança de protocolo.

## 10. Protocolo de validação de conteúdo

O procedimento prévio, a amostra estratificada, os limiares, o formulário e o cálculo reproduzível estão definidos em `docs/protocolo-validacao-conteudo-mcn.md`.

O repositório não contém, até esta versão, pareceres completos do painel. Portanto, não se afirma validade de conteúdo antes da coleta. Os resultados devem ser incorporados à dissertação somente após o preenchimento dos instrumentos, preservando as respostas originais e o histórico de revisão.

## 11. Contribuição da Seção 4

A aplicação comparativa de COBIT 2019, iESGo e iGOVSISP ao PDTIC da UFRR demonstra lacunas convergentes em orçamento, governança colegiada, legitimidade, integridade, dados, contratações e interoperabilidade. Essa convergência:

- justifica a necessidade de uma matriz integrada;
- fundamenta analiticamente a cobertura das quatro dimensões;
- orienta a inclusão e a abrangência de grupos de requisitos;
- sustenta generalização analítica e replicabilidade, não generalização estatística.

A Seção 4 não substitui a fonte normativa dos itens nem a validação por especialistas. A ancoragem de cada requisito continua dependendo da Seção 2.5 e da matriz de rastreabilidade; a validade de conteúdo depende do IVC previsto na Seção 3.8.