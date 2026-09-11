/**
 * 🎮 Game 22: Blackjack
 * Heads-up blackjack vs AI! Get closest to 21!
 */
import { useCallback, useRef, useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
    const deck = [];
    for (const s of SUITS) for (const r of RANKS) deck.push({ suit: s, rank: r });
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

const cardValue = (hand) => {
    let sum = 0, aces = 0;
    for (const c of hand) {
        if (c.rank === "A") { sum += 11; aces++; }
        else if (["K", "Q", "J"].includes(c.rank)) sum += 10;
        else sum += parseInt(c.rank);
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; }
    return sum;
};

const ROUNDS = 5;

const Blackjack = ({ onComplete }) => {
    const [deck] = useState(() => createDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [phase, setPhase] = useState("bet"); // bet, playing, dealer, result
    const [round, setRound] = useState(0);
    const [wins, setWins] = useState(0);
    const [message, setMessage] = useState("");
    const deckRef = useRef(deck);
    const winsRef = useRef(0);

    const draw = useCallback(() => {
        const d = deckRef.current;
        if (d.length === 0) { deckRef.current = createDeck(); return deckRef.current.pop(); }
        const card = d.pop();
        deckRef.current = d;
        return card;
    }, []);

    const deal = useCallback(() => {
        const p = [draw(), draw()];
        const d = [draw(), draw()];
        setPlayerHand(p);
        setDealerHand(d);
        setPhase("playing");
        setMessage("");
        if (cardValue(p) === 21) {
            setMessage("🎉 Blackjack!");
            winsRef.current += 1;
            setWins(winsRef.current);
            setPhase("result");
        }
    }, [draw]);

    const hit = useCallback(() => {
        const newHand = [...playerHand, draw()];
        setPlayerHand(newHand);
        if (cardValue(newHand) > 21) {
            setMessage("💥 Bust! Defeat");
            setPhase("result");
        }
    }, [playerHand, draw]);

    const stand = useCallback(() => {
        setPhase("dealer");
        let dh = [...dealerHand];
        while (cardValue(dh) < 17) dh.push(draw());
        setDealerHand(dh);
        const pv = cardValue(playerHand), dv = cardValue(dh);
        if (dv > 21 || pv > dv) {
            setMessage("🏆 Victory!");
            winsRef.current += 1;
            setWins(winsRef.current);
        } else if (pv === dv) {
            setMessage("🤝 Draw");
        } else {
            setMessage("😢 Defeat");
        }
        setPhase("result");
    }, [dealerHand, playerHand, draw]);

    const nextRound = useCallback(() => {
        const next = round + 1;
        if (next >= ROUNDS) {
            const score = Math.round((winsRef.current / ROUNDS) * 100);
            onComplete(Math.min(100, score));
        } else {
            setRound(next);
            deal();
        }
    }, [round, deal, onComplete]);

    const renderCard = (card, hidden = false) => (
        <div style={{
            width: 48, height: 68, borderRadius: "8px",
            background: hidden ? "linear-gradient(135deg, #1a1a5e, #2a2a8e)" : "white",
            color: hidden ? "transparent" : (card.suit === "♥" || card.suit === "♦") ? "#EF4444" : "#1a1a2e",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "bold",
            border: hidden ? "1px solid rgba(100,100,200,0.3)" : "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            transition: "transform 0.15s",
        }}>
            {hidden ? "🂠" : `${card.rank}${card.suit}`}
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>Round: <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | Victory: <span style={{ color: "#64ffda" }}>{wins}</span></div>
            <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: ROUNDS }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < round ? "#64ffda" : i === round ? "#FFD700" : "rgba(255,255,255,0.1)" }} />
                ))}
            </div>

            {phase === "bet" ? (
                <button onClick={deal} style={btnStyle}>🃏 Deal</button>
            ) : (
                <>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "4px" }}>Dealer ({phase === "playing" ? "?" : cardValue(dealerHand)})</div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            {dealerHand.map((c, i) => <div key={i}>{renderCard(c, phase === "playing" && i === 1)}</div>)}
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "12px", color: "#8892b0", marginBottom: "4px" }}>Me ({cardValue(playerHand)})</div>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            {playerHand.map((c, i) => <div key={i}>{renderCard(c)}</div>)}
                        </div>
                    </div>
                    {phase === "playing" && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={hit} style={btnStyle}>Hit</button>
                            <button onClick={stand} style={{ ...btnStyle, background: "rgba(100,255,218,0.2)", borderColor: "#64ffda" }}>Stand</button>
                        </div>
                    )}
                    {message && <div style={{ fontSize: "18px", fontWeight: "bold" }}>{message}</div>}
                    {phase === "result" && (
                        <button onClick={nextRound} style={btnStyle}>
                            {round + 1 >= ROUNDS ? "Show result" : "Next round →"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

const btnStyle = {
    padding: "10px 24px", fontSize: "14px", fontWeight: "bold",
    background: "rgba(255,255,255,0.1)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", cursor: "pointer",
};

export default Blackjack;
