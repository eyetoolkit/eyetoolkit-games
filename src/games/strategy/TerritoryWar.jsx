/**
 * 🎮 Game 89: Territory War — paint the map
 */
import { useCallback, useState } from "react";

const SIZE = 6;
const COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#FFD700", "#A855F7", "#F97316"];

const initGrid = () => {
    const grid = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    return grid;
};

const TerritoryWar = ({ onComplete }) => {
    const [grid, setGrid] = useState(initGrid);
    const [turn, setTurn] = useState(0);
    const [owned, setOwned] = useState(new Set(["0,0"]));
    const [aiOwned, setAiOwned] = useState(new Set([`${SIZE - 1},${SIZE - 1}`]));
    const MAX_TURNS = 12;

    const floodFill = useCallback((color, ownedSet, gridState) => {
        const newOwned = new Set(ownedSet);
        const newGrid = gridState.map((r) => [...r]);
        let changed = true;
        while (changed) {
            changed = false;
            newOwned.forEach((key) => {
                const [y, x] = key.split(",").map(Number);
                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dy, dx]) => {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE) {
                        const nk = `${ny},${nx}`;
                        if (!newOwned.has(nk) && newGrid[ny][nx] === color) {
                            newOwned.add(nk);
                            changed = true;
                        }
                    }
                });
            });
        }
        // Change owned cells to new color
        newOwned.forEach((key) => {
            const [y, x] = key.split(",").map(Number);
            newGrid[y][x] = color;
        });
        return { newOwned, newGrid };
    }, []);

    const pickColor = useCallback((color) => {
        // Player turn
        const { newOwned, newGrid } = floodFill(color, owned, grid);
        setOwned(newOwned);

        // AI turn — pick color that captures most
        let bestColor = COLORS[0], bestCount = 0;
        COLORS.forEach((c) => {
            const { newOwned: ao } = floodFill(c, aiOwned, newGrid);
            if (ao.size > bestCount) { bestCount = ao.size; bestColor = c; }
        });
        const { newOwned: aiNew, newGrid: finalGrid } = floodFill(bestColor, aiOwned, newGrid);
        setAiOwned(aiNew);
        setGrid(finalGrid);

        const nt = turn + 1;
        setTurn(nt);

        if (nt >= MAX_TURNS || newOwned.size + aiNew.size >= SIZE * SIZE) {
            const score = Math.round((newOwned.size / (SIZE * SIZE)) * 100);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [grid, owned, aiOwned, turn, floodFill, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Turn <span style={{ color: "#FFD700" }}>{turn}/{MAX_TURNS}</span> | 🧑 {owned.size} vs 🤖 {aiOwned.size}
            </div>

            {/* Territory grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "2px" }}>
                {grid.map((row, y) => row.map((color, x) => {
                    const key = `${y},${x}`;
                    const isOwned = owned.has(key);
                    const isAi = aiOwned.has(key);
                    return (
                        <div key={key} style={{
                            width: 36, height: 36, borderRadius: "6px",
                            background: color,
                            opacity: isOwned || isAi ? 1 : 0.5,
                            border: isOwned ? "2px solid white" : isAi ? "2px solid #333" : "1px solid rgba(0,0,0,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px",
                            boxShadow: isOwned ? "0 0 8px rgba(255,255,255,0.3)" : isAi ? "0 0 8px rgba(0,0,0,0.5)" : "none",
                        }}>
                            {isOwned && y === 0 && x === 0 ? "🧑" : isAi && y === SIZE - 1 && x === SIZE - 1 ? "🤖" : ""}
                        </div>
                    );
                }))}
            </div>

            {/* Progress */}
            <div style={{ width: 240, height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${(owned.size / (SIZE * SIZE)) * 100}%`, background: "#64ffda", transition: "width 0.3s ease" }} />
                <div style={{ flex: 1 }} />
                <div style={{ width: `${(aiOwned.size / (SIZE * SIZE)) * 100}%`, background: "#EF4444", transition: "width 0.3s ease" }} />
            </div>

            {/* Color picker */}
            <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map((c) => (
                    <button key={c} onClick={() => pickColor(c)}
                        style={{
                            width: 36, height: 36, borderRadius: "10px",
                            background: c, cursor: "pointer",
                            border: "2px solid rgba(255,255,255,0.2)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    />
                ))}
            </div>

            <div style={{ fontSize: "10px", color: "#8892b0" }}>Pick a color and expand your territory!</div>
        </div>
    );
};

export default TerritoryWar;
