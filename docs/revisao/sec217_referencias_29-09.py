# -*- coding: utf-8 -*-
"""Correcoes de 29/09 no docx v6:
1) Secao 2.1.7: converte afirmacao de deposito ja realizado no OSF (falso)
   em compromisso futuro formal (deposito pendente; Apendice C a criar);
2) Insere 3 referencias citadas no corpo mas ausentes da lista (ABNT NBR 6023,
   padrao da propria lista: autor normal + titulo italico + local: editora, ano):
   - EDELMAN, L. B. (2016)  -> antes de ELSEVIER (ordem alfabetica)
   - PARKER, C.; NIELSEN, V. L. (2011) -> antes de PATTON
   - POWER, M. (1997)       -> antes de POPPELBUS
Dados bibliograficos verificados em Open Library (29/09/2026)."""
import copy
import shutil
import sys

from docx import Document
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding="utf-8")

DOCX = "DISSERTACAO_atualizada_PTT_v6.docx"
BACKUP = "revisao/DISSERTACAO_v6_backup_pre-referencias-29-09.docx"

shutil.copy2(DOCX, BACKUP)
print(f"backup: {BACKUP}")

doc = Document(DOCX)

# ---- 1) Secao 2.1.7 ----
ALVO = "foram disponibilizados publicamente"
ANTES = None
for p in doc.paragraphs:
    if ALVO in p.text:
        ANTES = p
        break
assert ANTES is not None, "paragrafo 2.1.7 nao encontrado"
NOVA = ("Em aderência às práticas de Ciência Aberta priorizadas pela CAPES no quadriênio 2025-2028, "
        "a documentação integral desta revisão sistemática será disponibilizada em acesso aberto. "
        "O checklist PRISMA 2020 preenchido, as strings de busca por base, a planilha de triagem com as "
        "decisões fundamentadas e o fluxograma final serão depositados no Open Science Framework (OSF), "
        "sob licença Creative Commons BY-SA 4.0, com atribuição de Digital Object Identifier (DOI) "
        "permanente; o link do repositório constará no Apêndice C, garantindo a auditabilidade e a "
        "replicabilidade do levantamento por pesquisadores interessados em conduzir investigações "
        "similares ou em estender os achados desta dissertação.")
ANTES.runs[0].text = NOVA
for r in ANTES.runs[1:]:
    r.text = ""
print("2.1.7 ok:", ANTES.text[:80])

# ---- 2) referencias faltantes ----
REFS = [
    ("ELSEVIER", "EDELMAN, L. B. ",
     "Working law: courts, corporations, and symbolic civil rights",
     ". Chicago: University of Chicago Press, 2016."),
    ("PATTON", "PARKER, C.; NIELSEN, V. L. (org.). ",
     "Explaining compliance: business responses to regulation",
     ". Cheltenham: Edward Elgar Publishing, 2011."),
    ("PÖPPELBUß", "POWER, M. ",
     "The audit society: rituals of verification",
     ". Oxford: Oxford University Press, 1997."),
]

for prefixo_ancora, autor, titulo, final in REFS:
    ancora = None
    for p in doc.paragraphs:
        if p.text.strip().startswith(prefixo_ancora):
            ancora = p
            break
    assert ancora is not None, f"ancora {prefixo_ancora} nao encontrada"
    nova = ancora.insert_paragraph_before()
    if ancora._p.pPr is not None:
        nova._p.insert(0, copy.deepcopy(ancora._p.pPr))
    r1 = nova.add_run(autor)
    r2 = nova.add_run(titulo)
    r2.italic = True
    r3 = nova.add_run(final)
    print(f"ref ok: {autor}{titulo[:45]}...")

doc.save(DOCX)
print("salvo:", DOCX)

# ---- verificacao ----
doc2 = Document(DOCX)
P2 = doc2.paragraphs
texto = "\n".join(p.text for p in P2)
for trecho in ("EDELMAN, L. B.", "PARKER, C.; NIELSEN, V. L.", "POWER, M. The audit society"):
    assert trecho in texto, f"falta {trecho}"
for passado in ("foram disponibilizados publicamente", "estão depositados no Open Science"):
    assert passado not in texto, f"afirmacao passada remanescente: {passado}"
assert "constará no Apêndice C" in texto
print("verificacao OK: 3 referencias inseridas, 2.1.7 em forma de compromisso")
