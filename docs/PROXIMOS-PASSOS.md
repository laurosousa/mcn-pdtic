# Próximos passos — MCN-PDTIC (app)

Status do desenvolvimento do app em `artifacts/mcn-pdtic`, alinhado a `docs/REQUISITOS-PTT.md`.
Última atualização: 2026-09-30 (revisão PRISMA 2.1 + referências).

## Dissertação v6 — reestruturação do item A (27/09/2026)

Gerada `docs/DISSERTACAO_atualizada_PTT_v6.docx` a partir da v5
(`docs/revisao/DISSERTACAO_v5_backup_pre-reestrutura-27-09.docx`; pipeline em
`docs/revisao/reestrutura_v6.py` + `postprocess_v6.py`; verificação em `verifica_v6.py`).
Cópia de entrega: `Downloads/DISSERTACAO_atualizada_PTT_v6.docx`.

1. **MCN virou capítulo próprio** (nota do orientador): antiga Seção 3.6 →
   **Capítulo 4 "MATRIZ DE CONFORMIDADE NORMATIVA: APRESENTAÇÃO DO INSTRUMENTO DE
   ANÁLISE"** (4.1–4.4); caps. seguintes renumerados (Resultados→5, PTT→6,
   Considerações→7); 39 referências cruzadas + 6 refs quebradas ("no Seção N") corrigidas;
   gramática "no Capítulo" ajustada.
2. **Quadro 6 novo na Seção 3.2.1** (nota do orientador): categorias de dados extraídos
   dos documentos (instrumento da pesquisa documental). Quadros renumerados pela nova
   ordem de citação (1–20; antigos 9/10 passaram a 7/8; 6/7/8 → 9/10/11; 11–19 → 12–20).
   Apêndice A preservado (numeração interna do PDTIC intocada).
3. **1.4.3 → continuidade de 1.4** (comentário #31): títulos 1.4.3/1.4.3.1 removidos,
   texto integrado ao corpo da seção.
4. **Quadro 5 realinhado aos objetivos** (#133/#134/#135/#136): linhas reescritas
   (removidos "??????" e "Não há"); fonte da linha a) restrita ao Conjunto B
   (SciELO/SPELL/BDTD saíram da coleta — revisão de literatura fica no cap. 2);
   d) com as quatro dimensões; e) marcado como identificação descritiva.
5. **Seção 1.3** (#26/#27): removida a promessa de "fatores explicativos" (pesquisa
   descritiva); "8.000 estudantes" → "mais de 15 mil matrículas de graduação (Inep, 2025)"
   (Censo da Educação Superior 2024: 15.637) + referência INEP inserida.
6. **Seção 3.7 (validação)** (#170): trecho de abertura dispensável removido (#175 já
   respondido no texto — armazenamento em pasta institucional).
7. **Comentários do Word**: 10 marcados como resolvidos (#22, #27, #31, #133–#136, #169,
   #170, #175); #169 atualizado ("Guia + planilha" → "Guia + aplicação web"). `updateFields`
   ativado — o **SUMÁRIO renumera ao abrir no Word** (aceitar a atualização de campos).
   **Abertos por decisão**: #20/#21, #23/#24, #26 (standby do orientador); #176 (exige o
   manual de formatação); #132, #146, #172, #174 (respostas do autor a observações da banca).

### Revisão sistemática e referências (29–30/09/2026)

1. **Triagem real + Figura 1** (29/09, commit 63c6ddc) — quantitativos do fluxograma
   consolidados; nota da Figura 1 remete ao processo consolidado em 29/09/2026.
2. **Correções da 2.1.7 + referências faltantes** (29/09, commit 7d5705c).
3. **Integração das citações da revisão** (30/09, `revisao/integra_citacoes_29-09.py`) —
   5 citações no corpo (Linhares et al. 2026; Paiva; Nunes; Maciel 2021; Cunha 2023 —
   órfã resolvida; Cunha; Freitas 2022; Cardoso et al. 2025; Sengik; Lunardi 2023;
   Schiavi; Behr; Marcolin 2024) + 6 entradas nas Referências; planilha: R10 com DOI
   confirmado via Crossref, R08/R14 anotadas como pendência CI-6.
4. **Auditoria Crossref das 122 referências** (30/09) — 34 verificadas direto na fonte;
   3 "revisar" eram falsos positivos (Creswell 2010, Mintzberg 1979 e Power 1997 são
   livros clássicos; o Crossref só indexa resenhas com o mesmo título).
5. **Datas da Seção 2.1** (30/09, `revisao/ajuste_sec21_refs_30-09.py`) — "outubro a
   dezembro de 2025" → "em 26 e 27 de setembro de 2026" (alinha o texto ao protocolo
   real registrado na aba Buscas da planilha PRISMA).
6. **Referências órfãs removidas** (30/09, `revisao/limpa_orfas_30-09.py`, decisão do
   autor) — 9 entradas sem nenhuma citação no corpo/apêndices (Benbasat 1984; IN
   GSI/PR nº 1/2020; CGU 2022a e 2020; MGI SISP 2024b; Painel SGD/MGI Power BI 2026;
   TCU Referencial básico 2020c; CAPES Documento de Área 2019a; Agência Gov Infovia
   2025): 122 → 113 referências. Sufixos de ano únicos renormalizados (2020a→2020,
   2022b→2022, 2024a→2024, nas entradas e nas 15 citações do corpo) e
   (TCU, 2021) → (TCU, 2021d) — a entrada iGG é "2021d" na sequência BRASIL 2021.
   `updateFields` reativado (SUMÁRIO renumera ao abrir no Word).
7. **Resolução CI-6 de R08/R14** (30/09, `revisao/resolve_r08_r14_30-09.py`) — R08: registro
   corrupto confirmado; o trabalho real é Rezende; Santos; Melo (2006, RAP 40(5), p. 771-788,
   DOI 10.1590/S0034-76122006000500005), fora da janela CI-5; R14: veículo não localizado em
   Crossref/repositórios/web (únicos próximos: Sengik; Portela 2008 SEGET — autores/ano
   incompatíveis — e Sengik; Lunardi 2023, já incluída como R15). Ambas → Excluir na Etapa 2
   (CE-5). **Figura 1 atualizada**: excluídos na elegibilidade 0→2, incluídos 9→7 (7 de busca
   + 5 manuais), Nota → consolidado em 30/09/2026.

### Pendências de dissertação (além do app)

- Uniformizar "observações" → "Justificativa" (agora Seção 4.3, ex-3.6.3).
- Apêndice com o mapeamento dos 50 itens CP/NC aos padrões de lacuna.
- #176: obter do manual o formato da linha "Fonte:" e padronizar.
- Objetivo f) ainda menciona "exportação em planilha eletrônica" (em standby — #23/#24).
- Triagem PRISMA e datas da Seção 2.1 — concluído em 29–30/09/2026 (itens 1 e 5 acima).
- Sufixos de ano no padrão global-BRASIL: iESGo 2024 e as obras de 2011 (Decreto
  7.579; Lei 12.527) citadas por número normativo ficaram sem letra — padronizar na
  revisão com o orientador.
- **Seção 2.1.2 × aba Buscas**: o texto lista CAPES, SPELL e Google Scholar como bases da
  Modalidade 1, mas a aba Buscas só registra Semantic Scholar e SciELO (0 resultados);
  o fluxograma tem box "busca complementar (Google Scholar) (n = 0)" sem registro na
  planilha. Decidir: registrar as buscas manuais (se ocorreram) ou rebaixar essas bases
  a "verificação complementar" no texto.

## Feito (itens 1–10)

1. **Formatação numérica conforme a dissertação** — ICD exibido com 2 casas decimais e vírgula
   (53,85%) em todo o app; escores na escala 0–1 (C = 1,00 · CP = 0,50 · NC = 0,00); valor bruto
   do ICD com 4 casas (0,5385) abaixo do percentual; percentuais da Distribuição com 1 casa
   (27,5%). Escala de conformidade em 5 faixas (Seção 3.6).

2. **Evidência × justificativa separados + regras de decisão** (Seção 3.6.3) — campo
   "Localização da evidência" separado da "Justificativa"; evidência obrigatória para
   "Conforme" (presunção de conformidade); justificativa obrigatória para "Não Aplicável";
   as 3 regras de decisão exibidas na tela de avaliação e no Guia. Migração aditiva do
   `localStorage` preserva avaliações salvas.

3. **Localização da evidência na avaliação UFRR** — os 28 requisitos Conforme da avaliação
   pública 2023-2025 estão com `evidenceLocation` preenchido a partir de
   `docs/avaliacao-mcn-pdtic-ufrr-2023-2025.md` e da conferência do autor no PDTIC
   (O17, G06, E09). ICD de referência mantido: 53,85% (28 C · 28 CP · 22 NC · 2 NA).

4. **ICD por natureza** (Seção 4) — Obrigatório/Recomendado/Complementar no Dashboard, no
   Relatório e na página pública UFRR, com a mesma fórmula e sem peso no ICD geral.
   Valores de referência UFRR: Obrigatório 56,00% · Recomendado 53,49% · Complementar 50,00%.

5. **Padrões de lacuna + relatório priorizado** (Seção 5, itens 6–7) — os 5 padrões do
   Quadro 16 cadastrados; campo multi-valorado "Padrão de lacuna" apenas para itens CP/NC,
   atribuído pelo avaliador (sem dedução automática); relatório agrupa as lacunas por padrão
   (com seção "Sem padrão atribuído"); lacunas priorizadas por natureza (NC antes de CP
   dentro de cada natureza); seção de deliberação do CGD (data, decisão, encaminhamentos,
   responsáveis) com campos salvos junto à avaliação.

6. **Exportar/importar JSON + lista de avaliações com comparação de ciclos** — envelope
   versionado (`mcn-pdtic/avaliacao` v1) com data de exportação, versão da matriz e data de
   corte normativo; exportação no Dashboard e no Relatório; importação sempre como **nova
   entrada** (nunca sobrescreve), com preview, aviso de matriz divergente e migração com a
   mesma tolerância do `loadState`. Storage v2 (`mcn_pdtic_evaluations_v2`) guarda a lista de
   avaliações, com migração automática da v1 (chave antiga preservada como réplica); lista no
   Dashboard com abrir, exportar, duplicar e excluir (com confirmação); comparação de 2–4
   avaliações (ICD geral, por dimensão e por natureza, contagens e metadados) com aviso
   quando as versões da matriz divergirem. "Nova Avaliação" agora cria entrada nova em vez
   de apagar a atual.

7. **Critérios de verificação específicos para os 67 itens com critério genérico (rascunho)** —
   proposta por requisito em `docs/criterios-rascunho.md`, derivada apenas do enunciado,
   dispositivo e fundamento do apêndice canônico, com 24 itens marcados [VERIFICAR].
   Pendente revisão do autor; nada aplicado ao app.

8. **Registro de manutenção da matriz visível no app** — versão (MCN-PDTIC 1.0), corte
   normativo (06/11/2023) e histórico de revisões registrados em
   `MATRIX_MAINTENANCE_REGISTRY` (`src/data/mcn.ts`), com conteúdo derivado exclusivamente
   do apêndice canônico; exibidos no Dashboard (abaixo dos dados da avaliação) e no Guia
   (seção final) pelo componente `MatrixMaintenanceCard`.

9. **Guia alinhado à dissertação (Seção 5.5 e referências)** — incluídas no Guia as 6 etapas
   do procedimento de aplicação e o fluxo do segundo avaliador, com a redação da dissertação
   (`DISSERTACAO_atualizada_PTT_aplicacao_web.docx`); referências corrigidas conforme decisão
   do autor: Guia de PDTIC do SISP **v2.1** (antes v2.0), remoção da IN SGD/ME nº 01/2019 da
   lista de consulta (mantida a IN SGD/ME nº 94/2022) e **Decreto nº 7.579/2011** (antes
   "Decreto nº 10.440/2020") na fundamentação técnica.

10. **Campos do Quadro 6 — caminho A (ficam para a v1.1)** — nenhum campo criado na v1.0;
    entrada "Planejado para a versão 1.1" no registro de manutenção da matriz (Dashboard e
    Guia); conferência no app não encontrou menção a subdimensão, código D.SD.NN ou
    obrigatoriedade binária — a estrutura segue o código por dimensão (N01–G20) e a natureza
    Obrigatório/Recomendado/Complementar.

## Próximo item

Nenhum no app — os 10 itens de `REQUISITOS-PTT.md` estão concluídos.

Próximo passo da dissertação: **redigir o parágrafo de análise do capítulo de resultados
citando Santos et al. (2020)** — modelo de maturidade em governança e gestão de TIC para o
SISP — a partir do mapeamento dos 50 itens CP/NC da MCN aos domínios do modelo
(`docs/Mapeamento_MCN_x_Modelo_SISP.xlsx`; 13 itens fora do modelo, classificados como GAP).

## Ajustes a refletir na dissertação

- **Termo "observações" × "justificativa" (Seção 3.6.3)** — uniformizar a nomenclatura com
  a adotada no app ("Justificativa").
- **Apêndice com o mapeamento dos 50 itens CP/NC aos padrões de lacuna** — documentar a
  atribuição por requisito (cf. pendência abaixo).
- **Localização das evidências dos 28 Conformes no apêndice da UFRR** — incorporar ao
  apêndice as localizações já registradas no app.
- **Aceitar as alterações "planilha → aplicação web"** no texto da dissertação.
- **Referência bibliográfica do Guia de PDTIC do SISP v2.1** — a lista de referências cita
  apenas a v2.0 (BRASIL, 2021c); incluir/atualizar a entrada para a versão 2.1 (30/09/2021),
  adotada pela MCN auditada (Apêndice A) e pelo app.

## Pendências

- **Aceitar no Word as alterações da `DISSERTACAO_atualizada_PTT_v2.docx`** —
  concluído em 25/09/2026.
- **Incluir nas Referências o Guia de PDTIC do SISP v2.1** (menções à v2.0 ajustadas) —
  concluído em 25/09/2026.
- **Organizar as versões antigas da dissertação** — agora estão em
  `docs/versoes-antigas/` — concluído em 25/09/2026.
- **Seções exatas de N09 e E13 no PDTIC** — atualmente a localização da evidência desses
  dois Conformes cita apenas as partes do documento ("Princípios, inventário e plano de
  ações do PDTIC"; "Plano de Transformação Digital e iniciativas de digitalização do
  PDTIC"), pois a fonte não traz número de seção. Pendente conferência no PDTIC para
  precisar as seções.
- **Mapeamento dos 50 itens CP/NC** — concluído em 27/09/2026: registrado em
  `docs/Mapeamento_MCN_x_Modelo_SISP.xlsx` — 50 itens CP/NC da MCN do PDTIC da UFRR
  mapeados aos domínios do modelo de maturidade de Santos et al. (2020) para o SISP,
  com 13 itens classificados como GAP (fora do modelo).
- **Busca bibliográfica complementar da revisão sistemática (PRISMA 2020)** — concluída
  em 27/09/2026: aba Triagem de `docs/Revisao_Sistematica_PRISMA_MCN.xlsx` populada com
  20 registros — 7 brutos do Semantic Scholar (buscas de 26/09; 5 únicos + 2 duplicatas
  internas marcadas, CE-3) e 13 referências suplementares fornecidas já verificadas
  (item 7c, marcadas "fonte suplementar"); linha-exemplo removida; aba Buscas atualizada
  com as buscas de 26/09 e os 3 eixos suplementares de 27/09 (20 identificados ×
  20 lançados — o fluxo fecha). As etapas de triagem (título/resumo e leitura integral)
  ficam em branco para decisão.
- **Tirar os .docx do rastreamento do Git (.gitignore + limpar histórico) antes de
  publicar no GitHub** — concluído em 25/09/2026: repositório privado criado em
  https://github.com/laurosousa/mcn-pdtic, publicado a partir do ramo "publicacao"
  (sem histórico antigo; .docx, `attached_assets/` e `.agents/` no .gitignore).
  O trabalho continua no ramo "publicacao"; o envio é feito com
  `git push github publicacao:main`.
- **Verificar o `api-server` antes de publicar** — o `typecheck` na raiz do monorepo falha
  em `artifacts/api-server` (TS6305: `lib/integrations-anthropic-ai` sem build; erro
  pré-existente, não relacionado ao app). Resolver/buildar a lib antes de publicar.
