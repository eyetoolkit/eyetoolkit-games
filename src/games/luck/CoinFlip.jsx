/**
 * 🎮 동전 뒤집기 — 칩 베팅 + 더블오어낫싱 + 콤보 멀티플라이어
 */
import { useCallback, useState } from "react";

const CoinFlip = ({ onComplete }) => {
    const [chips, setChips] = useState(100);
    const [bet, setBet] = useState(10);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [result, setResult] = useState(null);
    const [flipping, setFlipping] = useState(false);
    const [flipDeg, setFlipDeg] = useState(0);
    const [history, setHistory] = useState([]);
    const [totalRounds, setTotalRounds] = useState(0);

    const multiplier = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;

    const handleGuess = useCallback((guess) => {
        if (flipping) return;
        setFlipping(true);

        const coin = Math.random() > 0.5 ? "앞" : "뒤";
        const isCorrect = guess === coin;

        let deg = 0;
        const totalFlips = 8 + Math.floor(Math.random() * 6);
        const finalIsHeads = coin === "앞";
        const targetDeg = totalFlips * 180 + (finalIsHeads ? 0 : 180);

        const anim = setInterval(() => {
            deg += 30;
            setFlipDeg(deg);
            if (deg >= targetDeg) {
                clearInterval(anim);
                setFlipDeg(targetDeg);
                setResult({ coin, correct: isCorrect });

                if (isCorrect) {
                    const winAmount = Math.round(bet * multiplier);
                    setChips(c => c + winAmount);
                    setCombo(c => { const nc = c + 1; if (nc > maxCombo) setMaxCombo(nc); return nc; });
                    setHistory(h => [...h, { win: true, amount: winAmount }]);
                } else {
                    setChips(c => Math.max(0, c - bet));
                    setCombo(0);
                    setHistory(h => [...h, { win: false, amount: bet }]);
                }

                setTotalRounds(r => r + 1);

                setTimeout(() => {
                    const newTotal = totalRounds + 1;
                    // End at 10 rounds or bankrupt
                    if (newTotal >= 10 || (!isCorrect && chips - bet <= 0)) {
                        const finalChips = isCorrect ? chips + Math.round(bet * multiplier) : Math.max(0, chips - bet);
                        onComplete(Math.min(100, Math.round(finalChips * 100 / 200)));
                    } else {
                        setResult(null);
                        setFlipping(false);
                        setFlipDeg(0);
                    }
                }, 1200);
            }
        }, 40);
    }, [flipping, bet, multiplier, chips, totalRounds, maxCombo, onComplete]);

    const showingHeads = Math.round(flipDeg / 180) % 2 === 0;
    const comboColor = combo >= 5 ? "#FF6B6B" : combo >= 3 ? "#A855F7" : "#FFD700";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes chipBounce { 0%{transform:scale(1.3)} 100%{transform:scale(1)} }
                @keyframes fireGlow { 0%,100%{text-shadow:0 0 10px #FF6B6B} 50%{text-shadow:0 0 30px #FFD700,0 0 50px #FF6B6B} }
                @keyframes rainCoins { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(60px)} }
            `}</style>

            {/* Stats bar */}
            <div style={{ display: "flex", gap: "16px", fontSize: "12px", alignItems: "center" }}>
                <div style={{ padding: "4px 12px", background: "rgba(255,215,0,0.15)", borderRadius: "8px", border: "1px solid rgba(255,215,0,0.3)" }}>
                    💰 <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px" }}>{chips}</span> 칩
                </div>
                <div>라운드 <span style={{ color: "#64ffda" }}>{totalRounds + 1}/10</span></div>
                {combo >= 2 && (
                    <div style={{ color: comboColor, fontWeight: "bold", animation: combo >= 5 ? "fireGlow 0.8s infinite" : "none" }}>
                        🔥 {combo}콤보 (x{multiplier})
                    </div>
                )}
            </div>

            {/* Combo progress */}
            <div style={{ display: "flex", gap: "3px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                        width: 24, height: 5, borderRadius: 3,
                        background: combo >= i ? (i <= 2 ? "#FFD700" : i <= 4 ? "#A855F7" : "#FF6B6B") : "rgba(255,255,255,0.08)",
                        transition: "background 0.3s",
                    }} />
                ))}
                <span style={{ fontSize: "10px", color: "#8892b0", marginLeft: "4px" }}>
                    {combo < 3 ? "" : combo < 5 ? "x2!" : "x3!!"}
                </span>
            </div>

            {/* Coin */}
            <div style={{ width: 110, height: 110, perspective: "400px", margin: "6px 0" }}>
                <div style={{
                    width: 110, height: 110, borderRadius: "50%",
                    transform: `rotateX(${flipDeg}deg)`,
                    transformStyle: "preserve-3d",
                    transition: flipping ? "none" : "transform 0.3s",
                    position: "relative",
                }}>
                    <div style={{
                        position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "44px",
                        boxShadow: "0 4px 20px rgba(255,215,0,0.4), inset 0 2px 6px rgba(255,255,255,0.4)",
                        border: "3px solid #DAA520",
                    }}>
                        {showingHeads ? "👑" : ""}
                    </div>
                    <div style={{
                        position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                        backfaceVisibility: "hidden",
                        transform: "rotateX(180deg)",
                        background: "linear-gradient(135deg, #C0C0C0, #808080)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "44px",
                        boxShadow: "0 4px 20px rgba(192,192,192,0.4), inset 0 2px 4px rgba(255,255,255,0.2)",
                        border: "3px solid #999",
                    }}>
                        {!showingHeads ? "🌟" : ""}
                    </div>
                </div>
            </div>

            {result && (
                <div style={{
                    textAlign: "center", animation: "chipBounce 0.3s ease",
                }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: result.correct ? "#64ffda" : "#FF6B6B" }}>
                        {result.coin}면! {result.correct ? `✅ +${Math.round(bet * multiplier)} 칩!` : `❌ -${bet} 칩`}
                    </div>
                </div>
            )}

            {/* Bet controls */}
            {!flipping && !result && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#8892b0" }}>베팅:</span>
                        {[10, 25, 50].map(b => (
                            <button key={b} onClick={() => setBet(Math.min(b, chips))}
                                style={{
                                    padding: "5px 14px", fontSize: "13px", fontWeight: bet === b ? "bold" : "normal",
                                    background: bet === b ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.05)",
                                    color: bet === b ? "#FFD700" : "#8892b0",
                                    border: bet === b ? "2px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px", cursor: "pointer",
                                }}>{b}</button>
                        ))}
                        <button onClick={() => setBet(chips)}
                            style={{
                                padding: "5px 14px", fontSize: "12px", fontWeight: "bold",
                                background: bet === chips ? "rgba(255,107,107,0.2)" : "rgba(255,107,107,0.05)",
                                color: "#FF6B6B",
                                border: "1px solid rgba(255,107,107,0.3)",
                                borderRadius: "8px", cursor: "pointer",
                            }}>ALL IN 🔥</button>
                    </div>
                    <div style={{ display: "flex", gap: "14px" }}>
                        <button onClick={() => handleGuess("앞")} style={{
                            padding: "14px 28px", fontSize: "16px", fontWeight: "bold",
                            background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1))",
                            color: "white", border: "2px solid #FFD700", borderRadius: "14px", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(255,215,0,0.15)",
                            transition: "all 0.2s",
                        }}>👑 앞면</button>
                        <button onClick={() => handleGuess("뒤")} style={{
                            padding: "14px 28px", fontSize: "16px", fontWeight: "bold",
                            background: "linear-gradient(135deg, rgba(192,192,192,0.2), rgba(128,128,128,0.1))",
                            color: "white", border: "2px solid #AAA", borderRadius: "14px", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(192,192,192,0.15)",
                            transition: "all 0.2s",
                        }}>🌟 뒷면</button>
                    </div>
                </div>
            )}

            {flipping && !result && (
                <div style={{ fontSize: "14px", color: "#FFD700" }}>🪙 회전 중...</div>
            )}

            {/* History */}
            {history.length > 0 && (
                <div style={{ display: "flex", gap: "3px", marginTop: "4px" }}>
                    {history.slice(-8).map((h, i) => (
                        <div key={i} style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: h.win ? "#64ffda" : "#FF6B6B",
                            boxShadow: h.win ? "0 0 4px #64ffda" : "0 0 4px #FF6B6B",
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoinFlip;
