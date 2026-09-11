/**
 * 🎮 Game 143: Room Escape
 * Find clues and escape the room
 */
import { useState, useCallback } from "react";

const ROOMS = {
    start: {
        text: "You are trapped in a dark room. You see a desk, a painting, and a safe.",
        emoji: "🏚️",
        actions: [
            { text: "📋 Inspect desk", target: "desk" },
            { text: "🖼️ Inspect painting", target: "painting" },
            { text: "🔒 Inspect safe", target: "safe" },
        ]
    },
    desk: {
        text: "A note on the desk: 'The password is behind the painting'",
        emoji: "📋",
        actions: [
            { text: "🗄️ Open drawer", target: "drawer" },
            { text: "↩ Back", target: "start" },
        ]
    },
    drawer: {
        text: "You found a key in the drawer! It's blue.", item: "blueKey",
        emoji: "🔑",
        actions: [
            { text: "↩ Back", target: "start" },
        ]
    },
    painting: {
        text: "The number '4721' is written behind the painting.", item: "code",
        emoji: "🔢",
        actions: [
            { text: "↩ Back", target: "start" },
        ]
    },
    safe: {
        text: "The safe requires a 4-digit password.",
        emoji: "🔐",
        actions: [
            { text: "🔢 Enter 4721", target: "safeOpen", requires: "code" },
            { text: "↩ Back", target: "start" },
        ]
    },
    safeOpen: {
        text: "The safe is open! You found a red key!", item: "redKey",
        emoji: "🗝️",
        actions: [
            { text: "↩ Back", target: "start" },
        ]
    },
};

const RoomEscape = ({ onComplete }) => {
    const [room, setRoom] = useState("start");
    const [items, setItems] = useState(new Set());
    const [steps, setSteps] = useState(0);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState(null);

    const act = useCallback((action) => {
        if (done) return;
        if (action.requires && !items.has(action.requires)) {
            setMessage("You don't have the clue you need!");
            setTimeout(() => setMessage(null), 1500);
            return;
        }
        const target = ROOMS[action.target];
        if (target?.item) {
            setItems(prev => new Set([...prev, target.item]));
        }
        setRoom(action.target);
        setSteps(s => s + 1);

        if (items.has("blueKey") && items.has("redKey") || (target?.item === "redKey" && items.has("blueKey"))) {
            setDone(true);
            const score = Math.max(30, 100 - steps * 5);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [items, steps, done, onComplete]);

    const r = ROOMS[room] || ROOMS.start;
    const hasAllKeys = items.has("blueKey") && items.has("redKey");

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes roomFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                @keyframes keyGlow { 0%,100%{text-shadow:0 0 8px currentColor} 50%{text-shadow:0 0 20px currentColor} }
                @keyframes doorGlow { 0%,100%{box-shadow:0 0 15px rgba(255,215,0,0.3)} 50%{box-shadow:0 0 30px rgba(255,215,0,0.6)} }
                .escape-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.3) !important; }
            `}</style>
            {/* Header */}
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>Moves: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{steps}</span></span>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {items.has("blueKey") && <span style={{ animation: "keyGlow 2s infinite", color: "#4D96FF" }}>🔵</span>}
                    {items.has("redKey") && <span style={{ animation: "keyGlow 2s infinite", color: "#FF6B6B" }}>🔴</span>}
                    {items.has("code") && <span>🔢</span>}
                    {items.size === 0 && <span style={{ color: "#8892b0", fontSize: "11px" }}>No items</span>}
                </div>
            </div>
            {/* Room scene */}
            <div style={{
                padding: "20px 24px", maxWidth: "300px", textAlign: "center",
                borderRadius: "16px",
                background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                animation: "roomFade 0.35s ease",
            }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>{r.emoji}</div>
                <div style={{ fontSize: "14px", lineHeight: "1.7", color: "#e2e8f0" }}>{r.text}</div>
            </div>
            {/* Message popup */}
            {message && <div style={{
                padding: "8px 16px", borderRadius: "10px",
                background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.3)",
                color: "#FF6B6B", fontSize: "13px", fontWeight: "600",
            }}>⚠ {message}</div>}
            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "240px" }}>
                {r.actions?.map((action, i) => {
                    const locked = action.requires && !items.has(action.requires);
                    return (
                        <button key={i} className="escape-btn" onClick={() => act(action)} style={{
                            padding: "10px 20px", fontSize: "14px", fontWeight: "500",
                            background: locked
                                ? "rgba(255,255,255,0.02)"
                                : action.text.includes("↩")
                                    ? "rgba(255,255,255,0.04)"
                                    : "linear-gradient(135deg, rgba(100,255,218,0.08), rgba(77,150,255,0.08))",
                            color: locked ? "#555" : "white",
                            border: locked ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "12px", cursor: locked ? "not-allowed" : "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}>
                            {locked ? "🔒 " : ""}{action.text}
                        </button>
                    );
                })}
                {hasAllKeys && !done && (
                    <button className="escape-btn" onClick={() => { setDone(true); const s = Math.max(30, 100 - steps * 5); setTimeout(() => onComplete(Math.min(100, s)), 500); }}
                        style={{
                            padding: "12px 20px", fontSize: "16px", fontWeight: "bold",
                            background: "linear-gradient(135deg, #FFD700, #FF8C42)",
                            color: "#000", border: "none", borderRadius: "14px", cursor: "pointer",
                            animation: "doorGlow 1.5s infinite",
                            transition: "all 0.2s",
                        }}>
                        🚪 Escape!
                    </button>
                )}
            </div>
            {done && <div style={{
                fontSize: "20px", fontWeight: "bold",
                color: "#64ffda",
                textShadow: "0 0 20px rgba(100,255,218,0.4)",
            }}>🎉 Escaped! {steps} moves</div>}
        </div>
    );
};

export default RoomEscape;
