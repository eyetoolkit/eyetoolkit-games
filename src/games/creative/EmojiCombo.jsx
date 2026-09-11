/**
 * 🎮 Game 129: Emoji Combo
 * Guess the meaning of 2 emojis
 */
import { useState, useCallback, useMemo } from "react";

const PUZZLES = [
    { emojis: "🌞👓", answer: "Sunglasses", options: ["Sunglasses", "Day", "Heat", "Summer"] },
    { emojis: "💧🌈", answer: "Rainbow", options: ["Rainbow", "Rain", "Sky", "Weather"] },
    { emojis: "❄️🏠", answer: "Igloo", options: ["Igloo", "Winter", "Snow", "Cold"] },
    { emojis: "🐶📦", answer: "Package", options: ["Package", "Puppy", "Gift", "Delivery"] },
    { emojis: "🎵👂", answer: "Listening to music", options: ["Listening to music", "Song", "Noise", "Concert"] },
    { emojis: "🔥🌬️", answer: "Typhoon", options: ["Typhoon", "Fire", "Wind", "Storm"] },
    { emojis: "📱📸", answer: "Selfie", options: ["Selfie", "Smartphone", "Camera", "Photo"] },
    { emojis: "🍔👑", answer: "Burger King", options: ["Burger King", "Burger", "King", "Food"] },
    { emojis: "✈️🌴", answer: "Traveling abroad", options: ["Traveling abroad", "Airplane", "Vacation", "Island"] },
    { emojis: "💡🧠", answer: "Idea", options: ["Idea", "Brain", "Invention", "Genius"] },
    { emojis: "📚🐛", answer: "Bookworm", options: ["Bookworm", "Bookworm", "Reading", "Bug"] },
    { emojis: "🏃💨", answer: "Running", options: ["Running", "Marathon", "Wind", "Exercise"] },
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
                <span>Score: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>Q: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
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
            <div style={{ fontSize: "14px", color: "#8892b0" }}>What does this combo mean?</div>
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
                {feedback === "correct" ? "✓ Correct!" : `✗ ${q.answer}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 Done! {score}/{questions.length}</div>}
        </div>
    );
};

export default EmojiCombo;
