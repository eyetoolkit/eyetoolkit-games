/**
 * 🎮 Game 24: Speed Card — faster card matching + timer + combo
 */
import { useCallback, useEffect, useRef, useState } from "react";

const genCard = () => ({ value: Math.floor(Math.random() * 13) + 1, suit: ["♠️", "♥️", "♦️", "♣️"][Math.floor(Math.random() * 4)] });
const cardName = (n) => n === 1 ? "A" : n === 11 ? "J" : n === 12 ? "Q" : n === 13 ? "K" : `${n}`;
const DURATION = 15;

const SpeedCard = ({ onComplete }) => {
    const [left, setLeft] = useState(genCard);
    const [right, setRight] = useState(genCard);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [time, setTime] = useState(DURATION);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    setDone(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (done) setTimeout(() => onComplete(Math.min(100, score * 5)), 300);
    }, [done]);

    const handleChoice = useCallback((side) => {
        if (feedback || done) return;
        const correct = (side === "left" && left.value >= right.value) || (side === "right" && right.value >= left.value);
        if (correct) {
            setScore((s) => s + 1 + Math.floor(combo / 3));
            setCombo((c) => c + 1);
        } else {
            setCombo(0);
        }
        setFeedback(correct ? "correct" : "wrong");

        setTimeout(() => {
            setLeft(genCard());
            setRight(genCard());
            setFeedback(null);
        }, 300);
    }, [left, right, feedback, done, combo]);

    const cardColor = (s) => s === "♥️" || s === "♦️" ? "#EF4444" : "#1a1a2e";
    const progress = (time / DURATION) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`@keyframes cardBounce { 0% { transform: scale(0.9); } 100% { transform: scale(1); } }`}</style>

            <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <span>Score: <span style={{ color: "#FFD700" }}>{score}</span></span>
                <span>⏱️ <span style={{ color: time <= 3 ? "#FF6B6B" : "#64ffda" }}>{time}s</span></span>
                {combo >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>

            <div style={{ width: 220, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: time <= 3 ? "#FF6B6B" : "#64ffda", borderRadius: 3, transition: "width 1s linear" }} />
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>Pick the higher card!</div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {/* Left card */}
                <button onClick={() => handleChoice("left")} disabled={!!feedback || done}
                    style={{
                        width: 85, height: 115, borderRadius: "12px",
                        background: "linear-gradient(135deg, #f8f8f8, #e0e0e0)",
                        border: feedback && left.value >= right.value ? "3px solid #64ffda" : feedback ? "3px solid #FF6B6B" : "2px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        cursor: feedback || done ? "default" : "pointer",
                        animation: "cardBounce 0.2s ease",
                        transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (!feedback && !done) e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: cardColor(left.suit) }}>{cardName(left.value)}</div>
                    <div style={{ fontSize: "22px" }}>{left.suit}</div>
                </button>

                <div style={{ fontSize: "18px", color: "#FFD700", fontWeight: "bold" }}>VS</div>

                {/* Right card */}
                <button onClick={() => handleChoice("right")} disabled={!!feedback || done}
                    style={{
                        width: 85, height: 115, borderRadius: "12px",
                        background: "linear-gradient(135deg, #f8f8f8, #e0e0e0)",
                        border: feedback && right.value >= left.value ? "3px solid #64ffda" : feedback ? "3px solid #FF6B6B" : "2px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        cursor: feedback || done ? "default" : "pointer",
                        animation: "cardBounce 0.2s ease",
                        transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (!feedback && !done) e.currentTarget.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: cardColor(right.suit) }}>{cardName(right.value)}</div>
                    <div style={{ fontSize: "22px" }}>{right.suit}</div>
                </button>
            </div>

            {done && <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🏆 {score} pts!</div>}
        </div>
    );
};

export default SpeedCard;
