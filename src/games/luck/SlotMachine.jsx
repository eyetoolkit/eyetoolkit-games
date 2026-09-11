/**
 * 🎮 Game 78: Slot Machine
 * reel scroll + win effects + paylines
 */
import { useCallback, useState } from "react";

const SYMS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];
const MAX_SPINS = 5;

const SlotMachine = ({ onComplete }) => {
    const [reels, setReels] = useState(["❓", "❓", "❓"]);
    const [spinning, setSpinning] = useState([false, false, false]);
    const [scrollReels, setScrollReels] = useState([[], [], []]);
    const [spins, setSpins] = useState(0);
    const [total, setTotal] = useState(0);
    const [lastWin, setLastWin] = useState(null);
    const [jackpot, setJackpot] = useState(false);

    const spin = useCallback(() => {
        if (spins >= MAX_SPINS || spinning.some(Boolean)) return;

        const finalSymbols = Array.from({ length: 3 }, () =>
            SYMS[Math.floor(Math.random() * SYMS.length)]
        );

        // Generate scroll sequences for each reel
        const scrolls = [0, 1, 2].map((reelIdx) => {
            const count = 12 + reelIdx * 4; // Staggered stops
            return Array.from({ length: count }, (_, i) =>
                i === count - 1 ? finalSymbols[reelIdx] : SYMS[Math.floor(Math.random() * SYMS.length)]
            );
        });

        setScrollReels(scrolls);
        setSpinning([true, true, true]);
        setLastWin(null);
        setJackpot(false);

        // Animate each reel with staggered stops
        [0, 1, 2].forEach((reelIdx) => {
            let step = 0;
            const total = scrolls[reelIdx].length;
            const interval = setInterval(() => {
                step++;
                setReels(r => {
                    const nr = [...r];
                    nr[reelIdx] = scrolls[reelIdx][Math.min(step, total - 1)];
                    return nr;
                });
                if (step >= total) {
                    clearInterval(interval);
                    setSpinning(s => {
                        const ns = [...s];
                        ns[reelIdx] = false;
                        // Check if all stopped
                        if (ns.every(x => !x)) {
                            // Calculate win
                            let pts = 0;
                            const f = finalSymbols;
                            if (f[0] === f[1] && f[1] === f[2]) {
                                pts = f[0] === "7️⃣" ? 200 : f[0] === "💎" ? 150 : 100;
                                setJackpot(true);
                            } else if (f[0] === f[1] || f[1] === f[2] || f[0] === f[2]) {
                                pts = 40;
                            }
                            setTotal(t => t + pts);
                            setLastWin(pts > 0 ? pts : null);
                            const ns2 = spins + 1;
                            setSpins(ns2);
                            if (ns2 >= MAX_SPINS) {
                                setTimeout(() => onComplete(Math.min(100, Math.round((total + pts) / MAX_SPINS))), 1500);
                            }
                        }
                        return ns;
                    });
                }
            }, 60 + reelIdx * 10);
        });
    }, [spins, spinning, total, onComplete]);

    const isWin = reels[0] !== "❓" && !spinning.some(Boolean) && (
        (reels[0] === reels[1] && reels[1] === reels[2]) ||
        (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2])
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Spins: {spins}/{MAX_SPINS} | Score: <span style={{ color: "#FFD700" }}>{total}</span>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: MAX_SPINS }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < spins ? "#FFD700" : "rgba(255,255,255,0.1)" }} />
                ))}
            </div>

            {/* Slot Machine Body */}
            <div style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderRadius: "20px",
                border: "3px solid #FFD700",
                boxShadow: jackpot
                    ? "0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)"
                    : "0 8px 20px rgba(0,0,0,0.3)",
                transition: "box-shadow 0.3s",
            }}>
                {/* Top label */}
                <div style={{
                    textAlign: "center", fontSize: "12px", fontWeight: "bold", color: "#FFD700",
                    marginBottom: "10px", letterSpacing: "4px",
                }}>
                    ⭐ JELLY SLOTS ⭐
                </div>

                {/* Reels */}
                <div style={{
                    display: "flex", gap: "8px",
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "12px",
                    border: isWin ? "2px solid #FFD700" : "2px solid rgba(255,255,255,0.1)",
                }}>
                    {reels.map((sym, i) => (
                        <div key={i} style={{
                            width: 56, height: 64,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "36px",
                            background: spinning[i]
                                ? "rgba(255,255,255,0.05)"
                                : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            transform: spinning[i] ? "scale(0.95)" : "scale(1)",
                            transition: "transform 0.1s",
                        }}>
                            {sym}
                        </div>
                    ))}
                </div>

                {/* Pay line indicator */}
                <div style={{
                    height: "2px", margin: "6px 0",
                    background: isWin
                        ? "linear-gradient(90deg, transparent, #FFD700, transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                }} />

                {/* Win indicator */}
                {lastWin && (
                    <div style={{
                        textAlign: "center", fontSize: jackpot ? "18px" : "14px",
                        fontWeight: "bold", color: "#FFD700",
                        animation: jackpot ? "pulse 0.5s infinite" : "none",
                    }}>
                        {jackpot ? "🎉 JACKPOT! " : "🎊 "} +{lastWin}
                    </div>
                )}
            </div>

            {/* Lever */}
            {spins < MAX_SPINS && !spinning.some(Boolean) && (
                <button onClick={spin} style={{
                    padding: "14px 36px", fontSize: "16px", fontWeight: "bold",
                    background: "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(239,68,68,0.2))",
                    color: "white", border: "3px solid #EF4444",
                    borderRadius: "14px", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                }}>
                    🎰 SPIN!
                </button>
            )}

            {spinning.some(Boolean) && (
                <div style={{ fontSize: "14px", color: "#FFD700" }}>🎰 Spinning...</div>
            )}
        </div>
    );
};

export default SlotMachine;
