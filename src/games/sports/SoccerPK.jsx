/**
 * 🎮 Game 98: Soccer PK — progress dots + shot history
 */
import { useCallback, useState } from "react";

const ZONES = [
    { id: "tl", label: "↖", x: 45, y: 35 }, { id: "tc", label: "⬆", x: 125, y: 25 },
    { id: "tr", label: "↗", x: 205, y: 35 }, { id: "bl", label: "↙", x: 55, y: 85 },
    { id: "bc", label: "⬇", x: 125, y: 90 }, { id: "br", label: "↘", x: 195, y: 85 },
];
const MAX = 5;

const SoccerPK = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [goals, setGoals] = useState(0);
    const [saves, setSaves] = useState(0);
    const [phase, setPhase] = useState("aim");
    const [kickTarget, setKickTarget] = useState(null);
    const [keeperPos, setKeeperPos] = useState(null);
    const [ballPos, setBallPos] = useState({ x: 125, y: 230 });
    const [resultText, setResultText] = useState(null);
    const [history, setHistory] = useState([]);

    const kick = useCallback((zone) => {
        if (phase !== "aim") return;
        setPhase("kick"); setKickTarget(zone);
        const keeperZone = ZONES[Math.floor(Math.random() * ZONES.length)];
        setKeeperPos(keeperZone);
        let step = 0;
        const startX = 125, startY = 230, endX = zone.x, endY = zone.y;
        const anim = setInterval(() => {
            step++;
            const t = step / 12;
            setBallPos({ x: startX + (endX - startX) * t, y: startY + (endY - startY) * t - Math.sin(t * Math.PI) * 40 });
            if (step >= 12) {
                clearInterval(anim);
                const saved = keeperZone.id === zone.id;
                const goalScored = !saved;
                const newGoals = goals + (goalScored ? 1 : 0);
                if (goalScored) setGoals(newGoals); else setSaves(s => s + 1);
                setResultText(goalScored ? "⚽ GOOOAL!" : "🧤 Great save!");
                setHistory(h => [...h, goalScored ? "⚽" : "❌"]);
                setPhase("result");
                setTimeout(() => {
                    const nr = round + 1;
                    if (nr >= MAX) { onComplete(Math.round((newGoals / MAX) * 100)); }
                    else { setRound(nr); setPhase("aim"); setKickTarget(null); setKeeperPos(null); setBallPos({ x: 125, y: 230 }); setResultText(null); }
                }, 1200);
            }
        }, 40);
    }, [phase, round, goals, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                {round + 1}/{MAX} | ⚽ <span style={{ color: "#64ffda" }}>{goals}</span> | 🧤 <span style={{ color: "#FF6B6B" }}>{saves}</span>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "5px" }}>
                {Array.from({ length: MAX }).map((_, i) => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: "50%", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: i < history.length ? (history[i] === "⚽" ? "#22C55E" : "#EF4444") : i === round ? "#FFD700" : "rgba(255,255,255,0.1)",
                    }}>{i < history.length ? history[i] : ""}</div>
                ))}
            </div>
            <svg width={250} height={260} style={{
                background: "linear-gradient(180deg, #0d4d0d 0%, #1a6b1a 50%, #0d4d0d 100%)", borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.06)",
            }}>
                <rect x={25} y={0} width={200} height={120} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} rx={2} />
                <rect x={55} y={0} width={140} height={60} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} rx={2} />
                <rect x={35} y={5} width={180} height={105} fill="none" stroke="white" strokeWidth={3} rx={3} />
                {[0, 1, 2, 3, 4, 5, 6].map(i => (<line key={`v${i}`} x1={35 + i * 30} y1={5} x2={35 + i * 30} y2={110} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />))}
                {[0, 1, 2, 3, 4].map(i => (<line key={`h${i}`} x1={35} y1={5 + i * 25} x2={215} y2={5 + i * 25} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />))}
                <rect x={36} y={6} width={178} height={103} fill="rgba(0,0,0,0.2)" rx={2} />
                {phase === "aim" && ZONES.map(z => (
                    <g key={z.id} onClick={() => kick(z)} style={{ cursor: "pointer" }}>
                        <circle cx={z.x} cy={z.y} r={18} fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.3)" strokeWidth={1.5} strokeDasharray="3,3" />
                        <text x={z.x} y={z.y + 5} textAnchor="middle" fontSize="14" fill="rgba(255,215,0,0.5)">{z.label}</text>
                    </g>
                ))}
                {keeperPos ? (<text x={keeperPos.x} y={keeperPos.y + 10} textAnchor="middle" fontSize="28" style={{ transition: "all 0.3s" }}>🧤</text>) : (<text x={125} y={70} textAnchor="middle" fontSize="28">🧤</text>)}
                <circle cx={125} cy={200} r={3} fill="white" opacity={0.5} />
                <g>
                    <circle cx={ballPos.x + 2} cy={ballPos.y + 2} r={9} fill="rgba(0,0,0,0.2)" />
                    <circle cx={ballPos.x} cy={ballPos.y} r={9} fill="white" stroke="#ddd" strokeWidth={1} />
                    <path d={`M${ballPos.x - 3},${ballPos.y - 3} l3,-3 l3,3 l-3,3z`} fill="#333" />
                </g>
                {phase === "aim" && <text x={125} y={248} textAnchor="middle" fontSize="24">🦶</text>}
            </svg>
            {resultText && (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: resultText.includes("GOOOAL") ? "#FFD700" : "#FF6B6B", textShadow: resultText.includes("GOOOAL") ? "0 0 10px rgba(255,215,0,0.4)" : "none" }}>
                    {resultText}
                </div>
            )}
            {phase === "aim" && <div style={{ fontSize: "10px", color: "#8892b0" }}>Click inside the goal to shoot!</div>}
        </div>
    );
};

export default SoccerPK;
