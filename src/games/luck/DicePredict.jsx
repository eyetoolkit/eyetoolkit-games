/**
 * 🎮 Dice Predict — chips bet + exact guesses + double-up + multi-dice
 */
import { useCallback, useState } from "react";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const DicePredict = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [chips, setChips] = useState(100);
    const [rolling, setRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(null);
    const [dice2Value, setDice2Value] = useState(null);
    const [rollDeg, setRollDeg] = useState({ x: 0, y: 0 });
    const [result, setResult] = useState(null);
    const [betType, setBetType] = useState(null);
    const [streak, setStreak] = useState(0);
    const [mode, setMode] = useState("single"); // single or double
    const [history, setHistory] = useState([]);
    const maxRounds = 8;

    const multiplier = streak >= 4 ? 3 : streak >= 2 ? 2 : 1;

    const placeBet = useCallback((type) => {
        if (rolling) return;
        setBetType(type);
        setRolling(true);

        const val = Math.floor(Math.random() * 6) + 1;
        const val2 = mode === "double" ? Math.floor(Math.random() * 6) + 1 : null;

        let step = 0;
        const totalSteps = 18;
        const anim = setInterval(() => {
            step++;
            setRollDeg({ x: Math.random() * 360, y: Math.random() * 360 });
            if (step >= totalSteps) {
                clearInterval(anim);
                setDiceValue(val);
                if (val2) setDice2Value(val2);
                setRollDeg({ x: 0, y: 0 });

                let isCorrect = false;
                let payout = 15;

                if (mode === "single") {
                    if (type === "high") { isCorrect = val >= 4; payout = 15; }
                    else if (type === "low") { isCorrect = val <= 3; payout = 15; }
                    else if (type === "odd") { isCorrect = val % 2 === 1; payout = 15; }
                    else if (type === "even") { isCorrect = val % 2 === 0; payout = 15; }
                    else if (type.startsWith("exact_")) {
                        const target = parseInt(type.split("_")[1]);
                        isCorrect = val === target;
                        payout = 50;
                    }
                } else {
                    const sum = val + val2;
                    if (type === "seven") { isCorrect = sum === 7; payout = 30; }
                    else if (type === "doubles") { isCorrect = val === val2; payout = 60; }
                    else if (type === "high") { isCorrect = sum >= 8; payout = 15; }
                    else if (type === "low") { isCorrect = sum <= 6; payout = 15; }
                }

                const comboBonus = Math.floor(payout * (multiplier - 1) * 0.5);
                const totalWin = payout + comboBonus;

                if (isCorrect) {
                    setChips(c => c + totalWin);
                    setStreak(s => s + 1);
                    setHistory(h => [...h, { win: true, amount: totalWin }]);
                } else {
                    setChips(c => Math.max(0, c - 10));
                    setStreak(0);
                    setHistory(h => [...h, { win: false, amount: 10 }]);
                }

                setResult(isCorrect ? "correct" : "wrong");
                setRolling(false);

                setTimeout(() => {
                    const nr = round + 1;
                    if (nr >= maxRounds || (!isCorrect && chips - 10 <= 0)) {
                        const finalChips = isCorrect ? chips + totalWin : Math.max(0, chips - 10);
                        onComplete(Math.min(100, Math.round(finalChips * 100 / 200)));
                    } else {
                        setRound(nr);
                        setDiceValue(null);
                        setDice2Value(null);
                        setResult(null);
                        setBetType(null);
                    }
                }, 1200);
            }
        }, 55);
    }, [rolling, round, chips, mode, multiplier, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes diceRoll { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)} }
                @keyframes chipPop { 0%{transform:scale(1.3)} 100%{transform:scale(1)} }
                @keyframes exactWin { 0%{transform:scale(0.5) rotate(-180deg);opacity:0} 100%{transform:scale(1) rotate(0);opacity:1} }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                <div style={{ padding: "3px 10px", borderRadius: "8px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}>
                    💰 <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px", animation: result ? "chipPop 0.3s" : "none" }}>{chips}</span>
                </div>
                <span style={{ color: "#FFD700" }}>{round + 1}/{maxRounds}</span>
                {streak >= 2 && <span style={{ color: streak >= 4 ? "#FF6B6B" : "#A855F7", fontWeight: "bold" }}>🔥 {streak}streak x{multiplier}</span>}
            </div>

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: "6px" }}>
                {["single", "double"].map(m => (
                    <button key={m} onClick={() => { if (!rolling && !result) setMode(m); }}
                        style={{
                            padding: "4px 14px", fontSize: "11px", fontWeight: mode === m ? "bold" : "normal",
                            background: mode === m ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                            color: mode === m ? "#A855F7" : "#8892b0",
                            border: mode === m ? "1px solid #A855F7" : "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px", cursor: "pointer",
                        }}>{m === "single" ? "🎲 Single" : "🎲🎲 Double"}</button>
                ))}
            </div>

            {/* History dots */}
            <div style={{ display: "flex", gap: "3px" }}>
                {history.map((h, i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: h.win ? "#64ffda" : "#FF6B6B", boxShadow: h.win ? "0 0 4px #64ffda" : "none" }} />
                ))}
            </div>

            {/* Dice */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{
                    width: 85, height: 85, borderRadius: "16px",
                    background: "linear-gradient(145deg, #fff, #f0f0f0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: diceValue ? "48px" : "38px",
                    transform: rolling ? `rotateX(${rollDeg.x}deg) rotateY(${rollDeg.y}deg)` : "none",
                    transition: rolling ? "none" : "transform 0.3s",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)",
                    border: "2px solid rgba(0,0,0,0.1)",
                    animation: rolling ? "diceRoll 0.12s infinite" : "none",
                }}>{rolling ? "🎲" : diceValue ? DICE_FACES[diceValue - 1] : "🎲"}</div>

                {mode === "double" && (
                    <>
                        <span style={{ fontSize: "20px", color: "#8892b0" }}>+</span>
                        <div style={{
                            width: 85, height: 85, borderRadius: "16px",
                            background: "linear-gradient(145deg, #fff, #f0f0f0)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: dice2Value ? "48px" : "38px",
                            transform: rolling ? `rotateX(${rollDeg.y}deg) rotateY(${rollDeg.x}deg)` : "none",
                            transition: rolling ? "none" : "transform 0.3s",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                            border: "2px solid rgba(0,0,0,0.1)",
                            animation: rolling ? "diceRoll 0.15s infinite" : "none",
                        }}>{rolling ? "🎲" : dice2Value ? DICE_FACES[dice2Value - 1] : "🎲"}</div>
                    </>
                )}
            </div>

            {diceValue && (
                <div style={{ fontSize: "13px", color: "#8892b0" }}>
                    {mode === "double" && dice2Value
                        ? `${diceValue} + ${dice2Value} = ${diceValue + dice2Value}`
                        : `${diceValue} → ${diceValue >= 4 ? "HIGH" : "LOW"} / ${diceValue % 2 === 0 ? "Even" : "Odd"}`}
                </div>
            )}

            {result && (
                <div style={{
                    fontSize: "18px", fontWeight: "bold",
                    color: result === "correct" ? "#64ffda" : "#FF6B6B",
                    animation: result === "correct" && betType?.startsWith("exact") ? "exactWin 0.4s ease" : "none",
                }}>
                    {result === "correct"
                        ? `✅ ${betType?.startsWith("exact") ? "🎯 Bullseye!" : betType === "doubles" ? "🎯 DOUBLES!" : "Correct!"}`
                        : "❌ So close!"}
                </div>
            )}

            {!rolling && !result && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                    {mode === "single" ? (
                        <>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => placeBet("high")} style={btnStyle("#EF4444")}>🔺 HIGH (4-6) <small>x1.5</small></button>
                                <button onClick={() => placeBet("low")} style={btnStyle("#3B82F6")}>🔻 LOW (1-3) <small>x1.5</small></button>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => placeBet("odd")} style={btnStyle("#A855F7")}>Odd <small>x1.5</small></button>
                                <button onClick={() => placeBet("even")} style={btnStyle("#22C55E")}>Even <small>x1.5</small></button>
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <button key={n} onClick={() => placeBet(`exact_${n}`)} style={{
                                        width: 36, height: 36, fontSize: "18px",
                                        background: "rgba(255,215,0,0.1)", color: "white",
                                        border: "1px solid rgba(255,215,0,0.3)", borderRadius: "8px", cursor: "pointer",
                                    }}>{DICE_FACES[n - 1]}</button>
                                ))}
                                <span style={{ fontSize: "10px", color: "#FFD700", alignSelf: "center", marginLeft: "4px" }}>x5!</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => placeBet("high")} style={btnStyle("#EF4444")}>Sum ≥8 <small>x1.5</small></button>
                                <button onClick={() => placeBet("low")} style={btnStyle("#3B82F6")}>Sum ≤6 <small>x1.5</small></button>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => placeBet("seven")} style={btnStyle("#FFD700")}>🎯 Sum = 7 <small>x3</small></button>
                                <button onClick={() => placeBet("doubles")} style={btnStyle("#A855F7")}>🎲 Doubles <small>x6!</small></button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const btnStyle = (color) => ({
    padding: "8px 14px", fontSize: "12px", fontWeight: "bold",
    background: `${color}22`, color: "white",
    border: `2px solid ${color}`, borderRadius: "10px", cursor: "pointer",
    minWidth: "90px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px",
});

export default DicePredict;
