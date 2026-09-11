/**
 * 🎮 Game 114: 도미노 체인
 * 도미노 타일을 연결해 점수를 얻으세요
 */
import { useState, useCallback } from "react";

const generateTiles = () => {
    const tiles = [];
    for (let a = 0; a <= 6; a++)
        for (let b = a; b <= 6; b++)
            tiles.push({ left: a, right: b });
    return tiles.sort(() => Math.random() - 0.5);
};

const DominoChain = ({ onComplete }) => {
    const [allTiles] = useState(generateTiles);
    const [hand, setHand] = useState(() => allTiles.slice(0, 7));
    const [chain, setChain] = useState(() => {
        const starter = allTiles[7];
        return [starter];
    });
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(0);
    const [cantPlay, setCantPlay] = useState(0);

    const leftEnd = chain[0].left;
    const rightEnd = chain[chain.length - 1].right;

    const canPlay = useCallback((tile) => {
        return tile.left === leftEnd || tile.right === leftEnd ||
            tile.left === rightEnd || tile.right === rightEnd;
    }, [leftEnd, rightEnd]);

    const playTile = useCallback((tileIdx) => {
        if (done) return;
        const tile = hand[tileIdx];
        if (!canPlay(tile)) return;

        const newChain = [...chain];
        const newHand = hand.filter((_, i) => i !== tileIdx);
        let pts = tile.left + tile.right;

        if (tile.right === leftEnd) {
            newChain.unshift(tile);
        } else if (tile.left === leftEnd) {
            newChain.unshift({ left: tile.right, right: tile.left });
        } else if (tile.left === rightEnd) {
            newChain.push(tile);
        } else if (tile.right === rightEnd) {
            newChain.push({ left: tile.right, right: tile.left });
        }

        const newScore = score + pts;
        setChain(newChain);
        setHand(newHand);
        setScore(newScore);
        setCantPlay(0);

        if (newHand.length === 0) {
            setDone(true);
            setTimeout(() => onComplete(100), 500);
        }
    }, [hand, chain, score, done, canPlay, leftEnd, rightEnd, onComplete]);

    const pass = useCallback(() => {
        if (done) return;
        const newCant = cantPlay + 1;
        setCantPlay(newCant);
        if (newCant >= 3) {
            setDone(true);
            const finalScore = Math.min(100, Math.floor((score / 50) * 100));
            setTimeout(() => onComplete(Math.max(20, finalScore)), 500);
        }
    }, [done, cantPlay, score, onComplete]);

    const hasPlayable = hand.some(t => canPlay(t));

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>점수: <span style={{ color: "#FFD700" }}>{score}</span></span>
                <span>남은 타일: <span style={{ color: "#64ffda" }}>{hand.length}</span></span>
            </div>
            {/* Chain display */}
            <div style={{
                display: "flex", gap: "2px", padding: "8px",
                background: "rgba(255,255,255,0.03)", borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflowX: "auto", maxWidth: "320px",
                flexWrap: "wrap", justifyContent: "center",
            }}>
                {chain.map((tile, i) => (
                    <div key={i} style={{
                        display: "flex", border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "4px", background: "rgba(255,255,255,0.06)",
                    }}>
                        <span style={{ padding: "4px 6px", fontSize: "14px", fontWeight: "bold" }}>{tile.left}</span>
                        <span style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", padding: "4px 6px", fontSize: "14px", fontWeight: "bold" }}>{tile.right}</span>
                    </div>
                ))}
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>
                양쪽 끝: <span style={{ color: "#64ffda" }}>{leftEnd}</span> | <span style={{ color: "#FF6B6B" }}>{rightEnd}</span>
            </div>
            {/* Hand */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "320px" }}>
                {hand.map((tile, i) => {
                    const playable = canPlay(tile);
                    return (
                        <div key={i} onClick={() => playable && playTile(i)} style={{
                            display: "flex", cursor: playable ? "pointer" : "not-allowed",
                            border: playable ? "2px solid #64ffda" : "2px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px", background: playable ? "rgba(100,255,218,0.1)" : "rgba(255,255,255,0.03)",
                            opacity: playable ? 1 : 0.5, transition: "all 0.15s",
                        }}>
                            <span style={{ padding: "6px 8px", fontSize: "16px", fontWeight: "bold" }}>{tile.left}</span>
                            <span style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", padding: "6px 8px", fontSize: "16px", fontWeight: "bold" }}>{tile.right}</span>
                        </div>
                    );
                })}
            </div>
            {!hasPlayable && !done && (
                <button onClick={pass} style={{
                    padding: "8px 20px", fontSize: "13px", background: "rgba(255,107,107,0.2)",
                    color: "#FF6B6B", border: "1px solid #FF6B6B", borderRadius: "8px", cursor: "pointer",
                }}>
                    패스 ({3 - cantPlay}회 남음)
                </button>
            )}
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>
                게임 종료! 점수: {score}
            </div>}
        </div>
    );
};

export default DominoChain;
