/**
 * 🎮 Game 17: Keyboard Warrior — timer bar + combo + danger colors
 * Mobile: touch input via virtual QWERTY
 */
import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GAME_TIME = 20;
const SPAWN_INTERVAL = 1200;
const QWERTY_ROWS = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"]
];

const TypingWarrior = ({ onComplete }) => {
    const [letters, setLetters] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameActive, setGameActive] = useState(true);
    const [lastKey, setLastKey] = useState("");
    const [combo, setCombo] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const nextId = useRef(0);
    const scoreRef = useRef(0);
    const missRef = useRef(0);
    const comboRef = useRef(0);

    // mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (!gameActive) return;
        const spawn = setInterval(() => {
            setLetters((prev) => [...prev, { id: nextId.current++, char: CHARS[Math.floor(Math.random() * CHARS.length)], x: 10 + Math.random() * 80, y: 0 }]);
        }, SPAWN_INTERVAL);
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    setGameActive(false); clearInterval(spawn); clearInterval(timer);
                    setTimeout(() => onComplete(Math.min(100, Math.round((scoreRef.current / (scoreRef.current + missRef.current + 1)) * 100))), 500); return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { clearInterval(spawn); clearInterval(timer); };
    }, [gameActive, onComplete]);

    useEffect(() => {
        const anim = setInterval(() => {
            setLetters((prev) => {
                const next = prev.map((l) => ({ ...l, y: l.y + 1.5 }));
                const escaped = next.filter((l) => l.y >= 100);
                if (escaped.length > 0) { missRef.current += escaped.length; comboRef.current = 0; setCombo(0); }
                return next.filter((l) => l.y < 100);
            });
        }, 50);
        return () => clearInterval(anim);
    }, []);

    // common key handling
    const processKey = useCallback((key) => {
        if (!gameActive) return;
        const upper = key.toUpperCase();
        setLastKey(upper);
        setLetters((prev) => {
            const idx = prev.findIndex((l) => l.char === upper);
            if (idx >= 0) {
                scoreRef.current += 1; comboRef.current += 1;
                setScore(scoreRef.current); setCombo(comboRef.current);
                return prev.filter((_, i) => i !== idx);
            }
            return prev;
        });
    }, [gameActive]);

    // physical keyboard events
    const handleKey = useCallback((e) => {
        processKey(e.key);
    }, [processKey]);

    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    const progress = (timeLeft / GAME_TIME) * 100;

    // letters currently on screen (virtual keyboard highlight)
    const activeChars = new Set(letters.map(l => l.char));

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", fontSize: "13px" }}>
                <span>⏱ <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
                <span>⌨️ <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                {lastKey && <span style={{ color: "#0cbfff" }}>[ {lastKey} ]</span>}
                {combo >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: timeLeft <= 5 ? "#FF6B6B" : "#0cbfff", transition: "width 1s linear" }} />
            </div>
            <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: isMobile ? "120px" : "auto" }}>
                {/* Danger zone */}
                <div style={{ position: "absolute", bottom: 0, width: "100%", height: "20%", background: "linear-gradient(transparent, rgba(239,68,68,0.08))" }} />
                {letters.map((l) => (
                    <div key={l.id} style={{
                        position: "absolute", left: `${l.x}%`, top: `${l.y}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: isMobile ? "22px" : "28px", fontWeight: "bold",
                        color: l.y > 70 ? "#FF6B6B" : l.y > 50 ? "#FFD700" : "#0cbfff",
                        textShadow: `0 0 10px ${l.y > 70 ? "rgba(255,100,100,0.5)" : "rgba(12,191,255,0.4)"}`,
                        userSelect: "none",
                    }}>{l.char}</div>
                ))}
            </div>

            {/* mobile virtual QWERTY keyboard */}
            {isMobile && gameActive ? (
                <div style={{ padding: "4px 2px", background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    {QWERTY_ROWS.map((row, ri) => (
                        <div key={ri} style={{ display: "flex", justifyContent: "center", gap: "3px", marginBottom: "3px" }}>
                            {row.map((ch) => {
                                const isActive = activeChars.has(ch);
                                return (
                                    <button
                                        key={ch}
                                        onTouchStart={(e) => { e.preventDefault(); processKey(ch); }}
                                        onClick={(e) => { e.preventDefault(); processKey(ch); }}
                                        style={{
                                            width: ri === 2 ? "32px" : "30px",
                                            height: "36px",
                                            borderRadius: "5px",
                                            border: isActive ? "1.5px solid #0cbfff" : "1px solid rgba(255,255,255,0.2)",
                                            background: isActive ? "rgba(12,191,255,0.25)" : "rgba(255,255,255,0.08)",
                                            color: isActive ? "#0cbfff" : "#ccc",
                                            fontSize: "13px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            WebkitTapHighlightColor: "transparent",
                                            transition: "background 0.1s",
                                        }}
                                    >{ch}</button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "6px", fontSize: "11px", color: "#8892b0" }}>
                    {gameActive ? (isMobile ? "Tap the letters on the keyboard below!" : "Type the letters on your keyboard!") : `Game over! ${score}`}
                </div>
            )}

            {/* game over message (mobile) */}
            {isMobile && !gameActive && (
                <div style={{ textAlign: "center", padding: "6px", fontSize: "11px", color: "#8892b0" }}>
                    Game over! {score}
                </div>
            )}
        </div>
    );
};

export default TypingWarrior;
