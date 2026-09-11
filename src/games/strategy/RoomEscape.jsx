/**
 * 🎮 Game 143: 방 탈출
 * 단서를 찾아 방에서 탈출하세요
 */
import { useState, useCallback } from "react";

const ROOMS = {
    start: {
        text: "어두운 방에 갇혀있습니다. 책상, 그림, 금고가 보입니다.",
        emoji: "🏚️",
        actions: [
            { text: "📋 책상 조사", target: "desk" },
            { text: "🖼️ 그림 조사", target: "painting" },
            { text: "🔒 금고 조사", target: "safe" },
        ]
    },
    desk: {
        text: "책상 위에 메모가 있습니다: '비밀번호는 그림 뒤에'",
        emoji: "📋",
        actions: [
            { text: "🗄️ 서랍 열기", target: "drawer" },
            { text: "↩ 돌아가기", target: "start" },
        ]
    },
    drawer: {
        text: "서랍에서 열쇠를 발견했습니다! 파란색 열쇠입니다.", item: "blueKey",
        emoji: "🔑",
        actions: [
            { text: "↩ 돌아가기", target: "start" },
        ]
    },
    painting: {
        text: "그림 뒤에 숫자 '4721'이 적혀있습니다.", item: "code",
        emoji: "🔢",
        actions: [
            { text: "↩ 돌아가기", target: "start" },
        ]
    },
    safe: {
        text: "금고에 4자리 비밀번호가 필요합니다.",
        emoji: "🔐",
        actions: [
            { text: "🔢 4721 입력", target: "safeOpen", requires: "code" },
            { text: "↩ 돌아가기", target: "start" },
        ]
    },
    safeOpen: {
        text: "금고가 열렸습니다! 빨간색 열쇠를 발견!", item: "redKey",
        emoji: "🗝️",
        actions: [
            { text: "↩ 돌아가기", target: "start" },
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
            setMessage("필요한 단서가 없습니다!");
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
                <span>이동: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{steps}</span></span>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {items.has("blueKey") && <span style={{ animation: "keyGlow 2s infinite", color: "#4D96FF" }}>🔵</span>}
                    {items.has("redKey") && <span style={{ animation: "keyGlow 2s infinite", color: "#FF6B6B" }}>🔴</span>}
                    {items.has("code") && <span>🔢</span>}
                    {items.size === 0 && <span style={{ color: "#8892b0", fontSize: "11px" }}>아이템 없음</span>}
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
                        🚪 탈출!
                    </button>
                )}
            </div>
            {done && <div style={{
                fontSize: "20px", fontWeight: "bold",
                color: "#64ffda",
                textShadow: "0 0 20px rgba(100,255,218,0.4)",
            }}>🎉 탈출 성공! {steps}회 이동</div>}
        </div>
    );
};

export default RoomEscape;
