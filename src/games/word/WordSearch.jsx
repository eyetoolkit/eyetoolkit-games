/**
 * 🎮 Game 65: 단어 검색 — 비주얼 그리드 + 하이라이트 경로
 */
import { useCallback, useState } from "react";

const SIZE = 7;
const WORDS_LIST = [
    { word: "고양이", hint: "🐱" }, { word: "강아지", hint: "🐶" },
    { word: "토끼야", hint: "🐰" }, { word: "코끼리", hint: "🐘" },
    { word: "다람쥐", hint: "🐿️" },
];
const HANGUL = "가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호";

const genGrid = () => {
    const selected = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
    const g = Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => HANGUL.charAt(Math.floor(Math.random() * HANGUL.length)))
    );
    // Place word horizontally or vertically
    const dir = Math.random() > 0.5 ? "h" : "v";
    const maxR = dir === "v" ? SIZE - selected.word.length : SIZE - 1;
    const maxC = dir === "h" ? SIZE - selected.word.length : SIZE - 1;
    const r = Math.floor(Math.random() * (maxR + 1));
    const c = Math.floor(Math.random() * (maxC + 1));
    for (let i = 0; i < selected.word.length; i++) {
        if (dir === "h") g[r][c + i] = selected.word[i];
        else g[r + i][c] = selected.word[i];
    }
    return { grid: g, ...selected };
};

const WordSearch = ({ onComplete }) => {
    const [{ grid, word, hint }] = useState(genGrid);
    const [found, setFound] = useState([]);
    const [selected, setSelected] = useState([]);
    const [done, setDone] = useState(false);

    const handleClick = useCallback((r, c) => {
        if (done) return;
        const ns = [...selected, { r, c }];
        setSelected(ns);
        const str = ns.map((s) => grid[s.r][s.c]).join("");
        if (str === word) {
            setFound(ns);
            setDone(true);
            setTimeout(() => onComplete(100), 600);
        } else if (str.length >= word.length) {
            setSelected([]);
        }
    }, [grid, word, selected, done, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <style>{`
                @keyframes wordFound { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                @keyframes letterPop { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>

            <div style={{ fontSize: "14px" }}>
                찾으세요: <span style={{ fontSize: "20px", fontWeight: "bold", color: "#FFD700" }}>{hint} {word}</span>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "4px" }}>
                {word.split("").map((ch, i) => (
                    <div key={i} style={{
                        width: 24, height: 24, borderRadius: "6px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: "bold",
                        background: i < selected.length ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.04)",
                        border: i < selected.length ? "1px solid #64ffda" : "1px dashed rgba(255,255,255,0.15)",
                        color: i < selected.length ? "#64ffda" : "rgba(255,255,255,0.3)",
                        animation: i < selected.length ? "letterPop 0.2s ease" : "none",
                    }}>
                        {i < selected.length ? grid[selected[i].r][selected[i].c] : ch}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "3px",
                padding: "6px", borderRadius: "12px",
                background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)",
            }}>
                {grid.flat().map((ch, i) => {
                    const r = Math.floor(i / SIZE), c = i % SIZE;
                    const isSel = selected.some((s) => s.r === r && s.c === c);
                    const isFound = found.some((s) => s.r === r && s.c === c);

                    return (
                        <div key={i} onClick={() => handleClick(r, c)}
                            style={{
                                width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "15px", fontWeight: "bold",
                                borderRadius: "6px", cursor: done ? "default" : "pointer",
                                background: isFound ? "rgba(100,255,218,0.25)"
                                    : isSel ? "rgba(255,215,0,0.15)"
                                        : "rgba(255,255,255,0.04)",
                                border: isFound ? "2px solid #64ffda"
                                    : isSel ? "2px solid #FFD700"
                                        : "1px solid rgba(255,255,255,0.08)",
                                color: isFound ? "#64ffda" : isSel ? "#FFD700" : "rgba(255,255,255,0.7)",
                                animation: isFound ? "wordFound 0.5s ease" : "none",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => { if (!done && !isSel) { e.currentTarget.style.background = "rgba(255,215,0,0.08)"; e.currentTarget.style.transform = "scale(1.05)"; } }}
                            onMouseLeave={(e) => { if (!isSel && !isFound) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "scale(1)"; } }}
                        >{ch}</div>
                    );
                })}
            </div>

            <div style={{ fontSize: "10px", color: "#8892b0" }}>글자를 순서대로 클릭하세요!</div>

            {done && <div style={{ fontSize: "16px", fontWeight: "bold", color: "#64ffda" }}>🎉 찾았습니다!</div>}
        </div>
    );
};

export default WordSearch;
