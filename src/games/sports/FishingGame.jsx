/**
 * 🎮 Game 95: 낚시 — 수면 애니메이션 + 낚시줄 + 물고기
 * 물고기가 바늘 근처에 오면 입질 → 바늘에 걸린 물고기를 당겨 올리기
 */
import { useCallback, useEffect, useRef, useState } from "react";

const FISH = [
    { emoji: "🐟", name: "붕어", points: 8, speed: 1.5 },
    { emoji: "🐠", name: "열대어", points: 15, speed: 2.5 },
    { emoji: "🐡", name: "복어", points: 20, speed: 3 },
    { emoji: "🦈", name: "상어", points: 30, speed: 4 },
    { emoji: "🐙", name: "문어", points: 12, speed: 1.8 },
];

const W = 260, H = 220;
const WATER_TOP = H * 0.35;
const HOOK_X = 80;
const BITE_DISTANCE = 20;

const FishingGame = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [phase, setPhase] = useState("idle"); // idle | sinking | waiting | biting | reeling | missed
    const [caught, setCaught] = useState([]);
    const [currentFish, setCurrentFish] = useState(null);
    const [round, setRound] = useState(0);
    const [lastCatch, setLastCatch] = useState(null);
    const MAX = 5;

    // Animation state in ref (for requestAnimationFrame)
    const anim = useRef({
        waveOffset: 0,
        hookY: 0,
        fishX: W / 2,
        fishY: WATER_TOP + 40,
        phase: "idle",
        currentFish: null,
        caught: [],
        startTime: Date.now(),
    });
    const animFrameRef = useRef(null);
    const biteCheckRef = useRef(null);
    const autoTimeoutRef = useRef(null);
    const sinkRef = useRef(null);
    const reelRef = useRef(null);

    // Sync state → ref
    useEffect(() => { anim.current.phase = phase; }, [phase]);
    useEffect(() => { anim.current.currentFish = currentFish; }, [currentFish]);
    useEffect(() => { anim.current.caught = caught; }, [caught]);

    // ═══ Canvas draw loop ═══
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            const a = anim.current;
            const elapsed = (Date.now() - a.startTime) / 1000;
            a.waveOffset = elapsed * 2;

            ctx.clearRect(0, 0, W, H);

            // ── 하늘 ──
            const sky = ctx.createLinearGradient(0, 0, 0, WATER_TOP);
            sky.addColorStop(0, "#87CEEB");
            sky.addColorStop(1, "#E0F0FC");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, W, WATER_TOP);

            // 해
            ctx.beginPath();
            ctx.arc(W - 40, 28, 18, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();

            // 구름
            ctx.font = "16px sans-serif";
            ctx.fillText("☁️", 30 + Math.sin(elapsed * 0.3) * 10, 22);
            ctx.fillText("☁️", 140 + Math.sin(elapsed * 0.2 + 1) * 8, 35);

            // ── 바다 ──
            const water = ctx.createLinearGradient(0, WATER_TOP, 0, H);
            water.addColorStop(0, "#1E90FF");
            water.addColorStop(0.5, "#1565C0");
            water.addColorStop(1, "#0D47A1");
            ctx.fillStyle = water;
            ctx.fillRect(0, WATER_TOP, W, H - WATER_TOP);

            // 파도
            ctx.beginPath();
            ctx.moveTo(0, WATER_TOP);
            for (let x = 0; x <= W; x += 2) {
                ctx.lineTo(x, WATER_TOP + Math.sin(x * 0.03 + a.waveOffset) * 4 + Math.sin(x * 0.07 + a.waveOffset * 1.5) * 2);
            }
            ctx.lineTo(W, WATER_TOP + 10);
            ctx.lineTo(0, WATER_TOP + 10);
            ctx.fillStyle = "rgba(30,144,255,0.5)";
            ctx.fill();

            // ── 낚싯대 ──
            ctx.beginPath();
            ctx.moveTo(35, WATER_TOP - 15);
            ctx.lineTo(HOOK_X, WATER_TOP - 50);
            ctx.strokeStyle = "#8B6914";
            ctx.lineWidth = 3;
            ctx.stroke();

            // 릴 부분
            ctx.beginPath();
            ctx.arc(42, WATER_TOP - 18, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#A0A0A0";
            ctx.fill();

            const isInWater = a.phase !== "idle";

            // ── 낚싯줄 + 바늘 ──
            if (isInWater) {
                const hookBottomY = WATER_TOP + a.hookY;

                // 줄
                ctx.beginPath();
                ctx.moveTo(HOOK_X, WATER_TOP - 50);
                // 약간 곡선으로 (자연스러운 낚싯줄)
                ctx.quadraticCurveTo(HOOK_X + 3, (WATER_TOP - 50 + hookBottomY) / 2, HOOK_X, hookBottomY);
                ctx.strokeStyle = "rgba(255,255,255,0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // 찌 (수면에)
                const bobberY = WATER_TOP + Math.sin(a.waveOffset * 2) * 2;
                ctx.beginPath();
                ctx.arc(HOOK_X, bobberY, 4, 0, Math.PI * 2);
                ctx.fillStyle = a.phase === "biting" ? "#EF4444" : "#FF6347";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(HOOK_X, bobberY, 4, 0, Math.PI * 2);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.stroke();

                if (a.phase === "biting") {
                    // 찌가 물에 잠기는 효과
                    ctx.beginPath();
                    ctx.arc(HOOK_X, bobberY, 8, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(239,68,68,0.4)";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // 바늘 (훅)
                ctx.beginPath();
                ctx.arc(HOOK_X, hookBottomY, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#C0C0C0";
                ctx.fill();

                // ── 물고기 위치 결정 ──
                if (a.currentFish) {
                    const fishSpeed = a.currentFish.speed;

                    if (a.phase === "waiting" || a.phase === "sinking") {
                        // 자유 수영: 바늘 쪽으로 접근하는 궤도
                        const t = elapsed * fishSpeed;
                        a.fishX = HOOK_X + Math.sin(t) * 65;
                        a.fishY = WATER_TOP + 20 + a.hookY * 0.6 + Math.cos(t * 1.3) * 18;
                        a.fishY = Math.max(WATER_TOP + 14, a.fishY);

                        // 거리 계산
                        const dx = a.fishX - HOOK_X;
                        const dy = a.fishY - hookBottomY;
                        a.distToHook = Math.sqrt(dx * dx + dy * dy);

                        // 물고기 그리기 (방향 포함)
                        const goingRight = Math.cos(elapsed * fishSpeed) > 0;
                        ctx.save();
                        ctx.font = "22px sans-serif";
                        if (!goingRight) {
                            ctx.scale(-1, 1);
                            ctx.fillText(a.currentFish.emoji, -(a.fishX + 11), a.fishY + 8);
                        } else {
                            ctx.fillText(a.currentFish.emoji, a.fishX - 11, a.fishY + 8);
                        }
                        ctx.restore();

                    } else if (a.phase === "biting" || a.phase === "reeling") {
                        // 🐟 바늘에 걸림: 물고기가 바늘 위치에 고정!
                        const fishDrawX = HOOK_X - 11;
                        const fishDrawY = hookBottomY + 4;

                        // 걸린 물고기 — 파닥거리는 효과
                        const wiggle = Math.sin(elapsed * 15) * 3;

                        ctx.save();
                        ctx.font = "22px sans-serif";
                        ctx.translate(fishDrawX + 11, fishDrawY);
                        ctx.rotate(wiggle * Math.PI / 180 * 5);
                        ctx.fillText(a.currentFish.emoji, -11, 0);
                        ctx.restore();

                        // 바늘-물고기 연결선 (짧은 줄)
                        ctx.beginPath();
                        ctx.moveTo(HOOK_X, hookBottomY);
                        ctx.lineTo(HOOK_X, hookBottomY + 6);
                        ctx.strokeStyle = "rgba(255,255,255,0.4)";
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // 물보라 이펙트
                        if (a.phase === "reeling") {
                            for (let i = 0; i < 3; i++) {
                                const splashX = HOOK_X + Math.sin(elapsed * 10 + i * 2) * 12;
                                const splashY = hookBottomY - 5 + Math.cos(elapsed * 8 + i * 3) * 5;
                                ctx.font = "10px sans-serif";
                                ctx.fillText("💧", splashX - 5, splashY);
                            }
                        }
                    }
                } else if (a.phase !== "sinking") {
                    // 미끼 표시 (물고기 없을 때)
                    ctx.font = "10px sans-serif";
                    ctx.fillText("🪱", HOOK_X + 3, hookBottomY + 5);
                }
            }

            // ── 하단: 잡은 물고기 ──
            if (a.caught.length > 0) {
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.fillRect(0, H - 28, W, 28);
                ctx.font = "14px sans-serif";
                ctx.fillStyle = "white";
                ctx.fillText("🪣", 6, H - 10);
                a.caught.forEach((f, i) => {
                    ctx.fillText(f.emoji, 26 + i * 22, H - 10);
                });
            }

            animFrameRef.current = requestAnimationFrame(draw);
        };

        animFrameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    // ═══ 던지기 ═══
    const cast = useCallback(() => {
        if (phase !== "idle" || round >= MAX) return;
        setLastCatch(null);
        const fish = FISH[Math.floor(Math.random() * FISH.length)];
        setCurrentFish(fish);
        setPhase("sinking");

        // 바늘 내리기
        anim.current.hookY = 0;
        let y = 0;
        sinkRef.current = setInterval(() => {
            y += 2;
            anim.current.hookY = y;
            if (y > 65) {
                clearInterval(sinkRef.current);
                setPhase("waiting");

                // 물고기가 바늘에 접근하면 입질
                setTimeout(() => {
                    biteCheckRef.current = setInterval(() => {
                        if (anim.current.distToHook < BITE_DISTANCE) {
                            clearInterval(biteCheckRef.current);
                            setPhase("biting");

                            // 2.5초 안에 안 당기면 놓침
                            autoTimeoutRef.current = setTimeout(() => {
                                if (anim.current.phase === "biting") {
                                    setPhase("idle");
                                    anim.current.hookY = 0;
                                    setLastCatch({ missed: true, fish });
                                    setCurrentFish(null);
                                    setRound(r => {
                                        const n = r + 1;
                                        if (n >= MAX) {
                                            setTimeout(() => {
                                                const total = anim.current.caught.reduce((s, f) => s + f.points, 0);
                                                onComplete(Math.min(100, total));
                                            }, 500);
                                        }
                                        return n;
                                    });
                                }
                            }, 2500);
                        }
                    }, 80);
                }, 400 + Math.random() * 600);
            }
        }, 50);
    }, [phase, round, onComplete]);

    // ═══ 당기기 ═══
    const reel = useCallback(() => {
        if (phase !== "biting") return;
        clearTimeout(autoTimeoutRef.current);
        setPhase("reeling");
        const fish = anim.current.currentFish;

        // 당기기 애니메이션
        reelRef.current = setInterval(() => {
            anim.current.hookY -= 4;
            if (anim.current.hookY <= 0) {
                clearInterval(reelRef.current);
                anim.current.hookY = 0;
                setCaught(arr => [...arr, fish]);
                setPhase("idle");
                setCurrentFish(null);
                setLastCatch({ missed: false, fish });

                setRound(r => {
                    const n = r + 1;
                    if (n >= MAX) {
                        setTimeout(() => {
                            const total = [...anim.current.caught, fish].reduce((s, f) => s + f.points, 0);
                            onComplete(Math.min(100, total));
                        }, 500);
                    }
                    return n;
                });
            }
        }, 30);
    }, [phase, onComplete]);

    // Cleanup
    useEffect(() => {
        return () => {
            clearInterval(biteCheckRef.current);
            clearTimeout(autoTimeoutRef.current);
            clearInterval(sinkRef.current);
            clearInterval(reelRef.current);
        };
    }, []);

    const totalPoints = caught.reduce((s, f) => s + f.points, 0);
    const isDone = round >= MAX;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span>🎣 {round}/{MAX}</span>
                <span>점수: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{totalPoints}</span></span>
            </div>

            <canvas ref={canvasRef} width={W} height={H}
                style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }} />

            {/* 상태 메시지 */}
            {phase === "biting" && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#EF4444", animation: "pulse 0.5s ease infinite" }}>
                    🔔 {currentFish?.emoji} {currentFish?.name} 입질! 빨리 당겨!
                </div>
            )}
            {phase === "reeling" && (
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#64ffda", animation: "pulse 0.3s ease infinite" }}>
                    🎣 끌어올리는 중...!
                </div>
            )}
            {phase === "waiting" && (
                <div style={{ fontSize: "12px", color: "#8892b0" }}>
                    🐟 물고기가 바늘에 다가오고 있어요...
                </div>
            )}
            {phase === "sinking" && (
                <div style={{ fontSize: "12px", color: "#8892b0" }}>
                    🪝 미끼를 내리는 중...
                </div>
            )}
            {phase === "idle" && lastCatch && !isDone && (
                <div style={{ fontSize: "14px", color: lastCatch.missed ? "#FF6B6B" : "#64ffda", animation: "fadeIn 0.3s ease" }}>
                    {lastCatch.missed
                        ? `😢 ${lastCatch.fish.emoji} ${lastCatch.fish.name}(을)를 놓쳤어요...`
                        : `✨ ${lastCatch.fish.emoji} ${lastCatch.fish.name} 잡았다! +${lastCatch.fish.points}점`
                    }
                </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={cast} disabled={phase !== "idle" || isDone} style={{
                    padding: "10px 20px", fontSize: "13px", fontWeight: "bold",
                    background: phase !== "idle" || isDone ? "rgba(100,100,100,0.3)" : "rgba(59,130,246,0.2)",
                    color: "white", border: `2px solid ${phase !== "idle" || isDone ? "#666" : "#3B82F6"}`,
                    borderRadius: "12px", cursor: phase !== "idle" || isDone ? "default" : "pointer",
                    transition: "all 0.2s",
                }}>🎣 던지기</button>
                <button onClick={reel} disabled={phase !== "biting"} style={{
                    padding: "10px 20px", fontSize: "13px", fontWeight: "bold",
                    background: phase === "biting" ? "rgba(239,68,68,0.3)" : "rgba(100,100,100,0.2)",
                    color: "white", border: `2px solid ${phase === "biting" ? "#EF4444" : "#444"}`,
                    borderRadius: "12px", cursor: phase === "biting" ? "pointer" : "default",
                    animation: phase === "biting" ? "rpsBounce 0.3s ease infinite" : "none",
                    transition: "all 0.2s",
                }}>🐟 당기기!</button>
            </div>

            <style>{`
                @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
                @keyframes rpsBounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default FishingGame;
