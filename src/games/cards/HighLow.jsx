/**
 * 🎮 하이로우 — 연속 맞추기 보너스 + 멀티플라이어 + 머니 시스템
 */
import { useCallback, useState } from "react";

const genCard = () => Math.floor(Math.random() * 13) + 1;
const cardName = (n) => n === 1 ? "A" : n === 11 ? "J" : n === 12 ? "Q" : n === 13 ? "K" : `${n}`;
const SUITS = ["♠", "♥", "♦", "♣"];
const suitColor = (s) => s === "♥" || s === "♦" ? "#EF4444" : "#e0e0e0";

const HighLow = ({ onComplete }) => {
    const [card, setCard] = useState(genCard);
    const [cardSuit, setCardSuit] = useState(() => SUITS[Math.floor(Math.random() * 4)]);
    const [round, setRound] = useState(0);
    const [money, setMoney] = useState(100);
    const [nextCard, setNextCard] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [history, setHistory] = useState([]);
    const maxRounds = 10;

    const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
    const betAmount = 10 * multiplier;

    const handleGuess = useCallback((guess) => {
        if (feedback) return;
        const next = genCard();
        const nextSuitVal = SUITS[Math.floor(Math.random() * 4)];
        setNextCard({ value: next, suit: nextSuitVal });

        const isC = (guess === "high" && next >= card) || (guess === "low" && next <= card);

        if (isC) {
            const win = betAmount;
            setMoney(m => m + win);
            setStreak(s => {
                const ns = s + 1;
                if (ns > maxStreak) setMaxStreak(ns);
                return ns;
            });
            setHistory(h => [...h, { win: true, diff: next - card }]);
        } else {
            setMoney(m => Math.max(0, m - 15));
            setStreak(0);
            setHistory(h => [...h, { win: false, diff: next - card }]);
        }
        setFeedback(isC ? "correct" : "wrong");

        setTimeout(() => {
            const n = round + 1;
            if (n >= maxRounds) {
                const finalMoney = isC ? money + betAmount : Math.max(0, money - 15);
                onComplete(Math.min(100, Math.round(finalMoney * 100 / 200)));
            }
            else {
                setRound(n);
                setCard(next);
                setCardSuit(nextSuitVal);
                setNextCard(null);
                setFeedback(null);
            }
        }, 1200);
    }, [card, round, money, feedback, streak, maxStreak, betAmount, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes cardSlideIn { 0% { transform: translateX(80px) rotateY(90deg); opacity: 0; } 100% { transform: translateX(0) rotateY(0); opacity: 1; } }
                @keyframes cardPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                @keyframes streakFire { 0%,100% { text-shadow: 0 0 10px #FF6B6B; } 50% { text-shadow: 0 0 25px #FFD700, 0 0 40px #FF6B6B; } }
                @keyframes moneyPop { 0% { transform: scale(1.3); } 100% { transform: scale(1); } }
            `}</style>

            {/* HUD */}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", alignItems: "center" }}>
                <div style={{ padding: "3px 10px", borderRadius: "8px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)" }}>
                    💰 <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "16px", animation: feedback ? "moneyPop 0.3s ease" : "none" }}>{money}</span>
                </div>
                <span style={{ color: "#FFD700" }}>{round + 1}/{maxRounds}</span>
                {streak >= 2 && <span style={{
                    color: streak >= 5 ? "#FF6B6B" : streak >= 3 ? "#A855F7" : "#FFD700",
                    fontWeight: "bold",
                    animation: streak >= 5 ? "streakFire 0.8s infinite" : "none",
                }}>🔥 {streak}연속! x{multiplier}</span>}
            </div>

            {/* History dots */}
            <div style={{ display: "flex", gap: "3px" }}>
                {history.map((h, i) => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: h.win ? "#64ffda" : "#FF6B6B",
                        boxShadow: h.win ? "0 0 4px #64ffda" : "0 0 4px #FF6B6B",
                    }} />
                ))}
                {Array.from({ length: maxRounds - history.length }).map((_, i) => (
                    <div key={`e${i}`} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                ))}
            </div>

            {/* Cards area */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                {/* Current card */}
                <div style={{
                    width: 85, height: 115, borderRadius: "12px",
                    background: "linear-gradient(145deg, #fafafa, #e8e8e8)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    animation: "cardPulse 2s ease infinite",
                    position: "relative",
                }}>
                    <div style={{ position: "absolute", top: 6, left: 8, fontSize: "12px", color: suitColor(cardSuit), fontWeight: "bold" }}>{cardName(card)}</div>
                    <div style={{ fontSize: "30px", fontWeight: "bold", color: suitColor(cardSuit) }}>{cardName(card)}</div>
                    <div style={{ fontSize: "22px" }}>{cardSuit}</div>
                    <div style={{ position: "absolute", bottom: 6, right: 8, fontSize: "12px", color: suitColor(cardSuit), fontWeight: "bold", transform: "rotate(180deg)" }}>{cardName(card)}</div>
                </div>

                {/* Arrow */}
                <div style={{ fontSize: "22px", color: "#8892b0" }}>→</div>

                {/* Next card */}
                <div style={{
                    width: 85, height: 115, borderRadius: "12px",
                    background: nextCard
                        ? "linear-gradient(145deg, #fafafa, #e8e8e8)"
                        : "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(124,58,237,0.3))",
                    border: feedback === "correct" ? "3px solid #64ffda"
                        : feedback === "wrong" ? "3px solid #FF6B6B"
                            : "2px solid rgba(255,255,255,0.15)",
                    boxShadow: nextCard
                        ? feedback === "correct" ? "0 0 20px rgba(100,255,218,0.3)" : "0 6px 20px rgba(0,0,0,0.3)"
                        : "none",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    animation: nextCard ? "cardSlideIn 0.4s ease" : "none",
                    position: "relative",
                }}>
                    {nextCard ? (
                        <>
                            <div style={{ position: "absolute", top: 6, left: 8, fontSize: "12px", color: suitColor(nextCard.suit), fontWeight: "bold" }}>{cardName(nextCard.value)}</div>
                            <div style={{ fontSize: "30px", fontWeight: "bold", color: suitColor(nextCard.suit) }}>{cardName(nextCard.value)}</div>
                            <div style={{ fontSize: "22px" }}>{nextCard.suit}</div>
                        </>
                    ) : (
                        <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.3)" }}>?</div>
                    )}
                </div>
            </div>

            {/* Bet info */}
            {!feedback && (
                <div style={{ fontSize: "11px", color: "#8892b0" }}>
                    현재 베팅: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{betAmount}</span>
                    {multiplier > 1 && <span style={{ color: "#A855F7" }}> (x{multiplier} 보너스!)</span>}
                </div>
            )}

            {!feedback && (
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => handleGuess("high")} style={{
                        padding: "12px 28px", fontSize: "15px", fontWeight: "bold",
                        borderRadius: "12px", cursor: "pointer",
                        background: "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))",
                        color: "#64ffda", border: "2px solid rgba(100,255,218,0.3)",
                        boxShadow: "0 4px 12px rgba(100,255,218,0.1)",
                        transition: "all 0.2s",
                    }}>⬆️ 높다</button>
                    <button onClick={() => handleGuess("low")} style={{
                        padding: "12px 28px", fontSize: "15px", fontWeight: "bold",
                        borderRadius: "12px", cursor: "pointer",
                        background: "linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,107,107,0.05))",
                        color: "#FF6B6B", border: "2px solid rgba(255,107,107,0.3)",
                        boxShadow: "0 4px 12px rgba(255,107,107,0.1)",
                        transition: "all 0.2s",
                    }}>⬇️ 낮다</button>
                </div>
            )}

            {feedback && (
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: feedback === "correct" ? "#64ffda" : "#FF6B6B" }}>
                        {feedback === "correct" ? `✅ +${betAmount} 코인!` : "❌ -15 코인"}
                    </div>
                    {feedback === "correct" && streak >= 3 && (
                        <div style={{ fontSize: "12px", color: "#A855F7" }}>🔥 다음 배팅 x{Math.min(3, multiplier + (streak >= 5 ? 0 : 1))} 보너스!</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HighLow;
