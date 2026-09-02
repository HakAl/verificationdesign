import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import {
  extractCategory,
  extractIntent,
  extractRelated,
  extractTitle,
} from '../src/content/loaders/cardsLoader.mjs';
import { READING_ORDER } from '../src/lib/reading-order.mjs';
import { collectReferences } from '../src/lib/references.ts';
import { REPO_URL } from '../src/lib/repo.ts';

const SITE = 'https://verificationdesign.com';
const REPO = resolve(process.cwd(), '..');
const CARDS_DIR = join(REPO, 'ai-design-patterns/cards');
const DIST = resolve(process.cwd(), 'dist');
const LICENSE = 'CC BY 4.0';
const RAW_PRINCIPLES_URL = `${REPO_URL.replace('https://github.com/', 'https://raw.githubusercontent.com/')}/main/verification_design.md`;
const CATEGORY_LABELS = {
  'context-and-state': 'Context and State Patterns',
  verification: 'Verification Patterns',
  orchestration: 'Orchestration Patterns',
};

function normalizeBody(value) {
  return `${value.replace(/\r\n/g, '\n').replace(/\n*$/, '')}\n`;
}

function quote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function frontmatter(fields, related) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    lines.push(value === true ? `${key}: true` : `${key}: ${quote(value)}`);
  }
  if (related !== undefined) {
    lines.push('related:');
    for (const item of related) {
      lines.push(`  - title: ${quote(item.title)}`);
      lines.push(`    url: ${quote(item.url)}`);
    }
  }
  return `${lines.join('\n')}\n---\n\n`;
}

async function emit(relativePath, contents) {
  const outputPath = join(DIST, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents.replace(/\r\n/g, '\n'), 'utf8');
}

const cardFiles = (await readdir(CARDS_DIR)).filter((file) => file.endsWith('.md'));
const cards = [];
for (const file of cardFiles) {
  const body = await readFile(join(CARDS_DIR, file), 'utf8');
  const title = extractTitle(body);
  const category = extractCategory(body);
  const intent = extractIntent(body);
  if (!title || !category || !intent) continue;
  const slug = file.replace(/\.md$/, '');
  cards.push({
    id: `${category}/${slug}`,
    file,
    source: `ai-design-patterns/cards/${file}`,
    body: normalizeBody(body),
    title,
    category,
    slug,
    intent,
    relatedNames: extractRelated(body),
  });
}

const byId = new Map(cards.map((card) => [card.id, card]));
const byTitle = new Map(cards.map((card) => [card.title, card]));
const orderedCards = READING_ORDER.map((id) => {
  const card = byId.get(id);
  if (!card) throw new Error(`Reading order names missing card: ${id}`);
  return card;
});
if (orderedCards.length !== cards.length) {
  throw new Error(`Reading order has ${orderedCards.length} cards; filesystem has ${cards.length}`);
}

const twins = [];
function registerTwin(path, canonical) {
  twins.push({ path: `/${path}`, canonical });
}

const principlesBody = normalizeBody(await readFile(join(REPO, 'verification_design.md'), 'utf8'));
await emit('principles.md', `${frontmatter({
  title: 'Verification Design Principles',
  canonical: `${SITE}/principles/`,
  source: 'verification_design.md',
  license: LICENSE,
})}${principlesBody}`);
registerTwin('principles.md', `${SITE}/principles/`);

for (const card of orderedCards) {
  const markdownUrl = `${SITE}/patterns/${card.category}/${card.slug}.md`;
  const canonical = `${SITE}/patterns/${card.category}/${card.slug}/`;
  const related = card.relatedNames.map((rawTitle) => {
    const title = rawTitle.replace(/:$/, '');
    const target = byTitle.get(title);
    if (!target) throw new Error(`${card.file} names unknown related pattern: ${title}`);
    return {
      title,
      url: `${SITE}/patterns/${target.category}/${target.slug}.md`,
    };
  });
  await emit(`patterns/${card.category}/${card.slug}.md`, `${frontmatter({
    title: card.title,
    canonical,
    source: card.source,
    license: LICENSE,
  }, related)}${card.body}`);
  registerTwin(`patterns/${card.category}/${card.slug}.md`, canonical);
  card.markdownUrl = markdownUrl;
  card.canonical = canonical;
}

const indexBody = [
  '# Patterns',
  '',
  ...orderedCards.map((card) => `- [${card.title}](${card.markdownUrl}): ${card.intent}`),
  '',
].join('\n');
await emit('patterns.md', `${frontmatter({
  title: 'Patterns',
  canonical: `${SITE}/patterns/`,
  license: LICENSE,
  generated: true,
})}${indexBody}`);
registerTwin('patterns.md', `${SITE}/patterns/`);

for (const [category, title] of Object.entries(CATEGORY_LABELS)) {
  const body = [
    `# ${title}`,
    '',
    ...orderedCards
      .filter((card) => card.category === category)
      .map((card) => `- [${card.title}](${card.markdownUrl}): ${card.intent}`),
    '',
  ].join('\n');
  const canonical = `${SITE}/patterns/`;
  await emit(`patterns/${category}.md`, `${frontmatter({
    title,
    canonical,
    license: LICENSE,
    generated: true,
  })}${body}`);
  registerTwin(`patterns/${category}.md`, canonical);
}

const references = await collectReferences(orderedCards.map((card) => ({
  title: card.title,
  href: `/patterns/${card.category}/${card.slug}/`,
  body: card.body,
})));
const referencesBody = [
  '# References',
  '',
  ...references.map((reference) => {
    const sources = reference.sources.map((source) => `[${source.title}](${new URL(source.href, SITE)})`).join(', ');
    return `- [${reference.label}](${reference.href}): Cited from ${sources}.`;
  }),
  '',
].join('\n');
await emit('references.md', `${frontmatter({
  title: 'References',
  canonical: `${SITE}/references/`,
  license: LICENSE,
  generated: true,
})}${referencesBody}`);
registerTwin('references.md', `${SITE}/references/`);

const llms = [
  '# Verification Design',
  '',
  '> Sourced principles and executable, stdlib-only Python pattern cards for verifying agent work: designing evals, checking tool-use output, and replacing self-review with external signals. Use when an agent must check its own or another agent\'s work.',
  '',
  'Content is licensed under CC BY 4.0. Every `.md` link below is the source markdown for the matching HTML page.',
  '',
  '## Principles',
  '',
  `- [Verification Design Principles](${SITE}/principles.md): The canonical principles document.`,
  `- [Raw principles source](${RAW_PRINCIPLES_URL}): The repository source file, raw markdown.`,
  '',
  ...Object.entries(CATEGORY_LABELS).flatMap(([category, title]) => [
    `## ${title}`,
    '',
    ...orderedCards
      .filter((card) => card.category === category)
      .map((card) => `- [${card.title}](${card.markdownUrl}): ${card.intent}`),
    '',
  ]),
  '## References',
  '',
  `- [References](${SITE}/references.md): Deduplicated sources and the pages that cite them.`,
  '',
  '## Source',
  '',
  `- [Repository](${REPO_URL}): Source repository.`,
  '- [License](https://creativecommons.org/licenses/by/4.0/): CC BY 4.0.',
  '',
  '## Optional',
  '',
  `- [About](${SITE}/about/): A human-facing introduction for operators.`,
  '',
].join('\n');
await emit('llms.txt', llms);

const fullBlocks = [
  { canonical: `${SITE}/principles/`, source: 'verification_design.md', body: principlesBody },
  ...orderedCards.map((card) => ({ canonical: card.canonical, source: card.source, body: card.body })),
  { canonical: `${SITE}/references/`, source: 'generated', body: referencesBody },
];
const full = fullBlocks.map((block) => [
  '---',
  `Canonical: ${block.canonical}`,
  `Source: ${block.source}`,
  '',
  block.body.replace(/\n$/, ''),
  '',
].join('\n')).join('\n');
await emit('llms-full.txt', full);

const headerRules = twins.map((twin) => [
  twin.path,
  `  Link: <${twin.canonical}>; rel="canonical"`,
].join('\n')).join('\n\n');
const staticHeaders = (await readFile(resolve(process.cwd(), 'public/_headers'), 'utf8'))
  .replace(/\r\n/g, '\n')
  .replace(/\n*$/, '\n');
await writeFile(join(DIST, '_headers'), `${staticHeaders}\n${headerRules}\n`, 'utf8');

console.log(`Generated markdown twins: ${twins.length}`);
console.log(`Generated llms.txt card entries: ${orderedCards.length}`);
console.log(`Generated llms-full.txt content blocks: ${fullBlocks.length}`);
console.log(`Appended canonical header rules: ${twins.length}`);
