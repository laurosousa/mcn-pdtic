# -*- coding: utf-8 -*-
"""Resolve a pendencia CI-6 de R08 e R14 (verificacao 30/09, decisao do autor):
R08 = registro corrupto; trabalho real e REZENDE; SANTOS; MELO (2006, RAP 40(5),
771-788, DOI 10.1590/S0034-76122006000500005), fora da janela CI-5 -> Excluir.
R14 = veiculo nao localizado em Crossref/repositorios/web -> Excluir.
Ambas: CE-5 (referencia de IA nao confirmada na fonte primaria).
Reflete na Figura 1: excluidos na elegibilidade 0 -> 2; incluidos 9 -> 7;
Nota passa a consolidado 30/09/2026."""
import shutil
import sys

import openpyxl
from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

XLSX = r"docs\Revisao_Sistematica_PRISMA_MCN.xlsx"
XLSX_BAK = r"docs\revisao\Revisao_Sistematica_PRISMA_MCN_backup_pre-r08r14-30-09.xlsx"
DOCX = r"docs\DISSERTACAO_atualizada_PTT_v6.docx"
DOCX_BAK = r"docs\revisao\DISSERTACAO_v6_backup_pre-figura1-30-09.docx"

# ---- 1) planilha ----
shutil.copy2(XLSX, XLSX_BAK)
print("backup:", XLSX_BAK)
wb = openpyxl.load_workbook(XLSX)
t = wb["Triagem"]
linhas = {t.cell(r, 1).value: r for r in range(2, t.max_row + 1)}

MOTIVO = "Referencia de IA nao confirmada na fonte primaria (CE-5)"
RESOLUCOES = {
    "R08": (" | Resolucao 30/09/2026: registro corrupto confirmado — o trabalho real "
            "correspondente e REZENDE; SANTOS; MELO, O isomorfismo em acao: mudanca e "
            "continuidade na pratica da gestao publica, RAP v. 40, n. 5, p. 771-788, 2006, "
            "DOI 10.1590/S0034-76122006000500005 (SciELO); fora da janela 2017-2026 e fora "
            "da lista de classicos do CI-5. Excluida (CE-5)."),
    "R14": (" | Resolucao 30/09/2026: veiculo nao localizado em Crossref, repositorios "
            "institucionais e busca web; unicos trabalhos proximos: Sengik; Portela (2008, "
            "SEGET, autores/ano incompativeis) e Sengik; Lunardi (2023, IJSTM, ja incluido "
            "como R15). Registro nao confirmado — excluida (CE-5)."),
}
for rid, (et2_old, ) in {"R08": ("Incluir",), "R14": ("Incluir",)}.items():
    r = linhas[rid]
    assert t.cell(r, 11).value == et2_old, f"{rid}: Etapa 2 inesperada"
    t.cell(r, 11, value="Excluir")
    t.cell(r, 12, value=MOTIVO)
    obs = str(t.cell(r, 13).value or "")
    resolucao = RESOLUCOES[rid]
    assert "Resolucao 30/09" not in obs, f"{rid}: ja resolvida"
    t.cell(r, 13, value=obs + resolucao)
    print(f"{rid}: Etapa 2 Incluir -> Excluir (CE-5); observacao anexada ({len(resolucao)} chars)")
wb.save(XLSX)
print("salvo:", XLSX)

# ---- 2) Figura 1 no docx ----
shutil.copy2(DOCX, DOCX_BAK)
print("backup:", DOCX_BAK)
doc = Document(DOCX)
tbl = doc.tables[2]


def set_para_texto(para, novo):
    if not para.runs:
        para.add_run(novo)
        return
    para.runs[0].text = novo
    for r in para.runs[1:]:
        r.text = ""


EDITAS = [
    (5, 1, 0, "n = 0",
     "Textos completos excluídos, com justificativa (n = 2; referências de busca assistida "
     "por IA não confirmadas nas fontes primárias, CE-5)"),
    (5, 1, 1, "Não houve exclusões",
     "Duas referências sugeridas por busca assistida por IA não confirmadas nas fontes "
     "primárias (CE-5); nenhuma outra exclusão nesta fase."),
    (7, 0, 0, "n = 9",
     "Estudos incluídos na síntese qualitativa (n = 7)"),
]
for linha, col, pi, esperado, novo in EDITAS:
    para = tbl.rows[linha].cells[col].paragraphs[pi]
    assert esperado.lower() in para.text.lower(), f"R{linha}C{col}P{pi}: '{esperado}' nao em {para.text[:60]!r}"
    set_para_texto(para, novo)
    print(f"R{linha}C{col}P{pi} ok: {novo[:70]}")

# Nota [241]: 29/09 -> 30/09
alvo = next(p for p in doc.paragraphs if "consolidado em 29/09/2026" in p.text)
set_para_texto(alvo, alvo.text.replace("consolidado em 29/09/2026", "consolidado em 30/09/2026"))
print("nota ok:", alvo.text[:90])

doc.save(DOCX)
print("salvo:", DOCX)

# ---- 3) verificacao ----
wb2 = openpyxl.load_workbook(XLSX)
t2 = wb2["Triagem"]
for rid in ("R08", "R14"):
    r = {t2.cell(i, 1).value: i for i in range(2, t2.max_row + 1)}[rid]
    assert t2.cell(r, 11).value == "Excluir" and t2.cell(r, 12).value == MOTIVO
e2_inc = sum(1 for i in range(2, t2.max_row + 1) if t2.cell(i, 11).value == "Incluir")
assert e2_inc == 12, f"incluidos esperados 12 (7 busca + 5 seminais), achei {e2_inc}"
doc2 = Document(DOCX)
tb2 = doc2.tables[2]
assert "(n = 7)" in tb2.rows[7].cells[0].paragraphs[0].text
assert "(n = 2" in tb2.rows[5].cells[1].paragraphs[0].text
assert "(n = 5)" in tb2.rows[7].cells[1].paragraphs[0].text
texto = "\n".join(p.text for p in doc2.paragraphs)
assert "consolidado em 30/09/2026" in texto and "consolidado em 29/09/2026" not in texto
assert "n = 9" not in texto
print("verificacao OK: planilha (12 incluidos) + Figura 1 (7/2/5) + nota 30/09")
