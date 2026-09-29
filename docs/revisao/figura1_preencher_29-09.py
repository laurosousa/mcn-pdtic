# -*- coding: utf-8 -*-
"""Preenche a Figura 1 (fluxograma PRISMA, Tabela 2) do docx v6 com os numeros
reais consolidados da triagem de 29/09 (planilha Revisao_Sistematica_PRISMA_MCN.xlsx,
decisoes validadas pelo pesquisador) e atualiza a Nota do paragrafo [241].

Mudancas nos boxes:
- Fase 1: bases (só Semantic Scholar gerou registros) n=7; Scholar n=0;
  busca assistida por IA pos-verificacao n=13; literatura cinzenta n=0; total n=20.
- Fase 1 direita: duplicatas n=2.
- Fase 2: triados n=18; excluidos n=4 (fuga tematica, CI-1).
- Fase 3: avaliados na integra n=14; excluidos n=0 (sem motivos a listar).
- Fase 4: estudos incluidos n=9 (busca); acrescidos manuais CI-5 n=5 (seminais
  registradas no fluxo); demais classicos/normativos atribuidos a etapa
  exploratoria, fora do fluxo (aprovação do pesquisador)."""
import shutil
import sys

from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = "DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = "revisao/DISSERTACAO_v6_backup_pre-figura1-29-09.docx"

shutil.copy2(DOCX, BACKUP)
print(f"backup: {BACKUP}")

doc = Document(DOCX)
tbl = doc.tables[2]


def set_para_texto(para, novo):
    """Reescreve o paragrafo preservando a formatacao do primeiro run."""
    if not para.runs:
        para.add_run(novo)
        return
    para.runs[0].text = novo
    for r in para.runs[1:]:
        r.text = ""


# (linha, col, indice_paragrafo, texto esperado parcial, novo texto)
EDITAS = [
    (1, 0, 0, "bases de dados",
     "Registros identificados em bases de dados — Semantic Scholar (n = 7)"),
    (1, 0, 1, "Google Scholar",
     "Registros identificados por busca complementar (Google Scholar) (n = 0)"),
    (1, 0, 2, "busca assistida por IA",
     "Registros identificados por busca assistida por IA, após verificação nas fontes primárias (n = 13)"),
    (1, 0, 3, "literatura cinzenta",
     "Registros identificados em fontes institucionais e literatura cinzenta (n = 0)"),
    (1, 0, 4, "Total de registros identificados",
     "Total de registros identificados (n = 20)"),
    (1, 1, 0, "Duplicatas removidas",
     "Duplicatas removidas (n = 2)"),
    (3, 0, 0, "Registros triados",
     "Registros triados por título e resumo (n = 18)"),
    (3, 1, 0, "Registros excluídos na triagem",
     "Registros excluídos na triagem, por não atenderem aos critérios de inclusão (n = 4; fuga temática, CI-1)"),
    (5, 0, 0, "Textos completos avaliados",
     "Textos completos avaliados para elegibilidade (n = 14)"),
    (5, 1, 0, "Textos completos excluídos",
     "Textos completos excluídos, com justificativa (n = 0)"),
    (5, 1, 1, "Motivos:",
     "Não houve exclusões nesta fase: os 14 textos completos foram incorporados à síntese."),
    (7, 0, 0, "Estudos incluídos na síntese",
     "Estudos incluídos na síntese qualitativa (n = 9)"),
    (7, 1, 0, "Acrescidos, por busca manual",
     "Acrescidos, por busca manual (CI-5): obras clássicas e seminais registradas no fluxo (n = 5). "
     "As demais obras seminais e os documentos normativos e institucionais compõem o referencial "
     "por meio da etapa exploratória, externa a este fluxo."),
]

for linha, col, pi, esperado, novo in EDITAS:
    para = tbl.rows[linha].cells[col].paragraphs[pi]
    atual = para.text
    assert esperado.lower() in atual.lower(), f"R{linha}C{col}P{pi}: esperado '{esperado}' em {atual[:60]!r}"
    set_para_texto(para, novo)
    print(f"R{linha}C{col}P{pi} ok: {novo[:70]}")

# ---- Nota [241]: de 'em consolidacao' para consolidado ----
alvo = None
for p in doc.paragraphs:
    if "encontram-se em consolidação" in p.text:
        alvo = p
        break
assert alvo is not None, "Nota da Figura 1 nao encontrada"
NOVA_NOTA = ("Nota: os quantitativos das quatro fases refletem o processo de seleção consolidado em "
             "29/09/2026, documentado na planilha da revisão sistemática (protocolo PRISMA 2020), "
             "referida na Seção 2.1.7.")
set_para_texto(alvo, NOVA_NOTA)
print("nota ok:", NOVA_NOTA[:70])

doc.save(DOCX)
print("salvo:", DOCX)

# ---- verificacao ----
doc2 = Document(DOCX)
t2 = doc2.tables[2]
assert "(n = 20)" in t2.rows[1].cells[0].paragraphs[4].text
assert "(n = 9)" in t2.rows[7].cells[0].paragraphs[0].text
assert "(n = 5)" in t2.rows[7].cells[1].paragraphs[0].text
resto = [t for t in [p.text for r in t2.rows for c in r.cells for p in c.paragraphs] if "___" in t]
assert not resto, f"placeholders restantes: {resto}"
print("verificacao OK: nenhum placeholder '___' restante")
