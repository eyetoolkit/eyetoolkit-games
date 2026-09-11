/**
 * 🎮 Reaction Test — multi-mode + rank system + best time tracking
 */
import { useCallback, useRef, useState } from "react";

const ROUNDS = 5;
const RANKS = [
    { max: 180, label: "⚡ Lightning fast!", color: "#FF6B6B", emoji: "🏆" },
    { max: 250, label: "🔥 Flaming reflex!", color: "#FFD700", emoji: "🥇" },
    { max: 350, label: "😎 Pretty fast!", color: "#64ffda", emoji: "🥈" },
    { max: 450, label: "🙂 Average", color: "#8892b0", emoji: "🥉" },
    { max: 9999, label: "🐢 Take it easy~", color: "#666", emoji: "🐌" },
];

const ReactionTest = ({ onComplete }) => {
    const [phase, setPhase] = useState("ready");
    const [results, setResults] = useState([]);
    const [round, setRound] = useState(0);
    const [currentTime, setCurrentTime] = useState(null);
    const [bestTime, setBestTime] = useState(null);
    const [worstTime, setWorstTime] = useState(null);
    const startRef = useRef(null);
    const timeoutRef = useRef(null);

    const getRank = (ms) => RANKS.find(r => ms <= r.max) || RANKS[4];

    const startRound = useCallback(() => {
        setPhase("waiting");
        const delay = 1500 + Math.random() * 3000;
        timeoutRef.current = setTimeout(() => { startRef.current = Date.now(); setPhase("go"); }, delay);
    }, []);

    const handleClick = useCallback(() => {
        if (phase === "ready") { startRound(); }
        else if (phase === "waiting") { clearTimeout(timeoutRef.current); setPhase("early"); }
        else if (phase === "go") {
            const reaction = Date.now() - startRef.current;
            setCurrentTime(reaction);
            if (!bestTime || reaction < bestTime) setBestTime(reaction);
            if (!worstTime || reaction > worstTime) setWorstTime(reaction);
            const newResults = [...results, reaction];
            setResults(newResults);
            const nextRound = round + 1;
            if (nextRound >= ROUNDS) {
                setPhase("done");
                const avg = newResults.reduce((a, b) => a + b, 0) / newResults.length;
                setTimeout(() => onComplete(Math.max(20, Math.min(100, Math.round(150 - avg * 0.3)))), 1500);
            } else { setRound(nextRound); setPhase("result"); }
        } else if (phase === "result" || phase === "early") { startRound(); }
    }, [phase, results, round, startRound, bestTime, worstTime, onComplete]);

    const bg = {
        ready: "linear-gradient(135deg, #0f0f23, #16213e)",
        waiting: "linear-gradient(135deg, #8B0000, #CC0000)",
        go: "linear-gradient(135deg, #006400, #00AA00)",
        result: "linear-gradient(135deg, #0f0f23, #16213e)",
        early: "linear-gradient(135deg, #8B4500, #CC6600)",
        done: "linear-gradient(135deg, #0f0f23, #1a1040)",
    };
    const avg = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
    const currentRank = currentTime ? getRank(currentTime) : null;
    const avgRank = avg > 0 ? getRank(avg) : null;

    return (
        <div onClick={handleClick} style={{
            height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "12px", color: "white", cursor: "pointer", background: bg[phase],
            transition: "background 0.3s", borderRadius: "8px", userSelect: "none", padding: "20px",
        }}>
            <style>{`
                @keyframes pulseGo { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
                @keyframes resultSlide { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes rankReveal { 0% { transform: scale(0) rotate(-90deg); } 100% { transform: scale(1) rotate(0); } }
                @keyframes bestGlow { 0%,100% { text-shadow: 0 0 15px #FFD700; } 50% { text-shadow: 0 0 30px #FFD700, 0 0 50px #FF6B6B; } }
                @keyframes shakeWarn { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-6px); } 30% { transform: translateX(6px); } 45% { transform: translateX(-4px); } 60% { transform: translateX(4px); } }
            `}</style>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {Array.from({ length: ROUNDS }).map((_, i) => {
                    const r = results[i];
                    const rank = r ? getRank(r) : null;
                    return (
                        <div key={i} style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: rank ? rank.color : i === round && phase !== "done" ? "#FFD700" : "rgba(255,255,255,0.1)",
                            border: i === round && phase !== "done" ? "2px solid #FFD700" : "2px solid transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "8px", transition: "all 0.3s",
                            boxShadow: rank ? `0 0 6px ${rank.color}` : "none",
                        }}>
                            {rank ? "" : ""}
                        </div>
                    );
                })}
                {bestTime && <span style={{ fontSize: "10px", color: "#FFD700", marginLeft: "6px" }}>Best: {bestTime}ms</span>}
            </div>

            {phase === "ready" && <>
                <div style={{ fontSize: "56px" }}>⚡</div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>Reaction Test</div>
                <div style={{ fontSize: "13px", color: "#8892b0" }}>Click to start!</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                    {RANKS.slice(0, 4).map((r, i) => (
                        <div key={i} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: `${r.color}15`, color: r.color }}>
                            {r.emoji} {r.max}ms or less {r.label}
                        </div>
                    ))}
                </div>
            </>}
            {phase === "waiting" && <>
                <div style={{ fontSize: "48px" }}>🔴</div>
                <div style={{ fontSize: "22px", fontWeight: "bold" }}>Wait for it...</div>
                <div style={{ fontSize: "13px", opacity: 0.7 }}>Click when it turns green!</div>
            </>}
            {phase === "go" && <>
                <div style={{ fontSize: "72px", animation: "pulseGo 0.4s ease infinite" }}>🟢</div>
                <div style={{ fontSize: "32px", fontWeight: "bold" }}>Click now!</div>
            </>}
            {phase === "early" && <>
                <div style={{ fontSize: "48px", animation: "shakeWarn 0.4s ease" }}>⚠️</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Too early!</div>
                <div style={{ fontSize: "13px" }}>Click to retry</div>
            </>}
            {phase === "result" && currentRank && <>
                <div style={{ animation: "rankReveal 0.4s ease" }}>
                    <div style={{ fontSize: "40px", textAlign: "center" }}>{currentRank.emoji}</div>
                </div>
                <div style={{
                    fontSize: "42px", fontWeight: "bold", color: currentRank.color,
                    animation: currentTime === bestTime ? "bestGlow 1s infinite" : "resultSlide 0.3s ease",
                }}>
                    {currentTime}ms
                    {currentTime === bestTime && results.length > 1 && <span style={{ fontSize: "14px" }}> 🏆 NEW BEST!</span>}
                </div>
                <div style={{ fontSize: "14px", color: currentRank.color, fontWeight: "bold" }}>{currentRank.label}</div>
                <div style={{ fontSize: "12px", color: "#8892b0" }}>Round {round}/{ROUNDS} | Avg: {avg}ms</div>
                {/* Bar chart */}
                <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: 50 }}>
                    {results.map((r, i) => {
                        const rank = getRank(r);
                        return (
                            <div key={i} style={{
                                width: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                            }}>
                                <div style={{ fontSize: "8px", color: rank.color }}>{r}</div>
                                <div style={{
                                    width: "100%", height: Math.max(8, Math.min(40, (500 - r) / 10)),
                                    background: `linear-gradient(0deg, ${rank.color}, ${rank.color}88)`,
                                    borderRadius: "3px 3px 0 0",
                                }} />
                            </div>
                        );
                    })}
                </div>
                <div style={{ fontSize: "11px", color: "#8892b0" }}>Click for next round</div>
            </>}
            {phase === "done" && avgRank && <>
                <div style={{ fontSize: "56px" }}>{avgRank.emoji}</div>
                <div style={{ fontSize: "22px", fontWeight: "bold" }}>Final avg: <span style={{ color: avgRank.color }}>{avg}ms</span></div>
                <div style={{ fontSize: "16px", color: avgRank.color, fontWeight: "bold" }}>{avgRank.label}</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                    {results.map((r, i) => {
                        const rank = getRank(r);
                        return (
                            <span key={i} style={{
                                padding: "4px 10px", borderRadius: "8px", fontSize: "12px",
                                background: `${rank.color}20`, color: rank.color,
                                border: r === bestTime ? `1px solid ${rank.color}` : "none",
                            }}>
                                {r === bestTime ? "⭐" : ""} R{i + 1}: {r}ms
                            </span>
                        );
                    })}
                </div>
                <div style={{ fontSize: "11px", color: "#8892b0" }}>
                    Best: {bestTime}ms | Worst: {worstTime}ms | Spread: {worstTime - bestTime}ms
                </div>
            </>}
        </div>
    );
};

export default ReactionTest;
