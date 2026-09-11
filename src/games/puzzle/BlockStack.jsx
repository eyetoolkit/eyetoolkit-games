/**
 * 🎮 Game 150: Block Stack
 * Time your clicks to stack the tower
 */
import { useState, useEffect, useRef, useCallback } from "react";

const CANVAS_W = 300;
const CANVAS_H = 400;
const BLOCK_H = 20;
const MAX_BLOCKS = 15;

const BlockStack = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [blocks, setBlocks] = useState([{ x: 100, w: 100 }]);
    const [moving, setMoving] = useState({ x: 0, w: 100, dir: 1, speed: 2 });
    const [done, setDone] = useState(false);
    const [perfectCount, setPerfectCount] = useState(0);
    const animRef = useRef(null);
    const movingRef = useRef(moving);
    const blocksRef = useRef(blocks);
    const perfectRef = useRef(0);
    movingRef.current = moving;
    blocksRef.current = blocks;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

            // Grid lines
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            for (let y = 0; y < CANVAS_H; y += 20) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
            }

            blocksRef.current.forEach((block, i) => {
                const y = CANVAS_H - (i + 1) * BLOCK_H;
                const hue = (i * 22) % 360;
                // Block gradient
                const gradient = ctx.createLinearGradient(block.x, y, block.x + block.w, y + BLOCK_H);
                gradient.addColorStop(0, `hsl(${hue}, 75%, 55%)`);
                gradient.addColorStop(1, `hsl(${(hue + 20) % 360}, 70%, 48%)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(block.x, y, block.w, BLOCK_H - 2, 3);
                ctx.fill();
                // Highlight
                ctx.fillStyle = `hsla(${hue}, 80%, 80%, 0.3)`;
                ctx.fillRect(block.x + 2, y + 1, block.w - 4, 4);
                // Shadow
                ctx.fillStyle = `hsla(${hue}, 70%, 20%, 0.2)`;
                ctx.fillRect(block.x + 2, y + BLOCK_H - 5, block.w - 4, 3);
            });

            // Moving block
            const m = movingRef.current;
            const y = CANVAS_H - (blocksRef.current.length + 1) * BLOCK_H;
            const hue = (blocksRef.current.length * 22) % 360;
            const gradient = ctx.createLinearGradient(m.x, y, m.x + m.w, y + BLOCK_H);
            gradient.addColorStop(0, `hsl(${hue}, 85%, 60%)`);
            gradient.addColorStop(1, `hsl(${(hue + 20) % 360}, 80%, 52%)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(m.x, y, m.w, BLOCK_H - 2, 3);
            ctx.fill();
            // Glow
            ctx.shadowColor = `hsl(${hue}, 85%, 60%)`;
            ctx.shadowBlur = 10;
            ctx.fillStyle = "transparent";
            ctx.fillRect(m.x, y, m.w, BLOCK_H);
            ctx.shadowBlur = 0;

            animRef.current = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    useEffect(() => {
        if (done) return;
        const interval = setInterval(() => {
            setMoving(prev => {
                let newX = prev.x + prev.dir * prev.speed;
                let newDir = prev.dir;
                if (newX + prev.w > CANVAS_W) { newDir = -1; newX = CANVAS_W - prev.w; }
                if (newX < 0) { newDir = 1; newX = 0; }
                return { ...prev, x: newX, dir: newDir };
            });
        }, 16);
        return () => clearInterval(interval);
    }, [done]);

    const drop = useCallback(() => {
        if (done) return;
        const m = movingRef.current;
        const top = blocksRef.current[blocksRef.current.length - 1];

        const overlapStart = Math.max(m.x, top.x);
        const overlapEnd = Math.min(m.x + m.w, top.x + top.w);
        const overlapW = overlapEnd - overlapStart;

        if (overlapW <= 0) {
            setDone(true);
            const score = Math.min(100, Math.max(20, blocks.length * 7));
            setTimeout(() => onComplete(score), 500);
            return;
        }

        const isPerfect = Math.abs(overlapW - top.w) < 2;
        if (isPerfect) {
            perfectRef.current++;
            setPerfectCount(perfectRef.current);
        }

        const newBlock = { x: overlapStart, w: isPerfect ? top.w : overlapW };
        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);

        if (newBlocks.length >= MAX_BLOCKS) {
            setDone(true);
            const score = Math.min(100, 60 + perfectRef.current * 3);
            setTimeout(() => onComplete(score), 500);
            return;
        }

        const speed = 2 + newBlocks.length * 0.3;
        setMoving({ x: 0, w: isPerfect ? top.w : overlapW, dir: 1, speed });
    }, [blocks, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes towerGlow { 0%,100%{box-shadow:0 0 15px rgba(100,255,218,0.2)} 50%{box-shadow:0 0 30px rgba(100,255,218,0.4)} }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>Blocks: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{blocks.length}</span>/{MAX_BLOCKS}</span>
                <span>Perfect: <span style={{ color: "#64ffda", fontWeight: "bold" }}>{perfectCount}</span></span>
            </div>
            {/* Progress bar */}
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${(blocks.length / MAX_BLOCKS) * 100}%`, background: "linear-gradient(90deg, #FFD93D, #FF6B6B)", transition: "width 0.3s" }} />
            </div>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
                onClick={drop}
                style={{
                    borderRadius: "14px",
                    border: "2px solid rgba(255,255,255,0.08)",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))",
                    cursor: done ? "default" : "pointer",
                    animation: done && blocks.length >= MAX_BLOCKS ? "towerGlow 1.5s infinite" : "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }} />
            <div style={{ fontSize: "12px", color: "#8892b0" }}>Click to drop the block!</div>
            {done && <div style={{
                fontSize: "18px", fontWeight: "bold",
                color: "#64ffda",
                textShadow: "0 0 20px rgba(100,255,218,0.3)",
            }}>
                {blocks.length >= MAX_BLOCKS ? `🏗️ Perfect tower! ${perfectCount} perfect` : `Stacked ${blocks.length} blocks`}
            </div>}
        </div>
    );
};

export default BlockStack;
