/**
 * 🎮 Game 94: 볼링 (고도화)
 * SVG 레인 + 물리 시뮬레이션: 볼-핀 충돌, 핀-핀 체인반응, 속도/회전 애니메이션
 */
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_FRAMES = 5;
const PIN_RADIUS = 7;
const BALL_RADIUS = 10;
const LANE_LEFT = 50;
const LANE_RIGHT = 200;
const FRICTION = 0.97;
const PIN_FRICTION = 0.94;
const RESTITUTION = 0.6;
const PIN_RESTITUTION = 0.5;
const KNOCK_THRESHOLD = 2.5; // speed 이상이면 "쓰러짐" 판정

const createPinBodies = () => [
    { x: 125, y: 30 },
    { x: 112, y: 50 }, { x: 138, y: 50 },
    { x: 99, y: 70 }, { x: 125, y: 70 }, { x: 151, y: 70 },
    { x: 86, y: 90 }, { x: 112, y: 90 }, { x: 138, y: 90 }, { x: 164, y: 90 },
].map(p => ({ ...p, vx: 0, vy: 0, standing: true, rotation: 0, opacity: 1 }));

const BowlingGame = ({ onComplete }) => {
    const [frame, setFrame] = useState(1);
    const [roll, setRoll] = useState(1);
    const [score, setScore] = useState(0);
    const [pinBodies, setPinBodies] = useState(createPinBodies);
    const [ballX, setBallX] = useState(125);
    const [aimDir, setAimDir] = useState(1);
    const [aiming, setAiming] = useState(true);
    const [rolling, setRolling] = useState(false);
    const [ballY, setBallY] = useState(280);
    const [result, setResult] = useState(null);
    const aimRef = useRef(null);
    const simRef = useRef(null);

    // Aiming animation
    useEffect(() => {
        if (!aiming) return;
        aimRef.current = setInterval(() => {
            setBallX(x => {
                const nx = x + aimDir * 2.5;
                if (nx > LANE_RIGHT || nx < LANE_LEFT) setAimDir(d => -d);
                return Math.max(LANE_LEFT, Math.min(LANE_RIGHT, nx));
            });
        }, 30);
        return () => clearInterval(aimRef.current);
    }, [aiming, aimDir]);

    const throwBall = useCallback(() => {
        if (!aiming) return;
        setAiming(false);
        clearInterval(aimRef.current);
        setRolling(true);

        // Physics simulation state (mutable refs for perf)
        const ball = { x: ballX, y: 280, vx: 0, vy: -9 };
        // Clone current pin bodies for simulation
        const simPins = pinBodies.map(p => ({ ...p }));
        let simFinished = false;

        const simulate = () => {
            if (simFinished) return;

            // ---- Move ball ----
            ball.y += ball.vy;
            ball.x += ball.vx;
            ball.vx *= FRICTION;

            // Gutter walls bounce ball lightly
            if (ball.x < LANE_LEFT + BALL_RADIUS) {
                ball.x = LANE_LEFT + BALL_RADIUS;
                ball.vx = Math.abs(ball.vx) * 0.3;
            }
            if (ball.x > LANE_RIGHT - BALL_RADIUS) {
                ball.x = LANE_RIGHT - BALL_RADIUS;
                ball.vx = -Math.abs(ball.vx) * 0.3;
            }

            // ---- Ball-Pin collision ----
            for (const pin of simPins) {
                if (!pin.standing) continue;
                const dx = pin.x - ball.x;
                const dy = pin.y - ball.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = BALL_RADIUS + PIN_RADIUS;
                if (dist < minDist && dist > 0) {
                    // Normal vector
                    const nx = dx / dist;
                    const ny = dy / dist;
                    // Relative velocity (ball → pin)
                    const dvx = ball.vx - pin.vx;
                    const dvy = ball.vy - pin.vy;
                    const dvn = dvx * nx + dvy * ny;
                    if (dvn > 0) continue; // moving apart

                    // Ball is much heavier than pin (mass ratio ~5:1)
                    const ballMass = 5;
                    const pinMass = 1;
                    const impulse = (-(1 + RESTITUTION) * dvn) / (1 / ballMass + 1 / pinMass);

                    ball.vx -= (impulse / ballMass) * nx;
                    ball.vy -= (impulse / ballMass) * ny;
                    pin.vx += (impulse / pinMass) * nx;
                    pin.vy += (impulse / pinMass) * ny;

                    // Separate
                    const overlap = minDist - dist;
                    pin.x += nx * overlap * 0.8;
                    pin.y += ny * overlap * 0.8;
                    ball.x -= nx * overlap * 0.2;
                    ball.y -= ny * overlap * 0.2;
                }
            }

            // ---- Pin-Pin collision (chain reaction!) ----
            for (let i = 0; i < simPins.length; i++) {
                for (let j = i + 1; j < simPins.length; j++) {
                    const a = simPins[i];
                    const b = simPins[j];
                    // 쓰러진 핀도 잠시 동안 다른 핀을 칠 수 있음
                    if (a.opacity < 0.1 && b.opacity < 0.1) continue;
                    const speed_a = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
                    const speed_b = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                    if (speed_a < 0.3 && speed_b < 0.3) continue;

                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = PIN_RADIUS * 2;
                    if (dist < minDist && dist > 0) {
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const dvx = a.vx - b.vx;
                        const dvy = a.vy - b.vy;
                        const dvn = dvx * nx + dvy * ny;
                        if (dvn < 0) continue;

                        const impulse = (-(1 + PIN_RESTITUTION) * (-dvn)) / 2;
                        a.vx += impulse * nx;
                        a.vy += impulse * ny;
                        b.vx -= impulse * nx;
                        b.vy -= impulse * ny;

                        const overlap = minDist - dist;
                        a.x -= nx * overlap * 0.5;
                        a.y -= ny * overlap * 0.5;
                        b.x += nx * overlap * 0.5;
                        b.y += ny * overlap * 0.5;
                    }
                }
            }

            // ---- Update pin states ----
            for (const pin of simPins) {
                if (!pin.standing) {
                    // Fading out pins continue to move and slow down
                    pin.x += pin.vx;
                    pin.y += pin.vy;
                    pin.vx *= PIN_FRICTION;
                    pin.vy *= PIN_FRICTION;
                    pin.opacity = Math.max(0, pin.opacity - 0.025);
                    pin.rotation += pin.vx * 3;
                    continue;
                }
                const speed = Math.sqrt(pin.vx * pin.vx + pin.vy * pin.vy);
                if (speed > KNOCK_THRESHOLD) {
                    pin.standing = false; // 쓰러짐!
                }
                pin.x += pin.vx;
                pin.y += pin.vy;
                pin.vx *= PIN_FRICTION;
                pin.vy *= PIN_FRICTION;
                pin.rotation += pin.vx * 2;
            }

            // ---- Commit to React state ----
            setBallX(ball.x);
            setBallY(ball.y);
            setPinBodies(simPins.map(p => ({ ...p })));

            // ---- Check if simulation is done ----
            const ballDone = ball.y < -20 || ball.y > 310;
            const allPinsStopped = simPins.every(p => {
                if (!p.standing && p.opacity < 0.1) return true;
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                return speed < 0.3;
            });

            if (ballDone && allPinsStopped) {
                simFinished = true;
                cancelAnimationFrame(simRef.current);
                setRolling(false);

                const knockedCount = simPins.filter(p => !p.standing).length;
                const allDown = simPins.every(p => !p.standing);
                const isStrike = roll === 1 && allDown;
                const isSpare = roll === 2 && allDown;

                setScore(s => s + knockedCount);
                setResult(
                    isStrike ? "🎳 STRIKE!" :
                        isSpare ? "🎳 SPARE!" :
                            knockedCount > 0 ? `${knockedCount}개 쓰러짐!` : "😢 거터..."
                );

                // Preserve knocked-down pins as not standing for 2nd roll
                const finalPins = simPins.map(p => ({
                    ...p,
                    opacity: p.standing ? 1 : 0.15,
                }));
                setPinBodies(finalPins);

                setTimeout(() => {
                    if (roll === 1 && !allDown) {
                        // 2nd roll: reset positions for standing pins, keep knocked ones
                        setRoll(2);
                        setBallY(280);
                        setBallX(125);
                        const resetPins = createPinBodies().map((orig, i) => {
                            if (finalPins[i].standing) return orig;
                            return { ...orig, standing: false, opacity: 0 };
                        });
                        setPinBodies(resetPins);
                        setAiming(true);
                        setResult(null);
                    } else {
                        const nf = frame + 1;
                        if (nf > MAX_FRAMES) {
                            // score state may not yet reflect knockedCount, compute directly
                            const finalScore = score + knockedCount;
                            onComplete(Math.min(100, Math.round((finalScore / (MAX_FRAMES * 10)) * 100)));
                        } else {
                            setFrame(nf);
                            setRoll(1);
                            setPinBodies(createPinBodies());
                            setBallY(280);
                            setBallX(125);
                            setAiming(true);
                            setResult(null);
                        }
                    }
                }, 1200);
                return;
            }

            simRef.current = requestAnimationFrame(simulate);
        };

        simRef.current = requestAnimationFrame(simulate);
    }, [aiming, ballX, pinBodies, roll, frame, score, onComplete]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelAnimationFrame(simRef.current);
            clearInterval(aimRef.current);
        };
    }, []);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                프레임: <span style={{ color: "#FFD700" }}>{frame}/{MAX_FRAMES}</span> | 투구: {roll} | 점수: <span style={{ color: "#64ffda" }}>{score}</span>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: MAX_FRAMES }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < frame - 1 ? "#64ffda" : i === frame - 1 ? "#FFD700" : "rgba(255,255,255,0.1)" }} />
                ))}
            </div>

            <svg width={250} height={300} style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0d1b2a 100%)", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.06)" }}>
                {/* Lane */}
                <rect x={40} y={0} width={170} height={300} fill="rgba(139,90,43,0.15)" rx={4} />
                <rect x={45} y={0} width={1} height={300} fill="rgba(255,255,255,0.05)" />
                <rect x={204} y={0} width={1} height={300} fill="rgba(255,255,255,0.05)" />
                {/* Lane markers */}
                {[0, 1, 2, 3, 4].map(i => (
                    <circle key={i} cx={95 + i * 15} cy={200} r={2} fill="rgba(255,255,255,0.1)" />
                ))}
                {/* Gutters */}
                <rect x={30} y={0} width={10} height={300} fill="rgba(0,0,0,0.3)" rx={2} />
                <rect x={210} y={0} width={10} height={300} fill="rgba(0,0,0,0.3)" rx={2} />

                {/* Pins with physics animation */}
                {pinBodies.map((pin, i) => (
                    <g key={i} style={{
                        opacity: pin.opacity,
                        transition: pin.standing ? "none" : "opacity 0.3s",
                    }}>
                        {pin.opacity > 0.05 && (
                            pin.standing ? (
                                <>
                                    <circle cx={pin.x} cy={pin.y} r={PIN_RADIUS} fill="white" stroke="#ddd" strokeWidth={1} />
                                    <circle cx={pin.x} cy={pin.y - 2} r={3} fill="#EF4444" />
                                </>
                            ) : (
                                <g transform={`translate(${pin.x}, ${pin.y}) rotate(${pin.rotation})`}>
                                    <ellipse cx={0} cy={0} rx={PIN_RADIUS + 1} ry={PIN_RADIUS - 2}
                                        fill="rgba(255,255,255,0.6)" stroke="#ccc" strokeWidth={0.5} />
                                    <ellipse cx={-1} cy={-1} rx={3} ry={2} fill="rgba(239,68,68,0.5)" />
                                </g>
                            )
                        )}
                    </g>
                ))}

                {/* Ball */}
                {ballY > -15 && ballY < 310 && (
                    <>
                        <circle cx={ballX} cy={ballY} r={BALL_RADIUS} fill="#222" />
                        <circle cx={ballX - 2} cy={ballY - 2} r={2} fill="#444" />
                        <circle cx={ballX + 2} cy={ballY + 1} r={1.5} fill="#444" />
                        <circle cx={ballX - 1} cy={ballY + 3} r={1.5} fill="#444" />
                    </>
                )}

                {/* Aim guide */}
                {aiming && (
                    <line x1={ballX} y1={ballY - 12} x2={ballX} y2={30}
                        stroke="rgba(255,215,0,0.2)" strokeWidth={1} strokeDasharray="4,4" />
                )}
            </svg>

            {result && (
                <div style={{
                    fontSize: result.includes("STRIKE") || result.includes("SPARE") ? "18px" : "14px",
                    fontWeight: "bold",
                    color: result.includes("STRIKE") ? "#FFD700" : result.includes("SPARE") ? "#64ffda" : "white",
                    textShadow: result.includes("STRIKE") ? "0 0 12px rgba(255,215,0,0.5)" : "none",
                }}>
                    {result}
                </div>
            )}

            {aiming && (
                <button onClick={throwBall} style={{
                    padding: "10px 28px", fontSize: "15px", fontWeight: "bold",
                    background: "rgba(168,85,247,0.3)", color: "white",
                    border: "2px solid #A855F7", borderRadius: "12px", cursor: "pointer",
                }}>🎳 굴리기!</button>
            )}

            {rolling && <div style={{ fontSize: "12px", color: "#8892b0" }}>🎳 굴러가는 중...</div>}
        </div>
    );
};

export default BowlingGame;
