/**
 * 🎮 Game 54: 점 잇기 — SVG 점 연결 + 그림 완성
 */
import { useCallback, useState } from "react";

const PUZZLES = [
    { name: "별", dots: [{ x: 50, y: 10 }, { x: 62, y: 38 }, { x: 95, y: 38 }, { x: 68, y: 58 }, { x: 78, y: 90 }, { x: 50, y: 70 }, { x: 22, y: 90 }, { x: 32, y: 58 }, { x: 5, y: 38 }, { x: 38, y: 38 }], emoji: "⭐" },
    { name: "집", dots: [{ x: 20, y: 80 }, { x: 20, y: 40 }, { x: 50, y: 15 }, { x: 80, y: 40 }, { x: 80, y: 80 }, { x: 60, y: 80 }, { x: 60, y: 55 }, { x: 40, y: 55 }, { x: 40, y: 80 }, { x: 20, y: 80 }], emoji: "🏠" },
    { name: "하트", dots: [{ x: 50, y: 30 }, { x: 35, y: 15 }, { x: 15, y: 20 }, { x: 10, y: 40 }, { x: 15, y: 60 }, { x: 30, y: 72 }, { x: 50, y: 90 }, { x: 70, y: 72 }, { x: 85, y: 60 }, { x: 90, y: 40 }, { x: 85, y: 20 }, { x: 65, y: 15 }, { x: 50, y: 30 }], emoji: "❤️" },
];

const DotConnect = ({ onComplete }) => {
    const [puzzle] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);
    const [connected, setConnected] = useState([0]);
    const [done, setDone] = useState(false);

    const nextDot = connected.length < puzzle.dots.length ? connected.length : null;

    const handleDot = useCallback((idx) => {
        if (done || idx !== nextDot) return;
        const nc = [...connected, idx];
        setConnected(nc);
        if (nc.length >= puzzle.dots.length) {
            setDone(true);
            setTimeout(() => onComplete(100), 800);
        }
    }, [connected, nextDot, puzzle, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes dotPulse { 0%,100% { transform: scale(1); box-shadow: 0 0 4px rgba(255,215,0,0.3); } 50% { transform: scale(1.4); box-shadow: 0 0 12px rgba(255,215,0,0.6); } }
                @keyframes lineGrow { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
                @keyframes revealEmoji { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                {done ? puzzle.emoji : "🔢"} {puzzle.name} 그리기 — <span style={{ color: "#FFD700" }}>{connected.length}/{puzzle.dots.length}</span>
            </div>

            <div style={{
                width: 220, height: 220, position: "relative",
                borderRadius: "16px", background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
            }}>
                {/* SVG lines */}
                <svg style={{ position: "absolute", width: "100%", height: "100%" }} viewBox="0 0 100 100">
                    {connected.slice(1).map((dotIdx, i) => {
                        const from = puzzle.dots[connected[i]];
                        const to = puzzle.dots[dotIdx];
                        return (
                            <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke="#64ffda" strokeWidth="2" strokeLinecap="round"
                                style={{ strokeDasharray: 100, animation: "lineGrow 0.3s ease forwards" }} />
                        );
                    })}
                </svg>

                {/* Dots */}
                {puzzle.dots.map((dot, i) => {
                    const isConnected = connected.includes(i);
                    const isNext = i === nextDot;
                    return (
                        <div key={i} onClick={() => handleDot(i)}
                            style={{
                                position: "absolute",
                                left: `${dot.x}%`, top: `${dot.y}%`,
                                transform: "translate(-50%, -50%)",
                                width: isNext ? 20 : 14, height: isNext ? 20 : 14,
                                borderRadius: "50%",
                                background: isConnected ? "#64ffda" : isNext ? "#FFD700" : "rgba(255,255,255,0.3)",
                                border: isNext ? "2px solid #FFD700" : isConnected ? "2px solid #64ffda" : "1px solid rgba(255,255,255,0.3)",
                                cursor: isNext ? "pointer" : "default",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "8px", fontWeight: "bold", color: "#000",
                                animation: isNext ? "dotPulse 1s ease infinite" : "none",
                                zIndex: isNext ? 10 : 1,
                                transition: "all 0.2s ease",
                            }}>
                            {i + 1}
                        </div>
                    );
                })}

                {/* Completion emoji */}
                {done && (
                    <div style={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "48px",
                        animation: "revealEmoji 0.5s ease",
                    }}>{puzzle.emoji}</div>
                )}
            </div>

            <div style={{ fontSize: "10px", color: "#8892b0" }}>
                {done ? "🎉 완성!" : `다음: ${nextDot !== null ? nextDot + 1 : ""}번 점을 클릭하세요`}
            </div>
        </div>
    );
};

export default DotConnect;
