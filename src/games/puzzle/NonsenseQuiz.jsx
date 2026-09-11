/**
 * 🎮 Game 146: 넌센스 퀴즈
 * 재미있는 넌센스 문제 맞추기
 */
import { useState, useCallback, useMemo } from "react";

const QUIZZES = [
    { q: "세상에서 가장 지루한 중학교는?", answer: "로딩중학교", options: ["로딩중학교", "졸린중학교", "하품중학교", "잠자는중학교"] },
    { q: "소가 웃으면?", answer: "우유", options: ["우유", "소웃음", "모유", "두유"] },
    { q: "세상에서 가장 뜨거운 과일은?", answer: "핫바나나", options: ["핫바나나", "핫사과", "딸기", "수박"] },
    { q: "아몬드가 죽으면?", answer: "다이아몬드", options: ["다이아몬드", "죽은몬드", "아몬드우유", "견과류"] },
    { q: "왕이 넘어지면?", answer: "킹콩", options: ["킹콩", "왕크러쉬", "왕쿵", "왕위계승"] },
    { q: "시가 죽으면?", answer: "묘지", options: ["묘지", "사망시", "죽은시", "시체"] },
    { q: "세상에서 가장 억울한 도형은?", answer: "원", options: ["원", "삼각형", "사각형", "마름모"] },
    { q: "바나나가 웃으면?", answer: "바나나킥", options: ["바나나킥", "바나나우유", "바하하나", "바나나분리"] },
    { q: "전기가 통하는 과일은?", answer: "파인애플", options: ["파인애플", "사과", "딸기", "수박"] },
    { q: "세상에서 가장 맛있는 집은?", answer: "과자집", options: ["과자집", "맛집", "한식집", "피자집"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const NonsenseQuiz = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(QUIZZES).slice(0, 6));
    const shuffledOptions = useMemo(() => questions.map(q => shuffle(q.options)), [questions]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const choose = useCallback((ans) => {
        if (done || feedback) return;
        const correct = ans === questions[current].answer;
        setFeedback(correct ? "correct" : "wrong");
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            setFeedback(null);
            if (current + 1 >= questions.length) {
                setDone(true);
                setTimeout(() => onComplete(Math.min(100, (score + (correct ? 1 : 0)) * 16 + 4)), 300);
            } else {
                setCurrent(c => c + 1);
            }
        }, 800);
    }, [current, questions, score, done, feedback, onComplete]);

    const q = questions[current];
    const progress = ((current + (done ? 1 : 0)) / questions.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes quizPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes emojiSpin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
                .nons-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "280px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FFD93D, #FF6B6B)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                padding: "20px 24px", maxWidth: "300px", textAlign: "center",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "16px", lineHeight: "1.6" }}>🤔 {q.q}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 135px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="nons-opt" onClick={() => choose(opt)} style={{
                        padding: "12px", fontSize: "13px", fontWeight: "600",
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
                animation: "quizPulse 0.4s ease",
            }}>
                {feedback === "correct" ? "😂 정답!" : `정답: ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default NonsenseQuiz;
