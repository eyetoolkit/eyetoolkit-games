/**
 * 🎮 Game 106: 색깔 스위치
 * 공이 떨어지며 같은 색 게이트를 통과해야 합니다
 */
import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D"];
const GATE_HEIGHT = 40;
const BALL_SIZE = 20;
const CANVAS_W = 300;
const CANVAS_H = 500;

const ColorSwitch = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const stateRef = useRef({
        ballY: 60, ballColor: 0, velocity: 0, score: 0,
        gates: [], gameOver: false, started: false,
    });
    const animRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const generateGate = useCallback((y) => ({
        y,
        openColor: Math.floor(Math.random() * COLORS.length),
        passed: false,
    }), []);

    useEffect(() => {
        const s = stateRef.current;
        s.gates = [];
        for (let i = 0; i < 6; i++) {
            s.gates.push(generateGate(200 + i * 80));
        }
    }, [generateGate]);

    const tap = useCallback(() => {
        const s = stateRef.current;
        if (s.gameOver) return;
        s.started = true;
        s.velocity = -6;
        s.ballColor = (s.ballColor + 1) % COLORS.length;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const loop = () => {
            const s = stateRef.current;
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

            // Background
            ctx.fillStyle = "#0a0a1a";
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            if (s.started && !s.gameOver) {
                s.velocity += 0.25;
                s.ballY += s.velocity;
            }

            // Draw gates
            for (const gate of s.gates) {
                const relY = gate.y - s.ballY + 60;
                if (relY < -GATE_HEIGHT || relY > CANVAS_H + GATE_HEIGHT) continue;

                for (let i = 0; i < COLORS.length; i++) {
                    const segW = CANVAS_W / COLORS.length;
                    ctx.fillStyle = i === gate.openColor ? COLORS[i] + "33" : COLORS[i];
                    ctx.fillRect(i * segW, relY, segW, GATE_HEIGHT);
                    if (i === gate.openColor) {
                        ctx.strokeStyle = COLORS[i];
                        ctx.lineWidth = 2;
                        ctx.setLineDash([4, 4]);
                        ctx.strokeRect(i * segW, relY, segW, GATE_HEIGHT);
                        ctx.setLineDash([]);
                    }
                }

                // Check collision
                if (!gate.passed && Math.abs(s.ballY - gate.y) < GATE_HEIGHT / 2) {
                    const segIdx = Math.floor((CANVAS_W / 2) / (CANVAS_W / COLORS.length));
                    if (segIdx === gate.openColor && s.ballColor === gate.openColor) {
                        gate.passed = true;
                        s.score++;
                        setScore(s.score);
                    } else if (segIdx !== gate.openColor || s.ballColor !== gate.openColor) {
                        if (Math.abs(s.ballY - gate.y) < 8) {
                            s.gameOver = true;
                            setGameOver(true);
                            const finalScore = Math.min(100, s.score * 8 + 20);
                            setTimeout(() => onComplete(finalScore), 500);
                        }
                    }
                }
            }

            // Recycle gates
            if (s.gates.length > 0 && s.gates[0].y < s.ballY - 200) {
                s.gates.shift();
                const lastY = s.gates[s.gates.length - 1].y;
                s.gates.push(generateGate(lastY + 80));
            }

            // Ball
            ctx.beginPath();
            ctx.arc(CANVAS_W / 2, 60, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[s.ballColor];
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Floor death
            if (s.ballY > s.gates[s.gates.length - 1]?.y + 200) {
                s.gameOver = true;
                setGameOver(true);
                const finalScore = Math.min(100, s.score * 8 + 20);
                setTimeout(() => onComplete(finalScore), 500);
            }

            if (!s.gameOver) animRef.current = requestAnimationFrame(loop);
        };
        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, [onComplete, generateGate]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                점수: <span style={{ color: "#FFD700" }}>{score}</span>
            </div>
            <canvas
                ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
                onClick={tap}
                style={{ borderRadius: "12px", border: "2px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
            />
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                탭하여 색을 바꾸고 같은 색 게이트를 통과!
            </div>
            {gameOver && <div style={{ fontSize: "16px", color: "#FF6B6B", fontWeight: "bold" }}>게임 오버! 점수: {score}</div>}
        </div>
    );
};

export default ColorSwitch;
