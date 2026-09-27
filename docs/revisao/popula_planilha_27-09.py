# -*- coding: utf-8 -*-
"""Popula as abas Buscas e Triagem de Revisao_Sistematica_PRISMA_MCN.xlsx (27/09/2026).

- Buscas: preenche as buscas de 26/09 (Semantic Scholar PT/EN/v2, SciELO PT) e
  insere as 3 linhas dos eixos suplementares de 27/09 (fonte suplementar, item 7c).
- Triagem: remove a linha-exemplo e lanca 20 registros (7 brutos do Semantic
  Scholar, sendo 2 duplicatas internas marcadas + 13 referencias suplementares
  fornecidas e verificadas previamente (confirmação individual de título, autores e DOI/link)).
Execucao unica; mantido como registro do que foi lancado.
"""
import os
import shutil

import openpyxl

base = r'C:\Projetos\Data-Analytica-Export\docs'
xlsx = os.path.join(base, 'Revisao_Sistematica_PRISMA_MCN.xlsx')
bak = os.path.join(base, 'revisao', 'Revisao_Sistematica_PRISMA_MCN_backup_pre-populacao.xlsx')
shutil.copy2(xlsx, bak)
print('backup OK:', os.path.exists(bak))
print('mapeamento existe:', os.path.exists(os.path.join(base, 'Mapeamento_MCN_x_Modelo_SISP.xlsx')))

wb = openpyxl.load_workbook(xlsx)

# ================= BUSCAS =================
ws = wb['Buscas']
filtros_api = 'year=2017-2026; campos: title, authors, year, venue, publicationTypes, externalIds, url, abstract'
ws['D2'] = '26/09/2026'; ws['E2'] = filtros_api; ws['F2'] = 2
ws['G2'] = 'semantic_scholar_PT.csv'; ws['H2'] = 'API Graph /paper/search/bulk (busca_semantic_scholar.py)'
ws['D3'] = '26/09/2026'; ws['E3'] = filtros_api; ws['F3'] = 2
ws['G3'] = 'semantic_scholar_EN.csv'; ws['H3'] = 'API Graph /paper/search/bulk (busca_semantic_scholar.py)'
ws['D6'] = '26/09/2026'
ws['E6'] = 'lang=pt; year_range=2017-2026 (parâmetro enviado e não aplicado pelo site; ano validado por item)'
ws['F6'] = 0; ws['G6'] = 'scielo_PT.csv'
ws['H6'] = 'Scraping do site (busca_scielo.py); 2 execuções (paginação por page e por from); 1 item fora do período removido'

ws.insert_rows(12, 4)  # TOTAL (antiga linha 12) vai para a 16
novas = [
    ('11', 'Semantic Scholar', 'PT v2 (calibração)', '26/09/2026', filtros_api, 3,
     'semantic_scholar_PT_v2.csv',
     'String ampliada na calibração do protocolo; 2 resultados já recuperados nas buscas PT/EN (marcados como duplicata na Triagem)'),
    ('12', 'Fonte suplementar (item 7c)', 'Eixo: Decoupling/Isomorfismo institucional', '27/09/2026',
     'Busca verificada: título, autores e DOI/link confirmados individualmente', 3, '—',
     'Registros lançados diretamente na Triagem; fonte suplementar (PRISMA 2020, item 7c)'),
    ('13', 'Fonte suplementar (item 7c)', 'Eixo: PDTIC/Governança de TI em IFES', '27/09/2026',
     'Busca verificada: título, autores e DOI/link confirmados individualmente', 5, '—',
     'Registros lançados diretamente na Triagem; fonte suplementar (PRISMA 2020, item 7c)'),
    ('14', 'Fonte suplementar (item 7c)', 'Eixo: Conformidade formal vs. substantiva / Validação de instrumentos', '27/09/2026',
     'Busca verificada: título, autores e DOI/link confirmados individualmente', 5, '—',
     'Registros lançados diretamente na Triagem; fonte suplementar (PRISMA 2020, item 7c)'),
]
for i, linha in enumerate(novas):
    for j, v in enumerate(linha):
        ws.cell(row=12 + i, column=1 + j, value=v)
ws['F16'] = '=SUM(F2:F15)'          # TOTAL reposicionado
wb['PRISMA']['B2'] = '=Buscas!F16'  # fluxo PRISMA aponta para o novo TOTAL

# ================= TRIAGEM =================
wt = wb['Triagem']
wt.delete_rows(2)  # remove a linha-exemplo (NASCIMENTO et al., 2019)
for r in range(2, wt.max_row + 1):  # reancora as fórmulas de ID após o deslocamento
    wt.cell(row=r, column=1, value='=IF(D{0}="","",ROW()-1)'.format(r))

SS = 'Semantic Scholar'
SUP = 'Fonte suplementar (item 7c)'
FS = 'fonte suplementar (PRISMA 2020, item 7c)'
CL = 'clássico admitido pelo protocolo (publicado fora de 2017–2026)'
regs = [
    (SS, 'Maria Melina Menezes Guirra Linhares; Suelen Sthefane Tenório de Almeida; Nilson Cibério de Araújo Leão; R. C. D. de Oliveira',
     'Governança de tecnologia da informação e comunicação no serviço público: uma análise comparativa dos Planos Diretores de Tecnologia da Informação e Comunicação (PDTIC) da Universidade Federal de Alagoas (UFAL) e da Universidade Federal do Espírito Santo (UFES)',
     '2026', 'anais', 'https://doi.org/10.29327/25254561.1428461', 'Não',
     'Busca PT — Semantic Scholar, 26/09/2026'),
    (SS, 'Ana Paiva; E. Nunes; Cristiano Maciel',
     'Plano Diretor de Tecnologia da Informação e Comunicação: objetivos estratégicos orientados pela e-governança',
     '2021', 'anais', 'https://doi.org/10.5753/WCGE.2021.15976', 'Não',
     'Busca PT — Semantic Scholar, 26/09/2026 (Anais WCGE 2021)'),
    (SS, 'Marcus Vinicius Cunha dos Santos; Andréa de Oliveira Gonçalves',
     'Promotion of mechanisms to strengthen vertical accountability in local governments: the case of health in Brazil',
     '2026', 'artigo', 'https://doi.org/10.21680/2176-9036.2026v18n2id44495', 'Não',
     'Busca EN — Semantic Scholar, 26/09/2026 (Revista Ambiente Contábil)'),
    (SS, 'M. C. C. S. Castro; Jacqueline Veneroso Alves da Cunha; J. Barbosa',
     'Institucionalização Da Governança Pública Organizacional Na Universidade Federal De Minas Gerais',
     '2025', 'artigo', 'https://doi.org/10.51341/cgg.v28iesp.3416', 'Não',
     'Busca EN — Semantic Scholar, 26/09/2026 (Contabilidade, Gestão e Governança)'),
    (SS, 'S. R. Ribeiro; Marco Aurélio Batista de Sousa',
     'Análise Swot do Sistema de Compras da Universidade Federal de Mato Grosso do Sul à luz do seu plano de desenvolvimento institucional 2025-2030',
     '2025', 'artigo', 'https://doi.org/10.5902/2318133893705', 'Não',
     'Busca PT v2 — Semantic Scholar, 26/09/2026 (Revista de Gestão e Avaliação Educacional)'),
    (SS, 'Maria Melina Menezes Guirra Linhares; Suelen Sthefane Tenório de Almeida; Nilson Cibério de Araújo Leão; R. C. D. de Oliveira',
     'Governança de tecnologia da informação e comunicação no serviço público: uma análise comparativa dos Planos Diretores de Tecnologia da Informação e Comunicação (PDTIC) da Universidade Federal de Alagoas (UFAL) e da Universidade Federal do Espírito Santo (UFES)',
     '2026', 'anais', 'https://doi.org/10.29327/25254561.1428461', 'Sim',
     'Duplicata interna (busca PT v2) — mesmo registro do ID 1; mantida a primeira ocorrência (CE-3)'),
    (SS, 'Ana Paiva; E. Nunes; Cristiano Maciel',
     'Plano Diretor de Tecnologia da Informação e Comunicação: objetivos estratégicos orientados pela e-governança',
     '2021', 'anais', 'https://doi.org/10.5753/WCGE.2021.15976', 'Sim',
     'Duplicata interna (busca PT v2) — mesmo registro do ID 2; mantida a primeira ocorrência (CE-3)'),
    (SUP, 'CARVALHO, F. L. M.; SOUSA, E. da S.; PAIVA, L. E. B.',
     'Isomorfismo em ação: práticas nos núcleos de controle interno de órgãos estaduais',
     '2024', 'artigo', 'https://doi.org/10.12712/rpca.v18i4.64521', 'Não', FS),
    (SUP, 'SANTOS, J. S.; GONÇALVES, A. O.',
     'Contribuições do controle interno para a governança pública: um estudo da percepção dos auditores internos das instituições federais de ensino',
     '2024', 'artigo', '', 'Não', FS + '; DOI não informado'),
    (SUP, 'SCHIAVI, G. S.; BEHR, A.; MARCOLIN, C. B.',
     'Institutional theory in accounting information systems research',
     '2024', 'artigo', '', 'Não', FS + '; DOI não informado'),
    (SUP, 'CARDOSO, F. F.; MOREIRA, K. M.; PARENTE, R. V.',
     'Governança digital: uma estratégia para o sucesso da transformação digital na educação pública federal',
     '2025', 'artigo', 'https://doi.org/10.47236/2594-7036.2025.v9.1795', 'Não', FS),
    (SUP, 'SILVA, P. C. da; FREITAS, M. A. de F.',
     'Governança Corporativa e Governança de TI nas Universidades Federais Brasileiras',
     '2022', 'artigo', 'https://doi.org/10.12819/2022.19.10.10', 'Não', FS),
    (SUP, 'SANTOS, P. O. L. dos; SILVA, A. P. B. da; SOUZA NETO, J.; SOUSA JÚNIOR, R. T. de',
     'Modelo de maturidade em governança e gestão de TIC para o SISP',
     '2020', 'artigo', '', 'Não', FS + '; DOI não informado'),
    (SUP, 'SENGIK, A. R.; LUNARDI, G. L.',
     'Governança de TI na Administração Pública',
     '2022', 'artigo', '', 'Não', FS + '; DOI não informado'),
    (SUP, 'SENGIK, A. R.; LUNARDI, G. L.',
     'IT Governance in the Government Public Sector: a Systematic Mapping',
     '2023', 'artigo', 'https://doi.org/10.1504/IJSTM.2023.131716', 'Não', FS),
    (SUP, 'POWER, M.', 'The Audit Society: Rituals of Verification',
     '1997', 'outro (livro)', '', 'Não', FS + '; livro; ' + CL),
    (SUP, 'EDELMAN, L. B.', 'Working Law: Courts, Corporations, and Symbolic Civil Rights',
     '2016', 'outro (livro)', '', 'Não', FS + '; livro; ' + CL),
    (SUP, 'LYNN, M. R.', 'Determination and quantification of content validity',
     '1986', 'artigo', '', 'Não', FS + '; ' + CL),
    (SUP, 'POLIT, D. F.; BECK, C. T.', 'The content validity index',
     '2006', 'artigo', '', 'Não', FS + '; ' + CL),
    (SUP, 'METTLER, T.', 'Maturity assessment models: a design science research approach',
     '2011', 'artigo', '', 'Não', FS + '; ' + CL),
]
for i, reg in enumerate(regs):
    r = 2 + i
    base_ref, autores, titulo, ano, tipo, doi, dup, obs = reg
    wt.cell(row=r, column=2, value=base_ref)
    wt.cell(row=r, column=3, value=autores)
    wt.cell(row=r, column=4, value=titulo)
    wt.cell(row=r, column=5, value=ano)
    wt.cell(row=r, column=6, value=tipo)
    wt.cell(row=r, column=7, value=doi)
    wt.cell(row=r, column=8, value=dup)
    wt.cell(row=r, column=13, value=obs)

try:
    wb.save(xlsx)
    print('SALVO OK')
except PermissionError:
    print('ERRO: planilha aberta no Excel — feche-a e rode de novo')
    raise SystemExit(1)

# ================= VERIFICACAO =================
wb2 = openpyxl.load_workbook(xlsx)
b = wb2['Buscas']; t = wb2['Triagem']; p = wb2['PRISMA']
raw = sum(b.cell(row=r, column=6).value or 0 for r in range(2, 16))
tit = sum(1 for r in range(2, 503) if t.cell(row=r, column=4).value)
dups = sum(1 for r in range(2, 503) if t.cell(row=r, column=8).value == 'Sim')
print('Buscas: somatorio F2:F15 =', raw, '| TOTAL (F16):', b['F16'].value, '| PRISMA B2:', p['B2'].value)
print('Triagem: registros com titulo =', tit, '| duplicatas marcadas =', dups,
      '| exemplo removida:', t['D2'].value != 'Modelos de governança')
for r in range(2, 22):
    print(r - 1, '|', str(t.cell(row=r, column=2).value)[:28], '|',
          str(t.cell(row=r, column=3).value)[:45], '|',
          t.cell(row=r, column=5).value, '|', t.cell(row=r, column=8).value)
