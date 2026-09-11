/**
 * 🎮 Game 90: Trade Sim — city map + trade routes
 */
import { useCallback, useState } from "react";

const CITIES = [
    { name: "Seoul", emoji: "🏯", x: 50, y: 20, buy: { Rice: 10, Silk: 30 }, sell: { Iron: 25, Porcelain: 20 } },
    { name: "Busan", emoji: "⛵", x: 80, y: 75, buy: { Iron: 8, Porcelain: 12 }, sell: { Rice: 18, Silk: 40 } },
    { name: "Jeju", emoji: "🌴", x: 30, y: 85, buy: { Porcelain: 10, Rice: 12 }, sell: { Silk: 35, Iron: 22 } },
];
const MAX_DAYS = 8;

const TradeSim = ({ onComplete }) => {
    const [gold, setGold] = useState(50);
    const [inv, setInv] = useState({});
    const [city, setCity] = useState(0);
    const [day, setDay] = useState(1);
    const [traveling, setTraveling] = useState(false);

    const buy = useCallback((item) => {
        const price = CITIES[city].buy[item];
        if (!price || gold < price) return;
        setGold((g) => g - price);
        setInv((v) => ({ ...v, [item]: (v[item] || 0) + 1 }));
    }, [city, gold]);

    const sell = useCallback((item) => {
        const price = CITIES[city].sell[item];
        if (!price || !inv[item]) return;
        setGold((g) => g + price);
        setInv((v) => ({ ...v, [item]: v[item] - 1 }));
    }, [city, inv]);

    const travel = useCallback((ci) => {
        setTraveling(true);
        setTimeout(() => {
            setCity(ci);
            setTraveling(false);
            const nd = day + 1;
            setDay(nd);
            if (nd > MAX_DAYS) {
                setTimeout(() => onComplete(Math.min(100, Math.round(gold * 1.2))), 300);
            }
        }, 600);
    }, [day, gold, onComplete]);

    const invItems = Object.entries(inv).filter(([, v]) => v > 0);
    const profit = gold - 50;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <style>{`@keyframes shipMove { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`}</style>

            <div style={{ fontSize: "13px" }}>
                📅 {day}/{MAX_DAYS} | 💰 <span style={{ color: "#FFD700" }}>{gold}G</span>
                <span style={{ color: profit >= 0 ? "#64ffda" : "#FF6B6B", marginLeft: 8, fontSize: "11px" }}>({profit >= 0 ? "+" : ""}{profit})</span>
            </div>

            {/* Map */}
            <div style={{
                width: 240, height: 120, position: "relative", borderRadius: "12px",
                background: "linear-gradient(135deg, #1a3a4a, #0a2a3a)",
                border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden",
            }}>
                {/* Water effect */}
                <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40%", background: "linear-gradient(0deg, rgba(59,130,246,0.15), transparent)" }} />

                {/* Trade routes */}
                <svg style={{ position: "absolute", width: "100%", height: "100%" }} viewBox="0 0 100 100">
                    <line x1={CITIES[0].x} y1={CITIES[0].y} x2={CITIES[1].x} y2={CITIES[1].y} stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1={CITIES[1].x} y1={CITIES[1].y} x2={CITIES[2].x} y2={CITIES[2].y} stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1={CITIES[0].x} y1={CITIES[0].y} x2={CITIES[2].x} y2={CITIES[2].y} stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" strokeDasharray="3,3" />
                </svg>

                {/* Cities */}
                {CITIES.map((c, i) => (
                    <div key={i} onClick={() => i !== city && !traveling && travel(i)}
                        style={{
                            position: "absolute", left: `${c.x}%`, top: `${c.y}%`,
                            transform: "translate(-50%,-50%)", textAlign: "center", cursor: i === city ? "default" : "pointer",
                            animation: i === city ? "shipMove 1.5s ease infinite" : "none",
                            transition: "all 0.3s ease",
                        }}>
                        <div style={{
                            fontSize: i === city ? "24px" : "18px",
                            filter: i === city ? "drop-shadow(0 0 8px rgba(255,215,0,0.6))" : "none",
                        }}>{c.emoji}</div>
                        <div style={{
                            fontSize: "9px", fontWeight: "bold",
                            color: i === city ? "#FFD700" : "#8892b0",
                            background: i === city ? "rgba(255,215,0,0.15)" : "transparent",
                            padding: "1px 4px", borderRadius: 4,
                        }}>{c.name}</div>
                    </div>
                ))}
            </div>

            {/* Inventory */}
            <div style={{ fontSize: "11px", color: "#8892b0" }}>
                🎒 {invItems.length > 0 ? invItems.map(([k, v]) => `${k}×${v}`).join("  ") : "Empty"}
            </div>

            {/* Trade panel */}
            <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#64ffda", marginBottom: 4 }}>📥 Buy</div>
                    {Object.entries(CITIES[city].buy).map(([item, price]) => (
                        <button key={item} onClick={() => buy(item)} disabled={gold < price}
                            style={{ ...tBtn, opacity: gold < price ? 0.4 : 1, borderColor: "rgba(100,255,218,0.3)" }}>
                            {item} <span style={{ color: "#FFD700" }}>{price}G</span>
                        </button>
                    ))}
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "11px", color: "#FFD700", marginBottom: 4 }}>📤 Sell</div>
                    {Object.entries(CITIES[city].sell).map(([item, price]) => (
                        <button key={item} onClick={() => sell(item)} disabled={!inv[item]}
                            style={{ ...tBtn, opacity: inv[item] ? 1 : 0.4, borderColor: "rgba(255,215,0,0.3)" }}>
                            {item} <span style={{ color: "#64ffda" }}>{price}G</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const tBtn = { display: "block", width: "100%", padding: "4px 10px", fontSize: "11px", marginBottom: 3, background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid", borderRadius: "6px", cursor: "pointer" };

export default TradeSim;
