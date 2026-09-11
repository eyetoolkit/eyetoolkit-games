/**
 * 🎮 Game 100: 로켓 런치 — Canvas 궤적 시뮬레이션
 */
import { useCallback, useEffect, useRef, useState } from "react";

const RocketLaunch = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [angle, setAngle] = useState(45);
    const [power, setPower] = useState(60);
    const [launches, setLaunches] = useState(0);
    const [bestDist, setBestDist] = useState(0);
    const [flying, setFlying] = useState(false);
    const [trajectory, setTrajectory] = useState([]);
    const MAX = 3;

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = 280, H = 160;
        ctx.clearRect(0, 0, W, H);

        // Sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, "#0a0a2e");
        sky.addColorStop(0.7, "#1a1a4e");
        sky.addColorStop(1, "#2a3a2a");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Stars
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.2})`;
            ctx.fillRect(Math.random() * W, Math.random() * H * 0.6, 1, 1);
        }

        // Ground
        ctx.fillStyle = "#1a3a1a";
        ctx.fillRect(0, H - 20, W, 20);

        // Launch pad
        ctx.fillStyle = "#555";
        ctx.fillRect(8, H - 24, 30, 4);

        // Trajectory
        if (trajectory.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,165,0,0.6)";
            ctx.lineWidth = 2;
            trajectory.forEach(([x, y], i) => {
                const cx = 23 + (x / 200) * (W - 40);
                const cy = H - 22 - (y / 100) * (H - 30);
                i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
            });
            ctx.stroke();

            // Fire particles along trajectory
            trajectory.forEach(([x, y], i) => {
                if (i % 3 !== 0) return;
                const cx = 23 + (x / 200) * (W - 40);
                const cy = H - 22 - (y / 100) * (H - 30);
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,${100 + i * 3},0,${0.3 + (i / trajectory.length) * 0.5})`;
                ctx.fill();
            });

            // Landing marker
            const last = trajectory[trajectory.length - 1];
            const lx = 23 + (last[0] / 200) * (W - 40);
            ctx.beginPath();
            ctx.arc(lx, H - 22, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${Math.round(last[0])}m`, lx, H - 8);
        }

        // Preview trajectory (dotted)
        if (!flying && trajectory.length === 0) {
            const rad = angle * Math.PI / 180;
            const v = power * 0.8;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,215,0,0.25)";
            for (let t = 0; t < 40; t++) {
                const px = v * Math.cos(rad) * t * 0.1;
                const py = v * Math.sin(rad) * t * 0.1 - 0.5 * 9.8 * (t * 0.1) ** 2;
                if (py < 0 && t > 0) break;
                const cx = 23 + (px / 200) * (W - 40);
                const cy = H - 22 - (py / 100) * (H - 30);
                t === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Rocket on pad
        if (!flying) {
            ctx.save();
            ctx.translate(23, H - 24);
            ctx.rotate(-(angle * Math.PI / 180));
            ctx.font = "18px sans-serif";
            ctx.fillText("🚀", -8, 5);
            ctx.restore();
        }
    }, [angle, power, trajectory, flying]);

    const launch = useCallback(() => {
        if (flying) return;
        setFlying(true);
        setTrajectory([]);

        const rad = angle * Math.PI / 180;
        const v = power * 0.8;
        const points = [];
        let t = 0;

        const anim = setInterval(() => {
            t += 0.15;
            const px = v * Math.cos(rad) * t;
            const py = v * Math.sin(rad) * t - 0.5 * 9.8 * t * t;
            points.push([px, Math.max(0, py)]);
            setTrajectory([...points]);

            if (py < 0 && t > 0.3) {
                clearInterval(anim);
                const dist = Math.round(px);
                if (dist > bestDist) setBestDist(dist);
                const n = launches + 1;
                setLaunches(n);

                setTimeout(() => {
                    if (n >= MAX) {
                        const best = Math.max(dist, bestDist);
                        onComplete(Math.min(100, best));
                    } else {
                        setFlying(false);
                        setTrajectory([]);
                    }
                }, 1000);
            }
        }, 30);
    }, [angle, power, flying, launches, bestDist, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                🚀 {launches}/{MAX} | 최고: <span style={{ color: "#FFD700" }}>{bestDist}m</span>
            </div>

            <canvas ref={canvasRef} width={280} height={160}
                style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }} />

            <div style={{ width: 240, display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}>
                    📐 각도: <span style={{ color: "#FFD700", width: 30 }}>{angle}°</span>
                    <input type="range" min="15" max="75" value={angle} onChange={(e) => setAngle(+e.target.value)} disabled={flying} style={{ flex: 1, accentColor: "#FFD700" }} />
                </label>
                <label style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}>
                    💪 파워: <span style={{ color: "#EF4444", width: 30 }}>{power}%</span>
                    <input type="range" min="10" max="100" value={power} onChange={(e) => setPower(+e.target.value)} disabled={flying} style={{ flex: 1, accentColor: "#EF4444" }} />
                </label>
            </div>

            <button onClick={launch} disabled={flying} style={{
                padding: "10px 28px", fontSize: "14px", fontWeight: "bold",
                background: flying ? "rgba(100,100,100,0.3)" : "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(255,165,0,0.15))",
                color: "white", border: `2px solid ${flying ? "#666" : "#EF4444"}`,
                borderRadius: "12px", cursor: flying ? "wait" : "pointer",
            }}>🔥 발사!</button>
        </div>
    );
};

export default RocketLaunch;
