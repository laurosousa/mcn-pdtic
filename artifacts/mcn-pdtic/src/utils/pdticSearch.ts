export interface Evidence {
  text: string;
  matchedTerms: string[];
  score: number;
}

const PT_STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'e', 'é', 'ou', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'uns', 'umas', 'ao', 'aos',
  'à', 'às', 'por', 'para', 'com', 'sem', 'que', 'se', 'seu', 'sua', 'seus',
  'suas', 'pelo', 'pela', 'pelos', 'pelas', 'entre', 'cada', 'todo', 'toda',
  'todos', 'todas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses',
  'essas', 'qual', 'quais', 'mais', 'menos', 'muito', 'bem', 'já', 'ainda',
  'também', 'não', 'nem', 'são', 'tem', 'têm', 'deve', 'devem', 'sobre',
  'até', 'após', 'desde', 'durante', 'quando', 'onde', 'porque', 'sendo',
  'tendo', 'permitindo', 'garantindo', 'incluindo', 'utilizando', 'foi',
  'ser', 'estar', 'está', 'foram', 'seja', 'ser', 'como', 'ao', 'pelo',
  'pdtic', 'apresenta', 'contém', 'contempla', 'define', 'demonstra',
  'inclui', 'referencia', 'prevê', 'possui', 'explicitamente', 'formal',
  'formalmente', 'específicos', 'específicas', 'definidas', 'definidos',
  'suas', 'seus', 'claro', 'clara', 'explícita', 'explícito',
  'equivalente', 'institucional', 'instituição',
]);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Extracts meaningful search terms from a requirement description.
 * Goal: find passages in the PDTIC that demonstrate compliance with the requirement.
 */
export function extractSearchTermsFromDescription(description: string): string[] {
  const terms: string[] = [];

  // 1. Acronyms inside parentheses: (CGD), (SWOT), (PCA), (KPI)
  const parenAcronyms = description.match(/\(([A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ][A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ0-9\-]{1,9})\)/g) || [];
  terms.push(...parenAcronyms.map(m => m.slice(1, -1)));

  // 2. Standalone all-caps acronyms in text (2–6 chars, not sentence starters)
  const capsAcronyms = description.match(/(?<!\.\s{0,5})\b([A-Z]{2,6})\b/g) || [];
  const capStoplist = new Set(['DE', 'DO', 'DA', 'OS', 'AS', 'OU', 'EM', 'NO', 'NA', 'AO', 'SE', 'COM', 'POR', 'PARA', 'SEM']);
  terms.push(...capsAcronyms.filter(a => !capStoplist.has(a)));

  // 3. Multi-word capitalized proper noun phrases
  // Matches e.g. "Comitê de Governança Digital", "Plano de Contratações Anual"
  const properNounRegex = /[A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ][a-záéíóúàãõâêîôûç]{2,}(?:\s+(?:de|da|do|das|dos|e|ou|à|ao)\s+)?[A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ][a-záéíóúàãõâêîôûç]{2,}(?:\s+[A-ZÁÉÍÓÚÀÃÕÂÊÎÔÛÇ]?[a-záéíóúàãõâêîôûç]{2,})*/g;
  const properNouns: string[] = description.match(properNounRegex) || [];
  terms.push(...properNouns.filter(p => p.length > 10 && p.split(' ').length >= 2));

  // 4. Significant single nouns (5+ chars, not stopwords)
  const allWords = description
    .replace(/[(),;:.!?"/\\]/g, ' ')
    .split(/\s+/)
    .map(w => w.toLowerCase().replace(/[^a-záéíóúàãõâêîôûç]/g, ''))
    .filter(w => w.length >= 5 && !PT_STOPWORDS.has(w));

  terms.push(...allWords);

  return [...new Set(terms)].filter(t => t.length >= 3);
}

/**
 * Finds evidence passages in the PDTIC text that demonstrate compliance with
 * the given requirement description. Searches for content-relevant keywords
 * (not normative citations).
 */
export function findEvidences(
  pdticText: string,
  description: string,
  maxResults = 3
): Evidence[] {
  const terms = extractSearchTermsFromDescription(description);
  if (terms.length === 0) return [];

  const paragraphs = pdticText
    .split(/\n{2,}|\r\n{2,}/)
    .flatMap(block =>
      block.split(/\n/).map(l => l.trim()).filter(l => l.length > 40)
    )
    .filter(p => p.length > 40 && p.length < 2500);

  const uniqueParagraphs = [...new Set(paragraphs)];

  const scored: Evidence[] = uniqueParagraphs.map(p => {
    const normP = normalize(p);
    const matched: string[] = [];
    let score = 0;
    for (const term of terms) {
      const normTerm = normalize(term);
      const re = new RegExp(escapeRegex(normTerm), 'g');
      const count = (normP.match(re) || []).length;
      if (count > 0) {
        matched.push(term);
        // Weight by term length: longer/more specific terms score higher
        const weight = normTerm.length > 15 ? 5 : normTerm.length > 8 ? 3 : normTerm.length > 4 ? 2 : 1;
        score += count * weight;
      }
    }
    return { text: p, matchedTerms: matched, score };
  });

  return scored
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

export function highlightTerms(text: string, terms: string[]): Array<{ t: string; hl: boolean }> {
  if (terms.length === 0) return [{ t: text, hl: false }];

  const pattern = new RegExp(
    `(${terms.map(escapeRegex).join('|')})`,
    'gi'
  );

  const parts = text.split(pattern);
  const termSetNorm = new Set(terms.map(t => normalize(t)));

  return parts.map(part => ({
    t: part,
    hl: termSetNorm.has(normalize(part)),
  }));
}
