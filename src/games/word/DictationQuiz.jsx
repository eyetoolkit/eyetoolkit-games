/**
 * 🎮 Game 131: 받아쓰기
 * 단어를 보고 숨겨진 글자를 올바르게 입력하세요
 */
import { useState, useCallback, useMemo } from "react";

const WORDS = [
    { word: "사과", hint: "빨간 과일", blanks: [1], category: "과일" },
    { word: "기린", hint: "목이 긴 동물", blanks: [0], category: "동물" },
    { word: "무지개", hint: "비 온 뒤 하늘에 뜨는 것", blanks: [1], category: "자연" },
    { word: "나비", hint: "꽃에서 꽃으로 날아다니는 곤충", blanks: [0], category: "동물" },
    { word: "연필", hint: "글씨를 쓰는 도구", blanks: [1], category: "학용품" },
    { word: "딸기", hint: "빨갛고 달콤한 과일", blanks: [0], category: "과일" },
    { word: "구름", hint: "하늘에 떠 있는 하얀 것", blanks: [1], category: "자연" },
    { word: "토끼", hint: "귀가 긴 동물", blanks: [0], category: "동물" },
    { word: "우산", hint: "비 올 때 쓰는 것", blanks: [0], category: "생활" },
    { word: "바다", hint: "파랗고 넓은 물", blanks: [1], category: "자연" },
    { word: "눈사람", hint: "겨울에 눈으로 만드는 것", blanks: [1], category: "계절" },
    { word: "고래", hint: "바다에서 가장 큰 동물", blanks: [0], category: "동물" },
    { word: "지구", hint: "우리가 사는 행성", blanks: [1], category: "과학" },
    { word: "로봇", hint: "기계로 움직이는 인형", blanks: [0], category: "과학" },
    { word: "피아노", hint: "검은 건반과 흰 건반이 있는 악기", blanks: [1], category: "음악" },
    { word: "호랑이", hint: "줄무늬가 있는 용맹한 동물", blanks: [0], category: "동물" },
    { word: "지우개", hint: "잘못 쓴 글씨를 지우는 도구", blanks: [1], category: "학용품" },
    { word: "잠자리", hint: "날개가 넷인 곤충", blanks: [0], category: "동물" },
    { word: "수박", hint: "초록 껍질에 빨간 속", blanks: [0], category: "과일" },
    { word: "달팽이", hint: "집을 등에 지고 다니는 느린 동물", blanks: [1], category: "동물" },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const DictationQuiz = ({ onComplete }) => {
    const [questions] = useState(() => shuffle(WORDS).slice(0, 8));
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [done, setDone] = useState(false);

    const currentQ = questions[current];

    const options = useMemo(() => {
        if (!currentQ) return [];
        const correctChar = currentQ.word[currentQ.blanks[0]];
        const allChars = WORDS.map(w => w.word[w.blanks[0]]).filter(c => c !== correctChar);
        const wrongChars = shuffle(allChars).slice(0, 3);
        return shuffle([correctChar, ...wrongChars]);
    }, [currentQ]);

    const getDisplayWord = useCallback(() => {
        if (!currentQ) return "";
        return currentQ.word.split("").map((ch, i) =>
            currentQ.blanks.includes(i) ? "___" : ch
        ).join("");
    }, [currentQ]);

    const choose = useCallback((char) => {
        if (done || feedback) return;
        const correctChar = currentQ.word[currentQ.blanks[0]];
        const isCorrect = char === correctChar;
        setSelected(char);
        setFeedback(isCorrect ? "correct" : "wrong");
        if (isCorrect) setScore(s => s + 1);
        setTimeout(() => {
            setFeedback(null);
            setSelected(null);
            if (current + 1 >= questions.length) {
                setDone(true);
                const finalScore = Math.min(100, (score + (isCorrect ? 1 : 0)) * 12 + 4);
                setTimeout(() => onComplete(finalScore), 300);
            } else {
                setCurrent(c => c + 1);
            }
        }, 800);
    }, [current, currentQ, questions, score, done, feedback, onComplete]);

    const progress = ((current + (done ? 1 : 0)) / questions.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes quizPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0.3} }
                .dict-opt:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                <span>문제: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{current + 1}/{questions.length}</span></span>
            </div>
            {/* Progress Bar */}
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #64ffda, #4D96FF)", transition: "width 0.4s ease" }} />
            </div>
            {/* Category Badge */}
            <div style={{
                padding: "4px 12px", borderRadius: "20px", fontSize: "11px",
                background: "rgba(100,255,218,0.1)", border: "1px solid rgba(100,255,218,0.2)",
                color: "#64ffda",
            }}>📂 {currentQ.category}</div>
            {/* Hint */}
            <div style={{
                padding: "10px 24px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "13px", color: "#8892b0",
            }}>💡 힌트: {currentQ.hint}</div>
            {/* Word Display */}
            <div style={{
                padding: "20px 32px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "fadeSlideIn 0.3s ease",
            }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", letterSpacing: "8px", display: "flex", gap: "4px", alignItems: "center" }}>
                    {currentQ.word.split("").map((ch, i) => (
                        <span key={i} style={{
                            color: currentQ.blanks.includes(i)
                                ? (feedback === "correct" ? "#64ffda" : feedback === "wrong" ? "#FF6B6B" : "#FFD700")
                                : "white",
                            borderBottom: currentQ.blanks.includes(i) ? "3px solid currentColor" : "none",
                            padding: "0 2px",
                            minWidth: "36px",
                            textAlign: "center",
                            animation: currentQ.blanks.includes(i) && !feedback ? "blinkCursor 1.2s infinite" : "none",
                        }}>
                            {currentQ.blanks.includes(i) ? (feedback ? currentQ.word[i] : "?") : ch}
                        </span>
                    ))}
                </div>
            </div>
            {/* Options */}
            <div style={{ fontSize: "13px", color: "#8892b0" }}>빈칸에 들어갈 글자를 고르세요</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 100px)", gap: "8px" }}>
                {options.map((opt) => (
                    <button key={opt} className="dict-opt" onClick={() => choose(opt)} style={{
                        padding: "14px", fontSize: "22px", fontWeight: "bold",
                        background: feedback && opt === currentQ.word[currentQ.blanks[0]] ? "rgba(100,255,218,0.2)"
                            : feedback && selected === opt && opt !== currentQ.word[currentQ.blanks[0]] ? "rgba(255,107,107,0.2)"
                            : "rgba(255,255,255,0.06)",
                        color: "white",
                        border: feedback && opt === currentQ.word[currentQ.blanks[0]] ? "1px solid #64ffda"
                            : feedback && selected === opt ? "1px solid #FF6B6B"
                            : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px", cursor: feedback ? "default" : "pointer",
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
                {feedback === "correct" ? "✓ 정답!" : `✗ 정답: ${currentQ.word}`}
            </div>}
            {done && <div style={{
                fontSize: "18px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>🎉 완료! {score}/{questions.length}</div>}
        </div>
    );
};

export default DictationQuiz;
