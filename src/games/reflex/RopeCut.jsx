/**
 * 🎮 Game 109: 로프 자르기
 * 로프(체인)를 순서대로 잘라 캔디를 입에 넣기
 */
import { useState, useCallback } from "react";

const LEVELS = [
    {
        candyStart: { x: 150, y: 40 },
        mouth: { x: 150, y: 380 },
        ropes: [
            { id: 0, anchor: { x: 80, y: 30 }, segments: 5 },
            { id: 1, anchor: { x: 220, y: 30 }, segments: 5 },
        ],
        stars: [{ x: 150, y: 150 }, { x: 100, y: 250 }],
    },
    {
        candyStart: { x: 100, y: 50 },
        mouth: { x: 200, y: 380 },
        ropes: [
            { id: 0, anchor: { x: 50, y: 40 }, segments: 4 },
            { id: 1, anchor: { x: 200, y: 60 }, segments: 6 },
            { id: 2, anchor: { x: 150, y: 20 }, segments: 3 },
        ],
        stars: [{ x: 150, y: 180 }, { x: 200, y: 280 }, { x: 100, y: 300 }],
    },
];

const RopeCut = ({ onComplete }) => {
    const [levelIdx] = useState(() => Math.floor(Math.random() * LEVELS.length));
    const level = LEVELS[levelIdx];
    const [cutRopes, setCutRopes] = useState(new Set());
    const [candyPos, setCandyPos] = useState(level.candyStart);
    const [collectedStars, setCollectedStars] = useState(new Set());
    const [falling, setFalling] = useState(false);
    const [done, setDone] = useState(false);
    const [result, setResult] = useState(null);

    const simulateFall = useCallback((newCutRopes) => {
        // Simple physics: candy falls down toward mouth with some gravity
        const mouth = level.mouth;
        setFalling(true);

        let posY = candyPos.y;
        let posX = candyPos.x;
        const collected = new Set(collectedStars);
        let stepCount = 0;

        const fallStep = () => {
            stepCount++;
            posY += 8;

            // Slight horizontal drift toward remaining rope anchors
            const activeRopes = level.ropes.filter(r => !newCutRopes.has(r.id));
            if (activeRopes.length > 0) {
                const avgX = activeRopes.reduce((s, r) => s + r.anchor.x, 0) / activeRopes.length;
                posX += (avgX - posX) * 0.05;
            } else {
                posX += (mouth.x - posX) * 0.03;
            }

            // Check star collection
            level.stars.forEach((star, i) => {
                if (!collected.has(i) && Math.abs(posX - star.x) < 25 && Math.abs(posY - star.y) < 25) {
                    collected.add(i);
                    setCollectedStars(new Set(collected));
                }
            });

            setCandyPos({ x: posX, y: posY });

            // Check mouth reach
            if (Math.abs(posX - mouth.x) < 35 && Math.abs(posY - mouth.y) < 35) {
                setDone(true);
                setResult("success");
                const starScore = collected.size * 20;
                const finalScore = Math.min(100, 40 + starScore);
                setTimeout(() => onComplete(finalScore), 500);
                return;
            }

            // Off screen
            if (posY > 450) {
                setDone(true);
                setResult("fail");
                setTimeout(() => onComplete(30), 500);
                return;
            }

            if (stepCount < 60) {
                setTimeout(fallStep, 30);
            }
        };

        fallStep();
    }, [candyPos, level, collectedStars, onComplete]);

    const cutRope = useCallback((ropeId) => {
        if (done || cutRopes.has(ropeId)) return;
        const newCut = new Set(cutRopes);
        newCut.add(ropeId);
        setCutRopes(newCut);

        // If all ropes cut, candy falls freely
        if (newCut.size === level.ropes.length) {
            simulateFall(newCut);
        } else {
            simulateFall(newCut);
        }
    }, [done, cutRopes, level.ropes.length, simulateFall]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                별: <span style={{ color: "#FFD700" }}>{collectedStars.size}/{level.stars.length}</span>
                <span style={{ marginLeft: 12, color: "#8892b0" }}>로프를 클릭해 자르세요</span>
            </div>
            <div style={{
                width: 300, height: 420, position: "relative",
                background: "rgba(255,255,255,0.02)", borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
            }}>
                {/* Ropes */}
                {level.ropes.map(rope => (
                    <div
                        key={rope.id}
                        onClick={() => cutRope(rope.id)}
                        style={{
                            position: "absolute",
                            left: Math.min(rope.anchor.x, candyPos.x) - 5,
                            top: rope.anchor.y,
                            width: Math.abs(rope.anchor.x - candyPos.x) + 10,
                            height: Math.abs(candyPos.y - rope.anchor.y) + 5,
                            cursor: cutRopes.has(rope.id) ? "default" : "pointer",
                            opacity: cutRopes.has(rope.id) ? 0.2 : 1,
                            zIndex: 2,
                        }}
                    >
                        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                            <line
                                x1={rope.anchor.x - Math.min(rope.anchor.x, candyPos.x) + 5}
                                y1={0}
                                x2={candyPos.x - Math.min(rope.anchor.x, candyPos.x) + 5}
                                y2={candyPos.y - rope.anchor.y}
                                stroke={cutRopes.has(rope.id) ? "#666" : "#8B4513"}
                                strokeWidth="3"
                                strokeDasharray={cutRopes.has(rope.id) ? "4,4" : "none"}
                            />
                        </svg>
                    </div>
                ))}

                {/* Stars */}
                {level.stars.map((star, i) => (
                    <div key={i} style={{
                        position: "absolute", left: star.x - 12, top: star.y - 12,
                        fontSize: "24px", opacity: collectedStars.has(i) ? 0.2 : 1,
                        transition: "opacity 0.3s", zIndex: 1,
                    }}>
                        ⭐
                    </div>
                ))}

                {/* Candy */}
                <div style={{
                    position: "absolute",
                    left: candyPos.x - 15, top: candyPos.y - 15,
                    fontSize: "28px", zIndex: 3,
                    transition: falling ? "none" : "all 0.3s",
                }}>
                    🍬
                </div>

                {/* Mouth */}
                <div style={{
                    position: "absolute",
                    left: level.mouth.x - 20, top: level.mouth.y - 15,
                    fontSize: "32px", zIndex: 1,
                }}>
                    👄
                </div>
            </div>
            {done && (
                <div style={{
                    fontSize: "16px", fontWeight: "bold",
                    color: result === "success" ? "#64ffda" : "#FF6B6B",
                }}>
                    {result === "success" ? "🎉 성공!" : "😢 실패..."} 별 {collectedStars.size}개
                </div>
            )}
        </div>
    );
};

export default RopeCut;
