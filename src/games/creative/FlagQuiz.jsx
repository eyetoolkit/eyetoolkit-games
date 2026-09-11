/**
 * 🎮 Game 127: Flag Quiz
 * Look at the flag and guess the country
 */
import { useState, useCallback, useMemo } from "react";

const FLAGS = [
    { flag: "🇯🇵", name: "Japan", options: ["Japan", "China", "Thailand", "Vietnam"] },
    { flag: "🇺🇸", name: "USA", options: ["United Kingdom", "USA", "Australia", "Canada"] },
    { flag: "🇬🇧", name: "United Kingdom", options: ["United Kingdom", "Australia", "New Zealand", "Norway"] },
    { flag: "🇨🇳", name: "China", options: ["Vietnam", "China", "Taiwan", "Hong Kong"] },
    { flag: "🇩🇪", name: "Germany", options: ["Germany", "Belgium", "Netherlands", "Austria"] },
    { flag: "🇫🇷", name: "France", options: ["Italy", "France", "Russia", "Romania"] },
    { flag: "🇮🇹", name: "Italy", options: ["Italy", "Hungary", "Mexico", "Ireland"] },
    { flag: "🇧🇷", name: "Brazil", options: ["Argentina", "Brazil", "Bolivia", "Portugal"] },
    { flag: "🇦🇺", name: "Australia", options: ["Australia", "New Zealand", "United Kingdom", "Fiji"] },
    { flag: "🇲🇽", name: "Mexico", options: ["Mexico", "Italy", "Spain", "Peru"] },
    { flag: "🇪🇸", name: "Spain", options: ["Portugal", "Spain", "Mexico", "Colombia"] },
    { flag: "🇷🇺", name: "Russia", options: ["Russia", "France", "Netherlands", "Czechia"] },
    { flag: "🇮🇳", name: "India", options: ["India", "Pakistan", "Bangladesh", "Sri Lanka"] },
    { flag: "🇹🇭", name: "Thailand", options: ["Thailand", "Vietnam", "Laos", "Myanmar"] },
    { flag: "🇹🇷", name: "Turkey", options: ["Turkey", "Iran", "Iraq", "Egypt"] },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const FlagQuiz = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(FLAGS).slice(0, 10));
    const shuffledOptions = useMemo(() => questions.map(q => shuffle(q.options)), [questions]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const choose = useCallback((answer) => {
        if (done || feedback) return;
        const correct = answer === questions[current].name;
        setFeedback(correct ? "correct" : "wrong");
        if (correct) setScore(s => s + 1);
        setTimeout(() => {
            setFeedback(null);
            if (current + 1 >= questions.length) {
                setDone(true);
                const finalScore = Math.min(100, (score + (correct ? 1 : 0)) * 10);
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
                @keyframes flagBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .flag-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>Score: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}/{current}</span></span>
                <span>Q: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #4D96FF, #6BCB77)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                fontSize: "80px", padding: "12px 24px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                animation: "fadeSlideIn 0.3s ease",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>{q.flag}</div>
            <div style={{ fontSize: "14px", color: "#8892b0" }}>Which country is this flag?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 130px)", gap: "8px" }}>
                {shuffledOptions[current].map((opt) => (
                    <button key={opt} className="flag-opt" onClick={() => choose(opt)} style={{
                        padding: "12px", fontSize: "14px", fontWeight: "600",
                        background: feedback && opt === q.name ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.06)",
                        color: "white",
                        border: feedback && opt === q.name ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px", cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>{opt}</button>
                ))}
            </div>
            {feedback && <div style={{
                fontSize: "16px", fontWeight: "bold",
                color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
                animation: "flagBounce 0.4s ease",
            }}>
                {feedback === "correct" ? "✓ Correct!" : `✗ ${q.name}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 Done! {score}/{questions.length}</div>}
        </div>
    );
};

export default FlagQuiz;
