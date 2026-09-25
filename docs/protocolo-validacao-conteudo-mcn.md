# Protocolo de validação de conteúdo da MCN-PDTIC

## 1. Alinhamento com a dissertação

- Instrumento: **MCN-PDTIC 1.0 — versão reconciliada (80 requisitos)**.
- Método de validação: painel de especialistas e Índice de Validade de Conteúdo (IVC).
- Painel previsto: 9 a 12 especialistas, distribuídos entre gestores de TIC de IFES da região Norte, profissionais de auditoria/controle e pesquisadores doutores.
- Amostra: 16 requisitos (20% da matriz), estratificados igualmente entre as quatro dimensões.
- Produto da validação: MCN v1.1 refinada, Guia de Aplicação revisado e relatório de validação.

Não será calculado kappa nem realizada inferência de concordância entre codificadores do PDTIC. O acordo relevante nesta etapa é o julgamento de conteúdo dos especialistas, sintetizado pelo IVC.

## 2. Amostra de validação

A amostra abaixo preserva quatro itens por dimensão, contempla requisitos semanticamente próximos e representa as lacunas identificadas na Seção 4:

- Normativa: `N03`, `N04`, `N06`, `N08`;
- Estratégica: `E03`, `E05`, `E17`, `E20`;
- Operacional: `O01`, `O10`, `O13`, `O17`;
- Governança: `G04`, `G09`, `G13`, `G15`.

Os especialistas recebem a mesma versão da MCN, o mesmo guia, as definições dos critérios e um formulário individual. As respostas de um participante não são mostradas aos demais durante a coleta.

## 3. Critérios de julgamento

Cada requisito é avaliado em escala de quatro pontos:

Critérios técnico-instrumentais:

1. **Clareza**: a redação é compreensível e inequívoca.
2. **Relevância**: o requisito é pertinente à avaliação documental de PDTICs.
3. **Abrangência**: o requisito contribui para cobrir aspectos essenciais da dimensão.
4. **Aplicabilidade técnica**: o requisito pode ser verificado em documentos reais.

Critérios programático-institucionais da CAPES:

5. **Aderência ao programa**: coerência com a Administração Pública e os objetivos do PROFIAP.
6. **Impacto**: potencial de transformação institucional decorrente da aplicação do requisito.
7. **Aplicabilidade/reprodutibilidade**: viabilidade de replicação em outras IFES integrantes do SISP.
8. **Inovação/complexidade**: caráter inovador da formulação diante dos instrumentos existentes.

Escala: 1 = inadequado; 2 = parcialmente adequado; 3 = adequado; 4 = totalmente adequado.

O IVC de cada critério e item é a proporção de especialistas que atribuem 3 ou 4. O relatório também apresenta o IVC médio por dimensão e o IVC global de cada critério.

Critérios prévios:

- IVC por item e critério >= 0,78: aceito;
- IVC global >= 0,80: aceito;
- valor abaixo do limiar: reformular com base nas justificativas qualitativas ou excluir quando a inadequação for estrutural.

Contribuições abertas são analisadas tematicamente. Toda alteração registra item, redação anterior, redação nova, motivo e decisão, sem apagar a versão 1.0.

## 4. Contribuição da Seção 4 para a MCN

A Seção 4 aplica COBIT 2019, iESGo e iGOVSISP ao PDTIC da UFRR e demonstra que cada framework captura apenas parte do conteúdo necessário. A convergência de sete insuficiências fundamenta analiticamente a necessidade de uma matriz integrada:

| Insuficiência identificada | Dimensão da MCN | Resposta da MCN |
|---|---|---|
| planejamento orçamentário não vinculado às ações | Operacional | custos, orçamento e vínculo entre ações e recursos |
| vocabulário sem instância colegiada | Governança | constituição, composição e deliberação do CGD |
| legitimidade da liderança não demonstrada | Governança | aprovação formal, competências e responsabilidades |
| ausência de referência a integridade | Governança | controle, prestação de contas e mecanismos institucionais |
| ausência de estratégia de governança de dados | Operacional/Governança | dados, privacidade, segurança e execução documentada |
| plano de contratações pouco detalhado | Normativa/Operacional | integração ao PCA e correspondência entre ações e contratações |
| interoperabilidade federal não referenciada | Estratégica | alinhamento à EGD, serviços digitais e integração institucional |

Essa seção contribui de quatro maneiras:

1. **justifica a existência da MCN**, pois nenhum framework isolado cobre o objeto;
2. **sustenta as quatro dimensões**, relacionando lacunas observadas a campos avaliativos;
3. **orienta a abrangência dos requisitos**, especialmente governança colegiada, orçamento, dados, contratações e interoperabilidade;
4. **delimita a generalização**, que é analítica e replicável, não estatística para todas as IFES.

A Seção 4 não substitui a base normativa de cada requisito, não calcula o ICD e não comprova validade de conteúdo. A derivação normativa vem da Seção 2.5 e da matriz de rastreabilidade; a validade de conteúdo depende do painel da Seção 3.8.

## 5. Arquivos e execução

- Formulário: `docs/modelos/validacao-conteudo-amostra-16-itens.csv`;
- Cálculo: `node scripts/calcular-validacao-conteudo.mjs <arquivo-preenchido.csv>`.

O script exige os 16 itens e dimensões congelados, uma resposta por especialista/item e notas válidas nos oito critérios. Os perfis são valores canônicos:

- `Gestor de TIC de IFES da região Norte`;
- `Profissional de auditoria e controle em governança de TIC`;
- `Pesquisador doutor em área correlata`.

Cada perfil deve conter de 3 a 4 especialistas distintos, totalizando 9 a 12 participantes.

## 6. Texto-base para a dissertação

> A MCN-PDTIC foi submetida à validação de conteúdo por [n] especialistas, com [n] gestores de TIC de IFES da região Norte, [n] profissionais de auditoria e controle e [n] pesquisadores doutores. Cada participante avaliou uma amostra estratificada de 16 requisitos quanto a clareza, relevância, abrangência, aplicabilidade técnica, aderência ao PROFIAP, impacto, aplicabilidade/reprodutibilidade e inovação/complexidade, em escala de quatro pontos. Os IVC globais foram [valores]. Os itens [IDs] apresentaram valores abaixo do limiar de 0,78 e foram [reformulados/excluídos] na versão 1.1. As contribuições qualitativas foram analisadas tematicamente e registradas no histórico de revisão.

Substituir os campos entre colchetes apenas depois da coleta real.