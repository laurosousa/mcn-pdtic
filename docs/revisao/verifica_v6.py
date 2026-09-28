# -*- coding: utf-8 -*-
import re, zipfile
from docx import Document
V6 = "C:/Projetos/Data-Analytica-Export/docs/DISSERTACAO_atualizada_PTT_v6.docx"
doc = Document(V6)
paras = doc.paragraphs
ok = True

print("== 1) QUADROS: sequencia em ordem de documento ==")
caps = []
for p in paras:
    m = re.match(r"^Quadro (\d+) — (.+)", p.text.strip())
    if m: caps.append((int(m.group(1)), m.group(2)[:55]))
nums = [n for n,_ in caps]
print("captions:", nums)
seq_ok = nums == sorted(nums) and nums == list(range(1, 21))
print("sequencia 1..20:", "OK" if seq_ok else "ERRO"); ok &= seq_ok

print("\n== 2) SOBRAS DE REFERENCIAS ANTIGAS ==")
sobras = []
for i,p in enumerate(paras):
    t = p.text
    if re.search(r"Seção 3\.6\.|Seção 3\.8\.|Seção 3\.9|DESLOQUEI|QUADRO COM OS CRITÉRIOS|A validação do PTT foi organizada|no Seção\s+\d|mais de 8\.000 estudantes|fatores explicativos das lacunas|na Capítulo|da Capítulo", t):
        sobras.append((i, t[:110]))
for i,p in enumerate(paras):
    if "?????" in p.text: sobras.append((i, "??????"))
print("sobras:", sobras if sobras else "NENHUMA ✓"); ok &= not sobras

print("\n== 3) REFERENCIAS-CHAVE CORRETAS ==")
alvos = [
 ("cujo protocolo completo é detalhado na Seção 3.7.2", "validacao->3.7.2"),
 ("conforme detalhamento da Seção 3.7.3", "bardin->3.7.3"),
 ("critérios qualitativos da Seção 4.4", "consolidacao->4.4"),
 ("os oito objetivos do COBIT selecionados na Seção 5.2", "cobit->5.2"),
 ("(Seção 5.2.1)", "gut->5.2.1"),
 ("discutidos no Capítulo 5", "achados->cap5"),
 ("converge com o identificado na Seção 5.2.2", "sintese->5.2.2"),
 ("antecipado na Seção 5.8", "funcionalidades->5.8"),
 ("futuras (Seção 7.4) propõe", "agenda->7.4"),
]
for probe, rotulo in alvos:
    found = any(probe in p.text for p in paras)
    print(f"  {rotulo}: {'OK' if found else 'NAO ENCONTRADO ✗'}")
    ok &= found

print("\n== 4) SELF-REFS DO CAPITULO 4 (bloco movido) ==")
in_cap4 = False
selfrefs = []
for p in paras:
    st = p.style.name if p.style else ""
    if st == "Heading 1":
        in_cap4 = p.text.strip().startswith("4 ")
        continue
    if in_cap4 and st == "Normal":
        for m in re.finditer(r"Seção [4-7][\d.]*|Capítulo [5-7]", p.text):
            selfrefs.append(m.group(0))
from collections import Counter
print("refs dentro do cap.4:", dict(Counter(selfrefs)))

print("\n== 5) CAPITULO 4: conteudo ==")
for p in paras:
    st = p.style.name if p.style else ""
    if st == "Heading 1" and p.text.strip().startswith("4 "):
        print("  H1:", p.text.strip())
    if st == "Heading 2" and re.match(r"^4\.\d", p.text.strip()):
        print("  H2:", p.text.strip())

print("\n== 6) 3.2.1: lead + Quadro 6 ==")
for i,p in enumerate(paras):
    if p.text.strip().startswith("Para operacionalizar a técnica"):
        print("  lead OK:", p.text.strip()[:90], "...")
    if p.text.strip().startswith("Quadro 6 —"):
        print("  caption:", p.text.strip())

print("\n== 7) COMENTARIOS ==")
z = zipfile.ZipFile(V6)
cx = z.read("word/comments.xml").decode("utf-8")
ce = z.read("word/commentsExtended.xml").decode("utf-8")
id2para = {}
for m in re.finditer(r'<w:comment w:id="(\d+)"[^>]*>(.*?)</w:comment>', cx, re.S):
    pids = re.findall(r'w14:paraId="([0-9A-Fa-f]+)"', m.group(2))
    if pids: id2para[m.group(1)] = pids[-1]
done_set = set(re.findall(r'<w15:commentEx w15:paraId="([0-9A-Fa-f]+)"[^>]*w15:done="1"', ce))
res = sum(1 for c in id2para if id2para[c] in done_set)
print(f"  resolvidos: {res}/20 | abertos: {20-res} (standby: 20,21,23,24,26 | #176 manual | respostas do autor: 132,146,172,174)")
print("  #169 atualizado:", "aplicação web" in cx)
print("  updateFields:", "updateFields" in z.read("word/settings.xml").decode("utf-8"))
z.close()

print("\n== 8) APENDICE A intacto ==")
tA = doc.tables[-1]
txts = " ".join(c.text for r in tA.rows for c in r.cells)
for probe in ["Quadro 12", "Seções 3, 4 e 11", "Seção 11 e Quadro 12"]:
    print(f"  '{probe}':", "OK" if probe in txts else "ALTERADO ✗"); ok &= probe in txts

print("\n== 9) QUADRO 5 limpo ==")
t5 = doc.tables[5]
alltxt = " ".join(c.text for r in t5.rows for c in r.cells)
print("  sem ?????:", "OK" if "???" not in alltxt else "ERRO"); ok &= "???" not in alltxt

print("\nRESULTADO GLOBAL:", "TUDO OK ✓" if ok else "HÁ PENDÊNCIAS ✗")
