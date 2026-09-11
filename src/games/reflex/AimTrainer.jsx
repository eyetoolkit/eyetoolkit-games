/**
 * 🎮 Game 107: Aim Trainer
 * Quickly click targets appearing at random spots!
 */
import { useState, useEffect, useRef, useCallback } from "react";

const FIELD_W = 320;
const FIELD_H = 400;
const TARGET_SIZE = 40;
const GAME_TIME = 30;

const AimTrainer = ({ onComplete }) => {
    const [target, setTarget] = useState({ x: 150, y: 180 });
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const timerRef = useRef(null);
    const scoreRef = useRef(0);
    const missRef = useRef(0);

    const spawnTarget = useCallback(() => {
        setTarget({
            x: TARGET_SIZE / 2 + Math.random() * (FIELD_W - TARGET_SIZE),
            y: TARGET_SIZE / 2 + Math.random() * (FIELD_H - TARGET_SIZE),
        });
    }, []);

    const handleHit = useCallback(() => {
        if (done) return;
        if (!started) setStarted(true);
        scoreRef.current++;
        setScore(scoreRef.current);
        spawnTarget();
    }, [done, started, spawnTarget]);

    const handleMiss = useCallback((e) => {
        if (done || !started) return;
        if (e.target.dataset.isTarget) return;
        missRef.current++;
        setMisses(missRef.current);
    }, [done, started]);

    useEffect(() => {
        if (!started || done) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setDone(true);
                    const accuracy = scoreRef.current / Math.max(1, scoreRef.current + missRef.current);
                    const finalScore = Math.min(100, Math.floor(scoreRef.current * 3 + accuracy * 30));
                    setTimeout(() => onComplete(Math.max(20, finalScore)), 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [started, done, onComplete]);

    const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ display: "flex", gap: "20px", fontSize: "13px" }}>
                <span>Hits: <span style={{ color: "#64ffda" }}>{score}</span></span>
                <span>Miss: <span style={{ color: "#FF6B6B" }}>{misses}</span></span>
                <span>Accuracy: <span style={{ color: "#FFD700" }}>{accuracy}%</span></span>
                <span>Time: <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#fff" }}>{timeLeft}s</span></span>
            </div>
            <div
                onClick={handleMiss}
                style={{
                    width: FIELD_W, height: FIELD_H, position: "relative",
                    background: "rgba(255,255,255,0.02)", borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.1)", cursor: "crosshair",
                    overflow: "hidden",
                }}
            >
                {!started && (
                    <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "16px", color: "#8892b0",
                    }}>
                        Click a target to start!
                    </div>
                )}
                <div
                    data-is-target="true"
                    onClick={(e) => { e.stopPropagation(); handleHit(); }}
                    style={{
                        position: "absolute",
                        left: target.x - TARGET_SIZE / 2,
                        top: target.y - TARGET_SIZE / 2,
                        width: TARGET_SIZE, height: TARGET_SIZE,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #FF6B6B 30%, #FF6B6B00 70%)",
                        border: "3px solid #FF6B6B",
                        cursor: "pointer",
                        transition: "left 0.05s, top 0.05s",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: "white",
                    }} />
                </div>
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                Click as many targets as you can in 30 seconds!
            </div>
            {done && (
                <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>
                    🎯 {score} hits! accuracy {accuracy}%
                </div>
            )}
        </div>
    );
};

export default AimTrainer;
