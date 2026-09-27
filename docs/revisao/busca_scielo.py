# -*- coding: utf-8 -*-
"""
Busca de artigos no SciELO (https://search.scielo.org/), interface HTML.

Gera:
  - scielo_PT.csv (titulo, autores, ano, periodico, doi, link)
  - log_buscas.txt (bloco "Busca SciELO PT": data/hora, URL exata, filtros, nº de resultados)

O filtro de ano 2017-2026 é enviado pelo parâmetro year_range do SciELO e,
adicionalmente, validado por resultado (caso o parâmetro não seja aplicado
pelo site); o que foi efetivamente usado fica registrado no log.

Uso: <python> busca_scielo.py
"""

import csv
import re
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urlencode

import requests

# Usa o repositório de certificados do Windows (mesmo recurso do script
# busca_semantic_scholar.py: antivírus/filtro com inspeção HTTPS injeta uma
# CA raiz que não consta no bundle do certifi).
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    print("aviso: pacote 'truststore' não instalado; usando bundle padrão do requests")

from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------
OUT_DIR = Path(__file__).resolve().parent
CSV_PATH = OUT_DIR / "scielo_PT.csv"
LOG_FILE = OUT_DIR / "log_buscas.txt"

BASE_URL = "https://search.scielo.org/"

QUERY = ('("PDTIC" OR "PDTI" OR "Plano Diretor de Tecnologia da Informação" OR '
         '"Plano Diretor de TIC") AND ("universidade federal" OR '
         '"universidades federais" OR "IFES" OR "instituição federal de ensino") '
         'AND ("governança" OR "conformidade" OR "planejamento")')

YEAR_MIN, YEAR_MAX = 2017, 2026
LANG = "pt"
COUNT = 20              # resultados por página
MAX_PAGES = 100         # limite de segurança
PAUSE_BETWEEN_PAGES = 2.0  # segundos
MAX_RETRIES = 5
BASE_WAIT_RETRY = 10.0     # segundos; dobra a cada retry

HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"),
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}

CSV_COLUMNS = ["title", "authors", "year", "journal", "doi", "url"]

# ---------------------------------------------------------------------------
# Requisição com retry
# ---------------------------------------------------------------------------
def fetch(session, params):
    """GET na página de resultados, repetindo em erro transitório/429."""
    wait = BASE_WAIT_RETRY
    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.get(BASE_URL, params=params, timeout=90)
        except (requests.exceptions.SSLError, requests.exceptions.ConnectionError) as e:
            last_err = e
            print(f"  [rede] erro transitorio ({type(e).__name__}); nova tentativa em "
                  f"{wait:.0f}s ({attempt}/{MAX_RETRIES})")
            time.sleep(wait)
            wait *= 2
            continue
        if resp.status_code in (429, 403, 503):
            print(f"  [{resp.status_code}] bloqueio/limite; aguardando {wait:.0f}s "
                  f"({attempt}/{MAX_RETRIES})")
            time.sleep(wait)
            wait *= 2
            continue
        resp.raise_for_status()
        return resp
    raise RuntimeError(f"falha persistente apos {MAX_RETRIES} tentativas: {last_err}")

# ---------------------------------------------------------------------------
# Extração por item (toda a análise do HTML acontece aqui)
# ---------------------------------------------------------------------------
def parse_item(item):
    """Extrai (titulo, autores, ano, periodico, doi, link) de um div.item."""
    # título: strong.title (texto) ou atributo title do link principal
    strong = item.select_one("strong.title")
    title = strong.get_text(" ", strip=True) if strong else ""
    link = ""
    a = item.select_one("a:has(> strong.title)") or (
        strong.find_parent("a") if strong else None)
    if a is None:
        a = item.select_one("div.line a[href*='sci_arttext']")
    if a is not None:
        link = a.get("href", "") or ""
        if not title:
            title = (a.get("title") or "").strip()

    # autores: linha "line authors"
    authors_div = item.select_one("div.line.authors")
    authors = re.sub(r"\s+", " ", authors_div.get_text(" ", strip=True)) if authors_div else ""

    # fonte (periódico + ano): linha "line source"; ano = primeiro número de 4 dígitos
    source_div = item.select_one("div.line.source")
    journal, year = "", ""
    if source_div:
        first_link = source_div.select_one("a")
        if first_link:
            journal = re.sub(r"\s+", " ", first_link.get_text(" ", strip=True))
        if not journal:
            journal = re.sub(r"\s+", " ", source_div.get_text(" ", strip=True))
        m = re.search(r"\b(19|20)\d{2}\b", source_div.get_text(" ", strip=True))
        if m:
            year = m.group(0)

    # DOI
    doi = ""
    doi_span = item.select_one("span.DOIResults")
    if doi_span:
        m = re.search(r"DOI:\s*(\S+)", doi_span.get_text(" ", strip=True))
        if m:
            doi = m.group(1)

    return title, authors, year, journal, doi, link

def parse_total(soup):
    """Extrai o total de resultados informado pela página (int ou None)."""
    text = soup.get_text(" ", strip=True)
    m = re.search(r"([\d.,]+)\s*(?:resultados?|registros?|documentos?|itens?)", text,
                  re.IGNORECASE)
    if m:
        try:
            return int(m.group(1).replace(".", "").replace(",", ""))
        except ValueError:
            return None
    return None

# ---------------------------------------------------------------------------
# Busca + exportação
# ---------------------------------------------------------------------------
def run_search():
    session = requests.Session()
    session.headers.update(HEADERS)

    rows, seen = [], set()
    raw_count = 0          # itens baixados (antes da validação de ano)
    kept_by_param = 0      # itens já dentro de 2017-2026 (filtro do site)
    removed_by_validation = 0
    total_informado = None
    exact_url_first = ""

    params = {
        "q": QUERY,
        "lang": LANG,
        "count": COUNT,
        "from": 0,
        "year_range": f"{YEAR_MIN}-{YEAR_MAX}",
    }

    for page in range(1, MAX_PAGES + 1):
        # paginacao por offset: o SciELO ignora "page" e usa "from" (offset)
        params["from"] = (page - 1) * COUNT
        resp = fetch(session, params)
        if page == 1:
            exact_url_first = f"{BASE_URL}?{urlencode(params)}"
        soup = BeautifulSoup(resp.text, "lxml")

        if page == 1:
            total_informado = parse_total(soup)

        items = soup.select("div.item")
        if not items:
            break

        for item in items:
            raw_count += 1
            key = item.get("id") or (parse_item(item)[5])
            if key in seen:
                continue
            seen.add(key)

            title, authors, year, journal, doi, link = parse_item(item)
            try:
                y = int(year)
            except ValueError:
                y = None
            if y is not None and YEAR_MIN <= y <= YEAR_MAX:
                kept_by_param += 1
            elif y is not None:
                # site não aplicou o filtro: descarta e conta
                removed_by_validation += 1
                continue
            else:
                # sem ano legível: mantém, mas conta como vindo do filtro do site
                kept_by_param += 1

            rows.append({
                "title": title,
                "authors": authors,
                "year": year,
                "journal": journal,
                "doi": doi,
                "url": link,
            })

        if len(items) < COUNT:
            break
        time.sleep(PAUSE_BETWEEN_PAGES)

    return rows, raw_count, kept_by_param, removed_by_validation, total_informado, exact_url_first

def main():
    print("Busca SciELO PT: iniciando...")
    rows, raw_count, kept_by_param, removed_by_validation, total_informado, exact_url = run_search()

    with open(CSV_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"{len(rows)} resultados -> {CSV_PATH.name}")

    param_aplicado = removed_by_validation == 0
    log_lines = [
        "=" * 80,
        f"Data/hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "Busca SciELO PT",
        f"URL exata: {exact_url}",
        f"Filtros: lang={LANG}; year_range={YEAR_MIN}-{YEAR_MAX} (parametro do SciELO); "
        f"count={COUNT}/pagina; paginacao completa por from (offset)",
        f"Query (parametro 'q'): {QUERY}",
        f"Resultados: {len(rows)} (total informado pelo site: "
        f"{total_informado if total_informado is not None else 'n/d'}; "
        f"itens percorridos: {raw_count})",
        ("Filtro de ano: aplicado pelo parametro year_range do SciELO "
         "(nenhum resultado fora de 2017-2026)" if param_aplicado else
         f"Filtro de ano: o parametro year_range foi enviado, mas o SciELO nao o "
         f"aplicou (retornou itens fora da faixa); {removed_by_validation} "
         f"resultado(s) fora de {YEAR_MIN}-{YEAR_MAX} removido(s) por validacao "
         f"do ano de cada item"),
        f"CSV: {CSV_PATH.name}",
    ]
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")
    print(f"Log: bloco acrescentado em {LOG_FILE.name}")

if __name__ == "__main__":
    main()
