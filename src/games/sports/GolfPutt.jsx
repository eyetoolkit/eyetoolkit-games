/**
 * 🎮 Game 92: 골프 퍼팅 — 탑다운 퍼팅 라인 + 공 이동 애니메이션
 */
import { useCallback, useEffect, useRef, useState } from "react";

const randomHole = () => ({ x: 25 + Math.random() * 50, y: 15 + Math.random() * 20 });

const GolfPutt = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [power, setPower] = useState(50);
    const [shots, setShots] = useState(0);
    const [score, setScore] = useState(0);
    const [putting, setPutting] = useState(false);
    const [holePos, setHolePos] = useState(randomHole);
    const [ballPos, setBallPos] = useState({ x: 50, y: 90 });
    const [result, setResult] = useState(null);
    const MAX = 5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = 220, H = 300;
        ctx.clearRect(0, 0, W, H);

        // Green gradient
        const greenGrad = ctx.createLinearGradient(0, 0, W, H);
        greenGrad.addColorStop(0, "#1a5c2a");
        greenGrad.addColorStop(0.5, "#227a3a");
        greenGrad.addColorStop(1, "#1a5c2a");
        ctx.fillStyle = greenGrad;
        ctx.fillRect(0, 0, W, H);

        // Grass texture
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        for (let y = 0; y < H; y += 8) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        // Fairway darker edges
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, 15, H);
        ctx.fillRect(W - 15, 0, 15, H);

        // Hole
        const hx = (holePos.x / 100) * W;
        const hy = (holePos.y / 100) * H;
        // Hole shadow
        ctx.beginPath();
        ctx.ellipse(hx + 1, hy + 1, 12, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();
        // Hole rim
        ctx.beginPath();
        ctx.arc(hx, hy, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#0a0a0a";
        ctx.fill();
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Flag pole
        ctx.beginPath();
        ctx.moveTo(hx, hy - 10);
        ctx.lineTo(hx, hy - 44);
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Flag
        ctx.beginPath();
        ctx.moveTo(hx, hy - 44);
        ctx.lineTo(hx + 16, hy - 38);
        ctx.lineTo(hx, hy - 32);
        ctx.fillStyle = "#EF4444";
        ctx.fill();

        // Power guide line
        const bx = (ballPos.x / 100) * W;
        const by = (ballPos.y / 100) * H;
        if (!putting && ballPos.y > 50) {
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(hx, hy);
            ctx.strokeStyle = `rgba(255,215,0,${0.15 + power / 300})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
            // Power indicator dot
            const pFrac = power / 100;
            const dotX = bx + (hx - bx) * pFrac;
            const dotY = by + (hy - by) * pFrac;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,215,0,0.5)";
            ctx.fill();
        }

        // Ball shadow
        ctx.beginPath();
        ctx.ellipse(bx + 2, by + 3, 6, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fill();
        // Ball
        ctx.beginPath();
        ctx.arc(bx, by, 6, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 6);
        ballGrad.addColorStop(0, "#fff");
        ballGrad.addColorStop(1, "#ddd");
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }, [ballPos, holePos, putting, power]);

    const putt = useCallback(() => {
        if (putting) return;
        setPutting(true);

        const accuracy = 100 - Math.abs(power - 55);
        const drift = (Math.random() - 0.5) * (100 - accuracy) * 0.5;
        const endX = holePos.x + drift;
        const endY = holePos.y + (Math.random() - 0.5) * 5;

        let frame = 0;
        const anim = setInterval(() => {
            frame++;
            const progress = Math.min(1, frame / 30);
            const eased = 1 - Math.pow(1 - progress, 3);
            setBallPos({ x: 50 + (endX - 50) * eased, y: 90 + (endY - 90) * eased });

            if (frame >= 30) {
                clearInterval(anim);
                const dist = Math.sqrt((endX - holePos.x) ** 2 + (endY - holePos.y) ** 2);
                const pts = dist < 3 ? 20 : dist < 8 ? 14 : dist < 15 ? 8 : 3;
                const newScore = score + pts;
                setScore(newScore);
                setResult(dist < 3 ? "🕳️ 홀인!" : dist < 8 ? "👏 근접!" : dist < 15 ? "🤔 아쉽" : "😬 빗나감");

                const ns = shots + 1;
                setShots(ns);
                setTimeout(() => {
                    if (ns >= MAX) onComplete(Math.min(100, Math.round(newScore / (MAX * 20) * 100)));
                    else {
                        setHolePos(randomHole());
                        setBallPos({ x: 50, y: 90 });
                        setResult(null);
                        setPutting(false);
                    }
                }, 800);
            }
        }, 30);
    }, [power, putting, holePos, shots, score, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <style>{`
                @keyframes resultPop { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>⛳ <span style={{ color: "#FFD700", fontWeight: "bold" }}>{shots}/{MAX}</span></span>
                <span>점수: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                {/* Shot dots */}
                <div style={{ display: "flex", gap: "3px" }}>
                    {Array.from({ length: MAX }, (_, i) => (
                        <div key={i} style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: i < shots ? "#64ffda" : "rgba(255,255,255,0.1)",
                        }} />
                    ))}
                </div>
            </div>

            <canvas ref={canvasRef} width={220} height={300}
                style={{
                    borderRadius: "14px",
                    border: "2px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }} />

            {result && <div style={{
                fontSize: "18px", fontWeight: "bold", color: "#FFD700",
                animation: "resultPop 0.3s ease",
                textShadow: "0 0 15px rgba(255,215,0,0.3)",
            }}>{result}</div>}

            <div style={{ width: 220 }}>
                <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    🏌️ 힘: <span style={{ color: "#FFD700", fontWeight: "bold", width: 35 }}>{power}%</span>
                    <input type="range" min="10" max="100" value={power} onChange={(e) => setPower(+e.target.value)}
                        disabled={putting}
                        style={{ flex: 1, accentColor: "#22C55E" }} />
                </label>
            </div>

            <button onClick={putt} disabled={putting} style={{
                padding: "10px 26px", fontSize: "14px", fontWeight: "bold",
                background: putting ? "rgba(100,100,100,0.2)" : "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))",
                color: "white", border: `2px solid ${putting ? "#555" : "#22C55E"}`,
                borderRadius: "14px", cursor: putting ? "wait" : "pointer",
                boxShadow: putting ? "none" : "0 4px 12px rgba(34,197,94,0.2)",
                transition: "all 0.2s",
            }}>🏌️ 퍼팅!</button>
        </div>
    );
};

export default GolfPutt;
