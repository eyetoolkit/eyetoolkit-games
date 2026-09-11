/**
 * 🎮 Game 142: Merchant Sim
 * Buy low, sell high for profit
 */
import { useState, useCallback } from "react";

const GOODS = [
    { name: "Rice", emoji: "🍚", basePrice: 10 },
    { name: "Fish", emoji: "🐟", basePrice: 15 },
    { name: "Gems", emoji: "💎", basePrice: 50 },
    { name: "Cloth", emoji: "🧶", basePrice: 20 },
    { name: "Spices", emoji: "🌶️", basePrice: 30 },
];

const MerchantSim = ({ onComplete }) => {
    const [gold, setGold] = useState(100);
    const [inventory, setInventory] = useState({});
    const [day, setDay] = useState(1);
    const [prices, setPrices] = useState(() => GOODS.map(g => ({ ...g, price: g.basePrice + Math.floor(Math.random() * 10 - 5) })));
    const [done, setDone] = useState(false);
    const [lastAction, setLastAction] = useState(null);
    const maxDays = 5;

    const buy = useCallback((name, price) => {
        if (done || gold < price) return;
        setGold(g => g - price);
        setInventory(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
        setLastAction({ type: "buy", name, price });
        setTimeout(() => setLastAction(null), 600);
    }, [gold, done]);

    const sell = useCallback((name, price) => {
        if (done || !inventory[name]) return;
        setGold(g => g + price);
        setInventory(prev => {
            const n = { ...prev };
            n[name]--;
            if (n[name] <= 0) delete n[name];
            return n;
        });
        setLastAction({ type: "sell", name, price });
        setTimeout(() => setLastAction(null), 600);
    }, [inventory, done]);

    const nextDay = useCallback(() => {
        if (done) return;
        const newDay = day + 1;
        if (newDay > maxDays) {
            setDone(true);
            const totalValue = gold + Object.entries(inventory).reduce((s, [name, qty]) => {
                const good = GOODS.find(g => g.name === name);
                return s + (good ? good.basePrice * qty : 0);
            }, 0);
            const profit = totalValue - 100;
            const score = Math.min(100, Math.max(20, 50 + profit));
            setTimeout(() => onComplete(score), 500);
            return;
        }
        setDay(newDay);
        setPrices(GOODS.map(g => ({ ...g, price: Math.max(5, g.basePrice + Math.floor(Math.random() * 20 - 10)) })));
    }, [day, gold, inventory, done, onComplete]);

    const profit = gold - 100 + Object.entries(inventory).reduce((s, [name, qty]) => {
        const good = GOODS.find(g => g.name === name);
        return s + (good ? good.basePrice * qty : 0);
    }, 0);
    const progress = (day / maxDays) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes goldPop { from{transform:scale(1.3);opacity:0.5} to{transform:scale(1);opacity:1} }
                @keyframes actionFloat { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
                .trade-card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important; }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>📅 Day <span style={{ color: "#FFD700", fontWeight: "bold" }}>{day}/{maxDays}</span></span>
                <span style={{ animation: lastAction ? "goldPop 0.3s ease" : "none" }}>💰 <span style={{ color: "#FFD700", fontWeight: "bold" }}>{gold}G</span></span>
                <span style={{ color: profit >= 0 ? "#64ffda" : "#FF6B6B", fontSize: "12px" }}>
                    {profit >= 0 ? "▲" : "▼"}{Math.abs(profit)}G
                </span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FFD700, #FF8C42)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center",
                padding: "8px", borderRadius: "14px",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            }}>
                {prices.map((g, i) => {
                    const diff = g.price - g.basePrice;
                    const qty = inventory[g.name] || 0;
                    return (
                        <div key={i} className="trade-card" style={{
                            padding: "10px 12px",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                            borderRadius: "12px",
                            border: diff < -3 ? "1px solid rgba(100,255,218,0.3)" : diff > 3 ? "1px solid rgba(255,107,107,0.3)" : "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center", width: "82px",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            position: "relative",
                        }}>
                            <div style={{ fontSize: "22px" }}>{g.emoji}</div>
                            <div style={{ fontSize: "12px", fontWeight: "600" }}>{g.name}</div>
                            <div style={{
                                fontSize: "14px", fontWeight: "bold",
                                color: diff > 3 ? "#FF6B6B" : diff < -3 ? "#64ffda" : "#fff",
                            }}>
                                {g.price}G {diff > 0 ? "↑" : diff < 0 ? "↓" : ""}
                            </div>
                            {qty > 0 && <div style={{
                                position: "absolute", top: -6, right: -6,
                                width: 20, height: 20, borderRadius: "50%",
                                background: "#FFD700", color: "#000",
                                fontSize: "11px", fontWeight: "bold",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{qty}</div>}
                            <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                                <button onClick={() => buy(g.name, g.price)} disabled={gold < g.price}
                                    style={{
                                        flex: 1, padding: "4px", fontSize: "10px", fontWeight: "bold",
                                        background: diff < -3 ? "rgba(100,255,218,0.2)" : "rgba(100,255,218,0.1)",
                                        color: "#64ffda", border: "1px solid rgba(100,255,218,0.3)",
                                        borderRadius: "6px", cursor: gold < g.price ? "not-allowed" : "pointer",
                                        opacity: gold < g.price ? 0.4 : 1,
                                    }}>Buy</button>
                                <button onClick={() => sell(g.name, g.price)} disabled={!qty}
                                    style={{
                                        flex: 1, padding: "4px", fontSize: "10px", fontWeight: "bold",
                                        background: diff > 3 ? "rgba(255,107,107,0.2)" : "rgba(255,107,107,0.1)",
                                        color: "#FF6B6B", border: "1px solid rgba(255,107,107,0.3)",
                                        borderRadius: "6px", cursor: !qty ? "not-allowed" : "pointer",
                                        opacity: !qty ? 0.4 : 1,
                                    }}>Sell</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {lastAction && <div style={{
                fontSize: "14px", fontWeight: "bold",
                color: lastAction.type === "buy" ? "#64ffda" : "#FFD700",
                animation: "actionFloat 0.6s ease forwards",
            }}>
                {lastAction.type === "buy" ? `📥 Bought ${lastAction.name} -${lastAction.price}G` : `📤 Sold ${lastAction.name} +${lastAction.price}G`}
            </div>}
            {!done && (
                <button onClick={nextDay} style={{
                    padding: "8px 22px", fontSize: "13px", fontWeight: "bold",
                    background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))",
                    color: "#FFD93D", border: "1px solid rgba(255,215,0,0.3)", borderRadius: "10px",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(255,215,0,0.1)",
                }}>
                    {day < maxDays ? "🌅 Next day →" : "📊 Daily report"}
                </button>
            )}
            {done && (
                <div style={{
                    textAlign: "center", fontSize: "16px", fontWeight: "bold",
                    color: profit >= 0 ? "#64ffda" : "#FF6B6B",
                    textShadow: "0 0 15px currentColor",
                }}>
                    💰 Final: {gold}G | {profit >= 0 ? "+" : ""}{profit}G
                </div>
            )}
        </div>
    );
};

export default MerchantSim;
