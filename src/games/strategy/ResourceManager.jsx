/**
 * 🎮 Game 82: Resource Manager — resource bars + building icons
 */
import { useCallback, useState } from "react";

const BUILDINGS = [
    { name: "🏠 House", cost: { "🪵": 3, "🪨": 2 }, produces: "🍞", prodRate: 2 },
    { name: "⛏️ Mine", cost: { "🪵": 2 }, produces: "🪨", prodRate: 3 },
    { name: "🪓 Lumberyard", cost: { "🪨": 2 }, produces: "🪵", prodRate: 3 },
    { name: "🌾 Farm", cost: { "🪵": 2, "🪨": 1 }, produces: "🍞", prodRate: 3 },
];
const MAX_DAYS = 12;

const ResourceManager = ({ onComplete }) => {
    const [day, setDay] = useState(1);
    const [res, setRes] = useState({ "🪵": 5, "🪨": 5, "🍞": 10 });
    const [built, setBuilt] = useState([]);
    const [pop, setPop] = useState(3);
    const [log, setLog] = useState("");

    const canBuild = (b) => Object.entries(b.cost).every(([k, v]) => (res[k] || 0) >= v);

    const build = useCallback((b) => {
        if (!canBuild(b)) return;
        setRes((r) => { const n = { ...r }; Object.entries(b.cost).forEach(([k, v]) => { n[k] -= v; }); return n; });
        setBuilt((arr) => [...arr, b]);
        setLog(`Built ${b.name}!`);
    }, [res]);

    const nextDay = useCallback(() => {
        setRes((r) => {
            const n = { ...r };
            built.forEach((b) => { n[b.produces] = (n[b.produces] || 0) + b.prodRate; });
            n["🍞"] -= pop; // Consume food
            return n;
        });
        const nd = day + 1;
        setDay(nd);
        setLog("");
        if (res["🍞"] - pop < 0) {
            setPop((p) => Math.max(1, p - 1));
            setLog("⚠️ Food shortage! Population dropping");
        }
        if (nd > MAX_DAYS) {
            const score = Math.min(100, built.length * 12 + pop * 8 + Object.values(res).reduce((a, b) => a + b, 0));
            setTimeout(() => onComplete(score), 500);
        }
    }, [day, built, res, pop, onComplete]);

    const maxRes = 30;
    const barColor = { "🪵": "#8B6914", "🪨": "#6B7280", "🍞": "#D97706" };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>📅 Day {day}/{MAX_DAYS} | 👥 pop {pop}</div>

            {/* Resource bars */}
            <div style={{ width: 260, display: "flex", flexDirection: "column", gap: "4px" }}>
                {Object.entries(res).map(([emoji, amount]) => (
                    <div key={emoji} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                        <span style={{ width: 20 }}>{emoji}</span>
                        <div style={{ flex: 1, height: 14, background: "rgba(255,255,255,0.08)", borderRadius: 7, overflow: "hidden", position: "relative" }}>
                            <div style={{
                                width: `${Math.max(0, Math.min(100, (amount / maxRes) * 100))}%`, height: "100%",
                                background: `linear-gradient(90deg, ${barColor[emoji] || "#64ffda"}, ${barColor[emoji] || "#64ffda"}aa)`,
                                borderRadius: 7, transition: "width 0.4s ease",
                            }} />
                            <span style={{ position: "absolute", right: 4, top: 0, fontSize: "10px", lineHeight: "14px" }}>{amount}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Built buildings */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", minHeight: 30 }}>
                {built.map((b, i) => (
                    <div key={i} style={{
                        padding: "2px 8px", fontSize: "12px", borderRadius: "8px",
                        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    }}>{b.name.slice(0, 2)} → {b.produces}+{b.prodRate}</div>
                ))}
                {built.length === 0 && <div style={{ fontSize: "11px", color: "#8892b0" }}>Build some structures!</div>}
            </div>

            {/* Build buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: 260 }}>
                {BUILDINGS.map((b, i) => (
                    <button key={i} onClick={() => build(b)} disabled={!canBuild(b)}
                        style={{
                            padding: "8px", fontSize: "11px", textAlign: "left",
                            background: canBuild(b) ? "rgba(100,255,218,0.08)" : "rgba(100,100,100,0.1)",
                            border: canBuild(b) ? "1px solid rgba(100,255,218,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "10px", cursor: canBuild(b) ? "pointer" : "not-allowed",
                            color: "white", opacity: canBuild(b) ? 1 : 0.5,
                        }}>
                        <div style={{ fontWeight: "bold" }}>{b.name}</div>
                        <div style={{ fontSize: "10px", color: "#8892b0" }}>
                            Cost: {Object.entries(b.cost).map(([k, v]) => `${k}${v}`).join(" ")} → {b.produces}+{b.prodRate}/day
                        </div>
                    </button>
                ))}
            </div>

            {log && <div style={{ fontSize: "12px", color: "#FFD700" }}>{log}</div>}

            <button onClick={nextDay} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: "rgba(255,215,0,0.15)", color: "white",
                border: "2px solid #FFD700", borderRadius: "12px", cursor: "pointer",
            }}>⏭️ Next day</button>
        </div>
    );
};

export default ResourceManager;
