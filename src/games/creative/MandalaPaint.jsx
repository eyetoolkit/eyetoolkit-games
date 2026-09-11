/**
 * 🎮 Game 58: Mandala Paint — SVG rings + hover highlight + progress
 */
import { useCallback, useState } from "react";

const SLICES = 8, RINGS = 4;
const PALETTE = ["#EF4444", "#FFD700", "#22C55E", "#3B82F6", "#A855F7", "#EC4899"];

const MandalaPaint = ({ onComplete }) => {
    const [cells, setCells] = useState(() => Array.from({ length: RINGS }, () => Array(SLICES).fill(null)));
    const [color, setColor] = useState(PALETTE[0]);
    const total = RINGS * SLICES;
    const painted = cells.flat().filter((c) => c !== null).length;
    const progress = Math.round((painted / total) * 100);

    const paint = useCallback((ring, slice) => {
        setCells((c) => {
            const n = c.map((r) => [...r]);
            n[ring][slice] = color;
            n[ring][(slice + SLICES / 2) % SLICES] = color; // symmetry
            return n;
        });
    }, [color]);

    const CX = 120, CY = 120;

    const getPath = (ring, slice) => {
        const angle = (slice / SLICES) * Math.PI * 2 - Math.PI / 2;
        const nextAngle = ((slice + 1) / SLICES) * Math.PI * 2 - Math.PI / 2;
        const innerR = 15 + ring * 25, outerR = 15 + (ring + 1) * 25;
        const x1 = CX + Math.cos(angle) * innerR, y1 = CY + Math.sin(angle) * innerR;
        const x2 = CX + Math.cos(angle) * outerR, y2 = CY + Math.sin(angle) * outerR;
        const x3 = CX + Math.cos(nextAngle) * outerR, y3 = CY + Math.sin(nextAngle) * outerR;
        const x4 = CX + Math.cos(nextAngle) * innerR, y4 = CY + Math.sin(nextAngle) * innerR;
        return `M${x1},${y1} L${x2},${y2} A${outerR},${outerR} 0 0,1 ${x3},${y3} L${x4},${y4} A${innerR},${innerR} 0 0,0 ${x1},${y1}`;
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                .mandala-cell:hover { filter: brightness(1.3); stroke-width: 2 !important; }
            `}</style>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                🎨 Symmetry painting — <span style={{ color: "#FFD700" }}>{progress}%</span>
            </div>

            {/* Progress ring */}
            <svg width={240} height={240} style={{
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(10,10,30,0.9), rgba(5,5,15,1))",
                border: "2px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}>
                {/* Center decoration */}
                <circle cx={CX} cy={CY} r={14} fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
                <text x={CX} y={CY + 4} textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold">✦</text>

                {/* Mandala cells */}
                {cells.map((ring, r) =>
                    ring.map((c, s) => (
                        <path
                            key={`${r}-${s}`}
                            className="mandala-cell"
                            d={getPath(r, s)}
                            fill={c || "rgba(255,255,255,0.04)"}
                            stroke={c ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"}
                            strokeWidth="0.8"
                            onClick={() => paint(r, s)}
                            style={{
                                cursor: "pointer",
                                transition: "fill 0.15s ease",
                                filter: c ? `drop-shadow(0 0 3px ${c}55)` : "none",
                            }}
                        />
                    ))
                )}

                {/* Outer decoration ring */}
                <circle cx={CX} cy={CY} r={116} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Palette */}
            <div style={{ display: "flex", gap: "8px" }}>
                {PALETTE.map((c) => (
                    <div key={c} onClick={() => setColor(c)} style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: c, cursor: "pointer",
                        border: color === c ? "3px solid white" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: color === c ? `0 0 12px ${c}66` : "none",
                        transform: color === c ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.2s ease",
                    }} />
                ))}
            </div>

            <button onClick={() => onComplete(progress)} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: progress >= 80 ? "linear-gradient(135deg, rgba(100,255,218,0.2), rgba(100,255,218,0.05))" : "rgba(255,255,255,0.06)",
                color: "white", border: `2px solid ${progress >= 80 ? "#64ffda" : "rgba(255,255,255,0.15)"}`,
                borderRadius: "10px", cursor: "pointer",
            }}>✅ Complete! ({progress}%)</button>
        </div>
    );
};

export default MandalaPaint;
