/**
 * 🎮 Game 63: 행맨 — 그림 단계별 그리기
 */
import { useCallback, useState } from "react";

const WORDS = [
    { word: "프로그래밍", hint: "컴퓨터 관련" },
    { word: "인공지능", hint: "기술 분야" },
    { word: "스마트폰", hint: "전자기기" },
    { word: "대한민국", hint: "나라 이름" },
    { word: "올림픽", hint: "스포츠 행사" },
    { word: "도서관", hint: "건물 종류" },
];

const Hangman = ({ onComplete }) => {
    const [{ word, hint }] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [guessed, setGuessed] = useState(new Set());
    const [wrong, setWrong] = useState(0);
    const MAX_WRONG = 7;

    const handleGuess = useCallback((ch) => {
        if (guessed.has(ch) || wrong >= MAX_WRONG) return;
        const newGuessed = new Set([...guessed, ch]);
        setGuessed(newGuessed);

        if (!word.includes(ch)) {
            const nw = wrong + 1;
            setWrong(nw);
            if (nw >= MAX_WRONG) setTimeout(() => onComplete(10), 800);
        } else {
            const allFound = [...word].every((c) => newGuessed.has(c));
            if (allFound) setTimeout(() => onComplete(Math.max(20, 100 - wrong * 12)), 800);
        }
    }, [word, guessed, wrong, onComplete]);

    const revealed = [...word].map((c) => (guessed.has(c) ? c : "_"));
    const won = revealed.every((c) => c !== "_");
    const lost = wrong >= MAX_WRONG;

    // Hangman body parts
    const parts = [
        // 0: head
        <circle key="h" cx="150" cy="52" r="12" fill="none" stroke="white" strokeWidth="2" />,
        // 1: body
        <line key="b" x1="150" y1="64" x2="150" y2="100" stroke="white" strokeWidth="2" />,
        // 2: left arm
        <line key="la" x1="150" y1="72" x2="130" y2="90" stroke="white" strokeWidth="2" />,
        // 3: right arm
        <line key="ra" x1="150" y1="72" x2="170" y2="90" stroke="white" strokeWidth="2" />,
        // 4: left leg
        <line key="ll" x1="150" y1="100" x2="133" y2="120" stroke="white" strokeWidth="2" />,
        // 5: right leg
        <line key="rl" x1="150" y1="100" x2="167" y2="120" stroke="white" strokeWidth="2" />,
        // 6: face
        <g key="f">
            <circle cx="145" cy="49" r="1.5" fill="#FF6B6B" />
            <circle cx="155" cy="49" r="1.5" fill="#FF6B6B" />
            <path d="M 144 57 Q 150 62 156 57" fill="none" stroke="#FF6B6B" strokeWidth="1.5" />
        </g>,
    ];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                💡 <span style={{ color: "#8892b0" }}>{hint}</span> | 남은 기회: <span style={{ color: wrong > 4 ? "#FF6B6B" : "#64ffda" }}>{MAX_WRONG - wrong}</span>
            </div>

            {/* Hangman drawing */}
            <svg width="200" height="130" style={{ overflow: "visible" }}>
                {/* Gallows */}
                <line x1="100" y1="125" x2="200" y2="125" stroke="#8B6914" strokeWidth="3" />
                <line x1="120" y1="125" x2="120" y2="20" stroke="#8B6914" strokeWidth="3" />
                <line x1="120" y1="20" x2="150" y2="20" stroke="#8B6914" strokeWidth="3" />
                <line x1="150" y1="20" x2="150" y2="40" stroke="#8892b0" strokeWidth="1.5" />
                {/* Body parts */}
                {parts.slice(0, wrong)}
            </svg>

            {/* Word display */}
            <div style={{ display: "flex", gap: "6px" }}>
                {revealed.map((c, i) => (
                    <div key={i} style={{
                        width: 32, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", fontWeight: "bold",
                        borderBottom: c === "_" ? "3px solid rgba(255,215,0,0.5)" : "3px solid #64ffda",
                        color: c === "_" ? "transparent" : "#FFD700",
                        animation: won && c !== "_" ? `fadeInUp 0.3s ease ${i * 0.1}s both` : "none",
                    }}>{lost ? word[i] : c}</div>
                ))}
            </div>

            {/* Korean consonants keyboard */}
            {!won && !lost && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: 260, justifyContent: "center" }}>
                    {"ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅓㅗㅜㅡㅣㅐㅔ".split("").map((ch) => (
                        <button key={ch} onClick={() => handleGuess(ch)} disabled={guessed.has(ch)}
                            style={{
                                width: 28, height: 28, fontSize: "13px", fontWeight: "bold",
                                background: guessed.has(ch)
                                    ? (word.includes(ch) ? "rgba(100,255,218,0.2)" : "rgba(255,107,107,0.15)")
                                    : "rgba(255,255,255,0.06)",
                                color: guessed.has(ch) ? (word.includes(ch) ? "#64ffda" : "#FF6B6B") : "white",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: "6px", cursor: guessed.has(ch) ? "default" : "pointer",
                                opacity: guessed.has(ch) ? 0.5 : 1,
                            }}>{ch}</button>
                    ))}
                </div>
            )}

            {(won || lost) && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: won ? "#64ffda" : "#FF6B6B" }}>
                    {won ? "🎉 정답!" : `💀 정답: ${word}`}
                </div>
            )}

            <style>{`@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default Hangman;
