/**
 * 🎮 Game 84: 농장 경영 — 격자 농장 + 작물 성장 이모지
 */
import { useCallback, useState } from "react";

const CROPS = [
    { name: "🌱 밀", emoji: "🌾", cost: 3, sellPrice: 8, growTime: 2, stages: ["🌱", "🌿", "🌾"] },
    { name: "🥕 당근", emoji: "🥕", cost: 5, sellPrice: 12, growTime: 3, stages: ["🌱", "🌿", "🥕"] },
    { name: "🍅 토마토", emoji: "🍅", cost: 8, sellPrice: 18, growTime: 4, stages: ["🌱", "🌿", "🌸", "🍅"] },
];
const GRID = 9;
const MAX_DAYS = 10;

const FarmManager = ({ onComplete }) => {
    const [farm, setFarm] = useState(Array(GRID).fill(null));
    const [gold, setGold] = useState(30);
    const [day, setDay] = useState(1);
    const [selectedCrop, setSelectedCrop] = useState(0);
    const [log, setLog] = useState("작물을 심어보세요!");

    const plant = useCallback((idx) => {
        if (farm[idx]) return;
        const crop = CROPS[selectedCrop];
        if (gold < crop.cost) { setLog("💰 골드 부족!"); return; }
        setGold((g) => g - crop.cost);
        setFarm((f) => { const n = [...f]; n[idx] = { ...crop, age: 0 }; return n; });
        setLog(`${crop.name} 심기 완료!`);
    }, [farm, gold, selectedCrop]);

    const harvest = useCallback((idx) => {
        const crop = farm[idx];
        if (!crop || crop.age < crop.growTime) return;
        setGold((g) => g + crop.sellPrice);
        setFarm((f) => { const n = [...f]; n[idx] = null; return n; });
        setLog(`${crop.emoji} 수확! +${crop.sellPrice}G`);
    }, [farm]);

    const nextDay = useCallback(() => {
        setFarm((f) => f.map((c) => c ? { ...c, age: c.age + 1 } : null));
        const nd = day + 1;
        setDay(nd);
        setLog("");
        if (nd > MAX_DAYS) {
            let total = gold;
            farm.forEach((c) => { if (c && c.age >= c.growTime) total += c.sellPrice; });
            setTimeout(() => onComplete(Math.min(100, Math.round(total * 1.5))), 500);
        }
    }, [day, gold, farm, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>📅 Day {day}/{MAX_DAYS} | 💰 <span style={{ color: "#FFD700" }}>{gold}G</span></div>

            {/* Farm grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                {farm.map((cell, i) => {
                    const isReady = cell && cell.age >= cell.growTime;
                    const stageIdx = cell ? Math.min(cell.age, cell.stages.length - 1) : 0;
                    return (
                        <button key={i} onClick={() => cell ? (isReady ? harvest(i) : null) : plant(i)}
                            style={{
                                width: 56, height: 56, borderRadius: "10px", fontSize: "24px",
                                cursor: cell && !isReady ? "default" : "pointer",
                                background: cell
                                    ? (isReady ? "rgba(255,215,0,0.15)" : "rgba(34,197,94,0.08)")
                                    : "rgba(139,69,19,0.15)",
                                border: isReady
                                    ? "2px solid #FFD700"
                                    : cell ? "1px solid rgba(34,197,94,0.2)" : "1px dashed rgba(139,69,19,0.3)",
                                color: "white",
                                animation: isReady ? "rpsBounce 1s ease infinite" : "none",
                            }}>
                            {cell ? cell.stages[stageIdx] : ""}
                        </button>
                    );
                })}
            </div>

            {/* Crop selector */}
            <div style={{ display: "flex", gap: "6px" }}>
                {CROPS.map((c, i) => (
                    <button key={i} onClick={() => setSelectedCrop(i)}
                        style={{
                            padding: "6px 10px", fontSize: "11px", borderRadius: "8px",
                            background: selectedCrop === i ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                            border: selectedCrop === i ? "2px solid #22C55E" : "1px solid rgba(255,255,255,0.1)",
                            color: "white", cursor: "pointer",
                        }}>
                        {c.emoji} {c.cost}G →{c.sellPrice}G ({c.growTime}일)
                    </button>
                ))}
            </div>

            {log && <div style={{ fontSize: "12px", color: "#FFD700" }}>{log}</div>}

            <button onClick={nextDay} style={{
                padding: "8px 24px", fontSize: "13px", fontWeight: "bold",
                background: "rgba(255,215,0,0.15)", color: "white",
                border: "2px solid #FFD700", borderRadius: "12px", cursor: "pointer",
            }}>⏭️ 다음 날</button>

            <style>{`@keyframes rpsBounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }`}</style>
        </div>
    );
};

export default FarmManager;
