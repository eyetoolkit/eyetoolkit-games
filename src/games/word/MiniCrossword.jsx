/**
 * 🎮 Game 70: 미니 크로스워드 — 시각적 크로스워드 퍼즐
 */
import { useCallback, useRef, useState } from "react";

const PUZZLE = {
    grid: [
        ["사", "과", null, null, null],
        [null, "일", null, null, null],
        [null, "기", "차", "량", null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ],
    answers: { "0-0": "사", "0-1": "과", "1-1": "일", "2-1": "기", "2-2": "차", "2-3": "량" },
    clues: {
        across: [{ num: 1, text: "빨간 열매 (2글자)", row: 0, col: 0 }, { num: 3, text: "달려가는 탈것+개수 (4글자)", row: 2, col: 1 }],
        down: [{ num: 1, text: "무언가의 결실 (2글자)", row: 0, col: 0 }, { num: 2, text: "매일 쓰는 것 (2글자)", row: 0, col: 1 }],
    },
};

const MiniCrossword = ({ onComplete }) => {
    const [cells, setCells] = useState(() => { const c = {}; Object.keys(PUZZLE.answers).forEach((k) => (c[k] = "")); return c; });
    const [activeClue, setActiveClue] = useState(null);
    const [checked, setChecked] = useState(false);
    const inputRefs = useRef({});

    const handleInput = useCallback((key, val) => {
        setCells((c) => ({ ...c, [key]: val.slice(-1) }));
        // Auto-advance to next cell
        const [r, col] = key.split("-").map(Number);
        const nextKey = `${r}-${col + 1}`;
        if (val && inputRefs.current[nextKey]) {
            inputRefs.current[nextKey].focus();
        }
    }, []);

    const check = useCallback(() => {
        setChecked(true);
        let m = 0, t = Object.keys(PUZZLE.answers).length;
        Object.entries(PUZZLE.answers).forEach(([k, v]) => { if (cells[k] === v) m++; });
        setTimeout(() => onComplete(Math.round((m / t) * 100)), 800);
    }, [cells, onComplete]);

    const getClueNumber = (r, c) => {
        const across = PUZZLE.clues.across.find((cl) => cl.row === r && cl.col === c);
        const down = PUZZLE.clues.down.find((cl) => cl.row === r && cl.col === c);
        return across?.num || down?.num || null;
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px", color: "#FFD700", fontWeight: "bold" }}>📝 미니 크로스워드</div>

            {/* Grid */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px",
                padding: "4px", borderRadius: "10px",
                background: "rgba(0,0,0,0.3)",
            }}>
                {PUZZLE.grid.flat().map((cell, i) => {
                    const r = Math.floor(i / 5), c = i % 5, key = `${r}-${c}`;
                    const isInput = key in PUZZLE.answers;
                    const clueNum = getClueNumber(r, c);
                    const isCorrect = checked && cells[key] === PUZZLE.answers[key];
                    const isWrong = checked && isInput && cells[key] !== PUZZLE.answers[key];

                    if (cell === null && !isInput) {
                        return <div key={i} style={{ width: 40, height: 40, background: "#111", borderRadius: "4px" }} />;
                    }

                    return (
                        <div key={i} style={{
                            width: 40, height: 40, position: "relative",
                            background: isCorrect ? "rgba(100,255,218,0.15)"
                                : isWrong ? "rgba(255,107,107,0.15)"
                                    : isInput ? "rgba(255,215,0,0.08)"
                                        : "rgba(100,255,218,0.08)",
                            borderRadius: "4px",
                            border: isCorrect ? "2px solid #64ffda"
                                : isWrong ? "2px solid #FF6B6B"
                                    : isInput ? "2px solid rgba(255,215,0,0.4)"
                                        : "1px solid rgba(100,255,218,0.2)",
                        }}>
                            {clueNum && (
                                <span style={{ position: "absolute", top: 1, left: 3, fontSize: "8px", color: "#8892b0", fontWeight: "bold" }}>{clueNum}</span>
                            )}
                            {isInput ? (
                                <input
                                    ref={(el) => { if (el) inputRefs.current[key] = el; }}
                                    value={cells[key] || ""}
                                    onChange={(e) => handleInput(key, e.target.value)}
                                    disabled={checked}
                                    style={{
                                        width: "100%", height: "100%",
                                        fontSize: "16px", fontWeight: "bold",
                                        textAlign: "center", background: "transparent",
                                        color: isCorrect ? "#64ffda" : isWrong ? "#FF6B6B" : "#FFD700",
                                        border: "none", outline: "none",
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%", height: "100%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "16px", fontWeight: "bold", color: "#64ffda",
                                }}>{cell}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Clues */}
            <div style={{ display: "flex", gap: "16px", fontSize: "11px", maxWidth: 260 }}>
                <div>
                    <div style={{ color: "#FFD700", fontWeight: "bold", marginBottom: 3 }}>→ 가로</div>
                    {PUZZLE.clues.across.map((cl) => (
                        <div key={cl.num} style={{ color: "#8892b0", cursor: "pointer" }}
                            onClick={() => setActiveClue(cl)}
                        >{cl.num}. {cl.text}</div>
                    ))}
                </div>
                <div>
                    <div style={{ color: "#64ffda", fontWeight: "bold", marginBottom: 3 }}>↓ 세로</div>
                    {PUZZLE.clues.down.map((cl) => (
                        <div key={cl.num} style={{ color: "#8892b0", cursor: "pointer" }}
                            onClick={() => setActiveClue(cl)}
                        >{cl.num}. {cl.text}</div>
                    ))}
                </div>
            </div>

            {!checked && (
                <button onClick={check} style={{
                    padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                    background: "rgba(100,255,218,0.15)", color: "white",
                    border: "2px solid #64ffda", borderRadius: "10px", cursor: "pointer",
                }}>✅ 제출</button>
            )}

            {checked && (
                <div style={{
                    fontSize: "14px", fontWeight: "bold",
                    color: Object.entries(PUZZLE.answers).every(([k, v]) => cells[k] === v) ? "#64ffda" : "#FFD700",
                }}>
                    {Object.entries(PUZZLE.answers).every(([k, v]) => cells[k] === v) ? "🎉 완벽!" : "📝 부분 정답"}
                </div>
            )}
        </div>
    );
};

export default MiniCrossword;
