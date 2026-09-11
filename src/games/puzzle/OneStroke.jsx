/**
 * 🎮 Game 6: 한붓그리기 — 진행률 바 + 경로 하이라이트 + 노드 넘버
 */
import { useCallback, useMemo, useState } from "react";

const PUZZLES = [
    {
        nodes: [[100, 50], [200, 50], [50, 150], [150, 150], [250, 150], [100, 250], [200, 250]],
        edges: [[0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [2, 5], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6]]
    },
    {
        nodes: [[75, 50], [225, 50], [50, 150], [150, 150], [250, 150], [75, 250], [225, 250]],
        edges: [[0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [2, 5], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6]]
    },
    {
        nodes: [[150, 40], [60, 120], [240, 120], [60, 220], [240, 220], [150, 300]],
        edges: [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]]
    },
];

const OneStroke = ({ onComplete }) => {
    const [puzzleIdx] = useState(() => Math.floor(Math.random() * PUZZLES.length));
    const puzzle = PUZZLES[puzzleIdx];
    const [path, setPath] = useState([]);
    const [usedEdges, setUsedEdges] = useState(new Set());
    const totalEdges = puzzle.edges.length;
    const progress = Math.round((usedEdges.size / totalEdges) * 100);

    const adjacency = useMemo(() => {
        const adj = puzzle.nodes.map(() => []);
        puzzle.edges.forEach(([a, b], idx) => { adj[a].push({ to: b, edgeIdx: idx }); adj[b].push({ to: a, edgeIdx: idx }); });
        return adj;
    }, [puzzle]);

    const handleNodeClick = useCallback((nodeIdx) => {
        if (path.length === 0) { setPath([nodeIdx]); return; }
        const last = path[path.length - 1];
        const link = adjacency[last].find((l) => l.to === nodeIdx && !usedEdges.has(l.edgeIdx));
        if (!link) return;
        const newUsed = new Set(usedEdges); newUsed.add(link.edgeIdx);
        setPath([...path, nodeIdx]); setUsedEdges(newUsed);
        if (newUsed.size === totalEdges) setTimeout(() => onComplete(100), 500);
    }, [path, usedEdges, adjacency, totalEdges, onComplete]);

    const reset = () => { setPath([]); setUsedEdges(new Set()); };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                간선: <span style={{ color: "#FFD700" }}>{usedEdges.size}/{totalEdges}</span>
                <span style={{ marginLeft: 10, color: "#8892b0" }}>({progress}%)</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: 240, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: progress === 100 ? "#64ffda" : "linear-gradient(90deg, #0cbfff, #A855F7)", borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <svg width="300" height="340" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: usedEdges.size === totalEdges ? "3px solid #64ffda" : "2px solid rgba(255,255,255,0.06)" }}>
                {/* Edges */}
                {puzzle.edges.map(([a, b], idx) => (
                    <line key={`e-${idx}`} x1={puzzle.nodes[a][0]} y1={puzzle.nodes[a][1]} x2={puzzle.nodes[b][0]} y2={puzzle.nodes[b][1]}
                        stroke={usedEdges.has(idx) ? "#0cbfff" : "rgba(255,255,255,0.2)"}
                        strokeWidth={usedEdges.has(idx) ? 4.5 : 2}
                        style={{ transition: "all 0.3s", filter: usedEdges.has(idx) ? "drop-shadow(0 0 4px rgba(12,191,255,0.4))" : "none" }}
                    />
                ))}
                {/* Nodes */}
                {puzzle.nodes.map(([x, y], idx) => {
                    const isInPath = path.includes(idx);
                    const isLast = path[path.length - 1] === idx;
                    const isAvailable = path.length > 0 && !isLast && adjacency[path[path.length - 1]].some((l) => l.to === idx && !usedEdges.has(l.edgeIdx));
                    return (
                        <g key={`n-${idx}`} onClick={() => handleNodeClick(idx)} style={{ cursor: "pointer" }}>
                            {isAvailable && <circle cx={x} cy={y} r={22} fill="none" stroke="#FFD700" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5} />}
                            <circle cx={x} cy={y} r={16} fill={isLast ? "#FFD700" : isInPath ? "#0cbfff" : "rgba(255,255,255,0.15)"}
                                stroke={isLast ? "#FFD700" : isAvailable ? "#FFD700" : "#0cbfff"} strokeWidth={2} style={{ transition: "all 0.2s" }} />
                            <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={isInPath ? "#fff" : "#aaa"} fontWeight="bold">{idx + 1}</text>
                            {isLast && (
                                <circle cx={x} cy={y} r={16} fill="none" stroke="#FFD700" strokeWidth={2} opacity={0.4}>
                                    <animate attributeName="r" from="16" to="26" dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                                </circle>
                            )}
                        </g>
                    );
                })}
            </svg>
            <button onClick={reset} style={{ padding: "6px 18px", background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>🔄 초기화</button>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>{usedEdges.size === totalEdges ? "🎉 완성!" : "점을 클릭하여 모든 선을 한 번씩 지나가세요"}</div>
        </div>
    );
};

export default OneStroke;
