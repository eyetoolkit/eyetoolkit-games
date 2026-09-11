/**
 * 🎮 Game 20: Rhythm Tap
 * Tap exactly on falling notes! (rhythm-game style)
 */
import { useCallback, useEffect, useRef, useState } from "react";

const LANES = 4;
const NOTE_SPEED = 3;
const GAME_TIME = 20;
const SPAWN_INTERVAL = 500;
const HIT_ZONE_Y = 85;
const HIT_THRESHOLD = 8;

const LANE_COLORS = ["#FF6B6B", "#FFD700", "#64ffda", "#0cbfff"];
const LANE_KEYS = ["d", "f", "j", "k"];

const RhythmTap = ({ onComplete }) => {
    const [notes, setNotes] = useState([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameActive, setGameActive] = useState(true);
    const [flashLane, setFlashLane] = useState(-1);
    const nextId = useRef(0);
    const scoreRef = useRef(0);
    const totalNotes = useRef(0);

    // Spawn notes
    useEffect(() => {
        if (!gameActive) return;
        const spawn = setInterval(() => {
            const lane = Math.floor(Math.random() * LANES);
            totalNotes.current += 1;
            setNotes((prev) => [
                ...prev,
                { id: nextId.current++, lane, y: 0, hit: false },
            ]);
        }, SPAWN_INTERVAL);
        return () => clearInterval(spawn);
    }, [gameActive]);

    // Timer
    useEffect(() => {
        if (!gameActive) return;
        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    setGameActive(false);
                    clearInterval(timer);
                    const finalScore = Math.min(100, Math.round((scoreRef.current / Math.max(1, totalNotes.current)) * 100));
                    setTimeout(() => onComplete(finalScore), 500);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameActive, onComplete]);

    // Move notes
    useEffect(() => {
        const anim = setInterval(() => {
            setNotes((prev) =>
                prev
                    .map((n) => ({ ...n, y: n.y + NOTE_SPEED }))
                    .filter((n) => n.y < 100 || n.hit)
                    .filter((n) => !(n.hit && n.y > HIT_ZONE_Y + 10))
            );
        }, 30);
        return () => clearInterval(anim);
    }, []);

    const hitLane = useCallback(
        (lane) => {
            if (!gameActive) return;
            setFlashLane(lane);
            setTimeout(() => setFlashLane(-1), 100);

            setNotes((prev) => {
                const idx = prev.findIndex(
                    (n) => n.lane === lane && !n.hit && Math.abs(n.y - HIT_ZONE_Y) < HIT_THRESHOLD
                );
                if (idx >= 0) {
                    scoreRef.current += 1;
                    setScore((s) => s + 1);
                    setCombo((c) => {
                        const newC = c + 1;
                        setMaxCombo((m) => Math.max(m, newC));
                        return newC;
                    });
                    return prev.map((n, i) => (i === idx ? { ...n, hit: true } : n));
                } else {
                    setCombo(0);
                }
                return prev;
            });
        },
        [gameActive]
    );

    useEffect(() => {
        const handleKey = (e) => {
            const idx = LANE_KEYS.indexOf(e.key.toLowerCase());
            if (idx >= 0) {
                e.preventDefault();
                hitLane(idx);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [hitLane]);

    const laneW = 60;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", color: "white", gap: "8px", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <span>⏱ <span style={{ color: timeLeft <= 5 ? "#FF6B6B" : "#FFD700" }}>{timeLeft}s</span></span>
                <span>🎵 <span style={{ color: "#64ffda" }}>{score}</span></span>
                <span>🔥 <span style={{ color: combo >= 10 ? "#FF6B6B" : combo >= 5 ? "#FFD700" : "#8892b0" }}>{combo}x</span></span>
            </div>
            {/* Timer bar */}
            <div style={{ width: LANES * (laneW + 4), height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ width: `${(timeLeft / GAME_TIME) * 100}%`, height: "100%", background: timeLeft <= 5 ? "#FF6B6B" : "linear-gradient(90deg, #FFD700, #64ffda)", borderRadius: 3, transition: "width 0.3s" }} />
            </div>

            <div style={{ display: "flex", gap: "4px", position: "relative", height: 300 }}>
                {Array.from({ length: LANES }, (_, lane) => (
                    <div
                        key={lane}
                        onClick={() => hitLane(lane)}
                        style={{
                            width: laneW,
                            height: 300,
                            background: flashLane === lane ? `${LANE_COLORS[lane]}22` : "rgba(255,255,255,0.03)",
                            borderRadius: "8px",
                            position: "relative",
                            overflow: "hidden",
                            border: `1px solid ${LANE_COLORS[lane]}33`,
                            cursor: "pointer",
                        }}
                    >
                        {/* Hit zone */}
                        <div style={{
                            position: "absolute",
                            bottom: `${100 - HIT_ZONE_Y}%`,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: `${LANE_COLORS[lane]}88`,
                            boxShadow: `0 0 8px ${LANE_COLORS[lane]}44`,
                        }} />
                        {/* Notes */}
                        {notes
                            .filter((n) => n.lane === lane)
                            .map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        top: `${n.y}%`,
                                        transform: "translate(-50%, -50%)",
                                        width: laneW - 16,
                                        height: 16,
                                        borderRadius: "4px",
                                        background: n.hit
                                            ? "rgba(255,255,255,0.3)"
                                            : `linear-gradient(135deg, ${LANE_COLORS[lane]}, ${LANE_COLORS[lane]}88)`,
                                        opacity: n.hit ? 0.3 : 1,
                                        transition: "opacity 0.2s",
                                        boxShadow: n.hit ? "none" : `0 0 6px ${LANE_COLORS[lane]}44`,
                                    }}
                                />
                            ))}
                        {/* Key label */}
                        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: LANE_COLORS[lane], fontWeight: "bold" }}>
                            {LANE_KEYS[lane].toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                {gameActive ? `Press D F J K or click the lanes!` : `Final: ${score} | Max combo: ${maxCombo}x`}
            </div>
        </div>
    );
};

export default RhythmTap;
