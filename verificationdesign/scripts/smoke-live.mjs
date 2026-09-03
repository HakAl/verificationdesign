import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const SITE = 'https://verificationdesign.com';
const base = (process.argv[2] ?? SITE).replace(/\/$/, '');
const repo = resolve(process.cwd(), '..');
const cardsDir = join(repo, 'ai-design-patterns/cards');
let failures = 0;

function sourceBody(text) {
  return `${text.replace(/\r\n/g, '\n').replace(/\n*$/, '')}\n`;
}

function titleOf(text) {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
}

function intentOf(text) {
  return text.match(/^## Intent\s*\n+([^\n]+)/m)?.[1]?.replace(/[*`]/g, '').trim().replace(/\s+/g, ' ') ?? '';
}

function decodeHtml(value) {
  return value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function categoryOf(text) {
  const label = text.match(/^\*\(([^)]+ Pattern)\)\*\s*$/m)?.[1];
  return ({ 'Context Pattern': 'context-and-state', 'Verification Pattern': 'verification', 'Orchestration Pattern': 'orchestration' })[label];
}

async function request(path, expectedType, marker, canonical, optional = false) {
  try {
    const response = await fetch(`${base}${path}`);
    const body = await response.text();
    const type = response.headers.get('content-type') ?? '';
    const link = response.headers.get('link') ?? '';
    const markerFound = typeof marker === 'function' ? marker(body) : body.includes(marker);
    console.log(`${path}: status=${response.status} content_type=${JSON.stringify(type)} link=${JSON.stringify(link)} marker=${markerFound}`);
    if (optional) return;
    if (response.status !== 200 || !type.toLowerCase().startsWith(expectedType) || !markerFound) failures += 1;
    if (canonical && link !== `<${canonical}>; rel="canonical"`) failures += 1;
  } catch (error) {
    console.log(`${path}: request_error=${JSON.stringify(error.message)}`);
    if (!optional) failures += 1;
  }
}

const cards = [];
for (const file of (await readdir(cardsDir)).filter((name) => name.endsWith('.md'))) {
  const text = sourceBody(await readFile(join(cardsDir, file), 'utf8'));
  const category = categoryOf(text);
  if (!category) continue;
  cards.push({ category, slug: file.replace(/\.md$/, ''), title: titleOf(text), intent: intentOf(text) });
}

const twins = [
  { path: '/principles.md', h1: '# Verification Design Principles', canonical: `${SITE}/principles/` },
  { path: '/patterns.md', h1: '# Patterns', canonical: `${SITE}/patterns/` },
  { path: '/patterns/context-and-state.md', h1: '# Context and State Patterns', canonical: `${SITE}/patterns/` },
  { path: '/patterns/verification.md', h1: '# Verification Patterns', canonical: `${SITE}/patterns/` },
  { path: '/patterns/orchestration.md', h1: '# Orchestration Patterns', canonical: `${SITE}/patterns/` },
  { path: '/references.md', h1: '# References', canonical: `${SITE}/references/` },
  ...cards.map((card) => ({
    path: `/patterns/${card.category}/${card.slug}.md`,
    h1: `# ${card.title}`,
    canonical: `${SITE}/patterns/${card.category}/${card.slug}/`,
  })),
];
for (const twin of twins) {
  await request(twin.path, 'text/markdown', (body) => body.replace(/^---\n[\s\S]*?\n---\n+/, '').split('\n')[0] === twin.h1, twin.canonical);
}
await request('/llms.txt', 'text/plain', (body) => body.split(/\r?\n/)[0] === '# Verification Design');
await request('/llms-full.txt', 'text/plain', (body) => body.startsWith('---\nCanonical: https://verificationdesign.com/principles/\nSource: verification_design.md\n'));
await request('/catalog.json', 'application/json', (body) => { try { return JSON.parse(body).cards?.length === 17; } catch { return false; } });
for (const path of ['/', '/patterns/']) {
  await request(path, 'text/html', (body) => {
    const html = decodeHtml(body);
    const agentLinks = ['/llms.txt', '/llms-full.txt'].filter((href) => html.includes(`href="${href}"`)).length;
    const ghosts = html.split('card-gloss-ghost').length - 1;
    const intentsOnce = cards.filter((card) => html.split(card.intent).length === 2).length;
    console.log(`${path}: agent_links=${agentLinks}/2 ghosts=${ghosts} intents_once=${intentsOnce}/${cards.length}`);
    return agentLinks === 2 && ghosts === 0 && intentsOnce === cards.length;
  });
}
await request('/principles.md/', '', () => true, undefined, true);
console.log(`Live smoke summary: checked=${twins.length + 6} failures=${failures}`);
if (failures) process.exit(1);
