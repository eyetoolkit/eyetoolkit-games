/**
 * 🎮 Game 46: Simon Says — color pads + pulse animation
 */
import { useCallback, useEffect, useRef, useState } from "react";

const COLORS = [
    { name: "Red", bg: "#EF4444", glow: "rgba(239,68,68,0.5)" },
    { name: "Blue", bg: "#3B82F6", glow: "rgba(59,130,246,0.5)" },
    { name: "Green", bg: "#22C55E", glow: "rgba(34,197,94,0.5)" },
    { name: "Yellow", bg: "#FFD700", glow: "rgba(255,215,0,0.5)" },
];

const SimonSays = ({ onComplete }) => {
    const [sequence, setSequence] = useState([]);
    const [playerSeq, setPlayerSeq] = useState([]);
    const [activeColor, setActiveColor] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [level, setLevel] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const timeouts = useRef([]);

    const playSequence = useCallback((seq) => {
        setIsPlaying(true);
        seq.forEach((colorIdx, i) => {
            const t1 = setTimeout(() => setActiveColor(colorIdx), i * 700);
            const t2 = setTimeout(() => setActiveColor(null), i * 700 + 400);
            timeouts.current.push(t1, t2);
        });
        const t3 = setTimeout(() => setIsPlaying(false), seq.length * 700);
        timeouts.current.push(t3);
    }, []);

    const nextRound = useCallback(() => {
        const newColor = Math.floor(Math.random() * 4);
        const newSeq = [...sequence, newColor];
        setSequence(newSeq);
        setPlayerSeq([]);
        setLevel((l) => l + 1);
        playSequence(newSeq);
    }, [sequence, playSequence]);

    useEffect(() => {
        if (level === 0) nextRound();
        return () => timeouts.current.forEach(clearTimeout);
    }, []);

    const handlePress = useCallback((idx) => {
        if (isPlaying || gameOver) return;
        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 200);

        const newPlayerSeq = [...playerSeq, idx];
        setPlayerSeq(newPlayerSeq);

        const currentStep = newPlayerSeq.length - 1;
        if (newPlayerSeq[currentStep] !== sequence[currentStep]) {
            setGameOver(true);
            setTimeout(() => onComplete(Math.min(100, level * 12)), 500);
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            setTimeout(nextRound, 800);
        }
    }, [isPlaying, gameOver, playerSeq, sequence, level, nextRound, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`@keyframes padPulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }`}</style>

            <div style={{ fontSize: "13px" }}>
                Level: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{level}</span>
                {isPlaying && <span style={{ color: "#8892b0", marginLeft: 8 }}>👀 Memorize...</span>}
                {!isPlaying && !gameOver && <span style={{ color: "#64ffda", marginLeft: 8 }}>👆 Repeat it!</span>}
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "4px" }}>
                {sequence.map((_, i) => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: i < playerSeq.length ? "#64ffda" : "rgba(255,255,255,0.15)",
                        transition: "background 0.2s ease",
                    }} />
                ))}
            </div>

            {/* Simon pads */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {COLORS.map((color, idx) => (
                    <button key={idx} onClick={() => handlePress(idx)}
                        disabled={isPlaying || gameOver}
                        style={{
                            width: 90, height: 80, borderRadius: "16px",
                            background: activeColor === idx ? color.bg : `${color.bg}33`,
                            border: `3px solid ${activeColor === idx ? color.bg : `${color.bg}55`}`,
                            cursor: isPlaying || gameOver ? "default" : "pointer",
                            boxShadow: activeColor === idx ? `0 0 25px ${color.glow}, inset 0 0 15px ${color.glow}` : `0 4px 12px rgba(0,0,0,0.2)`,
                            animation: activeColor === idx ? "padPulse 0.3s ease" : "none",
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { if (!isPlaying && !gameOver) e.currentTarget.style.background = `${color.bg}55`; }}
                        onMouseLeave={(e) => { if (activeColor !== idx) e.currentTarget.style.background = `${color.bg}33`; }}
                    />
                ))}
            </div>

            {gameOver && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#FF6B6B" }}>
                    💀 Game over! Level {level} reached
                </div>
            )}
        </div>
    );
};

export default SimonSays;
