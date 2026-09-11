/**
 * 🎮 Game 66: 타이핑 레이스 — 진행 바 + 속도계
 */
import { useCallback, useEffect, useRef, useState } from "react";

const SENTENCES = [
    "빠른 갈색 여우가 게으른 개를 뛰어넘는다",
    "인공지능이 세상을 변화시키고 있다",
    "프로그래밍은 생각하는 방법을 가르친다",
    "오늘도 좋은 하루 보내세요",
    "열심히 노력하면 반드시 꿈을 이룰 수 있다",
];

const TypingRace = ({ onComplete }) => {
    const [sentence] = useState(() => SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [done, setDone] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleInput = useCallback((e) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());
        setInput(val);

        // Calculate WPM
        if (startTime) {
            const elapsed = (Date.now() - startTime) / 60000; // minutes
            const words = val.length / 5; // standard word = 5 chars
            setWpm(elapsed > 0 ? Math.round(words / elapsed) : 0);
        }

        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === sentence[i]) correctChars++;
        }
        setAccuracy(val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100);

        // Check completion
        if (val === sentence) {
            setDone(true);
            const elapsed = (Date.now() - startTime) / 60000;
            const finalWpm = Math.round((sentence.length / 5) / elapsed);
            const finalAcc = 100;
            setTimeout(() => onComplete(Math.min(100, finalWpm + Math.round(finalAcc / 2))), 500);
        }
    }, [sentence, startTime, onComplete]);

    const progress = (input.length / sentence.length) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`@keyframes carMove { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }`}</style>

            {/* Stats */}
            <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#FFD700" }}>{wpm}</div>
                    <div style={{ color: "#8892b0" }}>WPM</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: accuracy > 90 ? "#64ffda" : accuracy > 70 ? "#FFD700" : "#FF6B6B" }}>{accuracy}%</div>
                    <div style={{ color: "#8892b0" }}>정확도</div>
                </div>
            </div>

            {/* Progress track */}
            <div style={{ width: 260, position: "relative" }}>
                <div style={{ width: "100%", height: 24, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                    <div style={{
                        width: `${progress}%`, height: "100%",
                        background: `linear-gradient(90deg, #3B82F6, #64ffda)`,
                        borderRadius: 12, transition: "width 0.1s ease",
                    }} />
                    {/* Race car */}
                    <div style={{
                        position: "absolute", top: -4, left: `${Math.min(92, progress)}%`,
                        fontSize: "20px", transition: "left 0.1s ease",
                        animation: input.length > 0 ? "carMove 0.3s ease infinite" : "none",
                    }}>🏎️</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8892b0", marginTop: 2 }}>
                    <span>출발</span>
                    <span>{Math.round(progress)}%</span>
                    <span>🏁</span>
                </div>
            </div>

            {/* Sentence display */}
            <div style={{
                width: 260, padding: "12px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "14px", lineHeight: 1.6,
            }}>
                {sentence.split("").map((ch, i) => (
                    <span key={i} style={{
                        color: i < input.length
                            ? (input[i] === ch ? "#64ffda" : "#FF6B6B")
                            : i === input.length ? "#FFD700" : "rgba(255,255,255,0.4)",
                        textDecoration: i < input.length && input[i] !== ch ? "underline" : "none",
                        fontWeight: i === input.length ? "bold" : "normal",
                        background: i === input.length ? "rgba(255,215,0,0.15)" : "transparent",
                        borderRadius: 2, padding: "0 1px",
                    }}>{ch}</span>
                ))}
            </div>

            <input ref={inputRef} value={input} onChange={handleInput} disabled={done}
                placeholder="여기에 타이핑..."
                style={{
                    width: 260, padding: "10px 14px", fontSize: "14px",
                    background: "rgba(255,255,255,0.06)", color: "white",
                    border: `2px solid ${done ? "#64ffda" : "rgba(255,255,255,0.15)"}`,
                    borderRadius: "10px", outline: "none",
                }} />

            {done && <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🏆 완주! {wpm} WPM</div>}
        </div>
    );
};

export default TypingRace;
