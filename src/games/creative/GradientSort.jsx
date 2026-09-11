/**
 * 🎮 Game 130: 컬러 그라데이션 정렬
 * 그라데이션 순서대로 정렬하세요
 */
import { useState, useCallback } from "react";

const genGradient = () => {
    const hue = Math.floor(Math.random() * 360);
    const count = 8;
    const colors = Array.from({ length: count }, (_, i) => {
        const lightness = 20 + (i / (count - 1)) * 60;
        return { hsl: `hsl(${hue}, 70%, ${lightness}%)`, lightness, idx: i };
    });
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    return { colors: shuffled, sorted: colors, hue };
};

const GradientSort = ({ onComplete }) => {
    const [puzzle] = useState(genGradient);
    const [order, setOrder] = useState(() => puzzle.colors.map((_, i) => i));
    const [selected, setSelected] = useState(null);
    const [moves, setMoves] = useState(0);
    const [done, setDone] = useState(false);

    const isSorted = useCallback((ord) => {
        const lightnesses = ord.map(i => puzzle.colors[i].lightness);
        return lightnesses.every((l, i) => i === 0 || l >= lightnesses[i - 1]) ||
            lightnesses.every((l, i) => i === 0 || l <= lightnesses[i - 1]);
    }, [puzzle.colors]);

    const handleClick = useCallback((idx) => {
        if (done) return;
        if (selected === null) {
            setSelected(idx);
        } else {
            const newOrder = [...order];
            [newOrder[selected], newOrder[idx]] = [newOrder[idx], newOrder[selected]];
            setOrder(newOrder);
            setMoves(m => m + 1);
            setSelected(null);
            if (isSorted(newOrder)) {
                setDone(true);
                const score = Math.max(30, 100 - moves * 5);
                setTimeout(() => onComplete(Math.min(100, score)), 500);
            }
        }
    }, [selected, order, moves, done, isSorted, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                이동: <span style={{ color: "#FFD700" }}>{moves}</span>
                <span style={{ marginLeft: 12, color: "#8892b0" }}>어둡→밝 또는 밝→어둡 순서로</span>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
                {order.map((colorIdx, i) => {
                    const color = puzzle.colors[colorIdx];
                    return (
                        <div key={i} onClick={() => handleClick(i)} style={{
                            width: 36, height: 80, borderRadius: "8px", cursor: "pointer",
                            background: color.hsl,
                            border: selected === i ? "3px solid #fff" : "2px solid rgba(0,0,0,0.2)",
                            transition: "all 0.15s",
                            transform: selected === i ? "translateY(-6px)" : "none",
                            boxShadow: selected === i ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                        }} />
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ fontSize: "11px", color: "#8892b0" }}>두 칸을 클릭하여 교환</div>
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🌈 그라데이션 완성! {moves}회</div>}
        </div>
    );
};

export default GradientSort;
