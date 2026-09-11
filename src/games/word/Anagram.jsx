/**
 * 🎮 Game 64: 애너그램 — 드래그 가능 글자 타일
 */
import { useCallback, useState } from "react";

const WORDS = [
    { answer: "프로그램", shuffled: "그램프로" },
    { answer: "컴퓨터", shuffled: "터퓨컴" },
    { answer: "인터넷", shuffled: "넷터인" },
    { answer: "스마트", shuffled: "트마스" },
    { answer: "로봇", shuffled: "봇로" },
    { answer: "우주선", shuffled: "선주우" },
    { answer: "과학자", shuffled: "자학과" },
    { answer: "도서관", shuffled: "관서도" },
];
const ROUNDS = 5;

const Anagram = ({ onComplete }) => {
    const [words] = useState(() => [...WORDS].sort(() => Math.random() - 0.5).slice(0, ROUNDS));
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [tiles, setTiles] = useState(() => words[0].shuffled.split("").map((ch, i) => ({ ch, id: i, placed: false })));
    const [answer, setAnswer] = useState([]);
    const [feedback, setFeedback] = useState(null);

    const addTile = useCallback((tile) => {
        if (feedback) return;
        setTiles((t) => t.map((tt) => tt.id === tile.id ? { ...tt, placed: true } : tt));
        const newAnswer = [...answer, tile];
        setAnswer(newAnswer);

        // Check if complete
        if (newAnswer.length === words[round].answer.length) {
            const guess = newAnswer.map((t) => t.ch).join("");
            const isC = guess === words[round].answer;
            if (isC) setCorrect((c) => c + 1);
            setFeedback(isC ? "correct" : "wrong");

            setTimeout(() => {
                const n = round + 1;
                if (n >= ROUNDS) {
                    onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
                } else {
                    setRound(n);
                    setTiles(words[n].shuffled.split("").map((ch, i) => ({ ch, id: i, placed: false })));
                    setAnswer([]);
                    setFeedback(null);
                }
            }, 1200);
        }
    }, [answer, round, words, correct, feedback, onComplete]);

    const removeTile = useCallback((idx) => {
        if (feedback) return;
        const tile = answer[idx];
        setTiles((t) => t.map((tt) => tt.id === tile.id ? { ...tt, placed: false } : tt));
        setAnswer((a) => a.filter((_, i) => i !== idx));
    }, [answer, feedback]);

    const reset = useCallback(() => {
        if (feedback) return;
        setTiles((t) => t.map((tt) => ({ ...tt, placed: false })));
        setAnswer([]);
    }, [feedback]);

    const TILE_COLORS = ["#7C3AED", "#2563EB", "#059669", "#D97706", "#DC2626", "#DB2777"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes tilePlace { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes tileBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답 <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Answer slots */}
            <div style={{ display: "flex", gap: "6px", minHeight: 52 }}>
                {words[round].answer.split("").map((_, i) => (
                    <div key={i} onClick={() => answer[i] && removeTile(i)}
                        style={{
                            width: 44, height: 48, borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px", fontWeight: "bold",
                            background: answer[i]
                                ? (feedback === "correct" ? "rgba(100,255,218,0.2)" : feedback === "wrong" ? "rgba(255,107,107,0.15)" : `${TILE_COLORS[answer[i].id % TILE_COLORS.length]}22`)
                                : "rgba(255,255,255,0.04)",
                            border: answer[i]
                                ? (feedback === "correct" ? "2px solid #64ffda" : feedback === "wrong" ? "2px solid #FF6B6B" : `2px solid ${TILE_COLORS[answer[i].id % TILE_COLORS.length]}55`)
                                : "2px dashed rgba(255,255,255,0.15)",
                            cursor: answer[i] ? "pointer" : "default",
                            animation: answer[i] ? "tilePlace 0.2s ease" : "none",
                            transition: "all 0.2s ease",
                        }}>
                        {answer[i]?.ch || ""}
                    </div>
                ))}
            </div>

            {/* Available tiles */}
            <div style={{ display: "flex", gap: "8px" }}>
                {tiles.map((tile) => (
                    <button key={tile.id} onClick={() => !tile.placed && addTile(tile)}
                        style={{
                            width: 48, height: 52, fontSize: "22px", fontWeight: "bold",
                            borderRadius: "12px", cursor: tile.placed ? "default" : "pointer",
                            background: tile.placed ? "transparent" : `linear-gradient(135deg, ${TILE_COLORS[tile.id % TILE_COLORS.length]}33, ${TILE_COLORS[tile.id % TILE_COLORS.length]}11)`,
                            color: tile.placed ? "transparent" : "white",
                            border: tile.placed ? "2px dashed rgba(255,255,255,0.08)" : `2px solid ${TILE_COLORS[tile.id % TILE_COLORS.length]}55`,
                            boxShadow: tile.placed ? "none" : `0 4px 12px ${TILE_COLORS[tile.id % TILE_COLORS.length]}22`,
                            transition: "all 0.2s ease",
                            animation: !tile.placed ? `tileBounce 2s ease ${tile.id * 0.2}s infinite` : "none",
                        }}
                        onMouseEnter={(e) => { if (!tile.placed) { e.currentTarget.style.transform = "scale(1.1) translateY(-4px)"; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                    >{tile.ch}</button>
                ))}
            </div>

            <button onClick={reset} disabled={!!feedback} style={{
                padding: "6px 16px", fontSize: "11px",
                background: "rgba(255,255,255,0.06)", color: "#8892b0",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                cursor: feedback ? "default" : "pointer",
            }}>🔄 초기화</button>

            {feedback && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                    {feedback === "correct" ? "🎉 정답!" : `❌ 정답: ${words[round].answer}`}
                </div>
            )}
        </div>
    );
};

export default Anagram;
