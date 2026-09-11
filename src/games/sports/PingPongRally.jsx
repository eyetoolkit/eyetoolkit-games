/**
 * 🎮 Game 99: Ping Pong Rally — canvas table + ball trajectory
 */
import { useCallback, useEffect, useRef, useState } from "react";

const PingPongRally = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [rally, setRally] = useState(0);
    const [best, setBest] = useState(0);
    // "ready" → ball is parked until the player moves; prevents the ball from
    // dropping past the paddle before the player can even find the mouse.
    const [phase, setPhase] = useState("ready");
    const stateRef = useRef({
        ballX: 130, ballY: 100, ballDX: 3, ballDY: 2,
        paddleX: 110, aiPaddleX: 110,
        rally: 0,
    });

    // Draw a single static frame while waiting, so the table isn't blank
    useEffect(() => {
        if (phase !== "ready") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = 260, H = 200;
        const s = stateRef.current;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#0D5F1C";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, W - 10, H - 10);
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#EF4444";
        ctx.fillRect(s.aiPaddleX, 8, 40, 8);
        ctx.fillStyle = "#3B82F6";
        ctx.fillRect(s.paddleX, H - 16, 50, 8);
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Move to serve", W / 2, H / 2 - 12);
    }, [phase]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || phase !== "running") return;
        const ctx = canvas.getContext("2d");
        const W = 260, H = 200;
        const s = stateRef.current;

        const loop = setInterval(() => {
            // Move ball
            s.ballX += s.ballDX;
            s.ballY += s.ballDY;

            // Wall bounce
            if (s.ballX < 5 || s.ballX > W - 5) s.ballDX *= -1;

            // AI paddle
            s.aiPaddleX += (s.ballX - s.aiPaddleX - 20) * 0.06;

            // Player paddle bounce
            if (s.ballY > H - 20 && s.ballDY > 0) {
                if (s.ballX > s.paddleX && s.ballX < s.paddleX + 50) {
                    s.ballDY *= -1;
                    s.ballDY -= 0.1;
                    s.ballDX += (s.ballX - s.paddleX - 25) * 0.1;
                    s.rally++;
                    setRally(s.rally);
                    if (s.rally > best) setBest(s.rally);
                } else {
                    // Miss
                    clearInterval(loop);
                    setPhase("over");
                    setTimeout(() => onComplete(Math.min(100, s.rally * 5)), 500);
                    return;
                }
            }

            // AI paddle bounce
            if (s.ballY < 18 && s.ballDY < 0) {
                if (s.ballX > s.aiPaddleX && s.ballX < s.aiPaddleX + 40) {
                    s.ballDY *= -1;
                    s.ballDX += (Math.random() - 0.5) * 2;
                }
            }

            // Draw
            ctx.clearRect(0, 0, W, H);

            // Table
            ctx.fillStyle = "#0D5F1C";
            ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 2;
            ctx.strokeRect(5, 5, W - 10, H - 10);
            // Net
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, H / 2);
            ctx.lineTo(W, H / 2);
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.stroke();
            ctx.setLineDash([]);

            // AI paddle
            ctx.fillStyle = "#EF4444";
            ctx.fillRect(s.aiPaddleX, 8, 40, 8);
            ctx.fillStyle = "rgba(239,68,68,0.3)";
            ctx.fillRect(s.aiPaddleX + 2, 10, 36, 4);

            // Player paddle
            ctx.fillStyle = "#3B82F6";
            ctx.fillRect(s.paddleX, H - 16, 50, 8);
            ctx.fillStyle = "rgba(59,130,246,0.3)";
            ctx.fillRect(s.paddleX + 2, H - 14, 46, 4);

            // Ball
            ctx.beginPath();
            ctx.arc(s.ballX, s.ballY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            // Ball shadow
            ctx.beginPath();
            ctx.arc(s.ballX + 1, s.ballY + 1, 5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fill();

            // Ball trail
            ctx.beginPath();
            ctx.arc(s.ballX - s.ballDX, s.ballY - s.ballDY, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,215,0,0.2)";
            ctx.fill();

            // Rally counter
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(s.rally.toString(), W / 2, H / 2 + 6);
        }, 25);

        return () => clearInterval(loop);
    }, [phase, best, onComplete]);

    const handleMove = useCallback((e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        stateRef.current.paddleX = Math.max(0, Math.min(210, (x / rect.width) * 260 - 25));
        // First paddle movement serves the ball
        setPhase(p => (p === "ready" ? "running" : p));
    }, []);

    const restart = useCallback(() => {
        stateRef.current = {
            ballX: 130, ballY: 100, ballDX: 3, ballDY: 2,
            paddleX: 110, aiPaddleX: 110, rally: 0,
        };
        setRally(0);
        setPhase("ready");
    }, []);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                🏓 Rally: <span style={{ color: "#64ffda" }}>{rally}</span> | Best: <span style={{ color: "#FFD700" }}>{best}</span>
            </div>

            <canvas ref={canvasRef} width={260} height={200}
                style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", cursor: "none", touchAction: "none" }}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
            />

            {phase === "over" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#FFD700" }}>
                        Game over! {rally}-rally 🏓
                    </div>
                    <button onClick={restart} style={{
                        padding: "7px 16px", fontSize: "12.5px", fontWeight: 600,
                        background: "linear-gradient(135deg, #6366f1, #06b6d4)", color: "white",
                        border: "none", borderRadius: "9px", cursor: "pointer",
                    }}>🔄 Play again</button>
                </div>
            )}

            <div style={{ fontSize: "10px", color: "#8892b0" }}>
                {phase === "ready" ? "Move the mouse to serve the ball" : "Move the mouse to control the paddles"}
            </div>
        </div>
    );
};

export default PingPongRally;
