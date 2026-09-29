# -*- coding: utf-8 -*-
"""Revisao da Secao 1 da Dissertacao v6 (29/09/2026).
Aplica: deduplicacao 1.1.4/1.1.5, realocacao do contexto UFRR, consolidacao 1.4,
secao 1.5 (estrutura), correcoes gramaticais, siglas, citacoes, italico p/ estrangeirismos.
"""
import copy
import io
import re
import shutil
import zipfile

from docx import Document
from docx.oxml.ns import qn

F = "DISSERTACAO_atualizada_PTT_v6.docx"
log = []


def get_ts(p):
    """w:t elements in document order (inclui runs dentro de hyperlinks)."""
    return p._p.findall(".//" + qn("w:t"))


def para_text(p):
    return "".join(t.text or "" for t in get_ts(p))


def offset_map(p):
    """[(t_el, start, end)] com offsets no texto concatenado do paragrafo."""
    out, pos = [], 0
    for t in get_ts(p):
        txt = t.text or ""
        out.append((t, pos, pos + len(txt)))
        pos += len(txt)
    return out


def _set_text(t, value):
    t.text = value
    if value != value.strip():
        t.set(qn("xml:space"), "preserve")


def replace(p, old, new, count=1):
    """Substitui old por new preservando formatacao (formatacao do 1o run do trecho)."""
    done = 0
    for _ in range(count):
        txt = para_text(p)
        s = txt.find(old)
        if s < 0:
            break
        e = s + len(old)
        om = offset_map(p)
        ov = [(t, a, b) for (t, a, b) in om if a < e and b > s]
        if not ov:
            break
        first = ov[0]
        last = ov[-1]
        pre = first[0].text or ""
        pre = pre[: s - first[1]]
        post = last[0].text or ""
        post = post[e - last[1]:]
        if first is last:
            _set_text(first[0], pre + new + post)
        else:
            _set_text(first[0], pre + new)
            for t, a, b in ov[1:-1]:
                _set_text(t, "")
            _set_text(last[0], post)
        done += 1
    if done:
        log.append(f"replace: {old[:60]!r} x{done}")
    return done


def _copy_run(r, text):
    """Copia o run mantendo formatacao, com texto unico."""
    c = copy.deepcopy(r)
    ts = c.findall(".//" + qn("w:t"))
    for t in ts[1:]:
        c.remove(t)
    if ts:
        _set_text(ts[0], text)
    return c


def _is_italic(r):
    rPr = r.find(qn("w:rPr"))
    return rPr is not None and rPr.find(qn("w:i")) is not None


def italicize(p, phrase):
    """Aplica italico a cada ocorrencia ainda nao italica de phrase (split de runs)."""
    n = 0
    start = 0
    while True:
        txt = para_text(p)
        s = txt.find(phrase, start)
        if s < 0:
            break
        e = s + len(phrase)
        om = offset_map(p)
        ov = [(t, a, b) for (t, a, b) in om if a < e and b > s]
        if not ov:
            break
        runs = [(t.getparent(), t, a, b) for t, a, b in ov]
        if all(_is_italic(r) for r, _, _, _ in runs):
            start = e
            continue
        pre = (ov[0][0].text or "")[: s - ov[0][1]]
        post = (ov[-1][0].text or "")[e - ov[-1][1]:]
        r_first, t_first = runs[0][0], runs[0][1]
        r_last, t_last = runs[-1][0], runs[-1][1]
        if post:
            r_last.addnext(_copy_run(r_last, post))
        if pre:
            r_first.addprevious(_copy_run(r_first, pre))
        _set_text(t_first, phrase)
        for _, t, _, _ in runs[1:]:
            _set_text(t, "")
        for r, _, _, _ in runs:
            rPr = r.find(qn("w:rPr"))
            if rPr is None:
                rPr = r.makeelement(qn("w:rPr"), {})
                r.insert(0, rPr)
            if rPr.find(qn("w:i")) is None:
                rPr.append(rPr.makeelement(qn("w:i"), {}))
        n += 1
        start = e
    if n:
        log.append(f"italic: {phrase!r} x{n} @ {para_text(p)[:40]!r}")
    return n


DASH = re.compile(r"(\d{4})-(\d{4})")


def dashes(p):
    txt = para_text(p)
    for m in reversed(list(DASH.finditer(txt))):
        old = m.group(0)
        new = m.group(1) + "–" + m.group(2)
        replace(p, old, new, count=1)


d = Document(F)
P = list(d.paragraphs)

# ---------- 1) correcoes textuais pontuais ----------
replace(P[89],
    "Sob a ótica da Teoria Neoinstitucional, esse fenômeno é conceituado como decoupling (desacoplamento), processo pelo qual as organizações, pressionadas por mecanismos de isomorfismo coercitivo (DiMaggio; Powell, 1983), produzem artefatos formais",
    "Sob a ótica da Teoria Neoinstitucional, esse fenômeno é intensificado por mecanismos de isomorfismo coercitivo (DiMaggio; Powell, 1983): as organizações produzem artefatos formais")

replace(P[85],
    "ISO/IEC 33000 (com destaque para a ISO/IEC 33020, que estabelece o modelo de medição da capacidade de processos, aproximando-se do conceito de modelo híbrido de governança de TI proposto por Weill e Ross (2004.",
    "ISO/IEC 33000 (com destaque para a ISO/IEC 33020, que estabelece o modelo de medição da capacidade de processos), aproximando-se do conceito de modelo híbrido de governança de TI proposto por Weill e Ross (2004).")

replace(P[84], "e a sociedade civil, introduzem visões", "e a sociedade civil, introduz visões")

replace(P[141],
    "os documentos necessários: PDTIC, PDI e Relatórios de Gestão por força da Lei de Acesso à Informação (Lei nº 12.527/2011), o que dispensa",
    "os documentos necessários (PDTIC, PDI e Relatórios de Gestão) estão disponíveis por força da Lei de Acesso à Informação (Lei nº 12.527/2011), o que dispensa")

replace(P[128],
    "nas práticas de gestão adaptáveis em Weill e Ross, (2004) e nos frameworks",
    "nas práticas de gestão de Weill e Ross (2004) e nos frameworks")

# ---------- 2) siglas: definir apenas na 1a ocorrencia ----------
replace(P[82],
    "As Instituições Federais de Ensino Superior (IFES) constituem uma tipologia singular de organização pública, na qual a governança e o planejamento de Tecnologia da Informação e Comunicação (TIC) são condicionados",
    "As IFES constituem uma tipologia singular de organização pública, na qual a governança e o planejamento de TIC são condicionados")
replace(P[76],
    "conteúdo mínimo do PDTIC no âmbito do Sistema de Administração dos Recursos de Tecnologia da Informação (SISP), enquanto",
    "conteúdo mínimo do PDTIC no âmbito do SISP, enquanto")
replace(P[90],
    "conduzidos pelo Tribunal de Contas da União (TCU) nas 69 universidades",
    "conduzidos pelo TCU nas 69 universidades")

# ---------- 3) citacoes ----------
replace(P[103], "(Nascimento et al., 2019; TCU, 2021; 2026)", "(Nascimento et al., 2019; TCU, 2021, 2026)")
replace(P[153], "Fonte: elaborado pelo autor (2026), adaptado de Meyer e Rowan (1977).",
                "Fonte: adaptado de Meyer e Rowan (1977).")

# ---------- 4) travessoes de periodo ----------
for i in range(63, 182):
    dashes(P[i])

# ---------- 5) estrangeirismos em italico ----------
FOREIGN = ["policy-practice decoupling", "decoupling", "frameworks", "framework", "checklists", "checklist"]
for i in range(63, 182):
    for ph in FOREIGN:
        italicize(P[i], ph)

# ---------- 6) mover contexto UFRR (91-93) para 1.1.4 e excluir duplicatas ----------
P[95]._p.addnext(P[93]._p)
P[95]._p.addnext(P[92]._p)
P[95]._p.addnext(P[91]._p)
for i in (97, 98, 99, 173, 174, 175, 176, 177):
    el = P[i]._p
    el.getparent().remove(el)
log.append("move 91-93 -> apos heading 1.1.4; delete 97-99, 173-177")

# ---------- 7) nova secao 1.5: estrutura da dissertacao ----------
h15 = P[178].insert_paragraph_before("1.5 ESTRUTURA DA DISSERTAÇÃO", style="Heading 2")
body15 = P[178].insert_paragraph_before(
    "Esta dissertação está organizada em sete capítulos, além das referências e dos apêndices. "
    "O Capítulo 2 sistematiza o referencial teórico e normativo, articulando a Teoria Neoinstitucional ao arcabouço regulatório do SISP e aos frameworks de governança de TIC. "
    "O Capítulo 3 descreve o delineamento metodológico, incluindo a revisão sistemática de literatura conduzida segundo o protocolo PRISMA 2020. "
    "O Capítulo 4 apresenta a Matriz de Conformidade Normativa (MCN), seus fundamentos, requisitos e dimensões de análise. "
    "O Capítulo 5 expõe e discute os resultados da aplicação da MCN ao PDTIC 2023–2025 da UFRR. "
    "O Capítulo 6 apresenta o Produto Técnico-Tecnológico — guia de aplicação acompanhado de aplicação web de acesso aberto —, e o Capítulo 7 encerra com as considerações finais e as sugestões de pesquisas futuras.",
    style="Normal")
log.append("inserido 1.5 ESTRUTURA DA DISSERTACAO")

d.save(F)

with io.open("revisao/revisao_sec1_v6.log", "w", encoding="utf-8") as fh:
    fh.write("\n".join(log))

print("\n".join(log))
print("SAVED", F)
