import fs from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('Uso: node scripts/calcular-validacao-conteudo.mjs <arquivo.csv>');
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') field += text[++i];
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field); field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error('CSV inválido: aspas não fechadas.');
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCsv(fs.readFileSync(path, 'utf8'));
const header = rows.shift();
const aspects = [
  'clareza_1a4',
  'relevancia_1a4',
  'abrangencia_1a4',
  'aplicabilidade_1a4',
  'aderencia_programa_1a4',
  'impacto_1a4',
  'aplicabilidade_reprodutibilidade_1a4',
  'inovacao_complexidade_1a4',
];
const requiredProfiles = [
  'Gestor de TIC de IFES da região Norte',
  'Profissional de auditoria e controle em governança de TIC',
  'Pesquisador doutor em área correlata',
];
const requiredSample = new Map([
  ['N03', 'Normativa'], ['N04', 'Normativa'], ['N06', 'Normativa'], ['N08', 'Normativa'],
  ['E03', 'Estratégica'], ['E05', 'Estratégica'], ['E17', 'Estratégica'], ['E20', 'Estratégica'],
  ['O01', 'Operacional'], ['O10', 'Operacional'], ['O13', 'Operacional'], ['O17', 'Operacional'],
  ['G04', 'Governança'], ['G09', 'Governança'], ['G13', 'Governança'], ['G15', 'Governança'],
]);
for (const name of ['especialista_id', 'perfil', 'dimensao', 'item_id', ...aspects]) {
  if (!header.includes(name)) throw new Error(`Coluna obrigatória ausente: ${name}`);
}
const records = rows.map(values => Object.fromEntries(header.map((key, i) => [key, values[i] ?? ''])));
for (const record of records) {
  if (!record.especialista_id || !record.perfil || !record.dimensao || !record.item_id) {
    throw new Error('Especialista, perfil, dimensão e item são obrigatórios em todas as linhas.');
  }
  if (!requiredSample.has(record.item_id)) throw new Error(`Item fora da amostra congelada: ${record.item_id}`);
  if (requiredSample.get(record.item_id) !== record.dimensao) {
    throw new Error(`Dimensão incorreta para ${record.item_id}: esperado ${requiredSample.get(record.item_id)}, recebido ${record.dimensao}`);
  }
  for (const aspect of aspects) {
    if (!['1', '2', '3', '4'].includes(record[aspect])) {
      throw new Error(`Nota inválida em ${record.especialista_id}/${record.item_id}/${aspect}: ${record[aspect]}`);
    }
  }
}

const specialists = [...new Set(records.map(r => r.especialista_id))];
const items = [...new Set(records.map(r => r.item_id))];
if (specialists.length < 9 || specialists.length > 12) {
  throw new Error(`São necessários de 9 a 12 especialistas; encontrados: ${specialists.length}.`);
}
for (const record of records) {
  if (!requiredProfiles.includes(record.perfil)) throw new Error(`Perfil inválido para ${record.especialista_id}: ${record.perfil}`);
}
for (const profile of requiredProfiles) {
  const profileSpecialists = new Set(records.filter(r => r.perfil === profile).map(r => r.especialista_id));
  if (profileSpecialists.size < 3 || profileSpecialists.size > 4) {
    throw new Error(`O perfil "${profile}" deve ter de 3 a 4 especialistas; encontrados: ${profileSpecialists.size}.`);
  }
}
if (items.length !== requiredSample.size) {
  throw new Error(`São necessários exatamente ${requiredSample.size} itens; encontrados: ${items.length}.`);
}
for (const item of requiredSample.keys()) {
  if (!items.includes(item)) throw new Error(`Item obrigatório ausente: ${item}`);
}
for (const specialist of specialists) {
  const specialistRows = records.filter(r => r.especialista_id === specialist);
  const specialistItems = specialistRows.map(r => r.item_id);
  if (new Set(specialistRows.map(r => r.perfil)).size !== 1) {
    throw new Error(`O especialista ${specialist} aparece em mais de um perfil.`);
  }
  if (specialistItems.length !== requiredSample.size || new Set(specialistItems).size !== requiredSample.size) {
    throw new Error(`O especialista ${specialist} não possui exatamente uma avaliação de cada item da amostra.`);
  }
}

const itemResults = items.map(item => {
  const itemRows = records.filter(r => r.item_id === item);
  return {
    item,
    values: Object.fromEntries(aspects.map(aspect => [
      aspect,
      itemRows.filter(r => Number(r[aspect]) >= 3).length / itemRows.length,
    ])),
  };
});

console.log(`Especialistas: ${specialists.length}; itens: ${items.length}`);
console.log('item_id\tdimensao\tclareza\trelevancia\tabrangencia\taplicabilidade\trevisao');
for (const result of itemResults) {
  const values = aspects.map(aspect => result.values[aspect]);
  console.log([
    result.item, requiredSample.get(result.item),
    ...values.map(value => value.toFixed(3)),
    values.some(value => value < 0.78) ? 'SIM' : 'NÃO',
  ].join('\t'));
}
console.log('\nS-CVI/Ave');
for (const aspect of aspects) {
  const average = itemResults.reduce((sum, result) => sum + result.values[aspect], 0) / itemResults.length;
  console.log(`${aspect.replace('_1a4', '')}: ${average.toFixed(3)}`);
}

console.log('\nIVC médio por dimensão e critério');
for (const dimension of [...new Set(requiredSample.values())]) {
  const dimensionResults = itemResults.filter(result => requiredSample.get(result.item) === dimension);
  const values = aspects.map(aspect =>
    dimensionResults.reduce((sum, result) => sum + result.values[aspect], 0) / dimensionResults.length
  );
  console.log(`${dimension}: ${aspects.map((aspect, i) => `${aspect.replace('_1a4', '')}=${values[i].toFixed(3)}`).join('; ')}`);
}