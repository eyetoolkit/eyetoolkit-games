/**
 * 🎮 Game 121: Cipher Decode
 * Solve the Caesar cipher!
 */
import { useState, useCallback } from "react";

const WORDS = ["Hello", "Programming", "JavaScript", "Computer Science", "Artificial Intelligence", "Database", "Algorithm", "Software"];

const shiftChar = (ch, shift) => {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
        return String.fromCharCode(((code - 0xAC00 + shift) % (0xD7A3 - 0xAC00 + 1)) + 0xAC00);
    }
    if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    return ch;
};

const CipherDecode = ({ onComplete }) => {
    const [wordIdx] = useState(() => Math.floor(Math.random() * WORDS.length));
    const [shift] = useState(() => 1 + Math.floor(Math.random() * 5));
    const answer = WORDS[wordIdx];
    const encrypted = [...answer].map(ch => shiftChar(ch, shift)).join("");
    const [guess, setGuess] = useState("");
    const [shiftGuess, setShiftGuess] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [done, setDone] = useState(false);
    const [hint, setHint] = useState(false);

    const decoded = [...encrypted].map(ch => shiftChar(ch, -shiftGuess)).join("");

    const checkAnswer = useCallback(() => {
        if (done) return;
        setAttempts(a => a + 1);
        if (guess === answer || shiftGuess === shift) {
            setDone(true);
            const score = Math.max(30, 100 - attempts * 15);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [guess, answer, shiftGuess, shift, done, attempts, onComplete]);

    const submitShift = useCallback(() => {
        if (done) return;
        setAttempts(a => a + 1);
        if (shiftGuess === shift) {
            setDone(true);
            const score = Math.max(30, 100 - attempts * 10);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [shiftGuess, shift, done, attempts, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>Caesar cipher decoding <span style={{ color: "#8892b0" }}>Tries: {attempts}</span></div>
            <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "11px", color: "#8892b0", marginBottom: "4px" }}>Ciphertext:</div>
                <div style={{ fontSize: "22px", fontFamily: "monospace", color: "#FF6B6B", letterSpacing: "2px" }}>{encrypted}</div>
            </div>
            {hint && <div style={{ fontSize: "12px", color: "#FFD700" }}>Hint: shift is between 1-5</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px" }}>Shift:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setShiftGuess(n)} style={{
                            width: 36, height: 36, fontSize: "16px", fontWeight: "bold",
                            background: shiftGuess === n ? "rgba(100,255,218,0.2)" : "rgba(255,255,255,0.08)",
                            color: shiftGuess === n ? "#64ffda" : "white",
                            border: shiftGuess === n ? "2px solid #64ffda" : "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px", cursor: "pointer",
                        }}>{n}</button>
                    ))}
                </div>
                {shiftGuess > 0 && (
                    <div style={{ fontSize: "14px", color: "#64ffda" }}>
                        Decoded preview: <span style={{ fontFamily: "monospace" }}>{decoded}</span>
                    </div>
                )}
                <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={submitShift} style={actionBtn}>OK</button>
                    <button onClick={() => setHint(true)} style={{ ...actionBtn, background: "rgba(255,217,61,0.2)", color: "#FFD93D" }}>Hint</button>
                </div>
                <div style={{ fontSize: "11px", color: "#8892b0" }}>Or enter manually:</div>
                <div style={{ display: "flex", gap: "6px" }}>
                    <input value={guess} onChange={e => setGuess(e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "14px", width: "160px" }}
                        placeholder="Enter answer" />
                    <button onClick={checkAnswer} style={actionBtn}>Submit</button>
                </div>
            </div>
            {done && <div style={{ fontSize: "18px", color: "#64ffda", fontWeight: "bold" }}>🔓 Decrypted! (shift: {shift})</div>}
        </div>
    );
};

const actionBtn = {
    padding: "8px 16px", fontSize: "13px", fontWeight: "bold",
    background: "rgba(100,255,218,0.15)", color: "#64ffda",
    border: "1px solid #64ffda", borderRadius: "8px", cursor: "pointer",
};

export default CipherDecode;
