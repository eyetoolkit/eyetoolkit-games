/**
 * 🎮 가위바위보 — 토너먼트 모드 + 스페셜 무브 + 패턴 AI + 파워 게이지
 */
import { useCallback, useState } from "react";

const MOVES = ["✊", "✋", "✌️"];
const NAMES = ["바위", "보", "가위"];
const SPECIAL_MOVES = [
    { emoji: "🔥", name: "불주먹", beats: [2], desc: "가위에 강력!" },
    { emoji: "🛡️", name: "방패", beats: [0], desc: "바위를 막음!" },
    { emoji: "⚡", name: "번개", beats: [1], desc: "보를 찢음!" },
];
const BEST_OF = 7;

const RPS = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);
    const [result, setResult] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [power, setPower] = useState(0);
    const [usedSpecial, setUsedSpecial] = useState(false);
    const [history, setHistory] = useState([]);
    const [aiPersonality] = useState(() => ["aggressive", "defensive", "random"][Math.floor(Math.random() * 3)]);

    // AI with personality patterns
    const getAiChoice = useCallback(() => {
        if (history.length < 2) return Math.floor(Math.random() * 3);

        const lastPlayerMove = history[history.length - 1]?.player;
        if (aiPersonality === "aggressive") {
            // Tends to pick what beats player's last move
            const counter = (lastPlayerMove + 1) % 3;
            return Math.random() < 0.6 ? counter : Math.floor(Math.random() * 3);
        } else if (aiPersonality === "defensive") {
            // Tends to repeat what won last
            const lastAi = history[history.length - 1]?.ai;
            return Math.random() < 0.5 ? lastAi : Math.floor(Math.random() * 3);
        }
        return Math.floor(Math.random() * 3);
    }, [history, aiPersonality]);

    const play = useCallback((pi, isSpecial = false) => {
        if (animating) return;
        setAnimating(true);

        setTimeout(() => {
            const ai = getAiChoice();
            let w, isDraw;

            if (isSpecial) {
                const special = SPECIAL_MOVES[pi];
                w = special.beats.includes(ai);
                isDraw = false;
                setUsedSpecial(true);
                setPower(0);
            } else {
                w = (pi === 0 && ai === 2) || (pi === 1 && ai === 0) || (pi === 2 && ai === 1);
                isDraw = pi === ai;
            }

            const outcome = w ? "win" : isDraw ? "draw" : "lose";
            setResult({ player: pi, ai, outcome, isSpecial });
            setHistory(h => [...h, { player: pi, ai, outcome }]);

            if (w) {
                setWins(x => x + 1);
                if (!isSpecial) setPower(p => Math.min(100, p + 35));
            } else if (!isDraw) {
                setLosses(x => x + 1);
                if (!isSpecial) setPower(p => Math.min(100, p + 20));
            } else {
                if (!isSpecial) setPower(p => Math.min(100, p + 10));
            }

            setTimeout(() => {
                const n = round + 1;
                const newWins = wins + (w ? 1 : 0);
                const newLosses = losses + (!w && !isDraw ? 1 : 0);
                if (n >= BEST_OF || newWins >= 4 || newLosses >= 4) {
                    onComplete(Math.round((newWins / Math.max(1, n)) * 100));
                } else {
                    setRound(n);
                    setResult(null);
                    setAnimating(false);
                }
            }, 1500);
        }, 800);
    }, [animating, round, wins, losses, getAiChoice, onComplete]);

    const aiLabel = aiPersonality === "aggressive" ? "🗡️ 공격형" : aiPersonality === "defensive" ? "🛡️ 수비형" : "🎭 랜덤형";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes rpsShake { 0%,100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-18px) rotate(-12deg); } 50% { transform: translateY(0); } 75% { transform: translateY(-18px) rotate(12deg); } }
                @keyframes rpsReveal { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
                @keyframes rpsWin { 0%,100% { text-shadow: 0 0 10px rgba(100,255,218,0.5); } 50% { text-shadow: 0 0 30px rgba(100,255,218,0.9); } }
                @keyframes rpsBounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
                @keyframes specialFlash { 0%,100% { box-shadow: 0 0 15px rgba(255,107,107,0.4); } 50% { box-shadow: 0 0 35px rgba(255,215,0,0.7); } }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "14px", fontSize: "12px", alignItems: "center" }}>
                <span style={{ color: "#FFD700" }}>R{round + 1}/{BEST_OF}</span>
                <span>🏆 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{wins}</span> - <span style={{ color: "#FF6B6B", fontWeight: "bold" }}>{losses}</span></span>
                <span style={{ fontSize: "10px", color: "#8892b0", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)" }}>{aiLabel}</span>
            </div>

            {/* History */}
            <div style={{ display: "flex", gap: "4px" }}>
                {history.map((h, i) => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: h.outcome === "win" ? "#64ffda" : h.outcome === "draw" ? "#FFD700" : "#FF6B6B",
                        boxShadow: `0 0 3px ${h.outcome === "win" ? "#64ffda" : h.outcome === "draw" ? "#FFD700" : "#FF6B6B"}`,
                    }} />
                ))}
            </div>

            {/* VS Arena */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#64ffda", marginBottom: 4 }}>🧑 나</div>
                    <div style={{
                        width: 85, height: 85, borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                        border: result?.isSpecial ? "3px solid #FFD700" : "2px solid rgba(100,255,218,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "44px",
                        animation: result ? (result.isSpecial ? "specialFlash 0.5s infinite" : "rpsReveal 0.4s ease") : "none",
                    }}>
                        {result ? (result.isSpecial ? SPECIAL_MOVES[result.player].emoji : MOVES[result.player]) : "❓"}
                    </div>
                </div>

                <div style={{
                    fontSize: "26px", fontWeight: "bold",
                    background: "linear-gradient(135deg, #FFD700, #FF6B6B)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    animation: animating && !result ? "rpsBounce 0.4s ease infinite" : "none",
                }}>VS</div>

                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#FF6B6B", marginBottom: 4 }}>🤖 AI</div>
                    <div style={{
                        width: 85, height: 85, borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,107,107,0.05))",
                        border: "2px solid rgba(255,107,107,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "44px",
                        animation: animating && !result ? "rpsShake 0.3s ease infinite" : result ? "rpsReveal 0.4s ease" : "none",
                    }}>
                        {result ? MOVES[result.ai] : (animating ? "✊" : "❓")}
                    </div>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div style={{
                    fontSize: "22px", fontWeight: "bold",
                    color: result.outcome === "win" ? "#64ffda" : result.outcome === "draw" ? "#FFD700" : "#FF6B6B",
                    animation: result.outcome === "win" ? "rpsWin 0.8s ease infinite" : "rpsReveal 0.3s ease",
                }}>
                    {result.outcome === "win" ? (result.isSpecial ? "⚡ 스페셜 승리!" : "🎉 승리!") : result.outcome === "draw" ? "🤝 무승부" : "💀 패배"}
                </div>
            )}

            {/* Power gauge */}
            {!animating && (
                <div style={{ width: 200, textAlign: "center" }}>
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{
                            width: `${power}%`, height: "100%",
                            background: power >= 100 ? "linear-gradient(90deg, #FF6B6B, #FFD700)" : "linear-gradient(90deg, #A855F7, #FF6B6B)",
                            borderRadius: 3, transition: "width 0.3s",
                        }} />
                    </div>
                    <div style={{ fontSize: "9px", color: power >= 100 ? "#FFD700" : "#8892b0", marginTop: "2px" }}>
                        {power >= 100 ? "⚡ 스페셜 무브 사용 가능!" : `파워 게이지: ${power}%`}
                    </div>
                </div>
            )}

            {/* Move buttons */}
            {!animating && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {MOVES.map((m, i) => (
                            <button key={i} onClick={() => play(i)} style={{
                                width: 68, height: 68, fontSize: "34px",
                                borderRadius: "18px", cursor: "pointer",
                                background: "rgba(255,255,255,0.08)",
                                border: "2px solid rgba(255,255,255,0.15)",
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                            >
                                {m}
                                <div style={{ fontSize: "9px", color: "#8892b0" }}>{NAMES[i]}</div>
                            </button>
                        ))}
                    </div>

                    {/* Special moves */}
                    {power >= 100 && !usedSpecial && (
                        <div style={{ display: "flex", gap: "6px" }}>
                            {SPECIAL_MOVES.map((s, i) => (
                                <button key={i} onClick={() => play(i, true)} style={{
                                    padding: "6px 12px", fontSize: "11px",
                                    background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,107,0.1))",
                                    color: "#FFD700", border: "1px solid rgba(255,215,0,0.4)",
                                    borderRadius: "8px", cursor: "pointer",
                                    animation: "specialFlash 1s infinite",
                                }}>
                                    {s.emoji} {s.name}
                                    <div style={{ fontSize: "8px", color: "#8892b0" }}>{s.desc}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RPS;
