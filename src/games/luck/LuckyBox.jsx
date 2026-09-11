/**
 * 🎮 Lucky Box — special items + multi-select + strategic swap + points
 */
import { useCallback, useState } from "react";

const ROUNDS = 8;
const ITEMS = [
    { emoji: "💎", name: "Diamond", points: 30, color: "#64ffda", tier: "legendary" },
    { emoji: "👑", name: "Crown", points: 25, color: "#FFD700", tier: "epic" },
    { emoji: "💰", name: "Gold coins", points: 15, color: "#FFA500", tier: "rare" },
    { emoji: "⭐", name: "Star", points: 10, color: "#A855F7", tier: "uncommon" },
    { emoji: "📦", name: "Empty box", points: 0, color: "#666", tier: "common" },
    { emoji: "💣", name: "Bomb", points: -10, color: "#FF6B6B", tier: "trap" },
];

const LuckyBox = ({ onComplete }) => {
    const [round, setRound] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [picked, setPicked] = useState(null);
    const [hovering, setHovering] = useState(null);
    const [shaking, setShaking] = useState(true);
    const [boxes, setBoxes] = useState(() => generateBoxes());
    const [swapsLeft, setSwapsLeft] = useState(2);
    const [history, setHistory] = useState([]);
    const [streak, setStreak] = useState(0);

    function generateBoxes() {
        // At least one good item, one trap possible
        const pool = [];
        const lucky = Math.random();
        if (lucky < 0.15) pool.push(ITEMS[0]); // Diamond 15%
        else if (lucky < 0.35) pool.push(ITEMS[1]); // Crown 20%
        else pool.push(ITEMS[2]); // Gold 65%

        pool.push(ITEMS[3 + Math.floor(Math.random() * 2)]); // Star or Empty
        pool.push(Math.random() < 0.3 ? ITEMS[5] : ITEMS[4]); // 30% Bomb, 70% Empty

        // Shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool;
    }

    const handlePick = useCallback((i) => {
        if (picked !== null) return;
        setPicked(i);
        setShaking(false);

        const item = boxes[i];
        const comboBonus = streak >= 3 ? 5 : 0;
        const points = item.points + comboBonus;
        setTotalPoints(p => Math.max(0, p + points));

        if (item.tier !== "common" && item.tier !== "trap") {
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }

        setHistory(h => [...h, item]);

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) {
                const finalPts = Math.max(0, totalPoints + points);
                onComplete(Math.min(100, Math.round(finalPts * 100 / 200)));
            } else {
                setRound(n);
                setPicked(null);
                setShaking(true);
                setBoxes(generateBoxes());
            }
        }, 1800);
    }, [round, totalPoints, picked, boxes, streak, onComplete]);

    const handleSwap = useCallback(() => {
        if (picked !== null || swapsLeft <= 0) return;
        setSwapsLeft(s => s - 1);
        setBoxes(generateBoxes());
    }, [picked, swapsLeft]);

    const boxColors = ["#EF4444", "#3B82F6", "#22C55E"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes boxShake { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-6deg); } 75% { transform: rotate(6deg); } }
                @keyframes boxOpen { 0% { transform: scale(1) rotateY(0); } 50% { transform: scale(1.3) rotateY(180deg); } 100% { transform: scale(1) rotateY(360deg); } }
                @keyframes sparkle { 0%,100% { box-shadow: 0 0 8px rgba(255,215,0,0.3); } 50% { box-shadow: 0 0 25px rgba(255,215,0,0.7); } }
                @keyframes floatUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes bombShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
                @keyframes legendaryGlow { 0%,100% { box-shadow: 0 0 20px rgba(100,255,218,0.5); } 50% { box-shadow: 0 0 40px rgba(100,255,218,0.8), 0 0 60px rgba(255,215,0,0.4); } }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                <span>Round <span style={{ color: "#FFD700", fontWeight: "bold" }}>{round + 1}/{ROUNDS}</span></span>
                <div style={{ padding: "2px 10px", borderRadius: "6px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}>
                    💰 <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px" }}>{totalPoints}</span>
                </div>
                {streak >= 2 && <span style={{ color: "#A855F7", fontWeight: "bold" }}>🔥 {streak}streak +5pt</span>}
            </div>

            {/* History */}
            <div style={{ display: "flex", gap: "4px" }}>
                {history.map((h, i) => (
                    <div key={i} style={{ fontSize: "14px", filter: h.tier === "trap" ? "grayscale(0.5)" : "none" }}>{h.emoji}</div>
                ))}
                {Array.from({ length: ROUNDS - history.length }).map((_, i) => (
                    <div key={`e${i}`} style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.06)" }} />
                ))}
            </div>

            <div style={{ fontSize: "13px", color: "#8892b0" }}>💎 Pick the box with treasure! ⚠️ Watch for 💣!</div>

            {/* Boxes */}
            <div style={{ display: "flex", gap: "16px" }}>
                {boxes.map((item, i) => {
                    const isOpened = picked !== null;
                    const isPicked = picked === i;
                    const isLegendary = isOpened && item.tier === "legendary";
                    const isEpic = isOpened && item.tier === "epic";
                    const isTrap = isOpened && item.tier === "trap";

                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                            <button onClick={() => handlePick(i)} disabled={isOpened}
                                onMouseEnter={() => setHovering(i)}
                                onMouseLeave={() => setHovering(null)}
                                style={{
                                    width: 85, height: 85, fontSize: "44px",
                                    borderRadius: "16px", cursor: isOpened ? "default" : "pointer",
                                    background: isOpened
                                        ? item.tier === "common" || item.tier === "trap"
                                            ? "rgba(80,80,80,0.2)"
                                            : `linear-gradient(135deg, ${item.color}33, ${item.color}11)`
                                        : `linear-gradient(135deg, ${boxColors[i]}33, ${boxColors[i]}11)`,
                                    border: isLegendary ? "3px solid #64ffda"
                                        : isEpic ? "3px solid #FFD700"
                                            : isTrap ? "3px solid #FF6B6B"
                                                : isPicked ? "3px solid #8892b0"
                                                    : `2px solid ${boxColors[i]}66`,
                                    animation: !isOpened && shaking
                                        ? `boxShake 0.5s ease-in-out ${i * 0.12}s infinite`
                                        : isLegendary ? "legendaryGlow 1s infinite"
                                            : isOpened && isPicked ? (isTrap ? "bombShake 0.4s ease" : "boxOpen 0.5s ease") : "none",
                                    transition: "all 0.3s ease",
                                    transform: hovering === i && !isOpened ? "scale(1.12)" : "scale(1)",
                                    boxShadow: hovering === i && !isOpened ? `0 0 20px ${boxColors[i]}44` : "none",
                                }}>
                                {isOpened ? item.emoji : "🎁"}
                            </button>
                            {isOpened && (
                                <div style={{
                                    fontSize: "11px", fontWeight: "bold",
                                    color: item.color,
                                    animation: "floatUp 0.4s ease",
                                }}>
                                    {item.name} {item.points > 0 ? `+${item.points}` : item.points < 0 ? item.points : ""}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Swap button */}
            {!picked && swapsLeft > 0 && (
                <button onClick={handleSwap} style={{
                    padding: "6px 16px", fontSize: "12px", fontWeight: "bold",
                    background: "rgba(168,85,247,0.15)", color: "#A855F7",
                    border: "1px solid rgba(168,85,247,0.3)", borderRadius: "8px", cursor: "pointer",
                }}>🔄 Swap box ({swapsLeft} left)</button>
            )}

            {picked !== null && (
                <div style={{
                    fontSize: "16px", fontWeight: "bold",
                    color: boxes[picked].tier === "trap" ? "#FF6B6B"
                        : boxes[picked].tier === "common" ? "#8892b0"
                            : boxes[picked].color,
                    animation: "floatUp 0.4s ease",
                }}>
                    {boxes[picked].tier === "legendary" ? "🎉 Legendary item!" :
                        boxes[picked].tier === "epic" ? "✨ Epic item!" :
                            boxes[picked].tier === "trap" ? "💥 Bomb! -10 pts" :
                                boxes[picked].tier === "rare" ? "💰 Good find!" :
                                    boxes[picked].tier === "uncommon" ? "⭐ Got a star!" : "📦 Empty box..."}
                </div>
            )}
        </div>
    );
};

export default LuckyBox;
