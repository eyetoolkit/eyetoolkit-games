/**
 * 🎮 Game 11: Whack-a-Mole — hit particles + combo + timer bar
 */
import { useCallback, useEffect, useRef, useState } from "react";

const HOLES = 9;
const GAME_TIME = 15000;
const MOLE_SHOW_TIME = 1000;
const MOLE_INTERVAL = 600;

const WhackAMole = ({ onComplete }) => {
    const [moles, setMoles] = useState(Array(HOLES).fill(false));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME / 1000);
    const [gameActive, setGameActive] = useState(true);
    const [combo, setCombo] = useState(0);
    const [hitIdx, setHitIdx] = useState(null);
    const scoreRef = useRef(0);
    const comboRef = useRef(0);

    const showMole = useCallback(() => {
        const idx = Math.floor(Math.random() * HOLES);
        setMoles((prev) => { const next = [...prev]; next[idx] = true; return next; });
        setTimeout(() => {
            setMoles((prev) => { const next = [...prev]; next[idx] = false; return next; });
        }, MOLE_SHOW_TIME);
    }, []);

    useEffect(() => {
        const moleTimer = setInterval(showMole, MOLE_INTERVAL);
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer); clearInterval(moleTimer);
                    setGameActive(false);
                    setTimeout(() => onComplete(Math.min(100, Math.round(scoreRef.current * 5))), 500);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { clearInterval(timer); clearInterval(moleTimer); };
    }, [showMole, onComplete]);

    const whack = useCallback((idx) => {
        if (!gameActive || !moles[idx]) return;
        setMoles((prev) => { const next = [...prev]; next[idx] = false; return next; });
        scoreRef.current += 1;
        comboRef.current += 1;
        setScore(scoreRef.current);
        setCombo(comboRef.current);
        setHitIdx(idx);
        setTimeout(() => setHitIdx(null), 300);
    }, [gameActive, moles]);

    const miss = useCallback((idx) => {
        if (!gameActive || moles[idx]) return;
        comboRef.current = 0;
        setCombo(0);
    }, [gameActive, moles]);

    const progress = (timeLeft / (GAME_TIME / 1000)) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes moleUp { 0% { transform: translateY(20px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
                @keyframes hitPop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
                @keyframes hitStar { 0% { opacity: 1; transform: scale(0.5) translateY(0); } 100% { opacity: 0; transform: scale(1.5) translateY(-20px); } }
            `}</style>

            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>⏱ <span style={{ color: timeLeft <= 3 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
                <span>🎯 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                {combo >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>

            {/* Timer bar */}
            <div style={{ width: 240, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: timeLeft <= 3 ? "#FF6B6B" : "#64ffda", borderRadius: 3, transition: "width 1s linear" }} />
            </div>

            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 70px)", gap: "10px",
                padding: "16px", background: "rgba(139,90,43,0.25)",
                borderRadius: "16px", border: "2px solid rgba(139,90,43,0.3)",
            }}>
                {moles.map((active, idx) => (
                    <div key={idx}
                        onClick={() => active ? whack(idx) : miss(idx)}
                        style={{
                            width: 70, height: 70, borderRadius: "50%",
                            background: active
                                ? "linear-gradient(135deg, #8B5A2B, #D2691E)"
                                : "rgba(80,40,20,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: active ? "32px" : "20px",
                            cursor: "pointer",
                            boxShadow: active
                                ? "0 0 18px rgba(210,105,30,0.5), inset 0 -3px 6px rgba(0,0,0,0.3)"
                                : "inset 0 4px 8px rgba(0,0,0,0.4)",
                            transform: hitIdx === idx ? "scale(0.85)" : active ? "scale(1.1)" : "scale(1)",
                            animation: active ? "moleUp 0.2s ease" : hitIdx === idx ? "hitPop 0.2s ease" : "none",
                            transition: "transform 0.1s ease, box-shadow 0.15s ease",
                            userSelect: "none",
                            position: "relative",
                        }}
                    >
                        {active ? "🐹" : "🕳️"}
                        {hitIdx === idx && (
                            <span style={{
                                position: "absolute", top: -8, fontSize: "16px",
                                animation: "hitStar 0.3s ease forwards",
                            }}>💥</span>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                {gameActive ? "Click the moles fast!" : `Game over! ${score} moles caught`}
            </div>
        </div>
    );
};

export default WhackAMole;
