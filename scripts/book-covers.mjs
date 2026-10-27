import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildCatalog, groups } from './data/books-catalog.mjs';

const escapeXml = (text) => String(text).normalize('NFC').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
export function wrapCoverText(text, max = 21) {
  const lines = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    if (current && `${current} ${word}`.length > max) { lines.push(current); current = word; }
    else current = current ? `${current} ${word}` : word;
  }
  if (current) lines.push(current);
  return lines;
}
export function makeBookCover(product, category, index) {
  const group = groups.find((entry) => entry.slug === category.slug);
  const color = group?.color ?? '#304d40';
  const titleLines = wrapCoverText(product.name, 16);
  const fontSize = titleLines.length > 5 ? 26 : 30;
  // Natural glyph spacing keeps Vietnamese combining marks attached correctly.
  const title = titleLines.map((line, n) => `<tspan x="43" y="${172 + n * (fontSize + 10)}">${escapeXml(line)}</tspan>`).join('');
  const author = product.author.split(';').length > 2 ? `${product.author.split(';')[0]} và cộng sự` : product.author.replaceAll(';', ' &');
  const authors = wrapCoverText(author, 34).map((line, n) => `<tspan x="43" y="${470 + n * 23}">${escapeXml(line)}</tspan>`).join('');
  const categoryLines = wrapCoverText(category.name.toUpperCase(), 35).map((line, n) => `<tspan x="43" y="${88 + n * 19}">${escapeXml(line)}</tspan>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(product.name)} — bìa minh họa demo</title><desc id="desc">Bìa chữ và hình học do NextBooks tự thiết kế. Không phải bìa xuất bản chính thức.</desc>
<rect width="400" height="600" fill="${color}"/><rect x="0" width="15" height="600" fill="#000" opacity=".18"/>
<path d="M252 0h148v160L252 0Z" fill="#fff" opacity=".08"/><circle cx="390" cy="440" r="130" fill="none" stroke="#fff" stroke-width="25" opacity=".06"/>
<text x="43" y="43" fill="#f3dec1" font-family="Arial,sans-serif" font-size="12" letter-spacing="3">NEXTBOOKS / DEMO</text>
<text fill="#f3dec1" font-family="Arial,sans-serif" font-size="12" letter-spacing="1">${categoryLines}</text>
<path d="M43 130h55" stroke="#f3dec1" stroke-width="3"/>
<text fill="#fff8ed" font-family="Arial,sans-serif" font-weight="bold" font-size="${fontSize}">${title}</text>
<text fill="#f3dec1" font-family="Arial,sans-serif" font-size="16">${authors}</text>
<path d="M43 534h314" stroke="#fff" stroke-opacity=".3"/>
<text x="43" y="558" fill="#fff8ed" font-family="Arial,sans-serif" font-size="10">BÌA MINH HỌA · KHÔNG PHẢI ẤN BẢN GỐC</text>
<text x="43" y="580" fill="#f3dec1" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">THƯ VIỆN PHÁT TRIỂN</text><text x="355" y="580" fill="#f3dec1" text-anchor="end" font-family="Arial,sans-serif" font-size="10">${String(index + 1).padStart(3, '0')}</text></svg>`;
}
export function generateBookCovers() {
  const catalog = buildCatalog();
  const folder = new URL('../public/demo-covers/', import.meta.url);
  mkdirSync(folder, { recursive: true });
  catalog.products.forEach((product, index) => {
    const category = catalog.categories.find((entry) => entry.id === product.categoryId);
    writeFileSync(new URL(`${product.slug}.svg`, folder), makeBookCover(product, category, index), 'utf8');
  });
  return { count: catalog.products.length, directory: fileURLToPath(folder) };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log(generateBookCovers());
