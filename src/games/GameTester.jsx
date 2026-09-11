/**
 * 🎮 Bytecade Games Portal
 * Standalone game collection page — /game-test
 * Lazy-loads individual game components
 */
import { lazy, Suspense, useCallback, useMemo, useState } from "react";

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
const GAME_META = {
    Snake:         { emoji: "🐍", desc: "Classic arcade — eat food, grow longer, don't hit yourself" },
    MiniTetris:    { emoji: "🧱", desc: "Stack falling blocks, clear lines before the board fills" },
    MiniPacman:    { emoji: "👻", desc: "Navigate the maze, eat dots, avoid the ghosts" },
    Breakout:      { emoji: "🎾", desc: "Paddle and ball — break all the bricks" },
    PingPong:      { emoji: "🏓", desc: "Two-player table tennis classic" },
    SpaceInvader:  { emoji: "👾", desc: "Shoot descending aliens before they reach you" },
    Frogger:       { emoji: "🐸", desc: "Cross the highway and river to reach the lily pad" },
    Asteroids:     { emoji: "☄️", desc: "Rotate, thrust, shoot — survive the asteroid belt" },
    FlappyJelly:   { emoji: "🪼", desc: "Tap to flap between endless pipes" },
    Bomberman:     { emoji: "💣", desc: "Place bombs strategically, blow up walls and rivals" },
    DigDug:        { emoji: "⛏️", desc: "Dig tunnels and inflate enemies before they pop" },
    Game2048:      { emoji: "🔢", desc: "Merge matching tiles to reach 2048" },
    Minesweeper:   { emoji: "💣", desc: "Clear the minefield without stepping on a mine" },
    Sokoban:       { emoji: "📦", desc: "Push boxes onto target squares" },
    Match3:        { emoji: "💎", desc: "Swap tiles to match 3 or more in a row" },
    SlidePuzzle:   { emoji: "🧩", desc: "Classic 15-puzzle — arrange numbers in order" },
    KillerSudoku:  { emoji: "🔢", desc: "Sudoku variant with cage sum constraints" },
    ConnectFour:   { emoji: "🔴", desc: "Drop pieces, connect four in a row" },
    Othello:       { emoji: "⚫", desc: "Flip your opponent's discs to claim more territory" },
    Blackjack:     { emoji: "🃏", desc: "Beat the dealer without going over 21" },
    ChessPuzzle:   { emoji: "♟️", desc: "Mate in N moves — find the winning sequence" },
    SimonSays:     { emoji: "🎵", desc: "Watch the color sequence, then repeat it" },
    NBack:         { emoji: "🧠", desc: "Dual n-back — train your working memory" },
    MemoryMatch:   { emoji: "🃏", desc: "Flip cards to find matching pairs" },
    WhackAMole:    { emoji: "🔨", desc: "Hit moles as fast as they pop up" },
    AimTrainer:    { emoji: "🎯", desc: "Click targets precisely and quickly" },
    ReactionTest:  { emoji: "⚡", desc: "Measure your reaction time" },
    FruitSlice:    { emoji: "🍉", desc: "Swipe to slice flying fruit" },
    PixelArt:      { emoji: "🎨", desc: "Create pixel art on a grid canvas" },
    ColorMixer:    { emoji: "🎨", desc: "Mix RGB channels to match the target color" },
    FlagQuiz:      { emoji: "🏳️", desc: "Guess the country from its flag" },
    Roulette:      { emoji: "🎰", desc: "Spin the wheel and bet on the outcome" },
    BingoGame:     { emoji: "🎱", desc: "Classic bingo — match the called numbers" },
    SlotMachine:   { emoji: "🎰", desc: "Pull the lever and match symbols" },
    TowerDefense:  { emoji: "🏰", desc: "Place towers to stop the invading waves" },
    MazeEscape:    { emoji: "🌀", desc: "Find your way out of a maze" },
    RubiksCube2x2: { emoji: "🧊", desc: "Solve the 2x2 Rubik's cube" },
};

const CATEGORY_META = {
    arcade:   { emoji: "🕹", label: "Arcade" },
    reflex:   { emoji: "⚡", label: "Reflex" },
    word:     { emoji: "📝", label: "Word" },
    brain:    { emoji: "🧠", label: "Brain" },
    creative: { emoji: "🎨", label: "Creative" },
    luck:     { emoji: "🍀", label: "Luck" },
    puzzle:   { emoji: "🧩", label: "Puzzle" },
    sports:   { emoji: "🏃", label: "Sports" },
    strategy: { emoji: "⚔", label: "Strategy" },
    cards:    { emoji: "🃏", label: "Cards" },
};

const CATEGORIES = [
    { key: "all",      label: "All" },
    { key: "arcade",   label: "🕹 Arcade" },
    { key: "reflex",   label: "⚡ Reflex" },
    { key: "word",     label: "📝 Word" },
    { key: "brain",    label: "🧠 Brain" },
    { key: "creative", label: "🎨 Creative" },
    { key: "luck",     label: "🍀 Luck" },
    { key: "puzzle",   label: "🧩 Puzzle" },
    { key: "sports",   label: "🏃 Sports" },
    { key: "strategy", label: "⚔ Strategy" },
    { key: "cards",    label: "🃏 Cards" },
];

/* path → category mapping (kept in sync with `games` object) */
const catOf = (name) => {
    for (const [cat, paths] of Object.entries({
        arcade:   "Snake,MiniTetris,MiniPacman,Breakout,FlappyJelly,PingPong,SpaceInvader,Frogger,Asteroids,JumpRunner,Galaga,DigDug,Bomberman,DonkeyKong",
        reflex:   "WhackAMole,ReactionTest,SpeedClick,AimTrainer,FruitSlice,TimingTap,RhythmTap,ColorSwitch,ArrowDodge,BubblePop,ShootingGallery,TypingWarrior,RopeCut,StroopTest,BombDefuse",

        brain:    "MathChallenge,NBack,SimonSays,PatternRecognition,NumberMemory,BalanceScale,SequenceComplete,Game24,PrimeCheck,CipherDecode,LogicGate,BaseConvert,UnitConvert,FractionCompare,MathBreakout",
        creative: "PixelArt,DrawAndGuess,ShadowMatch,ColorMixer,DotConnect,FlagQuiz,EmojiCombo,MandalaPaint,GradientSort,JigsawPuzzle,SpotDifference,TileMosaic,SymmetryDraw,SpriteAnimator",
        luck:     "CoinFlip,DicePredict,Roulette,ScratchCard,RPS,LuckyBox,FortuneWheel,SlotMachine,BingoGame,TreasureMap,DicePoker,TreasureDig,LuckySeven,CardFortune",
        puzzle:   "Game2048,Minesweeper,MiniSudoku,SlidePuzzle,Match3,LightsOut,PipeConnect,Sokoban,TileMatch,Nonogram,HanoiTower,ColorCode,BlockStack,ColorSort,KillerSudoku,OneStroke,ColumnsPuzzle,NumberCrossword,RubiksCube2x2",
        sports:   "GolfPutt,DartGame,BasketballShoot,SoccerPK,ArcheryGame,BowlingGame,FishingGame,SkiSlalom,PingPongRally,RocketLaunch",
        strategy: "TowerDefense,ResourceManager,StockSim,FarmManager,MazeEscape,PlacementPuzzle,StrategyRPG,DeckBuilder,TerritoryWar,TradeSim,MiniWar,RoomEscape,DeliveryRoute,MerchantSim,EnergyManager",
        cards:    "Blackjack,HighLow,MemoryMatch,SpeedCard,PokerHand,WarCard,ConnectFour,Othello,MiniGomoku,DominoChain,MiniGo,ChessPuzzle,MiniCheckers,MiniSolitaire,TripleTriad",
    })) {
        if (paths.split(",").includes(name)) return cat;
    }
    return "unknown";
};

/* Resolve emoji + description for a given game name */
const resolveMeta = (name) => {
    const direct = GAME_META[name];
    if (direct) return direct;
    const cat = catOf(name);
    const catLabel = CATEGORY_META[cat]?.label || "mini game";
    return { emoji: "🎮", desc: `Play ${name} — ${catLabel} mini game` };
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
`;

/* ── Component ──────────────────────────────────── */
const GameTester = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [lastScore, setLastScore] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const gameNames = useMemo(() => Object.keys(games), []);
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

    /* ── Playing view ── */
    if (selectedGame) {
        const GameComp = games[selectedGame];
        const meta = resolveMeta(selectedGame);
        return (
            <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)", display: "flex", flexDirection: "column" }}>
                <style>{GLOBAL_STYLES}</style>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", padding: "12px 20px",
                    background: "rgba(15,15,35,0.85)", backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)", color: "white", gap: "12px",
                    flexWrap: "wrap",
                }}>
                    <button onClick={resetGame} style={{
                        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                        color: "#cbd5e1", padding: "8px 16px", borderRadius: "10px", cursor: "pointer",
                        fontSize: "14px", fontWeight: 500, transition: "all 0.2s",
                    }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
                       onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
                        ← Back to Games
                    </button>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span style={{ fontSize: "22px" }}>{meta.emoji}</span>
                        <span style={{ fontWeight: 600, fontSize: "16px", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {selectedGame}
                        </span>
                        <span style={{
                            fontSize: "11px", padding: "3px 8px", borderRadius: "6px",
                            background: CATEGORY_META[catOf(selectedGame)]
                                ? "rgba(99,102,241,0.15)"
                                : "rgba(255,255,255,0.08)",
                            color: CATEGORY_META[catOf(selectedGame)] ? "#a5b4fc" : "#cbd5e1",
                            border: "1px solid rgba(99,102,241,0.25)",
                        }}>
                            {CATEGORY_META[catOf(selectedGame)]?.label || "Unknown"}
                        </span>
                    </div>
                    <button onClick={replayGame} style={{
                        background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                        border: "none", color: "white", padding: "8px 16px", borderRadius: "10px",
                        cursor: "pointer", fontSize: "14px", fontWeight: 600,
                        boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
                    }}>🔄 Restart</button>
                </div>

                {/* Game area */}
                <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    {lastScore !== null ? (
                        <div style={{ height: "100%", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", gap: "20px", padding: "20px" }}>
                            <div style={{ fontSize: "72px", lineHeight: 1 }}>
                                {lastScore >= 80 ? "🏆" : lastScore >= 50 ? "🎉" : "😅"}
                            </div>
                            <div style={{ fontSize: "14px", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "2px" }}>
                                Game Over
                            </div>
                            <div style={{ fontSize: "48px", fontWeight: 700, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                Score: {lastScore}
                            </div>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                                <button onClick={replayGame} style={{
                                    padding: "14px 32px", background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                                    color: "white", border: "none", borderRadius: "12px", cursor: "pointer",
                                    fontSize: "15px", fontWeight: 600, boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                                }}>🔄 Play Again</button>
                                <button onClick={resetGame} style={{
                                    padding: "14px 32px", background: "rgba(255,255,255,0.06)",
                                    color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: 500,
                                }}>🎮 Back to List</button>
                            </div>
                        </div>
                    ) : (
                        <Suspense fallback={
                            <div style={{ height: "100%", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", gap: "16px" }}>
                                <div style={{
                                    width: "48px", height: "48px", border: "4px solid rgba(255,255,255,0.1)",
                                    borderTopColor: "#6366f1", borderRadius: "50%",
                                    animation: "spin 0.9s linear infinite",
                                }} />
                                <div style={{ fontSize: "14px", color: "#94a3b8" }}>Loading {selectedGame}…</div>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        }>
                            <GameComp onComplete={handleComplete} />
                        </Suspense>
                    )}
                </div>
            </div>
        );
    }

    /* ── Portal view ── */
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)", color: "white" }}>
            <style>{GLOBAL_STYLES}</style>

            {/* Header */}
            <header style={{
                position: "sticky", top: 0, zIndex: 50,
                background: "rgba(15,15,35,0.85)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
                <div style={{
                    maxWidth: "1200px", margin: "0 auto", padding: "14px 24px",
                    display: "flex", alignItems: "center", gap: "12px",
                }}>
                    {/* Logo */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        fontSize: "20px", fontWeight: 700, color: "white",
                    }}>
                        <span style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "18px", boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
                        }}>🎮</span>
                        <span>Bytecade Games</span>
                    </div>
                    <div style={{ flex: 1 }} />
                    {/* Nav */}
                    <nav style={{ display: "flex", gap: "4px" }}>
                        {[
                            { label: "Home", href: "#home" },
                            { label: "Privacy", href: "#privacy" },
                            { label: "Terms", href: "#terms" },
                        ].map(link => (
                            <a key={link.label} href={link.href} style={{
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
                </div>
            </header>

            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }} id="home">
                {/* Hero */}
                <section style={{
                    textAlign: "center", marginBottom: "36px", padding: "40px 20px 20px",
                }}>
                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, margin: "0 0 12px",
                        background: "linear-gradient(135deg, #a5b4fc 0%, #22d3ee 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        Over {gameNames.length} free mini games to play right now
                    </h1>
                    <p style={{
                        fontSize: "clamp(14px, 2.5vw, 17px)", color: "#cbd5e1", margin: 0,
                        fontWeight: 400,
                    }}>
                        No downloads. No accounts. No ads. Just pure fun.
                    </p>
                </section>

                {/* Search */}
                <div style={{ position: "relative", marginBottom: "16px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
                    <span style={{
                        position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                        fontSize: "16px", pointerEvents: "none",
                    }}>🔍</span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
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

                {/* Results count */}
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", marginBottom: "16px" }}>
                    Showing {filtered.length} of {gameNames.length} games
                </div>

                {/* Game grid */}
                {filtered.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "60px 20px", color: "#94a3b8",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎮</div>
                        <div style={{ fontSize: "18px" }}>No games match your search</div>
                        <div style={{ fontSize: "14px", marginTop: "6px" }}>Try a different keyword or category</div>
                    </div>
                ) : (
                    <div style={{
                        display: "grid", gap: "16px",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    }}>
                        {filtered.map(name => {
                            const cat = catOf(name);
                            const meta = resolveMeta(name);
                            const badge = CATEGORY_META[cat];
                            return (
                                <button
                                    key={name}
                                    onClick={() => { setSelectedGame(name); setLastScore(null); }}
                                    style={{
                                        textAlign: "left", padding: "20px", borderRadius: "16px",
                                        cursor: "pointer", background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.08)", color: "white",
                                        transition: "all 0.25s ease", position: "relative", overflow: "hidden",
                                        fontFamily: "inherit",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.15)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
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
                                        fontSize: "12.5px", color: "#cbd5e1", marginBottom: "12px",
                                        lineHeight: "1.5", minHeight: "38px",
                                    }}>
                                        {meta.desc}
                                    </div>

                                    {/* Category badge */}
                                    {badge && (
                                        <div style={{
                                            display: "inline-block", fontSize: "11px", fontWeight: 500,
                                            padding: "3px 10px", borderRadius: "12px",
                                            background: "rgba(99,102,241,0.15)",
                                            color: "#a5b4fc",
                                            border: "1px solid rgba(99,102,241,0.25)",
                                        }}>
                                            {badge.emoji} {badge.label}
                                        </div>
                                    )}
                                </button>
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
                <div>© 2026 Bytecade Games · Apache-2.0 Licensed</div>
            </footer>

            {/* Privacy & Terms sections */}
            <section id="privacy" style={{
                maxWidth: "800px", margin: "40px auto 0", padding: "28px 24px",
                background: "rgba(255,255,255,0.04)", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)", textAlign: "left",
            }}>
                <h2 style={{ color: "#e0e7ff", margin: "0 0 12px", fontSize: "22px" }}>🔒 Privacy Policy</h2>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "14px", margin: "0 0 10px" }}>
                    Bytecade Games respects your privacy. This site runs entirely in your browser — we do not collect personal information, do not require accounts, and do not track your gameplay across the web.
                </p>
                <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, paddingLeft: "18px", margin: 0 }}>
                    <li>No personal data is collected or transmitted</li>
                    <li>Game scores and settings are stored locally in your browser (localStorage) — you can clear them at any time</li>
                    <li>No third-party analytics, ad trackers, or cookies are used</li>
                    <li>We do not use cookies for tracking; technical cookies may be set by Cloudflare for security</li>
                    <li>Source code is open-source (Apache-2.0) — you can audit it yourself</li>
                </ul>
            </section>

            <section id="terms" style={{
                maxWidth: "800px", margin: "28px auto 40px", padding: "28px 24px",
                background: "rgba(255,255,255,0.04)", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)", textAlign: "left",
            }}>
                <h2 style={{ color: "#e0e7ff", margin: "0 0 12px", fontSize: "22px" }}>📜 Terms of Service</h2>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "14px", margin: "0 0 10px" }}>
                    Bytecade Games is provided "as is" for free personal use. By using this site, you agree to the following:
                </p>
                <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, paddingLeft: "18px", margin: 0 }}>
                    <li>Games are for entertainment purposes only</li>
                    <li>Do not use this site for any illegal or harmful activity</li>
                    <li>We are not responsible for any indirect or consequential damages</li>
                    <li>The site may change or become unavailable at any time</li>
                    <li>All game code is licensed under Apache-2.0 — see <a href="https://github.com/eyetoolkit/eyetoolkit-games" style={{ color: "#6366f1" }}>GitHub</a> for details</li>
                </ul>
            </section>

        </div>
    );
};

export default GameTester;
