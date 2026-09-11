/**
 * 🎮 Game 133: 문장 순서 맞추기
 * 뒤섞인 문장을 올바른 순서로 정렬 — 드래그 느낌 + 애니메이션
 */
import { useState, useCallback } from "react";

const SENTENCES = [
    { parts: ["오늘", "날씨가", "정말", "좋습니다"], answer: [0, 1, 2, 3] },
    { parts: ["나는", "학교에서", "수학을", "공부한다"], answer: [0, 1, 2, 3] },
    { parts: ["그는", "매일", "아침", "운동을 한다"], answer: [0, 1, 2, 3] },
    { parts: ["우리", "집", "앞에", "큰 나무가 있다"], answer: [0, 1, 2, 3] },
    { parts: ["빨간", "사과를", "먹고", "싶다"], answer: [0, 1, 2, 3] },
    { parts: ["한국어를", "배우는 것은", "재미있고", "보람차다"], answer: [0, 1, 2, 3] },
];

const SentenceOrder = ({ onComplete }) => {
    const [sentences] = useState(() => [...SENTENCES].sort(() => Math.random() - 0.5).slice(0, 5));
    const [current, setCurrent] = useState(0);
    const [placed, setPlaced] = useState([]);
    const [remaining, setRemaining] = useState(() => {
        const s = sentences[0];
        return s.parts.map((_, i) => i).sort(() => Math.random() - 0.5);
    });
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);

    const addWord = useCallback((idx) => {
        if (done || feedback) return;
        setPlaced(prev => [...prev, remaining[idx]]);
        setRemaining(prev => prev.filter((_, i) => i !== idx));
    }, [remaining, done, feedback]);

    const removeWord = useCallback((idx) => {
        if (done || feedback) return;
        setRemaining(prev => [...prev, placed[idx]]);
        setPlaced(prev => prev.filter((_, i) => i !== idx));
    }, [placed, done, feedback]);

    const check = useCallback(() => {
        if (done || feedback) return;
        const s = sentences[current];
        const correct = placed.length === s.parts.length && placed.every((p, i) => p === s.answer[i]);
        setFeedback(correct ? "correct" : "wrong");
        if (correct) {
            setScore(sc => sc + 1);
            setStreak(s2 => s2 + 1);
        } else {
            setStreak(0);
        }
        setTimeout(() => {
            setFeedback(null);
            if (current + 1 >= sentences.length) {
                setDone(true);
                const finalScore = Math.min(100, (score + (correct ? 1 : 0)) * 20);
                setTimeout(() => onComplete(finalScore), 300);
            } else {
                const next = current + 1;
                setCurrent(next);
                setPlaced([]);
                setRemaining(sentences[next].parts.map((_, i) => i).sort(() => Math.random() - 0.5));
            }
        }, 800);
    }, [current, sentences, placed, score, done, feedback, onComplete]);

    const s = sentences[current];
    const progress = ((current + (feedback ? 1 : 0)) / sentences.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes wordPop { from{transform:scale(0.7) translateY(5px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
                @keyframes correctPulse { 0%{box-shadow:0 0 0 0 rgba(100,255,218,0.4)} 100%{box-shadow:0 0 0 12px transparent} }
                @keyframes wrongShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
                .word-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{sentences.length}</span></span>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                {streak >= 2 && <span style={{ color: "#A855F7", fontSize: "12px" }}>🔥{streak}연속!</span>}
            </div>
            {/* Progress bar */}
            <div style={{ width: "280px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #64ffda, #3B82F6)", transition: "width 0.5s ease" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>📝 올바른 순서로 배열하세요</div>
            {/* Placed area */}
            <div style={{
                minHeight: "50px", padding: "10px", display: "flex", gap: "6px", flexWrap: "wrap",
                justifyContent: "center", minWidth: "280px", borderRadius: "12px",
                background: feedback === "correct" ? "rgba(100,255,218,0.08)" : feedback === "wrong" ? "rgba(255,107,107,0.08)" : "rgba(100,255,218,0.03)",
                border: feedback === "correct" ? "2px solid rgba(100,255,218,0.4)" : feedback === "wrong" ? "2px solid rgba(255,107,107,0.4)" : "1px dashed rgba(100,255,218,0.2)",
                animation: feedback === "correct" ? "correctPulse 0.5s ease" : feedback === "wrong" ? "wrongShake 0.4s ease" : "none",
                transition: "all 0.3s",
            }}>
                {placed.length === 0 && <span style={{ color: "#8892b0", fontSize: "12px", alignSelf: "center" }}>여기에 단어가 배열됩니다</span>}
                {placed.map((partIdx, i) => (
                    <button key={`placed-${i}`} onClick={() => removeWord(i)} className="word-btn" style={{
                        padding: "8px 14px", fontSize: "14px", fontWeight: "bold",
                        background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                        color: "#64ffda",
                        border: "1px solid rgba(100,255,218,0.3)", borderRadius: "10px",
                        cursor: feedback ? "default" : "pointer",
                        animation: `wordPop 0.25s ease ${i * 0.05}s both`,
                        transition: "all 0.2s",
                    }}>{i + 1}. {s.parts[partIdx]}</button>
                ))}
            </div>
            {/* Remaining */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {remaining.map((partIdx, i) => (
                    <button key={`rem-${i}`} onClick={() => addWord(i)} className="word-btn" style={{
                        padding: "8px 14px", fontSize: "14px",
                        background: "rgba(255,255,255,0.06)", color: "white",
                        border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
                        cursor: feedback ? "default" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}>{s.parts[partIdx]}</button>
                ))}
            </div>
            {placed.length === s.parts.length && !feedback && (
                <button onClick={check} style={{
                    padding: "10px 24px", fontSize: "14px", fontWeight: "bold",
                    background: "linear-gradient(135deg, rgba(100,255,218,0.2), rgba(59,130,246,0.1))",
                    color: "#64ffda", border: "1px solid rgba(100,255,218,0.4)",
                    borderRadius: "10px", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(100,255,218,0.15)",
                }}>✅ 확인</button>
            )}
            {feedback && <div style={{
                fontSize: "18px", fontWeight: "bold",
                color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
            }}>
                {feedback === "correct" ? "✅ 정답!" : "❌ 순서가 틀렸습니다"}
            </div>}
            {done && <div style={{
                fontSize: "16px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 10px rgba(100,255,218,0.5)",
            }}>🎉 완료! {score}/{sentences.length}</div>}
        </div>
    );
};

export default SentenceOrder;
