/**
 * 🎮 Game 59: 로고 퀴즈 — 블러→선명 애니메이션 + 힌트 시스템
 */
import { useCallback, useEffect, useState } from "react";

const LOGOS = [
    { emoji: "🍎", name: "Apple", hint: "과일 이름의 IT 기업" },
    { emoji: "🔍", name: "Google", hint: "세계 최대 검색 엔진" },
    { emoji: "🪟", name: "Microsoft", hint: "Windows 만든 회사" },
    { emoji: "📱", name: "Samsung", hint: "한국 대표 전자기업" },
    { emoji: "☕", name: "Java", hint: "커피잔 로고의 프로그래밍 언어" },
    { emoji: "🐧", name: "Linux", hint: "펭귄이 마스코트인 OS" },
    { emoji: "🐍", name: "Python", hint: "뱀 이름의 프로그래밍 언어" },
    { emoji: "⚛️", name: "React", hint: "Facebook이 만든 UI 라이브러리" },
];
const ROUNDS = 6;

const LogoQuiz = ({ onComplete }) => {
    const [items] = useState(() => [...LOGOS].sort(() => Math.random() - 0.5));
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [blur, setBlur] = useState(20);
    const [showHint, setShowHint] = useState(false);

    const current = items[round % LOGOS.length];

    // Gradually reduce blur
    useEffect(() => {
        if (feedback) return;
        const t = setInterval(() => {
            setBlur((b) => Math.max(0, b - 1));
        }, 200);
        return () => clearInterval(t);
    }, [round, feedback]);

    const handleSubmit = useCallback(() => {
        if (!input.trim() || feedback) return;
        const isC = input.trim().toLowerCase() === current.name.toLowerCase();
        if (isC) setCorrect((c) => c + 1);
        setFeedback(isC ? "correct" : "wrong");
        setBlur(0);

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setInput(""); setFeedback(null); setBlur(20); setShowHint(false); }
        }, 1200);
    }, [input, current, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`@keyframes logoReveal { 0% { filter: blur(20px) saturate(0); } 100% { filter: blur(0) saturate(1); } }`}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Logo card */}
            <div style={{
                width: 120, height: 120, borderRadius: "24px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "60px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                border: feedback ? (feedback === "correct" ? "3px solid #64ffda" : "3px solid #FF6B6B") : "3px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                filter: feedback ? "blur(0)" : `blur(${blur}px)`,
                animation: feedback ? "logoReveal 0.5s ease" : "none",
                transition: "filter 0.2s ease",
            }}>
                {current.emoji}
            </div>

            {/* Name display on answer */}
            {feedback && (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FFD700" }}>{current.name}</div>
            )}

            {/* Hint */}
            {!feedback && (
                <button onClick={() => setShowHint(true)} style={{
                    padding: "4px 12px", fontSize: "11px",
                    background: "rgba(255,255,255,0.04)", color: "#8892b0",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
                    cursor: "pointer",
                }}>
                    {showHint ? `💡 ${current.hint}` : "💡 힌트 보기"}
                </button>
            )}

            {/* Input */}
            {!feedback && (
                <div style={{ display: "flex", gap: "6px" }}>
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="브랜드 이름"
                        autoFocus
                        style={{
                            width: 140, padding: "10px 14px", fontSize: "14px",
                            background: "rgba(255,255,255,0.06)", color: "white",
                            border: "2px solid rgba(255,255,255,0.15)",
                            borderRadius: "10px", outline: "none", textAlign: "center",
                        }} />
                    <button onClick={handleSubmit} style={{
                        padding: "10px 18px", fontSize: "14px", fontWeight: "bold",
                        background: "rgba(124,58,237,0.2)", color: "white",
                        border: "2px solid rgba(124,58,237,0.4)", borderRadius: "10px", cursor: "pointer",
                    }}>확인</button>
                </div>
            )}

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "✅ 정답!" : `❌ 오답`}
                </div>
            )}
        </div>
    );
};

export default LogoQuiz;
