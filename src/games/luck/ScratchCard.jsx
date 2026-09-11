/**
 * 🎮 Game 74: 복권 긁기 — Canvas 스크래치 효과
 */
import { useCallback, useEffect, useRef, useState } from "react";

const SYMBOLS = ["💎", "🍀", "⭐", "🎁", "🍒", "🔔", "7️⃣"];
const genCard = () => {
    const grid = [];
    // Guarantee at least one matching pair
    const luckySymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const matchCount = Math.random() > 0.4 ? 3 : Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < 9; i++) {
        grid.push(i < matchCount ? luckySymbol : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    return grid.sort(() => Math.random() - 0.5);
};

const ScratchCard = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [card] = useState(() => genCard());
    const [scratched, setScratched] = useState(0);
    const [done, setDone] = useState(false);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        // Fill with scratch coating
        const gradient = ctx.createLinearGradient(0, 0, 240, 240);
        gradient.addColorStop(0, "#8B8B8B");
        gradient.addColorStop(0.5, "#A8A8A8");
        gradient.addColorStop(1, "#8B8B8B");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 240, 240);
        // Add shine effect
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(0, 0, 240, 120);
        // Text
        ctx.fillStyle = "#666";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("긁어보세요!", 120, 125);
    }, []);

    const scratch = useCallback((e) => {
        if (done) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x * (240 / rect.width), y * (240 / rect.height), 20, 0, Math.PI * 2);
        ctx.fill();

        // Check how much is scratched
        const imageData = ctx.getImageData(0, 0, 240, 240);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) transparent++;
        }
        const pct = Math.round((transparent / (240 * 240)) * 100);
        setScratched(pct);

        if (pct > 60 && !done) {
            setDone(true);
            // Count matches
            const counts = {};
            card.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
            const maxMatch = Math.max(...Object.values(counts));
            const score = maxMatch >= 3 ? 100 : maxMatch >= 2 ? 60 : 20;
            setTimeout(() => onComplete(score), 1000);
        }
    }, [card, done, onComplete]);

    // Count for display
    const counts = {};
    card.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    const maxMatch = Math.max(...Object.values(counts));

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                긁은 면적: <span style={{ color: "#FFD700" }}>{scratched}%</span>
                {done && <span style={{ color: maxMatch >= 3 ? "#64ffda" : "#FFD700", marginLeft: 10 }}>
                    {maxMatch >= 3 ? "🎉 3개 일치!" : maxMatch >= 2 ? "👍 2개 일치!" : "😬 꽝"}
                </span>}
            </div>

            <div style={{ position: "relative", width: 240, height: 240, borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(255,215,0,0.2)" }}>
                {/* Prize grid behind */}
                <div style={{
                    position: "absolute", top: 0, left: 0, width: 240, height: 240,
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px",
                    background: "linear-gradient(135deg, #1a1a3e, #2a1a4e)",
                    padding: "4px", boxSizing: "border-box",
                }}>
                    {card.map((symbol, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "36px", background: "rgba(255,255,255,0.05)",
                            borderRadius: "8px",
                        }}>{symbol}</div>
                    ))}
                </div>

                {/* Scratch canvas on top */}
                <canvas ref={canvasRef} width={240} height={240}
                    style={{ position: "absolute", top: 0, left: 0, width: 240, height: 240, cursor: "crosshair", touchAction: "none" }}
                    onMouseDown={() => { isDrawing.current = true; }}
                    onMouseUp={() => { isDrawing.current = false; }}
                    onMouseMove={(e) => { if (isDrawing.current) scratch(e); }}
                    onTouchStart={() => { isDrawing.current = true; }}
                    onTouchEnd={() => { isDrawing.current = false; }}
                    onTouchMove={(e) => { if (isDrawing.current) scratch(e); }}
                />
            </div>

            <div style={{ fontSize: "11px", color: "#8892b0" }}>마우스로 드래그하여 긁으세요!</div>
        </div>
    );
};

export default ScratchCard;
