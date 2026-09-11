/**
 * 🎮 Game 83: 주식 시뮬 — Canvas 실시간 차트 + 매매 시스템
 */
import { useCallback, useEffect, useRef, useState } from "react";

const StockSim = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [cash, setCash] = useState(1000);
    const [shares, setShares] = useState(0);
    const [prices, setPrices] = useState([50]);
    const [day, setDay] = useState(1);
    const [result, setResult] = useState(null);
    const MAX_DAYS = 20;

    const currentPrice = prices[prices.length - 1];
    const portfolio = cash + shares * currentPrice;

    // Draw chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = 260, H = 120;
        ctx.clearRect(0, 0, W, H);

        // Background grid
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        if (prices.length < 2) return;
        const min = Math.min(...prices) * 0.9;
        const max = Math.max(...prices) * 1.1;
        const range = max - min || 1;
        const stepX = W / (MAX_DAYS - 1);

        // Price line
        ctx.beginPath();
        ctx.strokeStyle = currentPrice >= prices[0] ? "#64ffda" : "#FF6B6B";
        ctx.lineWidth = 2;
        prices.forEach((p, i) => {
            const x = i * stepX;
            const y = H - ((p - min) / range) * H;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Fill under line
        ctx.lineTo((prices.length - 1) * stepX, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, currentPrice >= prices[0] ? "rgba(100,255,218,0.15)" : "rgba(255,107,107,0.15)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();

        // Current price dot
        const lastX = (prices.length - 1) * stepX;
        const lastY = H - ((currentPrice - min) / range) * H;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
    }, [prices, currentPrice]);

    const nextDay = useCallback(() => {
        const change = (Math.random() - 0.45) * 15;
        const newPrice = Math.max(5, Math.round(currentPrice + change));
        const newPrices = [...prices, newPrice];
        setPrices(newPrices);
        setDay((d) => d + 1);

        if (day + 1 > MAX_DAYS) {
            const finalPortfolio = cash + shares * newPrice;
            setResult(finalPortfolio);
            setTimeout(() => onComplete(Math.min(100, Math.round((finalPortfolio / 1000) * 50))), 800);
        }
    }, [currentPrice, prices, day, cash, shares, onComplete]);

    const buy = useCallback(() => {
        if (cash >= currentPrice) { setCash((c) => c - currentPrice); setShares((s) => s + 1); }
    }, [cash, currentPrice]);

    const sell = useCallback(() => {
        if (shares > 0) { setCash((c) => c + currentPrice); setShares((s) => s - 1); }
    }, [shares, currentPrice]);

    const pnl = portfolio - 1000;
    const pnlColor = pnl >= 0 ? "#64ffda" : "#FF6B6B";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "white" }}>
            <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <span>📅 Day {day}/{MAX_DAYS}</span>
                <span>💰 {cash.toLocaleString()}원</span>
                <span>📊 {shares}주</span>
            </div>

            {/* Price display */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "bold", color: "#FFD700" }}>{currentPrice.toLocaleString()}원</span>
                <span style={{ fontSize: "13px", color: pnlColor }}>{pnl >= 0 ? "▲" : "▼"} {Math.abs(pnl).toLocaleString()} ({pnl >= 0 ? "+" : ""}{((pnl / 1000) * 100).toFixed(1)}%)</span>
            </div>

            {/* Chart */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <canvas ref={canvasRef} width={260} height={120} style={{ display: "block" }} />
            </div>

            {/* Actions */}
            {!result && (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={buy} disabled={cash < currentPrice} style={{ ...btnStyle, borderColor: "#22C55E", opacity: cash < currentPrice ? 0.4 : 1 }}>📈 매수</button>
                    <button onClick={sell} disabled={shares <= 0} style={{ ...btnStyle, borderColor: "#EF4444", opacity: shares <= 0 ? 0.4 : 1 }}>📉 매도</button>
                    <button onClick={nextDay} style={{ ...btnStyle, borderColor: "#FFD700" }}>⏭️ 다음날</button>
                </div>
            )}

            {result && (
                <div style={{ fontSize: "16px", fontWeight: "bold", color: pnlColor }}>
                    최종 자산: {result.toLocaleString()}원 ({pnl >= 0 ? "+" : ""}{pnl.toLocaleString()})
                </div>
            )}
        </div>
    );
};

const btnStyle = { padding: "8px 14px", fontSize: "12px", fontWeight: "bold", background: "rgba(255,255,255,0.08)", color: "white", border: "2px solid", borderRadius: "10px", cursor: "pointer" };

export default StockSim;
