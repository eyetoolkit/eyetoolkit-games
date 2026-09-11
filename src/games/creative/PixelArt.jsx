/**
 * 🎮 Game 51: Pixel Art — drag drawing + live accuracy
 */
import { useCallback, useState } from "react";

const SIZE = 6;
const PALETTE = ["#EF4444", "#3B82F6", "#22C55E", "#FFD700", "#A855F7", "#FFFFFF"];

const genTarget = () => Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => PALETTE[Math.floor(Math.random() * 4)])
);

const PixelArt = ({ onComplete }) => {
    const [target] = useState(genTarget);
    const [canvas, setCanvas] = useState(() => Array.from({ length: SIZE }, () => Array(SIZE).fill("#1a1a2e")));
    const [color, setColor] = useState(PALETTE[0]);
    const [isDragging, setIsDragging] = useState(false);

    const paint = useCallback((r, c) => {
        setCanvas((cv) => { const n = cv.map((row) => [...row]); n[r][c] = color; return n; });
    }, [color]);

    const getAccuracy = () => {
        let match = 0;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (canvas[r][c] === target[r][c]) match++;
        return Math.round((match / (SIZE * SIZE)) * 100);
    };

    const accuracy = getAccuracy();

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Accuracy: <span style={{ color: accuracy > 80 ? "#64ffda" : accuracy > 50 ? "#FFD700" : "#FF6B6B" }}>{accuracy}%</span>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Target */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#8892b0", marginBottom: 4 }}>🖼️ Original</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 24px)`, gap: "1px",
                        padding: "3px", borderRadius: "8px", background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        {target.flat().map((c, i) => (
                            <div key={i} style={{ width: 24, height: 24, background: c, borderRadius: "2px" }} />
                        ))}
                    </div>
                </div>

                {/* Canvas */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#FFD700", marginBottom: 4 }}>🎨 Your art</div>
                    <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${SIZE}, 30px)`, gap: "1px",
                        padding: "3px", borderRadius: "8px", background: "rgba(0,0,0,0.3)",
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
                                        width: 30, height: 30, background: c,
                                        borderRadius: "2px", cursor: "crosshair",
                                        border: c !== "#1a1a2e" && isMatch ? "1px solid rgba(100,255,218,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                        transition: "background 0.05s ease",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Palette */}
            <div style={{ display: "flex", gap: "6px" }}>
                {PALETTE.map((c) => (
                    <div key={c} onClick={() => setColor(c)} style={{
                        width: 30, height: 30, borderRadius: "8px",
                        background: c, cursor: "pointer",
                        border: color === c ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: color === c ? `0 0 10px ${c}66` : "none",
                        transform: color === c ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.15s ease",
                    }} />
                ))}
                <div onClick={() => setColor("#1a1a2e")} style={{
                    width: 30, height: 30, borderRadius: "8px",
                    background: "#1a1a2e", cursor: "pointer",
                    border: color === "#1a1a2e" ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px",
                }}>🧹</div>
            </div>

            <button onClick={() => onComplete(accuracy)} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                color: "white", border: "2px solid #64ffda",
                borderRadius: "10px", cursor: "pointer",
            }}>✅ Complete! ({accuracy}%)</button>
        </div>
    );
};

export default PixelArt;
