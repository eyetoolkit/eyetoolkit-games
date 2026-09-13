/**
 * 🎮 Bytecade Games Portal
 * Standalone game collection page — /game-test
 * Lazy-loads individual game components
 */
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Legal from "../Legal";
import CookieConsent from "../CookieConsent";
import { GAME_META, CATEGORY_META, CATEGORIES, catOf, resolveMeta, slugify, GAME_COUNT, GAME_NAMES } from "./catalog";

/* ── Game registry (lazy imports) ───────────────── */
const games = {
    // Arcade
    Snake: lazy(() => import("./arcade/Snake")),
    MiniTetris: lazy(() => import("./arcade/MiniTetris")),
    MiniPacman: lazy(() => import("./arcade/MiniPacman")),
    Breakout: lazy(() => import("./arcade/Breakout")),
    FlappyJelly: lazy(() => import("./arcade/FlappyJelly")),
    PingPong: lazy(() => import("./arcade/PingPong")),
    SpaceInvader: lazy(() => import("./arcade/SpaceInvader")),
    Frogger: lazy(() => import("./arcade/Frogger")),
    Asteroids: lazy(() => import("./arcade/Asteroids")),
    JumpRunner: lazy(() => import("./arcade/JumpRunner")),
    Galaga: lazy(() => import("./arcade/Galaga")),
    DigDug: lazy(() => import("./arcade/DigDug")),
    Bomberman: lazy(() => import("./arcade/Bomberman")),
    DonkeyKong: lazy(() => import("./arcade/DonkeyKong")),
    // Reflex
    WhackAMole: lazy(() => import("./reflex/WhackAMole")),
    ReactionTest: lazy(() => import("./reflex/ReactionTest")),
    SpeedClick: lazy(() => import("./reflex/SpeedClick")),
    AimTrainer: lazy(() => import("./reflex/AimTrainer")),
    FruitSlice: lazy(() => import("./reflex/FruitSlice")),
    TimingTap: lazy(() => import("./reflex/TimingTap")),
    RhythmTap: lazy(() => import("./reflex/RhythmTap")),
    ColorSwitch: lazy(() => import("./reflex/ColorSwitch")),
    ArrowDodge: lazy(() => import("./reflex/ArrowDodge")),
    BubblePop: lazy(() => import("./reflex/BubblePop")),
    ShootingGallery: lazy(() => import("./reflex/ShootingGallery")),
    TypingWarrior: lazy(() => import("./reflex/TypingWarrior")),
    RopeCut: lazy(() => import("./reflex/RopeCut")),
    StroopTest: lazy(() => import("./reflex/StroopTest")),
    BombDefuse: lazy(() => import("./reflex/BombDefuse")),
    // Brain
    MathChallenge: lazy(() => import("./brain/MathChallenge")),
    NBack: lazy(() => import("./brain/NBack")),
    SimonSays: lazy(() => import("./brain/SimonSays")),
    PatternRecognition: lazy(() => import("./brain/PatternRecognition")),
    NumberMemory: lazy(() => import("./brain/NumberMemory")),
    BalanceScale: lazy(() => import("./brain/BalanceScale")),
    SequenceComplete: lazy(() => import("./brain/SequenceComplete")),
    Game24: lazy(() => import("./brain/Game24")),
    PrimeCheck: lazy(() => import("./brain/PrimeCheck")),
    CipherDecode: lazy(() => import("./brain/CipherDecode")),
    LogicGate: lazy(() => import("./brain/LogicGate")),
    BaseConvert: lazy(() => import("./brain/BaseConvert")),
    UnitConvert: lazy(() => import("./brain/UnitConvert")),
    FractionCompare: lazy(() => import("./brain/FractionCompare")),
    MathBreakout: lazy(() => import("./brain/MathBreakout")),
    // Creative
    PixelArt: lazy(() => import("./creative/PixelArt")),
    DrawAndGuess: lazy(() => import("./creative/DrawAndGuess")),
    ShadowMatch: lazy(() => import("./creative/ShadowMatch")),
    ColorMixer: lazy(() => import("./creative/ColorMixer")),
    DotConnect: lazy(() => import("./creative/DotConnect")),
    FlagQuiz: lazy(() => import("./creative/FlagQuiz")),
    EmojiCombo: lazy(() => import("./creative/EmojiCombo")),
    MandalaPaint: lazy(() => import("./creative/MandalaPaint")),
    GradientSort: lazy(() => import("./creative/GradientSort")),
    JigsawPuzzle: lazy(() => import("./creative/JigsawPuzzle")),
    SpotDifference: lazy(() => import("./creative/SpotDifference")),
    TileMosaic: lazy(() => import("./creative/TileMosaic")),
    SymmetryDraw: lazy(() => import("./creative/SymmetryDraw")),
    SpriteAnimator: lazy(() => import("./creative/SpriteAnimator")),
    // Luck
    CoinFlip: lazy(() => import("./luck/CoinFlip")),
    DicePredict: lazy(() => import("./luck/DicePredict")),
    Roulette: lazy(() => import("./luck/Roulette")),
    ScratchCard: lazy(() => import("./luck/ScratchCard")),
    RPS: lazy(() => import("./luck/RPS")),
    LuckyBox: lazy(() => import("./luck/LuckyBox")),
    FortuneWheel: lazy(() => import("./luck/FortuneWheel")),
    SlotMachine: lazy(() => import("./luck/SlotMachine")),
    BingoGame: lazy(() => import("./luck/BingoGame")),
    TreasureMap: lazy(() => import("./luck/TreasureMap")),
    DicePoker: lazy(() => import("./luck/DicePoker")),
    TreasureDig: lazy(() => import("./luck/TreasureDig")),
    LuckySeven: lazy(() => import("./luck/LuckySeven")),
    CardFortune: lazy(() => import("./luck/CardFortune")),
    // Puzzle
    Game2048: lazy(() => import("./puzzle/Game2048")),
    Minesweeper: lazy(() => import("./puzzle/Minesweeper")),
    MiniSudoku: lazy(() => import("./puzzle/MiniSudoku")),
    SlidePuzzle: lazy(() => import("./puzzle/SlidePuzzle")),
    Match3: lazy(() => import("./puzzle/Match3")),
    LightsOut: lazy(() => import("./puzzle/LightsOut")),
    PipeConnect: lazy(() => import("./puzzle/PipeConnect")),
    Sokoban: lazy(() => import("./puzzle/Sokoban")),
    TileMatch: lazy(() => import("./puzzle/TileMatch")),
    Nonogram: lazy(() => import("./puzzle/Nonogram")),
    HanoiTower: lazy(() => import("./puzzle/HanoiTower")),
    ColorCode: lazy(() => import("./puzzle/ColorCode")),
    BlockStack: lazy(() => import("./puzzle/BlockStack")),
    ColorSort: lazy(() => import("./puzzle/ColorSort")),
    KillerSudoku: lazy(() => import("./puzzle/KillerSudoku")),
    OneStroke: lazy(() => import("./puzzle/OneStroke")),
    ColumnsPuzzle: lazy(() => import("./puzzle/ColumnsPuzzle")),
    NumberCrossword: lazy(() => import("./puzzle/NumberCrossword")),
    RubiksCube2x2: lazy(() => import("./puzzle/RubiksCube2x2")),
    NonsenseQuiz: lazy(() => import("./puzzle/NonsenseQuiz")),
    // Sports
    GolfPutt: lazy(() => import("./sports/GolfPutt")),
    DartGame: lazy(() => import("./sports/DartGame")),
    BasketballShoot: lazy(() => import("./sports/BasketballShoot")),
    SoccerPK: lazy(() => import("./sports/SoccerPK")),
    ArcheryGame: lazy(() => import("./sports/ArcheryGame")),
    BowlingGame: lazy(() => import("./sports/BowlingGame")),
    FishingGame: lazy(() => import("./sports/FishingGame")),
    SkiSlalom: lazy(() => import("./sports/SkiSlalom")),
    PingPongRally: lazy(() => import("./sports/PingPongRally")),
    RocketLaunch: lazy(() => import("./sports/RocketLaunch")),
    // Strategy
    TowerDefense: lazy(() => import("./strategy/TowerDefense")),
    ResourceManager: lazy(() => import("./strategy/ResourceManager")),
    StockSim: lazy(() => import("./strategy/StockSim")),
    FarmManager: lazy(() => import("./strategy/FarmManager")),
    MazeEscape: lazy(() => import("./strategy/MazeEscape")),
    PlacementPuzzle: lazy(() => import("./strategy/PlacementPuzzle")),
    StrategyRPG: lazy(() => import("./strategy/StrategyRPG")),
    DeckBuilder: lazy(() => import("./strategy/DeckBuilder")),
    TerritoryWar: lazy(() => import("./strategy/TerritoryWar")),
    TradeSim: lazy(() => import("./strategy/TradeSim")),
    MiniWar: lazy(() => import("./strategy/MiniWar")),
    RoomEscape: lazy(() => import("./strategy/RoomEscape")),
    DeliveryRoute: lazy(() => import("./strategy/DeliveryRoute")),
    MerchantSim: lazy(() => import("./strategy/MerchantSim")),
    EnergyManager: lazy(() => import("./strategy/EnergyManager")),
    // Cards
    Blackjack: lazy(() => import("./cards/Blackjack")),
    HighLow: lazy(() => import("./cards/HighLow")),
    MemoryMatch: lazy(() => import("./cards/MemoryMatch")),
    SpeedCard: lazy(() => import("./cards/SpeedCard")),
    PokerHand: lazy(() => import("./cards/PokerHand")),
    WarCard: lazy(() => import("./cards/WarCard")),
    ConnectFour: lazy(() => import("./cards/ConnectFour")),
    Othello: lazy(() => import("./cards/Othello")),
    MiniGomoku: lazy(() => import("./cards/MiniGomoku")),
    DominoChain: lazy(() => import("./cards/DominoChain")),
    MiniGo: lazy(() => import("./cards/MiniGo")),
    ChessPuzzle: lazy(() => import("./cards/ChessPuzzle")),
    MiniCheckers: lazy(() => import("./cards/MiniCheckers")),
    MiniSolitaire: lazy(() => import("./cards/MiniSolitaire")),
    TripleTriad: lazy(() => import("./cards/TripleTriad")),
};

/* ── Game metadata (emoji + short description) ──── */

/* ── SEO helpers (dynamic OG / Twitter / canonical / JSON-LD) ── */
const SITE_URL = "https://bytecade.mathduel.games";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
// GAME_COUNT comes from the shared catalog so meta copy can never drift.

const setMetaProp = (prop, content) => {
    try {
        let el = document.head.querySelector(`meta[property="${prop}"]`);
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("property", prop);
            document.head.appendChild(el);
        }
        el.setAttribute("content", content);
    } catch (_) { /* noop */ }
};
const setMetaName = (name, content) => {
    try {
        let el = document.head.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement("meta");
            el.setAttribute("name", name);
            document.head.appendChild(el);
        }
        el.setAttribute("content", content);
    } catch (_) { /* noop */ }
};
const setCanonical = (href) => {
    try {
        let el = document.head.querySelector('link[rel="canonical"]');
        if (!el) {
            el = document.createElement("link");
            el.setAttribute("rel", "canonical");
            document.head.appendChild(el);
        }
        el.setAttribute("href", href);
    } catch (_) { /* noop */ }
};
const setHreflang = (href) => {
    // Declare the language/region alternatives so crawlers know this is the
    // canonical English (and default) edition of each URL.
    try {
        ["x-default", "en"].forEach(lang => {
            let el = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
            if (!el) {
                el = document.createElement("link");
                el.setAttribute("rel", "alternate");
                el.setAttribute("hreflang", lang);
                document.head.appendChild(el);
            }
            el.setAttribute("href", href);
        });
    } catch (_) { /* noop */ }
};
const setJsonLd = (id, data) => {
    try {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement("script");
            el.setAttribute("type", "application/ld+json");
            el.id = id;
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(data);
    } catch (_) { /* noop */ }
};
const removeJsonLd = (id) => {
    try {
        const el = document.getElementById(id);
        if (el) el.remove();
    } catch (_) { /* noop */ }
};

/* ── Inline global styles ──────────────────────── */
const GLOBAL_STYLES = `
* { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; min-height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%);
  color: white;
}
html, body { overflow-x: hidden; max-width: 100%; }
.bc-wrap { overflow-x: hidden; max-width: 100vw; }
@keyframes bcFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes bcFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes bcSpin { to { transform: rotate(360deg); } }
@keyframes bcPulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
.bc-fade-up { animation: bcFadeUp .5s cubic-bezier(.22,.9,.32,1) both; }
.bc-fade-in { animation: bcFadeIn .32s ease both; }
.bc-spin { animation: bcSpin .9s linear infinite; }
.bc-pulse { animation: bcPulse 1.6s ease-in-out infinite; }
.bc-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.bc-scroll::-webkit-scrollbar-track { background: transparent; }
.bc-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.11); border-radius: 8px; }
.bc-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.18); }
button { font-family: inherit; }
/* ── Cookie bar clearance ──
   The consent bar is position:fixed, so it would sit on top of the last row of
   cards (or a game's D-pad) until the visitor answers. Reserve the space while
   it is on screen. */
body.bc-has-cc footer { padding-bottom: calc(var(--bc-cc-height, 104px) + 28px) !important; }
@media (max-width: 1099px) {
  body.bc-has-cc .bc-stage-scroll { padding-bottom: calc(var(--bc-cc-height, 104px) + 30px) !important; }
}
/* ── Home: search + cards ── */
.bc-search-input { height: 48px; }
.bc-search-input::placeholder { color: #64748b; }
.bc-card { will-change: transform; }
@media (prefers-reduced-motion: reduce) {
  .bc-card, .bc-fade-up, .bc-fade-in { animation: none !important; }
  .bc-card { transition: none !important; }
}
/* ── Mobile navigation ── */
.bc-nav-desktop { display: flex; gap: 4px; }
.bc-nav-toggle { display: none; }
.bc-nav-drawer { display: none; }
@media (max-width: 720px) {
  .bc-hide-sm { display: none !important; }
  .bc-nav-desktop { display: none !important; }
  .bc-nav-toggle { display: inline-flex !important; }
  .bc-nav-drawer { display: block !important; }
  .bc-hero-h1 { font-size: 26px !important; line-height: 1.25 !important; }
  .bc-hero-sub { font-size: 14px !important; }
  .bc-shell-pad { padding-left: 16px !important; padding-right: 16px !important; }
}
@media (hover: hover) {
  .bc-iconbtn:hover { background: rgba(255,255,255,.14) !important; border-color: rgba(255,255,255,.24) !important; }
  .bc-lift:hover { transform: translateY(-2px); }
}
`;

/* ── FitGame: scale any over-wide game down so it fits the phone viewport ──
   Many games render at a fixed pixel size (canvas boards, 480-800px). On a
   phone those overflow the stage and get clipped by overflow:hidden. This
   measures the game's TRUE rendered width from its descendants' rects —
   getBoundingClientRect reports layout position even when an ancestor clips
   with overflow:hidden, which scrollWidth does not — and applies a uniform
   transform:scale so the whole game stays visible. Responsive games measure
   <= the container, so scale stays 1. */
const FitGame = ({ children }) => {
    const wrapRef = useRef(null);
    const contentRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [boxH, setBoxH] = useState(undefined);

    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        const content = contentRef.current;
        if (!wrap || !content) return;
        const measure = () => {
            // Reset the transform so we read the UN-scaled layout, then restore what
            // React last applied (leaving it at scale(1) sticks: setState with an
            // unchanged value does not re-render, so the DOM never gets corrected).
            const prevT = content.style.transform;
            content.style.transform = "translate(0px, 0px) scale(1)";
            const avail = wrap.clientWidth;
            // Measure the REAL bounding box of every descendant. This catches content
            // that overflow:hidden hides from scrollWidth/scrollHeight — e.g. a board
            // centred in a shorter container (overflows BOTH top and bottom) or
            // absolutely-positioned decorations that stick out.
            let minLeft = Infinity, maxRight = -Infinity, minTop = Infinity, maxBottom = -Infinity;
            for (const el of content.querySelectorAll("*")) {
                const r = el.getBoundingClientRect();
                if (r.width < 1 || r.height < 1) continue;
                if (r.left < minLeft) minLeft = r.left;
                if (r.right > maxRight) maxRight = r.right;
                if (r.top < minTop) minTop = r.top;
                if (r.bottom > maxBottom) maxBottom = r.bottom;
            }
            const base = content.getBoundingClientRect();
            if (!isFinite(minLeft)) { minLeft = base.left; maxRight = base.right; }
            if (!isFinite(minTop)) { minTop = base.top; maxBottom = base.bottom; }
            const spanW = Math.max(maxRight - minLeft, base.width);
            const spanH = Math.max(maxBottom - minTop, base.height);
            content.style.transform = prevT || "translate(0px, 0px) scale(1)";
            const s = spanW > avail + 1 ? avail / spanW : 1;
            const tx = s < 1 ? -(minLeft - base.left) * s : 0;
            const ty = s < 1 ? -(minTop - base.top) * s : 0;
            setScale(s);
            setOffsetX(tx);
            setOffsetY(ty);
            setBoxH(spanH * s);
        };
        measure();
        const t = setTimeout(measure, 350);
        // Re-measure when the game's own content changes size (board appears on start,
        // result panel, etc.). Observing `content` is safe: measure() only touches
        // transform/height, which does not change content's border-box.
        let ro;
        try { ro = new ResizeObserver(() => measure()); ro.observe(content); } catch (_) { /* noop */ }
        window.addEventListener("resize", measure);
        return () => {
            clearTimeout(t);
            try { ro && ro.disconnect(); } catch (_) { /* noop */ }
            window.removeEventListener("resize", measure);
        };
    }, []);

    return (
        <div ref={wrapRef} style={{ width: "100%", overflow: "hidden", height: boxH }}>
            <div ref={contentRef} style={{ width: "100%", transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`, transformOrigin: "top left" }}>
                {children}
            </div>
        </div>
    );
};

/* ── Routing (path-based, CF Pages SPA fallback serves index.html) ── */
const SLUG_MAP = new Map(Object.keys({
    Snake: 1, MiniTetris: 1, MiniPacman: 1, Breakout: 1, FlappyJelly: 1, PingPong: 1,
    SpaceInvader: 1, Frogger: 1, Asteroids: 1, JumpRunner: 1, Galaga: 1, DigDug: 1,
    Bomberman: 1, DonkeyKong: 1, WhackAMole: 1, ReactionTest: 1, SpeedClick: 1, AimTrainer: 1,
    FruitSlice: 1, TimingTap: 1, RhythmTap: 1, ColorSwitch: 1, ArrowDodge: 1, BubblePop: 1,
    ShootingGallery: 1, TypingWarrior: 1, RopeCut: 1, StroopTest: 1, BombDefuse: 1,
    MathChallenge: 1, NBack: 1, SimonSays: 1, PatternRecognition: 1, NumberMemory: 1,
    BalanceScale: 1, SequenceComplete: 1, Game24: 1, PrimeCheck: 1, CipherDecode: 1,
    LogicGate: 1, BaseConvert: 1, UnitConvert: 1, FractionCompare: 1, MathBreakout: 1,
    PixelArt: 1, DrawAndGuess: 1, ShadowMatch: 1, ColorMixer: 1, DotConnect: 1, FlagQuiz: 1,
    EmojiCombo: 1, MandalaPaint: 1, GradientSort: 1, JigsawPuzzle: 1, SpotDifference: 1,
    TileMosaic: 1, SymmetryDraw: 1, SpriteAnimator: 1, CoinFlip: 1, DicePredict: 1,
    Roulette: 1, ScratchCard: 1, RPS: 1, LuckyBox: 1, FortuneWheel: 1, SlotMachine: 1,
    BingoGame: 1, TreasureMap: 1, DicePoker: 1, TreasureDig: 1, LuckySeven: 1, CardFortune: 1,
    Game2048: 1, Minesweeper: 1, MiniSudoku: 1, SlidePuzzle: 1, Match3: 1, LightsOut: 1,
    PipeConnect: 1, Sokoban: 1, TileMatch: 1, Nonogram: 1, HanoiTower: 1, ColorCode: 1,
    BlockStack: 1, ColorSort: 1, KillerSudoku: 1, OneStroke: 1, ColumnsPuzzle: 1,
    NumberCrossword: 1, RubiksCube2x2: 1, GolfPutt: 1, DartGame: 1, BasketballShoot: 1,
    SoccerPK: 1, ArcheryGame: 1, BowlingGame: 1, FishingGame: 1, SkiSlalom: 1,
    PingPongRally: 1, RocketLaunch: 1, TowerDefense: 1, ResourceManager: 1, StockSim: 1,
    FarmManager: 1, MazeEscape: 1, PlacementPuzzle: 1, StrategyRPG: 1, DeckBuilder: 1,
    TerritoryWar: 1, TradeSim: 1, MiniWar: 1, RoomEscape: 1, DeliveryRoute: 1,
    MerchantSim: 1, EnergyManager: 1, Blackjack: 1, HighLow: 1, MemoryMatch: 1,
    SpeedCard: 1, PokerHand: 1, WarCard: 1, ConnectFour: 1, Othello: 1, MiniGomoku: 1,
    DominoChain: 1, MiniGo: 1, ChessPuzzle: 1, MiniCheckers: 1, MiniSolitaire: 1,
    TripleTriad: 1, NonsenseQuiz: 1,
}).map(n => [slugify(n), n]));

const gameFromPath = () => {
    try {
        const m = window.location.pathname.match(/^\/game\/([a-z0-9-]+)/i);
        return m ? (SLUG_MAP.get(m[1].toLowerCase()) || null) : null;
    } catch (_) { return null; }
};

/* ── Static / legal pages routing ────────────────── */
const pageFromPath = () => {
    try {
        const m = window.location.pathname.match(/^\/(privacy|terms|cookies|about)\/?$/i);
        return m ? m[1].toLowerCase() : null;
    } catch (_) { return null; }
};

/* ── Sister duel sites (funnel targets) ────────── */
const DUEL_SITES = {
    mathduel:   { url: "https://mathduel.games",   name: "MathDuel",   tagline: "Real-time math duels" },
    boardduel:  { url: "https://boardduel.com",    name: "BoardDuel",  tagline: "Board & card duels vs real people" },
    memoryduel: { url: "https://memoryduel.com",   name: "MemoryDuel", tagline: "Memory & reaction face-offs" },
};
const CAT_DUEL = { brain: "mathduel", puzzle: "mathduel", cards: "boardduel", strategy: "boardduel", reflex: "memoryduel" };
const duelFor = (name) => CAT_DUEL[catOf(name)] || null;

/* ── Component ──────────────────────────────────── */
const GameTester = () => {
    const [selectedGame, setSelectedGameState] = useState(gameFromPath);
    const [currentPage, setCurrentPage] = useState(pageFromPath);
    const [lastScore, setLastScore] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [showInfo, setShowInfo] = useState(true);
    const [navOpen, setNavOpen] = useState(false);

    // pushState-based routing so every game gets its own shareable URL
    const setSelectedGame = useCallback((name) => {
        setSelectedGameState(name);
        try {
            const path = name ? `/game/${slugify(name)}` : "/";
            if (window.location.pathname !== path) window.history.pushState({}, "", path);
        } catch (_) { /* noop */ }
    }, []);

    // unified navigation: updates URL + both view states (game vs static page)
    const navigate = useCallback((path) => {
        try {
            if (window.location.pathname !== path) window.history.pushState({}, "", path);
        } catch (_) { /* noop */ }
        setSelectedGameState(gameFromPath());
        setCurrentPage(pageFromPath());
    }, []);

    // browser back/forward support
    useEffect(() => {
        const onPop = () => { setSelectedGameState(gameFromPath()); setCurrentPage(pageFromPath()); };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    // per-page SEO: title, description, OG, Twitter, canonical, JSON-LD
    useEffect(() => {
        try {
            if (selectedGame) {
                const meta = resolveMeta(selectedGame);
                const slug = slugify(selectedGame);
                const url = `${SITE_URL}/game/${slug}`;
                const title = `Play ${selectedGame} Online Free — Bytecade Games`;
                const desc = `${selectedGame} — ${meta.desc}. Free, no ads, no login. Part of Bytecade Games.`;
                const catKey = catOf(selectedGame);
                const catLabel = CATEGORY_META[catKey]?.label || null;
                // Per-game social preview so shared links don't all look identical.
                const gameImage = `${SITE_URL}/og/${slug}.png`;
                document.title = title;
                const desEl = document.querySelector('meta[name="description"]');
                if (desEl) desEl.setAttribute("content", desc);
                setMetaProp("og:title", `Play ${selectedGame} Online Free`);
                setMetaProp("og:description", desc);
                setMetaProp("og:url", url);
                setMetaProp("og:type", "game");
                setMetaProp("og:image", gameImage);
                setMetaProp("og:image:alt", `Play ${selectedGame} free on Bytecade Games`);
                setMetaName("twitter:title", `Play ${selectedGame} Online Free`);
                setMetaName("twitter:description", desc);
                setMetaName("twitter:image", gameImage);
                setCanonical(url);
                setHreflang(url);
                setJsonLd("ld-page", {
                    "@context": "https://schema.org",
                    "@type": "VideoGame",
                    "name": selectedGame,
                    "description": desc,
                    "url": url,
                    "image": gameImage,
                    "applicationCategory": "Game",
                    "genre": catLabel || "Mini Game",
                    "operatingSystem": "Web",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                    "publisher": { "@type": "Organization", "name": "Bytecade Games", "url": SITE_URL }
                });
                // Breadcrumb trail — surfaces the category path in search results.
                setJsonLd("ld-crumb", {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
                        ...(catLabel ? [{ "@type": "ListItem", "position": 2, "name": catLabel, "item": `${SITE_URL}/?cat=${catKey}` }] : []),
                        { "@type": "ListItem", "position": catLabel ? 3 : 2, "name": selectedGame, "item": url }
                    ]
                });
            } else if (!currentPage) {
                // Homepage meta — static legal pages are handled by the Legal component
                const title = `Bytecade Games — ${GAME_COUNT}+ Free Mini Games`;
                const desc = `Bytecade Games — ${GAME_COUNT}+ free open-source browser mini games. No downloads, no ads, no accounts.`;
                document.title = title;
                const desEl = document.querySelector('meta[name="description"]');
                if (desEl) desEl.setAttribute("content", desc);
                setMetaProp("og:title", "Bytecade Games");
                setMetaProp("og:description", desc);
                setMetaProp("og:url", `${SITE_URL}/`);
                setMetaProp("og:type", "website");
                setMetaProp("og:image", OG_IMAGE);
                setMetaName("twitter:title", "Bytecade Games");
                setMetaName("twitter:description", desc);
                setMetaName("twitter:image", OG_IMAGE);
                setCanonical(`${SITE_URL}/`);
                setHreflang(`${SITE_URL}/`);
                removeJsonLd("ld-page");
                removeJsonLd("ld-crumb");
            }
        } catch (_) { /* noop */ }
    }, [selectedGame, currentPage]);

    const gameNames = useMemo(() => Object.keys(games), []);
    // Guard against the lazy-component registry and the shared catalog drifting
    // apart — otherwise prerendered pages / sitemap would silently miss games.
    if (import.meta.env?.DEV) {
        const missing = gameNames.filter(n => !GAME_NAMES.includes(n));
        const extra = GAME_NAMES.filter(n => !gameNames.includes(n));
        if (missing.length || extra.length) {
            console.warn("[catalog drift] games vs GAME_NAMES mismatch", { missing, extra });
        }
    }
    const filtered = useMemo(() =>
        gameNames.filter(n =>
            (filter === "all" || catOf(n) === filter) &&
            (!search || n.toLowerCase().includes(search.toLowerCase()))
        ), [filter, search, gameNames]);

    const handleComplete = useCallback((score) => {
        setLastScore(score);
    }, []);

    const resetGame = useCallback(() => {
        setLastScore(null);
        setSelectedGame(null);
    }, []);

    const replayGame = useCallback(() => {
        const g = selectedGame;
        setSelectedGame(null);
        setLastScore(null);
        setTimeout(() => setSelectedGame(g), 50);
    }, [selectedGame]);

    /* ── Mobile support ────────────────────────────── */
    const isCoarse = useMemo(() =>
        typeof window !== "undefined" && !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches), []);

    // Wide screens (>=1100px) get a two-column play layout: game stage + info sidebar
    const [isWide, setIsWide] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= 1100 : false);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(min-width: 1100px)");
        const onChange = () => setIsWide(mq.matches);
        onChange();
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else if (mq.addListener) mq.addListener(onChange);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", onChange);
            else if (mq.removeListener) mq.removeListener(onChange);
        };
    }, []);

    // Games controlled with arrow keys / space — get a virtual D-pad on touch devices
    const DPAD_GAMES = useMemo(() => new Set([
        "Snake", "MiniTetris", "MiniPacman", "Frogger", "Asteroids", "Galaga",
        "SpaceInvader", "DigDug", "Bomberman", "DonkeyKong", "JumpRunner",
        "MazeEscape", "ArrowDodge", "ColumnsPuzzle",
    ]), []);

    // Touch → mouse bridge: makes mouse-driven canvas games playable on touch screens
    useEffect(() => {
        if (!isCoarse || !selectedGame) return;
        let active = null;
        const fire = (el, type, x, y) => {
            try {
                el.dispatchEvent(new MouseEvent(type, {
                    bubbles: true, cancelable: true, view: window,
                    clientX: x, clientY: y, button: 0, buttons: 1,
                }));
            } catch (_) { /* noop */ }
        };
        const isForm = (el) => !!(el.closest && el.closest("button, input, select, textarea, a, label"));
        const onStart = (e) => {
            const t = e.changedTouches && e.changedTouches[0];
            if (!t) return;
            const el = document.elementFromPoint(t.clientX, t.clientY);
            if (!el || isForm(el)) { active = null; return; }
            active = el;
            fire(el, "mousedown", t.clientX, t.clientY);
        };
        const onMove = (e) => {
            if (!active) return;
            const t = e.changedTouches && e.changedTouches[0];
            if (!t) return;
            if (e.cancelable) e.preventDefault();
            fire(active, "mousemove", t.clientX, t.clientY);
        };
        const onEnd = (e) => {
            if (!active) return;
            const t = e.changedTouches && e.changedTouches[0];
            if (t) fire(active, "mouseup", t.clientX, t.clientY);
            active = null;
        };
        const optP = { capture: true, passive: true };
        const optNP = { capture: true, passive: false };
        document.addEventListener("touchstart", onStart, optP);
        document.addEventListener("touchmove", onMove, optNP);
        document.addEventListener("touchend", onEnd, optP);
        document.addEventListener("touchcancel", onEnd, optP);
        return () => {
            document.removeEventListener("touchstart", onStart, optP);
            document.removeEventListener("touchmove", onMove, optNP);
            document.removeEventListener("touchend", onEnd, optP);
            document.removeEventListener("touchcancel", onEnd, optP);
        };
    }, [isCoarse, selectedGame]);

    // Virtual D-pad key helpers
    const holdRef = useRef(null);
    const sendKey = useCallback((key, code, type) => {
        try {
            document.dispatchEvent(new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true }));
        } catch (_) { /* noop */ }
    }, []);
    const dpadDown = useCallback((key, code) => {
        sendKey(key, code, "keydown");
        clearInterval(holdRef.current);
        holdRef.current = setInterval(() => sendKey(key, code, "keydown"), 160);
    }, [sendKey]);
    const dpadUp = useCallback((key, code) => {
        clearInterval(holdRef.current);
        holdRef.current = null;
        sendKey(key, code, "keyup");
    }, [sendKey]);
    useEffect(() => () => clearInterval(holdRef.current), []);
    const showDpad = isCoarse && selectedGame && DPAD_GAMES.has(selectedGame);


    /* ── Static / legal pages route ── */
    if (currentPage) {
        return (
            <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)", color: "white" }}>
                <style>{GLOBAL_STYLES}</style>
                <Legal page={currentPage} onBack={() => navigate("/")} />
                <CookieConsent />
            </div>
        );
    }

    /* ── Playing view ── */
    if (selectedGame) {
        const GameComp = games[selectedGame];
        const meta = resolveMeta(selectedGame);
        const badge = CATEGORY_META[catOf(selectedGame)];
        const wide = isWide && !!meta.description;

        /* ── info content (description + how to play) ── */
        const infoEl = null; // REMOVED: meta.description ? (

        /* ── header bar ── */
        const headerEl = (
            <header style={{
                flexShrink: 0, zIndex: 20,
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px",
                background: "rgba(12,12,28,.74)", backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1px solid rgba(255,255,255,.07)",
                color: "white",
            }}>
                <a href="/" onClick={(e) => { e.preventDefault(); resetGame(); }}
                    title="Back to all games" className="bc-iconbtn" style={{
                        display: "inline-flex", alignItems: "center", gap: "7px", flexShrink: 0,
                        background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                        color: "#cbd5e1", padding: "8px 13px", borderRadius: "10px",
                        cursor: "pointer", fontSize: "13.5px", fontWeight: 500,
                        textDecoration: "none", transition: "all .18s ease",
                    }}>
                    <span style={{ fontSize: "15px", lineHeight: 1 }}>←</span>
                    <span className="bc-hide-sm">Games</span>
                </a>

                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "9px", minWidth: 0 }}>
                    <span aria-hidden="true" className="bc-hide-sm" style={{ fontSize: "20px", lineHeight: 1, flexShrink: 0 }}>{meta.emoji}</span>
                    {/* The page's single H1 — the primary topical signal for crawlers. */}
                    <h1 style={{
                        margin: 0, fontWeight: 650, fontSize: "clamp(12px, 3.6vw, 15.5px)", color: "#eef2ff",
                        letterSpacing: ".1px", minWidth: 0,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{selectedGame}</h1>
                    {badge && (
                        <span className="bc-hide-sm" style={{
                            fontSize: "10.5px", fontWeight: 600, padding: "3px 9px", borderRadius: "999px",
                            flexShrink: 0, whiteSpace: "nowrap",
                            background: "rgba(99,102,241,.16)", color: "#a5b4fc",
                            border: "1px solid rgba(99,102,241,.28)",
                        }}>{badge.emoji} {badge.label}</span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    {infoEl && !wide && (
                        <button onClick={() => setShowInfo(v => !v)} className="bc-iconbtn" style={{
                            display: "inline-flex", alignItems: "center", gap: "7px",
                            background: showInfo ? "rgba(99,102,241,.24)" : "rgba(255,255,255,.06)",
                            border: "1px solid",
                            borderColor: showInfo ? "rgba(129,140,248,.45)" : "rgba(255,255,255,.1)",
                            color: showInfo ? "#c7d2fe" : "#cbd5e1",
                            padding: "8px 13px", borderRadius: "10px", cursor: "pointer",
                            fontSize: "13.5px", fontWeight: 500, transition: "all .18s ease",
                        }}>
                            <span style={{ fontSize: "14px", lineHeight: 1 }}>ℹ</span>
                            <span className="bc-hide-sm">{showInfo ? "Hide" : "How to Play"}</span>
                        </button>
                    )}
                    <button onClick={replayGame} className="bc-iconbtn" style={{
                        display: "inline-flex", alignItems: "center", gap: "7px",
                        background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                        border: "1px solid transparent", color: "white",
                        padding: "8px 15px", borderRadius: "10px", cursor: "pointer",
                        fontSize: "13.5px", fontWeight: 600, transition: "all .18s ease",
                        boxShadow: "0 4px 14px rgba(99,102,241,.28)",
                    }}>
                        <span style={{ fontSize: "14px", lineHeight: 1 }}>↻</span>
                        <span className="bc-hide-sm">Restart</span>
                    </button>
                </div>
            </header>
        );

        /* ── stage: game canvas or game-over ── */
        const stageEl = lastScore !== null ? (
            <div className="bc-fade-up" style={{
                minHeight: "62vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "16px", padding: "24px 12px", color: "white",
            }}>
                <div style={{
                    width: "92px", height: "92px", borderRadius: "28px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "46px", lineHeight: 1,
                    background: "linear-gradient(135deg, rgba(99,102,241,.22), rgba(6,182,212,.16))",
                    border: "1px solid rgba(129,140,248,.3)",
                    boxShadow: "0 18px 46px -18px rgba(99,102,241,.65)",
                }}>
                    {lastScore >= 80 ? "🏆" : lastScore >= 50 ? "🎉" : "😅"}
                </div>

                <div style={{ fontSize: "11.5px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "3px", fontWeight: 600 }}>
                    Game Over
                </div>

                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "16px 46px", borderRadius: "20px",
                    background: "rgba(255,255,255,.035)",
                    border: "1px solid rgba(251,191,36,.2)",
                    boxShadow: "0 20px 54px -26px rgba(251,191,36,.55)",
                }}>
                    <div style={{ fontSize: "10.5px", color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase" }}>Your Score</div>
                    <div style={{
                        fontSize: "52px", fontWeight: 800, lineHeight: 1.1,
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{lastScore}</div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                    <button onClick={replayGame} className="bc-lift" style={{
                        padding: "13px 30px", background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                        color: "white", border: "none", borderRadius: "12px", cursor: "pointer",
                        fontSize: "14.5px", fontWeight: 600, transition: "transform .16s ease, box-shadow .16s ease",
                        boxShadow: "0 10px 26px -10px rgba(99,102,241,.75)",
                    }}>🔄 Play Again</button>
                    <button onClick={resetGame} className="bc-lift" style={{
                        padding: "13px 30px", background: "rgba(255,255,255,.05)",
                        color: "#cbd5e1", border: "1px solid rgba(255,255,255,.14)",
                        borderRadius: "12px", cursor: "pointer", fontSize: "14.5px", fontWeight: 500,
                        transition: "transform .16s ease, background .16s ease",
                    }}>🎮 Back to List</button>
                </div>

                {(() => {
                    const primary = duelFor(selectedGame);
                    const others = Object.entries(DUEL_SITES).filter(([k]) => k !== primary);
                    const site = primary ? DUEL_SITES[primary] : null;
                    return (
                        <div style={{
                            maxWidth: "460px", width: "100%", padding: "20px 22px",
                            borderRadius: "16px",
                            background: "rgba(99,102,241,.09)",
                            border: "1px solid rgba(99,102,241,.3)",
                            textAlign: "center",
                            boxShadow: "0 20px 54px -30px rgba(99,102,241,.8)",
                        }}>
                            <div style={{ fontSize: "14px", color: "#e2e8f0", marginBottom: "12px" }}>
                                Beating AI is easy — <strong style={{ color: "#fff" }}>real opponents aren't</strong>
                            </div>
                            {site ? (
                                <a href={site.url} target="_blank" rel="noopener noreferrer" className="bc-lift" style={{
                                    display: "inline-block", padding: "12px 28px", borderRadius: "11px",
                                    background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white",
                                    textDecoration: "none", fontSize: "14px", fontWeight: 600,
                                    boxShadow: "0 10px 26px -10px rgba(239,68,68,.7)",
                                }}>{site.name} — {site.tagline} →</a>
                            ) : (
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                                    {Object.values(DUEL_SITES).map(s => (
                                        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                                            padding: "10px 18px", borderRadius: "10px", background: "rgba(255,255,255,.07)",
                                            color: "#e2e8f0", textDecoration: "none", fontSize: "13px",
                                            border: "1px solid rgba(255,255,255,.15)",
                                        }}>{s.name} →</a>
                                    ))}
                                </div>
                            )}
                            <div style={{ marginTop: "12px", fontSize: "11.5px", color: "#94a3b8" }}>
                                {others.map(([k, s]) => (
                                    <a key={k} href={s.url} target="_blank" rel="noopener noreferrer"
                                        style={{ color: "#818cf8", textDecoration: "none", margin: "0 7px" }}>{s.name}</a>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        ) : (
            <div className="bc-stage-card" style={{
                width: "100%", maxWidth: "980px", minHeight: "400px", margin: "auto",
                background: "rgba(255,255,255,.022)",
                border: "1px solid rgba(255,255,255,.065)",
                borderRadius: "20px",
                boxShadow: "0 32px 74px -36px rgba(0,0,0,.82)",
                padding: "16px",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Soft ambient glow so the card never reads as an empty box */}
                <span aria-hidden="true" style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(99,102,241,.10), transparent 70%)",
                }} />
                <Suspense fallback={
                    <div style={{ minHeight: "52vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", gap: "16px" }}>
                        <div className="bc-spin" style={{
                            width: "46px", height: "46px", border: "3px solid rgba(255,255,255,.1)",
                            borderTopColor: "#6366f1", borderRadius: "50%",
                        }} />
                        <div style={{ fontSize: "13.5px", color: "#94a3b8" }}>Loading {selectedGame}…</div>
                    </div>
                }>
                    <div style={{ position: "relative" }}>
                        <FitGame key={selectedGame}>
                            <GameComp onComplete={handleComplete} />
                        </FitGame>
                    </div>
                </Suspense>
            </div>
        );

        /* ── virtual D-pad (touch devices, keyboard-driven games) ── */
        const dpadEl = showDpad ? (
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 54px)",
                gridTemplateRows: "repeat(3, 54px)", gap: "7px",
                margin: "16px auto 2px", width: "fit-content",
                touchAction: "none", userSelect: "none",
                WebkitUserSelect: "none", WebkitTapHighlightColor: "transparent",
            }} onContextMenu={e => e.preventDefault()}>
                {[
                    { key: "ArrowUp", code: "ArrowUp", label: "▲", gc: "2 / 3", gr: "1 / 2" },
                    { key: "ArrowLeft", code: "ArrowLeft", label: "◀", gc: "1 / 2", gr: "2 / 3" },
                    { key: "ArrowDown", code: "ArrowDown", label: "▼", gc: "2 / 3", gr: "2 / 3" },
                    { key: "ArrowRight", code: "ArrowRight", label: "▶", gc: "3 / 4", gr: "2 / 3" },
                ].map(b => (
                    <button
                        key={b.code}
                        onPointerDown={e => { e.preventDefault(); dpadDown(b.key, b.code); }}
                        onPointerUp={e => { e.preventDefault(); dpadUp(b.key, b.code); }}
                        onPointerLeave={() => dpadUp(b.key, b.code)}
                        onPointerCancel={() => dpadUp(b.key, b.code)}
                        style={{
                            gridColumn: b.gc, gridRow: b.gr,
                            background: "rgba(99,102,241,.28)",
                            border: "1px solid rgba(129,140,248,.5)",
                            color: "#c7d2fe", borderRadius: "15px", fontSize: "20px", fontWeight: 700,
                            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                            touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
                            WebkitTapHighlightColor: "transparent", cursor: "pointer", padding: 0,
                            boxShadow: "0 6px 18px -6px rgba(0,0,0,.6)",
                        }}
                    >{b.label}</button>
                ))}
                <button
                    onPointerDown={e => { e.preventDefault(); dpadDown(" ", "Space"); }}
                    onPointerUp={e => { e.preventDefault(); dpadUp(" ", "Space"); }}
                    onPointerLeave={() => dpadUp(" ", "Space")}
                    onPointerCancel={() => dpadUp(" ", "Space")}
                    style={{
                        gridColumn: "1 / 4", gridRow: "3 / 4",
                        background: "rgba(6,182,212,.26)",
                        border: "1px solid rgba(103,232,249,.5)",
                        color: "#a5f3fc", borderRadius: "15px", fontSize: "12.5px", fontWeight: 700,
                        letterSpacing: "2px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                        touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
                        WebkitTapHighlightColor: "transparent", cursor: "pointer", padding: 0,
                        boxShadow: "0 6px 18px -6px rgba(0,0,0,.6)",
                    }}
                >SPACE</button>
            </div>
        ) : null;

        /* ── Wide: two columns — game stage + info sidebar ── */
        if (wide) {
            return (
                <div style={{
                    height: "100vh",
                    background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)",
                    display: "flex", flexDirection: "column", overflow: "hidden",
                }}>
                    <style>{GLOBAL_STYLES}</style>
                    {headerEl}
                    <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px" }}>
                    <main className="bc-scroll bc-stage-scroll" style={{
                        overflowY: "auto", overflowX: "hidden",
                        padding: showDpad ? "22px 26px 170px" : "22px 26px 30px",
                        // Centre the stage in the leftover space so short games
                        // (Snake, PingPong) don't leave a dead zone underneath.
                        display: "flex", flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        {stageEl}
                    </main>
                        <aside className="bc-scroll" style={{
                            overflowY: "auto",
                            borderLeft: "1px solid rgba(255,255,255,.07)",
                            background: "rgba(11,11,26,.5)",
                            padding: "24px 22px 48px",
                        }}>
                            <h2 style={{
                                margin: "0 0 16px", fontSize: "10.5px", fontWeight: 700, letterSpacing: "1.8px",
                                textTransform: "uppercase", color: "#64748b",
                            }}>About this game</h2>
                            {infoEl}

                            {/* More in this category — fills the sidebar and keeps players in the funnel */}
                            {(() => {
                                const cat = catOf(selectedGame);
                                const siblings = gameNames.filter(n => n !== selectedGame && catOf(n) === cat).slice(0, 8);
                                if (!siblings.length) return null;
                                const meta = CATEGORY_META[cat];
                                return (
                                    <div style={{ marginTop: "26px", paddingTop: "22px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                                        <h2 style={{
                                            margin: "0 0 12px", fontSize: "10.5px", fontWeight: 700, letterSpacing: "1.8px",
                                            textTransform: "uppercase", color: "#64748b",
                                        }}>
                                            More {meta ? meta.label : ""} games
                                        </h2>
                                        <nav aria-label={`More ${meta ? meta.label : ""} games`} style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                                            {siblings.map(n => {
                                                const m = resolveMeta(n);
                                                const sibSlug = slugify(n);
                                                return (
                                                    <a
                                                        key={n}
                                                        href={`/game/${sibSlug}`}
                                                        onClick={(e) => { e.preventDefault(); setSelectedGame(n); setLastScore(null); }}
                                                        className="bc-lift"
                                                        title={`Play ${n} online free`}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: "10px",
                                                            padding: "9px 11px", borderRadius: "11px", cursor: "pointer",
                                                            background: "rgba(255,255,255,.04)",
                                                            border: "1px solid rgba(255,255,255,.075)",
                                                            color: "white", textAlign: "left", textDecoration: "none",
                                                            fontFamily: "inherit", transition: "background .18s ease",
                                                        }}
                                                    >
                                                        <span aria-hidden="true" style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0 }}>{m.emoji}</span>
                                                        <span style={{ fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n}</span>
                                                    </a>
                                                );
                                            })}
                                        </nav>
                                        <button
                                            onClick={() => { setFilter(cat); setSelectedGame(null); setLastScore(null); }}
                                            className="bc-lift"
                                            style={{
                                                width: "100%", marginTop: "10px", padding: "10px",
                                                borderRadius: "11px", cursor: "pointer", fontFamily: "inherit",
                                                fontSize: "13px", fontWeight: 600,
                                                background: "rgba(99,102,241,.12)",
                                                border: "1px solid rgba(99,102,241,.3)",
                                                color: "#c7d2fe",
                                            }}
                                        >
                                            Browse all {meta ? meta.label : ""} games →
                                        </button>
                                    </div>
                                );
                            })()}
                        </aside>
                    </div>
                    {dpadEl}
                </div>
            );
        }

        /* ── Narrow: single column — game first, info below ── */
        return (
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)",
                display: "flex", flexDirection: "column",
            }}>
                <style>{GLOBAL_STYLES}</style>
                {headerEl}
                <main className="bc-stage-scroll" style={{ padding: "12px 10px 28px" }}>
                    {stageEl}
                    {dpadEl}
                    {infoEl && showInfo && (
                        <div className="bc-fade-in" style={{
                            width: "100%", maxWidth: "820px", margin: "18px auto 0",
                            background: "rgba(255,255,255,.022)",
                            border: "1px solid rgba(255,255,255,.065)",
                            borderRadius: "18px",
                            padding: "18px 18px 20px",
                        }}>
                            <h2 style={{
                                margin: "0 0 14px", fontSize: "10.5px", fontWeight: 700, letterSpacing: "1.8px",
                                textTransform: "uppercase", color: "#64748b",
                            }}>About this game</h2>
                            {infoEl}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    /* ── Portal view ── */
    return (
        <div className="bc-wrap" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)", color: "white" }}>
            <style>{GLOBAL_STYLES}</style>

            {/* Header */}
            <header style={{
                position: "sticky", top: 0, zIndex: 50,
                background: "rgba(15,15,35,0.85)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
                <div className="bc-shell-pad" style={{
                    maxWidth: "1200px", margin: "0 auto", padding: "14px 24px",
                    display: "flex", alignItems: "center", gap: "12px",
                }}>
                    {/* Logo */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        fontSize: "20px", fontWeight: 700, color: "white", minWidth: 0, flexShrink: 0,
                    }}>
                        <span style={{
                            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px", boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
                        }}>🎮</span>
                        <span style={{ whiteSpace: "nowrap" }}>Bytecade Games</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    {/* Desktop nav */}
                    <nav className="bc-nav-desktop">
                        {[
                            { label: "Home", href: "/" },
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                            { label: "Cookies", href: "/cookies" },
                            { label: "About", href: "/about" },
                        ].map(link => (
                            <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} style={{
                                color: "#cbd5e1", textDecoration: "none",
                                padding: "6px 14px", borderRadius: "8px",
                                fontSize: "14px", fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                               onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }}
                               onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    {/* Mobile menu toggle */}
                    <button
                        className="bc-nav-toggle"
                        aria-label="Toggle navigation menu"
                        aria-expanded={navOpen}
                        onClick={() => setNavOpen(v => !v)}
                        style={{
                            alignItems: "center", justifyContent: "center",
                            width: "40px", height: "40px", flexShrink: 0,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "#cbd5e1", borderRadius: "10px", cursor: "pointer",
                            fontSize: "18px", lineHeight: 1,
                        }}
                    >{navOpen ? "✕" : "☰"}</button>
                </div>
                {/* Mobile nav drawer */}
                <nav className="bc-nav-drawer" style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(12,12,28,0.97)",
                }}>
                    {navOpen && (
                        <div className="bc-shell-pad" style={{ padding: "10px 16px 14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                            {[
                                { label: "Home", href: "/" },
                                { label: "Privacy", href: "/privacy" },
                                { label: "Terms", href: "/terms" },
                                { label: "Cookies", href: "/cookies" },
                                { label: "About", href: "/about" },
                            ].map(link => (
                                <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); setNavOpen(false); navigate(link.href); }} style={{
                                    color: "#cbd5e1", textDecoration: "none",
                                    padding: "11px 12px", borderRadius: "9px",
                                    fontSize: "15px", fontWeight: 500,
                                }}>{link.label}</a>
                            ))}
                        </div>
                    )}
                </nav>
            </header>

            <main className="bc-shell-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }} id="home">
                {/* Hero */}
                <section style={{
                    textAlign: "center", marginBottom: "30px", padding: "34px 20px 16px",
                }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "7px",
                        padding: "5px 13px", borderRadius: "999px", marginBottom: "18px",
                        background: "rgba(34,211,238,.10)",
                        border: "1px solid rgba(34,211,238,.28)",
                        fontSize: "12px", fontWeight: 600, color: "#67e8f9",
                        letterSpacing: ".3px",
                    }}>
                        <span style={{
                            width: "6px", height: "6px", borderRadius: "50%",
                            background: "#22d3ee", boxShadow: "0 0 8px #22d3ee",
                        }} />
                        {gameNames.length} games · always free · no sign-up
                    </div>
                    <h1 className="bc-hero-h1" style={{
                        fontSize: "clamp(28px, 5.2vw, 48px)", fontWeight: 800, margin: "0 0 14px",
                        background: "linear-gradient(135deg, #a5b4fc 0%, #22d3ee 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        lineHeight: 1.15, overflowWrap: "break-word", letterSpacing: "-0.5px",
                    }}>
                        {gameNames.length}+ free mini games to play right now
                    </h1>
                    <p className="bc-hero-sub" style={{
                        fontSize: "clamp(14px, 2.5vw, 17px)", color: "#94a3b8", margin: "0 auto",
                        fontWeight: 400, maxWidth: "540px", lineHeight: 1.6,
                    }}>
                        No downloads. No accounts. No ads. Just pure fun.
                    </p>
                </section>

                {/* Search — the primary action, so it gets the most visual weight */}
                <div style={{ position: "relative", marginBottom: "16px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
                    <span style={{
                        position: "absolute", left: "17px", top: "50%", transform: "translateY(-50%)",
                        fontSize: "17px", pointerEvents: "none",
                    }}>🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bc-search-input"
                        placeholder="Search games..."
                        style={{
                            width: "100%", padding: "12px 16px 12px 44px", borderRadius: "14px",
                            background: "rgba(255,255,255,0.06)", color: "white",
                            border: "1px solid rgba(255,255,255,0.12)", outline: "none", fontSize: "15px",
                            transition: "all 0.2s",
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = "rgba(99,102,241,0.5)";
                            e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = "rgba(255,255,255,0.12)";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>

                {/* Category filters */}
                <div style={{
                    display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center",
                    marginBottom: "28px",
                }}>
                    {CATEGORIES.map(c => (
                        <button
                            key={c.key}
                            onClick={() => { setFilter(c.key); setSearch(""); }}
                            style={{
                                padding: "7px 14px", fontSize: "13px", borderRadius: "20px", cursor: "pointer",
                                background: filter === c.key
                                    ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.2))"
                                    : "rgba(255,255,255,0.05)",
                                color: filter === c.key ? "#e0e7ff" : "#cbd5e1",
                                border: filter === c.key
                                    ? "1px solid rgba(99,102,241,0.5)"
                                    : "1px solid rgba(255,255,255,0.1)",
                                fontWeight: filter === c.key ? 600 : 500,
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                if (filter !== c.key) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.color = "white";
                                }
                            }}
                            onMouseLeave={e => {
                                if (filter !== c.key) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    e.currentTarget.style.color = "#cbd5e1";
                                }
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Sister-site funnel banner */}
                {(() => {
                    const rec = filter === "all" ? null : (CAT_DUEL[filter] || null);
                    const site = rec ? DUEL_SITES[rec] : null;
                    return (
                        <div style={{
                            maxWidth: "760px", margin: "0 auto 18px", padding: "13px 18px",
                            borderRadius: "12px", background: "rgba(99,102,241,0.08)",
                            border: "1px solid rgba(99,102,241,0.3)", display: "flex",
                            alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center",
                        }}>
                            <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
                                🏆 Want real opponents? Practice here, duel there:
                            </span>
                            {Object.entries(DUEL_SITES).map(([k, s]) => (
                                <a key={k} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                                    padding: "7px 14px", borderRadius: "9px", textDecoration: "none",
                                    fontSize: "12.5px", fontWeight: 600,
                                    background: rec === k ? "linear-gradient(135deg, #6366f1, #06b6d4)" : "rgba(255,255,255,0.07)",
                                    color: rec === k ? "white" : "#c7d2fe",
                                    border: rec === k ? "none" : "1px solid rgba(255,255,255,0.15)",
                                }}>{s.name} →</a>
                            ))}
                        </div>
                    );
                })()}

                {/* Results count */}
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginBottom: "16px" }}>
                    Showing {filtered.length} of {gameNames.length} games
                </div>

                {/* Game grid */}
                {filtered.length === 0 ? (
                    <div className="bc-fade-in" style={{
                        textAlign: "center", padding: "52px 20px 60px", color: "#94a3b8",
                        maxWidth: "520px", margin: "0 auto",
                    }}>
                        <div style={{ fontSize: "46px", marginBottom: "12px", lineHeight: 1 }}>🔍</div>
                        <div style={{ fontSize: "19px", fontWeight: 600, color: "#e2e8f0" }}>
                            No games match “{search || CATEGORY_META[filter]?.label}”
                        </div>
                        <div style={{ fontSize: "13.5px", marginTop: "8px", lineHeight: 1.6 }}>
                            Check the spelling, or jump straight into one of our most-played games:
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "18px" }}>
                            {gameNames.slice(0, 6).map(n => {
                                const m = resolveMeta(n);
                                return (
                                    <a key={n} href={`/game/${slugify(n)}`}
                                        onClick={(e) => { e.preventDefault(); setSearch(""); setFilter("all"); setSelectedGame(n); setLastScore(null); }}
                                        className="bc-lift" style={{
                                            padding: "9px 15px", borderRadius: "11px", cursor: "pointer",
                                            fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
                                            background: "rgba(255,255,255,.06)",
                                            border: "1px solid rgba(255,255,255,.13)",
                                            color: "#e2e8f0", textDecoration: "none",
                                        }}>
                                        {m.emoji} {n}
                                    </a>
                                );
                            })}
                        </div>
                        <button onClick={() => { setSearch(""); setFilter("all"); }} className="bc-lift" style={{
                            marginTop: "20px", padding: "11px 26px", borderRadius: "12px", cursor: "pointer",
                            fontSize: "14px", fontWeight: 600, fontFamily: "inherit",
                            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                            color: "white", border: "none",
                            boxShadow: "0 10px 26px -10px rgba(99,102,241,.7)",
                        }}>Browse all {gameNames.length} games</button>
                    </div>
                ) : (
                    <div style={{
                        display: "grid", gap: "14px",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
                    }}>
                        {filtered.map((name, idx) => {
                            const cat = catOf(name);
                            const meta = resolveMeta(name);
                            const badge = CATEGORY_META[cat];
                            const tint = (badge && badge.tint) || "129,140,248";
                            return (
                                <a
                                    key={name}
                                    href={`/game/${slugify(name)}`}
                                    onClick={(e) => { e.preventDefault(); setSelectedGame(name); setLastScore(null); }}
                                    className="bc-card bc-fade-up"
                                    style={{
                                        display: "block", textAlign: "left", padding: "20px", borderRadius: "16px",
                                        cursor: "pointer", textDecoration: "none",
                                        background: `linear-gradient(160deg, rgba(${tint},.16) 0%, rgba(255,255,255,0.05) 44%, rgba(255,255,255,0.03) 100%)`,
                                        border: `1px solid rgba(${tint},.30)`, color: "white",
                                        transition: "all 0.25s ease", position: "relative", overflow: "hidden",
                                        fontFamily: "inherit",
                                        animationDelay: `${Math.min(idx, 24) * 18}ms`,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = `linear-gradient(160deg, rgba(${tint},.20) 0%, rgba(255,255,255,0.09) 46%, rgba(255,255,255,0.05) 100%)`;
                                        e.currentTarget.style.borderColor = `rgba(${tint},.5)`;
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                        e.currentTarget.style.boxShadow = `0 14px 34px rgba(0,0,0,0.34), 0 0 0 1px rgba(${tint},.22)`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = `linear-gradient(160deg, rgba(${tint},.10) 0%, rgba(255,255,255,0.045) 46%, rgba(255,255,255,0.03) 100%)`;
                                        e.currentTarget.style.borderColor = `rgba(${tint},.20)`;
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {/* Category colour band along the top edge */}
                                    <span aria-hidden="true" style={{
                                        position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                                        background: `linear-gradient(90deg, rgb(${tint}), rgba(${tint},.25))`,
                                    }} />

                                    {/* Emoji header */}
                                    <div style={{
                                        fontSize: "36px", marginBottom: "10px", lineHeight: 1,
                                    }}>{meta.emoji}</div>

                                    {/* Name */}
                                    <div style={{
                                        fontSize: "16px", fontWeight: 600, marginBottom: "6px",
                                        color: "white", letterSpacing: "0.2px",
                                    }}>
                                        {name}
                                    </div>

                                    {/* Description */}
                                    <div style={{
                                        fontSize: "12px", color: "#94a3b8", marginBottom: "10px",
                                        lineHeight: "1.5", minHeight: "38px",
                                    }}>
                                        {meta.description
                                            ? meta.description.replace(" Free, no ads, no login — play instantly on Bytecade Games.", "")
                                            : meta.desc}
                                    </div>

                                    {/* Category badge */}
                                    {badge && (
                                        <div style={{
                                            display: "inline-block", fontSize: "11px", fontWeight: 500,
                                            padding: "3px 10px", borderRadius: "12px",
                                            background: `rgba(${tint},0.15)`,
                                            color: `rgb(${tint})`,
                                            border: `1px solid rgba(${tint},0.28)`,
                                        }}>
                                            {badge.emoji} {badge.label}
                                        </div>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer style={{
                marginTop: "60px", padding: "28px 24px", textAlign: "center",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                color: "#64748b", fontSize: "13px",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px" }}>🎮</span>
                    <span style={{ color: "#cbd5e1", fontWeight: 500 }}>Bytecade Games</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "8px", flexWrap: "wrap" }}>
                    {[
                        { label: "Privacy", href: "/privacy" },
                        { label: "Terms", href: "/terms" },
                        { label: "Cookies", href: "/cookies" },
                        { label: "About", href: "/about" },
                    ].map(link => (
                        <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); navigate(link.href); }} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "12.5px" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}>{link.label}</a>
                    ))}
                </div>
                <div>© 2026 Bytecade Games · Apache-2.0 Licensed</div>
            </footer>
            <CookieConsent />

        </div>
    );
};

export default GameTester;
