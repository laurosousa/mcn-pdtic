# -*- coding: utf-8 -*-
"""Integra os estudos incluidos na revisao (nao citados) ao corpo do v6 e a lista
de referencias. Trabalhos verificados via Crossref em 29/09/2026:
R01 Linhares et al. 2026 (Even3), R02 Paiva; Nunes; Maciel 2021 (SBC/WCGE),
R10 Schiavi; Behr; Marcolin 2024 (IJAIS/Elsevier), R11 Cardoso et al. 2025
(Revista Sitio Novo), R12 Cunha; Freitas 2022 (Revista FSA), R15 Sengik;
Lunardi 2023 (IJSTM/Inderscience).
R08 (Carvalho et al. 2024) e R14 (Sengik; Lunardi 2022) ficam pendentes de
verificacao CI-6 (DOI invalido / veiculo nao localizado) e NAO sao citadas.
Corrige, de quebra, a referencia orfa CUNHA (2023) ao cita-la no corpo."""
import copy
import shutil
import sys

import openpyxl
from docx import Document

sys.stdout.reconfigure(encoding="utf-8")

DOCX = "DISSERTACAO_atualizada_PTT_v6.docx"
XLSX = "Revisao_Sistematica_PRISMA_MCN.xlsx"
BACKUP = "revisao/DISSERTACAO_v6_backup_pre-citacoes-29-09.docx"

shutil.copy2(DOCX, BACKUP)
print(f"backup: {BACKUP}")

doc = Document(DOCX)

# ---- 1) citacoes no corpo ----
APENDICES = [
    ("segundo agrupamento",  # P[247]
     " Componem esse agrupamento estudos comparativos sobre PDTICs de universidades federais "
     "(Linhares et al., 2026; Paiva; Nunes; Maciel, 2021), investigações sobre a correlação entre "
     "governança corporativa e de TI nessas instituições (Cunha, 2023; Cunha; Freitas, 2022) e sobre "
     "governança digital como estratégia da transformação digital na educação pública federal "
     "(Cardoso et al., 2025)."),
    ("terceiro agrupamento",  # P[248]
     " Incluem-se, ainda, mapeamentos sistemáticos da produção científica sobre governança de TI no "
     "setor público (Sengik; Lunardi, 2023)."),
    ("abordagem cultural-organizacional",  # P[294]
     " No campo dos sistemas de informação, a teoria institucional tem sido empregada de forma "
     "sistemática como lente analítica para processos de mudança e transformação digital "
     "(Schiavi; Behr; Marcolin, 2024)."),
]
for chave, trecho in APENDICES:
    alvo = next(p for p in doc.paragraphs if chave in p.text)
    assert trecho.strip()[:30] not in alvo.text, f"ja inserido em '{chave}'"
    alvo.add_run(trecho)
    print(f"corpo ok: ...{alvo.text[-60:]}")

# ---- 2) referencias ----
def entrada(autor_titulo, veiculo_it, final):
    return (autor_titulo, veiculo_it, final)

REFS = [
    ("CELLARD", entrada(
        "CARDOSO, F. F.; MOREIRA, K. M.; PARENTE, R. V. Governança digital: uma estratégia para o "
        "sucesso da transformação digital na educação pública federal. ",
        "Revista Sítio Novo",
        ", v. 9, e1795, 2025.")),
    ("DE BRUIN", entrada(
        "CUNHA, P. da S.; FREITAS, M. A. L. de. Governança corporativa e governança de TI nas "
        "universidades federais brasileiras. ",
        "Revista FSA",
        ", v. 19, n. 10, p. 195-211, 2022.")),
    ("LUFTMAN", entrada(
        "LINHARES, M. M. M. G.; ALMEIDA, S. S. T. de; LEÃO, N. C. de A.; OLIVEIRA, R. C. R. de. "
        "Governança de tecnologia da informação e comunicação no serviço público: uma análise "
        "comparativa dos Planos Diretores de Tecnologia da Informação e Comunicação (PDTIC) da "
        "Universidade Federal de Alagoas (UFAL) e da Universidade Federal do Espírito Santo (UFES). "
        "In: CONGRESSO DE ADMINISTRAÇÃO DO SUL DE MATO GROSSO E CONGRESSO DA FACULDADE DE CIÊNCIAS "
        "APLICADAS E POLÍTICAS (CONASUM/CONFACAP), 2025, [S. l.]. ",
        "Anais […]",
        ". Recife: Even3, 2026. v. 13.")),
    ("PALUDO", entrada(
        "PAIVA, A. M. M. de; NUNES, E. P. S.; MACIEL, C. Plano Diretor de Tecnologia da Informação e "
        "Comunicação: objetivos estratégicos orientados pela e-governança. In: WORKSHOP DE "
        "COMPUTAÇÃO APLICADA EM GOVERNO ELETRÔNICO (WCGE), 9., 2021, [S. l.]. ",
        "Anais […]",
        ". Porto Alegre: Sociedade Brasileira de Computação, 2021. p. 49-58.")),
    ("SOUZA, A. C.", entrada(
        "SCHIAVI, G. S.; BEHR, A.; MARCOLIN, C. B. Institutional theory in accounting information "
        "systems research: shedding light on digital transformation and institutional change. ",
        "International Journal of Accounting Information Systems",
        ", v. 52, 100662, 2024.")),
    ("SOUZA, A. C.", entrada(
        "SENGIK, A. R.; LUNARDI, G. L. Information technology governance in the government public "
        "sector: a systematic mapping of the scientific production. ",
        "International Journal of Services Technology and Management",
        ", v. 28, n. 3/4, p. 248-271, 2023.")),
]

for ancora_prefixo, (r1, r2, r3) in REFS:
    ancora = next(p for p in doc.paragraphs if p.text.strip().startswith(ancora_prefixo))
    inicio = r1.split(".")[0][:25]
    assert inicio not in ancora.text, f"ref ja presente: {inicio}"
    nova = ancora.insert_paragraph_before()
    if ancora._p.pPr is not None:
        nova._p.insert(0, copy.deepcopy(ancora._p.pPr))
    nova.add_run(r1)
    rit = nova.add_run(r2)
    rit.italic = True
    nova.add_run(r3)
    print(f"ref ok: {r1[:60]}")

doc.save(DOCX)
print("salvo:", DOCX)

# ---- 3) planilha: resolve pendencia CI-6 de R10, anota R08 e R14 ----
wb = openpyxl.load_workbook(XLSX)
t = wb["Triagem"]
linhas = {t.cell(r, 1).value: r for r in range(2, t.max_row + 1)}
r10 = linhas["R10"]
t.cell(r10, 7, value="https://doi.org/10.1016/j.accinf.2023.100662")
obs10 = str(t.cell(r10, 13).value or "")
t.cell(r10, 13, value=obs10.replace(
    " | Pendencia: confirmar DOI na fonte primaria (CI-6)",
    " | DOI confirmado via Crossref em 29/09/2026"))
for rid, nota in {
    "R08": " | Pendencia CI-6: DOI 10.12712/rpca.v18i4.64521 invalido (404) e prefixo pertence a "
           "Revista de Politica Agricola (MAPA), veiculo incompativel com o tema; Crossref nao "
           "localiza o titulo/autores (2024) - provavel transcricao corrupta de BRITTO; REZENDE, "
           "Isomorfismo em acao: nucleos de controle interno dos orgaos estaduais, RAP v.40 n.6 "
           "p.1005-1036, 2006; reavaliar inclusao (excluir ou retriagem na fonte original)",
    "R14": " | Pendencia CI-6: veiculo nao localizado em Crossref; confirmar dados na fonte primaria",
}.items():
    rr = linhas[rid]
    obs = str(t.cell(rr, 13).value or "")
    if nota.strip() not in obs:
        t.cell(rr, 13, value=obs + nota)
wb.save(XLSX)
print("planilha ok: R10 resolvida; R08/R14 anotadas como pendencia CI-6")

# ---- 4) verificacao ----
doc2 = Document(DOCX)
texto = "\n".join(p.text for p in doc2.paragraphs)
for ch in ("(Linhares et al., 2026; Paiva; Nunes; Maciel, 2021)",
           "(Cunha, 2023; Cunha; Freitas, 2022)",
           "(Cardoso et al., 2025)",
           "(Sengik; Lunardi, 2023)",
           "(Schiavi; Behr; Marcolin, 2024)"):
    assert ch in texto, f"falta citacao: {ch}"
for pref in ("CARDOSO, F. F.", "CUNHA, P. da S.; FREITAS", "LINHARES, M. M. M. G.",
             "PAIVA, A. M. M.", "SCHIAVI, G. S.", "SENGIK, A. R."):
    hits = [p.text[:40] for p in doc2.paragraphs if p.text.strip().startswith(pref)]
    assert hits, f"falta ref: {pref}"
# ordem alfabetica nas novas posicoes
P = [p.text.strip() for p in doc2.paragraphs]
idx = {k: next(i for i, t in enumerate(P) if t.startswith(k))
       for k in ("CARDOSO", "CELLARD", "CUNHA, P. da S.; FREITAS", "DE BRUIN",
                 "LINHARES", "LUFTMAN", "PAIVA", "PALUDO",
                 "SANTOS, P.", "SCHIAVI", "SENGIK", "SOUZA, A. C.")}
assert idx["CARDOSO"] < idx["CELLARD"]
assert idx["CUNHA, P. da S.; FREITAS"] < idx["DE BRUIN"]
assert idx["LINHARES"] < idx["LUFTMAN"]
assert idx["PAIVA"] < idx["PALUDO"]
assert idx["SANTOS, P."] < idx["SCHIAVI"] < idx["SENGIK"] < idx["SOUZA, A. C."]
print("verificacao OK: 5 citacoes no corpo, 6 referencias inseridas, ordem alfabetica preservada")
