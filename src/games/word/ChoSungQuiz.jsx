/**
 * 🎮 Game 67: 초성 퀴즈 — 카드 플립 애니메이션
 */
import { useCallback, useState } from "react";

const QS = [
    { chosung: "ㅎㄱㄷ", answer: "한글날", hint: "기념일" },
    { chosung: "ㄱㅂㅈ", answer: "김밥집", hint: "음식점" },
    { chosung: "ㄷㅅㄱ", answer: "도서관", hint: "공공시설" },
    { chosung: "ㅈㅎㅊ", answer: "지하철", hint: "교통수단" },
    { chosung: "ㅋㅍㅅ", answer: "커피숍", hint: "카페" },
    { chosung: "ㅂㄷㄱ", answer: "바닷가", hint: "자연" },
    { chosung: "ㅇㅊ", answer: "아침", hint: "시간대" },
    { chosung: "ㅎㄱ", answer: "학교", hint: "교육기관" },
];
const ROUNDS = 6;

const ChoSungQuiz = ({ onComplete }) => {
    const [qs] = useState(() => [...QS].sort(() => Math.random() - 0.5));
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [flipped, setFlipped] = useState(false);
    const q = qs[round % qs.length];

    const handleSubmit = useCallback(() => {
        if (!input.trim() || feedback) return;
        const isC = input.trim() === q.answer;
        if (isC) setCorrect((c) => c + 1);
        setFeedback(isC ? "correct" : "wrong");
        setFlipped(true);

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setInput(""); setFeedback(null); setFlipped(false); }
        }, 1500);
    }, [input, q, round, correct, feedback, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes flipCard { 0% { transform: perspective(400px) rotateY(0); } 50% { transform: perspective(400px) rotateY(90deg); } 100% { transform: perspective(400px) rotateY(0); } }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Chosung card */}
            <div style={{
                width: 200, height: 100, borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: flipped
                    ? (feedback === "correct" ? "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))" : "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,107,107,0.05))")
                    : "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))",
                border: flipped
                    ? (feedback === "correct" ? "2px solid rgba(100,255,218,0.4)" : "2px solid rgba(255,107,107,0.4)")
                    : "2px solid rgba(124,58,237,0.3)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                animation: flipped ? "flipCard 0.6s ease" : "none",
                flexDirection: "column", gap: "4px",
            }}>
                <div style={{
                    fontSize: "36px", fontWeight: "bold", letterSpacing: "12px",
                    background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    animation: !flipped ? "shimmer 3s ease infinite" : "none",
                }}>
                    {flipped ? q.answer : q.chosung}
                </div>
                <div style={{ fontSize: "11px", color: "#8892b0" }}>💡 {q.hint}</div>
            </div>

            {/* Input */}
            {!feedback && (
                <div style={{ display: "flex", gap: "8px" }}>
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="정답을 입력하세요"
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
                        border: "2px solid rgba(124,58,237,0.4)", borderRadius: "10px",
                        cursor: "pointer",
                    }}>확인</button>
                </div>
            )}

            {feedback && (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "🎉 정답!" : `❌ 정답: ${q.answer}`}
                </div>
            )}
        </div>
    );
};

export default ChoSungQuiz;
