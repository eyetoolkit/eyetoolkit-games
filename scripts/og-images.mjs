/**
 * Build-time social card generator — one 1200x630 PNG per game.
 *
 * Before this, all 132 games shared a single og-image.png, so every shared
 * link produced an identical preview. Each card is now tinted by category and
 * carries the game name, its tagline and the site branding.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { GAME_NAMES, GAME_COUNT, CATEGORY_META, catOf, resolveMeta, slugify } from "../src/games/catalog.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist", "og");

const W = 1200;
const H = 630;
const FONT = "DejaVu Sans, Liberation Sans, sans-serif";
const DEFAULT_TINT = "129,140,248";

const esc = (s) => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Rough advance-width estimate (DejaVu Sans) — used for manual line wrapping. */
const textW = (str, size, weight = 400) => str.length * size * (weight >= 700 ? 0.62 : 0.56);

function wrap(text, size, maxW, weight = 400, maxLines = 2) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
        const next = cur ? `${cur} ${w}` : w;
        if (textW(next, size, weight) > maxW && cur) {
            lines.push(cur);
            cur = w;
            if (lines.length === maxLines) break;
        } else {
            cur = next;
        }
    }
    if (lines.length < maxLines && cur) lines.push(cur);
    if (lines.length === maxLines) {
        // Signal truncation with an ellipsis rather than silently dropping words.
        const consumed = lines.join(" ").length;
        if (consumed < String(text).length) {
            let last = lines[maxLines - 1];
            while (textW(`${last}…`, size, weight) > maxW && last.length > 1) last = last.slice(0, -1);
            lines[maxLines - 1] = `${last}…`;
        }
    }
    return lines;
}

function card({ name, catLabel, tint, desc }) {
    const maxW = W - 180;

    // Shrink long game names so nothing overflows the card.
    let nameSize = 92;
    while (textW(name, nameSize, 700) > maxW && nameSize > 40) nameSize -= 2;

    const descLines = wrap(desc, 30, maxW, 400, 2);
    const nameY = 300;
    const descY = nameY + 66;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f0f23"/>
      <stop offset="55%" stop-color="#16213e"/>
      <stop offset="100%" stop-color="#1a1a3e"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="62%">
      <stop offset="0%" stop-color="rgba(${tint},0.42)"/>
      <stop offset="100%" stop-color="rgba(${tint},0)"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgb(${tint})"/>
      <stop offset="100%" stop-color="rgba(${tint},0.15)"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="10" fill="url(#accent)"/>

  <!-- category chip -->
  <g>
    <rect x="90" y="96" rx="999" ry="999" height="44" width="${Math.max(120, textW(catLabel.toUpperCase(), 22, 700) + catLabel.length * 3 + 56)}" fill="rgba(${tint},0.18)" stroke="rgba(${tint},0.45)"/>
    <text x="${90 + 28}" y="126" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="3" fill="rgb(${tint})">${esc(catLabel.toUpperCase())}</text>
  </g>

  <!-- game name -->
  <text x="90" y="${nameY}" font-family="${FONT}" font-size="${nameSize}" font-weight="700" fill="#ffffff">${esc(name)}</text>

  <!-- tagline -->
  ${descLines.map((l, i) => `<text x="90" y="${descY + i * 42}" font-family="${FONT}" font-size="30" font-weight="400" fill="#aab6cd">${esc(l)}</text>`).join("\n  ")}

  <!-- footer -->
  <line x1="90" y1="${H - 108}" x2="${W - 90}" y2="${H - 108}" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
  <text x="90" y="${H - 62}" font-family="${FONT}" font-size="26" font-weight="700" fill="#eef2ff">Bytecade Games</text>
  <text x="90" y="${H - 28}" font-family="${FONT}" font-size="20" font-weight="400" fill="#7c8aa5">${GAME_COUNT}+ free mini games · no ads · no login</text>
  <text x="${W - 90}" y="${H - 62}" text-anchor="end" font-family="${FONT}" font-size="46" font-weight="700" fill="rgba(${tint},0.85)">▸</text>
</svg>`;
}

mkdirSync(OUT, { recursive: true });

let n = 0;
for (const name of GAME_NAMES) {
    const m = resolveMeta(name);
    const c = CATEGORY_META[catOf(name)];
    const tint = c?.tint || DEFAULT_TINT;
    const catLabel = c?.label || "Mini Game";
    let desc = m.desc || `Play ${name} free in your browser`;
    desc = desc.replace(/\s*Free, no ads, no login.*$/, "").trim();

    const svg = card({ name, catLabel, tint, desc });
    // Render at the exact 1200x630 OG size and quantise — this is a flat
    // vector design, so a 128-colour palette is visually lossless and keeps
    // each card around 30-40 kB instead of ~350 kB.
    const png = await sharp(Buffer.from(svg))
        .png({ compressionLevel: 9, palette: true, colours: 128 })
        .toBuffer();
    writeFileSync(join(OUT, `${slugify(name)}.png`), png);
    n++;
}

console.log(`[og-images] generated ${n} social cards in dist/og/`);
