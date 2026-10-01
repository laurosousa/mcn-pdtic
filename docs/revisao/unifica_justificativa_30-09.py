# -*- coding: utf-8 -*-
"""Fila da secao futura, item 1: uniformiza a nomenclatura do campo da MCN com a
adotada no app — 'observacoes' -> 'justificativa' (Secao 4.3, ex-3.6.3).
Unico ponto do documento em que o termo designa o campo de registro: paragrafo
da terceira etapa do protocolo de preenchimento. As demais ocorrencias de
'observacao' sao prosa generica ou anotacoes do segundo avaliador (intactas)."""
import shutil
import sys

from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = r"docs\DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = r"docs\revisao\DISSERTACAO_v6_backup_pre-justificativa-30-09.docx"

shutil.copy2(DOCX, BACKUP)
print("backup:", BACKUP)

doc = Document(DOCX)
VELHO = "classificação (C, CP, NC, NA ou Não Avaliado) e observações."
NOVO = "classificação (C, CP, NC, NA ou Não Avaliado) e justificativa."

alvos = [p for p in doc.paragraphs if VELHO in p.text]
assert len(alvos) == 1, f"esperado 1 paragrafo, achei {len(alvos)}"
p = alvos[0]
idx = p.text.find(VELHO)
start, end = idx, idx + len(VELHO)
pos, done = 0, False
for r in p.runs:
    rt, rs = r.text, pos
    pos = rs + len(rt)
    if pos <= start or rs >= end:
        continue
    before = rt[:max(0, start - rs)]
    after = rt[max(0, min(len(rt), end - rs)):]
    if not done:
        r.text = before + NOVO + after
        done = True
    else:
        r.text = before + after
assert NOVO in p.text and VELHO not in p.text
print("editado:", p.text[:120])

doc.save(DOCX)
print("salvo:", DOCX)

# ---- verificacao ----
doc2 = Document(DOCX)
paras = [p.text for p in doc2.paragraphs]
i_ref = next(i for i, t in enumerate(paras) if t.strip() == "REFERÊNCIAS")
campo = [t for t in paras[:i_ref] if "e justificativa." in t]
assert any("fundamento normativo" in t for t in campo), "alvo ausente"
assert len(campo) == 2, f"esperado 2 (alvo 4.3 + pre-existente cap. 5), achei {len(campo)}"
resto = [t for t in paras[:i_ref] if "observaç" in t.casefold()]
assert len(resto) == 5, f"esperado 5 ocorrencias genericas restantes, achei {len(resto)}"
assert not any("e observações" in t for t in resto)
print("verificacao OK: campo unificado; 5 ocorrencias genericas de 'observacao' intactas")
