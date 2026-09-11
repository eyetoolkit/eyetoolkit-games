/**
 * 🎮 Lucky Seven — dice combo + bonus round + jackpot + multi-dice
 */
import { useState, useCallback } from "react";

const LuckySeven = ({ onComplete }) => {
    const [dice1, setDice1] = useState(null);
    const [dice2, setDice2] = useState(null);
    const [dice3, setDice3] = useState(null);
    const [round, setRound] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [done, setDone] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [streak, setStreak] = useState(0);
    const [bonusRound, setBonusRound] = useState(false);
    const [jackpotHit, setJackpotHit] = useState(false);
    const [history, setHistory] = useState([]);
    const [mode, setMode] = useState("two"); // "two" or "three"
    const maxRounds = 7;
    const dieFaces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    const roll = useCallback(() => {
        if (done || rolling) return;
        setRolling(true);
        setLastResult(null);
        setJackpotHit(false);

        const interval = setInterval(() => {
            setDice1(1 + Math.floor(Math.random() * 6));
            setDice2(1 + Math.floor(Math.random() * 6));
            if (mode === "three") setDice3(1 + Math.floor(Math.random() * 6));
        }, 70);

        setTimeout(() => {
            clearInterval(interval);
            const d1 = 1 + Math.floor(Math.random() * 6);
            const d2 = 1 + Math.floor(Math.random() * 6);
            const d3 = mode === "three" ? 1 + Math.floor(Math.random() * 6) : null;
            setDice1(d1); setDice2(d2);
            if (d3) setDice3(d3);
            setRolling(false);

            const target = mode === "three" ? 10 : 7;
            const sum = d1 + d2 + (d3 || 0);
            const diff = Math.abs(sum - target);

            // Triple/Double check
            const isTriple = mode === "three" && d1 === d2 && d2 === d3;
            const isDouble = d1 === d2 || (d3 && (d1 === d3 || d2 === d3));

            let pts;
            let label;
            if (isTriple) {
                pts = 50; label = "JACKPOT!"; setJackpotHit(true);
            } else if (diff === 0) {
                pts = 35; label = mode === "three" ? "🎯 LUCKY TEN!" : "🎯 LUCKY SEVEN!";
            } else if (diff === 1) {
                pts = 20; label = "👏 Near!";
            } else if (diff === 2) {
                pts = 12; label = "😊 Close";
            } else if (isDouble) {
                pts = 15; label = "🎲 Double!";
            } else {
                pts = 5; label = "";
            }

            // Streak bonus
            const hitTarget = diff <= 1;
            if (hitTarget) {
                const newStreak = streak + 1;
                setStreak(newStreak);
                if (newStreak >= 3) pts += 10;
            } else {
                setStreak(0);
            }

            // Bonus round (hit target → bonus)
            if (diff === 0 && !bonusRound && round >= 3) {
                setBonusRound(true);
                pts += 15;
            }

            setLastResult({ sum, pts, perfect: diff === 0, label, isTriple, isDouble });
            setHistory(h => [...h, { sum, pts, target: diff === 0 }]);

            const newTotal = totalScore + pts;
            setTotalScore(newTotal);
            const newRound = round + 1;
            setRound(newRound);

            if (newRound >= maxRounds) {
                setDone(true);
                setTimeout(() => onComplete(Math.min(100, Math.max(20, Math.round(newTotal * 100 / 200)))), 800);
            }
        }, 900);
    }, [done, rolling, totalScore, round, mode, streak, bonusRound, onComplete]);

    const target = mode === "three" ? 10 : 7;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes diceRoll { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-12deg)} 75%{transform:rotate(12deg)} }
                @keyframes luckyFlash { 0%{box-shadow:0 0 20px rgba(100,255,218,0.6)} 50%{box-shadow:0 0 50px rgba(255,215,0,0.9)} 100%{box-shadow:0 0 20px rgba(100,255,218,0.6)} }
                @keyframes jackpotExplode { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.5);opacity:1} 100%{transform:scale(1);opacity:1} }
                @keyframes scorePopIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
                @keyframes sevenGlow { 0%,100%{text-shadow:0 0 10px #64ffda} 50%{text-shadow:0 0 30px #64ffda,0 0 50px #FFD700} }
                @keyframes tripleRainbow { 0%{color:#FF6B6B} 25%{color:#FFD700} 50%{color:#64ffda} 75%{color:#A855F7} 100%{color:#FF6B6B} }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                    {Array.from({ length: maxRounds }, (_, i) => (
                        <div key={i} style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: i < round ? (history[i]?.target ? "#64ffda" : "#8892b0") : "rgba(255,255,255,0.08)",
                            boxShadow: i < round && history[i]?.target ? "0 0 6px #64ffda" : "none",
                        }} />
                    ))}
                </div>
                <div style={{ padding: "2px 10px", borderRadius: "6px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}>
                    💰 <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px" }}>{totalScore}</span>
                </div>
                {streak >= 2 && <span style={{ color: "#A855F7", fontWeight: "bold" }}>🔥 {streak}Streak! +10pt</span>}
                {bonusRound && <span style={{ color: "#FFD700", fontSize: "10px" }}>⭐ Bonus!</span>}
            </div>

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: "6px" }}>
                {["two", "three"].map(m => (
                    <button key={m} onClick={() => { if (!rolling && !lastResult) setMode(m); }}
                        style={{
                            padding: "3px 12px", fontSize: "11px", fontWeight: mode === m ? "bold" : "normal",
                            background: mode === m ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)",
                            color: mode === m ? "#A855F7" : "#8892b0",
                            border: mode === m ? "1px solid #A855F7" : "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px", cursor: "pointer",
                        }}>{m === "two" ? "🎲🎲 2 hits (target 7)" : "🎲🎲🎲 3 hits (target 10)"}</button>
                ))}
            </div>

            {/* Target */}
            <div style={{ fontSize: "12px", color: "#8892b0", display: "flex", alignItems: "center", gap: "4px" }}>
                Target sum:
                <span style={{
                    fontSize: "20px", fontWeight: "bold", color: "#64ffda",
                    animation: lastResult?.perfect ? "sevenGlow 1s infinite" : "none",
                }}>{target}</span>
            </div>

            {/* Dice area */}
            <div style={{
                display: "flex", gap: "14px", alignItems: "center",
                padding: "14px 20px", borderRadius: "18px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: jackpotHit ? "0 0 40px rgba(255,215,0,0.6)" : "0 8px 32px rgba(0,0,0,0.2)",
                animation: lastResult?.perfect ? "luckyFlash 0.5s ease" : jackpotHit ? "jackpotExplode 0.5s ease" : "none",
            }}>
                {[dice1, dice2, ...(mode === "three" ? [dice3] : [])].map((d, i) => (
                    <div key={i}>
                        {i > 0 && <span style={{ fontSize: "20px", color: "#8892b0", fontWeight: "bold", marginRight: "14px" }}>+</span>}
                        <div style={{
                            width: 68, height: 68, borderRadius: "14px",
                            background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                            border: lastResult?.isTriple ? "2px solid #FFD700" : "2px solid rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "40px", transition: "all 0.2s",
                            animation: rolling ? "diceRoll 0.12s infinite" : "none",
                            boxShadow: lastResult?.isTriple ? "0 0 20px rgba(255,215,0,0.5)" : "0 4px 12px rgba(0,0,0,0.2)",
                        }}>{d ? dieFaces[d] : "?"}</div>
                    </div>
                ))}
            </div>

            {lastResult && !rolling && (
                <div style={{ textAlign: "center", animation: jackpotHit ? "jackpotExplode 0.5s ease" : "scorePopIn 0.3s ease" }}>
                    <div style={{
                        fontSize: jackpotHit ? "32px" : "24px", fontWeight: "bold",
                        color: jackpotHit ? "#FFD700" : lastResult.perfect ? "#64ffda" : Math.abs(lastResult.sum - target) <= 1 ? "#FFD700" : "#8892b0",
                        animation: jackpotHit ? "tripleRainbow 1s infinite" : "none",
                    }}>
                        = {lastResult.sum} {lastResult.label}
                    </div>
                    <div style={{ fontSize: "13px", color: "#8892b0" }}>+{lastResult.pts} pts</div>
                </div>
            )}

            {!done && (
                <button onClick={roll} disabled={rolling} style={{
                    padding: "12px 32px", fontSize: "16px", fontWeight: "bold",
                    background: rolling ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FFD700, #FF6B6B)",
                    color: rolling ? "#666" : "#000", border: "none", borderRadius: "14px",
                    cursor: rolling ? "not-allowed" : "pointer",
                    boxShadow: rolling ? "none" : "0 4px 16px rgba(255,215,0,0.3)",
                    transition: "all 0.3s",
                }}>
                    {rolling ? "🎲 Rolling..." : "🎲 Roll!"}
                </button>
            )}

            {done && (
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#64ffda", textShadow: "0 0 20px rgba(100,255,218,0.4)" }}>
                        🏆 Total: {totalScore}
                    </div>
                    <div style={{ fontSize: "11px", color: "#8892b0" }}>
                        🎯 Hits: {history.filter(h => h.target).length}x | Best streak: {streak}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LuckySeven;
