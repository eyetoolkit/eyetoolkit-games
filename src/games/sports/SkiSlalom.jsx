/**
 * 🎮 Game 97: 스키 슬라롬 — Canvas 스키 활강
 */
import { useCallback, useEffect, useRef, useState } from "react";

const SkiSlalom = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [pos, setPos] = useState(50);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(2);
    const [flags, setFlags] = useState([]);
    const [passed, setPassed] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const posRef = useRef(50);
    const scoreRef = useRef(0);
    const TOTAL_FLAGS = 15;

    // Keep scoreRef in sync
    useEffect(() => { scoreRef.current = score; }, [score]);

    // Init flags
    useEffect(() => {
        const fs = [];
        for (let i = 0; i < TOTAL_FLAGS; i++) {
            fs.push({ x: 15 + Math.random() * 70, y: -60 - i * 80, cleared: false });
        }
        setFlags(fs);
    }, []);

    // Game loop
    useEffect(() => {
        if (gameOver || flags.length === 0) return;
        const loop = setInterval(() => {
            setFlags((prev) => {
                const updated = prev.map((f) => ({ ...f, y: f.y + speed }));
                // Check passing
                updated.forEach((f) => {
                    if (!f.cleared && f.y > 120 && f.y < 140) {
                        const dist = Math.abs(posRef.current - f.x);
                        if (dist < 15) {
                            f.cleared = true;
                            const pts = dist < 5 ? 8 : dist < 10 ? 5 : 3;
                            scoreRef.current += pts;
                            setScore(scoreRef.current);
                            setPassed((p) => p + 1);
                        }
                    }
                });
                // End game
                if (updated[updated.length - 1].y > 200) {
                    setGameOver(true);
                    clearInterval(loop);
                    setTimeout(() => onComplete(Math.min(100, Math.round((scoreRef.current / (TOTAL_FLAGS * 8)) * 100))), 500);
                }
                return updated;
            });
            setSpeed((s) => Math.min(5, s + 0.01));
        }, 40);
        return () => clearInterval(loop);
    }, [flags.length, gameOver, speed, onComplete]);

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = 240, H = 280;
        ctx.clearRect(0, 0, W, H);

        // Snow slope
        const snow = ctx.createLinearGradient(0, 0, 0, H);
        snow.addColorStop(0, "#E8EDF2");
        snow.addColorStop(0.5, "#D0D8E0");
        snow.addColorStop(1, "#B8C4D0");
        ctx.fillStyle = snow;
        ctx.fillRect(0, 0, W, H);

        // Ski tracks (subtle)
        ctx.strokeStyle = "rgba(150,160,170,0.15)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(40 + i * 40, 0);
            ctx.lineTo(40 + i * 40, H);
            ctx.stroke();
        }

        // Flags
        flags.forEach((f) => {
            const fx = (f.x / 100) * W;
            const fy = f.y;
            if (fy < -20 || fy > H + 20) return;

            // Flag pole
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx, fy - 25);
            ctx.strokeStyle = f.cleared ? "rgba(100,255,218,0.3)" : "#333";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Flag
            ctx.beginPath();
            ctx.moveTo(fx, fy - 25);
            ctx.lineTo(fx + 12, fy - 20);
            ctx.lineTo(fx, fy - 15);
            ctx.fillStyle = f.cleared ? "#64ffda" : "#EF4444";
            ctx.fill();
        });

        // Skier
        const sx = (posRef.current / 100) * W;
        ctx.font = "24px sans-serif";
        ctx.fillText("⛷️", sx - 12, 135);

        // Snow spray
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(sx + (Math.random() - 0.5) * 10, 140 + Math.random() * 8, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fill();
        }
    }, [flags, pos]);

    // Controls
    const handleMove = useCallback((e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) / rect.width * 100;
        posRef.current = Math.max(5, Math.min(95, x));
        setPos(posRef.current);
    }, []);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                ⛷️ 통과: <span style={{ color: "#64ffda" }}>{passed}/{TOTAL_FLAGS}</span> | 점수: <span style={{ color: "#FFD700" }}>{score}</span>
            </div>

            <canvas ref={canvasRef} width={240} height={280}
                style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", cursor: "none", touchAction: "none" }}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
            />

            <div style={{ fontSize: "10px", color: "#8892b0" }}>마우스를 움직여 조종하세요!</div>
        </div>
    );
};

export default SkiSlalom;
