/**
 * 🎮 Game 54: 타일 모자이크 — 선명한 비교 뷰 + 매칭 표시
 */
import { useCallback, useState } from "react";

const SIZE = 5;
const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#FFD700", "#A855F7"];

const genTarget = () => Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
);

const TileMosaic = ({ onComplete }) => {
    const [target] = useState(genTarget);
    const [canvas, setCanvas] = useState(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(null)));
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isDragging, setIsDragging] = useState(false);

    const paint = useCallback((r, c) => {
        setCanvas((cv) => { const n = cv.map((row) => [...row]); n[r][c] = selectedColor; return n; });
    }, [selectedColor]);

    const check = useCallback(() => {
        let match = 0;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (canvas[r][c] === target[r][c]) match++;
        onComplete(Math.round((match / (SIZE * SIZE)) * 100));
    }, [canvas, target, onComplete]);

    const matchCount = (() => {
        let m = 0;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (canvas[r][c] === target[r][c]) m++;
        return m;
    })();

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                일치: <span style={{ color: "#64ffda" }}>{matchCount}/{SIZE * SIZE}</span>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Target */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#8892b0", marginBottom: 4 }}>🎯 목표</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 28px)`, gap: "2px",
                        padding: "4px", borderRadius: "10px", background: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        {target.flat().map((c, i) => (
                            <div key={i} style={{
                                width: 28, height: 28, background: c, borderRadius: "4px",
                                boxShadow: `0 2px 6px ${c}33`,
                            }} />
                        ))}
                    </div>
                </div>

                {/* Canvas */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#FFD700", marginBottom: 4 }}>🎨 내 모자이크</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 32px)`, gap: "2px",
                        padding: "4px", borderRadius: "10px", background: "rgba(0,0,0,0.2)",
                        border: "2px solid rgba(255,215,0,0.2)",
                    }}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                    >
                        {canvas.flat().map((c, i) => {
                            const r = Math.floor(i / SIZE), col = i % SIZE;
                            const isMatch = c === target[r][col];
                            return (
                                <div key={i}
                                    onClick={() => paint(r, col)}
                                    onMouseEnter={() => { if (isDragging) paint(r, col); }}
                                    style={{
                                        width: 32, height: 32,
                                        background: c || "rgba(30,30,50,0.8)",
                                        borderRadius: "4px", cursor: "pointer",
                                        border: c && isMatch ? "2px solid rgba(100,255,218,0.4)" : "1px solid rgba(255,255,255,0.08)",
                                        transition: "background 0.1s ease",
                                        boxShadow: c ? `0 2px 6px ${c}33` : "none",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Palette */}
            <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map((c) => (
                    <div key={c} onClick={() => setSelectedColor(c)} style={{
                        width: 32, height: 32, borderRadius: "10px",
                        background: c, cursor: "pointer",
                        border: selectedColor === c ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: selectedColor === c ? `0 0 12px ${c}66` : "none",
                        transition: "all 0.2s ease",
                    }} />
                ))}
            </div>

            <button onClick={check} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                color: "white", border: "2px solid #64ffda",
                borderRadius: "10px", cursor: "pointer",
            }}>✅ 완성!</button>
        </div>
    );
};

export default TileMosaic;
