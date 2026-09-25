# Próximos passos — MCN-PDTIC (app)

Status do desenvolvimento do app em `artifacts/mcn-pdtic`, alinhado a `docs/REQUISITOS-PTT.md`.
Última atualização: 2026-09-25.

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

Nenhum — os 10 itens de `REQUISITOS-PTT.md` estão concluídos; seguem os ajustes à
dissertação e as pendências.

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
- **Mapeamento dos 50 itens CP/NC da UFRR aos padrões de lacuna** — o Quadro 16 da
  dissertação define os 5 padrões, mas nenhum doc registra a atribuição por requisito;
  o app deixa a atribuição para o avaliador. Preencher o mapeamento oficial do caso UFRR
  (diretamente na avaliação ou na página pública) quando o autor o fornecer.
- **Tirar os .docx do rastreamento do Git (.gitignore + limpar histórico) antes de
  publicar no GitHub**.
- **Verificar o `api-server` antes de publicar** — o `typecheck` na raiz do monorepo falha
  em `artifacts/api-server` (TS6305: `lib/integrations-anthropic-ai` sem build; erro
  pré-existente, não relacionado ao app). Resolver/buildar a lib antes de publicar.
