# -*- coding: utf-8 -*-
"""Ajuste da Secao 1.4 da Dissertacao v6 (29/09):
1) Par. [147]: "tres niveis" -> "quatro niveis" (alinha texto ao Quadro 1, 4 niveis);
2) Par. [164]: ponto final -> dois-pontos (intro padrao de alineas, como [152]);
3) Par. [165]-[167]: converte lista automatica (List Paragraph + numPr) em alineas
   manuais "a) b) c)" no mesmo padrao de [153]-[155] (Normal, minusculas, "; / ; e / .").
Preserva runs em italico (decoupling). Gera backup antes de salvar.
"""
import shutil
import sys
from docx import Document
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding="utf-8")

DOCX = "DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = "revisao/DISSERTACAO_v6_backup_pre-ajuste-sec14-29-09.docx"

shutil.copy2(DOCX, BACKUP)
print(f"backup: {BACKUP}")

doc = Document(DOCX)
P = doc.paragraphs

# ---- correcao 1: [147] tres -> quatro niveis ----
p147 = P[147]
assert "três níveis" in p147.text, f"[147] texto inesperado: {p147.text[:80]}"
for r in p147.runs:
    if "três níveis" in r.text:
        r.text = r.text.replace("três níveis", "quatro níveis")
        break
assert "quatro níveis" in p147.text
print("[147] ok:", p147.text[:90])

# ---- correcao 2: [164] ponto -> dois-pontos (intro das alineas) ----
p164 = P[164]
for r in p164.runs:
    if r.text.rstrip().endswith("considerações."):
        r.text = r.text.rstrip().rstrip(".") + ":"
        break
assert p164.text.rstrip().endswith(":")
print("[164] ok:", p164.text[-60:])

# ---- correcao 3: [165]-[167] alineas manuais, padrao [153]-[155] ----
ALINEAS = {"a) ": ";", "b) ": "; e", "c) ": "."}
for idx, (marcador, final) in zip((165, 166, 167), ALINEAS.items()):
    p = P[idx]
    assert p._p.pPr is not None
    # remove numeracao automatica
    numpr = p._p.pPr.find(qn("w:numPr"))
    if numpr is not None:
        p._p.pPr.remove(numpr)
    # remove indentacao direta (Normal de [153]-[155] nao tem)
    ind = p._p.pPr.find(qn("w:ind"))
    if ind is not None:
        p._p.pPr.remove(ind)
    # estilo Normal, como [153]-[155]
    p.style = doc.styles["Normal"]
    # marcador no primeiro run
    p.runs[0].text = marcador + p.runs[0].text.lstrip()
    # pontuacao final no ultimo run
    last = p.runs[-1]
    last.text = last.text.rstrip()
    assert last.text.endswith("."), f"[{idx}] fim inesperado: {last.text[-40:]}"
    if final == ".":
        pass  # mantem ponto
    else:
        last.text = last.text[:-1] + final
    print(f"[{idx}] ok: {p.text[:60]} ... {p.text[-30:]}")

doc.save(DOCX)
print("salvo:", DOCX)
