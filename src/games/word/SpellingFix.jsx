/**
 * 🎮 Game 132: 맞춤법 교정
 * 틀린 맞춤법을 찾아 고치세요
 */
import { useState, useCallback, useMemo } from "react";

const QUESTIONS = [
    { wrong: "됬다", correct: "됐다", options: ["됐다", "됬다", "되었다", "됏다"] },
    { wrong: "웬지", correct: "왠지", options: ["왠지", "웬지", "왜인지", "완지"] },
    { wrong: "어의없다", correct: "어이없다", options: ["어이없다", "어의없다", "어히없다", "얼이없다"] },
    { wrong: "금새", correct: "금세", options: ["금세", "금새", "금쎄", "금셰"] },
    { wrong: "몇일", correct: "며칠", options: ["며칠", "몇일", "멧칠", "몆칠"] },
    { wrong: "겉잡다", correct: "걷잡다", options: ["걷잡다", "겉잡다", "걸잡다", "곧잡다"] },
    { wrong: "문안하다", correct: "무난하다", options: ["무난하다", "문안하다", "무안하다", "문난하다"] },
    { wrong: "설레임", correct: "설렘", options: ["설렘", "설레임", "설래임", "설럼"] },
    { wrong: "바램", correct: "바람", options: ["바람", "바램", "바랬", "바렘"] },
    { wrong: "구지", correct: "굳이", options: ["굳이", "구지", "굿이", "굿지"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SpellingFix = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(QUESTIONS).slice(0, 8));
    const shuffledOptions = useMemo(() => questions.map(q => shuffle(q.options)), [questions]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const choose = useCallback((answer) => {
        if (done || feedback) return;
        const correct = answer === questions[current].correct;
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
                .quiz-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            {/* Progress Bar */}
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #64ffda, #4D96FF)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                padding: "20px 28px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "8px" }}>틀린 표현:</div>
                <div style={{ fontSize: "30px", fontWeight: "bold", color: "#FF6B6B", textDecoration: "line-through", textShadow: "0 0 20px rgba(255,107,107,0.3)" }}>{q.wrong}</div>
            </div>
            <div style={{ fontSize: "14px", color: "#8892b0", letterSpacing: "0.5px" }}>올바른 맞춤법을 고르세요</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="quiz-opt" onClick={() => choose(opt)} style={{
                        padding: "12px", fontSize: "16px", fontWeight: "bold",
                        background: feedback && opt === q.correct ? "rgba(100,255,218,0.2)" : feedback && opt !== q.correct && feedback === "wrong" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.06)",
                        color: "white",
                        border: feedback && opt === q.correct ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.12)",
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
                {feedback === "correct" ? "✓ 정답!" : `✗ 정답: ${q.correct}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default SpellingFix;
