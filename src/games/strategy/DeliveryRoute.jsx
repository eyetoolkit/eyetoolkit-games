/**
 * 🎮 Game 145: 배달 경로
 * 최단 경로로 모든 집에 배달하세요
 */
import { useState, useCallback } from "react";

const GRID = 6;

const createMap = () => {
    const houses = new Set();
    while (houses.size < 4) {
        const r = Math.floor(Math.random() * GRID);
        const c = Math.floor(Math.random() * GRID);
        if (r !== 0 || c !== 0) houses.add(`${r},${c}`);
    }
    return houses;
};

const DeliveryRoute = ({ onComplete }) => {
    const [houses] = useState(() => createMap());
    const [path, setPath] = useState([{ r: 0, c: 0 }]);
    const [delivered, setDelivered] = useState(new Set());
    const [done, setDone] = useState(false);

    const last = path[path.length - 1];

    const moveTo = useCallback((r, c) => {
        if (done) return;
        const dr = Math.abs(r - last.r);
        const dc = Math.abs(c - last.c);
        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            const newPath = [...path, { r, c }];
            setPath(newPath);
            const key = `${r},${c}`;
            if (houses.has(key) && !delivered.has(key)) {
                const newDelivered = new Set(delivered);
                newDelivered.add(key);
                setDelivered(newDelivered);
                if (newDelivered.size === houses.size) {
                    setDone(true);
                    const optimalSteps = houses.size * 3;
                    const score = Math.max(30, 100 - (newPath.length - optimalSteps) * 5);
                    setTimeout(() => onComplete(Math.min(100, score)), 500);
                }
            }
        }
    }, [path, last, houses, delivered, done, onComplete]);

    const undo = useCallback(() => {
        if (path.length <= 1 || done) return;
        const removed = path[path.length - 1];
        const key = `${removed.r},${removed.c}`;
        if (delivered.has(key)) {
            const newDelivered = new Set(delivered);
            newDelivered.delete(key);
            setDelivered(newDelivered);
        }
        setPath(path.slice(0, -1));
    }, [path, delivered, done]);

    const isAdjacent = (r, c) => {
        const dr = Math.abs(r - last.r);
        const dc = Math.abs(c - last.c);
        return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    };

    const progress = (delivered.size / houses.size) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <style>{`
                @keyframes truckBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
                @keyframes deliverPop { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
                .grid-cell:hover { transform: scale(1.05); }
            `}</style>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                <span>📦 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{delivered.size}/{houses.size}</span></span>
                <span>이동: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{path.length - 1}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #64ffda, #4D96FF)", transition: "width 0.4s ease" }} />
            </div>
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${GRID}, 46px)`, gap: "3px",
                padding: "8px", borderRadius: "14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
                {Array.from({ length: GRID * GRID }, (_, idx) => {
                    const r = Math.floor(idx / GRID), c = idx % GRID;
                    const isHouse = houses.has(`${r},${c}`);
                    const isDelivered = delivered.has(`${r},${c}`);
                    const isHere = last.r === r && last.c === c;
                    const isPath = path.some(p => p.r === r && p.c === c);
                    const canMove = !done && isAdjacent(r, c);
                    return (
                        <div key={idx} className="grid-cell" onClick={() => moveTo(r, c)} style={{
                            width: 46, height: 46, borderRadius: "8px",
                            cursor: canMove ? "pointer" : "default",
                            background: isHere
                                ? "linear-gradient(135deg, rgba(100,255,218,0.25), rgba(77,150,255,0.15))"
                                : isPath
                                    ? "rgba(100,255,218,0.08)"
                                    : canMove
                                        ? "rgba(255,255,255,0.06)"
                                        : "rgba(255,255,255,0.02)",
                            border: isHere
                                ? "2px solid #64ffda"
                                : canMove
                                    ? "2px dashed rgba(100,255,218,0.25)"
                                    : "1px solid rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px",
                            transition: "all 0.15s ease",
                            boxShadow: isHere ? "0 0 12px rgba(100,255,218,0.2)" : "none",
                            animation: isHere ? "truckBounce 0.5s ease" : isDelivered ? "deliverPop 0.3s ease" : "none",
                        }}>
                            {isHere ? "🚚" : isHouse ? (isDelivered ? "✅" : "🏠") : isPath ? "·" : ""}
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={undo} disabled={path.length <= 1 || done} style={{
                    padding: "8px 16px", fontSize: "13px", fontWeight: "600",
                    background: "rgba(255,107,107,0.1)", color: "#FF6B6B",
                    border: "1px solid rgba(255,107,107,0.3)", borderRadius: "10px",
                    cursor: path.length <= 1 || done ? "not-allowed" : "pointer",
                    opacity: path.length <= 1 || done ? 0.4 : 1,
                    transition: "all 0.2s",
                }}>
                    ↩ 되돌리기
                </button>
            </div>
            <div style={{ fontSize: "11px", color: "#8892b0" }}>인접 칸으로 이동하여 모든 🏠에 배달하세요!</div>
            {done && <div style={{
                fontSize: "18px", fontWeight: "bold", color: "#64ffda",
                textShadow: "0 0 15px rgba(100,255,218,0.3)",
            }}>📦 모든 배달 완료! {path.length - 1}회 이동</div>}
        </div>
    );
};

export default DeliveryRoute;
