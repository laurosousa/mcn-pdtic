# -*- coding: utf-8 -*-
"""Limpeza de referencias orfas (30/09, decisao do autor):
(1) remove 7 entradas sem nenhuma citacao no corpo/apendices (auditoria Crossref
    + varredura por frases distintivas, sufixos de ano e alias);
(2) renormaliza sufixos de ano que ficam unicos: 2020a->2020, 2022b->2022,
    2024a->2024 (entradas da lista + citacoes do corpo);
(3) corrige (TCU, 2021) -> (TCU, 2021d) — a entrada iGG e '2021d' na sequencia
    BRASIL 2021 (a=Lei 14.129, b=Lei 14.133, c=Guia, d=iGG).
Apendices NAO sao editados (Apendice A tem numeracao interna do PDTIC)."""
import re
import shutil
import sys

from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = r"docs\DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = r"docs\revisao\DISSERTACAO_v6_backup_pre-orfas-30-09.docx"

shutil.copy2(DOCX, BACKUP)
print("backup:", BACKUP)

doc = Document(DOCX)
paras = doc.paragraphs
i_ref = next(i for i, p in enumerate(paras) if p.text.strip() == "REFERÊNCIAS")

# ---- 1) remocao das 7 orfas ----
ORFAS = [
    "BRASIL. Controladoria-Geral da União. Relatório de Auditoria Anual de Contas",
    "BRASIL. Controladoria-Geral da União. Relatório de Avaliação da Governança de TI no Poder Executivo Federal",
    "BRASIL. Ministério da Gestão e da Inovação. Sistema de Administração",
    "BRASIL. Secretaria de Governo Digital. Avaliação PDTICs",
    "BRASIL. Tribunal de Contas da União. Referencial básico de governança organizacional",
    "CAPES. Documento de Área",
    "AGÊNCIA GOV.",
]
for prefixo in ORFAS:
    hits = [p for p in paras[i_ref:] if p.text.strip().startswith(prefixo)]
    assert len(hits) == 1, f"'{prefixo[:45]}': {len(hits)} paragrafos (esperado 1)"
    el = hits[0]._element
    el.getparent().remove(el)
    print(f"orfia removida: {prefixo[:65]}")

# ---- 2) sufixos unicos nas entradas da lista ----
ENTRADAS = [
    ("29 abr. 2020a.", "29 abr. 2020."),
    ("29 dez. 2022b.", "29 dez. 2022."),
    ("Brasília: MGI, 2024a.", "Brasília: MGI, 2024."),
]
paras = doc.paragraphs  # recarrega a lista apos remocoes
for velho, novo in ENTRADAS:
    hits = [p for p in paras[i_ref:] if velho in p.text]
    assert len(hits) == 1, f"'{velho}': {len(hits)} entradas (esperado 1)"
    p = hits[0]
    idx = p.text.find(velho)
    for r in p.runs:
        if velho in r.text:
            r.text = r.text.replace(velho, novo)
            break
    else:  # sufixo cruzando runs: substitui direto no primeiro run que contiver '2020a.'
        done = False
        for r in p.runs:
            if not done and velho[:6] in r.text:
                r.text = r.text.replace(velho, novo)
                done = True
    assert novo in p.text and velho not in p.text, f"falha ao trocar '{velho}'"
    print(f"entrada: '{velho}' -> '{novo}'")

# ---- 3) citacoes do corpo ----
def replace_all(p, old, new, padrao=None):
    n = 0
    while True:
        alvo = padrao.search(p.text) if padrao else (old in p.text)
        if not alvo:
            return n
        txt = p.text
        m = padrao.search(txt) if padrao else re.search(re.escape(old), txt)
        velho_real = m.group(0)
        runs, full, pos = p.runs, txt, 0
        start = m.start()
        end = start + len(velho_real)
        done = False
        for r in runs:
            rt, rs = r.text, pos
            pos = rs + len(rt)
            if pos <= start or rs >= end:
                continue
            before = rt[:max(0, start - rs)]
            after = rt[max(0, min(len(rt), end - rs)):]
            if not done:
                r.text = before + new + after
                done = True
            else:
                r.text = before + after
        n += 1


REGRAS = [
    (re.compile(r"2020a(?=[;,)])"), "2020", 2),
    (re.compile(r"2022b(?=[;,)])"), "2022", 12),
    (re.compile(r"2024a(?=[;,)])"), "2024", 1),
    (re.compile(r"\(TCU, 2021\)"), "(TCU, 2021d)", 2),
    (re.compile(r"TCU \(2021; 2025; 2026\)"), "TCU (2021d; 2025; 2026)", 1),
]
corpo_paras = doc.paragraphs[:i_ref]
for padrao, novo, esperado in REGRAS:
    total = 0
    for p in corpo_paras:
        total += replace_all(p, None, novo, padrao)
    assert total == esperado, f"{padrao.pattern}: {total} trocas (esperado {esperado})"
    print(f"corpo: '{padrao.pattern}' -> '{novo}' ({total}x)")

# apendices: apenas reportar residuos (nao editar)
ape = "\n".join(p.text for p in doc.paragraphs[i_ref + 1:])
resid = {t: ape.count(t) for t in ("2020a", "2020c", "2022a", "2022b", "2024a", "2024b") if ape.count(t)}
print("residuos nos apendices (nao editados):", resid or "nenhum")

doc.save(DOCX)
print("salvo:", DOCX)

# ---- 4) verificacao final ----
doc2 = Document(DOCX)
ps = [p.text.strip() for p in doc2.paragraphs if p.text.strip()]
i_r = next(i for i, t in enumerate(ps) if t == "REFERÊNCIAS")
i_f = next(i for i in range(i_r + 1, len(ps)) if ps[i].isupper() and len(ps[i]) > 8)
refs, tudo = ps[i_r + 1:i_f], "\n".join(ps[:i_r]) + "\n" + "\n".join(ps[i_f:])
assert len(refs) == 113, f"esperado 113 refs, achei {len(refs)}"
proibidos = ["BENBASAT", "BRASIL. Gabinete", "AGÊNCIA GOV", "CAPES. Documento",
             "Relatório de Auditoria Anual", "Relatório de Avaliação da Governança",
             "Sistema de Administração dos Recursos", "Avaliação PDTICs", "Referencial básico"]
for prob in proibidos:
    assert not any(t.startswith(prob) for t in refs), f"ref sobrando: {prob}"
for tok in ("2020a", "2020c", "2022a", "2022b", "2024a", "2024b"):
    n = tudo.count(tok)
    assert n == 0, f"residuo '{tok}': {n}"
assert tudo.count("(TCU, 2021)") == 0 and tudo.count("(TCU, 2021d)") == 2
assert tudo.count("TCU (2021d; 2025; 2026)") == 1
print("verificacao OK: 113 refs, sem residuos de sufixo, TCU 2021d x3")
# vizinhas dos cortes
for ancora in ("BARRETO", "BRASIL. Decreto nº 10.332", "BRASIL. Ministério da Gestão e da Inovação. Estratégia",
               "CAPES. Produção técnica", "BRASIL. Tribunal de Contas da União. Relatório do Levantamento"):
    i = next(i for i, t in enumerate(refs) if t.startswith(ancora))
    print(f"  [{i}] {refs[i-1][:45]} | >>{refs[i][:45]} | {refs[i+1][:45]}")
