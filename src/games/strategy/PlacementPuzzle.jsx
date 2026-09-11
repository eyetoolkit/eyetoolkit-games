/**
 * 🎮 Game 86: 배치 퍼즐 — 드래그 배치 그리드
 */
import { useCallback, useState } from "react";

const BUILDINGS = [
    { emoji: "🏠", name: "집", score: 2, bonus: "🏪 옆: +2" },
    { emoji: "🏪", name: "상점", score: 3, bonus: "🏠 옆: +1" },
    { emoji: "🌳", name: "공원", score: 2, bonus: "🏠 옆: +3" },
    { emoji: "🏭", name: "공장", score: 5, bonus: "🌳 옆: -2" },
    { emoji: "🏫", name: "학교", score: 4, bonus: "🏠 옆: +2" },
];
const SIZE = 4;

const calcScore = (grid) => {
    let total = 0;
    grid.forEach((row, y) => row.forEach((cell, x) => {
        if (!cell) return;
        total += cell.score;
        // Adjacency bonuses
        const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]]
            .map(([dy, dx]) => grid[y + dy]?.[x + dx])
            .filter(Boolean);
        if (cell.emoji === "🏠") neighbors.forEach((n) => { if (n.emoji === "🏪") total += 2; if (n.emoji === "🌳") total += 3; });
        if (cell.emoji === "🏪") neighbors.forEach((n) => { if (n.emoji === "🏠") total += 1; });
        if (cell.emoji === "🏫") neighbors.forEach((n) => { if (n.emoji === "🏠") total += 2; });
        if (cell.emoji === "🏭") neighbors.forEach((n) => { if (n.emoji === "🌳") total -= 2; });
    }));
    return total;
};

const PlacementPuzzle = ({ onComplete }) => {
    const [grid, setGrid] = useState(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(null)));
    const [queue, setQueue] = useState(() => Array.from({ length: 8 }, () => BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)]));
    const [placed, setPlaced] = useState(0);
    const MAX = 8;

    const place = useCallback((y, x) => {
        if (grid[y][x] || placed >= MAX) return;
        const building = queue[placed];
        setGrid((g) => { const n = g.map((r) => [...r]); n[y][x] = building; return n; });
        setPlaced((p) => {
            const np = p + 1;
            if (np >= MAX) {
                setTimeout(() => {
                    const newGrid = grid.map((r) => [...r]);
                    newGrid[y][x] = building;
                    const score = calcScore(newGrid);
                    onComplete(Math.min(100, score * 2));
                }, 500);
            }
            return np;
        });
    }, [grid, queue, placed, onComplete]);

    const currentBuilding = queue[placed];
    const score = calcScore(grid);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                배치: <span style={{ color: "#FFD700" }}>{placed}/{MAX}</span> | 점수: <span style={{ color: "#64ffda" }}>{score}</span>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "4px" }}>
                {grid.map((row, y) => row.map((cell, x) => (
                    <button key={`${y}-${x}`} onClick={() => place(y, x)}
                        style={{
                            width: 52, height: 52, borderRadius: "10px", fontSize: "24px",
                            cursor: cell || placed >= MAX ? "default" : "pointer",
                            background: cell ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                            border: cell ? "1px solid rgba(255,255,255,0.15)" : "1px dashed rgba(255,255,255,0.1)",
                            color: "white", transition: "all 0.2s ease",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        }}
                        onMouseEnter={(e) => { if (!cell && placed < MAX) { e.currentTarget.style.background = "rgba(255,215,0,0.1)"; e.currentTarget.style.borderColor = "#FFD700"; } }}
                        onMouseLeave={(e) => { if (!cell) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; } }}
                    >
                        {cell && <span>{cell.emoji}</span>}
                        {cell && <span style={{ fontSize: "8px", color: "#8892b0" }}>{cell.name}</span>}
                    </button>
                )))}
            </div>

            {/* Next building */}
            {placed < MAX && currentBuilding && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 16px", borderRadius: "12px",
                    background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)",
                }}>
                    <span style={{ fontSize: "28px" }}>{currentBuilding.emoji}</span>
                    <div>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>{currentBuilding.name}</div>
                        <div style={{ fontSize: "10px", color: "#8892b0" }}>기본 {currentBuilding.score}점 | {currentBuilding.bonus}</div>
                    </div>
                </div>
            )}

            {/* Queue preview */}
            <div style={{ display: "flex", gap: "4px", fontSize: "14px" }}>
                {queue.slice(placed + 1, placed + 4).map((b, i) => (
                    <span key={i} style={{ opacity: 0.4 + (1 - i * 0.15) }}>{b.emoji}</span>
                ))}
            </div>

            {placed >= MAX && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🏆 최종 점수: {score}점</div>
            )}
        </div>
    );
};

export default PlacementPuzzle;
