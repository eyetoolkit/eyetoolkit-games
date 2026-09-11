/**
 * 🎮 Game 103: Rubik's Cube 2x2
 * 2D net rotation UI — match all 6 faces
 */
import { useState, useCallback } from "react";

const FACE_COLORS = { U: "#FFD700", D: "#FFFFFF", F: "#FF6B6B", B: "#FF8C42", L: "#6BCB77", R: "#4D96FF" };
const FACE_NAMES = { U: "Top", D: "Bottom", F: "Front", B: "Back", L: "Left", R: "Right" };

const createSolved = () => ({
    U: ["U", "U", "U", "U"], D: ["D", "D", "D", "D"],
    F: ["F", "F", "F", "F"], B: ["B", "B", "B", "B"],
    L: ["L", "L", "L", "L"], R: ["R", "R", "R", "R"],
});

const rotateFaceCW = (face) => [face[2], face[0], face[3], face[1]];

const applyMove = (cube, move) => {
    const c = JSON.parse(JSON.stringify(cube));
    switch (move) {
        case "U": {
            c.U = rotateFaceCW(c.U);
            const tmp = [c.F[0], c.F[1]];
            c.F[0] = c.R[0]; c.F[1] = c.R[1];
            c.R[0] = c.B[0]; c.R[1] = c.B[1];
            c.B[0] = c.L[0]; c.B[1] = c.L[1];
            c.L[0] = tmp[0]; c.L[1] = tmp[1];
            break;
        }
        case "R": {
            c.R = rotateFaceCW(c.R);
            const tmp = [c.F[1], c.F[3]];
            c.F[1] = c.D[1]; c.F[3] = c.D[3];
            c.D[1] = c.B[2]; c.D[3] = c.B[0];
            c.B[2] = c.U[1]; c.B[0] = c.U[3];
            c.U[1] = tmp[0]; c.U[3] = tmp[1];
            break;
        }
        case "F": {
            c.F = rotateFaceCW(c.F);
            const tmp = [c.U[2], c.U[3]];
            c.U[2] = c.L[3]; c.U[3] = c.L[1];
            c.L[1] = c.D[0]; c.L[3] = c.D[1];
            c.D[0] = c.R[2]; c.D[1] = c.R[0];
            c.R[0] = tmp[0]; c.R[2] = tmp[1];
            break;
        }
        default: break;
    }
    return c;
};

const shuffle = (cube, n) => {
    const moves = ["U", "R", "F"];
    let c = cube;
    const history = [];
    for (let i = 0; i < n; i++) {
        const m = moves[Math.floor(Math.random() * moves.length)];
        const times = 1 + Math.floor(Math.random() * 3);
        for (let t = 0; t < times; t++) c = applyMove(c, m);
        history.push({ move: m, times });
    }
    return c;
};

const isSolved = (cube) => Object.values(cube).every(face => face.every(c => c === face[0]));

const RubiksCube2x2 = ({ onComplete }) => {
    const [cube, setCube] = useState(() => shuffle(createSolved(), 6));
    const [moves, setMoves] = useState(0);
    const [done, setDone] = useState(false);

    const doMove = useCallback((move) => {
        if (done) return;
        const newCube = applyMove(cube, move);
        const newMoves = moves + 1;
        setCube(newCube);
        setMoves(newMoves);
        if (isSolved(newCube)) {
            setDone(true);
            const score = Math.max(30, 100 - (newMoves - 4) * 3);
            setTimeout(() => onComplete(Math.min(100, score)), 500);
        }
    }, [cube, moves, done, onComplete]);

    const renderFace = (faceKey, label) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <div style={{ fontSize: "10px", color: "#8892b0" }}>{label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 36px)", gap: "2px" }}>
                {cube[faceKey].map((c, i) => (
                    <div key={i} style={{
                        width: 36, height: 36, borderRadius: "4px",
                        background: FACE_COLORS[c],
                        border: "1px solid rgba(0,0,0,0.3)",
                    }} />
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                Moves: <span style={{ color: "#FFD700" }}>{moves}</span>
            </div>
            {/* Cross layout: top=U, middle=L,F,R,B, bottom=D */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                {renderFace("U", FACE_NAMES.U)}
                <div style={{ display: "flex", gap: "10px" }}>
                    {renderFace("L", FACE_NAMES.L)}
                    {renderFace("F", FACE_NAMES.F)}
                    {renderFace("R", FACE_NAMES.R)}
                    {renderFace("B", FACE_NAMES.B)}
                </div>
                {renderFace("D", FACE_NAMES.D)}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                {["U", "R", "F"].map(m => (
                    <button key={m} onClick={() => doMove(m)} style={moveBtnStyle}>
                        {m} ↻
                    </button>
                ))}
            </div>
            <div style={{ fontSize: "12px", color: "#8892b0" }}>
                Match each face to one color
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎉 Done! {moves} moves</div>}
        </div>
    );
};

const moveBtnStyle = {
    padding: "8px 18px", fontSize: "14px", fontWeight: "bold",
    background: "rgba(255,255,255,0.1)", color: "white",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px",
    cursor: "pointer",
};

export default RubiksCube2x2;
