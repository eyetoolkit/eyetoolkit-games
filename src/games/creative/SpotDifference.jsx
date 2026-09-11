/**
 * 🎮 Game 60: 틀린그림 찾기 — 2패널 비교 + 찾기 표시
 */
import { useCallback, useState } from "react";

const SIZE = 4;
const EMOJIS = ["🌟", "🎈", "🎯", "🎪", "🎭", "🎨", "🎵", "🎶", "🌈", "🍀", "🔥", "💎", "🦋", "🌸", "⚡", "🍄"];

const genPuzzle = () => {
    const base = Array.from({ length: SIZE * SIZE }, (_, i) => EMOJIS[i % EMOJIS.length]);
    const diffCount = 3;
    const diffs = new Set();
    while (diffs.size < diffCount) diffs.add(Math.floor(Math.random() * SIZE * SIZE));
    const modified = [...base];
    diffs.forEach((idx) => {
        const alt = EMOJIS.filter((e) => e !== base[idx]);
        modified[idx] = alt[Math.floor(Math.random() * alt.length)];
    });
    return { base, modified, diffs: [...diffs] };
};

const SpotDifference = ({ onComplete }) => {
    const [puzzle] = useState(genPuzzle);
    const [found, setFound] = useState(new Set());
    const [wrong, setWrong] = useState(null);
    const total = puzzle.diffs.length;

    const handleClick = useCallback((idx) => {
        if (found.has(idx)) return;
        if (puzzle.diffs.includes(idx)) {
            const nf = new Set([...found, idx]);
            setFound(nf);
            if (nf.size >= total) setTimeout(() => onComplete(100), 500);
        } else {
            setWrong(idx);
            setTimeout(() => setWrong(null), 500);
        }
    }, [puzzle, found, total, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes foundPulse { 0%,100% { box-shadow: 0 0 6px rgba(100,255,218,0.3); } 50% { box-shadow: 0 0 14px rgba(100,255,218,0.7); } }
                @keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                찾기: <span style={{ color: "#64ffda" }}>{found.size}/{total}</span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                {/* Left panel (base) */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#8892b0", marginBottom: 4 }}>원본</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 38px)`, gap: "3px",
                        padding: "6px", borderRadius: "10px", background: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        {puzzle.base.map((e, i) => (
                            <div key={i} style={{
                                width: 38, height: 38, borderRadius: "6px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "20px",
                                background: found.has(i) ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.03)",
                                border: found.has(i) ? "2px solid #64ffda" : "1px solid rgba(255,255,255,0.05)",
                                animation: found.has(i) ? "foundPulse 1.5s ease infinite" : "none",
                            }}>{e}</div>
                        ))}
                    </div>
                </div>

                {/* Right panel (modified) */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#FFD700", marginBottom: 4 }}>🔍 여기서 찾기</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 38px)`, gap: "3px",
                        padding: "6px", borderRadius: "10px", background: "rgba(0,0,0,0.2)",
                        border: "2px solid rgba(255,215,0,0.2)",
                    }}>
                        {puzzle.modified.map((e, i) => (
                            <div key={i} onClick={() => handleClick(i)}
                                style={{
                                    width: 38, height: 38, borderRadius: "6px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "20px", cursor: found.has(i) ? "default" : "pointer",
                                    background: found.has(i) ? "rgba(100,255,218,0.15)"
                                        : wrong === i ? "rgba(255,107,107,0.15)"
                                            : "rgba(255,255,255,0.03)",
                                    border: found.has(i) ? "2px solid #64ffda"
                                        : wrong === i ? "2px solid #FF6B6B"
                                            : "1px solid rgba(255,255,255,0.05)",
                                    animation: found.has(i) ? "foundPulse 1.5s ease infinite"
                                        : wrong === i ? "wrongShake 0.3s ease" : "none",
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e2) => { if (!found.has(i)) e2.currentTarget.style.background = "rgba(255,215,0,0.06)"; }}
                                onMouseLeave={(e2) => { if (!found.has(i)) e2.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                            >{e}</div>
                        ))}
                    </div>
                </div>
            </div>

            {found.size >= total && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🎉 모두 찾았어요!</div>
            )}
        </div>
    );
};

export default SpotDifference;
