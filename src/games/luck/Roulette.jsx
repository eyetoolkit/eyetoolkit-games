/**
 * 🎮 Game 73: Roulette — CSS spinning wheel + pointer
 */
import { useCallback, useState } from "react";

const SLOTS = [
    { label: "1", color: "#EF4444" }, { label: "2", color: "#1a1a2e" },
    { label: "3", color: "#EF4444" }, { label: "4", color: "#1a1a2e" },
    { label: "5", color: "#EF4444" }, { label: "6", color: "#1a1a2e" },
    { label: "7", color: "#22C55E" }, { label: "8", color: "#EF4444" },
    { label: "9", color: "#1a1a2e" }, { label: "10", color: "#EF4444" },
];
const ROUNDS = 6;

const Roulette = ({ onComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [bet, setBet] = useState(null);
    const [result, setResult] = useState(null);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);

    const spin = useCallback((b) => {
        if (spinning || result) return;
        setBet(b);
        setSpinning(true);

        const spins = 5 + Math.random() * 5;
        const slotIdx = Math.floor(Math.random() * SLOTS.length);
        const degPerSlot = 360 / SLOTS.length;
        const finalDeg = rotation + spins * 360 + slotIdx * degPerSlot;
        setRotation(finalDeg);

        setTimeout(() => {
            const landed = SLOTS[slotIdx];
            const isRed = landed.color === "#EF4444";
            const isGreen = landed.color === "#22C55E";
            const isCorrect = (b === "red" && isRed) || (b === "black" && !isRed && !isGreen);
            if (isCorrect) setCorrect((c) => c + 1);
            setResult({ slot: landed, win: isCorrect });
            setSpinning(false);

            setTimeout(() => {
                const nr = round + 1;
                if (nr >= ROUNDS) {
                    onComplete(Math.round(((correct + (isCorrect ? 1 : 0)) / ROUNDS) * 100));
                } else {
                    setRound(nr);
                    setResult(null);
                    setBet(null);
                }
            }, 1200);
        }, 3000);
    }, [spinning, result, rotation, round, correct, onComplete]);

    const segAngle = 360 / SLOTS.length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Round <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Hits <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Roulette Wheel */}
            <div style={{ position: "relative", width: 200, height: 200 }}>
                {/* Pointer */}
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", fontSize: "24px", zIndex: 10, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>▼</div>

                {/* Wheel */}
                <div style={{
                    width: 200, height: 200, borderRadius: "50%",
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                    position: "relative", overflow: "hidden",
                    boxShadow: "0 0 20px rgba(255,215,0,0.3), inset 0 0 30px rgba(0,0,0,0.3)",
                    border: "4px solid #FFD700",
                }}>
                    {SLOTS.map((slot, i) => (
                        <div key={i} style={{
                            position: "absolute", width: "50%", height: "50%",
                            transformOrigin: "100% 100%",
                            transform: `rotate(${i * segAngle}deg) skewY(${-(90 - segAngle)}deg)`,
                            background: slot.color,
                            borderRight: "1px solid rgba(255,255,255,0.2)",
                        }} />
                    ))}
                    {/* Center */}
                    <div style={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "16px", fontWeight: "bold", zIndex: 5,
                    }}>🎰</div>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div style={{
                    fontSize: "18px", fontWeight: "bold",
                    color: result.win ? "#64ffda" : "#FF6B6B",
                    animation: "pulse 0.5s ease",
                }}>
                    {result.win ? "✅ Hit!" : "❌ Miss"}
                </div>
            )}

            {/* Bet buttons */}
            {!spinning && !result && (
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => spin("red")} style={{
                        padding: "12px 24px", fontSize: "15px", fontWeight: "bold",
                        background: "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(239,68,68,0.2))",
                        color: "white", border: "2px solid #EF4444", borderRadius: "14px", cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(239,68,68,0.2)",
                    }}>🔴 Red</button>
                    <button onClick={() => spin("black")} style={{
                        padding: "12px 24px", fontSize: "15px", fontWeight: "bold",
                        background: "linear-gradient(135deg, rgba(50,50,50,0.6), rgba(30,30,30,0.4))",
                        color: "white", border: "2px solid #666", borderRadius: "14px", cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    }}>⚫ Black</button>
                </div>
            )}

            {spinning && <div style={{ fontSize: "14px", color: "#FFD700" }}>🎡 Spinning...</div>}
        </div>
    );
};

export default Roulette;
