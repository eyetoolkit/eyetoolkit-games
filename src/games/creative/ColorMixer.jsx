/**
 * 🎮 Game 56: 색 혼합 — RGB 슬라이더 + 타겟 매칭
 */
import { useCallback, useState } from "react";

const randColor = () => [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
const colorDist = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
const toCSS = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

const ROUNDS = 5;

const ColorMixer = ({ onComplete }) => {
    const [target, setTarget] = useState(randColor);
    const [mix, setMix] = useState([128, 128, 128]);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = useCallback(() => {
        if (feedback) return;
        const dist = colorDist(mix, target);
        const pts = Math.max(0, Math.round(20 - dist / 20));
        const newScore = score + pts;
        setScore(newScore);
        setFeedback({ dist: Math.round(dist), pts });

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.min(100, Math.round(newScore / (ROUNDS * 20) * 100)));
            else { setRound(n); setTarget(randColor()); setMix([128, 128, 128]); setFeedback(null); }
        }, 1200);
    }, [mix, target, round, score, feedback, onComplete]);

    const labels = ["R", "G", "B"];
    const sliderColors = ["#EF4444", "#22C55E", "#3B82F6"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                <span style={{ color: "#FFD700" }}>{round + 1}/{ROUNDS}</span> | 점수 <span style={{ color: "#64ffda" }}>{score}</span>
            </div>

            {/* Color comparison */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {/* Target */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#8892b0", marginBottom: 4 }}>목표</div>
                    <div style={{
                        width: 80, height: 80, borderRadius: "16px",
                        background: toCSS(target),
                        border: "3px solid rgba(255,255,255,0.2)",
                        boxShadow: `0 4px 20px ${toCSS(target)}44`,
                    }} />
                </div>

                <div style={{ fontSize: "20px", color: "#8892b0" }}>→</div>

                {/* Mixed */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#8892b0", marginBottom: 4 }}>나의 색</div>
                    <div style={{
                        width: 80, height: 80, borderRadius: "16px",
                        background: toCSS(mix),
                        border: feedback ? (feedback.dist < 50 ? "3px solid #64ffda" : feedback.dist < 100 ? "3px solid #FFD700" : "3px solid #FF6B6B") : "3px solid rgba(255,255,255,0.2)",
                        boxShadow: `0 4px 20px ${toCSS(mix)}44`,
                        transition: "all 0.3s ease",
                    }} />
                </div>
            </div>

            {/* Match indicator */}
            {feedback && (
                <div style={{
                    fontSize: "14px", fontWeight: "bold",
                    color: feedback.dist < 50 ? "#64ffda" : feedback.dist < 100 ? "#FFD700" : "#FF6B6B",
                }}>
                    {feedback.dist < 50 ? "🎯 거의 일치!" : feedback.dist < 100 ? "👍 비슷해요!" : "🤔 좀 멀어요"} (+{feedback.pts}점)
                </div>
            )}

            {/* RGB sliders */}
            <div style={{ width: 220, display: "flex", flexDirection: "column", gap: "8px" }}>
                {[0, 1, 2].map((i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                            fontSize: "14px", fontWeight: "bold", width: 18,
                            color: sliderColors[i],
                        }}>{labels[i]}</span>
                        <input type="range" min="0" max="255" value={mix[i]}
                            onChange={(e) => { const n = [...mix]; n[i] = +e.target.value; setMix(n); }}
                            disabled={!!feedback}
                            style={{ flex: 1, accentColor: sliderColors[i] }} />
                        <span style={{ fontSize: "11px", width: 28, textAlign: "right", color: sliderColors[i] }}>{mix[i]}</span>
                    </div>
                ))}
            </div>

            {!feedback && (
                <button onClick={handleSubmit} style={{
                    padding: "10px 28px", fontSize: "14px", fontWeight: "bold",
                    background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))",
                    color: "white", border: "2px solid rgba(124,58,237,0.4)",
                    borderRadius: "12px", cursor: "pointer",
                }}>🎨 제출!</button>
            )}
        </div>
    );
};

export default ColorMixer;
