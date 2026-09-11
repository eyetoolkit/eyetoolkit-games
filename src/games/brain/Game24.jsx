/**
 * 🎮 Game 46: 24 게임 — 카드 비주얼 + 수식 디스플레이 + 진행 도트
 */
import { useCallback, useState } from "react";

const findSolution = (nums) => {
    const ops = ["+", "-", "*", "/"];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) {
        const [a, b, c, d] = nums;
        const calc = (x, op, y) => op === "+" ? x + y : op === "-" ? x - y : op === "*" ? x * y : y !== 0 ? x / y : NaN;
        const r1 = calc(calc(calc(a, ops[i], b), ops[j], c), ops[k], d);
        if (Math.abs(r1 - 24) < 0.001) return `((${a} ${ops[i]} ${b}) ${ops[j]} ${c}) ${ops[k]} ${d}`;
    }
    return null;
};

const genPuzzle = () => { let nums; do { nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1); } while (!findSolution(nums)); return nums; };

const ROUNDS = 5;

const Game24 = ({ onComplete }) => {
    const [nums, setNums] = useState(() => genPuzzle());
    const [selected, setSelected] = useState([]);
    const [ops, setOps] = useState([]);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const reset = useCallback(() => { setSelected([]); setOps([]); setShowHint(false); setFeedback(null); }, []);
    const handleNum = useCallback((idx) => { if (!selected.includes(idx)) setSelected((s) => [...s, idx]); }, [selected]);
    const handleOp = useCallback((op) => { setOps((o) => [...o, op]); }, []);

    const evaluate = useCallback(() => {
        if (selected.length !== 4 || ops.length !== 3) return null;
        const calc = (a, op, b) => op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : b !== 0 ? a / b : NaN;
        let result = nums[selected[0]];
        for (let i = 0; i < 3; i++) result = calc(result, ops[i], nums[selected[i + 1]]);
        return result;
    }, [selected, ops, nums]);

    const handleCheck = useCallback(() => {
        const result = evaluate();
        if (result !== null && Math.abs(result - 24) < 0.001) {
            setFeedback("correct");
            const nc = correct + 1;
            setCorrect(nc);
            setTimeout(() => {
                if (round + 1 >= ROUNDS) { onComplete(Math.round((nc / ROUNDS) * 100)); }
                else { setRound(round + 1); setNums(genPuzzle()); reset(); }
            }, 600);
        } else { setFeedback("wrong"); setTimeout(() => reset(), 500); }
    }, [evaluate, round, correct, reset, onComplete]);

    const skip = useCallback(() => {
        if (round + 1 >= ROUNDS) { onComplete(Math.round((correct / ROUNDS) * 100)); }
        else { setRound(round + 1); setNums(genPuzzle()); reset(); }
    }, [round, correct, reset, onComplete]);

    const result = evaluate();

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes correctPop { 0% { transform: scale(1.15); } 100% { transform: scale(1); } }
                @keyframes wrongShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>
                라운드: <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 정답: <span style={{ color: "#64ffda" }}>{correct}</span>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: ROUNDS }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < round ? "#64ffda" : i === round ? "#FFD700" : "rgba(255,255,255,0.1)" }} />
                ))}
            </div>

            <div style={{ fontSize: "11px", color: "#8892b0" }}>4개 숫자로 24를 만드세요!</div>

            {/* Number cards */}
            <div style={{ display: "flex", gap: "8px" }}>
                {nums.map((n, i) => (
                    <button key={i} onClick={() => handleNum(i)} disabled={selected.includes(i)}
                        style={{
                            width: 52, height: 64, fontSize: "22px", fontWeight: "bold",
                            borderRadius: "12px",
                            background: selected.includes(i) ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.06)",
                            color: selected.includes(i) ? "#64ffda" : "white",
                            border: `2px solid ${selected.includes(i) ? "#64ffda" : "rgba(255,255,255,0.12)"}`,
                            cursor: selected.includes(i) ? "default" : "pointer",
                            boxShadow: selected.includes(i) ? "0 0 10px rgba(100,255,218,0.15)" : "0 2px 8px rgba(0,0,0,0.2)",
                            transition: "all 0.15s",
                        }}
                    >{n}</button>
                ))}
            </div>

            {/* Operator buttons */}
            <div style={{ display: "flex", gap: "6px" }}>
                {["+", "-", "×", "÷"].map((op) => (
                    <button key={op} onClick={() => handleOp(op)}
                        style={{
                            width: 40, height: 40, fontSize: "18px",
                            background: "rgba(255,255,255,0.06)", color: "#FFD700",
                            border: "1px solid rgba(255,215,0,0.2)", borderRadius: "10px", cursor: "pointer",
                        }}
                    >{op}</button>
                ))}
            </div>

            {/* Expression display */}
            {selected.length > 0 && (
                <div style={{
                    fontSize: "15px", padding: "6px 14px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    animation: feedback === "correct" ? "correctPop 0.3s ease" : feedback === "wrong" ? "wrongShake 0.3s ease" : "none",
                    color: feedback === "correct" ? "#64ffda" : feedback === "wrong" ? "#FF6B6B" : "#8892b0",
                }}>
                    {selected.map((s, i) => `${nums[s]}${ops[i] || ""}`).join(" ")}
                    {result !== null && ` = ${Math.round(result * 100) / 100}`}
                    {feedback === "correct" && " ✅"}
                    {feedback === "wrong" && " ❌"}
                </div>
            )}

            <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={reset} style={aBtn}>🔄</button>
                <button onClick={handleCheck} disabled={selected.length !== 4 || ops.length !== 3}
                    style={{ ...aBtn, opacity: selected.length === 4 && ops.length === 3 ? 1 : 0.3 }}>✅ 확인</button>
                <button onClick={() => setShowHint(true)} style={aBtn}>💡</button>
                <button onClick={skip} style={aBtn}>⏭️</button>
            </div>
            {showHint && <div style={{ fontSize: "11px", color: "#FFD700" }}>{findSolution(nums)}</div>}
        </div>
    );
};

const aBtn = { padding: "7px 12px", fontSize: "12px", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", cursor: "pointer" };

export default Game24;
