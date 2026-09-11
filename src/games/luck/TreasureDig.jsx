/**
 * 🎮 Game 138: 보물 발굴
 * 격자에서 보물을 파내세요 — 지뢰찾기 스타일
 */
import { useState, useCallback } from "react";

const SIZE = 5;
const TREASURES = 5;

const createGrid = () => {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    let placed = 0;
    while (placed < TREASURES) {
        const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
        if (grid[r][c] === 0) { grid[r][c] = 1; placed++; }
    }
    return grid;
};

const TreasureDig = ({ onComplete }) => {
    const [grid] = useState(createGrid);
    const [revealed, setRevealed] = useState(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(false)));
    const [found, setFound] = useState(0);
    const [digs, setDigs] = useState(0);
    const [done, setDone] = useState(false);
    const [lastDig, setLastDig] = useState(null);
    const maxDigs = 12;

    const dig = useCallback((r, c) => {
        if (done || revealed[r][c]) return;
        const newRevealed = revealed.map(row => [...row]);
        newRevealed[r][c] = true;
        setRevealed(newRevealed);
        const newDigs = digs + 1;
        setDigs(newDigs);
        setLastDig(`${r},${c}`);

        let newFound = found;
        if (grid[r][c] === 1) {
            newFound = found + 1;
            setFound(newFound);
        }

        if (newFound >= TREASURES) {
            setDone(true);
            const score = Math.min(100, 120 - newDigs * 5);
            setTimeout(() => onComplete(Math.max(30, score)), 500);
        } else if (newDigs >= maxDigs) {
            setDone(true);
            const score = Math.min(100, newFound * 20);
            setTimeout(() => onComplete(Math.max(20, score)), 500);
        }
    }, [grid, revealed, found, digs, done, onComplete]);

    const getHint = (r, c) => {
        if (!revealed[r][c]) return null;
        if (grid[r][c] === 1) return "treasure";
        let nearby = 0;
        for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) nearby += grid[nr][nc];
            }
        return nearby;
    };

    const hintColors = ["#8892b0", "#64ffda", "#4D96FF", "#FFD93D", "#FF6B6B"];
    const progress = (found / TREASURES) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes digReveal { from{transform:scale(0.8) rotateZ(-5deg);opacity:0} to{transform:scale(1) rotateZ(0);opacity:1} }
                @keyframes treasureFound { 0%{transform:scale(0)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
                @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
                .dig-cell:hover:not(.revealed) { transform: scale(1.05); border-color: #FFD700 !important; box-shadow: 0 0 12px rgba(255,215,0,0.2); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>💎 <span style={{ color: "#FFD700", fontWeight: "bold" }}>{found}/{TREASURES}</span></span>
                <span>⛏ <span style={{ color: digs >= maxDigs - 3 ? "#FF6B6B" : "#64ffda", fontWeight: "bold" }}>{maxDigs - digs}</span></span>
            </div>
            {/* Progress */}
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FFD700, #FF8C42)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, 54px)`, gap: "4px",
                padding: "10px", borderRadius: "14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
                {grid.flat().map((_, idx) => {
                    const r = Math.floor(idx / SIZE), c = idx % SIZE;
                    const h = getHint(r, c);
                    const isJustDug = lastDig === `${r},${c}`;
                    return (
                        <div key={idx}
                            className={`dig-cell ${revealed[r][c] ? "revealed" : ""}`}
                            onClick={() => dig(r, c)} style={{
                                width: 54, height: 54, borderRadius: "10px",
                                cursor: revealed[r][c] ? "default" : "pointer",
                                background: revealed[r][c]
                                    ? (h === "treasure"
                                        ? "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,66,0.15))"
                                        : "rgba(255,255,255,0.04)")
                                    : "linear-gradient(145deg, #6a5a2a, #8B6914)",
                                border: revealed[r][c]
                                    ? (h === "treasure" ? "2px solid rgba(255,215,0,0.4)" : "2px solid rgba(255,255,255,0.08)")
                                    : "2px solid rgba(139,105,20,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: h === "treasure" ? "26px" : "18px", fontWeight: "bold",
                                color: h === "treasure" ? "#FFD700" : hintColors[Math.min(h || 0, 4)],
                                transition: "all 0.2s ease",
                                animation: isJustDug ? (h === "treasure" ? "treasureFound 0.5s ease" : "digReveal 0.3s ease") : "none",
                                boxShadow: h === "treasure" ? "0 0 15px rgba(255,215,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
                            }}>
                            {h === "treasure" ? "💎" : h !== null ? (h === 0 ? "·" : h) : "⛏"}
                        </div>
                    );
                })}
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>숫자 = 주변 보물 수 | {maxDigs}회 안에 {TREASURES}개 찾기!</div>
            {done && <div style={{
                fontSize: "18px", fontWeight: "bold",
                color: found >= TREASURES ? "#64ffda" : "#FF6B6B",
                textShadow: "0 0 15px currentColor",
            }}>
                {found >= TREASURES ? "🎉 모든 보물 발굴!" : `발굴 종료! ${found}/${TREASURES}`}
            </div>}
        </div>
    );
};

export default TreasureDig;
