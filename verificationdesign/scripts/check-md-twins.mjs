import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const SITE = 'https://verificationdesign.com';
// Fixture: the only GitHub origin any generated link may point at.
const REPO_FIXTURE = 'https://github.com/verificationdesign/verificationdesign';
const RAW_FIXTURE = 'https://raw.githubusercontent.com/verificationdesign/verificationdesign/';
const REPO = resolve(process.cwd(), '..');
const CARDS_DIR = join(REPO, 'ai-design-patterns/cards');
const DIST = resolve(process.cwd(), 'dist');
const ORDER = [
  'context-and-state/constitution',
  'context-and-state/guardrail-decorator',
  'context-and-state/causal-tag',
  'context-and-state/trajectory-cursor',
  'context-and-state/state-baseline',
  'verification/executable-analog',
  'verification/blind-oracle',
  'verification/comparator',
  'verification/delta',
  'verification/judge-harness',
  'verification/admissibility-gate',
  'orchestration/cross-family',
  'orchestration/adversary',
  'orchestration/debate',
  'orchestration/escalation-chain',
  'orchestration/backpressure',
  'orchestration/tool-adapter',
];
const CATEGORY = {
  'Context Pattern': 'context-and-state',
  'Verification Pattern': 'verification',
  'Orchestration Pattern': 'orchestration',
};
const FIXED = ['principles.md', 'patterns.md', 'patterns/context-and-state.md',
  'patterns/verification.md', 'patterns/orchestration.md', 'references.md'];
const errors = [];

function fail(message) {
  errors.push(message);
}

function normalizeBody(value) {
  return `${value.replace(/\r\n/g, '\n').replace(/\n*$/, '')}\n`;
}

function unquote(value, context) {
  if (!/^"(?:[^"\\]|\\["\\])*"$/.test(value)) {
    fail(`${context}: invalid double-quoted scalar`);
    return '';
  }
  return value.slice(1, -1).replace(/\\(["\\])/g, '$1');
}

function parseTwin(contents, path) {
  const normalized = contents.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    fail(`${path}: missing opening frontmatter delimiter`);
    return { data: {}, related: [], body: normalized };
  }
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) {
    fail(`${path}: missing closing frontmatter delimiter`);
    return { data: {}, related: [], body: '' };
  }
  const lines = normalized.slice(4, end).split('\n');
  const data = {};
  const related = [];
  let inRelated = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === 'related:') {
      if (inRelated || Object.hasOwn(data, 'related')) fail(`${path}: duplicate related key`);
      data.related = true;
      inRelated = true;
      continue;
    }
    if (inRelated && line.startsWith('  - title: ')) {
      const title = unquote(line.slice(11), `${path} related title`);
      const urlLine = lines[i + 1] ?? '';
      if (!urlLine.startsWith('    url: ')) {
        fail(`${path}: related title lacks paired URL`);
      } else {
        related.push({ title, url: unquote(urlLine.slice(9), `${path} related URL`) });
        i += 1;
      }
      continue;
    }
    inRelated = false;
    const scalar = line.match(/^([a-z]+): (.+)$/);
    if (!scalar) {
      fail(`${path}: invalid frontmatter line: ${line}`);
      continue;
    }
    const [, key, raw] = scalar;
    if (Object.hasOwn(data, key)) fail(`${path}: duplicate frontmatter key: ${key}`);
    if (key === 'generated' && raw === 'true') data[key] = true;
    else data[key] = unquote(raw, `${path} ${key}`);
  }
  const bodyStart = end + 5;
  if (normalized[bodyStart] !== '\n') fail(`${path}: frontmatter must be followed by one blank line`);
  return { data, related, body: normalized.slice(bodyStart + 1) };
}

async function walkMarkdown(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walkMarkdown(path));
    else if (entry.name.endsWith('.md')) found.push(relative(DIST, path).split(sep).join('/'));
  }
  return found.sort();
}

const cards = [];
for (const file of (await readdir(CARDS_DIR)).filter((name) => name.endsWith('.md')).sort()) {
  const sourceBody = await readFile(join(CARDS_DIR, file), 'utf8');
  const title = sourceBody.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const subtitle = sourceBody.match(/^\*\(([^)]+ Pattern)\)\*\s*$/m)?.[1];
  const category = CATEGORY[subtitle];
  if (!title || !category) continue;
  const slug = file.replace(/\.md$/, '');
  cards.push({
    id: `${category}/${slug}`,
    title,
    category,
    slug,
    file,
    source: `ai-design-patterns/cards/${file}`,
    sourceBody: normalizeBody(sourceBody),
  });
}
const byId = new Map(cards.map((card) => [card.id, card]));
const byTitle = new Map(cards.map((card) => [card.title, card]));
const fixtureMissing = ORDER.filter((id) => !byId.has(id));
const fixtureExtra = cards.filter((card) => !ORDER.includes(card.id)).map((card) => card.id);
if (fixtureMissing.length || fixtureExtra.length) {
  fail(`reading-order membership mismatch; missing=${fixtureMissing.join(',') || 'none'} extra=${fixtureExtra.join(',') || 'none'}`);
}
console.log(`Check 11 reading-order fixture: fixture=${ORDER.length} filesystem=${cards.length} missing=${fixtureMissing.length} extra=${fixtureExtra.length}`);

const cardPaths = cards.map((card) => `patterns/${card.category}/${card.slug}.md`);
const expected = new Set([...FIXED, ...cardPaths]);
const actual = await walkMarkdown(DIST);
const missing = [...expected].filter((path) => !actual.includes(path));
const unexpected = actual.filter((path) => !expected.has(path));
for (const path of missing) fail(`missing expected twin: ${path}`);
for (const path of unexpected) fail(`unexpected markdown twin: ${path}`);
console.log(`Check 1 expected twins present: expected=${expected.size} found=${actual.filter((path) => expected.has(path)).length} missing=${missing.length}`);
console.log(`Check 2 unexpected twins absent: markdown_files=${actual.length} unexpected=${unexpected.length}`);

const parsed = new Map();
let metadataCompared = 0;
let bodiesCompared = 0;
let relatedResolved = 0;
for (const path of actual.filter((item) => expected.has(item))) {
  parsed.set(path, parseTwin(await readFile(join(DIST, path), 'utf8'), path));
}
const canonicalFor = (path) => {
  if (path === 'principles.md') return `${SITE}/principles/`;
  if (path === 'patterns.md') return `${SITE}/patterns/`;
  if (path === 'references.md') return `${SITE}/references/`;
  const categoryIndex = path.match(/^patterns\/([^/]+)\.md$/)?.[1];
  if (categoryIndex) return `${SITE}/patterns/`;
  return `${SITE}/${path.replace(/\.md$/, '/')}`;
};
for (const [path, twin] of parsed) {
  metadataCompared += 1;
  if (twin.data.canonical !== canonicalFor(path)) fail(`${path}: wrong canonical`);
  if (twin.data.license !== 'CC BY 4.0') fail(`${path}: wrong or missing license`);
  const card = cards.find((item) => path === `patterns/${item.category}/${item.slug}.md`);
  if (path === 'principles.md') {
    if (twin.data.source !== 'verification_design.md') fail(`${path}: wrong source`);
    const source = normalizeBody(await readFile(join(REPO, 'verification_design.md'), 'utf8'));
    bodiesCompared += 1;
    if (normalizeBody(twin.body) !== source) fail(`${path}: body differs from source`);
  } else if (card) {
    if (twin.data.source !== card.source) fail(`${path}: wrong source`);
    bodiesCompared += 1;
    if (normalizeBody(twin.body) !== card.sourceBody) fail(`${path}: body differs from source`);
    const relatedBlock = card.sourceBody.match(/##\s+Related Patterns\s*\n([\s\S]*?)(?=\n##\s|\n*$)/)?.[1] ?? '';
    const relatedNames = [...relatedBlock.matchAll(/\*\*([^*]+)\*\*/g)]
      .map((match) => match[1].trim().replace(/:$/, ''));
    const predicted = relatedNames.map((title) => {
      const target = byTitle.get(title);
      if (!target) {
        fail(`${path}: source names unknown related card ${title}`);
        return { title, url: '' };
      }
      return { title, url: `${SITE}/patterns/${target.category}/${target.slug}.md` };
    });
    relatedResolved += predicted.length;
    if (JSON.stringify(twin.related) !== JSON.stringify(predicted)) fail(`${path}: related pairs differ from source prediction`);
  } else if (twin.data.generated !== true) {
    fail(`${path}: generated twin lacks generated: true`);
  }
}
console.log(`Check 3 frontmatter metadata: parsed=${parsed.size} compared=${metadataCompared} malformed_errors=${errors.filter((e) => e.includes('frontmatter') || e.includes('canonical') || e.includes('source') || e.includes('license')).length}`);
console.log(`Check 4 source bodies: compared=${bodiesCompared} mismatches=${errors.filter((e) => e.includes('body differs')).length}`);
console.log(`Check 5 related mappings: card_twins=${cards.length} related_urls_resolved=${relatedResolved} mismatches=${errors.filter((e) => e.includes('related')).length}`);

const llmsText = (await readFile(join(DIST, 'llms.txt'), 'utf8')).replace(/\r\n/g, '\n');
const llmsLines = llmsText.split('\n');
const llmsLinks = [];
let inH2 = false;
let h2BodyLines = 0;
for (const line of llmsLines) {
  if (line.startsWith('## ')) { inH2 = true; continue; }
  if (!inH2 || line === '') continue;
  h2BodyLines += 1;
  const match = line.match(/^- \[[^\]]+\]\(([^)]+)\): .+$/);
  if (!match) fail(`llms.txt: invalid H2 body line: ${line}`);
  else llmsLinks.push(match[1]);
}
const internalMarkdown = llmsLinks
  .filter((url) => url.startsWith(`${SITE}/`) && url.endsWith('.md'))
  .map((url) => url.slice(SITE.length + 1));
const expectedLlms = new Set(['principles.md', 'references.md', ...cardPaths]);
for (const path of expectedLlms) {
  if (!internalMarkdown.includes(path)) fail(`llms.txt: omitted content twin ${path}`);
}
for (const path of internalMarkdown) {
  if (!expected.has(path)) fail(`llms.txt: link does not exist in dist: ${path}`);
}
const githubLinks = llmsLinks.filter((url) => /github(usercontent)?\.com/.test(url));
for (const url of githubLinks) {
  if (!(url === REPO_FIXTURE || url.startsWith(`${REPO_FIXTURE}/`) || url.startsWith(RAW_FIXTURE))) fail(`llms.txt: GitHub link outside repo fixture: ${url}`);
}
console.log(`Check 6b llms.txt repo links: github_links=${githubLinks.length} outside_fixture=${githubLinks.filter((url) => !(url === REPO_FIXTURE || url.startsWith(`${REPO_FIXTURE}/`) || url.startsWith(RAW_FIXTURE))).length}`);
console.log(`Check 6 llms.txt: H2_body_lines=${h2BodyLines} linked_entries=${llmsLinks.length} internal_twins=${internalMarkdown.length} required_twins=${expectedLlms.size}`);

const fullText = (await readFile(join(DIST, 'llms-full.txt'), 'utf8')).replace(/\r\n/g, '\n');
const blockRe = /(?:^|\n)---\nCanonical: ([^\n]+)\nSource: ([^\n]+)\n\n/g;
const blocks = [...fullText.matchAll(blockRe)];
const expectedCanonicals = [
  `${SITE}/principles/`,
  ...ORDER.map((id) => `${SITE}/patterns/${id}/`),
  `${SITE}/references/`,
];
const observedCanonicals = blocks.map((match) => match[1]);
if (JSON.stringify(observedCanonicals) !== JSON.stringify(expectedCanonicals)) fail('llms-full.txt: missing or incorrectly ordered content blocks');
const frontmatterBlocks = (fullText.match(/^---\n(?:title|canonical|source|license|generated|related):/gm) ?? []).length;
if (frontmatterBlocks) fail('llms-full.txt: contains a YAML frontmatter block');
console.log(`Check 7 llms-full.txt: blocks=${blocks.length} expected=${expectedCanonicals.length} frontmatter_blocks=${frontmatterBlocks}`);

const generatedFiles = [...actual.map((path) => join(DIST, path)), join(DIST, 'llms.txt'), join(DIST, 'llms-full.txt')];
let emDashCount = 0;
for (const path of generatedFiles) emDashCount += ((await readFile(path, 'utf8')).match(/\u2014/g) ?? []).length;
if (emDashCount) fail(`generated files contain ${emDashCount} em dashes`);
console.log(`Check 8 em dashes: files_scanned=${generatedFiles.length} observed=${emDashCount}`);

const htmlFiles = [];
async function walkHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walkHtml(path);
    else if (entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
await walkHtml(DIST);
const expectedAlternate = new Map([
  ['principles/index.html', '/principles.md'],
  ['patterns/index.html', '/patterns.md'],
  ['references/index.html', '/references.md'],
  ...cards.map((card) => [`patterns/${card.category}/${card.slug}/index.html`, `/patterns/${card.category}/${card.slug}.md`]),
]);
let alternateLinks = 0;
for (const htmlPath of htmlFiles) {
  const relativePath = relative(DIST, htmlPath).split(sep).join('/');
  const html = await readFile(htmlPath, 'utf8');
  const found = [...html.matchAll(/<link\s+rel="alternate"\s+type="text\/markdown"\s+href="([^"]+)"\s*\/?>/g)].map((match) => match[1]);
  alternateLinks += found.length;
  const expectedHref = expectedAlternate.get(relativePath);
  if (expectedHref && JSON.stringify(found) !== JSON.stringify([expectedHref])) fail(`${relativePath}: missing or wrong markdown alternate`);
  if (!expectedHref && found.length) fail(`${relativePath}: unexpected markdown alternate`);
}
console.log(`Check 9 HTML alternates: html_pages=${htmlFiles.length} twin_pages=${expectedAlternate.size} alternate_links=${alternateLinks}`);

const headers = (await readFile(join(DIST, '_headers'), 'utf8')).replace(/\r\n/g, '\n');
const ruleRe = /^(\/[^\n]+\.md)\n  Link: <([^>]+)>; rel="canonical"$/gm;
const headerRules = [...headers.matchAll(ruleRe)].map((match) => ({ path: match[1].slice(1), canonical: match[2] }));
for (const path of expected) {
  const rule = headerRules.find((item) => item.path === path);
  if (!rule) fail(`_headers: missing canonical rule for ${path}`);
  else if (rule.canonical !== canonicalFor(path)) fail(`_headers: wrong canonical for ${path}`);
}
for (const rule of headerRules) {
  if (!expected.has(rule.path)) fail(`_headers: canonical rule for non-twin ${rule.path}`);
}
console.log(`Check 10 canonical headers: expected=${expected.size} found=${headerRules.length} unexpected=${headerRules.filter((rule) => !expected.has(rule.path)).length}`);

if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  console.error(`Markdown twin checks failed: ${errors.length}`);
  process.exit(1);
}
console.log('Markdown twin checks failed: 0');
