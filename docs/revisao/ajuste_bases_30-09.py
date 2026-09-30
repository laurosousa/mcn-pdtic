# -*- coding: utf-8 -*-
"""Ajuste 30/09 (decisao do autor): rebaixa CAPES, SPELL e Google Scholar no texto
da Secao 2.1.2 — deixam de ser "busca primaria" (o protocolo da aba Buscas so
registra Semantic Scholar e SciELO) e passam a consulta complementar de
verificacao. Atualiza as alineas a)-c), o Quadro 2 e o box do Scholar na Figura 1."""
import shutil
import sys

from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = r"docs\DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = r"docs\revisao\DISSERTACAO_v6_backup_pre-bases-30-09.docx"

shutil.copy2(DOCX, BACKUP)
print("backup:", BACKUP)

doc = Document(DOCX)


def set_para_texto(para, novo):
    if not para.runs:
        para.add_run(novo)
        return
    para.runs[0].text = novo
    for r in para.runs[1:]:
        r.text = ""


# ---- 1) alineas da Secao 2.1.2 ----
SCILO = ("b) SciELO — Scientific Electronic Library Online — produção científica "
         "latino-americana em Administração Pública, Gestão Universitária e Sistemas de "
         "Informação;")
COMPL = ("c) Portal de Periódicos CAPES (www.periodicos.capes.gov.br), SPELL "
         "(www.spell.org.br) e Google Scholar — consultados de forma complementar, para "
         "verificação de citações, confirmação de metadados e identificação de literatura "
         "cinzenta indexada, sem constituírem buscas sistemáticas registradas no fluxo da "
         "revisão;")

paras = doc.paragraphs
p_cap = next(p for p in paras if p.text.strip().startswith("b) Portal de Periódicos CAPES"))
p_sci = next(p for p in paras if p.text.strip().startswith("c) SciELO"))
p_spe = next(p for p in paras if p.text.strip().startswith("d) SPELL"))
p_sch = next(p for p in paras if p.text.strip().startswith("e) Google Scholar"))

set_para_texto(p_cap, SCILO)   # b) vira SciELO
set_para_texto(p_sci, COMPL)   # c) vira combinada
for p in (p_spe, p_sch):       # d) e e) removidas (conteudo fundido na c)
    p._element.getparent().remove(p._element)
print("alineas: a) Semantic Scholar | b) SciELO | c) CAPES+SPELL+Scholar (complementar); d/e removidas")

# ---- 2) Quadro 2 (tables[1]) ----
q2 = doc.tables[1]
assert q2.rows[0].cells[0].text.strip().startswith("Categoria PRISMA 2020")
set_para_texto(q2.rows[1].cells[1].paragraphs[0], "Semantic Scholar e SciELO")
set_para_texto(q2.rows[2].cells[1].paragraphs[0],
               "Portal CAPES, SPELL e Google Scholar (consulta complementar)")
set_para_texto(q2.rows[2].cells[2].paragraphs[0],
               "Verificação de citações e metadados — sem buscas sistemáticas "
               "registradas (nenhum registro adicional no fluxo)")
print("quadro 2: bases de busca primaria = Semantic Scholar e SciELO; demais complementares")

# ---- 3) Figura 1: box de busca complementar ----
f1 = doc.tables[2]
box = f1.rows[1].cells[0].paragraphs[1]
assert "busca complementar" in box.text and "(n = 0)" in box.text, box.text[:80]
set_para_texto(box,
               "Registros adicionais por consulta complementar (Portal CAPES, SPELL e "
               "Google Scholar) (n = 0)")
print("figura 1: box de consulta complementar reescrito")

doc.save(DOCX)
print("salvo:", DOCX)

# ---- 4) verificacao ----
doc2 = Document(DOCX)
ts = [p.text.strip() for p in doc2.paragraphs if p.text.strip()]
al = [t for t in ts if t[:2] in ("a)", "b)", "c)", "d)", "e)")
      and ("Semantic" in t or "SciELO" in t or "CAPES" in t or "SPELL" in t or "Scholar" in t)]
assert len(al) == 3, f"esperado 3 alineas, achei {len(al)}: {[a[:30] for a in al]}"
assert al[0].startswith("a) Semantic") and al[1].startswith("b) SciELO") and al[2].startswith("c) Portal")
assert not any(t.startswith(("d) SPELL", "e) Google")) for t in ts)
q = doc2.tables[1]
assert q.rows[1].cells[1].text.strip() == "Semantic Scholar e SciELO"
b = doc2.tables[2].rows[1].cells[0].paragraphs[1].text
assert "consulta complementar" in b and "(n = 0)" in b
texto = "\n".join(ts)
assert "constituiu a base de dados central desta revisão" in texto  # a) intacto
print("verificacao OK: 3 alineas a-c, Quadro 2 e Figura 1 alinhados")
