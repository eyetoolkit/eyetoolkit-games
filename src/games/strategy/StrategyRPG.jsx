/**
 * 🎮 Game 87: 전략 RPG 배틀 — 3x3 전장 그리드 + 캐릭터 비주얼
 */
import { useCallback, useState } from "react";

const UNITS = [
    { name: "전사", emoji: "⚔️", hp: 8, atk: 3, range: 1 },
    { name: "궁수", emoji: "🏹", hp: 5, atk: 4, range: 2 },
    { name: "마법사", emoji: "🔮", hp: 4, atk: 5, range: 3 },
];

const initBoard = () => {
    const board = Array.from({ length: 3 }, () => Array(3).fill(null));
    // Player units (bottom row)
    board[2][0] = { ...UNITS[0], team: "player", maxHP: 8 };
    board[2][1] = { ...UNITS[1], team: "player", maxHP: 5 };
    board[2][2] = { ...UNITS[2], team: "player", maxHP: 4 };
    // Enemy units (top row)
    board[0][0] = { ...UNITS[2], team: "enemy", maxHP: 4 };
    board[0][1] = { ...UNITS[0], team: "enemy", maxHP: 8 };
    board[0][2] = { ...UNITS[1], team: "enemy", maxHP: 5 };
    return board;
};

const StrategyRPG = ({ onComplete }) => {
    const [board, setBoard] = useState(initBoard);
    const [selected, setSelected] = useState(null);
    const [turn, setTurn] = useState(1);
    const [log, setLog] = useState("아군 유닛을 선택하세요!");
    const [flash, setFlash] = useState(null);
    const MAX_TURNS = 6;

    const handleCell = useCallback((r, c) => {
        const cell = board[r][c];

        if (!selected) {
            // Select player unit
            if (cell && cell.team === "player" && cell.hp > 0) {
                setSelected({ r, c });
                setLog(`${cell.emoji} ${cell.name} 선택 — 적을 클릭하세요`);
            }
            return;
        }

        // Attack enemy
        if (cell && cell.team === "enemy" && cell.hp > 0) {
            const attacker = board[selected.r][selected.c];
            const dist = Math.abs(selected.r - r) + Math.abs(selected.c - c);
            if (dist > attacker.range) {
                setLog("사거리 밖입니다!");
                setSelected(null);
                return;
            }

            const newBoard = board.map((row) => row.map((c2) => c2 ? { ...c2 } : null));
            newBoard[r][c].hp -= attacker.atk;
            setFlash({ r, c });
            setTimeout(() => setFlash(null), 300);

            if (newBoard[r][c].hp <= 0) {
                setLog(`${cell.emoji} 처치! 💀`);
                newBoard[r][c] = null;
            } else {
                setLog(`${attacker.emoji} → ${cell.emoji} ${attacker.atk}dmg!`);
            }

            // Enemy turn
            setTimeout(() => {
                newBoard.forEach((row, er) => row.forEach((enemy, ec) => {
                    if (!enemy || enemy.team !== "enemy" || enemy.hp <= 0) return;
                    // Find nearest player
                    let minDist = 99, target = null;
                    newBoard.forEach((pr, pri) => pr.forEach((p, pci) => {
                        if (!p || p.team !== "player" || p.hp <= 0) return;
                        const d = Math.abs(er - pri) + Math.abs(ec - pci);
                        if (d <= enemy.range && d < minDist) { minDist = d; target = { r: pri, c: pci }; }
                    }));
                    if (target) {
                        newBoard[target.r][target.c].hp -= enemy.atk;
                        if (newBoard[target.r][target.c].hp <= 0) newBoard[target.r][target.c] = null;
                    }
                }));
                setBoard(newBoard);
                setTurn((t) => t + 1);

                // Check win/lose
                const enemies = newBoard.flat().filter((u) => u && u.team === "enemy");
                const players = newBoard.flat().filter((u) => u && u.team === "player");
                if (enemies.length === 0) { setTimeout(() => onComplete(100), 500); setLog("🎉 승리!"); }
                else if (players.length === 0 || turn + 1 > MAX_TURNS) { setTimeout(() => onComplete(Math.round((1 - enemies.length / 3) * 60)), 500); setLog("패배..."); }
            }, 500);

            setSelected(null);
        } else {
            setSelected(null);
            setLog("아군 유닛을 선택하세요!");
        }
    }, [board, selected, turn, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`@keyframes dmgFlash { 0%,100% { background: transparent; } 50% { background: rgba(239,68,68,0.4); } }`}</style>

            <div style={{ fontSize: "13px" }}>턴 <span style={{ color: "#FFD700" }}>{turn}/{MAX_TURNS}</span></div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                {board.map((row, r) => row.map((cell, c) => {
                    const isSelected = selected && selected.r === r && selected.c === c;
                    const isFlash = flash && flash.r === r && flash.c === c;
                    return (
                        <button key={`${r}-${c}`} onClick={() => handleCell(r, c)}
                            style={{
                                width: 72, height: 72, borderRadius: "12px", cursor: "pointer",
                                background: isSelected ? "rgba(100,255,218,0.2)"
                                    : cell?.team === "enemy" ? "rgba(239,68,68,0.08)"
                                        : cell?.team === "player" ? "rgba(100,255,218,0.05)"
                                            : "rgba(255,255,255,0.03)",
                                border: isSelected ? "2px solid #64ffda"
                                    : cell?.team === "enemy" ? "1px solid rgba(239,68,68,0.3)"
                                        : cell?.team === "player" ? "1px solid rgba(100,255,218,0.2)"
                                            : "1px solid rgba(255,255,255,0.08)",
                                animation: isFlash ? "dmgFlash 0.3s ease" : "none",
                                color: "white", display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "2px",
                            }}>
                            {cell && (
                                <>
                                    <span style={{ fontSize: "24px" }}>{cell.emoji}</span>
                                    {/* Mini HP bar */}
                                    <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{
                                            width: `${(cell.hp / cell.maxHP) * 100}%`, height: "100%",
                                            background: cell.team === "player" ? "#64ffda" : "#EF4444",
                                            transition: "width 0.3s ease",
                                        }} />
                                    </div>
                                    <span style={{ fontSize: "8px", color: "#8892b0" }}>{cell.name}</span>
                                </>
                            )}
                        </button>
                    );
                }))}
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0", maxWidth: 240, textAlign: "center" }}>{log}</div>
        </div>
    );
};

export default StrategyRPG;
