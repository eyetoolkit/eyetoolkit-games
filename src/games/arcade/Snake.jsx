/**
 * 🎮 Game 33: Snake — body gradient + eat effects + D-pad
 */
import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 15, CELL = 22, SPEED = 120;

const Snake = ({ onComplete }) => {
    const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
    const [food, setFood] = useState({ x: 10, y: 10 });
    const [dir, setDir] = useState({ x: 1, y: 0 });
    // "ready" → snake waits for the first input so players are never killed
    // before they can react; "running" → loop ticks; "over" → death screen.
    const [phase, setPhase] = useState("ready");
    const [score, setScore] = useState(0);
    const [ateFood, setAteFood] = useState(false);
    const dirRef = useRef({ x: 1, y: 0 });
    const scoreRef = useRef(0);

    const spawnFood = useCallback((s) => {
        let f;
        do { f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
        while (s.some((seg) => seg.x === f.x && seg.y === f.y));
        return f;
    }, []);

    useEffect(() => {
        const kd = (e) => {
            const d = dirRef.current;
            if (e.key === "ArrowUp" && d.y !== 1) dirRef.current = { x: 0, y: -1 };
            if (e.key === "ArrowDown" && d.y !== -1) dirRef.current = { x: 0, y: 1 };
            if (e.key === "ArrowLeft" && d.x !== 1) dirRef.current = { x: -1, y: 0 };
            if (e.key === "ArrowRight" && d.x !== -1) dirRef.current = { x: 1, y: 0 };
            const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
            if (isArrow) {
                e.preventDefault();
                // First keypress kicks the game off instead of leaving it frozen
                setPhase(p => (p === "ready" ? "running" : p));
            }
        };
        window.addEventListener("keydown", kd);
        return () => window.removeEventListener("keydown", kd);
    }, []);

    useEffect(() => {
        if (phase !== "running") return;
        const loop = setInterval(() => {
            setSnake((prev) => {
                const d = dirRef.current;
                setDir(d);
                const head = { x: prev[0].x + d.x, y: prev[0].y + d.y };
                if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || prev.some((s) => s.x === head.x && s.y === head.y)) {
                    setPhase("over");
                    setTimeout(() => onComplete(Math.min(100, Math.round(scoreRef.current * 5))), 500);
                    return prev;
                }
                const ns = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                    setFood(spawnFood(ns));
                    setAteFood(true);
                    setTimeout(() => setAteFood(false), 300);
                } else {
                    ns.pop();
                }
                return ns;
            });
        }, SPEED);
        return () => clearInterval(loop);
    }, [phase, food, onComplete, spawnFood]);

    const handleDir = useCallback((dx, dy) => {
        const d = dirRef.current;
        if (dx !== -d.x || dy !== -d.y) dirRef.current = { x: dx, y: dy };
        setPhase(p => (p === "ready" ? "running" : p));
    }, []);

    const restart = useCallback(() => {
        dirRef.current = { x: 1, y: 0 };
        scoreRef.current = 0;
        setDir({ x: 1, y: 0 });
        setSnake([{ x: 7, y: 7 }]);
        setFood(spawnFood([{ x: 7, y: 7 }]));
        setScore(0);
        setPhase("ready");
    }, [spawnFood]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", color: "white" }}>
            <style>{`@keyframes foodPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }`}</style>

            <div style={{ fontSize: "13px" }}>
                🍎 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{score}</span>
                {score >= 10 && <span style={{ color: "#FFD700", marginLeft: 8 }}>🏆 Amazing!</span>}
            </div>

            <div style={{
                width: GRID * CELL, height: GRID * CELL,
                borderRadius: "10px", position: "relative",
                background: "linear-gradient(135deg, #0a1628, #0a0a1e)",
                border: "2px solid rgba(100,255,218,0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
                {/* Grid dots */}
                {[...Array(GRID * GRID)].map((_, i) => {
                    const x = i % GRID, y = Math.floor(i / GRID);
                    if ((x + y) % 3 !== 0) return null;
                    return <div key={i} style={{
                        position: "absolute", left: x * CELL + CELL / 2 - 1, top: y * CELL + CELL / 2 - 1,
                        width: 2, height: 2, borderRadius: "50%", background: "rgba(255,255,255,0.03)",
                    }} />;
                })}

                {/* Snake */}
                {snake.map((s, i) => {
                    const opacity = 1 - (i / snake.length) * 0.5;
                    const isHead = i === 0;
                    return (
                        <div key={i} style={{
                            position: "absolute", left: s.x * CELL + 1, top: s.y * CELL + 1,
                            width: CELL - 2, height: CELL - 2,
                            borderRadius: isHead ? "6px" : "4px",
                            background: isHead
                                ? "linear-gradient(135deg, #64ffda, #22c55e)"
                                : `rgba(34,197,94,${opacity})`,
                            boxShadow: isHead ? "0 0 8px rgba(100,255,218,0.4)" : "none",
                            transition: "left 0.08s, top 0.08s",
                        }} />
                    );
                })}

                {/* Food */}
                <div style={{
                    position: "absolute", left: food.x * CELL, top: food.y * CELL,
                    width: CELL, height: CELL,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px",
                    animation: "foodPulse 1s ease infinite",
                    filter: ateFood ? "drop-shadow(0 0 8px rgba(239,68,68,0.6))" : "none",
                }}>🍎</div>

                {/* Ready overlay — waits for the first input */}
                {phase === "ready" && (
                    <div style={{
                        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: "10px",
                        background: "rgba(0,0,0,0.55)", borderRadius: "10px",
                        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
                    }}>
                        <div style={{ fontSize: "26px", lineHeight: 1 }}>🐍</div>
                        <div style={{ fontSize: "15px", fontWeight: "bold", color: "#64ffda" }}>Ready?</div>
                        <div style={{ fontSize: "11.5px", color: "#cbd5e1", textAlign: "center", lineHeight: 1.5, padding: "0 14px" }}>
                            Press an arrow key or use the D-pad<br />to set the snake moving
                        </div>
                    </div>
                )}

                {/* Game over */}
                {phase === "over" && (
                    <div style={{
                        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: "8px",
                        background: "rgba(0,0,0,0.62)", borderRadius: "10px",
                    }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#FF6B6B" }}>💀 Game over</div>
                        <div style={{ color: "#FFD700" }}>🍎 x{score}</div>
                        <button onClick={restart} style={{
                            marginTop: "4px", padding: "7px 16px", fontSize: "12.5px", fontWeight: 600,
                            background: "linear-gradient(135deg, #6366f1, #06b6d4)", color: "white",
                            border: "none", borderRadius: "9px", cursor: "pointer",
                        }}>🔄 Play again</button>
                    </div>
                )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <button onClick={() => handleDir(0, -1)} style={dBtn}>▲</button>
                <div style={{ display: "flex", gap: "3px" }}>
                    <button onClick={() => handleDir(-1, 0)} style={dBtn}>◀</button>
                    <button onClick={() => handleDir(0, 1)} style={dBtn}>▼</button>
                    <button onClick={() => handleDir(1, 0)} style={dBtn}>▶</button>
                </div>
            </div>
        </div>
    );
};

const dBtn = {
    width: 34, height: 30, fontSize: "12px",
    background: "rgba(255,255,255,0.08)", color: "white",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", cursor: "pointer",
};

export default Snake;
