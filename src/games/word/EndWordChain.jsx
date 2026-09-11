/**
 * 🎮 Game 62: 끝말잇기 — 대화 버블 + 타이머 + 단어 체인 시각화
 */
import { useCallback, useState } from "react";

const DICT = ["사과", "과일", "일기", "기차", "차량", "양말", "말씀", "씀바귀", "귀신", "신발", "발목", "목소리", "리본", "본래", "래퍼", "퍼즐", "즐거움", "움직임", "임금", "금메달", "달리기", "기쁨", "쁨에", "에어컨", "컨닝", "닝자", "자동차", "차단기", "기타", "타악기"];

const EndWordChain = ({ onComplete }) => {
    const [history, setHistory] = useState(() => {
        const w = DICT[Math.floor(Math.random() * DICT.length)];
        return [{ word: w, by: "ai" }];
    });
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [shake, setShake] = useState(false);

    const lastChar = history[history.length - 1].word.slice(-1);

    const handleSubmit = useCallback(() => {
        if (!input.trim() || gameOver) return;
        if (input[0] !== lastChar) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setInput("");
            return;
        }
        if (history.some((h) => h.word === input)) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setInput("");
            return;
        }

        const ns = score + input.length;
        setScore(ns);
        const nh = [...history, { word: input, by: "player" }];

        const aiWord = DICT.find((w) => w[0] === input.slice(-1) && !nh.some((h) => h.word === w));
        if (aiWord) {
            nh.push({ word: aiWord, by: "ai" });
            setHistory(nh);
            setInput("");
        } else {
            setHistory(nh);
            setGameOver(true);
            setTimeout(() => onComplete(Math.min(100, ns * 5)), 500);
        }
    }, [input, lastChar, history, score, gameOver, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes bubbleIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes shakeInput { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                점수: <span style={{ color: "#64ffda" }}>{score}</span> | 체인: <span style={{ color: "#FFD700" }}>{history.length}</span>
            </div>

            {/* Chat bubbles */}
            <div style={{
                maxHeight: 180, overflow: "auto", width: 260,
                display: "flex", flexDirection: "column", gap: "6px",
                padding: "8px", borderRadius: "12px",
                background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
                {history.map((h, i) => (
                    <div key={i} style={{
                        display: "flex",
                        justifyContent: h.by === "ai" ? "flex-start" : "flex-end",
                        animation: "bubbleIn 0.3s ease",
                    }}>
                        <div style={{
                            padding: "6px 12px", borderRadius: "12px",
                            maxWidth: "70%", fontSize: "14px", fontWeight: "bold",
                            background: h.by === "ai"
                                ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.08))"
                                : "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                            border: h.by === "ai" ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(100,255,218,0.3)",
                            color: h.by === "ai" ? "#FFD700" : "#64ffda",
                        }}>
                            {h.by === "ai" ? "🤖 " : "🧑 "}{h.word}
                        </div>
                    </div>
                ))}
            </div>

            {/* Last character highlight */}
            <div style={{
                display: "flex", alignItems: "center", gap: "8px", fontSize: "14px",
            }}>
                <span style={{ color: "#8892b0" }}>마지막 글자:</span>
                <span style={{
                    fontSize: "28px", fontWeight: "bold", color: "#FFD700",
                    padding: "4px 12px", borderRadius: "10px",
                    background: "rgba(255,215,0,0.1)", border: "2px solid rgba(255,215,0,0.3)",
                }}>{lastChar}</span>
            </div>

            {/* Input */}
            {!gameOver && (
                <div style={{
                    display: "flex", gap: "6px",
                    animation: shake ? "shakeInput 0.4s ease" : "none",
                }}>
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={`${lastChar}로 시작하는 단어`}
                        autoFocus
                        style={{
                            width: 160, padding: "10px 14px", fontSize: "14px",
                            background: "rgba(255,255,255,0.06)", color: "white",
                            border: `2px solid ${shake ? "#FF6B6B" : "rgba(255,255,255,0.15)"}`,
                            borderRadius: "10px", outline: "none", textAlign: "center",
                        }} />
                    <button onClick={handleSubmit} style={{
                        padding: "10px 16px", fontSize: "14px", fontWeight: "bold",
                        background: "rgba(100,255,218,0.15)", color: "white",
                        border: "2px solid rgba(100,255,218,0.3)", borderRadius: "10px", cursor: "pointer",
                    }}>확인</button>
                </div>
            )}

            {gameOver && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>
                    🎉 AI가 대답 못함! 승리!
                </div>
            )}
        </div>
    );
};

export default EndWordChain;
