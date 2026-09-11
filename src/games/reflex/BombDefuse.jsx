/**
 * 🎮 Game 110: Bomb Defuse
 * Cut the wires in the correct order before time runs out!
 */
import { useState, useEffect, useRef, useCallback } from "react";

const WIRE_COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9B59B6", "#FF8C42"];

const generatePuzzle = () => {
    const wireCount = 4 + Math.floor(Math.random() * 3); // 4~6 wires
    const colors = [...WIRE_COLORS].sort(() => Math.random() - 0.5).slice(0, wireCount);
    const cutOrder = [...Array(wireCount).keys()].sort(() => Math.random() - 0.5);
    const clues = cutOrder.map((idx, order) => ({
        wireIdx: idx,
        color: colors[idx],
        order: order + 1,
        hint: getHint(order + 1, colors[idx]),
    }));
    return { colors, cutOrder, clues, wireCount };
};

const getHint = (order, color) => {
    const colorNames = {
        "#FF6B6B": "Red", "#4D96FF": "Blue", "#6BCB77": "Green",
        "#FFD93D": "Yellow", "#9B59B6": "Purple", "#FF8C42": "Orange",
    };
    return `${order}: wire ${colorNames[color] || "?"} wire`;
};

const BombDefuse = ({ onComplete }) => {
    const [puzzle] = useState(generatePuzzle);
    const [cutWires, setCutWires] = useState(new Set());
    const [nextCutIdx, setNextCutIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [done, setDone] = useState(false);
    const [result, setResult] = useState(null);
    const [mistakes, setMistakes] = useState(0);
    const [shake, setShake] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (done) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setDone(true);
                    setResult("exploded");
                    setTimeout(() => onComplete(20), 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [done, onComplete]);

    const cutWire = useCallback((wireIdx) => {
        if (done || cutWires.has(wireIdx)) return;

        const expectedWire = puzzle.cutOrder[nextCutIdx];
        if (wireIdx === expectedWire) {
            const newCut = new Set(cutWires);
            newCut.add(wireIdx);
            setCutWires(newCut);
            setNextCutIdx(prev => prev + 1);

            if (newCut.size === puzzle.wireCount) {
                clearInterval(timerRef.current);
                setDone(true);
                setResult("defused");
                const score = Math.min(100, 50 + timeLeft + (mistakes === 0 ? 20 : 0));
                setTimeout(() => onComplete(score), 500);
            }
        } else {
            setMistakes(m => m + 1);
            setShake(true);
            setTimeout(() => setShake(false), 300);
            if (mistakes >= 2) {
                clearInterval(timerRef.current);
                setDone(true);
                setResult("exploded");
                setTimeout(() => onComplete(20), 500);
            }
        }
    }, [done, cutWires, nextCutIdx, puzzle, timeLeft, mistakes, onComplete]);

    return (
        <div style={{
            height: "100%", display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "12px", color: "white",
            animation: shake ? "shake 0.3s" : "none",
        }}>
            <style>{`@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }`}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>Time: <span style={{ color: timeLeft <= 10 ? "#FF6B6B" : "#FFD700", fontWeight: "bold" }}>{timeLeft}s</span></span>
                <span>Mistakes: <span style={{ color: "#FF6B6B" }}>{mistakes}/3</span></span>
                <span>Progress: <span style={{ color: "#64ffda" }}>{cutWires.size}/{puzzle.wireCount}</span></span>
            </div>

            {/* Bomb body */}
            <div style={{
                width: 280, padding: "20px", background: "#1a1a2e",
                borderRadius: "16px", border: `3px solid ${timeLeft <= 5 ? "#FF6B6B" : "rgba(255,255,255,0.1)"}`,
                display: "flex", flexDirection: "column", gap: "10px",
            }}>
                {/* Timer display */}
                <div style={{
                    textAlign: "center", fontSize: "32px", fontFamily: "monospace",
                    color: timeLeft <= 10 ? "#FF6B6B" : "#64ffda",
                    textShadow: timeLeft <= 5 ? "0 0 10px #FF6B6B" : "none",
                }}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                </div>

                {/* Wires */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {puzzle.colors.map((color, idx) => {
                        const isCut = cutWires.has(idx);
                        return (
                            <div
                                key={idx}
                                onClick={() => cutWire(idx)}
                                style={{
                                    height: 28, borderRadius: "14px",
                                    background: isCut ? "transparent" : `linear-gradient(90deg, ${color}, ${color}88)`,
                                    border: isCut ? `2px dashed ${color}44` : `2px solid ${color}`,
                                    cursor: isCut ? "default" : "pointer",
                                    opacity: isCut ? 0.3 : 1,
                                    transition: "all 0.2s",
                                    position: "relative",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                {isCut && <span style={{ fontSize: "12px", color: "#8892b0" }}>✂️ Cut</span>}
                                {!isCut && <span style={{ fontSize: "11px", fontWeight: "bold", color: "rgba(0,0,0,0.5)" }}>Click to cut</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Clues */}
            <div style={{
                padding: "10px 16px", background: "rgba(255,255,255,0.04)",
                borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                maxWidth: 280,
            }}>
                <div style={{ fontSize: "11px", color: "#8892b0", marginBottom: "6px" }}>📋 Cut order:</div>
                {puzzle.clues.sort((a, b) => a.order - b.order).map((clue) => (
                    <div key={clue.order} style={{
                        fontSize: "12px", padding: "2px 0",
                        color: cutWires.has(clue.wireIdx) ? "#64ffda" : "#fff",
                        textDecoration: cutWires.has(clue.wireIdx) ? "line-through" : "none",
                        opacity: cutWires.has(clue.wireIdx) ? 0.5 : 1,
                    }}>
                        <span style={{
                            display: "inline-block", width: 12, height: 12, borderRadius: "50%",
                            background: clue.color, marginRight: 6, verticalAlign: "middle",
                        }} />
                        {clue.hint}
                    </div>
                ))}
            </div>

            {done && (
                <div style={{
                    fontSize: "18px", fontWeight: "bold",
                    color: result === "defused" ? "#64ffda" : "#FF6B6B",
                }}>
                    {result === "defused" ? "💚 Defused!" : "💥 Boom!"}
                </div>
            )}
        </div>
    );
};

export default BombDefuse;
