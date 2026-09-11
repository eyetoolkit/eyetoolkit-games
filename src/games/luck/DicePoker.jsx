/**
 * 🎮 Game 136: 주사위 포커
 * 5개 주사위로 최고의 조합 만들기
 */
import { useState, useCallback } from "react";

const evalDice = (dice) => {
    const counts = {};
    dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
    const freq = Object.values(counts).sort((a, b) => b - a);
    const sorted = [...dice].sort((a, b) => a - b);
    const isStraight = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
    const isAllSame = freq[0] === 5;

    if (isAllSame) return { name: "야찌! (5개 동일)", score: 100, tier: 3 };
    if (freq[0] === 4) return { name: "포 카인드", score: 85, tier: 3 };
    if (freq[0] === 3 && freq[1] === 2) return { name: "풀 하우스", score: 75, tier: 2 };
    if (isStraight && dice.length === 5) return { name: "스트레이트", score: 70, tier: 2 };
    if (freq[0] === 3) return { name: "트리플", score: 55, tier: 1 };
    if (freq[0] === 2 && freq[1] === 2) return { name: "투 페어", score: 40, tier: 1 };
    if (freq[0] === 2) return { name: "원 페어", score: 25, tier: 0 };
    return { name: "찬스", score: Math.min(30, dice.reduce((s, d) => s + d, 0)), tier: 0 };
};

const DicePoker = ({ onComplete }) => {
    const rollAll = () => Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 6));
    const [dice, setDice] = useState(rollAll);
    const [held, setHeld] = useState(new Set());
    const [rollsLeft, setRollsLeft] = useState(2);
    const [done, setDone] = useState(false);
    const [rolling, setRolling] = useState(false);

    const toggleHold = useCallback((idx) => {
        if (done || rollsLeft <= 0) return;
        setHeld(prev => {
            const n = new Set(prev);
            n.has(idx) ? n.delete(idx) : n.add(idx);
            return n;
        });
    }, [done, rollsLeft]);

    const roll = useCallback(() => {
        if (done || rollsLeft <= 0 || rolling) return;
        setRolling(true);
        // Animate rapid changes
        let count = 0;
        const interval = setInterval(() => {
            setDice(prev => prev.map((d, i) => held.has(i) ? d : 1 + Math.floor(Math.random() * 6)));
            count++;
            if (count >= 8) {
                clearInterval(interval);
                setDice(prev => prev.map((d, i) => held.has(i) ? d : 1 + Math.floor(Math.random() * 6)));
                setRollsLeft(r => r - 1);
                setRolling(false);
            }
        }, 60);
    }, [done, rollsLeft, held, rolling]);

    const submit = useCallback(() => {
        if (done) return;
        setDone(true);
        const result = evalDice(dice);
        setTimeout(() => onComplete(result.score), 500);
    }, [done, dice, onComplete]);

    const result = evalDice(dice);
    const dieFaces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    const tierColors = ["#8892b0", "#FFD93D", "#FF8C42", "#64ffda"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes diceShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
                @keyframes tierGlow { 0%,100%{text-shadow:0 0 10px currentColor} 50%{text-shadow:0 0 25px currentColor} }
                .dice-cell:hover { transform: scale(1.08); }
            `}</style>
            <div style={{ fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
                남은 굴리기: {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: i < rollsLeft ? "#FFD700" : "rgba(255,255,255,0.1)",
                        boxShadow: i < rollsLeft ? "0 0 6px #FFD700" : "none",
                    }} />
                ))}
            </div>
            <div style={{
                display: "flex", gap: "10px",
                padding: "16px 20px", borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
                {dice.map((d, i) => (
                    <div key={i} className="dice-cell" onClick={() => toggleHold(i)} style={{
                        width: 58, height: 58, borderRadius: "12px", cursor: "pointer",
                        background: held.has(i)
                            ? "linear-gradient(145deg, rgba(100,255,218,0.12), rgba(100,255,218,0.05))"
                            : "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                        border: held.has(i) ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "36px", transition: "all 0.2s", position: "relative",
                        animation: rolling && !held.has(i) ? "diceShake 0.15s infinite" : "none",
                        boxShadow: held.has(i) ? "0 0 12px rgba(100,255,218,0.2)" : "0 2px 8px rgba(0,0,0,0.2)",
                    }}>
                        {dieFaces[d]}
                        {held.has(i) && <span style={{
                            position: "absolute", top: -10, fontSize: "9px", padding: "2px 7px",
                            background: "linear-gradient(135deg, #64ffda, #4D96FF)", color: "#000",
                            borderRadius: "10px", fontWeight: "bold", letterSpacing: "0.5px",
                        }}>HOLD</span>}
                    </div>
                ))}
            </div>
            <div style={{
                fontSize: "18px", fontWeight: "bold",
                color: tierColors[result.tier],
                animation: result.tier >= 2 ? "tierGlow 1.5s infinite" : "none",
                letterSpacing: "1px",
            }}>{result.name}</div>
            <div style={{ display: "flex", gap: "10px" }}>
                {rollsLeft > 0 && (
                    <button onClick={roll} disabled={rolling} style={{
                        padding: "10px 26px", fontSize: "15px", fontWeight: "bold",
                        background: rolling ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #4D96FF, #6BCB77)",
                        color: "white", border: "none", borderRadius: "14px",
                        cursor: rolling ? "not-allowed" : "pointer",
                        boxShadow: rolling ? "none" : "0 4px 14px rgba(77,150,255,0.3)",
                        transition: "all 0.2s",
                    }}>
                        🎲 굴리기 ({rollsLeft})
                    </button>
                )}
                <button onClick={submit} style={{
                    padding: "10px 26px", fontSize: "15px", fontWeight: "bold",
                    background: "rgba(255,217,61,0.1)", color: "#FFD93D",
                    border: "1px solid rgba(255,217,61,0.3)", borderRadius: "14px", cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(255,217,61,0.1)",
                    transition: "all 0.2s",
                }}>
                    ✓ 확정
                </button>
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>주사위 클릭 = HOLD, 나머지만 다시 굴리기</div>
            {done && <div style={{
                fontSize: "20px", color: "#64ffda", fontWeight: "bold",
                textShadow: "0 0 20px rgba(100,255,218,0.4)",
            }}>🎲 {result.name}! 점수: {result.score}</div>}
        </div>
    );
};

export default DicePoker;
