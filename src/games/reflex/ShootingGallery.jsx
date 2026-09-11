/**
 * 🎮 Game 16: 슈팅 갤러리 — 히트 파티클 + 콤보 + 타이머 바
 */
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_TIME = 20;
const TARGETS_AT_ONCE = 3;

const ShootingGallery = ({ onComplete }) => {
    const [targets, setTargets] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameActive, setGameActive] = useState(true);
    const [combo, setCombo] = useState(0);
    const [hitParts, setHitParts] = useState([]);
    const nextId = useRef(0);
    const scoreRef = useRef(0);
    const comboRef = useRef(0);

    const spawnTarget = useCallback(() => ({
        id: nextId.current++,
        x: Math.random() * 80 + 10, y: Math.random() * 60 + 10,
        size: 30 + Math.random() * 30, speed: 0.5 + Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 2, dy: (Math.random() - 0.5) * 2,
    }), []);

    useEffect(() => { setTargets(Array.from({ length: TARGETS_AT_ONCE }, spawnTarget)); }, [spawnTarget]);

    useEffect(() => {
        if (!gameActive) return;
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) { setGameActive(false); clearInterval(timer); setTimeout(() => onComplete(Math.min(100, Math.round(scoreRef.current * 5))), 500); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameActive, onComplete]);

    useEffect(() => {
        if (!gameActive) return;
        const anim = setInterval(() => {
            setTargets((prev) => prev.map((t) => {
                let nx = t.x + t.dx * t.speed, ny = t.y + t.dy * t.speed;
                let ndx = t.dx, ndy = t.dy;
                if (nx < 5 || nx > 90) ndx = -ndx;
                if (ny < 5 || ny > 75) ndy = -ndy;
                return { ...t, x: nx, y: ny, dx: ndx, dy: ndy };
            }));
        }, 50);
        return () => clearInterval(anim);
    }, [gameActive]);

    const shoot = useCallback((id, x, y) => {
        if (!gameActive) return;
        scoreRef.current += 1; comboRef.current += 1;
        setScore(scoreRef.current); setCombo(comboRef.current);
        setHitParts((p) => [...p.slice(-5), { id: Date.now(), x, y }]);
        setTimeout(() => setHitParts((p) => p.slice(1)), 400);
        setTargets((prev) => [...prev.filter((t) => t.id !== id), spawnTarget()]);
    }, [gameActive, spawnTarget]);

    const progress = (timeLeft / GAME_TIME) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", color: "white" }}>
            <style>{`@keyframes hitBurst { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", fontSize: "13px" }}>
                <span>⏱ <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}초</span></span>
                <span>🎯 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span></span>
                {comboRef.current >= 3 && <span style={{ color: "#A855F7" }}>🔥 x{combo}</span>}
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: timeLeft <= 5 ? "#FF6B6B" : "#64ffda", transition: "width 1s linear" }} />
            </div>
            <div style={{ flex: 1, position: "relative", cursor: "crosshair", overflow: "hidden" }}>
                {targets.map((t) => (
                    <div key={t.id} onClick={() => shoot(t.id, t.x, t.y)}
                        style={{
                            position: "absolute", left: `${t.x}%`, top: `${t.y}%`,
                            width: t.size, height: t.size, borderRadius: "50%",
                            background: "radial-gradient(circle at 30% 30%, #FF6B6B, #CC0000)",
                            border: "3px solid #FF9999", transform: "translate(-50%, -50%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: `${t.size * 0.4}px`,
                            boxShadow: "0 0 12px rgba(255,0,0,0.3)",
                            userSelect: "none",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 20px rgba(255,0,0,0.5)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 12px rgba(255,0,0,0.3)"; }}
                    >🎯</div>
                ))}
                {hitParts.map((h) => (
                    <div key={h.id} style={{
                        position: "absolute", left: `${h.x}%`, top: `${h.y}%`,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(255,215,0,0.6)",
                        animation: "hitBurst 0.4s ease forwards",
                        transform: "translate(-50%, -50%)",
                    }} />
                ))}
            </div>
            <div style={{ textAlign: "center", padding: "8px", fontSize: "11px", color: "#8892b0" }}>
                {gameActive ? "표적을 클릭!" : `게임 종료! ${score}개 명중`}
            </div>
        </div>
    );
};

export default ShootingGallery;
