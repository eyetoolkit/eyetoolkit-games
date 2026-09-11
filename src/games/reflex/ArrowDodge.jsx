/**
 * 🎮 화살 피하기 — 파워업 + 쉴드 + 코인 수집 + 보스 애로우
 */
import { useCallback, useEffect, useRef, useState } from "react";

const ARENA_W = 300;
const ARENA_H = 380;
const PLAYER_SIZE = 24;
const MOVE_SPEED = 7;

const ArrowDodge = ({ onComplete }) => {
    const [playerX, setPlayerX] = useState(ARENA_W / 2);
    const [arrows, setArrows] = useState([]);
    const [coins, setCoins] = useState([]);
    const [powerups, setPowerups] = useState([]);
    const [survived, setSurvived] = useState(0);
    const [coinCount, setCoinCount] = useState(0);
    const [shield, setShield] = useState(0);
    const [slow, setSlow] = useState(false);
    const [gameActive, setGameActive] = useState(true);
    const keysRef = useRef(new Set());
    const nextId = useRef(0);
    const survivedRef = useRef(0);
    const shieldRef = useRef(0);

    // Spawn arrows + coins + powerups
    useEffect(() => {
        if (!gameActive) return;
        const spawn = setInterval(() => {
            const t = survivedRef.current;
            const level = Math.floor(t / 100);
            const count = 1 + Math.min(level, 4);
            const isBoss = t > 0 && t % 200 === 0;

            for (let i = 0; i < count; i++) {
                setArrows((prev) => [...prev, {
                    id: nextId.current++,
                    x: Math.random() * (ARENA_W - 20) + 10,
                    y: -10,
                    speed: slow ? 1.5 : (2 + Math.random() * 2 + level * 0.3),
                    type: isBoss && i === 0 ? "boss" : "normal",
                    size: isBoss && i === 0 ? 24 : 16,
                }]);
            }

            // Coins spawn
            if (Math.random() < 0.3) {
                setCoins(prev => [...prev, {
                    id: nextId.current++,
                    x: Math.random() * (ARENA_W - 30) + 15,
                    y: -10, speed: 1.5,
                }]);
            }

            // Powerup spawn
            if (Math.random() < 0.08) {
                const types = ["shield", "slow", "magnet"];
                setPowerups(prev => [...prev, {
                    id: nextId.current++,
                    x: Math.random() * (ARENA_W - 30) + 15,
                    y: -10, speed: 1.2,
                    type: types[Math.floor(Math.random() * types.length)],
                }]);
            }
        }, 500);
        return () => clearInterval(spawn);
    }, [gameActive, slow]);

    // Game loop
    useEffect(() => {
        if (!gameActive) return;
        const loop = setInterval(() => {
            // Move player
            setPlayerX((px) => {
                let x = px;
                if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) x = Math.max(PLAYER_SIZE / 2, x - MOVE_SPEED);
                if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) x = Math.min(ARENA_W - PLAYER_SIZE / 2, x + MOVE_SPEED);
                return x;
            });

            // Move arrows
            setArrows((prev) => {
                const alive = [];
                let hit = false;
                for (const a of prev) {
                    const ny = a.y + a.speed;
                    if (ny > ARENA_H + 20) continue;
                    alive.push({ ...a, y: ny });
                }
                setPlayerX((px) => {
                    for (const a of alive) {
                        const hitDist = (PLAYER_SIZE + (a.size || 16)) / 2;
                        if (a.y > ARENA_H - 50 && a.y < ARENA_H - 5 && Math.abs(a.x - px) < hitDist) {
                            if (shieldRef.current > 0) {
                                shieldRef.current--;
                                setShield(shieldRef.current);
                                a.y = ARENA_H + 100; // Remove arrow
                            } else {
                                hit = true;
                            }
                        }
                    }
                    return px;
                });
                if (hit) {
                    setGameActive(false);
                    const bonus = coinCount * 2;
                    const score = Math.min(100, Math.round(survivedRef.current * 1.5 + bonus));
                    setTimeout(() => onComplete(score), 500);
                }
                return alive.filter(a => a.y < ARENA_H + 50);
            });

            // Move coins & collect
            setCoins(prev => {
                const alive = [];
                for (const c of prev) {
                    const ny = c.y + c.speed;
                    if (ny > ARENA_H + 20) continue;
                    alive.push({ ...c, y: ny });
                }
                setPlayerX(px => {
                    for (const c of alive) {
                        if (c.y > ARENA_H - 50 && c.y < ARENA_H - 5 && Math.abs(c.x - px) < 30) {
                            setCoinCount(cc => cc + 1);
                            c.y = ARENA_H + 100;
                        }
                    }
                    return px;
                });
                return alive.filter(c => c.y < ARENA_H + 50);
            });

            // Move powerups & collect
            setPowerups(prev => {
                const alive = [];
                for (const p of prev) {
                    const ny = p.y + p.speed;
                    if (ny > ARENA_H + 20) continue;
                    alive.push({ ...p, y: ny });
                }
                setPlayerX(px => {
                    for (const p of alive) {
                        if (p.y > ARENA_H - 50 && p.y < ARENA_H - 5 && Math.abs(p.x - px) < 30) {
                            if (p.type === "shield") { shieldRef.current = Math.min(3, shieldRef.current + 1); setShield(shieldRef.current); }
                            if (p.type === "slow") { setSlow(true); setTimeout(() => setSlow(false), 3000); }
                            p.y = ARENA_H + 100;
                        }
                    }
                    return px;
                });
                return alive.filter(p => p.y < ARENA_H + 50);
            });

            survivedRef.current += 1;
            setSurvived(survivedRef.current);
        }, 30);
        return () => clearInterval(loop);
    }, [gameActive, coinCount, onComplete]);

    // Key handlers
    useEffect(() => {
        const down = (e) => { keysRef.current.add(e.key); e.preventDefault(); };
        const up = (e) => keysRef.current.delete(e.key);
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, []);

    const handleTouch = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const tx = e.touches[0].clientX - rect.left;
        setPlayerX(Math.max(PLAYER_SIZE / 2, Math.min(ARENA_W - PLAYER_SIZE / 2, tx)));
    }, []);

    const secs = Math.floor(survived / 33);
    const level = Math.floor(survived / 100) + 1;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <style>{`
                @keyframes arrowFall { 0% { opacity: 0.5; } 100% { opacity: 1; } }
                @keyframes coinSpin { 0% { transform: rotateY(0); } 100% { transform: rotateY(360deg); } }
                @keyframes shieldPulse { 0%,100% { box-shadow: 0 0 10px rgba(100,255,218,0.3); } 50% { box-shadow: 0 0 25px rgba(100,255,218,0.6); } }
                @keyframes slowEffect { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "14px", fontSize: "12px", alignItems: "center" }}>
                <span>생존: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{secs}초</span></span>
                <span>레벨: <span style={{ color: "#A855F7", fontWeight: "bold" }}>Lv.{level}</span></span>
                <span>🪙 <span style={{ color: "#FFD700" }}>{coinCount}</span></span>
                {shield > 0 && <span>🛡️ <span style={{ color: "#64ffda" }}>x{shield}</span></span>}
                {slow && <span style={{ color: "#0cbfff", animation: "slowEffect 0.5s infinite" }}>⏳ 슬로우!</span>}
            </div>

            {/* Survival + XP bar */}
            <div style={{ width: ARENA_W, display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, secs * 2)}%`, height: "100%", background: "linear-gradient(90deg, #64ffda, #FFD700)", borderRadius: 3, transition: "width 0.3s" }} />
                </div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div style={{ width: `${(survived % 100)}%`, height: "100%", background: "linear-gradient(90deg, #A855F7, #FF6B6B)", borderRadius: 2 }} />
                </div>
            </div>

            {/* Arena */}
            <div onTouchMove={handleTouch} style={{
                width: ARENA_W, height: ARENA_H, background: slow ? "linear-gradient(180deg, #0a0a3e, #050530)" : "linear-gradient(180deg, #0a0a2e, #050520)",
                borderRadius: "12px",
                border: gameActive ? (slow ? "2px solid rgba(12,191,255,0.2)" : "2px solid rgba(255,255,255,0.06)") : "2px solid #FF6B6B",
                position: "relative", overflow: "hidden",
            }}>
                {/* Level indicator */}
                {survived > 0 && survived % 100 < 10 && (
                    <div style={{ position: "absolute", top: "40%", width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "rgba(168,85,247,0.4)", zIndex: 0 }}>
                        LEVEL {level}
                    </div>
                )}

                {/* Arrows */}
                {arrows.map((a) => (
                    <div key={a.id} style={{
                        position: "absolute", left: a.x - (a.size || 16) / 2, top: a.y,
                        fontSize: `${a.size || 16}px`, userSelect: "none",
                        filter: a.type === "boss" ? "hue-rotate(30deg) brightness(1.5)" : "",
                    }}>
                        {a.type === "boss" ? "⚡" : "🏹"}
                    </div>
                ))}

                {/* Coins */}
                {coins.map(c => (
                    <div key={c.id} style={{
                        position: "absolute", left: c.x - 8, top: c.y,
                        fontSize: "16px", animation: "coinSpin 1s linear infinite",
                    }}>🪙</div>
                ))}

                {/* Powerups */}
                {powerups.map(p => (
                    <div key={p.id} style={{
                        position: "absolute", left: p.x - 10, top: p.y,
                        fontSize: "18px",
                        filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
                    }}>
                        {p.type === "shield" ? "🛡️" : p.type === "slow" ? "⏳" : "🧲"}
                    </div>
                ))}

                {/* Player */}
                <div style={{
                    position: "absolute", left: playerX - PLAYER_SIZE / 2, bottom: 10,
                    fontSize: `${PLAYER_SIZE}px`, userSelect: "none",
                    filter: !gameActive ? "grayscale(1)" : "",
                    animation: shield > 0 ? "shieldPulse 1s infinite" : "none",
                }}>
                    {gameActive ? "😊" : "💀"}
                    {shield > 0 && <div style={{
                        position: "absolute", inset: -6, borderRadius: "50%",
                        border: "2px solid rgba(100,255,218,0.4)",
                        background: "rgba(100,255,218,0.05)",
                    }} />}
                </div>

                {!gameActive && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", gap: "6px" }}>
                        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FF6B6B" }}>💀 게임 오버!</div>
                        <div style={{ color: "#FFD700", fontWeight: "bold" }}>{secs}초 생존 | 🪙 {coinCount}개 수집</div>
                        <div style={{ fontSize: "12px", color: "#A855F7" }}>레벨 {level} 도달</div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    onMouseDown={() => keysRef.current.add("ArrowLeft")}
                    onMouseUp={() => keysRef.current.delete("ArrowLeft")}
                    onTouchStart={() => keysRef.current.add("ArrowLeft")}
                    onTouchEnd={() => keysRef.current.delete("ArrowLeft")}
                    style={arrowBtnStyle}>←</button>
                <button
                    onMouseDown={() => keysRef.current.add("ArrowRight")}
                    onMouseUp={() => keysRef.current.delete("ArrowRight")}
                    onTouchStart={() => keysRef.current.add("ArrowRight")}
                    onTouchEnd={() => keysRef.current.delete("ArrowRight")}
                    style={arrowBtnStyle}>→</button>
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>
                {gameActive ? "←→ 화살 피하고 🪙코인/🛡️파워업 수집!" : ""}
            </div>
        </div>
    );
};

const arrowBtnStyle = {
    width: 60, height: 50, fontSize: "22px",
    background: "rgba(255,255,255,0.1)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", cursor: "pointer",
};

export default ArrowDodge;
