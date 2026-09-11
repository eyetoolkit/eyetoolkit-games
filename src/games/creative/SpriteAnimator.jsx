/**
 * 🎮 Game 126: 스프라이트 애니메이터
 * 4프레임 도트 애니메이션 만들기
 */
import { useState, useCallback, useEffect, useRef } from "react";

const GRID = 8;
const FRAMES = 4;
const CELL = 24;
const COLORS = ["#000", "#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9B59B6", "#FF8C42", "#fff"];

const SpriteAnimator = ({ onComplete }) => {
    const [frames, setFrames] = useState(() =>
        Array.from({ length: FRAMES }, () => Array.from({ length: GRID }, () => Array(GRID).fill(0)))
    );
    const [currentFrame, setCurrentFrame] = useState(0);
    const [selectedColor, setSelectedColor] = useState(1);
    const [playing, setPlaying] = useState(false);
    const [playFrame, setPlayFrame] = useState(0);
    const [done, setDone] = useState(false);
    const intervalRef = useRef(null);

    const paint = useCallback((r, c) => {
        if (playing || done) return;
        setFrames(prev => {
            const newF = prev.map(f => f.map(row => [...row]));
            newF[currentFrame][r][c] = selectedColor;
            return newF;
        });
    }, [currentFrame, selectedColor, playing, done]);

    useEffect(() => {
        if (!playing) return;
        intervalRef.current = setInterval(() => {
            setPlayFrame(p => (p + 1) % FRAMES);
        }, 250);
        return () => clearInterval(intervalRef.current);
    }, [playing]);

    const submit = useCallback(() => {
        if (done) return;
        const filledCells = frames.reduce((sum, f) =>
            sum + f.reduce((s, row) => s + row.filter(c => c !== 0).length, 0), 0);
        const hasChange = frames.some((f, i) => i > 0 && f.some((row, r) => row.some((c, cc) => c !== frames[0][r][cc])));
        const score = Math.min(100, Math.floor(filledCells / 2) + (hasChange ? 30 : 0) + 20);
        setDone(true);
        setTimeout(() => onComplete(score), 500);
    }, [frames, done, onComplete]);

    const displayFrame = playing ? frames[playFrame] : frames[currentFrame];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                {playing ? `재생 중... 프레임 ${playFrame + 1}` : `프레임 ${currentFrame + 1}/${FRAMES}`}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID}, ${CELL}px)`, gap: "1px", padding: "4px", background: "#1a1a2e", borderRadius: "8px", border: "2px solid rgba(255,255,255,0.1)" }}>
                {displayFrame.flat().map((cell, idx) => {
                    const r = Math.floor(idx / GRID), c = idx % GRID;
                    return (
                        <div key={idx} onClick={() => paint(r, c)} style={{
                            width: CELL, height: CELL,
                            background: COLORS[cell], cursor: playing ? "default" : "pointer",
                            border: "1px solid rgba(255,255,255,0.05)",
                        }} />
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
                {COLORS.map((color, i) => (
                    <div key={i} onClick={() => setSelectedColor(i)} style={{
                        width: 24, height: 24, borderRadius: "4px", cursor: "pointer",
                        background: color, border: selectedColor === i ? "3px solid #64ffda" : "2px solid rgba(255,255,255,0.2)",
                    }} />
                ))}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
                {Array.from({ length: FRAMES }, (_, i) => (
                    <button key={i} onClick={() => { setCurrentFrame(i); setPlaying(false); }}
                        style={{
                            padding: "6px 12px", fontSize: "12px",
                            background: currentFrame === i && !playing ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.08)",
                            color: "white", border: currentFrame === i && !playing ? "1px solid #64ffda" : "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "6px", cursor: "pointer",
                        }}>F{i + 1}</button>
                ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setPlaying(!playing)} style={{
                    padding: "8px 16px", fontSize: "13px", fontWeight: "bold",
                    background: playing ? "rgba(255,107,107,0.2)" : "rgba(100,255,218,0.15)",
                    color: playing ? "#FF6B6B" : "#64ffda",
                    border: `1px solid ${playing ? "#FF6B6B" : "#64ffda"}`,
                    borderRadius: "8px", cursor: "pointer",
                }}>{playing ? "⏹ 정지" : "▶ 재생"}</button>
                <button onClick={submit} style={{
                    padding: "8px 16px", fontSize: "13px", fontWeight: "bold",
                    background: "rgba(255,217,61,0.15)", color: "#FFD93D",
                    border: "1px solid #FFD93D", borderRadius: "8px", cursor: "pointer",
                }}>✅ 제출</button>
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎨 작품 완성!</div>}
        </div>
    );
};

export default SpriteAnimator;
