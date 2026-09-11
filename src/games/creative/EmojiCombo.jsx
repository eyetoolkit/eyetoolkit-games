/**
 * 🎮 Game 129: 이모지 조합
 * 이모지 2개로 의미를 맞추세요
 */
import { useState, useCallback, useMemo } from "react";

const PUZZLES = [
    { emojis: "🌞👓", answer: "선글라스", options: ["선글라스", "낮", "더위", "여름"] },
    { emojis: "💧🌈", answer: "무지개", options: ["무지개", "비", "하늘", "날씨"] },
    { emojis: "❄️🏠", answer: "이글루", options: ["이글루", "겨울", "눈", "추위"] },
    { emojis: "🐶📦", answer: "택배", options: ["택배", "강아지", "선물", "배달"] },
    { emojis: "🎵👂", answer: "음악 감상", options: ["음악 감상", "노래", "소음", "콘서트"] },
    { emojis: "🔥🌬️", answer: "태풍", options: ["태풍", "화재", "바람", "폭풍"] },
    { emojis: "📱📸", answer: "셀카", options: ["셀카", "스마트폰", "카메라", "사진"] },
    { emojis: "🍔👑", answer: "버거킹", options: ["버거킹", "햇버거", "왕", "음식"] },
    { emojis: "✈️🌴", answer: "해외여행", options: ["해외여행", "비행기", "휴가", "섬"] },
    { emojis: "💡🧠", answer: "아이디어", options: ["아이디어", "두뇌", "발명", "천재"] },
    { emojis: "📚🐛", answer: "북웜", options: ["북웜", "책벌레", "독서", "버그"] },
    { emojis: "🏃💨", answer: "달리기", options: ["달리기", "마라톤", "바람", "운동"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const EmojiCombo = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(PUZZLES).slice(0, 8));
    const shuffledOptions = useMemo(() => questions.map(q => shuffle(q.options)), [questions]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const choose = useCallback((answer) => {
        if (done || feedback) return;
        const correct = answer === questions[current].answer;
        setFeedback(correct ? "correct" : "wrong");
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            setFeedback(null);
            if (current + 1 >= questions.length) {
                setDone(true);
                const finalScore = Math.min(100, (score + (correct ? 1 : 0)) * 12 + 4);
                setTimeout(() => onComplete(finalScore), 300);
            } else {
                setCurrent(c => c + 1);
            }
        }, 600);
    }, [current, questions, score, done, feedback, onComplete]);

    const q = questions[current];
    const progress = ((current + (done ? 1 : 0)) / questions.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes emojiBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .emoji-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #9B59B6, #FF6B6B)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                fontSize: "60px", padding: "16px 24px", letterSpacing: "12px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>{q.emojis}</div>
            <div style={{ fontSize: "14px", color: "#8892b0" }}>이 조합의 의미는?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="emoji-opt" onClick={() => choose(opt)} style={{
                        padding: "12px", fontSize: "14px", fontWeight: "600",
                        background: feedback && opt === q.answer ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.06)",
                        color: "white",
                        border: feedback && opt === q.answer ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px", cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>{opt}</button>
                ))}
            </div>
            {feedback && <div style={{
                fontSize: "16px", fontWeight: "bold",
                color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
                animation: "emojiBounce 0.4s ease",
            }}>
                {feedback === "correct" ? "✓ 정답!" : `✗ ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default EmojiCombo;
