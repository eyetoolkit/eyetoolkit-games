/**
 * 🧪 Standalone Game Tester Page
 * Direct route: /game-test
 * Renders individual game components for play-testing
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
    JumpMan: lazy(() => import("./arcade/JumpMan")),
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
    // Word
    Anagram: lazy(() => import("./word/Anagram")),
    KoreanWordle: lazy(() => import("./word/KoreanWordle")),
    Hangman: lazy(() => import("./word/Hangman")),
    WordSearch: lazy(() => import("./word/WordSearch")),
    EndWordChain: lazy(() => import("./word/EndWordChain")),
    TypingRace: lazy(() => import("./word/TypingRace")),
    ChoSungQuiz: lazy(() => import("./word/ChoSungQuiz")),
    MiniCrossword: lazy(() => import("./word/MiniCrossword")),
    SpellingFix: lazy(() => import("./word/SpellingFix")),
    SynonymQuiz: lazy(() => import("./word/SynonymQuiz")),
    AntonymQuiz: lazy(() => import("./word/AntonymQuiz")),
    ProverbComplete: lazy(() => import("./word/ProverbComplete")),
    SajaSeongeo: lazy(() => import("./word/SajaSeongeo")),
    SentenceOrder: lazy(() => import("./word/SentenceOrder")),
    DictationQuiz: lazy(() => import("./word/DictationQuiz")),
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
    LogoQuiz: lazy(() => import("./creative/LogoQuiz")),
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
    YutNori: lazy(() => import("./luck/YutNori")),
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
    NonsenseQuiz: lazy(() => import("./puzzle/NonsenseQuiz")),
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

const CATEGORIES = [
    { key: "all", label: "전체" },
    { key: "arcade", label: "🕹 아케이드" },
    { key: "reflex", label: "⚡ 반사신경" },
    { key: "word", label: "📝 단어" },
    { key: "brain", label: "🧠 두뇌" },
    { key: "creative", label: "🎨 크리에이티브" },
    { key: "luck", label: "🍀 행운" },
    { key: "puzzle", label: "🧩 퍼즐" },
    { key: "sports", label: "🏃 스포츠" },
    { key: "strategy", label: "⚔ 전략" },
    { key: "cards", label: "🃏 카드" },
];

/* path → category mapping */
const catOf = (name) => {
    for (const [cat, paths] of Object.entries({
        arcade: "Snake,MiniTetris,MiniPacman,Breakout,FlappyJelly,PingPong,SpaceInvader,Frogger,Asteroids,JumpRunner,Galaga,DigDug,Bomberman,DonkeyKong,JumpMan",
        reflex: "WhackAMole,ReactionTest,SpeedClick,AimTrainer,FruitSlice,TimingTap,RhythmTap,ColorSwitch,ArrowDodge,BubblePop,ShootingGallery,TypingWarrior,RopeCut,StroopTest,BombDefuse",
        word: "Anagram,KoreanWordle,Hangman,WordSearch,EndWordChain,TypingRace,ChoSungQuiz,MiniCrossword,SpellingFix,SynonymQuiz,AntonymQuiz,ProverbComplete,SajaSeongeo,SentenceOrder,DictationQuiz",
        brain: "MathChallenge,NBack,SimonSays,PatternRecognition,NumberMemory,BalanceScale,SequenceComplete,Game24,PrimeCheck,CipherDecode,LogicGate,BaseConvert,UnitConvert,FractionCompare,MathBreakout",
        creative: "PixelArt,DrawAndGuess,ShadowMatch,ColorMixer,LogoQuiz,DotConnect,FlagQuiz,EmojiCombo,MandalaPaint,GradientSort,JigsawPuzzle,SpotDifference,TileMosaic,SymmetryDraw,SpriteAnimator",
        luck: "CoinFlip,DicePredict,Roulette,ScratchCard,RPS,LuckyBox,FortuneWheel,SlotMachine,BingoGame,TreasureMap,DicePoker,TreasureDig,LuckySeven,CardFortune,YutNori",
        puzzle: "Game2048,Minesweeper,MiniSudoku,SlidePuzzle,Match3,LightsOut,PipeConnect,Sokoban,TileMatch,Nonogram,HanoiTower,ColorCode,BlockStack,NonsenseQuiz,ColorSort,KillerSudoku,OneStroke,ColumnsPuzzle,NumberCrossword,RubiksCube2x2",
        sports: "GolfPutt,DartGame,BasketballShoot,SoccerPK,ArcheryGame,BowlingGame,FishingGame,SkiSlalom,PingPongRally,RocketLaunch",
        strategy: "TowerDefense,ResourceManager,StockSim,FarmManager,MazeEscape,PlacementPuzzle,StrategyRPG,DeckBuilder,TerritoryWar,TradeSim,MiniWar,RoomEscape,DeliveryRoute,MerchantSim,EnergyManager",
        cards: "Blackjack,HighLow,MemoryMatch,SpeedCard,PokerHand,WarCard,ConnectFour,Othello,MiniGomoku,DominoChain,MiniGo,ChessPuzzle,MiniCheckers,MiniSolitaire,TripleTriad",
    })) {
        if (paths.split(",").includes(name)) return cat;
    }
    return "unknown";
};

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

    /* ── Playing ── */
    if (selectedGame) {
        const GameComp = games[selectedGame];
        return (
            <div style={{ height: "100vh", background: "#0f0f23", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", background: "#16213e", color: "white", gap: "12px" }}>
                    <button onClick={resetGame} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>← 목록</button>
                    <div style={{ flex: 1, fontWeight: "bold", fontSize: "16px" }}>{selectedGame}</div>
                    <button onClick={replayGame} style={{ background: "rgba(100,255,218,0.15)", border: "1px solid #64ffda", color: "#64ffda", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>🔄 재시작</button>
                </div>
                {/* Game area */}
                <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                    {lastScore !== null ? (
                        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", gap: "16px" }}>
                            <div style={{ fontSize: "48px" }}>{lastScore >= 80 ? "🏆" : lastScore >= 50 ? "🎉" : "😅"}</div>
                            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#FFD700" }}>점수: {lastScore}</div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button onClick={replayGame} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #0cbfff, #7c3aed)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "bold" }}>🔄 다시 하기</button>
                                <button onClick={resetGame} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", cursor: "pointer", fontSize: "15px" }}>🎮 목록</button>
                            </div>
                        </div>
                    ) : (
                        <Suspense fallback={<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892b0" }}>로딩중...</div>}>
                            <GameComp onComplete={handleComplete} />
                        </Suspense>
                    )}
                </div>
            </div>
        );
    }

    /* ── Game List ── */
    return (
        <div style={{ height: "100vh", background: "#0f0f23", color: "white", overflow: "auto" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
                <h1 style={{ textAlign: "center", fontSize: "24px", margin: "0 0 16px" }}>🎮 Game Tester ({filtered.length}/{gameNames.length})</h1>
                {/* Search */}
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="게임 검색..."
                    style={{ width: "100%", padding: "10px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.15)", outline: "none", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }} />
                {/* Category filter */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {CATEGORIES.map(c => (
                        <button key={c.key} onClick={() => setFilter(c.key)} style={{
                            padding: "4px 10px", fontSize: "12px", borderRadius: "6px", cursor: "pointer",
                            background: filter === c.key ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.04)",
                            color: filter === c.key ? "#64ffda" : "#8892b0",
                            border: filter === c.key ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.08)",
                        }}>{c.label}</button>
                    ))}
                </div>
                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
                    {filtered.map(name => (
                        <button key={name} onClick={() => { setSelectedGame(name); setLastScore(null); }}
                            style={{
                                padding: "12px 8px", borderRadius: "10px", cursor: "pointer",
                                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                                color: "white", fontSize: "12px", textAlign: "center", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(100,255,218,0.1)"; e.currentTarget.style.borderColor = "#64ffda"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                        >{name}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameTester;
