/**
 * 🎮 Game 48: Number Memory — step-by-step number display + keypad
 */
import { useCallback, useEffect, useState } from "react";

const NumberMemory = ({ onComplete }) => {
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState("");
    const [showing, setShowing] = useState(true);
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const genNumber = (len) => Array.from({ length: len + 2 }, () => Math.floor(Math.random() * 10)).join("");

    useEffect(() => {
        const num = genNumber(level);
        setNumber(num);
        setShowing(true);
        setInput("");
        setFeedback(null);
        const t = setTimeout(() => setShowing(false), 1200 + level * 400);
        return () => clearTimeout(t);
    }, [level]);

    const handleSubmit = useCallback(() => {
        if (showing || feedback || done) return;
        const isC = input === number;
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            if (!isC || level >= 8) {
                setDone(true);
                setTimeout(() => onComplete(Math.min(100, level * 12)), 300);
            } else {
                setLevel((l) => l + 1);
            }
        }, 1000);
    }, [input, number, showing, feedback, done, level, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes numFade { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.8); } }
                @keyframes numShow { 0% { opacity: 0; transform: scale(1.3); } 100% { opacity: 1; transform: scale(1); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                Level: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{level}</span> | Digit length: <span style={{ color: "#64ffda" }}>{level + 2}</span>
            </div>

            {/* Number display */}
            <div style={{
                minWidth: 140, padding: "20px 28px", borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: showing ? `${Math.max(18, 32 - level * 2)}px` : "24px",
                fontWeight: "bold", fontFamily: "monospace", letterSpacing: "6px",
                background: feedback === "correct" ? "rgba(100,255,218,0.12)"
                    : feedback === "wrong" ? "rgba(255,107,107,0.12)"
                        : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
                border: feedback === "correct" ? "3px solid #64ffda"
                    : feedback === "wrong" ? "3px solid #FF6B6B"
                        : "3px solid rgba(124,58,237,0.3)",
                color: showing ? "#FFD700" : "#8892b0",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                animation: showing ? "numShow 0.4s ease" : "none",
            }}>
                {showing ? number : (feedback ? number : "?")}
            </div>

            {!showing && !done && !feedback && (
                <>
                    <input value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Enter the number"
                        autoFocus maxLength={level + 2}
                        style={{
                            width: 160, padding: "10px", fontSize: "18px",
                            fontFamily: "monospace", letterSpacing: "4px",
                            background: "rgba(255,255,255,0.06)", color: "white",
                            border: "2px solid rgba(255,255,255,0.15)",
                            borderRadius: "10px", outline: "none", textAlign: "center",
                        }} />
                    <button onClick={handleSubmit} style={{
                        padding: "8px 24px", fontSize: "14px", fontWeight: "bold",
                        background: input.length === level + 2 ? "rgba(34,197,94,0.2)" : "rgba(100,100,100,0.15)",
                        color: "white", border: `2px solid ${input.length === level + 2 ? "#22C55E" : "#555"}`,
                        borderRadius: "10px", cursor: "pointer",
                    }}>OK</button>
                </>
            )}

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ Correct! Next level..." : `❌ Wrong!`}
                </div>
            )}

            {showing && <div style={{ fontSize: "12px", color: "#8892b0" }}>👀 Memorize the number!</div>}
        </div>
    );
};

export default NumberMemory;
