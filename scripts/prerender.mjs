/**
 * Post-build prerender: emits a static HTML file for every crawlable route.
 *
 * Without this, every URL on the site serves one identical SPA shell, so
 * crawlers that don't execute JS (and Googlebot's first pass) only ever see
 * the homepage. We rewrite the <head> per route and inject a real <body>
 * mirroring what React renders, so the page is meaningful with JS off.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
    GAME_NAMES, GAME_COUNT, CATEGORY_META, catOf, resolveMeta, slugify,
} from "../src/games/catalog.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://bytecade.mathduel.games";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const LEGAL = {
    privacy: { title: "Privacy Policy", desc: "How Bytecade Games handles your data and its plan for advertising.", h1: "🔒 Privacy Policy" },
    terms: { title: "Terms of Service", desc: "The rules for using Bytecade Games' free mini-game collection.", h1: "📜 Terms of Service" },
    cookies: { title: "Cookie Policy", desc: "What cookies Bytecade Games uses and how to control them.", h1: "🍪 Cookie Policy" },
    about: { title: "About Bytecade Games", desc: "Who runs Bytecade Games and our sister sites in the mathduel.games network.", h1: "ℹ️ About Bytecade Games" },
};

const esc = (s) => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const shell = readFileSync(join(DIST, "index.html"), "utf8");

/** Replace a tag if present, otherwise inject it just before </head>. */
function setTag(html, pattern, replacement) {
    if (pattern.test(html)) return html.replace(pattern, replacement);
    return html.replace("</head>", `    ${replacement}\n  </head>`);
}

const orgLd = { "@type": "Organization", name: "Bytecade Games", url: `${SITE_URL}/`, logo: OG_IMAGE, sameAs: ["https://github.com/eyetoolkit/eyetoolkit-games"] };
const siteLd = { "@type": "WebSite", name: "Bytecade Games", url: `${SITE_URL}/`, description: `${GAME_COUNT}+ free open-source browser mini games` };

const crumbLd = (items) => ({
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })),
});

function buildPage({ url, title, desc, ogType, image, graph, body, imageAlt }) {
    let html = shell;

    html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`);
    html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />`);

    html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`);
    html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`);
    html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${esc(url)}" />`);
    html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${esc(ogType)}" />`);
    html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}" />`);
    html = setTag(html, /<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${esc(imageAlt || title)}" />`);
    html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`);
    html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
    html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(image)}" />`);

    // hreflang — this is the default (and currently only) language edition.
    html = html.replace(/\s*<link rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/g, "");
    html = setTag(html, /<link rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${esc(url)}" />\n    <link rel="alternate" hreflang="x-default" href="${esc(url)}" />\n    <link rel="alternate" hreflang="en" href="${esc(url)}" />`);

    // Swap the build-time JSON-LD for the route-specific one.
    html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
    const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": [orgLd, siteLd, ...graph] });
    html = html.replace("</head>", `\n    <script type="application/ld+json">${ld}</script>\n  </head>`);

    // Static, indexable body (React replaces it on hydration; non-JS crawlers keep it).
    html = html.replace(/(<div id="root">)([\s\S]*?)(<\/div>)/, (_m, a, _b, c) => `${a}${body}${c}`);

    return html;
}

const wrapBody = (inner) => `<main style="max-width:760px;margin:0 auto;padding:28px 20px 60px;color:#e8ecf6;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.7">${inner}</main>`;

/**
 * Emit a route as BOTH `route/index.html` (directory form) and
 * `route.html` (flat form). Cloudflare Pages resolves an extensionless URL
 * against either layout depending on its pretty-URL rules, so shipping both
 * guarantees a 200 at the clean URL instead of a redirect chain.
 */
function write(routePath, html) {
    const dir = join(DIST, routePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
    writeFileSync(join(DIST, `${routePath}.html`), html);
}

let count = 0;

/* ── Homepage ── */
{
    const url = `${SITE_URL}/`;
    const title = `Bytecade Games — ${GAME_COUNT}+ Free Mini Games`;
    const desc = `Bytecade Games — ${GAME_COUNT}+ free open-source browser mini games. No downloads, no ads, no accounts.`;

    const cards = GAME_NAMES.map(n => {
        const m = resolveMeta(n);
        const c = CATEGORY_META[catOf(n)];
        return `<li><a href="/game/${slugify(n)}">${esc(m.emoji)} ${esc(n)}</a>${c ? ` <em>${esc(c.label)}</em>` : ""}</li>`;
    }).join("");

    const cats = Object.entries(CATEGORY_META)
        .map(([k, v]) => `<li><a href="/?cat=${k}">${esc(v.emoji)} ${esc(v.label)}</a></li>`).join("");

    write("", buildPage({
        url, title, desc, ogType: "website", image: OG_IMAGE,
        graph: [],
        body: wrapBody(`
        <h1>${GAME_COUNT}+ free mini games to play right now</h1>
        <p>${esc(desc)}</p>
        <nav aria-label="Game categories"><h2>Browse by category</h2><ul>${cats}</ul></nav>
        <h2>All ${GAME_COUNT} games</h2>
        <ul>${cards}</ul>
    `),
    }));
    count++;
}

/* ── Game pages ── */
for (const name of GAME_NAMES) {
    const slug = slugify(name);
    const url = `${SITE_URL}/game/${slug}`;
    const m = resolveMeta(name);
    const cat = catOf(name);
    const c = CATEGORY_META[cat];
    const catLabel = c ? c.label : null;
    const image = `${SITE_URL}/og/${slug}.png`;
    const title = `Play ${name} Online Free — Bytecade Games`;
    const desc = `${name} — ${m.desc}. Free, no ads, no login. Part of Bytecade Games.`;

    const siblings = GAME_NAMES.filter(n => n !== name && catOf(n) === cat).slice(0, 8);
    const howTo = (m.howToPlay && m.howToPlay.length)
        ? `<h2>How to Play</h2><ol>${m.howToPlay.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : "";
    const sibList = siblings.length
        ? `<h2>More ${esc(catLabel || "")} games</h2><nav aria-label="More ${esc(catLabel || "")} games"><ul>${siblings
            .map(n => `<li><a href="/game/${slugify(n)}">${esc(resolveMeta(n).emoji)} ${esc(n)}</a></li>`).join("")}</ul></nav>` : "";

    write(`game/${slug}`, buildPage({
        url, title, desc, ogType: "game", image, imageAlt: `Play ${name} free on Bytecade Games`,
        graph: [
            {
                "@type": "VideoGame",
                name,
                description: desc,
                url,
                image,
                applicationCategory: "Game",
                genre: catLabel || "Mini Game",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: { "@type": "Organization", name: "Bytecade Games", url: SITE_URL },
            },
            crumbLd([
                { name: "Home", item: `${SITE_URL}/` },
                ...(catLabel ? [{ name: catLabel, item: `${SITE_URL}/?cat=${cat}` }] : []),
                { name, item: url },
            ]),
        ],
        body: wrapBody(`
        <nav aria-label="Breadcrumb"><a href="/">Home</a>${catLabel ? ` › <a href="/?cat=${cat}">${esc(catLabel)}</a>` : ""} › <span>${esc(name)}</span></nav>
        <h1>${esc(m.emoji)} ${esc(name)}</h1>
        <p>${esc(m.description || desc)}</p>
        ${howTo}
        ${sibList}
        <p><a href="/">← Back to all ${GAME_COUNT} games</a></p>
    `),
    }));
    count++;
}

/* ── Legal pages ── */
for (const [page, meta] of Object.entries(LEGAL)) {
    const url = `${SITE_URL}/${page}`;
    const title = `${meta.title} — Bytecade Games`;
    write(page, buildPage({
        url, title, desc: meta.desc, ogType: "website", image: OG_IMAGE,
        graph: [
            { "@type": "WebPage", name: title, description: meta.desc, url, isPartOf: { "@type": "WebSite", name: "Bytecade Games", url: `${SITE_URL}/` } },
            crumbLd([{ name: "Home", item: `${SITE_URL}/` }, { name: meta.title, item: url }]),
        ],
        body: wrapBody(`
        <nav aria-label="Breadcrumb"><a href="/">Home</a> › <span>${esc(meta.title)}</span></nav>
        <h1>${esc(meta.h1)}</h1>
        <p>${esc(meta.desc)}</p>
        <p><a href="/">← Back to all ${GAME_COUNT} games</a></p>
    `),
    }));
    count++;
}

console.log(`[prerender] wrote ${count} static HTML files (${GAME_COUNT} games + home + ${Object.keys(LEGAL).length} legal)`);
