/**
 * 🎮 Game 93: 다트 — 진행 도트 + 총점 바 + 임팩트 애니
 */
import { useCallback, useRef, useState } from "react";

const MAX_THROWS = 5;
const CX = 125, CY = 125, R = 110;
const RINGS = [
    { r: 12, pts: 50, color: "#EF4444", label: "Bull's Eye!" },
    { r: 30, pts: 30, color: "#22C55E", label: "Triple!" },
    { r: 55, pts: 20, color: "#EF4444", label: "Double!" },
    { r: 80, pts: 10, color: "#22C55E", label: "Single" },
    { r: 110, pts: 5, color: "#3B82F6", label: "Outer" },
];

const DartGame = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [throws, setThrows] = useState([]);
    const [score, setScore] = useState(0);
    const [lastResult, setLastResult] = useState(null);
    const [shaking, setShaking] = useState(false);

    const handleClick = useCallback((e) => {
        if (throws.length >= MAX_THROWS) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (250 / rect.width);
        const y = (e.clientY - rect.top) * (250 / rect.height);
        const jX = (Math.random() - 0.5) * 16, jY = (Math.random() - 0.5) * 16;
        const fx = x + jX, fy = y + jY;
        const dist = Math.sqrt((fx - CX) ** 2 + (fy - CY) ** 2);
        let pts = 0, label = "Miss!";
        for (const ring of RINGS) { if (dist <= ring.r) { pts = ring.pts; label = ring.label; break; } }
        const newThrows = [...throws, { x: fx, y: fy, pts }];
        setThrows(newThrows); const ns = score + pts; setScore(ns);
        setLastResult({ pts, label }); setShaking(true);
        setTimeout(() => setShaking(false), 200);
        if (newThrows.length >= MAX_THROWS) setTimeout(() => onComplete(Math.min(100, Math.round((ns / (MAX_THROWS * 50)) * 100))), 800);
    }, [throws, score, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <style>{`@keyframes dartHit { 0% { transform: scale(1.15); } 100% { transform: scale(1); } }`}</style>
            <div style={{ fontSize: "13px" }}>
                🎯 {throws.length}/{MAX_THROWS} | 점수: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{score}</span>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "6px" }}>
                {Array.from({ length: MAX_THROWS }).map((_, i) => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: i < throws.length ? (throws[i].pts >= 30 ? "#FFD700" : throws[i].pts >= 10 ? "#64ffda" : "#8892b0") : "rgba(255,255,255,0.1)",
                        transition: "background 0.2s",
                    }} />
                ))}
            </div>
            <div style={{ position: "relative", transform: shaking ? "translate(2px, -2px)" : "none", transition: "transform 0.05s", animation: lastResult ? "dartHit 0.2s ease" : "none" }}>
                <svg ref={canvasRef} width={250} height={250} onClick={handleClick}
                    style={{ cursor: throws.length < MAX_THROWS ? "crosshair" : "default", borderRadius: "50%" }}>
                    <circle cx={CX} cy={CY} r={R} fill="#1a1a2e" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                    {[...RINGS].reverse().map((ring, i) => (
                        <circle key={i} cx={CX} cy={CY} r={ring.r} fill="none" stroke={ring.color} strokeWidth={2} opacity={0.6} />
                    ))}
                    <circle cx={CX} cy={CY} r={110} fill="rgba(59,130,246,0.1)" />
                    <circle cx={CX} cy={CY} r={80} fill="rgba(34,197,94,0.1)" />
                    <circle cx={CX} cy={CY} r={55} fill="rgba(239,68,68,0.1)" />
                    <circle cx={CX} cy={CY} r={30} fill="rgba(34,197,94,0.15)" />
                    <circle cx={CX} cy={CY} r={12} fill="rgba(239,68,68,0.3)" />
                    <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                    <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                    {throws.map((t, i) => (
                        <g key={i}>
                            <circle cx={t.x + 2} cy={t.y + 2} r={5} fill="rgba(0,0,0,0.3)" />
                            <circle cx={t.x} cy={t.y} r={4} fill="#FFD700" stroke="#FFA500" strokeWidth={1.5} />
                            <circle cx={t.x} cy={t.y} r={1.5} fill="#EF4444" />
                            <text x={t.x + 8} y={t.y - 6} fontSize="10" fontWeight="bold"
                                fill={t.pts >= 30 ? "#FFD700" : t.pts >= 20 ? "#64ffda" : "rgba(255,255,255,0.5)"}>+{t.pts}</text>
                        </g>
                    ))}
                    <circle cx={CX} cy={CY} r={3} fill="#FFD700" opacity={0.8} />
                </svg>
            </div>
            {lastResult && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: lastResult.pts >= 30 ? "#FFD700" : lastResult.pts >= 20 ? "#64ffda" : "white" }}>
                    {lastResult.label} +{lastResult.pts}
                </div>
            )}
            {throws.length >= MAX_THROWS && <div style={{ fontSize: "14px", color: "#FFD700" }}>🎯 최종: {score}점 ({Math.round((score / (MAX_THROWS * 50)) * 100)}%)</div>}
            {throws.length < MAX_THROWS && <div style={{ fontSize: "10px", color: "#8892b0" }}>과녁을 클릭!</div>}
        </div>
    );
};

export default DartGame;
