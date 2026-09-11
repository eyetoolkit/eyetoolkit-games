/**
 * 🎮 Game 53: 대칭 그리기 — 거울선 + 실시간 매칭 + 드래그 페인트
 */
import { useCallback, useState } from "react";

const SIZE = 6, HALF = SIZE / 2;
const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#FFD700"];

const genPattern = () => Array.from({ length: SIZE }, () =>
    Array.from({ length: HALF }, () => Math.random() > 0.35 ? COLORS[Math.floor(Math.random() * COLORS.length)] : null)
);

const SymmetryDraw = ({ onComplete }) => {
    const [pattern] = useState(genPattern);
    const [canvas, setCanvas] = useState(() => Array.from({ length: SIZE }, () => Array(HALF).fill(null)));
    const [color, setColor] = useState(COLORS[0]);
    const [isDragging, setIsDragging] = useState(false);

    const paint = useCallback((r, c) => {
        setCanvas((cv) => { const n = cv.map((row) => [...row]); n[r][c] = color; return n; });
    }, [color]);

    const getAccuracy = () => {
        let match = 0, total = 0;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < HALF; c++) {
                const expected = pattern[r][HALF - 1 - c];
                if (expected) { total++; if (canvas[r][c] === expected) match++; }
            }
        return total > 0 ? Math.round((match / total) * 100) : 50;
    };

    const accuracy = getAccuracy();

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                정확도: <span style={{ color: accuracy > 80 ? "#64ffda" : accuracy > 50 ? "#FFD700" : "#FF6B6B" }}>{accuracy}%</span>
            </div>

            <div style={{ fontSize: "11px", color: "#8892b0" }}>왼쪽을 보고 오른쪽에 대칭을 그리세요!</div>

            <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* Left (pattern) */}
                <div style={{
                    display: "grid", gridTemplateColumns: `repeat(${HALF}, 32px)`, gap: "2px",
                    padding: "4px", borderRadius: "10px 0 0 10px",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRight: "none",
                }}>
                    {pattern.flat().map((c, i) => (
                        <div key={i} style={{
                            width: 32, height: 32,
                            background: c || "rgba(30,30,50,0.8)",
                            borderRadius: "3px",
                            border: "1px solid rgba(255,255,255,0.04)",
                            boxShadow: c ? `inset 0 1px 3px rgba(255,255,255,0.1), 0 2px 5px ${c}22` : "none",
                        }} />
                    ))}
                </div>

                {/* Mirror line */}
                <div style={{
                    width: 4,
                    background: "linear-gradient(180deg, transparent, rgba(255,215,0,0.6), rgba(255,215,0,0.6), transparent)",
                    boxShadow: "0 0 8px rgba(255,215,0,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                }}>
                    <div style={{
                        position: "absolute", fontSize: "10px", background: "#1a1a2e",
                        padding: "2px 4px", borderRadius: "4px", color: "#FFD700",
                        top: -16,
                    }}>🪞</div>
                </div>

                {/* Right (canvas) */}
                <div style={{
                    display: "grid", gridTemplateColumns: `repeat(${HALF}, 32px)`, gap: "2px",
                    padding: "4px", borderRadius: "0 10px 10px 0",
                    background: "rgba(0,0,0,0.2)",
                    border: "2px solid rgba(255,215,0,0.15)",
                    borderLeft: "none",
                }}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    {canvas.flat().map((c, i) => {
                        const r = Math.floor(i / HALF), col = i % HALF;
                        const expected = pattern[r][HALF - 1 - col];
                        const isMatch = c && c === expected;
                        return (
                            <div key={i}
                                onClick={() => paint(r, col)}
                                onMouseEnter={() => { if (isDragging) paint(r, col); }}
                                style={{
                                    width: 32, height: 32,
                                    background: c || "rgba(30,30,50,0.8)",
                                    borderRadius: "3px", cursor: "crosshair",
                                    border: isMatch ? "1px solid rgba(100,255,218,0.4)" : expected ? "1px dashed rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.04)",
                                    transition: "background 0.1s ease",
                                    boxShadow: c ? `0 2px 5px ${c}22` : "none",
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Palette */}
            <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map((c) => (
                    <div key={c} onClick={() => setColor(c)} style={{
                        width: 30, height: 30, borderRadius: "8px",
                        background: c, cursor: "pointer",
                        border: color === c ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: color === c ? `0 0 10px ${c}66` : "none",
                        transform: color === c ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.15s ease",
                    }} />
                ))}
                <div onClick={() => setColor(null)} style={{
                    width: 30, height: 30, borderRadius: "8px",
                    background: "#1a1a2e", cursor: "pointer",
                    border: color === null ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px",
                }}>🧹</div>
            </div>

            <button onClick={() => onComplete(accuracy)} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: accuracy > 80 ? "linear-gradient(135deg, rgba(100,255,218,0.2), rgba(100,255,218,0.05))" : "rgba(255,255,255,0.06)",
                color: "white", border: `2px solid ${accuracy > 80 ? "#64ffda" : "rgba(255,255,255,0.15)"}`,
                borderRadius: "10px", cursor: "pointer",
            }}>✅ 완성! ({accuracy}%)</button>
        </div>
    );
};

export default SymmetryDraw;
