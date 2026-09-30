# -*- coding: utf-8 -*-
"""Ajuste 30/09: (1) datas das buscas da Secao 2.1 alinhadas ao protocolo real
(planilha PRISMA: 26-27/09/2026, nao 'outubro a dezembro de 2025');
(2) remocao das referencias orfas BENBASAT (1984) e BRASIL IN GSI/PR 1/2020
(2020b) — nao citadas no corpo desde a v5 (auditacao Crossref de 30/09)."""
import shutil
import sys

from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = r"docs\DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = r"docs\revisao\DISSERTACAO_v6_backup_pre-ajuste-sec21-30-09.docx"

shutil.copy2(DOCX, BACKUP)
print("backup:", BACKUP)

doc = Document(DOCX)


def replace_in_paragraph(p, old, new):
    """Substitui `old` por `new` preservando a formatacao dos runs."""
    runs = p.runs
    full = "".join(r.text for r in runs)
    idx = full.find(old)
    if idx < 0:
        return None
    start, end = idx, idx + len(old)
    pos, done = 0, False
    for r in runs:
        rt = r.text
        rs, r_end = pos, pos + len(rt)
        pos = r_end
        if r_end <= start or rs >= end:
            continue
        before = rt[:max(0, start - rs)]
        after = rt[max(0, min(len(rt), end - rs)):]
        if not done:
            r.text = before + new + after
            done = True
        else:
            r.text = before + after
    return full


# ---- 1) datas da Secao 2.1 ----
VELHO = "no período de outubro a dezembro de 2025"
NOVO = "em 26 e 27 de setembro de 2026"
alvos = [p for p in doc.paragraphs if VELHO in p.text]
assert len(alvos) == 1, f"esperado 1 paragrafo com datas, achei {len(alvos)}"
antes = replace_in_paragraph(alvos[0], VELHO, NOVO)
print(f"datas: '{antes[:80]}' -> '{alvos[0].text[:80]}'")

# varredura: nenhum outro resquicio do periodo ficticio
resq = [p.text[:80] for p in doc.paragraphs
        if "outubro a dezembro de 2025" in p.text or "dezembro de 2025," in p.text]
assert not resq, f"resquicios de data: {resq}"
print("sem resquicios de data")

# ---- 2) referencias orfas ----
ORFAS = [
    "BENBASAT, I. An analysis of research methodologies.",
    "BRASIL. Gabinete de Segurança Institucional. Instrução Normativa GSI/PR",
]
for prefixo in ORFAS:
    hits = [p for p in doc.paragraphs if p.text.strip().startswith(prefixo)]
    assert len(hits) == 1, f"'{prefixo[:40]}': {len(hits)} paragrafos (esperado 1)"
    el = hits[0]._element
    el.getparent().remove(el)
    print(f"ref removida: {prefixo[:60]}")

doc.save(DOCX)
print("salvo:", DOCX)

# ---- 3) verificacao ----
doc2 = Document(DOCX)
paras = [p.text.strip() for p in doc2.paragraphs if p.text.strip()]
i_ref = next(i for i, t in enumerate(paras) if t == "REFERÊNCIAS")
i_fim = next(i for i in range(i_ref + 1, len(paras))
             if paras[i].isupper() and len(paras[i]) > 8)
refs = paras[i_ref + 1:i_fim]
assert len(refs) == 120, f"esperado 120 refs, achei {len(refs)}"
assert not any(t.startswith(("BENBASAT", "BRASIL. Gabinete")) for t in refs)
assert any("em 26 e 27 de setembro de 2026" in t for t in paras)
# vizinhas intactas (ordem alfabetica preservada nos cortes)
i_ben = next(i for i, t in enumerate(refs) if t.startswith("BECKER"))
i_gs = next(i for i, t in enumerate(refs) if t.startswith("BRASIL. Instrução Normativa SGD/ME nº 01"))
assert refs[i_ben + 1].startswith("BARRETO") or refs[i_ben].startswith("BECKER")
print(f"verificacao OK: 120 refs, cortes nas posicoes {i_ben} (BECKER) e {i_gs} (IN SGD/ME 01)")
print("  vizinho de BECKER:", refs[i_ben - 1][:40], "|", refs[i_ben + 1][:40])
print("  vizinho do corte GSI:", refs[i_gs - 1][:50], "|", refs[i_gs + 1][:50])
