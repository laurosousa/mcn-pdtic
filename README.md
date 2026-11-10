# MCN-PDTIC

**Matriz de Conformidade Normativa para Planos Diretores de TIC**

Aplicação web para avaliar a conformidade normativa de Planos Diretores de Tecnologia da Informação e Comunicação (PDTIC) de instituições federais de ensino. São 80 requisitos em quatro dimensões (Normativa, Estratégica, Operacional e Governança), com cálculo do Índice de Conformidade (ICD), relatório e guia de aplicação.

**Acesse:** https://laurosousa.github.io/mcn-pdtic/

## Registro

| | |
|---|---|
| Registro INPI | Processo nº **BR512026009724-0** (programa de computador, Lei nº 9.609/1998) |
| Titular | Universidade Federal de Roraima (UFRR) |
| Autores | Victor Hugo Lima Alves; Francisco Laurenilson Sousa Silva |
| Data de criação | 27/04/2026 |
| Certificado expedido em | 03/11/2026 |

Produto Técnico-Tecnológico do Mestrado Profissional em Administração Pública em Rede Nacional (PROFIAP), UFRR.

## Como usar

1. Abra o endereço acima em qualquer navegador; não precisa instalar nada nem criar conta.
2. Preencha os dados da avaliação e classifique cada requisito nas abas das dimensões.
3. Veja o resultado no Dashboard e gere o relatório na aba Relatório.

As avaliações ficam salvas no próprio navegador e podem ser exportadas e importadas em arquivo JSON.

## Para desenvolvedores

```bash
pnpm install
cd artifacts/mcn-pdtic
pnpm run dev      # servidor local
pnpm run build    # versão de publicação (dist/public)
```

A publicação no GitHub Pages é automática a cada atualização da branch `main` (`.github/workflows/pages.yml`).

---

© 2026 Universidade Federal de Roraima. Todos os direitos reservados.
