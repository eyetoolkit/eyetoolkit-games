/**
 * 🎮 Game 12: Fruit Slice — slash effects + combo + bomb shake
 */
import { useCallback, useEffect, useRef, useState } from "react";

const FRUITS = ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🍑", "🥝"];
const GAME_TIME = 20;
const SPAWN_INTERVAL = 800;

const FruitSlice = ({ onComplete }) => {
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [misses, setMisses] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [combo, setCombo] = useState(0);
    const [bombShake, setBombShake] = useState(false);
    const nextId = useRef(0);
    const scoreRef = useRef(0);
    const comboRef = useRef(0);

    const spawnItem = useCallback(() => {
        const isBomb = Math.random() < 0.15;
        setItems((prev) => [...prev.slice(-12), {
            id: nextId.current++,
            emoji: isBomb ? "💣" : FRUITS[Math.floor(Math.random() * FRUITS.length)],
            isBomb, x: 10 + Math.random() * 80, y: 100,
            targetY: 10 + Math.random() * 40, sliced: false,
        }]);
    }, []);

    useEffect(() => {
        if (!gameActive) return;
        const spawnTimer = setInterval(spawnItem, SPAWN_INTERVAL);
        const gameTimer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    setGameActive(false); clearInterval(spawnTimer); clearInterval(gameTimer);
                    setTimeout(() => onComplete(Math.min(100, Math.round(scoreRef.current * 4))), 500); return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { clearInterval(spawnTimer); clearInterval(gameTimer); };
    }, [gameActive, spawnItem, onComplete]);

    useEffect(() => {
        const anim = setInterval(() => {
            setItems((prev) => prev.map((it) => ({ ...it, y: Math.max(it.targetY, it.y - 3) })).filter((it) => !it.sliced || it.y > -10));
        }, 50);
        return () => clearInterval(anim);
    }, []);

    const sliceItem = useCallback((id) => {
        setItems((prev) => prev.map((it) => {
            if (it.id !== id || it.sliced) return it;
            if (it.isBomb) {
                comboRef.current = 0; setCombo(0);
                setBombShake(true); setTimeout(() => setBombShake(false), 300);
                setMisses((m) => {
                    if (m + 1 >= 3) { setGameActive(false); setTimeout(() => onComplete(Math.min(100, Math.round(scoreRef.current * 3))), 500); }
                    return m + 1;
                });
            } else {
                scoreRef.current += 1; comboRef.current += 1;
                setScore(scoreRef.current); setCombo(comboRef.current);
            }
            return { ...it, sliced: true };
        }));
    }, [onComplete]);

    const progress = (timeLeft / GAME_TIME) * 100;

    return (
        <div style={{
            height: "100%", display: "flex", flexDirection: "column", color: "white",
            position: "relative", overflow: "hidden",
            animation: bombShake ? "wrongShake 0.3s ease" : "none",
        }}>
            <style>{`@keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", fontSize: "13px", zIndex: 10 }}>
                <span>⏱ <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
                <span>🍎 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>💣 <span style={{ color: "#FF6B6B" }}>{misses}/3</span></span>
                {combo >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: timeLeft <= 5 ? "#FF6B6B" : "#22C55E", transition: "width 1s linear" }} />
            </div>
            <div style={{ flex: 1, position: "relative" }}>
                {items.map((item) => (
                    <div key={item.id} onClick={() => !item.sliced && sliceItem(item.id)}
                        style={{
                            position: "absolute", left: `${item.x}%`, top: `${item.y}%`,
                            fontSize: item.sliced ? "16px" : "36px",
                            cursor: item.sliced ? "default" : "pointer",
                            opacity: item.sliced ? 0.3 : 1,
                            transform: `translate(-50%, -50%) ${item.sliced ? "scale(0.5) rotate(45deg)" : ""}`,
                            transition: "transform 0.2s, opacity 0.3s, font-size 0.2s",
                            userSelect: "none",
                            filter: item.isBomb && !item.sliced ? "drop-shadow(0 0 10px rgba(255,50,50,0.6))" : item.sliced ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                        }}
                    >{item.emoji}</div>
                ))}
            </div>
            <div style={{ textAlign: "center", padding: "6px", fontSize: "11px", color: "#8892b0" }}>
                {gameActive ? "Click the fruit! Avoid the 💣!" : `Game over! ${score}`}
            </div>
        </div>
    );
};

export default FruitSlice;
