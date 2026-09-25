# Requisitos do PTT — MCN-PDTIC (extraídos da dissertação)

Este arquivo resume o que a dissertação diz sobre o Produto Técnico-Tecnológico (PTT).
O app deve refletir estas regras. Fonte: dissertação (versão em revisão), Seções 1.2.2, 3.6, 4.6–4.7 e 5.

## 1. Natureza do produto

- O PTT é o **Guia de Aplicação da MCN-PDTIC**, acompanhado de **planilha eletrônica de acesso aberto** (objetivo específico "f").
- Três componentes: (1) a matriz canônica **MCN-PDTIC 1.0**; (2) o guia de aplicação; (3) a ferramenta que aplica a matriz, calcula os índices e gera o relatório.
- É um **instrumento de verificação da conformidade documental**. Não é modelo de maturidade nem roteiro de elaboração de PDTIC.
- Tipologia CAPES Área 27: manual/protocolo (guia de instruções + ferramenta de aplicação).
- Público principal: DGTI (aplica), Comitê de Governança Digital (delibera), gestão superior (prioriza). Público secundário: unidades de TIC de outras IFES do SISP e auditorias internas.

## 2. A matriz

- **80 requisitos**, **20 por dimensão**: Normativa, Estratégica, Operacional, Governança.
- Natureza de cada requisito (metadado, **sem peso** no cálculo):

| Dimensão | Obrigatórios | Recomendados | Complementares | Total |
|---|---|---|---|---|
| Normativa | 8 | 8 | 4 | 20 |
| Estratégica | 5 | 10 | 5 | 20 |
| Operacional | 9 | 9 | 2 | 20 |
| Governança | 3 | 16 | 1 | 20 |
| **Total** | **25** | **43** | **12** | **80** |

- Campos de cada requisito (Quadro 6): código, dimensão, subdimensão (16 no total), descrição, tipo de fonte, fonte primária, dispositivo, texto literal, fonte secundária, critério de verificação, indicador de evidência, obrigatoriedade/natureza.
- Fonte oficial dos 80 requisitos: **Apêndice A/E** da dissertação.
- Versão da matriz: **1.0**, com **data de corte normativo padrão em 06/11/2023**.
- **Registro de manutenção**: histórico de revisões da matriz quando o arcabouço normativo muda.

## 3. Classificação (Quadro 7)

| Sigla | Classificação | Escore | Entra no cálculo? |
|---|---|---|---|
| C | Conforme | 1,0 | Sim |
| CP | Conforme Parcial | 0,5 | Sim |
| NC | Não Conforme | 0,0 | Sim |
| NA | Não Aplicável | — | Não (exige justificativa) |
| — | Não Avaliado | — | Não (indica avaliação incompleta) |

Regras de decisão:
1. **Presunção de conformidade:** "C" só com evidência explícita e suficiente.
2. **Dúvida razoável:** ambiguidade ou incompletude leva a "CP"; "NC" só para ausência inequívoca.
3. **Multiplicidade de evidências:** basta uma seção do PDTIC suficiente.

## 4. Cálculo e escala

**ICD = (Σ escores / nº de requisitos aplicáveis avaliados) × 100**

Calcular o ICD geral, o ICD por dimensão e (análise) o ICD por natureza. Mostrar separadamente os itens NA e o progresso de preenchimento.

| Faixa | Categoria |
|---|---|
| 90–100% | Conformidade Excelente |
| 75–89% | Conformidade Adequada |
| 60–74% | Conformidade Parcial |
| 40–59% | Conformidade Insuficiente |
| 0–39% | Conformidade Crítica |

## 5. Funcionalidades obrigatórias (Quadro 18)

1. Aplicação uniforme dos 80 requisitos, com **critério de verificação explícito** visível para o avaliador.
2. **Registro obrigatório da evidência** (onde está no documento) e da **justificativa** de cada classificação.
3. **Cálculo automático** do ICD geral e por dimensão.
4. **Comparação entre dimensões** (ex.: gráfico).
5. **Destaque dos itens CP e NC**, com indicação da natureza (Obrigatório/Recomendado/Complementar).
6. **Agrupamento das lacunas pelos 5 padrões**:
   - Formulação sem operacionalização (Estratégica, Operacional)
   - Governança formal incompleta (Normativa, Governança)
   - Integração insuficiente do planejamento (Normativa, Estratégica, Operacional)
   - Transparência e gestão documental frágeis (Normativa, Governança)
   - Controles transversais pouco desenvolvidos (Estratégica, Operacional, Governança)
7. **Relatório de conformidade priorizado**, para deliberação do CGD.

## 6. Procedimento de aplicação (6 etapas, Seção 5.5)

a) Delimitar o corpus e a data de corte.
b) Verificar a atualidade da matriz (registro de manutenção).
c) Classificar os requisitos com evidência e localização; justificar os NA.
d) Calcular e interpretar os índices.
e) Analisar as lacunas por natureza e por padrão.
f) Emitir o relatório priorizado e submeter ao CGD; reaplicar a cada revisão anual.

Recomendação extra: **revisão por um segundo avaliador**, com registro das divergências e de sua resolução.

## 7. Requisitos de replicabilidade

- Usável por qualquer IFES do SISP, sem software pago nem conhecimento especializado.
- Permitir **salvar, exportar e reabrir** avaliações, para comparar ciclos do plano.
- Exportar para **planilha** (a dissertação descreve o produto como planilha eletrônica de acesso aberto).
- Ciência aberta: matriz no OSF sob **CC BY-SA 4.0**.

## 8. Resultado de referência (teste de validação)

Aplicação ao PDTIC 2023-2025 da UFRR. Com as mesmas classificações, o app deve reproduzir:

- ICD geral **53,85%** (Conformidade Insuficiente)
- Normativa **52,63%** · Estratégica **76,32%** · Operacional **40,00%** · Governança **47,50%**
- 28 C · 28 CP · 22 NC · 2 NA
- Por natureza: Obrigatório 56,00% · Recomendado 53,49% · Complementar 50,00%

## 9. Fora do escopo da versão 1.0

Governança de dados e programa de integridade (agenda de aprimoramento, Seção 6.4).
