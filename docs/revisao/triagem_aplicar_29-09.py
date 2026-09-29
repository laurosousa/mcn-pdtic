# -*- coding: utf-8 -*-
"""Aplica a triagem real (29/09) a docs/Revisao_Sistematica_PRISMA_MCN.xlsx.
Decisoes validadas pelo pesquisador:
- Duplicatas: L7, L8 (removidas antes da triagem)
- Exclusoes Etapa 1 (fuga tematica, CI-1): L4, L5, L6, L10
- Inclusoes: L2, L3, L9, L11, L12, L13, L14, L15, L16 (busca)
             L17, L18, L19, L20, L21 (seminais, CI-5)
Tambem: IDs R01..R20 na coluna A e atualizacao da aba PRISMA."""
import shutil
import sys

import openpyxl

sys.stdout.reconfigure(encoding="utf-8")

XLSX = "Revisao_Sistematica_PRISMA_MCN.xlsx"
BACKUP = "revisao/Revisao_Sistematica_PRISMA_MCN_backup_pre-triagem-29-09.xlsx"

shutil.copy2(XLSX, BACKUP)
print(f"backup: {BACKUP}")

wb = openpyxl.load_workbook(XLSX)
ws = wb["Triagem"]

# (linha, id, etapa1, motivo_e1, etapa2, motivo_e2)
DECISOES = [
    (2, "R01", "Incluir", None, "Incluir", None),
    (3, "R02", "Incluir", None, "Incluir", None),
    (4, "R03", "Excluir", "Fuga tematica: accountability na saude, sem recorte TIC/IFES (CI-1)", None, None),
    (5, "R04", "Excluir", "Fuga tematica: governanca organizacional sem recorte TIC (CI-1)", None, None),
    (6, "R05", "Excluir", "Fuga tematica: compras/PDI sem recorte TIC (CI-1)", None, None),
    (7, "R06", None, None, None, None),  # duplicata de R01
    (8, "R07", None, None, None, None),  # duplicata de R02
    (9, "R08", "Incluir", None, "Incluir", None),
    (10, "R09", "Excluir", "Fuga tematica: controle interno sem recorte TIC (CI-1)", None, None),
    (11, "R10", "Incluir", None, "Incluir", None),  # pendencia DOI (CI-6) -> obs
    (12, "R11", "Incluir", None, "Incluir", None),
    (13, "R12", "Incluir", None, "Incluir", None),
    (14, "R13", "Incluir", None, "Incluir", None),
    (15, "R14", "Incluir", None, "Incluir", None),
    (16, "R15", "Incluir", None, "Incluir", None),
    (17, "R16", "Incluir", "Obra seminal (CI-5) - Audit Society", "Incluir", None),
    (18, "R17", "Incluir", "Obra seminal (CI-5) - symbolic compliance", "Incluir", None),
    (19, "R18", "Incluir", "Obra seminal (CI-5) - validade de conteudo", "Incluir", None),
    (20, "R19", "Incluir", "Obra seminal (CI-5) - indice de validade de conteudo", "Incluir", None),
    (21, "R20", "Incluir", "Obra seminal (CI-5) - modelos de maturidade", "Incluir", None),
]

for row, rid, e1, m1, e2, m2 in DECISOES:
    ws.cell(row=row, column=1, value=rid)
    if e1:
        ws.cell(row=row, column=9, value=e1)
    if m1:
        ws.cell(row=row, column=10, value=m1)
    if e2:
        ws.cell(row=row, column=11, value=e2)
    if m2:
        ws.cell(row=row, column=12, value=m2)

# pendencia de DOI em R10 (Schiavi et al., L11)
obs = ws.cell(row=11, column=13).value or ""
if "CI-6" not in str(obs):
    ws.cell(row=11, column=13, value=str(obs) + " | Pendencia: confirmar DOI na fonte primaria (CI-6)")

# ---- aba PRISMA: numeros reais ----
pr = wb["PRISMA"]
VALORES = {
    "Registros identificados nas bases (aba Buscas)": ("20", "inclui fontes suplementares (item 7c)"),
    "Registros lançados na aba Triagem": ("20", None),
    "Conferência: os dois números acima devem ser iguais": ("OK - 20 = 20", None),
    "Duplicatas removidas": ("2", None),
    "Registros triados (título e resumo)": ("18", None),
    "Registros excluídos na triagem": ("4", "fuga tematica (CI-1)"),
    "Relatórios buscados para leitura integral": ("14", None),
    "Relatórios não recuperados": ("0", None),
    "Relatórios avaliados na íntegra": ("14", None),
    "Relatórios excluídos na leitura integral": ("0", None),
    "Estudos incluídos na revisão": ("14", "9 da busca + 5 seminais CI-5"),
    "Fuga temática": ("4", "na triagem (titulo/resumo)"),
    "Fora do período": ("0", None),
    "CE-1": ("0", None),
    "CE-2": ("0", None),
    "CE-3": ("0", None),
    "CE-4": ("0", None),
    "Idioma": ("0", None),
}
preenchidos = 0
for r in range(1, pr.max_row + 1):
    a = pr.cell(row=r, column=1).value
    if a in VALORES:
        num, obs_p = VALORES[a]
        pr.cell(row=r, column=2, value=num)
        preenchidos += 1
print(f"aba PRISMA: {preenchidos} celulas preenchidas")

wb.save(XLSX)
print(f"salvo: {XLSX}")

# ---- verificacao ----
wb2 = openpyxl.load_workbook(XLSX, data_only=True)
t = wb2["Triagem"]
inc = sum(1 for r in range(2, t.max_row + 1) if t.cell(r, 11).value == "Incluir")
exc = sum(1 for r in range(2, t.max_row + 1) if t.cell(r, 9).value == "Excluir")
dup = sum(1 for r in range(2, t.max_row + 1) if t.cell(r, 8).value == "Sim")
print(f"verificacao: incluidas={inc} excluidas_e1={exc} duplicatas={dup} total={inc + exc + dup}")
assert (inc, exc, dup) == (14, 4, 2), "contagens divergem do aprovado!"
print("OK: 14 + 4 + 2 = 20")
