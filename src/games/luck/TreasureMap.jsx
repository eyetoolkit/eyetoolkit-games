/**
 * 🎮 Game 80: 보물 지도 — 탐험 맵 + 온도 힌트 시각화
 */
import { useCallback, useState } from "react";

const SIZE = 5;
const TreasureMap = ({ onComplete }) => {
    const [treasure] = useState(() => ({ r: Math.floor(Math.random() * SIZE), c: Math.floor(Math.random() * SIZE) }));
    const [guesses, setGuesses] = useState([]);
    const [found, setFound] = useState(false);

    const dist = (r, c) => Math.abs(r - treasure.r) + Math.abs(c - treasure.c);

    const handleClick = useCallback((r, c) => {
        if (found || guesses.some((g) => g.r === r && g.c === c)) return;
        const d = dist(r, c);
        setGuesses((g) => [...g, { r, c, d }]);
        if (d === 0) {
            setFound(true);
            const score = Math.max(20, 100 - guesses.length * 12);
            setTimeout(() => onComplete(score), 800);
        }
    }, [treasure, guesses, found, onComplete]);

    const getHint = (d) => ({ emoji: d === 0 ? "💎" : d <= 1 ? "🔥" : d <= 2 ? "🟡" : d <= 3 ? "🔵" : "❄️", text: d === 0 ? "보물!" : d <= 1 ? "매우 뜨거움!" : d <= 2 ? "따뜻함" : d <= 3 ? "차가움" : "매우 차가움" });
    const lastGuess = guesses[guesses.length - 1];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes treasure { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
                @keyframes heatPulse { 0%,100% { box-shadow: 0 0 5px transparent; } 50% { box-shadow: 0 0 15px rgba(255,100,0,0.5); } }
                @keyframes dig { 0% { transform: scale(1.2); } 100% { transform: scale(1); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                🗺️ 시도: <span style={{ color: "#FFD700" }}>{guesses.length}</span>
                {lastGuess && !found && (
                    <span style={{ marginLeft: 10, color: lastGuess.d <= 1 ? "#EF4444" : lastGuess.d <= 2 ? "#FFD700" : "#3B82F6" }}>
                        {getHint(lastGuess.d).text}
                    </span>
                )}
            </div>

            {/* Temperature bar */}
            {lastGuess && !found && (
                <div style={{ width: 220, height: 12, borderRadius: 6, overflow: "hidden", background: "linear-gradient(90deg, #3B82F6, #22C55E, #FFD700, #EF4444)", position: "relative" }}>
                    <div style={{
                        position: "absolute", top: -2, width: 16, height: 16, borderRadius: "50%",
                        background: "white", border: "2px solid #333",
                        left: `${Math.max(0, (1 - lastGuess.d / 8)) * 100}%`, transform: "translateX(-50%)",
                        transition: "left 0.5s ease",
                    }} />
                </div>
            )}

            {/* Map grid */}
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "3px",
                padding: "8px", borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(139,69,19,0.1), rgba(34,139,34,0.05))",
                border: "2px solid rgba(139,69,19,0.3)",
            }}>
                {Array.from({ length: SIZE * SIZE }).map((_, i) => {
                    const r = Math.floor(i / SIZE), c = i % SIZE;
                    const g = guesses.find((g2) => g2.r === r && g2.c === c);
                    const hint = g ? getHint(g.d) : null;
                    const heatColor = g ? (g.d <= 1 ? "rgba(239,68,68,0.25)" : g.d <= 2 ? "rgba(255,215,0,0.15)" : g.d <= 3 ? "rgba(59,130,246,0.12)" : "rgba(100,100,255,0.08)") : "rgba(255,255,255,0.03)";

                    return (
                        <div key={i} onClick={() => handleClick(r, c)}
                            style={{
                                width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: g ? "22px" : "16px", borderRadius: "8px",
                                cursor: found || g ? "default" : "pointer",
                                background: heatColor,
                                border: g ? (g.d === 0 ? "2px solid #FFD700" : `1px solid rgba(255,255,255,0.15)`) : "1px solid rgba(255,255,255,0.08)",
                                boxShadow: g && g.d <= 1 ? "0 0 12px rgba(239,68,68,0.3)" : "none",
                                animation: g ? (g.d === 0 ? "treasure 0.8s ease infinite" : "dig 0.3s ease") : "none",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => { if (!g && !found) { e.currentTarget.style.background = "rgba(255,215,0,0.1)"; e.currentTarget.style.transform = "scale(1.05)"; } }}
                            onMouseLeave={(e) => { if (!g) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "scale(1)"; } }}
                        >
                            {hint ? hint.emoji : "🗺️"}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: "12px", fontSize: "10px", color: "#8892b0" }}>
                <span>🔥 가까움</span><span>🟡 따뜻</span><span>🔵 차가움</span><span>❄️ 멀음</span>
            </div>

            {found && (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FFD700", animation: "treasure 0.6s ease infinite" }}>
                    🎉 보물 발견! ({guesses.length}번 만에)
                </div>
            )}
        </div>
    );
};

export default TreasureMap;
