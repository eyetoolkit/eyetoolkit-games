/**
 * 🎮 타이밍 탭 — 콤보 시스템 + 난이도 스케일링 + 비주얼 강화
 */
import { useCallback, useEffect, useRef, useState } from "react";

const ROUNDS = 12;

const TimingTap = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [ringSize, setRingSize] = useState(200);
    const [active, setActive] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [perfects, setPerfects] = useState(0);
    const animRef = useRef(null);
    const scoreRef = useRef(0);
    const comboRef = useRef(0);
    const TARGET_SIZE = 60, MAX_SIZE = 200;

    // Speed increases with rounds
    const speed = 2 + Math.floor(round / 4) * 0.5;

    useEffect(() => {
        if (!active || feedback) return;
        const shrink = () => {
            setRingSize((s) => {
                const next = s - speed;
                if (next <= 0) {
                    comboRef.current = 0; setCombo(0);
                    setFeedback("miss");
                    setTimeout(() => nextRound(), 500);
                    return MAX_SIZE;
                }
                return next;
            });
            animRef.current = requestAnimationFrame(shrink);
        };
        animRef.current = requestAnimationFrame(shrink);
        return () => cancelAnimationFrame(animRef.current);
    }, [active, round, feedback, speed]);

    const nextRound = useCallback(() => {
        const next = round + 1;
        if (next >= ROUNDS) {
            setActive(false);
            setTimeout(() => onComplete(Math.min(100, Math.round((scoreRef.current / ROUNDS) * 100))), 500);
            return;
        }
        setRound(next); setRingSize(MAX_SIZE); setFeedback(null);
    }, [round, onComplete]);

    const handleTap = useCallback(() => {
        if (!active || feedback) return;
        cancelAnimationFrame(animRef.current);
        const diff = Math.abs(ringSize - TARGET_SIZE);
        let grade, pts;
        if (diff < 5) {
            grade = "perfect"; pts = 1;
            comboRef.current++; setPerfects(p => p + 1);
        } else if (diff < 15) {
            grade = "great"; pts = 0.7;
            comboRef.current++;
        } else if (diff < 30) {
            grade = "good"; pts = 0.4;
            comboRef.current = Math.max(0, comboRef.current - 1);
        } else {
            grade = "miss"; pts = 0;
            comboRef.current = 0;
        }

        // Combo bonus
        const comboBonus = comboRef.current >= 5 ? 0.3 : comboRef.current >= 3 ? 0.15 : 0;
        pts += comboBonus;

        setCombo(comboRef.current);
        if (comboRef.current > maxCombo) setMaxCombo(comboRef.current);
        scoreRef.current += pts;
        setScore(s => s + pts);
        setFeedback(grade);
        setTimeout(() => nextRound(), 600);
    }, [active, feedback, ringSize, nextRound, maxCombo]);

    const gradeColors = { perfect: "#FFD700", great: "#64ffda", good: "#0cbfff", miss: "#FF6B6B" };
    const gradeText = { perfect: "PERFECT!", great: "GREAT!", good: "GOOD", miss: "MISS" };
    const comboColor = combo >= 5 ? "#FF6B6B" : combo >= 3 ? "#A855F7" : "#FFD700";

    // Ring color based on distance to target
    const distToTarget = Math.abs(ringSize - TARGET_SIZE);
    const ringColorInner = distToTarget < 5 ? "#FFD700" : distToTarget < 15 ? "#64ffda" : distToTarget < 30 ? "#0cbfff" : "rgba(100,180,255,0.4)";

    return (
        <div onClick={handleTap} style={{
            height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "10px", color: "white", cursor: "pointer", userSelect: "none",
        }}>
            <style>{`
                @keyframes gradeFloat { 0% { transform: scale(1.5) translateY(0); opacity: 1; } 100% { transform: scale(1) translateY(-20px); opacity: 0.7; } }
                @keyframes comboPop { 0% { transform: scale(1.4); } 100% { transform: scale(1); } }
                @keyframes perfectFlash { 0%,100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); } 50% { box-shadow: 0 0 50px rgba(255,215,0,0.7); } }
            `}</style>

            {/* Stats */}
            <div style={{ display: "flex", gap: "14px", fontSize: "12px", alignItems: "center" }}>
                <div>라운드: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{round + 1}/{ROUNDS}</span></div>
                <div>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{Math.round(score * 10) / 10}</span></div>
                {combo >= 2 && <div style={{
                    color: comboColor, fontWeight: "bold",
                    animation: "comboPop 0.3s ease",
                }}>🔥 {combo}콤보{combo >= 3 ? ` (+${combo >= 5 ? "30" : "15"}%)` : ""}</div>}
                <div style={{ fontSize: "10px", color: "#FFD700" }}>⭐ {perfects}</div>
            </div>

            {/* Progress bar */}
            <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: ROUNDS }).map((_, i) => (
                    <div key={i} style={{
                        width: 18, height: 5, borderRadius: 3,
                        background: i < round ? "#64ffda" : i === round ? "#FFD700" : "rgba(255,255,255,0.08)",
                        transition: "background 0.2s",
                    }} />
                ))}
            </div>

            {/* Speed indicator */}
            <div style={{ fontSize: "10px", color: "#8892b0" }}>
                속도: {"▮".repeat(Math.floor(speed))}{"▯".repeat(5 - Math.floor(speed))} Lv.{Math.floor(round / 4) + 1}
            </div>

            <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Outer glow ring */}
                {active && distToTarget < 15 && (
                    <div style={{
                        position: "absolute", width: TARGET_SIZE + 20, height: TARGET_SIZE + 20,
                        border: "none", borderRadius: "50%",
                        background: "transparent",
                        boxShadow: `0 0 ${30 - distToTarget * 2}px ${ringColorInner}`,
                        animation: distToTarget < 5 ? "perfectFlash 0.4s ease infinite" : "none",
                    }} />
                )}
                {/* Target ring */}
                <div style={{
                    position: "absolute", width: TARGET_SIZE, height: TARGET_SIZE,
                    border: "3px solid rgba(255,215,0,0.5)", borderRadius: "50%",
                    background: "rgba(255,215,0,0.05)",
                    boxShadow: "0 0 15px rgba(255,215,0,0.1)",
                }} />
                {/* Shrinking ring */}
                {active && !feedback && (
                    <div style={{
                        position: "absolute", width: ringSize, height: ringSize,
                        border: `3px solid ${ringColorInner}`,
                        borderRadius: "50%",
                        boxShadow: distToTarget < 15 ? `0 0 15px ${ringColorInner}` : "none",
                        transition: "border-color 0.05s",
                    }} />
                )}
                {/* Center dot */}
                <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: feedback === "perfect" ? "#FFD700" : "#64ffda",
                    boxShadow: `0 0 ${feedback === "perfect" ? 20 : 8}px ${feedback === "perfect" ? "#FFD700" : "rgba(100,255,218,0.4)"}`,
                    transition: "all 0.2s",
                }} />
                {/* Feedback */}
                {feedback && (
                    <div style={{
                        position: "absolute", fontSize: "26px", fontWeight: "bold",
                        color: gradeColors[feedback],
                        textShadow: `0 0 20px ${gradeColors[feedback]}`,
                        animation: "gradeFloat 0.6s ease",
                    }}>{gradeText[feedback]}</div>
                )}
            </div>

            <div style={{ fontSize: "11px", color: "#8892b0" }}>
                {active ? "원이 노란 고리에 맞을 때 클릭!" : ""}
            </div>
            {!active && (
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#64ffda" }}>
                        최종: {Math.round(score * 10) / 10}점
                    </div>
                    <div style={{ fontSize: "11px", color: "#8892b0" }}>
                        ⭐ Perfect {perfects}회 | 최대 콤보 {maxCombo}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimingTap;
