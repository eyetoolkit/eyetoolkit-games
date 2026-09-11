/**
 * 🎮 Game 61: 한국어 워들 — 색상 타일 + 키보드 시각화
 */
import { useCallback, useState } from "react";

const WORDS = ["사과나무", "프로그램", "인공지능", "한글맞춤", "대한민국", "우주여행"];
const MAX_TRIES = 6;

const KoreanWordle = ({ onComplete }) => {
    const [answer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guesses, setGuesses] = useState([]);
    const [input, setInput] = useState("");
    const [won, setWon] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = useCallback(() => {
        if (input.length !== answer.length || won) return;
        if (input.length < answer.length) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        const ng = [...guesses, input];
        setGuesses(ng);
        setInput("");

        if (input === answer) {
            setWon(true);
            setTimeout(() => onComplete(Math.max(20, 100 - (ng.length - 1) * 15)), 800);
        } else if (ng.length >= MAX_TRIES) {
            setTimeout(() => onComplete(10), 800);
        }
    }, [input, answer, guesses, won, onComplete]);

    const getColor = (char, idx, guess) => {
        if (guess[idx] === answer[idx]) return { bg: "#22C55E", border: "#16A34A", text: "white" };
        if (answer.includes(char)) return { bg: "#D97706", border: "#B45309", text: "white" };
        return { bg: "rgba(100,100,100,0.3)", border: "rgba(100,100,100,0.5)", text: "#888" };
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes tileFlip { 0% { transform: scaleY(1); } 50% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
                @keyframes shakeRow { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
                @keyframes winBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                시도: <span style={{ color: "#FFD700" }}>{guesses.length}/{MAX_TRIES}</span>
                {won && <span style={{ color: "#64ffda", marginLeft: 8 }}>🎉 정답!</span>}
            </div>

            {/* Guess grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {Array.from({ length: MAX_TRIES }).map((_, row) => {
                    const guess = guesses[row];
                    const isCurrentRow = row === guesses.length && !won;
                    return (
                        <div key={row} style={{
                            display: "flex", gap: "4px",
                            animation: isCurrentRow && shake ? "shakeRow 0.4s ease" : "none",
                        }}>
                            {Array.from({ length: answer.length }).map((_, col) => {
                                const char = guess ? guess[col] : (isCurrentRow ? input[col] : "");
                                const colors = guess ? getColor(char, col, guess) : null;
                                const isWinRow = won && row === guesses.length - 1;

                                return (
                                    <div key={col} style={{
                                        width: 44, height: 48, borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "18px", fontWeight: "bold",
                                        background: colors ? colors.bg : char ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                                        border: colors ? `2px solid ${colors.border}` : char ? "2px solid rgba(255,255,255,0.25)" : "2px solid rgba(255,255,255,0.1)",
                                        color: colors ? colors.text : "white",
                                        animation: guess ? `tileFlip 0.5s ease ${col * 0.15}s both` : isWinRow ? `winBounce 0.5s ease ${col * 0.1}s infinite` : "none",
                                        boxShadow: colors && colors.bg === "#22C55E" ? "0 2px 8px rgba(34,197,94,0.3)" : "none",
                                    }}>
                                        {char || ""}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            {!won && guesses.length < MAX_TRIES && (
                <div style={{ display: "flex", gap: "6px" }}>
                    <input value={input} onChange={(e) => setInput(e.target.value.slice(0, answer.length))}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={`${answer.length}글자 입력`}
                        autoFocus
                        style={{
                            width: 140, padding: "10px", fontSize: "14px",
                            background: "rgba(255,255,255,0.06)", color: "white",
                            border: "2px solid rgba(255,255,255,0.15)",
                            borderRadius: "10px", outline: "none", textAlign: "center",
                        }} />
                    <button onClick={handleSubmit} style={{
                        padding: "10px 16px", fontSize: "14px", fontWeight: "bold",
                        background: input.length === answer.length ? "rgba(34,197,94,0.2)" : "rgba(100,100,100,0.15)",
                        color: "white", border: `2px solid ${input.length === answer.length ? "#22C55E" : "#555"}`,
                        borderRadius: "10px", cursor: "pointer",
                    }}>확인</button>
                </div>
            )}

            {/* Legend */}
            <div style={{ display: "flex", gap: "12px", fontSize: "10px", color: "#8892b0" }}>
                <span><span style={{ color: "#22C55E" }}>■</span> 정확</span>
                <span><span style={{ color: "#D97706" }}>■</span> 포함</span>
                <span><span style={{ color: "#666" }}>■</span> 미포함</span>
            </div>

            {guesses.length >= MAX_TRIES && !won && (
                <div style={{ fontSize: "14px", color: "#FF6B6B" }}>정답: <span style={{ color: "#FFD700" }}>{answer}</span></div>
            )}
        </div>
    );
};

export default KoreanWordle;
