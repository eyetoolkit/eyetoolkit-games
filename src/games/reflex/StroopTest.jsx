/**
 * 🎮 스트룹 테스트 — 난이도 레벨 + 타임 프레셔 + 콤보 보너스 + 랭크
 */
import { useCallback, useEffect, useRef, useState } from "react";

const COLORS = [
    { name: "빨강", hex: "#FF4444" }, { name: "파랑", hex: "#4488FF" },
    { name: "초록", hex: "#44DD44" }, { name: "노랑", hex: "#FFDD44" },
    { name: "보라", hex: "#AA66FF" },
];
const ROUNDS = 15;

const StroopTest = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timer, setTimer] = useState(100);
    const [level, setLevel] = useState(1);
    const [bonusPoints, setBonusPoints] = useState(0);
    const correctRef = useRef(0);
    const comboRef = useRef(0);
    const timerRef = useRef(null);

    const timeLimit = level >= 3 ? 2500 : level >= 2 ? 3500 : 5000;

    const generateQuestion = useCallback(() => {
        const cols = level >= 3 ? COLORS : COLORS.slice(0, 4);
        const textColor = cols[Math.floor(Math.random() * cols.length)];
        let displayText;
        // More confusion at higher levels
        const confusionChance = level >= 3 ? 0.75 : level >= 2 ? 0.6 : 0.5;
        if (Math.random() < confusionChance) {
            const others = cols.filter((c) => c.name !== textColor.name);
            displayText = others[Math.floor(Math.random() * others.length)].name;
        } else { displayText = textColor.name; }
        const optionCount = level >= 3 ? 4 : 3;
        const options = [textColor];
        while (options.length < optionCount) {
            const c = cols[Math.floor(Math.random() * cols.length)];
            if (!options.find((o) => o.name === c.name)) options.push(c);
        }
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return { displayText, textColor, options, correctAnswer: textColor.name };
    }, [level]);

    useEffect(() => { setQuestion(generateQuestion()); }, [generateQuestion]);

    // Timer
    useEffect(() => {
        if (!question || feedback) return;
        setTimer(100);
        timerRef.current = setInterval(() => {
            setTimer(t => {
                if (t <= 0) {
                    clearInterval(timerRef.current);
                    comboRef.current = 0; setCombo(0);
                    setFeedback("timeout");
                    setTimeout(() => {
                        const nextRound = round + 1;
                        if (nextRound >= ROUNDS) onComplete(Math.round((correctRef.current / ROUNDS) * 100));
                        else { setRound(nextRound); setQuestion(generateQuestion()); setFeedback(null); }
                    }, 600);
                    return 0;
                }
                return t - (100 / (timeLimit / 50));
            });
        }, 50);
        return () => clearInterval(timerRef.current);
    }, [question, feedback, round, timeLimit, generateQuestion, onComplete]);

    // Level up
    useEffect(() => {
        if (round === 5) setLevel(2);
        if (round === 10) setLevel(3);
    }, [round]);

    const handleAnswer = useCallback((colorName) => {
        if (!question || feedback) return;
        clearInterval(timerRef.current);
        const isCorrect = colorName === question.correctAnswer;

        if (isCorrect) {
            correctRef.current += 1;
            setCorrect((c) => c + 1);
            comboRef.current++;
            setCombo(comboRef.current);
            if (comboRef.current > maxCombo) setMaxCombo(comboRef.current);
            // Speed bonus
            const speedBonus = timer > 70 ? 2 : timer > 40 ? 1 : 0;
            const comboBonus = comboRef.current >= 5 ? 3 : comboRef.current >= 3 ? 1 : 0;
            setBonusPoints(b => b + speedBonus + comboBonus);
        } else {
            comboRef.current = 0;
            setCombo(0);
        }

        setFeedback(isCorrect ? "correct" : "wrong");
        setTimeout(() => {
            const nextRound = round + 1;
            if (nextRound >= ROUNDS) {
                const base = Math.round((correctRef.current / ROUNDS) * 100);
                onComplete(Math.min(100, base + Math.floor(bonusPoints / 2)));
            } else {
                setRound(nextRound);
                setQuestion(generateQuestion());
                setFeedback(null);
            }
        }, 500);
    }, [question, feedback, round, timer, maxCombo, bonusPoints, generateQuestion, onComplete]);

    if (!question) return null;

    const comboColor = combo >= 5 ? "#FF6B6B" : combo >= 3 ? "#A855F7" : "#FFD700";
    const timerColor = timer > 60 ? "#64ffda" : timer > 30 ? "#FFD700" : "#FF6B6B";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes correctBounce { 0% { transform: scale(1.15); } 100% { transform: scale(1); } }
                @keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
                @keyframes comboPop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
                @keyframes levelUp { 0% { transform: scale(2); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
                @keyframes timerPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span>
                <span>정답: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{correct}</span></span>
                <span style={{ padding: "2px 8px", borderRadius: "6px", background: `rgba(168,85,247,0.2)`, color: "#A855F7", fontWeight: "bold", fontSize: "11px" }}>
                    Lv.{level}
                </span>
                {combo >= 2 && <span style={{ color: comboColor, fontWeight: "bold", animation: "comboPop 0.3s ease" }}>
                    🔥 {combo}콤보
                </span>}
                {bonusPoints > 0 && <span style={{ fontSize: "10px", color: "#FFD700" }}>+{bonusPoints}pt</span>}
            </div>

            {/* Timer bar */}
            <div style={{ width: 260, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{
                    width: `${timer}%`, height: "100%",
                    background: timerColor,
                    borderRadius: 3, transition: "width 0.05s linear",
                    animation: timer < 30 ? "timerPulse 0.3s infinite" : "none",
                }} />
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "3px" }}>
                {Array.from({ length: ROUNDS }).map((_, i) => (
                    <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: i < round ? "#64ffda" : i === round ? "#FFD700" : "rgba(255,255,255,0.1)",
                        border: i === 5 || i === 10 ? "1px solid #A855F7" : "none",
                    }} />
                ))}
            </div>

            <div style={{ fontSize: "11px", color: "#8892b0", textAlign: "center" }}>
                아래 글자의 <strong style={{ color: "#FFD700" }}>색깔</strong>을 맞추세요!
                {level >= 2 && <span style={{ color: "#A855F7", marginLeft: "6px" }}>(빨리!)</span>}
            </div>

            <div style={{
                fontSize: level >= 3 ? "64px" : "56px", fontWeight: "bold", color: question.textColor.hex,
                textShadow: `0 0 30px ${question.textColor.hex}44`,
                padding: "12px",
                animation: feedback === "correct" ? "correctBounce 0.3s ease"
                    : feedback === "wrong" || feedback === "timeout" ? "wrongShake 0.3s ease" : "none",
            }}>{question.displayText}</div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {question.options.map((opt) => (
                    <button key={opt.name} onClick={() => handleAnswer(opt.name)}
                        style={{
                            padding: "12px 20px", fontSize: "15px", fontWeight: "bold",
                            background: feedback
                                ? opt.name === question.correctAnswer ? "rgba(100,255,218,0.25)" : "rgba(255,255,255,0.04)"
                                : "rgba(255,255,255,0.08)",
                            color: opt.hex, border: `2px solid ${opt.hex}55`,
                            borderRadius: "12px", cursor: feedback ? "default" : "pointer",
                            transition: "all 0.2s", minWidth: "70px",
                            boxShadow: feedback && opt.name === question.correctAnswer ? `0 0 15px ${opt.hex}44` : "none",
                        }}
                        onMouseEnter={(e) => { if (!feedback) e.currentTarget.style.background = `${opt.hex}22`; }}
                        onMouseLeave={(e) => { if (!feedback) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                    >{opt.name}</button>
                ))}
            </div>

            {feedback && (
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {feedback === "correct" ? (
                        <span style={{ color: "#64ffda" }}>
                            ✅ {timer > 70 ? "⚡ 번개 반응!" : timer > 40 ? "👍 빠름!" : "정답!"}
                        </span>
                    ) : feedback === "timeout" ? (
                        <span style={{ color: "#FF6B6B" }}>⏰ 시간초과!</span>
                    ) : (
                        <span style={{ color: "#FF6B6B" }}>❌</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StroopTest;
