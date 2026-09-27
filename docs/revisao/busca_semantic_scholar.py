# -*- coding: utf-8 -*-
"""
Busca de artigos no Semantic Scholar (endpoint /graph/v1/paper/search/bulk).

Gera:
  - semantic_scholar_PT_v2.csv (busca PT ampliada; o PT.csv antigo é preservado)
  - semantic_scholar_EN.csv
  - log_buscas.txt (data/hora, query exata enviada, filtros, nº de resultados)

Uso: python busca_semantic_scholar.py [LANG ...]
     Sem argumentos roda todas; ex.: python busca_semantic_scholar.py PT_v2
"""

import csv
import sys
import time
from datetime import datetime
from pathlib import Path

import requests

# Usa o repositório de certificados do Windows (antivírus/filtro com inspeção HTTPS
# injeta uma CA raiz que não consta no bundle do certifi). Se o pacote não estiver
# instalado, segue com o comportamento padrão do requests.
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    print("aviso: pacote 'truststore' não instalado (pip install truststore); "
          "usando bundle padrão do requests")

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------
OUT_DIR = Path(__file__).resolve().parent
LOG_FILE = OUT_DIR / "log_buscas.txt"

API_URL = "https://api.semanticscholar.org/graph/v1/paper/search/bulk"
FIELDS = "title,authors,year,venue,publicationTypes,externalIds,url,abstract"
YEAR = "2017-2026"

# Sintaxe da API: + = AND, | = OR, "..." = frase exata, ( ) = agrupamento
QUERIES = {
    "PT_v2": {
        "query": '("PDTIC" | "PDTI" | "Plano Diretor de Tecnologia da Informação" | '
                 '"Plano Diretor de TIC") + ("universidade federal" | '
                 '"universidades federais" | "IFES" | "instituição federal de ensino") '
                 '+ ("governança" | "conformidade" | "planejamento")',
        "log_title": "Busca PT v2 — string ampliada (calibração do protocolo)",
    },
    "EN": {
        "query": '("IT governance" | "ICT master plan") + ("federal universities" | '
                 '("higher education" + Brazil)) + ("normative compliance" | "decoupling")',
        "log_title": "Busca EN",
    },
}

# Rate limit da API pública: pausa entre requisições e retry com espera em 429
PAUSE_BETWEEN_REQUESTS = 3.0   # segundos
PAUSE_BETWEEN_QUERIES = 5.0    # segundos
MAX_RETRIES_429 = 6
BASE_WAIT_429 = 10.0           # segundos; dobra a cada retry
MAX_PAGES = 5                  # página do bulk traz até 1000 papers; limite de segurança

API_KEY = None  # opcional: defina via variável de ambiente S2_API_KEY

# ---------------------------------------------------------------------------
# Requisição com tratamento de 429
# ---------------------------------------------------------------------------
def fetch(params):
    """Faz GET na API, repetindo em caso de 429 ou erro de rede/SSL transitório."""
    headers = {"x-api-key": API_KEY} if API_KEY else {}
    wait = BASE_WAIT_429
    last_err = None
    for attempt in range(1, MAX_RETRIES_429 + 1):
        try:
            resp = requests.get(API_URL, params=params, headers=headers, timeout=60)
        except (requests.exceptions.SSLError, requests.exceptions.ConnectionError) as e:
            last_err = e
            print(f"  [rede] erro transitório ({type(e).__name__}); tentando de novo em "
                  f"{wait:.0f}s (tentativa {attempt}/{MAX_RETRIES_429})")
            time.sleep(wait)
            wait *= 2
            continue
        if resp.status_code == 429:
            print(f"  [429] limite de requisições; aguardando {wait:.0f}s "
                  f"(tentativa {attempt}/{MAX_RETRIES_429})")
            time.sleep(wait)
            wait *= 2
            continue
        resp.raise_for_status()
        return resp.json()
    raise RuntimeError(f"falha persistente após {MAX_RETRIES_429} tentativas: {last_err}")

# ---------------------------------------------------------------------------
# Busca + exportação
# ---------------------------------------------------------------------------
CSV_COLUMNS = ["title", "authors", "year", "venue", "publicationTypes", "doi", "url", "abstract"]

def run_search(lang, query):
    params = {"query": query, "year": YEAR, "fields": FIELDS}
    papers, token, pages = [], None, 0
    while pages < MAX_PAGES:
        if token:
            params["token"] = token
        data = fetch(params)
        batch = data.get("data") or []
        papers.extend(batch)
        token = data.get("token")
        pages += 1
        if not token or not batch:
            break
        time.sleep(PAUSE_BETWEEN_REQUESTS)
    return papers

def to_row(p):
    ext = p.get("externalIds") or {}
    return {
        "title": p.get("title") or "",
        "authors": "; ".join(a.get("name", "") for a in (p.get("authors") or [])),
        "year": p.get("year") or "",
        "venue": p.get("venue") or "",
        "publicationTypes": "; ".join(p.get("publicationTypes") or []),
        "doi": ext.get("DOI") or "",
        "url": p.get("url") or "",
        "abstract": (p.get("abstract") or "").replace("\n", " "),
    }

def main():
    log_lines = []
    log_lines.append("=" * 80)
    log_lines.append(f"Data/hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log_lines.append(f"Endpoint: {API_URL}")
    log_lines.append(f"Filtros: year={YEAR}")
    log_lines.append(f"Campos: {FIELDS}")
    log_lines.append(f"API key: {'sim (S2_API_KEY)' if API_KEY else 'não (pool público)'}")

    # Uso: python busca_semantic_scholar.py [LANG ...]   (ex.: PT_v2)
    # Sem argumentos, roda todas as buscas.
    selecionadas = sys.argv[1:] or list(QUERIES)
    for lang in selecionadas:
        cfg = QUERIES[lang]
        query = cfg["query"]

        print(f"\nBusca {lang}: {query}")
        papers = run_search(lang, query)

        csv_path = OUT_DIR / f"semantic_scholar_{lang}.csv"
        with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
            writer.writeheader()
            writer.writerows(to_row(p) for p in papers)

        print(f"  {len(papers)} resultados -> {csv_path.name}")
        log_lines.append("")
        log_lines.append(cfg["log_title"])
        log_lines.append(f"  Query enviada (parâmetro 'query'): {query}")
        log_lines.append(f"  Resultados: {len(papers)} papers")
        log_lines.append(f"  CSV: {csv_path.name}")
        time.sleep(PAUSE_BETWEEN_QUERIES)

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write("\n".join(log_lines) + "\n")
    print(f"\nLog salvo em {LOG_FILE}")

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
