/**
 * 🎮 Game 149: Color Code (Mastermind)
 * Crack the 4-color code
 * - tutorial overlay (3 steps)
 * - slot select + palette UX
 * - reset & help buttons
 */
import { useState, useCallback } from "react";

const COLORS = ["#FF6B6B", "#4D96FF", "#6BCB77", "#FFD93D", "#9B59B6", "#FF8C42"];
const COLOR_NAMES = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"];
const CODE_LEN = 4;
const MAX_GUESSES = 8;

// ═══════════════════════════════════════════════════
// tutorial component
// ═══════════════════════════════════════════════════
const TUTORIAL_STEPS = [
    {
        icon: "🎨",
        title: "Pick a color",
        content: "Pick a color from the palette below to fill the empty slots.\nTap a slot to select it (it glows), then click a palette color to place!",
        visual: (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "12px 0" }}>
                {/* slot example */}
                <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF6B6B", border: "2px solid rgba(255,255,255,0.3)" }} />
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4D96FF", border: "2px solid rgba(255,255,255,0.3)" }} />
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px dashed rgba(100,255,218,0.6)", background: "rgba(100,255,218,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>✨</div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }} />
                </div>
                <span style={{ fontSize: "18px" }}>←</span>
                <span style={{ fontSize: "12px", color: "#8892b0" }}>select, then place</span>
            </div>
        ),
    },
    {
        icon: "🔍",
        title: "Reading feedback",
        content: "Submit a guess to get hints!\nAnalyze the colors and positions to find the code.",
        visual: (
            <div style={{ margin: "12px 0" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "20px" }}>⚫</span>
                        <span style={{ fontSize: "13px", color: "#64ffda", lineHeight: 1.5 }}>Right color & position!</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "20px" }}>⚪</span>
                        <span style={{ fontSize: "13px", color: "#FFD93D", lineHeight: 1.5 }}>Right color, wrong position</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                        <span style={{ fontSize: "20px" }}>·</span>
                        <span style={{ fontSize: "13px", color: "#8892b0", lineHeight: 1.5 }}>Color not in code</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        icon: "🧠",
        title: "Strategy & rules",
        content: "Guess the 4-color secret code within 8 tries!\nColors can repeat.",
        visual: (
            <div style={{ margin: "12px 0" }}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", fontSize: "12px", color: "#8892b0" }}>
                    <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>💡 Learn colors from first guess</span>
                    <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>💡 Fix ⚫ positions, then search the rest</span>
                    <span style={{ padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>⚠️ Colors can repeat!</span>
                </div>
            </div>
        ),
    },
];

const TutorialOverlay = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const current = TUTORIAL_STEPS[step];
    const isLast = step === TUTORIAL_STEPS.length - 1;

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(4px)",
                borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                style={{
                    width: "min(340px, 90%)",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "24px 20px 20px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    color: "white",
                    textAlign: "center",
                    animation: "tutFadeIn 0.3s ease",
                }}
            >
                {/* step indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "16px" }}>
                    {TUTORIAL_STEPS.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === step ? "24px" : "8px",
                                height: "8px",
                                borderRadius: "4px",
                                background: i === step ? "linear-gradient(135deg, #0cbfff, #7c3aed)" : "rgba(255,255,255,0.2)",
                                transition: "all 0.3s",
                            }}
                        />
                    ))}
                </div>

                <div style={{ fontSize: "40px", marginBottom: "8px" }}>{current.icon}</div>
                <h3 style={{
                    fontSize: "18px", fontWeight: "bold", margin: "0 0 8px",
                    background: "linear-gradient(135deg, #0cbfff, #7c3aed)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{current.title}</h3>

                <p style={{ fontSize: "14px", color: "#ccd6f6", margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {current.content}
                </p>

                {current.visual}

                <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "center" }}>
                    {!isLast && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: "10px 20px", background: "rgba(255,255,255,0.08)",
                                color: "#8892b0", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px", cursor: "pointer", fontSize: "13px", transition: "background 0.2s",
                            }}
                            onMouseOver={(e) => (e.target.style.background = "rgba(255,255,255,0.15)")}
                            onMouseOut={(e) => (e.target.style.background = "rgba(255,255,255,0.08)")}
                        >Skip</button>
                    )}
                    <button
                        onClick={() => isLast ? onClose() : setStep(step + 1)}
                        style={{
                            padding: "10px 28px",
                            background: "linear-gradient(135deg, #0cbfff, #7c3aed)",
                            color: "white", border: "none", borderRadius: "10px",
                            cursor: "pointer", fontSize: "14px", fontWeight: "bold",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            boxShadow: "0 4px 12px rgba(12,191,255,0.3)",
                        }}
                        onMouseOver={(e) => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 6px 16px rgba(12,191,255,0.5)"; }}
                        onMouseOut={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 12px rgba(12,191,255,0.3)"; }}
                    >
                        {isLast ? "🎮 Start!" : `Next (${step + 1}/${TUTORIAL_STEPS.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════
// 🎮 main game component
// ═══════════════════════════════════════════════════
const ColorCode = ({ onComplete }) => {
    const [secret] = useState(() => Array.from({ length: CODE_LEN }, () => Math.floor(Math.random() * COLORS.length)));
    const [guesses, setGuesses] = useState([]);
    const [current, setCurrent] = useState(Array(CODE_LEN).fill(null));
    const [selectedSlot, setSelectedSlot] = useState(0); // currently selected slot
    const [done, setDone] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);

    // place color in slot (palette click)
    const placeColor = useCallback((colorIdx) => {
        if (done || showTutorial) return;
        const newCurrent = [...current];
        newCurrent[selectedSlot] = colorIdx;
        setCurrent(newCurrent);
        // auto-advance to next empty slot
        const nextEmpty = newCurrent.findIndex((c, i) => i > selectedSlot && c === null);
        if (nextEmpty >= 0) {
            setSelectedSlot(nextEmpty);
        } else {
            // jump to an empty slot in front if any
            const firstEmpty = newCurrent.findIndex(c => c === null);
            if (firstEmpty >= 0) setSelectedSlot(firstEmpty);
        }
    }, [current, selectedSlot, done, showTutorial]);

    // slot click — select or clear
    const handleSlotClick = useCallback((idx) => {
        if (done || showTutorial) return;
        if (selectedSlot === idx && current[idx] !== null) {
            // re-click slot → clear
            const newCurrent = [...current];
            newCurrent[idx] = null;
            setCurrent(newCurrent);
        } else {
            setSelectedSlot(idx);
        }
    }, [selectedSlot, current, done, showTutorial]);

    // Reset
    const clearGuess = useCallback(() => {
        if (done || showTutorial) return;
        setCurrent(Array(CODE_LEN).fill(null));
        setSelectedSlot(0);
    }, [done, showTutorial]);

    const submit = useCallback(() => {
        if (done || current.some(c => c === null)) return;
        let exact = 0, close = 0;
        const secretCopy = [...secret];
        const guessCopy = [...current];

        for (let i = 0; i < CODE_LEN; i++) {
            if (guessCopy[i] === secretCopy[i]) {
                exact++;
                secretCopy[i] = -1;
                guessCopy[i] = -2;
            }
        }
        for (let i = 0; i < CODE_LEN; i++) {
            if (guessCopy[i] === -2) continue;
            const idx = secretCopy.indexOf(guessCopy[i]);
            if (idx >= 0) {
                close++;
                secretCopy[idx] = -1;
            }
        }

        const newGuess = { colors: [...current], exact, close };
        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);
        setCurrent(Array(CODE_LEN).fill(null));
        setSelectedSlot(0);

        if (exact === CODE_LEN) {
            setDone(true);
            const score = Math.max(30, 100 - (newGuesses.length - 1) * 10);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        } else if (newGuesses.length >= MAX_GUESSES) {
            setDone(true);
            setTimeout(() => onComplete(20), 500);
        }
    }, [current, secret, guesses, done, onComplete]);

    const progress = (guesses.length / MAX_GUESSES) * 100;
    const won = done && guesses.length > 0 && guesses[guesses.length - 1]?.exact === CODE_LEN;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white", position: "relative" }}>
            <style>{`
                @keyframes colorPop { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
                @keyframes victoryGlow { 0%,100%{box-shadow:0 0 10px rgba(100,255,218,0.3)} 50%{box-shadow:0 0 25px rgba(100,255,218,0.6)} }
                @keyframes victoryBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes tutFadeIn { from{opacity:0;transform:scale(0.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes confetti { 0%{opacity:1;transform:translateY(0) rotate(0deg)} 100%{opacity:0;transform:translateY(-60px) rotate(360deg)} }
                .color-pick:hover { transform: scale(1.25) !important; box-shadow: 0 0 14px currentColor !important; }
                .slot-circle:hover { transform: scale(1.08); }
                .clear-btn:hover { background: rgba(255,107,107,0.2) !important; border-color: #FF6B6B !important; }
            `}</style>

            {/* header: tries + help button */}
            <div style={{ display: "flex", gap: "12px", fontSize: "13px", alignItems: "center" }}>
                <span>Tries: <span style={{ color: "#FFD700", fontWeight: "bold" }}>{guesses.length}/{MAX_GUESSES}</span></span>
                <span style={{ fontSize: "11px", color: "#8892b0" }}>⚫ pos+color ⚪ color only · none</span>
                <button
                    onClick={() => setShowTutorial(true)}
                    title="How to play"
                    style={{
                        width: "22px", height: "22px", borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)",
                        color: "#8892b0", fontSize: "12px", fontWeight: "bold",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s", padding: 0, lineHeight: 1,
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "rgba(12,191,255,0.2)"; e.currentTarget.style.borderColor = "#0cbfff"; e.currentTarget.style.color = "#0cbfff"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#8892b0"; }}
                >?</button>
            </div>

            {/* progress bar */}
            <div style={{ width: "260px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${progress}%`, background: progress > 70 ? "linear-gradient(90deg, #FF6B6B, #FFD93D)" : "linear-gradient(90deg, #4D96FF, #6BCB77)", transition: "width 0.4s" }} />
            </div>

            {/* guess history */}
            <div style={{
                display: "flex", flexDirection: "column", gap: "5px",
                maxHeight: "200px", overflowY: "auto",
                padding: "8px 12px", borderRadius: "12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                minWidth: "260px",
            }}>
                {guesses.length === 0 && <div style={{ fontSize: "12px", color: "#8892b0", padding: "4px 8px" }}>Pick colors below for your first guess!</div>}
                {guesses.map((g, i) => {
                    const isLast = i === guesses.length - 1;
                    return (
                        <div key={i} style={{
                            display: "flex", gap: "6px", alignItems: "center",
                            animation: "colorPop 0.3s ease",
                            padding: "3px 6px", borderRadius: "8px",
                            background: isLast ? "rgba(100,255,218,0.06)" : "transparent",
                            border: isLast ? "1px solid rgba(100,255,218,0.12)" : "1px solid transparent",
                            transition: "all 0.3s",
                        }}>
                            <span style={{ fontSize: "10px", color: "#8892b0", width: "14px" }}>{i + 1}</span>
                            {g.colors.map((c, j) => (
                                <div key={j} style={{
                                    width: 26, height: 26, borderRadius: "50%",
                                    background: COLORS[c],
                                    border: "2px solid rgba(255,255,255,0.15)",
                                    boxShadow: `0 0 6px ${COLORS[c]}44`,
                                }} />
                            ))}
                            <div style={{ marginLeft: "8px", display: "flex", gap: "3px", alignItems: "center" }}>
                                {Array.from({ length: g.exact }, (_, k) => (
                                    <span key={`e${k}`} style={{ width: 10, height: 10, borderRadius: "50%", background: "#333", display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }} />
                                ))}
                                {Array.from({ length: g.close }, (_, k) => (
                                    <span key={`c${k}`} style={{ width: 10, height: 10, borderRadius: "50%", background: "white", display: "inline-block", border: "1px solid rgba(255,255,255,0.3)" }} />
                                ))}
                                {Array.from({ length: CODE_LEN - g.exact - g.close }, (_, k) => (
                                    <span key={`n${k}`} style={{ width: 10, height: 10, borderRadius: "50%", background: "transparent", display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* current guess input */}
            {!done && (
                <>
                    {/* slots */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {current.map((c, i) => (
                            <div
                                key={i}
                                className="slot-circle"
                                onClick={() => handleSlotClick(i)}
                                style={{
                                    width: 42, height: 42, borderRadius: "50%",
                                    background: c !== null ? COLORS[c] : "rgba(255,255,255,0.04)",
                                    border: selectedSlot === i
                                        ? "2px solid #64ffda"
                                        : c !== null
                                            ? `2px solid ${COLORS[c]}`
                                            : "2px dashed rgba(255,255,255,0.2)",
                                    cursor: "pointer", transition: "all 0.2s ease",
                                    boxShadow: selectedSlot === i
                                        ? "0 0 14px rgba(100,255,218,0.4)"
                                        : c !== null
                                            ? `0 0 10px ${COLORS[c]}33`
                                            : "none",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "12px", color: "#64ffda",
                                }}
                            >
                                {c === null && selectedSlot === i && "▼"}
                            </div>
                        ))}
                        {/* reset button */}
                        <button
                            className="clear-btn"
                            onClick={clearGuess}
                            title="Reset current guess"
                            style={{
                                width: 32, height: 32, borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.15)",
                                background: "rgba(255,255,255,0.05)",
                                color: "#8892b0", fontSize: "14px",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s", padding: 0, marginLeft: "4px",
                            }}
                        >🔄</button>
                    </div>

                    {/* color palette */}
                    <div style={{ display: "flex", gap: "8px", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {COLORS.map((color, i) => (
                                <div
                                    key={i}
                                    className="color-pick"
                                    onClick={() => placeColor(i)}
                                    style={{
                                        width: 30, height: 30, borderRadius: "50%",
                                        background: color, cursor: "pointer",
                                        border: "2px solid rgba(255,255,255,0.2)",
                                        transition: "all 0.15s ease",
                                        boxShadow: `0 2px 8px ${color}33`,
                                    }}
                                    title={COLOR_NAMES[i]}
                                />
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {COLOR_NAMES.map((name, i) => (
                                <span key={i} style={{ fontSize: "9px", color: "#8892b0", width: "34px", textAlign: "center" }}>{name}</span>
                            ))}
                        </div>
                    </div>

                    {/* submit button */}
                    <button onClick={submit} disabled={current.some(c => c === null)} style={{
                        padding: "10px 28px", fontSize: "14px", fontWeight: "bold",
                        background: current.some(c => c === null) ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(100,255,218,0.15), rgba(77,150,255,0.15))",
                        color: "#64ffda", border: "1px solid rgba(100,255,218,0.3)", borderRadius: "12px",
                        cursor: current.some(c => c === null) ? "not-allowed" : "pointer",
                        opacity: current.some(c => c === null) ? 0.4 : 1,
                        boxShadow: "0 2px 10px rgba(100,255,218,0.1)",
                        transition: "all 0.2s",
                    }}>
                        {current.some(c => c === null) ? `${current.filter(c => c !== null).length}/${CODE_LEN} selected` : "🔍 Check"}
                    </button>
                </>
            )}

            {/* done screen */}
            {done && (
                <div style={{ textAlign: "center", animation: "colorPop 0.4s ease" }}>
                    {/* confetti */}
                    {won && (
                        <div style={{ position: "relative", height: "20px", marginBottom: "4px" }}>
                            {["🎉", "✨", "🌟", "💎", "🎊"].map((emoji, i) => (
                                <span key={i} style={{
                                    position: "absolute",
                                    left: `${15 + i * 18}%`,
                                    fontSize: "18px",
                                    animation: `confetti 1.5s ease ${i * 0.15}s infinite`,
                                }}>{emoji}</span>
                            ))}
                        </div>
                    )}
                    {/* reveal answer */}
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "8px" }}>
                        {secret.map((c, i) => <div key={i} style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: COLORS[c],
                            border: "2px solid #64ffda",
                            animation: won ? `victoryGlow 1.5s infinite, victoryBounce 0.6s ease ${i * 0.1}s` : "none",
                            boxShadow: `0 0 12px ${COLORS[c]}66`,
                        }} />)}
                    </div>
                    <div style={{
                        fontSize: "16px", fontWeight: "bold",
                        color: won ? "#64ffda" : "#FF6B6B",
                        textShadow: "0 0 15px currentColor",
                    }}>
                        {won ? `🎯 Solved in ${guesses.length} tries!` : "Time's up!"}
                    </div>
                    {won && guesses.length <= 3 && (
                        <div style={{ fontSize: "13px", color: "#FFD700", marginTop: "4px" }}>
                            🏆 Mastermind champion!
                        </div>
                    )}
                </div>
            )}

            {/* tutorial overlay */}
            {showTutorial && (
                <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
                    <TutorialOverlay onClose={() => setShowTutorial(false)} />
                </div>
            )}
        </div>
    );
};

export default ColorCode;
