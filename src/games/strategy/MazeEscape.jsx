/**
 * 🎮 Game 85: Maze Escape — grid maze visualization
 */
import { useCallback, useEffect, useState } from "react";

const SIZE = 7;
const genMaze = () => {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(1));
    // Simple DFS maze
    const stack = [[1, 1]];
    grid[1][1] = 0;
    while (stack.length) {
        const [y, x] = stack[stack.length - 1];
        const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]].filter(([dy, dx]) => {
            const ny = y + dy, nx = x + dx;
            return ny > 0 && ny < SIZE - 1 && nx > 0 && nx < SIZE - 1 && grid[ny][nx] === 1;
        });
        if (dirs.length === 0) { stack.pop(); continue; }
        const [dy, dx] = dirs[Math.floor(Math.random() * dirs.length)];
        grid[y + dy / 2][x + dx / 2] = 0;
        grid[y + dy][x + dx] = 0;
        stack.push([y + dy, x + dx]);
    }
    grid[1][0] = 0; // Entrance
    grid[SIZE - 2][SIZE - 1] = 0; // Exit
    return grid;
};

const MazeEscape = ({ onComplete }) => {
    const [maze] = useState(genMaze);
    const [pos, setPos] = useState({ y: 1, x: 0 });
    const [moves, setMoves] = useState(0);
    const [trail, setTrail] = useState(new Set(["1,0"]));
    const [won, setWon] = useState(false);
    const [startTime] = useState(Date.now());

    const move = useCallback((dy, dx) => {
        if (won) return;
        const ny = pos.y + dy, nx = pos.x + dx;
        if (ny < 0 || ny >= SIZE || nx < 0 || nx >= SIZE || maze[ny][nx] === 1) return;
        setPos({ y: ny, x: nx });
        setMoves((m) => m + 1);
        setTrail((t) => new Set([...t, `${ny},${nx}`]));

        if (ny === SIZE - 2 && nx === SIZE - 1) {
            setWon(true);
            const elapsed = (Date.now() - startTime) / 1000;
            const score = Math.max(20, 100 - moves * 2 - Math.round(elapsed));
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [pos, maze, moves, won, startTime, onComplete]);

    // Keyboard controls
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "ArrowUp" || e.key === "w") move(-1, 0);
            if (e.key === "ArrowDown" || e.key === "s") move(1, 0);
            if (e.key === "ArrowLeft" || e.key === "a") move(0, -1);
            if (e.key === "ArrowRight" || e.key === "d") move(0, 1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [move]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>🏃 Moves: <span style={{ color: "#FFD700" }}>{moves}</span></div>

            {/* Maze grid */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "1px", background: "rgba(0,0,0,0.5)", padding: "2px", borderRadius: "8px" }}>
                {maze.map((row, y) => row.map((cell, x) => {
                    const isPlayer = pos.y === y && pos.x === x;
                    const isExit = y === SIZE - 2 && x === SIZE - 1;
                    const isStart = y === 1 && x === 0;
                    const isTrail = trail.has(`${y},${x}`);
                    return (
                        <div key={`${y}-${x}`} onClick={() => {
                            const dy = y - pos.y, dx = x - pos.x;
                            if (Math.abs(dy) + Math.abs(dx) === 1) move(dy, dx);
                        }}
                            style={{
                                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: isPlayer ? "16px" : "12px",
                                background: cell === 1 ? "rgba(30,30,60,0.9)"
                                    : isPlayer ? "rgba(100,255,218,0.25)"
                                        : isExit ? "rgba(255,215,0,0.2)"
                                            : isTrail ? "rgba(100,255,218,0.06)"
                                                : "rgba(255,255,255,0.03)",
                                cursor: cell === 0 ? "pointer" : "default",
                                borderRadius: "2px",
                            }}>
                            {isPlayer ? "🏃" : isExit ? "🏁" : isStart && !isPlayer ? "🚪" : ""}
                        </div>
                    );
                }))}
            </div>

            {/* D-pad */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 40px 40px", gridTemplateRows: "40px 40px", gap: "2px", justifyItems: "center" }}>
                <div />
                <button onClick={() => move(-1, 0)} style={dpad}>▲</button>
                <div />
                <button onClick={() => move(0, -1)} style={dpad}>◀</button>
                <button onClick={() => move(1, 0)} style={dpad}>▼</button>
                <button onClick={() => move(0, 1)} style={dpad}>▶</button>
            </div>

            {won && <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🎉 Escaped!</div>}
        </div>
    );
};

const dpad = { width: 36, height: 36, fontSize: "14px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" };

export default MazeEscape;
