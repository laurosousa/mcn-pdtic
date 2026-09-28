# -*- coding: utf-8 -*-
"""Reestrutura a dissertação v5 -> v6 conforme pendências do orientador (item A)."""
import re, copy
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
from docx.oxml.ns import qn

SRC = "C:/Users/dom_l/Downloads/DISSERTACAO_atualizada_PTT_v5_com_analise_SISP.docx"
DST = "C:/Projetos/Data-Analytica-Export/docs/DISSERTACAO_atualizada_PTT_v6.docx"

doc = Document(SRC)
paras = doc.paragraphs

def set_para_text(p, text):
    runs = p.runs
    if not runs:
        p.add_run(text); return
    runs[0].text = text
    for r in runs[1:]:
        r._r.getparent().remove(r._r)

def set_cell_text(cell, text, rpr=None):
    for extra in cell.paragraphs[1:]:
        extra._p.getparent().remove(extra._p)
    p = cell.paragraphs[0]
    runs = p.runs
    if runs:
        runs[0].text = text
        for r in runs[1:]:
            r._r.getparent().remove(r._r)
    else:
        run = p.add_run(text)
        if rpr is not None:
            run._r.insert(0, copy.deepcopy(rpr))

def find_para(prefix):
    for p in doc.paragraphs:
        if p.text.strip().startswith(prefix):
            return p
    raise ValueError("nao encontrado: " + prefix)

# ---- elementos-chave ----
h36    = find_para("3.6 MATRIZ DE CONFORMIDADE NORMATIVA")
h37    = find_para("3.7 CONFIABILIDADE")
h_cap4 = find_para("4 RESULTADOS E DISCUSSÃO")
h_33   = find_para("3.3 SELEÇÃO")
nota609  = find_para("DESLOQUEI A MATRIZ")
nota538  = find_para("QUADRO COM OS CRITÉRIOS OU AS CATEGORIAS")
p535     = find_para("Segundo Sá-Silva, Almeida e Guindani")
h188     = find_para("1.4.3 Delimitação da conformidade")
h192     = find_para("1.4.3.1 Conformidade documental")
p190     = find_para("A delimitação conceitual entre conformidade documental")
p194     = find_para("Esta dissertação foca estritamente na conformidade documental")
p172del  = find_para("A validação do PTT foi organizada em duas fases")
p158     = find_para("A matriz organiza 80 requisitos")
p155     = find_para("A relevância social transcende")
tbl_q5   = doc.tables[5]
tbl_apA  = doc.tables[19]._tbl
tbl_tpl  = doc.tables[6]
print("elementos localizados OK")

# ============ FASE 1: 1.4.3 -> continuidade de 1.4 (#31) ============
set_para_text(p190,
  "A fundamentação teórica dessa distinção parte das abordagens contemporâneas sobre "
  "compliance no setor público, passa pela diferenciação entre conformidade formal e "
  "substantiva e culmina na justificativa do escopo desta dissertação.")
elems_move = [p190._p]
cur = p194._p
for _ in range(4):  # p194..p197
    elems_move.append(cur)
    cur = cur.getnext()
for el in elems_move:
    h188._p.addprevious(el)
h188._p.getparent().remove(h188._p)
h192._p.getparent().remove(h192._p)
print("1.4.3 reestruturado")

# ============ FASE 2: renumeracao de titulos ============
NEW36 = "4 MATRIZ DE CONFORMIDADE NORMATIVA: APRESENTAÇÃO DO INSTRUMENTO DE ANÁLISE"
def map_num(n):
    if n == "3.6": return "4"
    if n.startswith("3.6."): return "4." + n[4:]
    if n.startswith("3.7"): return "3.6" + n[3:]
    if n.startswith("3.8"): return "3.7" + n[3:]
    if n.startswith("3.9"): return "3.8" + n[3:]
    if n == "4" or n.startswith("4."): return "5" + n[1:]
    if n == "5" or n.startswith("5."): return "6" + n[1:]
    if n == "6" or n.startswith("6."): return "7" + n[1:]
    return n

h_renum = 0
for p in doc.paragraphs:
    st = p.style.name if p.style else ""
    if not st.startswith("Heading"):
        continue
    m = re.match(r"^(\d+(?:\.\d+)*)(\s+)(.*)$", p.text.strip())
    if not m:
        continue
    n, sp, rest = m.group(1), m.group(2), m.group(3)
    if n == "3.6":
        set_para_text(p, NEW36)
        p.style = doc.styles["Heading 1"]
        h_renum += 1
        continue
    novo = map_num(n)
    if novo != n:
        set_para_text(p, novo + sp + rest)
        h_renum += 1
print("titulos renumerados:", h_renum)

# subtitulos 4.1-4.4 do novo capitulo 4: Heading 3 -> Heading 2
prom = 0
for p in doc.paragraphs:
    st = p.style.name if p.style else ""
    if st == "Heading 3" and re.match(r"^4\.\d", p.text.strip()):
        p.style = doc.styles["Heading 2"]
        prom += 1
print("subtitulos do cap.4 promovidos a Heading 2:", prom)

# ============ FASE 3: mover bloco 3.6 (cap. 4) antes do cap. 5 ============
bloco = []
cur = h36._p
while cur is not None and cur is not h37._p:
    bloco.append(cur)
    cur = cur.getnext()
for el in bloco:
    h_cap4._p.addprevious(el)
print("bloco movido:", len(bloco), "elementos")

# ============ FASE 4: correcoes especificas ============
def replace_in_para(p, old, new):
    if old in p.text:
        set_para_text(p, p.text.replace(old, new))
        return True
    return False

for p in doc.paragraphs:
    if "consta da Seção 3, que apresenta o protocolo de construção e aplicação da matriz, e da Seção 4.5," in p.text:
        replace_in_para(p,
          "consta da Seção 3, que apresenta o protocolo de construção e aplicação da matriz, e da Seção 4.5,",
          "consta do Capítulo 4, que apresenta a MCN com seu protocolo de construção e aplicação, e da Seção 5.5,")
replace_in_para(p535, "detalhados na Seção 3.5", "detalhados na Seção 3.3")
replace_in_para(p158,
  "sua estrutura dimensional permite identificar padrões e possíveis fatores explicativos das lacunas de conformidade, favorecendo a transição da conformidade formal para a conformidade substantiva;",
  "sua estrutura dimensional permite identificar padrões nas lacunas de conformidade detectadas, com indicativos claros de sua ocorrência nos documentos, oferecendo base empírica para a discussão da distância entre a conformidade formal e a substantiva;")
replace_in_para(p155,
  "os serviços tecnológicos oferecidos a mais de 8.000 estudantes da UFRR, articulando o planejamento dos recursos de TIC com as demandas de ensino, pesquisa e extensão.",
  "os serviços tecnológicos oferecidos a uma comunidade acadêmica superior a 15 mil matrículas de graduação (Inep, 2025), articulando o planejamento dos recursos de TIC com as demandas de ensino, pesquisa e extensão.")
print("correcoes especificas aplicadas")

# ============ FASE 5: regras gerais de referencias cruzadas ============
RULES = [
 ("Seção 3.6.4", "Seção 4.4"), ("Seção 3.6.3", "Seção 4.3"), ("Seção 3.6", "Capítulo 4"),
 ("Seção 3.9.3", "Seção 3.8.3"), ("Seção 3.9", "Seção 3.8"),
 ("Seção 3.8.3", "Seção 3.7.3"), ("Seção 3.8.2", "Seção 3.7.2"), ("Seção 3.8", "Seção 3.7"),
 ("Seção 3.7", "Seção 3.6"),
 ("Seção 4.8", "Seção 5.8"), ("Seção 4.7", "Seção 5.7"), ("Seção 4.6", "Seção 5.6"),
 ("Seção 4.5", "Seção 5.5"), ("Seção 4.4", "Seção 5.4"), ("Seção 4.3.1", "Seção 5.3.1"),
 ("Seção 4.3", "Seção 5.3"), ("Seção 4.2.2", "Seção 5.2.2"), ("Seção 4.2.1", "Seção 5.2.1"),
 ("Seção 4.2", "Seção 5.2"), ("Seção 4", "Capítulo 5"),
 ("Seção 6.4", "Seção 7.4"), ("Seção 5", "Seção 6"),
]
BROKEN = [
 (r"no[ \t\u00a0]+Seção[ \t\u00a0]+1[ \t\u00a0]*:", "na Seção 1.4:"),
 (r"no[ \t\u00a0]+Seção[ \t\u00a0]+1[ \t\u00a0]+refere-se", "na Seção 1.1 refere-se"),
 (r"no[ \t\u00a0]+Seção[ \t\u00a0]+2\b", "no Capítulo 2"),
 (r"no[ \t\u00a0]+Seção[ \t\u00a0]+4\b", "no Capítulo 5"),
 (r"do[ \t\u00a0]+Seção[ \t\u00a0]+4\b", "do Capítulo 5"),
 (r"\(Seção[ \t\u00a0]+6\)", "(Seção 7.4)"),
]
RULES.sort(key=lambda x: -len(x[0]))

def _lit(s):
    return re.escape(s).replace(r"\ ", r"[ \t\u00a0]+")

compiled = []
for a, b in RULES:
    p = _lit(a) + (r"(?!\d)" if a[-1].isdigit() else "")
    compiled.append((re.compile(p), b, len(a)))
for reg, b in BROKEN:
    compiled.append((re.compile(reg), b, len(b) + 100))
compiled.sort(key=lambda t: -t[2])
RX = re.compile("|".join("(?:" + c[0].pattern + ")" for c in compiled))

def apply_rules(txt):
    def cb(m):
        s = m.group(0)
        for creg, b, _ in compiled:
            if creg.fullmatch(s):
                return b
        return s
    return RX.sub(cb, txt)

def process_paras(piter):
    chg = 0
    for p in piter:
        if RX.search(p.text):
            novo = apply_rules(p.text)
            if novo != p.text:
                set_para_text(p, novo)
                chg += 1
    return chg

def fix_grammar(piter):
    chg = 0
    for p in piter:
        t = p.text
        if "na Cap\u00edtulo" in t or "da Cap\u00edtulo" in t:
            set_para_text(p, t.replace("na Cap\u00edtulo", "no Cap\u00edtulo").replace("da Cap\u00edtulo", "do Cap\u00edtulo"))
            chg += 1
    return chg

total = process_paras(doc.paragraphs)
for t in doc.tables:
    if t._tbl is tbl_apA:
        continue
    seen = set()
    for row in t.rows:
        for c in row.cells:
            if c._tc in seen:
                continue
            seen.add(c._tc)
            total += process_paras(c.paragraphs)
g1 = fix_grammar(doc.paragraphs)
for t in doc.tables:
    if t._tbl is tbl_apA:
        continue
    seen = set()
    for row in t.rows:
        for c in row.cells:
            if c._tc in seen:
                continue
            seen.add(c._tc)
            g1 += fix_grammar(c.paragraphs)
print("referencias cruzadas atualizadas:", total, "| gramatica Capitulo:", g1)

# ============ FASE 6: renumerar Quadros pela nova ordem do documento ============
# Após mover a MCN (antigos Q6,Q7,Q8) para depois das seções de validação
# (antigo Q9) e limitações (antigo Q10), a ordem de citação muda:
# Q1..Q5 mantêm; novo Q6 = categorias (inserido depois); Q9->7; Q10->8;
# Q6->9; Q7->10; Q8->11; Q11..Q19 -> 12..20.
QMAP = {6: 9, 7: 10, 8: 11, 9: 7, 10: 8, 11: 12, 12: 13, 13: 14, 14: 15,
        15: 16, 16: 17, 17: 18, 18: 19, 19: 20}
QRX = re.compile(r"Quadro (\d{1,2})(?!\d)")
def remap_q(txt):
    def cb(m):
        n = int(m.group(1))
        if n in QMAP and not m.group(1).startswith("0"):
            return "Quadro %d" % QMAP[n]
        return m.group(0)
    return QRX.sub(cb, txt)

qb = 0
for p in doc.paragraphs:
    if QRX.search(p.text):
        novo = remap_q(p.text)
        if novo != p.text:
            set_para_text(p, novo)
            qb += 1
for t in doc.tables:
    if t._tbl is tbl_apA:
        continue
    seen = set()
    for row in t.rows:
        for c in row.cells:
            if c._tc in seen:
                continue
            seen.add(c._tc)
            for p in c.paragraphs:
                if QRX.search(p.text):
                    novo = remap_q(p.text)
                    if novo != p.text:
                        set_para_text(p, novo)
                        qb += 1
print("ocorrencias de Quadro renumeradas:", qb)

# ============ FASE 7: novo Quadro 6 na 3.2.1 (#538) ============
cap_tpl   = find_para("Quadro 5 — Matriz de Amarração")
fonte_tpl = find_para("Fonte: elaborado pelo autor (2026), com base em Vergara")

def clone_para(tpl, text, anchor_el):
    el = copy.deepcopy(tpl._p)
    anchor_el.addprevious(el)
    np_ = Paragraph(el, tpl._parent)
    set_para_text(np_, text)
    return np_

clone_para(p535,
  "Para operacionalizar a técnica, a leitura dos documentos não foi livre: os dados foram "
  "extraídos de forma estruturada, segundo categorias previamente definidas, agrupadas no "
  "Quadro 6. Cada categoria orienta a busca por dados específicos nos documentos do corpus e "
  "alimenta a verificação dos requisitos da MCN (Capítulo 4).", nota538._p)
clone_para(cap_tpl, "Quadro 6 — Categorias de dados extraídos dos documentos do corpus", nota538._p)

newtbl_el = copy.deepcopy(tbl_tpl._tbl)
nota538._p.addprevious(newtbl_el)
newtbl = Table(newtbl_el, doc)
while len(newtbl.rows) > 1:
    newtbl._tbl.remove(newtbl.rows[-1]._tr)

# expandir de 3 para 4 colunas (modelo tem 3)
tblGrid = newtbl_el.find(qn("w:tblGrid"))
gridCols = tblGrid.findall(qn("w:gridCol"))
if len(gridCols) == 3:
    larguras = [int(gc.get(qn("w:w")) or 0) for gc in gridCols]
    total = sum(larguras) or 9000
    for gc in gridCols:
        gc.set(qn("w:w"), str(total // 4))
    ng = copy.deepcopy(gridCols[-1])
    ng.set(qn("w:w"), str(total // 4))
    tblGrid.append(ng)
for row in newtbl.rows:
    tcs = row._tr.findall(qn("w:tc"))
    if len(tcs) == 3:
        row._tr.append(copy.deepcopy(tcs[-1]))

DADOS = [
 ["Categoria de dados", "Dados extraídos", "Documento de origem", "Destinação na análise"],
 ["Identificação institucional",
  "Missão, visão, valores, competências e estrutura da unidade de TIC",
  "PDTIC 2023-2025 (Seções 1 e 2)",
  "Contextualização do diagnóstico; requisitos da dimensão Governança"],
 ["Referências normativas",
  "Leis, decretos, instruções normativas, guias e acórdãos citados pelo plano",
  "PDTIC 2023-2025 (Seção 3; Quadro 01)",
  "Verificação dos requisitos da dimensão Normativa"],
 ["Diagnóstico e inventários",
  "Situação da infraestrutura, sistemas, serviços e quadro de pessoal de TIC",
  "PDTIC 2023-2025 (Seção 4; Anexo I)",
  "Consistência do diagnóstico (dimensões Estratégica e Operacional)"],
 ["Alinhamento estratégico",
  "Objetivos estratégicos de TIC e articulação com o PDI",
  "PDTIC 2023-2025 (Seções 7 e 8); PDI 2021-2025",
  "Verificação dos requisitos da dimensão Estratégica"],
 ["Metas, ações e priorização",
  "Iniciativas, indicadores, responsáveis, cronograma e matriz GUT",
  "PDTIC 2023-2025 (Seção 9; Seção 11 e Quadro 12); planilhas de metas",
  "Avaliação da operacionalização do plano (dimensão Operacional)"],
 ["Recursos, riscos e governança do plano",
  "Plano orçamentário, gestão de riscos, segurança da informação e aprovação formal",
  "PDTIC 2023-2025 (Seções 13 e 14); portarias de aprovação",
  "Verificação de requisitos das dimensões Operacional e Governança"],
]
tr_tpl = newtbl.rows[0]._tr
for _ in range(len(DADOS) - 1):
    newtbl._tbl.append(copy.deepcopy(tr_tpl))

def first_rpr(cell):
    for p in cell.paragraphs:
        for r in p.runs:
            if r._r.rPr is not None:
                return r._r.rPr
    return None

hdr_rpr = first_rpr(tbl_tpl.rows[0].cells[0])
body_rpr = first_rpr(tbl_tpl.rows[1].cells[0]) if len(tbl_tpl.rows) > 1 else None
for ri, linha in enumerate(DADOS):
    for ci, texto in enumerate(linha):
        rpr = hdr_rpr if ri == 0 else body_rpr
        set_cell_text(newtbl.rows[ri].cells[ci], texto, rpr)

clone_para(fonte_tpl, "Fonte: elaborado pelo autor (2026).", nota538._p)
nota538._p.getparent().remove(nota538._p)
print("novo Quadro 6 inserido na 3.2.1")

# ============ FASE 8: Quadro 5 alinhado aos objetivos (#133/#134/#135/#136) ============
LINHAS_Q5 = {
 "a": ["a) Sistematizar normas federais e frameworks teóricos",
       "Pesquisa documental",
       "Diários Oficiais; bases normativas do SISP e do TCU (Conjunto B)",
       "Protocolo de Rastreabilidade Normativa"],
 "b": ["b) Estabelecer os critérios de conformidade normativa aplicáveis às IFES;",
       "Análise documental",
       "Normas federais e Guia de PDTIC do SISP (Conjunto B)",
       "Síntese normativa dos requisitos verificáveis"],
 "c": ["c) Elaborar a Matriz de Conformidade Normativa (MCN);",
       "Análise documental; dedução de requisitos",
       "Normas do SISP (Conjunto B); fundamentação de Weill e Ross (2004)",
       "MCN-PDTIC 1.0"],
 "d": ["d) Diagnosticar o nível de conformidade nas dimensões normativa, estratégica, operacional e de governança;",
       "Análise documental comparativa",
       "PDTIC UFRR 2023-2025 e PDI vigente (Conjunto A)",
       "MCN-PDTIC aplicada (Apêndice A)"],
 "e": ["e) Identificar padrões nas lacunas de conformidade detectadas (identificação descritiva, com indicativos de ocorrência);",
       "Análise categorial",
       "Resultados da aplicação da MCN",
       "Grelha de análise categorial"],
 "f": ["f) Elaborar o Produto Técnico-Tecnológico (PTT): Guia de Aplicação e aplicação web;",
       "Modelagem de produto; validação por especialistas (IVC)",
       "Achados do diagnóstico; painel de especialistas",
       "Guia de Aplicação + Aplicação web"],
}
for ri in range(1, len(tbl_q5.rows)):
    letra = chr(ord("a") + ri - 1)
    for ci, texto in enumerate(LINHAS_Q5[letra]):
        set_cell_text(tbl_q5.rows[ri].cells[ci], texto)
print("Quadro 5 realinhado")

# ============ FASE 9: remover trecho dispensavel (#170) e notas ============
p172del._p.getparent().remove(p172del._p)
nota609._p.getparent().remove(nota609._p)
print("trecho 3.8 e nota do capitulo removidos")

# ============ FASE 10: referencia INEP ============
alvo = None
seen_refs = False
for p in doc.paragraphs:
    t = p.text.strip()
    if not seen_refs:
        if t == "REFERÊNCIAS":
            seen_refs = True
        continue
    if t.startswith("APÊNDICE A"):
        break
    if t and t > "INSTITUTO NACIONAL DE ESTUDOS":
        alvo = p
        break
ref_inep = ("INSTITUTO NACIONAL DE ESTUDOS E PESQUISAS EDUCACIONAIS ANÍSIO TEIXEIRA. "
            "Censo da Educação Superior 2024. Brasília, DF: Inep, 2025. Disponível em: "
            "https://www.gov.br/inep/pt-br/areas_de_atuacao/pesquisas-estatisticas-e-indicadores/"
            "censo-da-educacao-superior. Acesso em: 27 set. 2026.")
if alvo is not None:
    el = copy.deepcopy(alvo._p)
    alvo._p.addprevious(el)
    np_ = Paragraph(el, alvo._parent)
    set_para_text(np_, ref_inep)
    print("referencia INEP inserida antes de:", alvo.text[:60])
else:
    print("AVISO: ponto de insercao INEP nao encontrado")

doc.save(DST)
print("SALVO:", DST)
