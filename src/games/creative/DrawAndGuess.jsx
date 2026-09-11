/**
 * 🎮 Game 128: 그림 퀴즈 (Draw & Guess)
 * 주어진 단어를 그리고 제출
 */
import { useState, useRef, useCallback } from "react";

const WORDS = ["고양이", "집", "나무", "자동차", "꽃", "태양", "별", "하트", "물고기", "사과", "우산", "로봇", "피자", "비행기", "공"];

const DrawAndGuess = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [word] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
    const [drawing, setDrawing] = useState(false);
    const [drawn, setDrawn] = useState(false);
    const [done, setDone] = useState(false);
    const lastPos = useRef(null);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = useCallback((e) => {
        setDrawing(true);
        setDrawn(true);
        lastPos.current = getPos(e);
    }, []);

    const draw = useCallback((e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = "#64ffda";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
        lastPos.current = pos;
    }, [drawing]);

    const endDraw = useCallback(() => { setDrawing(false); }, []);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setDrawn(false);
    }, []);

    const submit = useCallback(() => {
        if (done) return;
        setDone(true);
        const score = drawn ? 70 + Math.floor(Math.random() * 30) : 30;
        setTimeout(() => onComplete(score), 500);
    }, [done, drawn, onComplete]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", color: "white" }}>
            <div style={{ fontSize: "13px" }}>
                그려주세요: <span style={{ color: "#FFD700", fontSize: "18px", fontWeight: "bold" }}>{word}</span>
            </div>
            <canvas ref={canvasRef} width={280} height={280}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                style={{ borderRadius: "12px", border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", cursor: "crosshair", touchAction: "none" }} />
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={clearCanvas} style={{ padding: "8px 16px", fontSize: "13px", background: "rgba(255,107,107,0.15)", color: "#FF6B6B", border: "1px solid #FF6B6B", borderRadius: "8px", cursor: "pointer" }}>지우기</button>
                <button onClick={submit} style={{ padding: "8px 16px", fontSize: "13px", fontWeight: "bold", background: "rgba(100,255,218,0.15)", color: "#64ffda", border: "1px solid #64ffda", borderRadius: "8px", cursor: "pointer" }}>제출</button>
            </div>
            {done && <div style={{ fontSize: "16px", color: "#64ffda", fontWeight: "bold" }}>🎨 제출 완료!</div>}
        </div>
    );
};

export default DrawAndGuess;
