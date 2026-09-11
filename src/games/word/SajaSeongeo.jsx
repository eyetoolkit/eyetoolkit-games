/**
 * 🎮 Game 68: 사자성어 — 서예 스타일 한자 카드 + 정답 이펙트
 */
import { useCallback, useMemo, useState } from "react";

const QS = [
    { q: "일석__조", a: "이", choices: ["이", "삼", "사", "일"], meaning: "하나의 돌로 두 마리의 새를 잡다" },
    { q: "__전무후", a: "공", choices: ["공", "무", "전", "후"], meaning: "이전에도 이후에도 없다" },
    { q: "자업자__", a: "득", choices: ["득", "업", "자", "패"], meaning: "자기가 저지른 일의 결과를 자기가 받다" },
    { q: "이심__심", a: "전", choices: ["전", "이", "일", "합"], meaning: "마음에서 마음으로 전하다" },
    { q: "유비__환", a: "무", choices: ["무", "유", "비", "대"], meaning: "준비가 있으면 걱정이 없다" },
    { q: "동고__락", a: "동", choices: ["동", "서", "고", "낙"], meaning: "고생과 즐거움을 함께하다" },
    { q: "온고__신", a: "지", choices: ["지", "고", "온", "새"], meaning: "옛것을 익혀 새것을 알다" },
    { q: "사필__정", a: "귀", choices: ["귀", "필", "정", "사"], meaning: "모든 일은 반드시 바른 데로 돌아온다" },
];
const ROUNDS = 6;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SajaSeongeo = ({ onComplete }) => {
    const [qs] = useState(() => shuffle(QS));
    const shuffledChoices = useMemo(() => qs.map(q => shuffle(q.choices)), [qs]);
    const [round, setRound] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [showMeaning, setShowMeaning] = useState(false);
    const q = qs[round % qs.length];

    const handleChoice = useCallback((c) => {
        if (feedback) return;
        const isC = c === q.a;
        if (isC) setCorrect((x) => x + 1);
        setFeedback(isC ? "correct" : "wrong");
        setShowMeaning(true);

        setTimeout(() => {
            const n = round + 1;
            if (n >= ROUNDS) onComplete(Math.round(((correct + (isC ? 1 : 0)) / ROUNDS) * 100));
            else { setRound(n); setFeedback(null); setShowMeaning(false); }
        }, 1800);
    }, [q, round, correct, feedback, onComplete]);

    const chars = q.q.split("");
    const progress = ((round + (feedback ? 1 : 0)) / ROUNDS) * 100;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <style>{`
                @keyframes cardFlip { 0% { transform: rotateY(0); } 50% { transform: rotateY(90deg); } 100% { transform: rotateY(0); } }
                @keyframes glowPulse { 0%,100% { box-shadow: 0 0 10px rgba(255,215,0,0.3); } 50% { box-shadow: 0 0 25px rgba(255,215,0,0.6); } }
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div style={{ display: "flex", gap: "12px", fontSize: "13px", alignItems: "center" }}>
                <span>라운드 <span style={{ color: "#FFD700", fontWeight: "bold" }}>{round + 1}/{ROUNDS}</span></span>
                <span>정답 <span style={{ color: "#64ffda", fontWeight: "bold" }}>{correct}</span></span>
            </div>
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: "linear-gradient(90deg, #FFD700, #B8860B)", transition: "width 0.4s ease" }} />
            </div>

            {/* Scroll-style card */}
            <div style={{
                display: "flex", gap: "6px", padding: "16px 20px",
                background: "linear-gradient(135deg, rgba(139,69,19,0.15), rgba(160,82,45,0.08))",
                border: "2px solid rgba(205,133,63,0.3)", borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
                {chars.map((ch, i) => (
                    <div key={i} style={{
                        width: 48, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: ch === "_" ? "24px" : "28px",
                        fontWeight: "bold",
                        fontFamily: "'Noto Serif KR', serif",
                        color: ch === "_" ? "#FFD700" : "rgba(255,255,255,0.9)",
                        background: ch === "_"
                            ? "rgba(255,215,0,0.08)"
                            : "rgba(255,255,255,0.03)",
                        border: ch === "_"
                            ? "2px dashed rgba(255,215,0,0.4)"
                            : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        animation: feedback === "correct" && ch === "_" ? "glowPulse 0.6s ease infinite" : "none",
                    }}>
                        {ch === "_" ? (feedback ? q.a : "?") : ch}
                    </div>
                ))}
            </div>

            {/* Meaning */}
            {showMeaning && (
                <div style={{
                    fontSize: "12px", color: "#8892b0", fontStyle: "italic",
                    animation: "fadeInUp 0.4s ease",
                    maxWidth: 220, textAlign: "center",
                }}>💡 {q.meaning}</div>
            )}

            {/* Choice buttons */}
            {!feedback && (
                <div style={{ display: "flex", gap: "10px" }}>
                    {shuffledChoices[round % shuffledChoices.length].map((c, i) => (
                        <button key={i} onClick={() => handleChoice(c)} style={{
                            width: 54, height: 54, fontSize: "22px", fontWeight: "bold",
                            fontFamily: "'Noto Serif KR', serif",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                            color: "white",
                            border: "2px solid rgba(255,255,255,0.15)", borderRadius: "14px",
                            cursor: "pointer", transition: "all 0.2s ease",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.borderColor = "#FFD700"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                        >{c}</button>
                    ))}
                </div>
            )}

            {feedback && (
                <div style={{
                    fontSize: "18px", fontWeight: "bold",
                    color: feedback === "correct" ? "#64ffda" : "#FF6B6B",
                    animation: "fadeInUp 0.3s ease",
                }}>
                    {feedback === "correct" ? "✅ 정답!" : `❌ 정답: ${q.a}`}
                </div>
            )}
        </div>
    );
};

export default SajaSeongeo;
