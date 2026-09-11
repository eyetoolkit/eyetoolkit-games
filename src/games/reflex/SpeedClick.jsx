/**
 * 🎮 스피드 클릭 — 피버 모드 + 이동 타겟 + 콤보 멀티플라이어
 */
import { useCallback, useEffect, useRef, useState } from "react";

const DURATION = 12;

const SpeedClick = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const [time, setTime] = useState(DURATION);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const [ripples, setRipples] = useState([]);
    const [cps, setCps] = useState(0);
    const [bestCps, setBestCps] = useState(0);
    const [combo, setCombo] = useState(0);
    const [fever, setFever] = useState(false);
    const [targetSize, setTargetSize] = useState(160);
    const [floats, setFloats] = useState([]);
    const timerRef = useRef(null);
    const countRef = useRef(0);
    const comboRef = useRef(0);
    const lastClickRef = useRef(Date.now());

    useEffect(() => {
        if (started && !done) {
            timerRef.current = setInterval(() => {
                setTime((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        setDone(true);
                        setTimeout(() => onComplete(Math.min(100, Math.round(countRef.current * 1.5))), 300);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            const cpsTimer = setInterval(() => {
                setCps(Math.round(countRef.current / Math.max(1, DURATION - time)));
            }, 500);
            return () => { clearInterval(timerRef.current); clearInterval(cpsTimer); };
        }
    }, [started, done, onComplete]);

    // Fever mode timer
    useEffect(() => {
        if (fever) {
            const t = setTimeout(() => { setFever(false); }, 3000);
            return () => clearTimeout(t);
        }
    }, [fever]);

    // Vary target size every few seconds
    useEffect(() => {
        if (started && !done) {
            const moveInt = setInterval(() => {
                setTargetSize(120 + Math.random() * 60);
            }, 2500);
            return () => clearInterval(moveInt);
        }
    }, [started, done]);

    const handleClick = useCallback((e) => {
        if (done) return;
        if (!started) setStarted(true);

        const now = Date.now();
        const dt = now - lastClickRef.current;
        lastClickRef.current = now;

        countRef.current++;
        setCount(countRef.current);

        // Combo: fast clicks build combo
        if (dt < 300) {
            comboRef.current++;
            setCombo(comboRef.current);
            if (comboRef.current >= 10 && !fever) { setFever(true); }
        } else {
            comboRef.current = Math.max(0, comboRef.current - 1);
            setCombo(comboRef.current);
        }

        const currentCps = Math.round(countRef.current / Math.max(1, DURATION - time));
        if (currentCps > bestCps) setBestCps(currentCps);

        // Points float
        const pts = fever ? 3 : comboRef.current >= 5 ? 2 : 1;
        const fId = Date.now() + Math.random();
        const rect = e.currentTarget.getBoundingClientRect();
        const fx = e.clientX - rect.left;
        const fy = e.clientY - rect.top;
        setFloats(f => [...f.slice(-5), { id: fId, x: fx, y: fy, pts }]);
        setTimeout(() => setFloats(f => f.filter(fl => fl.id !== fId)), 600);

        // Ripple
        const id = Date.now();
        setRipples((r) => [...r.slice(-4), { id, x: fx, y: fy }]);
        setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);

        if (fever) countRef.current += 2; // Bonus clicks in fever
    }, [started, done, time, bestCps, fever]);

    const progress = (time / DURATION) * 100;
    const comboLevel = combo >= 10 ? 3 : combo >= 5 ? 2 : combo >= 2 ? 1 : 0;
    const comboColors = ["#8892b0", "#FFD700", "#A855F7", "#FF6B6B"];
    const bgGlow = fever
        ? "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)"
        : comboLevel >= 2
            ? "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)"
            : "none";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white", background: bgGlow }}>
            <style>{`
                @keyframes ripple { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(3); opacity: 0; } }
                @keyframes countPulse { 0% { transform: scale(1.2); } 100% { transform: scale(1); } }
                @keyframes feverPulse { 0%,100% { box-shadow: 0 0 30px rgba(255,107,107,0.5); } 50% { box-shadow: 0 0 60px rgba(255,107,107,0.8),0 0 80px rgba(255,215,0,0.4); } }
                @keyframes floatScore { 0% { transform: translateY(0) scale(1.3); opacity: 1; } 100% { transform: translateY(-40px) scale(0.8); opacity: 0; } }
                @keyframes comboFire { 0%,100% { color: #FFD700; } 50% { color: #FF6B6B; } }
            `}</style>

            {/* Stats */}
            <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "26px", fontWeight: "bold", color: "#FFD700", animation: count > 0 ? "countPulse 0.1s" : "none" }}>{count}</div>
                    <div style={{ color: "#8892b0" }}>클릭</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "26px", fontWeight: "bold", color: time <= 3 ? "#FF6B6B" : "#64ffda" }}>{time}s</div>
                    <div style={{ color: "#8892b0" }}>남은 시간</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "26px", fontWeight: "bold", color: "#A855F7" }}>{cps}</div>
                    <div style={{ color: "#8892b0" }}>CPS</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "26px", fontWeight: "bold", color: comboColors[comboLevel], animation: combo >= 10 ? "comboFire 0.5s infinite" : "none" }}>{combo}</div>
                    <div style={{ color: "#8892b0" }}>콤보</div>
                </div>
            </div>

            {/* Timer + Combo bar */}
            <div style={{ width: 280, display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{
                        width: `${progress}%`, height: "100%",
                        background: time <= 3 ? "#FF6B6B" : "linear-gradient(90deg, #64ffda, #3B82F6)",
                        borderRadius: 4, transition: "width 1s linear",
                    }} />
                </div>
                {/* Combo/Fever bar */}
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div style={{
                        width: `${Math.min(100, combo * 10)}%`, height: "100%",
                        background: fever ? "linear-gradient(90deg, #FF6B6B, #FFD700)" : "linear-gradient(90deg, #A855F7, #FF6B6B)",
                        borderRadius: 2, transition: "width 0.2s",
                    }} />
                </div>
                {fever && <div style={{ fontSize: "11px", color: "#FF6B6B", textAlign: "center", fontWeight: "bold" }}>🔥 FEVER MODE! x3 점수!</div>}
            </div>

            {/* Click target */}
            <div onClick={handleClick} style={{
                width: targetSize, height: targetSize, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "rgba(100,100,100,0.2)"
                    : fever ? `radial-gradient(circle, rgba(255,107,107,0.3), rgba(255,215,0,0.1))`
                        : `linear-gradient(135deg, rgba(${Math.min(255, count * 3)},100,100,0.2), rgba(100,${Math.min(255, 255 - count * 2)},218,0.15))`,
                border: fever ? "3px solid #FF6B6B" : "3px solid rgba(255,255,255,0.15)",
                cursor: done ? "default" : "pointer",
                position: "relative", overflow: "hidden",
                boxShadow: fever ? "0 0 40px rgba(255,107,107,0.4)" : `0 0 ${Math.min(30, count)}px rgba(100,255,218,${Math.min(0.4, count * 0.01)})`,
                transition: "all 0.3s ease",
                animation: fever ? "feverPulse 0.5s infinite" : "none",
                userSelect: "none",
            }}>
                {ripples.map((rp) => (
                    <div key={rp.id} style={{
                        position: "absolute", left: rp.x - 15, top: rp.y - 15,
                        width: 30, height: 30, borderRadius: "50%",
                        background: fever ? "rgba(255,107,107,0.4)" : "rgba(100,255,218,0.3)",
                        animation: "ripple 0.6s ease forwards",
                    }} />
                ))}
                {floats.map(f => (
                    <div key={f.id} style={{
                        position: "absolute", left: f.x - 10, top: f.y - 20,
                        fontSize: "14px", fontWeight: "bold",
                        color: f.pts >= 3 ? "#FF6B6B" : f.pts >= 2 ? "#A855F7" : "#FFD700",
                        animation: "floatScore 0.6s ease forwards",
                        pointerEvents: "none", zIndex: 2,
                    }}>+{f.pts}</div>
                ))}
                <span style={{
                    fontSize: done ? "16px" : "48px", fontWeight: "bold",
                    color: done ? "#8892b0" : fever ? "#FF6B6B" : "#FFD700",
                    animation: count > 0 ? "countPulse 0.1s ease" : "none",
                    position: "relative", zIndex: 1,
                }}>
                    {done ? "끝!" : !started ? "TAP!" : fever ? "🔥" : "👆"}
                </span>
            </div>

            {done && (
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>
                        🏆 {count}회 클릭!
                    </div>
                    <div style={{ fontSize: "12px", color: "#8892b0" }}>최고 {bestCps} CPS | 최대 콤보 x{Math.max(combo, 1)}</div>
                </div>
            )}
        </div>
    );
};

export default SpeedClick;
