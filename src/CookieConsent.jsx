import { useEffect, useState } from "react";

const KEY = "bytecade_cookie_consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(KEY)) setVisible(true);
        } catch (_) { /* storage blocked → don't nag */ }
    }, []);

    const decide = (val) => {
        try { localStorage.setItem(KEY, val); } catch (_) { /* noop */ }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="bc-cookie-bar" style={{
            position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1000,
            padding: "12px 16px",
            background: "rgba(12,12,28,0.95)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0", fontSize: "13.5px", lineHeight: 1.55,
            display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
            justifyContent: "center",
            boxShadow: "0 -6px 24px rgba(0,0,0,0.35)",
        }}>
            <style>{`
                .bc-cookie-bar { }
                .bc-cc-short { display: none; }
                @media (max-width: 720px) {
                    .bc-cookie-bar { padding: 10px 14px !important; gap: 10px !important; font-size: 12.5px !important; }
                    .bc-cc-full { display: none; }
                    .bc-cc-short { display: inline; }
                }
            `}</style>
            <span style={{ maxWidth: "680px", minWidth: 0 }}>
                <span className="bc-cc-full">
                    🍪 We currently set <strong style={{ color: "#fff" }}>no advertising or tracking cookies</strong>.
                    A single non-identifying preference is stored locally. If advertising or analytics partners that set
                    cookies are added later, we will ask for your consent first. See our{" "}
                    <a href="/cookies" style={{ color: "#818cf8", textDecoration: "none" }}>Cookie Policy</a>.
                </span>
                <span className="bc-cc-short">
                    🍪 We set <strong style={{ color: "#fff" }}>no tracking cookies</strong>.{" "}
                    <a href="/cookies" style={{ color: "#818cf8", textDecoration: "none" }}>Details</a>
                </span>
            </span>
            <span style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => decide("accepted")} style={{
                    padding: "8px 16px", borderRadius: "9px", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg,#6366f1,#06b6d4)", color: "#fff",
                    fontSize: "13px", fontWeight: 600,
                }}>Accept</button>
                <button onClick={() => decide("declined")} style={{
                    padding: "8px 16px", borderRadius: "9px", cursor: "pointer",
                    background: "rgba(255,255,255,0.08)", color: "#e2e8f0",
                    border: "1px solid rgba(255,255,255,0.18)", fontSize: "13px", fontWeight: 600,
                }}>Decline</button>
            </span>
        </div>
    );
}
