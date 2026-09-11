/**
 * 🎮 Game 144: Energy Manager
 * Manage plants & buildings to power the city
 */
import { useState, useCallback } from "react";

const BUILDINGS = [
    { name: "Solar", emoji: "☀️", output: 3, cost: 5, color: "#FFD700" },
    { name: "Wind", emoji: "🌬️", output: 4, cost: 6, color: "#4D96FF" },
    { name: "Nuclear", emoji: "☢️", output: 10, cost: 15, color: "#22C55E" },
    { name: "Battery", emoji: "🔋", output: 2, cost: 3, color: "#A855F7" },
];

const EnergyManager = ({ onComplete }) => {
    const [budget, setBudget] = useState(25);
    const [plants, setPlants] = useState([]);
    const [demand] = useState(() => 15 + Math.floor(Math.random() * 10));
    const [done, setDone] = useState(false);
    const [lastBuilt, setLastBuilt] = useState(null);

    const build = useCallback((building) => {
        if (done || budget < building.cost) return;
        setPlants(prev => [...prev, building]);
        setBudget(b => b - building.cost);
        setLastBuilt(building.name);
        setTimeout(() => setLastBuilt(null), 500);
    }, [budget, done]);

    const removeLast = useCallback(() => {
        if (done || plants.length === 0) return;
        const removed = plants[plants.length - 1];
        setPlants(prev => prev.slice(0, -1));
        setBudget(b => b + removed.cost);
    }, [done, plants]);

    const evaluate = useCallback(() => {
        if (done) return;
        const supply = plants.reduce((s, p) => s + p.output, 0);
        setDone(true);
        let score;
        if (supply >= demand) {
            score = Math.min(100, 70 + budget * 2 + (supply === demand ? 20 : 0));
        } else {
            score = Math.max(20, Math.floor(supply / demand * 60));
        }
        setTimeout(() => onComplete(score), 500);
    }, [plants, demand, budget, done, onComplete]);

    const totalOutput = plants.reduce((s, p) => s + p.output, 0);
    const supplyRatio = Math.min(100, (totalOutput / demand) * 100);
    const surplus = totalOutput - demand;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes plantPop { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
                @keyframes surplusGlow { 0%,100%{text-shadow:0 0 10px rgba(100,255,218,0.3)} 50%{text-shadow:0 0 20px rgba(100,255,218,0.6)} }
                .build-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important; }
            `}</style>
            <div style={{ display: "flex", gap: "14px", fontSize: "13px", alignItems: "center" }}>
                <span>💰 <span style={{ color: "#FFD700", fontWeight: "bold" }}>{budget}</span></span>
                <span>⚡ Demand: <span style={{ color: "#FF6B6B", fontWeight: "bold" }}>{demand}kW</span></span>
                <span>Supply: <span style={{
                    color: totalOutput >= demand ? "#64ffda" : "#FFD93D", fontWeight: "bold",
                    animation: totalOutput >= demand ? "surplusGlow 1.5s infinite" : "none",
                }}>{totalOutput}kW</span></span>
            </div>
            {/* Supply gauge */}
            <div style={{ width: "260px", position: "relative" }}>
                <div style={{ height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "5px", overflow: "hidden" }}>
                    <div style={{
                        height: "100%", borderRadius: "5px",
                        width: `${supplyRatio}%`,
                        background: supplyRatio >= 100 ? "linear-gradient(90deg, #64ffda, #22C55E)" : supplyRatio >= 70 ? "linear-gradient(90deg, #FFD93D, #FF8C42)" : "linear-gradient(90deg, #FF6B6B, #EF4444)",
                        transition: "width 0.4s ease, background 0.4s ease",
                    }} />
                </div>
                {/* Demand marker */}
                <div style={{
                    position: "absolute", top: -4, left: "100%", transform: "translateX(-1px)",
                    width: "2px", height: "18px", background: "#FF6B6B",
                    boxShadow: "0 0 4px #FF6B6B",
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8892b0", marginTop: "2px" }}>
                    <span>0kW</span>
                    <span style={{ color: surplus >= 0 ? "#64ffda" : "#FF6B6B" }}>
                        {surplus >= 0 ? `+${surplus}kW surplus` : `${surplus}kW short`}
                    </span>
                    <span>{demand}kW</span>
                </div>
            </div>
            {/* Building buttons */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {BUILDINGS.map((b, i) => (
                    <button key={i} className="build-btn" onClick={() => build(b)} disabled={budget < b.cost || done}
                        style={{
                            padding: "10px 14px", borderRadius: "12px",
                            cursor: budget < b.cost || done ? "not-allowed" : "pointer",
                            background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`,
                            border: `1px solid ${b.color}44`, color: "white",
                            opacity: budget < b.cost || done ? 0.4 : 1,
                            textAlign: "center", transition: "all 0.2s",
                            boxShadow: `0 2px 8px ${b.color}22`,
                        }}>
                        <div style={{ fontSize: "24px" }}>{b.emoji}</div>
                        <div style={{ fontSize: "11px", fontWeight: "600" }}>{b.name}</div>
                        <div style={{ fontSize: "10px", color: "#64ffda" }}>+{b.output}kW</div>
                        <div style={{ fontSize: "10px", color: "#FFD700" }}>💰{b.cost}</div>
                    </button>
                ))}
            </div>
            {/* Built plants */}
            <div style={{
                padding: "10px 18px", minWidth: "240px", textAlign: "center",
                background: "rgba(100,255,218,0.03)", borderRadius: "12px",
                border: "1px dashed rgba(100,255,218,0.15)",
            }}>
                <div style={{ fontSize: "11px", color: "#64ffda", marginBottom: "4px" }}>🏗 Built plants</div>
                <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap", minHeight: "28px" }}>
                    {plants.map((p, i) => (
                        <span key={i} style={{
                            fontSize: "20px",
                            animation: lastBuilt === p.name && i === plants.length - 1 ? "plantPop 0.3s ease" : "none",
                            filter: `drop-shadow(0 0 4px ${p.color}66)`,
                        }}>{p.emoji}</span>
                    ))}
                    {plants.length === 0 && <span style={{ fontSize: "12px", color: "#8892b0" }}>Build a power plant</span>}
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                {plants.length > 0 && !done && (
                    <button onClick={removeLast} style={{
                        padding: "6px 14px", fontSize: "12px",
                        background: "rgba(255,107,107,0.1)", color: "#FF6B6B",
                        border: "1px solid rgba(255,107,107,0.3)", borderRadius: "8px",
                        cursor: "pointer",
                    }}>↩ Undo</button>
                )}
                {!done && (
                    <button onClick={evaluate} style={{
                        padding: "8px 22px", fontSize: "13px", fontWeight: "bold",
                        background: totalOutput >= demand
                            ? "linear-gradient(135deg, rgba(100,255,218,0.2), rgba(34,197,94,0.1))"
                            : "rgba(255,215,0,0.1)",
                        color: totalOutput >= demand ? "#64ffda" : "#FFD93D",
                        border: `1px solid ${totalOutput >= demand ? "#64ffda" : "#FFD93D"}`,
                        borderRadius: "10px", cursor: "pointer",
                        boxShadow: totalOutput >= demand ? "0 0 12px rgba(100,255,218,0.2)" : "none",
                    }}>
                        ⚡ Start grid
                    </button>
                )}
            </div>
            {done && <div style={{
                fontSize: "16px", fontWeight: "bold",
                color: totalOutput >= demand ? "#64ffda" : "#FF6B6B",
                textShadow: "0 0 15px currentColor",
            }}>
                {totalOutput >= demand
                    ? `⚡ Grid stable! (budget left: ${budget})${surplus === 0 ? " 🎯 Perfect!" : ""}`
                    : "⚠ Power shortage!"}
            </div>}
        </div>
    );
};

export default EnergyManager;
