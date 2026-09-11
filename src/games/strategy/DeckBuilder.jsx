/**
 * 🎮 Game 88: deck builder — card visuals + HP bars + damage effects
 */
import { useCallback, useState } from "react";

const CARDS = [
    { name: "Sword", emoji: "⚔️", atk: 3, def: 0, color: "#EF4444" },
    { name: "Shield", emoji: "🛡️", atk: 0, def: 4, color: "#3B82F6" },
    { name: "Flame", emoji: "🔥", atk: 5, def: 0, color: "#F97316" },
    { name: "Heal", emoji: "💚", atk: 0, def: 3, color: "#22C55E" },
    { name: "Lightning", emoji: "⚡", atk: 4, def: 1, color: "#A855F7" },
    { name: "Poison", emoji: "☠️", atk: 3, def: 1, color: "#6B21A8" },
];
const randomCard = () => CARDS[Math.floor(Math.random() * CARDS.length)];
const MAX_ROUNDS = 5;

const DeckBuilder = ({ onComplete }) => {
    const [hand, setHand] = useState(() => Array.from({ length: 4 }, randomCard));
    const [round, setRound] = useState(1);
    const [pHP, setPHP] = useState(25);
    const [eHP, setEHP] = useState(25);
    const [lastPlay, setLastPlay] = useState(null);
    const [shakeEnemy, setShakeEnemy] = useState(false);
    const [shakePlayer, setShakePlayer] = useState(false);

    const playCard = useCallback((idx) => {
        if (lastPlay) return;
        const card = hand[idx];
        const eDmg = Math.floor(Math.random() * 4) + 2;
        const actualDmg = Math.max(0, eDmg - card.def);

        setLastPlay({ card, eDmg, actualDmg });
        setShakeEnemy(true);
        setTimeout(() => setShakeEnemy(false), 300);
        setTimeout(() => { setShakePlayer(true); setTimeout(() => setShakePlayer(false), 300); }, 400);

        setEHP((h) => Math.max(0, h - card.atk));
        setPHP((h) => Math.max(0, h - actualDmg));

        const nh = [...hand];
        nh[idx] = randomCard();
        setHand(nh);

        setTimeout(() => {
            const newEHP = Math.max(0, eHP - card.atk);
            const newPHP = Math.max(0, pHP - actualDmg);
            const nr = round + 1;
            setRound(nr);
            setLastPlay(null);

            if (newEHP <= 0 || newPHP <= 0 || nr > MAX_ROUNDS) {
                const score = newEHP <= 0 ? 100 : Math.max(10, Math.round((newPHP / 25) * 80));
                setTimeout(() => onComplete(score), 300);
            }
        }, 1200);
    }, [hand, round, pHP, eHP, lastPlay, onComplete]);

    const hpBar = (hp, max, color, label) => (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <span>{label}</span>
                <span style={{ color }}>{hp}/{max}</span>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                    width: `${(hp / max) * 100}%`, height: "100%",
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    borderRadius: 5, transition: "width 0.4s ease",
                }} />
            </div>
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes cardShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
                @keyframes dmgFloat { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-30px); } }
            `}</style>

            <div style={{ fontSize: "13px" }}>Round <span style={{ color: "#FFD700" }}>{round}/{MAX_ROUNDS}</span></div>

            {/* Battle arena */}
            <div style={{ width: 260, display: "flex", flexDirection: "column", gap: "6px" }}>
                {/* Enemy */}
                <div style={{
                    padding: "8px 12px", borderRadius: "12px",
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    animation: shakeEnemy ? "cardShake 0.3s ease" : "none",
                    position: "relative",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "28px" }}>🤖</span>
                        <div style={{ flex: 1 }}>{hpBar(eHP, 25, "#EF4444", "Enemy")}</div>
                    </div>
                    {lastPlay && <div style={{ position: "absolute", right: 12, top: -10, fontSize: "14px", color: "#EF4444", fontWeight: "bold", animation: "dmgFloat 1s ease forwards" }}>-{lastPlay.card.atk}</div>}
                </div>

                {/* VS */}
                <div style={{ textAlign: "center", fontSize: "13px", color: "#FFD700" }}>⚔️</div>

                {/* Player */}
                <div style={{
                    padding: "8px 12px", borderRadius: "12px",
                    background: "rgba(100,255,218,0.08)", border: "1px solid rgba(100,255,218,0.2)",
                    animation: shakePlayer ? "cardShake 0.3s ease" : "none",
                    position: "relative",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "28px" }}>🧑</span>
                        <div style={{ flex: 1 }}>{hpBar(pHP, 25, "#64ffda", "Me")}</div>
                    </div>
                    {lastPlay && <div style={{ position: "absolute", right: 12, top: -10, fontSize: "14px", color: "#FF6B6B", fontWeight: "bold", animation: "dmgFloat 1s ease 0.4s forwards" }}>-{lastPlay.actualDmg}</div>}
                </div>
            </div>

            {/* Hand */}
            <div style={{ display: "flex", gap: "8px" }}>
                {hand.map((c, i) => (
                    <button key={i} onClick={() => playCard(i)} disabled={!!lastPlay}
                        style={{
                            width: 60, height: 80, borderRadius: "12px", cursor: lastPlay ? "wait" : "pointer",
                            background: `linear-gradient(135deg, ${c.color}22, ${c.color}08)`,
                            border: `2px solid ${c.color}55`,
                            color: "white", display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: "2px",
                            transition: "all 0.2s ease",
                            boxShadow: `0 4px 12px ${c.color}22`,
                        }}
                        onMouseEnter={(e) => { if (!lastPlay) { e.currentTarget.style.transform = "translateY(-8px) scale(1.05)"; e.currentTarget.style.boxShadow = `0 8px 20px ${c.color}33`; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 12px ${c.color}22`; }}>
                        <div style={{ fontSize: "22px" }}>{c.emoji}</div>
                        <div style={{ fontSize: "9px", fontWeight: "bold" }}>{c.name}</div>
                        <div style={{ fontSize: "9px", color: "#8892b0" }}>⚔{c.atk} 🛡{c.def}</div>
                    </button>
                ))}
            </div>

            {lastPlay && (
                <div style={{ fontSize: "12px", color: "#8892b0" }}>
                    {lastPlay.card.emoji} {lastPlay.card.name} → {lastPlay.card.atk}dmg to enemy | attack {lastPlay.eDmg} - defense {lastPlay.card.def} = {lastPlay.actualDmg}dmg
                </div>
            )}
        </div>
    );
};

export default DeckBuilder;
