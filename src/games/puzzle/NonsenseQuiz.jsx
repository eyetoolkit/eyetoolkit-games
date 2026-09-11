/**
 * 🎮 Game 146: Nonsense Quiz
 * Fun nonsense riddles
 */
import { useState, useCallback, useMemo } from "react";

const QUIZZES = [
    { q: "Which school is the most boring?", answer: "Loading Middle School", options: ["Loading Middle School", "Snooze Middle School", "Yawning Middle School", "Sleeping Middle School"] },
    { q: "What do you call a laughing cow?", answer: "Milk", options: ["Milk", "A moo-haha", "Moo juice", "Soy happy"] },
    { q: "What's the hottest fruit?", answer: "Hot Banana", options: ["Hot Banana", "A hot apple", "Strawberry", "Watermelon"] },
    { q: "What happens when an almond dies?", answer: "Diamond", options: ["Diamond", "A dead-mond", "Almond milk", "A nut case"] },
    { q: "What happens when the king falls?", answer: "King Kong", options: ["King Kong", "King Crush", "King Thud", "Succession to the throne"] },
    { q: "What happens when a clock dies?", answer: "Cemetery", options: ["Cemetery", "Time of death", "Dead o'clock", "A dead body"] },
    { q: "Which shape gets the worst luck?", answer: "Circle", options: ["Circle", "Triangle", "Square", "Rhombus"] },
    { q: "What happens when a banana laughs?", answer: "Banana Kick", options: ["Banana Kick", "Banana milk", "Ba-na-na-haha", "Banana split"] },
    { q: "Which fruit conducts electricity?", answer: "Pineapple", options: ["Pineapple", "Apple", "Strawberry", "Watermelon"] },
    { q: "Which house is the most delicious?", answer: "Cookie House", options: ["Cookie House", "A tasty house", "A Korean restaurant", "A pizza house"] },
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
                <span>Score: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>Q: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
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
                {feedback === "correct" ? "😂 Correct!" : `Answer: ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 Done! {score}/{questions.length}</div>}
        </div>
    );
};

export default NonsenseQuiz;
