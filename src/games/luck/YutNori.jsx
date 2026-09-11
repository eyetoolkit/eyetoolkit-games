/**
 * 🎮 Game 77: 윷놀이 — 윷 던지기 애니메이션 + 보드 시각화
 */
import { useCallback, useState } from "react";

const RESULTS = [
    { name: "도", move: 1, emoji: "🔵" },
    { name: "개", move: 2, emoji: "🟢" },
    { name: "걸", move: 3, emoji: "🟡" },
    { name: "윷", move: 4, emoji: "🟠" },
    { name: "모", move: 5, emoji: "🔴" },
];
const BOARD_SIZE = 20;
const MAX_TURNS = 10;

const throwYut = () => {
    // 4 sticks: flat(0) or round(1)
    const sticks = [0, 0, 0, 0].map(() => Math.random() > 0.5 ? 1 : 0);
    const flat = sticks.filter((s) => s === 0).length;
    if (flat === 0) return { ...RESULTS[4], sticks }; // 모
    return { ...RESULTS[flat - 1], sticks };
};

const YutNori = ({ onComplete }) => {
    const [turn, setTurn] = useState(0);
    const [playerPos, setPlayerPos] = useState(0);
    const [aiPos, setAiPos] = useState(0);
    const [throwing, setThrowing] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [stickAngles, setStickAngles] = useState([0, 0, 0, 0]);

    const handleThrow = useCallback(() => {
        if (throwing) return;
        setThrowing(true);

        // Animate sticks
        let frame = 0;
        const anim = setInterval(() => {
            setStickAngles([0, 1, 2, 3].map(() => Math.random() * 360));
            frame++;
            if (frame > 15) {
                clearInterval(anim);
                const result = throwYut();
                setStickAngles(result.sticks.map((s) => s === 0 ? 0 : 90));
                setLastResult(result);

                // Player moves
                setPlayerPos((p) => Math.min(BOARD_SIZE, p + result.move));

                // AI throws
                setTimeout(() => {
                    const aiResult = throwYut();
                    setAiPos((p) => Math.min(BOARD_SIZE, p + aiResult.move));

                    const newTurn = turn + 1;
                    setTurn(newTurn);

                    setTimeout(() => {
                        const pp = Math.min(BOARD_SIZE, playerPos + result.move);
                        const ap = Math.min(BOARD_SIZE, aiPos + aiResult.move);
                        if (pp >= BOARD_SIZE || ap >= BOARD_SIZE || newTurn >= MAX_TURNS) {
                            const score = pp >= BOARD_SIZE ? 100 : Math.round((pp / BOARD_SIZE) * 80);
                            onComplete(score);
                        } else {
                            setThrowing(false);
                        }
                    }, 500);
                }, 800);
            }
        }, 60);
    }, [throwing, turn, playerPos, aiPos, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes yutSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(720deg); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                턴 <span style={{ color: "#FFD700" }}>{turn + 1}/{MAX_TURNS}</span>
            </div>

            {/* Board track */}
            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", maxWidth: 280, justifyContent: "center" }}>
                {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                    <div key={i} style={{
                        width: 24, height: 24, borderRadius: i === 0 ? "50%" : i === BOARD_SIZE ? "50%" : "4px",
                        background: i === 0 ? "rgba(100,255,218,0.3)"
                            : i === BOARD_SIZE ? "rgba(255,215,0,0.4)"
                                : "rgba(255,255,255,0.06)",
                        border: i === BOARD_SIZE ? "2px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", position: "relative",
                    }}>
                        {i === 0 && "출"}
                        {i === BOARD_SIZE && "🏁"}
                        {playerPos === i && i !== 0 && <span style={{ position: "absolute", fontSize: "14px" }}>🧑</span>}
                        {aiPos === i && i !== 0 && <span style={{ position: "absolute", fontSize: "14px", marginTop: -12 }}>🤖</span>}
                    </div>
                ))}
            </div>

            {/* Progress bars */}
            <div style={{ width: 240, display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span>🧑</span>
                    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${(playerPos / BOARD_SIZE) * 100}%`, height: "100%", background: "linear-gradient(90deg, #64ffda, #22C55E)", borderRadius: 4, transition: "width 0.5s ease" }} />
                    </div>
                    <span style={{ color: "#64ffda" }}>{playerPos}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span>🤖</span>
                    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${(aiPos / BOARD_SIZE) * 100}%`, height: "100%", background: "linear-gradient(90deg, #FF6B6B, #EF4444)", borderRadius: 4, transition: "width 0.5s ease" }} />
                    </div>
                    <span style={{ color: "#FF6B6B" }}>{aiPos}</span>
                </div>
            </div>

            {/* Yut sticks */}
            <div style={{ display: "flex", gap: "8px" }}>
                {stickAngles.map((angle, i) => (
                    <div key={i} style={{
                        width: 16, height: 50, borderRadius: "8px",
                        background: angle === 90 || angle === 0
                            ? (angle === 0
                                ? "linear-gradient(180deg, #DEB887, #D2B48C)"
                                : "linear-gradient(180deg, #8B7355, #6B5B45)")
                            : "linear-gradient(180deg, #DEB887, #8B7355)",
                        transform: `rotate(${throwing ? angle : (angle === 90 ? 0 : 0)}deg)`,
                        transition: throwing ? "none" : "transform 0.3s ease",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }} />
                ))}
            </div>

            {lastResult && (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FFD700" }}>
                    {lastResult.emoji} {lastResult.name}! (+{lastResult.move}칸)
                </div>
            )}

            <button onClick={handleThrow} disabled={throwing} style={{
                padding: "12px 28px", fontSize: "15px", fontWeight: "bold",
                background: throwing ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.15))",
                color: "white", border: `2px solid ${throwing ? "#666" : "#FFD700"}`,
                borderRadius: "14px", cursor: throwing ? "wait" : "pointer",
                boxShadow: throwing ? "none" : "0 4px 15px rgba(255,215,0,0.2)",
            }}>🎯 윷 던지기</button>
        </div>
    );
};

export default YutNori;
