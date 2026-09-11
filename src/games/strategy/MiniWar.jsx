/**
 * 🎮 Game 141: Mini War
 * Deploy units to defeat the enemy
 */
import { useState, useCallback } from "react";

const UNITS = [
    { name: "Swordsman", emoji: "⚔️", attack: 3, defense: 2, cost: 2 },
    { name: "Archer", emoji: "🏹", attack: 4, defense: 1, cost: 3 },
    { name: "Knight", emoji: "🐴", attack: 5, defense: 3, cost: 4 },
    { name: "Shieldbearer", emoji: "🛡️", attack: 1, defense: 5, cost: 3 },
];

const MiniWar = ({ onComplete }) => {
    const [gold, setGold] = useState(10);
    const [army, setArmy] = useState([]);
    const [enemy] = useState(() => {
        const count = 2 + Math.floor(Math.random() * 3);
        return Array.from({ length: count }, () => UNITS[Math.floor(Math.random() * UNITS.length)]);
    });
    const [battleResult, setBattleResult] = useState(null);
    const [done, setDone] = useState(false);

    const recruit = useCallback((unit) => {
        if (done || gold < unit.cost) return;
        setArmy(prev => [...prev, unit]);
        setGold(g => g - unit.cost);
    }, [gold, done]);

    const battle = useCallback(() => {
        if (done || army.length === 0) return;
        const myPower = army.reduce((s, u) => s + u.attack + u.defense, 0);
        const enemyPower = enemy.reduce((s, u) => s + u.attack + u.defense, 0);
        const won = myPower >= enemyPower;
        setBattleResult({ won, myPower, enemyPower });
        setDone(true);
        const score = won ? Math.min(100, 60 + gold * 5 + (myPower - enemyPower) * 3) : Math.max(20, Math.floor(myPower / enemyPower * 50));
        setTimeout(() => onComplete(Math.min(100, Math.max(20, score))), 800);
    }, [army, enemy, gold, done, onComplete]);

    const myPower = army.reduce((s, u) => s + u.attack + u.defense, 0);
    const enemyPower = enemy.reduce((s, u) => s + u.attack + u.defense, 0);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes battleShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
                @keyframes goldBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
                @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
                .unit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important; }
            `}</style>
            {/* Header */}
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", alignItems: "center" }}>
                <span>💰 <span style={{ color: "#FFD700", fontWeight: "bold", animation: gold <= 3 ? "goldBounce 0.5s" : "none" }}>{gold}</span></span>
                <span>⚔ <span style={{ color: "#64ffda" }}>{myPower}</span> vs <span style={{ color: "#FF6B6B" }}>{enemyPower}</span></span>
            </div>
            {/* Power comparison bar */}
            <div style={{ width: "260px", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", display: "flex", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${myPower + enemyPower > 0 ? (myPower / (myPower + enemyPower)) * 100 : 50}%`, background: "linear-gradient(90deg, #64ffda, #4D96FF)", transition: "width 0.3s" }} />
                <div style={{ height: "100%", flex: 1, background: "linear-gradient(90deg, #FF6B6B, #9B59B6)" }} />
            </div>
            {/* Enemy */}
            <div style={{
                padding: "10px 18px", borderRadius: "14px",
                background: "rgba(255,107,107,0.06)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,107,107,0.15)",
                boxShadow: "0 4px 20px rgba(255,107,107,0.1)",
                animation: battleResult ? "battleShake 0.3s" : "none",
            }}>
                <div style={{ fontSize: "11px", color: "#FF6B6B", marginBottom: "6px", fontWeight: "bold", letterSpacing: "1px" }}>☠ Enemy army</div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {enemy.map((u, i) => (
                        <div key={i} style={{
                            textAlign: "center", padding: "6px 10px",
                            background: "rgba(255,107,107,0.08)", borderRadius: "10px",
                            border: "1px solid rgba(255,107,107,0.12)",
                        }}>
                            <div style={{ fontSize: "22px" }}>{u.emoji}</div>
                            <div style={{ fontSize: "9px", color: "#ccc" }}>⚔{u.attack} 🛡{u.defense}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Recruit */}
            <div style={{ display: "flex", gap: "8px" }}>
                {UNITS.map((u, i) => (
                    <button key={i} className="unit-btn" onClick={() => recruit(u)} disabled={gold < u.cost}
                        style={{
                            padding: "8px 12px", borderRadius: "12px", cursor: gold < u.cost ? "not-allowed" : "pointer",
                            background: gold < u.cost ? "rgba(255,255,255,0.02)" : "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                            border: "1px solid rgba(255,255,255,0.12)", color: "white",
                            opacity: gold < u.cost ? 0.35 : 1, fontSize: "12px", textAlign: "center",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}>
                        <div style={{ fontSize: "22px" }}>{u.emoji}</div>
                        <div style={{ fontWeight: "600" }}>{u.name}</div>
                        <div style={{ color: "#FFD700", fontSize: "10px", fontWeight: "bold" }}>💰{u.cost}</div>
                    </button>
                ))}
            </div>
            {/* My army */}
            <div style={{
                padding: "10px 18px", minHeight: "54px", minWidth: "260px", textAlign: "center",
                borderRadius: "14px",
                background: "rgba(100,255,218,0.04)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(100,255,218,0.15)",
                boxShadow: "0 4px 20px rgba(100,255,218,0.06)",
            }}>
                <div style={{ fontSize: "11px", color: "#64ffda", marginBottom: "6px", fontWeight: "bold", letterSpacing: "1px" }}>⚔ Your army</div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                    {army.map((u, i) => (
                        <span key={i} style={{ fontSize: "22px", animation: "fadeIn 0.3s ease" }}>{u.emoji}</span>
                    ))}
                    {army.length === 0 && <span style={{ fontSize: "12px", color: "#8892b0" }}>Pick your units</span>}
                </div>
            </div>
            {!done && army.length > 0 && (
                <button onClick={battle} style={{
                    padding: "12px 28px", fontSize: "15px", fontWeight: "bold",
                    background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                    color: "#000", border: "none", borderRadius: "14px", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(255,107,107,0.3)",
                    transition: "all 0.2s",
                }}>
                    ⚔ Battle!
                </button>
            )}
            {battleResult && (
                <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
                    <div style={{
                        fontSize: "22px", fontWeight: "bold",
                        color: battleResult.won ? "#64ffda" : "#FF6B6B",
                        textShadow: battleResult.won ? "0 0 25px rgba(100,255,218,0.4)" : "0 0 25px rgba(255,107,107,0.4)",
                    }}>
                        {battleResult.won ? "🏆 Victory!" : "💀 Defeat"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#8892b0", marginTop: "4px" }}>
                        Power: {battleResult.myPower} vs {battleResult.enemyPower}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniWar;
