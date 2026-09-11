/**
 * 🎮 Game 104: Pipe Connect
 * Rotate pipes so water flows from tap to drain!
 * Generate a solvable puzzle, then scramble randomly
 */
import { useState, useCallback, useMemo } from "react";

const SIZE = 5;
const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };
const DIR_OFFSET = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

// Given a set of directions, pick the matching pipe type & rotation
const PIPE_LOOKUP = (() => {
    const table = {};
    const types = {
        line: [[["up", "down"], 0], [["left", "right"], 1]],
        bend: [[["up", "right"], 0], [["right", "down"], 1], [["down", "left"], 2], [["left", "up"], 3]],
        tee: [[["up", "left", "right"], 0], [["up", "right", "down"], 1], [["right", "down", "left"], 2], [["down", "left", "up"], 3]],
        cross: [[["up", "down", "left", "right"], 0]],
    };
    for (const [type, variants] of Object.entries(types)) {
        for (const [dirs, rot] of variants) {
            const key = [...dirs].sort().join(",");
            table[key] = { type, rotation: rot };
        }
    }
    return table;
})();

const CONNECTIONS = {
    line: { 0: ["up", "down"], 1: ["left", "right"], 2: ["up", "down"], 3: ["left", "right"] },
    bend: { 0: ["up", "right"], 1: ["right", "down"], 2: ["down", "left"], 3: ["left", "up"] },
    tee: { 0: ["up", "left", "right"], 1: ["up", "right", "down"], 2: ["right", "down", "left"], 3: ["down", "left", "up"] },
    cross: { 0: ["up", "down", "left", "right"], 1: ["up", "down", "left", "right"], 2: ["up", "down", "left", "right"], 3: ["up", "down", "left", "right"] },
};

// Generate a valid puzzle: build a spanning tree of connections, then derive pipe types
const generatePuzzle = () => {
    const connected = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => new Set())
    );
    const visited = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    const stack = [[0, 0]];
    visited[0][0] = true;

    while (stack.length > 0) {
        const [r, c] = stack[stack.length - 1];
        const dirs = Object.entries(DIR_OFFSET).sort(() => Math.random() - 0.5);
        let found = false;
        for (const [dir, [dr, dc]] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !visited[nr][nc]) {
                visited[nr][nc] = true;
                connected[r][c].add(dir);
                connected[nr][nc].add(OPPOSITE[dir]);
                stack.push([nr, nc]);
                found = true;
                break;
            }
        }
        if (!found) stack.pop();
    }

    // Extra connections for variety
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            for (const [dir, [dr, dc]] of Object.entries(DIR_OFFSET)) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !connected[r][c].has(dir) && Math.random() < 0.3) {
                    connected[r][c].add(dir);
                    connected[nr][nc].add(OPPOSITE[dir]);
                }
            }

    // Ensure every cell has at least 2 connections
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
            if (connected[r][c].size < 2) {
                const avail = Object.entries(DIR_OFFSET).filter(([dir, [dr, dc]]) => {
                    const nr = r + dr, nc = c + dc;
                    return nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !connected[r][c].has(dir);
                });
                while (connected[r][c].size < 2 && avail.length > 0) {
                    const i = Math.floor(Math.random() * avail.length);
                    const [dir, [dr, dc]] = avail.splice(i, 1)[0];
                    connected[r][c].add(dir);
                    connected[r + dr][c + dc].add(OPPOSITE[dir]);
                }
            }

    // Convert direction sets → pipe type & solved rotation
    const grid = [];
    for (let r = 0; r < SIZE; r++) {
        const row = [];
        for (let c = 0; c < SIZE; c++) {
            const key = [...connected[r][c]].sort().join(",");
            const lookup = PIPE_LOOKUP[key] || { type: "cross", rotation: 0 };
            row.push({ type: lookup.type, solvedRotation: lookup.rotation, rotation: lookup.rotation });
        }
        grid.push(row);
    }

    // Scramble rotations
    return grid.map(row => row.map(cell => ({
        ...cell,
        rotation: (cell.solvedRotation + 1 + Math.floor(Math.random() * 3)) % 4,
    })));
};

const isConnected = (grid) => {
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
            const conns = CONNECTIONS[grid[r][c].type][grid[r][c].rotation];
            for (const dir of conns) {
                const [dr, dc] = DIR_OFFSET[dir];
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
                if (!CONNECTIONS[grid[nr][nc].type][grid[nr][nc].rotation].includes(OPPOSITE[dir])) return false;
            }
        }
    return true;
};

// BFS: find connected cells from source (0,0)
const getFlowCells = (grid) => {
    const flow = new Set(["0-0"]);
    const queue = [[0, 0]];
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        for (const dir of CONNECTIONS[grid[r][c].type][grid[r][c].rotation]) {
            const [dr, dc] = DIR_OFFSET[dir];
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
            const key = `${nr}-${nc}`;
            if (flow.has(key)) continue;
            if (CONNECTIONS[grid[nr][nc].type][grid[nr][nc].rotation].includes(OPPOSITE[dir])) {
                flow.add(key);
                queue.push([nr, nc]);
            }
        }
    }
    return flow;
};

// Find broken connections (where a pipe points to neighbor but neighbor doesn't point back)
const getBrokenEdges = (grid) => {
    const broken = [];
    for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
            const conns = CONNECTIONS[grid[r][c].type][grid[r][c].rotation];
            for (const dir of conns) {
                const [dr, dc] = DIR_OFFSET[dir];
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
                if (!CONNECTIONS[grid[nr][nc].type][grid[nr][nc].rotation].includes(OPPOSITE[dir])) {
                    broken.push({ r, c, nr, nc, dir });
                }
            }
        }
    return broken;
};

const PIPE_PATHS = {
    line: { 0: "M20 0 L20 40", 1: "M0 20 L40 20", 2: "M20 0 L20 40", 3: "M0 20 L40 20" },
    bend: { 0: "M20 0 L20 20 L40 20", 1: "M40 20 L20 20 L20 40", 2: "M20 40 L20 20 L0 20", 3: "M0 20 L20 20 L20 0" },
    tee: { 0: "M0 20 L40 20 M20 0 L20 20", 1: "M20 0 L20 40 M20 20 L40 20", 2: "M0 20 L40 20 M20 20 L20 40", 3: "M20 0 L20 40 M20 20 L0 20" },
    cross: { 0: "M0 20 L40 20 M20 0 L20 40", 1: "M0 20 L40 20 M20 0 L20 40", 2: "M0 20 L40 20 M20 0 L20 40", 3: "M0 20 L40 20 M20 0 L20 40" },
};

const PipeConnect = ({ onComplete }) => {
    const [grid, setGrid] = useState(generatePuzzle);
    const [moves, setMoves] = useState(0);
    const [done, setDone] = useState(false);
    const [hintCell, setHintCell] = useState(null);

    const flowCells = useMemo(() => getFlowCells(grid), [grid]);
    const brokenEdges = useMemo(() => getBrokenEdges(grid), [grid]);
    const reachedGoal = flowCells.has(`${SIZE - 1}-${SIZE - 1}`);
    const progress = Math.round((flowCells.size / (SIZE * SIZE)) * 100);

    const rotate = useCallback((r, c) => {
        if (done) return;
        setHintCell(null);
        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        newGrid[r][c].rotation = (newGrid[r][c].rotation + 1) % 4;
        setGrid(newGrid);
        setMoves(m => m + 1);
        if (isConnected(newGrid)) {
            setDone(true);
            const score = Math.max(30, 100 - (moves - SIZE * 2) * 2);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [grid, moves, done, onComplete]);

    // Hint: find a pipe that isn't at its solved rotation
    const showHint = useCallback(() => {
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (grid[r][c].rotation !== grid[r][c].solvedRotation) {
                    setHintCell(`${r}-${c}`);
                    return;
                }
    }, [grid]);

    // Broken edge positions (for red indicators between cells)
    const brokenMarkers = useMemo(() => {
        const markers = new Set();
        brokenEdges.forEach(({ r, c, dir }) => {
            if (dir === "right") markers.add(`${r}-${c}-right`);
            else if (dir === "down") markers.add(`${r}-${c}-down`);
            else if (dir === "left") markers.add(`${r}-${c - 1}-right`);
            else if (dir === "up") markers.add(`${r - 1}-${c}-down`);
        });
        return markers;
    }, [brokenEdges]);

    const CELL = 44, GAP = 2;
    const gridW = SIZE * CELL + (SIZE - 1) * GAP;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            {/* Header */}
            <div style={{ display: "flex", gap: "12px", fontSize: "13px", alignItems: "center" }}>
                <span>🔧 <span style={{ color: "#FFD700" }}>{moves}</span>x</span>
                <span>💧 <span style={{ color: reachedGoal ? "#64ffda" : "#4D96FF" }}>{progress}%</span></span>
                {brokenEdges.length > 0 && <span style={{ color: "#FF6B6B", fontSize: "11px" }}>❌ broken {brokenEdges.length}spot(s)</span>}
            </div>

            {/* Progress bar */}
            <div style={{ width: gridW + 12, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: progress === 100 ? "#64ffda" : "#4D96FF", borderRadius: 3, transition: "width 0.3s" }} />
            </div>

            {/* Grid with source/sink labels */}
            <div style={{ position: "relative" }}>
                {/* Source label */}
                <div style={{
                    position: "absolute", top: -18, left: 6,
                    fontSize: "12px", display: "flex", alignItems: "center", gap: "3px",
                    color: "#4D96FF", fontWeight: "bold",
                }}>
                    🚰 Start
                </div>
                {/* Sink label */}
                <div style={{
                    position: "absolute", bottom: -18, right: 6,
                    fontSize: "12px", display: "flex", alignItems: "center", gap: "3px",
                    color: reachedGoal ? "#64ffda" : "#8892b0", fontWeight: "bold",
                }}>
                    {reachedGoal ? "✅ Arrived!" : "🔽 Goal"}
                </div>

                <div style={{
                    display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`, gap: `${GAP}px`,
                    padding: "6px", background: "#1a1a2e", borderRadius: "8px",
                    border: done ? "3px solid #64ffda" : "2px solid rgba(255,255,255,0.1)",
                    position: "relative",
                }}>
                    {grid.flat().map((cell, idx) => {
                        const r = Math.floor(idx / SIZE), c = idx % SIZE;
                        const inFlow = flowCells.has(`${r}-${c}`);
                        const isHint = hintCell === `${r}-${c}`;
                        const isSource = r === 0 && c === 0;
                        const isSink = r === SIZE - 1 && c === SIZE - 1;

                        return (
                            <div key={idx} style={{ position: "relative" }}>
                                <div onClick={() => rotate(r, c)} style={{
                                    width: CELL, height: CELL, cursor: done ? "default" : "pointer",
                                    background: isHint ? "rgba(255,215,0,0.15)"
                                        : isSource ? "rgba(77,150,255,0.2)"
                                            : isSink ? (reachedGoal ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.06)")
                                                : inFlow ? "rgba(77,150,255,0.08)" : "rgba(255,255,255,0.02)",
                                    borderRadius: "4px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s",
                                    border: isHint ? "2px solid rgba(255,215,0,0.5)" : isSource ? "2px solid rgba(77,150,255,0.3)" : isSink ? `2px solid ${reachedGoal ? "rgba(100,255,218,0.4)" : "rgba(255,255,255,0.1)"}` : "2px solid transparent",
                                }}>
                                    <svg width="40" height="40">
                                        <path d={PIPE_PATHS[cell.type][cell.rotation]}
                                            stroke={done ? "#64ffda" : inFlow ? "#4D96FF" : "#2a3a4e"}
                                            strokeWidth="6" strokeLinecap="round" fill="none" />
                                        <circle cx="20" cy="20" r="4"
                                            fill={done ? "#64ffda" : inFlow ? "#4D96FF" : "#2a3a4e"} />
                                        {/* Source/Sink icon */}
                                        {isSource && <text x="20" y="8" textAnchor="middle" fontSize="8" fill="#4D96FF">💧</text>}
                                        {isSink && <text x="20" y="38" textAnchor="middle" fontSize="8" fill={reachedGoal ? "#64ffda" : "#555"}>🔽</text>}
                                    </svg>
                                </div>
                                {/* Broken connection indicator: right */}
                                {brokenMarkers.has(`${r}-${c}-right`) && c < SIZE - 1 && (
                                    <div style={{
                                        position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: "#EF4444", zIndex: 2,
                                        fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                                        boxShadow: "0 0 4px rgba(239,68,68,0.5)",
                                    }}>✕</div>
                                )}
                                {/* Broken connection indicator: down */}
                                {brokenMarkers.has(`${r}-${c}-down`) && r < SIZE - 1 && (
                                    <div style={{
                                        position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: "#EF4444", zIndex: 2,
                                        fontSize: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                                        boxShadow: "0 0 4px rgba(239,68,68,0.5)",
                                    }}>✕</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Instructions & Hint */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ fontSize: "11px", color: "#8892b0", lineHeight: 1.3 }}>
                    Click pipes to rotate → <span style={{ color: "#4D96FF" }}>💧</span> to the <span style={{ color: "#64ffda" }}>🔽</span> to connect!
                </div>
                {!done && (
                    <button onClick={showHint} style={{
                        padding: "4px 10px", fontSize: "11px",
                        background: "rgba(255,215,0,0.1)", color: "#FFD700",
                        border: "1px solid rgba(255,215,0,0.3)", borderRadius: "8px",
                        cursor: "pointer", whiteSpace: "nowrap",
                    }}>💡 Hint</button>
                )}
            </div>

            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎉 Pipe Connect Done!</div>}
        </div>
    );
};

export default PipeConnect;
