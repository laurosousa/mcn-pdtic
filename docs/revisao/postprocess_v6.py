# -*- coding: utf-8 -*-
"""Pos-processamento do v6: updateFields, comentario #169, comentarios resolvidos."""
import zipfile, re, shutil

V6 = "C:/Projetos/Data-Analytica-Export/docs/DISSERTACAO_atualizada_PTT_v6.docx"
TMP = V6 + ".tmp"

RESOLVIDOS = {"22", "27", "31", "133", "134", "135", "136", "169", "170", "175"}

zin = zipfile.ZipFile(V6)
parts = {n: zin.read(n) for n in zin.namelist()}
zin.close()

# ---- 1) settings.xml: updateFields (SUMARIO renumerado ao abrir no Word) ----
st = parts["word/settings.xml"].decode("utf-8")
if "updateFields" not in st:
    st = st.replace("<w:settings ", "<w:settings ", 1)
    st = re.sub(r"(<w:settings[^>]*>)", r'\1<w:updateFields w:val="true"/>', st, count=1)
    parts["word/settings.xml"] = st.encode("utf-8")
    print("settings.xml: updateFields adicionado")
else:
    print("settings.xml: updateFields ja presente")

# ---- 2) comments.xml: texto desatualizado do #169 ----
cx = parts["word/comments.xml"].decode("utf-8")
if "Guia + planilha" in cx:
    cx = cx.replace("Guia + planilha", "Guia + aplicação web")
    print("comentario #169: texto atualizado (planilha -> aplicacao web)")
else:
    print("comentario #169: substring integral nao encontrada (verificar runs)")

# mapa comment id -> paraId do ULTIMO paragrafo do comentario
id2para = {}
for m in re.finditer(r'<w:comment w:id="(\d+)"[^>]*>(.*?)</w:comment>', cx, re.S):
    cid = m.group(1)
    pids = re.findall(r'w14:paraId="([0-9A-Fa-f]+)"', m.group(2))
    if pids:
        id2para[cid] = pids[-1]
parts["word/comments.xml"] = cx.encode("utf-8")

# ---- 3) commentsExtended.xml: marcar resolvidos ----
ce = parts["word/commentsExtended.xml"].decode("utf-8")
para_ids = {id2para[c] for c in RESOLVIDOS if c in id2para}
faltando = [c for c in RESOLVIDOS if c not in id2para]
done_ct = 0
def mark_done(m):
    global done_ct
    tag = m.group(0)
    pid = re.search(r'w15:paraId="([^"]+)"', tag)
    if pid and pid.group(1) in para_ids:
        done_ct += 1
        if 'w15:done="1"' in tag:
            return tag
        return tag.replace('w15:done="0"', 'w15:done="1"')
    return tag
ce = re.sub(r'<w15:commentEx [^>]*/>', mark_done, ce)
parts["word/commentsExtended.xml"] = ce.encode("utf-8")
print(f"comentarios marcados como resolvidos: {done_ct} de {len(para_ids)} alvos; ids sem paraId: {faltando}")

with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
    for n, data in parts.items():
        zout.writestr(n, data)
shutil.move(TMP, V6)
print("SALVO:", V6)
