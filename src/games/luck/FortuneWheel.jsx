/**
 * 🎮 Game 137: 행운의 룰렛
 * 룰렛 돌려 최고 배당 노리기
 */
import { useState, useCallback, useRef } from "react";

const SEGMENTS = [
    { label: "x1", multiplier: 1, color: "#4D96FF" },
    { label: "x2", multiplier: 2, color: "#6BCB77" },
    { label: "x0", multiplier: 0, color: "#FF6B6B" },
    { label: "x3", multiplier: 3, color: "#FFD93D" },
    { label: "x1", multiplier: 1, color: "#4D96FF" },
    { label: "x5", multiplier: 5, color: "#9B59B6" },
    { label: "x0", multiplier: 0, color: "#FF6B6B" },
    { label: "x2", multiplier: 2, color: "#6BCB77" },
];

const FortuneWheel = ({ onComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [spinsLeft, setSpinsLeft] = useState(3);
    const [done, setDone] = useState(false);
    const totalRef = useRef(0);

    const spin = useCallback(() => {
        if (spinning || done || spinsLeft <= 0) return;
        setSpinning(true);
        setResult(null);
        const extraRotation = 1440 + Math.random() * 720;
        const newRotation = rotation + extraRotation;
        setRotation(newRotation);

        setTimeout(() => {
            const finalAngle = newRotation % 360;
            const segIdx = Math.floor((360 - finalAngle) / (360 / SEGMENTS.length)) % SEGMENTS.length;
            const seg = SEGMENTS[segIdx];
            setResult(seg);
            totalRef.current += seg.multiplier * 10;
            setTotalScore(totalRef.current);
            setSpinning(false);
            setSpinsLeft(s => s - 1);

            if (spinsLeft <= 1) {
                setDone(true);
                setTimeout(() => onComplete(Math.min(100, Math.max(20, totalRef.current))), 500);
            }
        }, 3000);
    }, [spinning, done, spinsLeft, rotation, onComplete]);

    const segAngle = 360 / SEGMENTS.length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes scorePopIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
                @keyframes pointerBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(3px)} }
            `}</style>
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", alignItems: "center" }}>
                <span>점수: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{totalScore}</span></span>
                <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: i < spinsLeft ? "linear-gradient(135deg, #FFD700, #FF8C42)" : "rgba(255,255,255,0.08)",
                            boxShadow: i < spinsLeft ? "0 0 8px rgba(255,215,0,0.4)" : "none",
                            transition: "all 0.3s",
                        }} />
                    ))}
                </div>
            </div>
            <div style={{
                position: "relative", width: 230, height: 230,
                filter: spinning ? "drop-shadow(0 0 20px rgba(255,215,0,0.3))" : "none",
                transition: "filter 0.5s",
            }}>
                <div style={{
                    position: "absolute", top: -14, left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "22px", zIndex: 2,
                    animation: spinning ? "pointerBounce 0.3s infinite" : "none",
                }}>▼</div>
                <svg width={230} height={230} style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)" : "none",
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                }}>
                    {SEGMENTS.map((seg, i) => {
                        const r = 110;
                        const cx = 115, cy = 115;
                        const startAngle = (i * segAngle * Math.PI) / 180;
                        const endAngle = ((i + 1) * segAngle * Math.PI) / 180;
                        const x1 = cx + r * Math.cos(startAngle);
                        const y1 = cy + r * Math.sin(startAngle);
                        const x2 = cx + r * Math.cos(endAngle);
                        const y2 = cy + r * Math.sin(endAngle);
                        const midAngle = (startAngle + endAngle) / 2;
                        const tx = cx + 65 * Math.cos(midAngle);
                        const ty = cy + 65 * Math.sin(midAngle);
                        return (
                            <g key={i}>
                                <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                                    fill={seg.color} stroke="#0a0a1a" strokeWidth="2" />
                                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                                    fill="white" fontSize="16" fontWeight="bold"
                                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{seg.label}</text>
                            </g>
                        );
                    })}
                    <circle cx="115" cy="115" r="18" fill="#0a0a1a" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <circle cx="115" cy="115" r="8" fill="#FFD700" />
                </svg>
            </div>
            {result && <div style={{
                fontSize: "20px", fontWeight: "bold",
                color: result.multiplier > 0 ? "#64ffda" : "#FF6B6B",
                animation: "scorePopIn 0.3s ease",
                textShadow: `0 0 15px ${result.multiplier > 0 ? "rgba(100,255,218,0.4)" : "rgba(255,107,107,0.4)"}`,
            }}>
                {result.multiplier > 0 ? `🎉 ${result.label} = +${result.multiplier * 10}점!` : "💨 꽝!"}
            </div>}
            {!done && (
                <button onClick={spin} disabled={spinning} style={{
                    padding: "12px 32px", fontSize: "16px", fontWeight: "bold",
                    background: spinning ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                    color: spinning ? "#666" : "#000", border: "none", borderRadius: "14px",
                    cursor: spinning ? "not-allowed" : "pointer",
                    boxShadow: spinning ? "none" : "0 4px 16px rgba(255,107,107,0.3)",
                    transition: "all 0.3s",
                }}>
                    {spinning ? "돌아가는 중..." : "🎰 돌리기!"}
                </button>
            )}
            {done && <div style={{
                fontSize: "18px", fontWeight: "bold",
                color: "#64ffda",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>총점: {totalScore}</div>}
        </div>
    );
};

export default FortuneWheel;
