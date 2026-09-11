/**
 * 🎮 Game 131: 속담 완성
 * 빈칸을 채워 속담을 완성하세요
 */
import { useState, useCallback, useMemo } from "react";

const PROVERBS = [
    { text: "가는 말이 고와야 ___ 말이 곱다", answer: "오는", options: ["오는", "가는", "좋은", "나쁜"] },
    { text: "낮말은 새가 듣고 ___은 쥐가 듣는다", answer: "밤말", options: ["밤말", "잠꼬대", "혼잣말", "큰말"] },
    { text: "소 잃고 ___ 고친다", answer: "외양간", options: ["외양간", "대문", "지붕", "마구간"] },
    { text: "백지장도 ___ 들면 낫다", answer: "맞", options: ["맞", "같이", "함께", "모두"] },
    { text: "___ 도 제 말 하면 온다", answer: "호랑이", options: ["호랑이", "곰", "원숭이", "사자"] },
    { text: "세 살 버릇 ___ 간다", answer: "여든까지", options: ["여든까지", "평생", "죽을때까지", "영원히"] },
    { text: "아는 길도 ___ 가라", answer: "물어", options: ["물어", "천천히", "조심히", "살펴"] },
    { text: "___ 이 반이다", answer: "시작", options: ["시작", "절반", "노력", "끝"] },
    { text: "원숭이도 ___에서 떨어진다", answer: "나무", options: ["나무", "절벽", "바위", "산"] },
    { text: "돌다리도 ___ 건너라", answer: "두드려보고", options: ["두드려보고", "조심히", "살펴보고", "천천히"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ProverbComplete = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(PROVERBS).slice(0, 8));
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
                @keyframes quizPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .prov-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FFD93D, #FF8C42)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                padding: "18px 22px", maxWidth: "300px", textAlign: "center",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "18px", lineHeight: "1.7" }}>{q.text}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="prov-opt" onClick={() => choose(opt)} style={{
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
                animation: "quizPulse 0.4s ease",
            }}>
                {feedback === "correct" ? "✓ 정답!" : `✗ 정답: ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default ProverbComplete;
