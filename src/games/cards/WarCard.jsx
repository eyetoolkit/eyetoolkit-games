/**
 * 🎮 Game 115: 전쟁 카드게임 (War)
 * 높은 카드가 이기는 간단한 카드게임
 */
import { useState, useCallback } from "react";

const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const SUITS = ["spade", "heart", "diamond", "club"];
const SUIT_DISPLAY = { spade: "\u2660", heart: "\u2665", diamond: "\u2666", club: "\u2663" };
const SUIT_COLORS = { spade: "#fff", heart: "#FF6B6B", diamond: "#FF6B6B", club: "#fff" };

const createDeck = () => {
    const deck = [];
    for (const suit of SUITS)
        for (const rank of RANKS)
            deck.push({ suit, rank, value: RANKS.indexOf(rank) });
    return deck.sort(() => Math.random() - 0.5);
};

const WarCard = ({ onComplete }) => {
    const [deck] = useState(createDeck);
    const [playerDeck, setPlayerDeck] = useState(() => deck.slice(0, 26));
    const [aiDeck, setAiDeck] = useState(() => deck.slice(26));
    const [playerCard, setPlayerCard] = useState(null);
    const [aiCard, setAiCard] = useState(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [round, setRound] = useState(0);
    const [message, setMessage] = useState("카드를 뒤집으세요!");
    const [done, setDone] = useState(false);
    const maxRounds = 15;

    const flip = useCallback(() => {
        if (done || playerDeck.length === 0 || aiDeck.length === 0) return;

        const pCard = playerDeck[0];
        const aCard = aiDeck[0];
        setPlayerCard(pCard);
        setAiCard(aCard);
        setPlayerDeck(prev => prev.slice(1));
        setAiDeck(prev => prev.slice(1));

        const newRound = round + 1;
        setRound(newRound);

        let newPS = playerScore, newAS = aiScore;
        if (pCard.value > aCard.value) {
            newPS++; setPlayerScore(newPS);
            setMessage("승리! 🎉");
        } else if (pCard.value < aCard.value) {
            newAS++; setAiScore(newAS);
            setMessage("패배 😢");
        } else {
            setMessage("무승부! 🤝");
        }

        if (newRound >= maxRounds || playerDeck.length <= 1 || aiDeck.length <= 1) {
            setDone(true);
            const finalScore = newPS > newAS ? Math.min(100, 50 + (newPS - newAS) * 5) :
                newPS === newAS ? 50 : Math.max(20, 50 - (newAS - newPS) * 5);
            setTimeout(() => onComplete(finalScore), 800);
        }
    }, [done, playerDeck, aiDeck, round, playerScore, aiScore, onComplete]);

    const renderCard = (card, label) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>{label}</div>
            <div style={{
                width: 80, height: 112, borderRadius: "10px",
                background: card ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #4D96FF, #2563EB)",
                border: card ? "2px solid rgba(255,255,255,0.2)" : "2px solid rgba(255,255,255,0.1)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
            }}>
                {card ? (
                    <>
                        <span style={{ fontSize: "28px", color: SUIT_COLORS[card.suit] }}>{SUIT_DISPLAY[card.suit]}</span>
                        <span style={{ fontSize: "24px", fontWeight: "bold" }}>{card.rank}</span>
                    </>
                ) : (
                    <span style={{ fontSize: "28px" }}>🂠</span>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>나: <span style={{ color: "#64ffda" }}>{playerScore}</span></span>
                <span>라운드: <span style={{ color: "#FFD700" }}>{round}/{maxRounds}</span></span>
                <span>AI: <span style={{ color: "#FF6B6B" }}>{aiScore}</span></span>
            </div>
            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                {renderCard(playerCard, "내 카드")}
                <div style={{ fontSize: "24px" }}>VS</div>
                {renderCard(aiCard, "AI 카드")}
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: message.includes("승") ? "#64ffda" : message.includes("패") ? "#FF6B6B" : "#FFD700" }}>
                {message}
            </div>
            {!done && (
                <button onClick={flip} style={{
                    padding: "10px 28px", fontSize: "15px", fontWeight: "bold",
                    background: "linear-gradient(135deg, #FF6B6B, #FF8C42)", color: "white",
                    border: "none", borderRadius: "12px", cursor: "pointer",
                }}>
                    카드 뒤집기!
                </button>
            )}
            {done && <div style={{ fontSize: "18px", color: "#64ffda", fontWeight: "bold" }}>
                게임 종료! {playerScore > aiScore ? "승리!" : playerScore < aiScore ? "패배..." : "무승부!"}
            </div>}
        </div>
    );
};

export default WarCard;
