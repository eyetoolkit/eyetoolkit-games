/**
 * 🎮 Game 127: 국기 맞추기
 * 국기를 보고 나라 이름을 맞추세요
 */
import { useState, useCallback, useMemo } from "react";

const FLAGS = [
    { flag: "🇯🇵", name: "일본", options: ["일본", "중국", "태국", "베트남"] },
    { flag: "🇺🇸", name: "미국", options: ["영국", "미국", "호주", "캐나다"] },
    { flag: "🇬🇧", name: "영국", options: ["영국", "호주", "뉴질랜드", "노르웨이"] },
    { flag: "🇨🇳", name: "중국", options: ["베트남", "중국", "타이완", "홍콩"] },
    { flag: "🇩🇪", name: "독일", options: ["독일", "벨기에", "네덜란드", "오스트리아"] },
    { flag: "🇫🇷", name: "프랑스", options: ["이탈리아", "프랑스", "러시아", "루마니아"] },
    { flag: "🇮🇹", name: "이탈리아", options: ["이탈리아", "헝가리", "멕시코", "아일랜드"] },
    { flag: "🇧🇷", name: "브라질", options: ["아르헨티나", "브라질", "볼리비아", "포르투갈"] },
    { flag: "🇦🇺", name: "호주", options: ["호주", "뉴질랜드", "영국", "피지"] },
    { flag: "🇲🇽", name: "멕시코", options: ["멕시코", "이탈리아", "스페인", "페루"] },
    { flag: "🇪🇸", name: "스페인", options: ["포르투갈", "스페인", "멕시코", "콜롬비아"] },
    { flag: "🇷🇺", name: "러시아", options: ["러시아", "프랑스", "네덜란드", "체코"] },
    { flag: "🇮🇳", name: "인도", options: ["인도", "파키스탄", "방글라데시", "스리랑카"] },
    { flag: "🇹🇭", name: "태국", options: ["태국", "베트남", "라오스", "미얀마"] },
    { flag: "🇹🇷", name: "터키", options: ["터키", "이란", "이라크", "이집트"] },
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
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}/{current}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
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
            <div style={{ fontSize: "14px", color: "#8892b0" }}>이 국기의 나라는?</div>
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
                {feedback === "correct" ? "✓ 정답!" : `✗ ${q.name}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default FlagQuiz;
