import { useEffect } from "react";

/* ── Site / operator identity (shared across the mathduel.games network) ── */
const SITE = "Bytecade Games";
const SITE_URL = "https://bytecade.mathduel.games";
const OPERATOR = "Jim";
const OPERATOR_LOCATION = "Maoming, Guangdong, China";
const CONTACT_EMAIL = "privacy@mathduel.games"; // TODO: confirm this inbox is monitored
const UPDATED = "September 11, 2026";

const wrap = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a3e 100%)",
    color: "white",
};
const shell = {
    maxWidth: "820px",
    margin: "0 auto",
    padding: "96px 22px 64px",
};
const h1 = {
    fontSize: "clamp(26px, 4vw, 36px)",
    fontWeight: 800,
    margin: "0 0 6px",
    background: "linear-gradient(135deg, #a5b4fc 0%, #22d3ee 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};
const updated = { color: "#94a3b8", fontSize: "13px", margin: "0 0 28px" };
const h2 = { color: "#e0e7ff", fontSize: "19px", fontWeight: 700, margin: "30px 0 10px" };
const p = { color: "#c3cde0", lineHeight: 1.8, fontSize: "15px", margin: "0 0 14px" };
const ul = { color: "#c3cde0", fontSize: "15px", lineHeight: 1.8, paddingLeft: "20px", margin: "0 0 14px" };
const li = { margin: "0 0 8px" };
const a = { color: "#818cf8", textDecoration: "none" };
const back = {
    display: "inline-flex", alignItems: "center", gap: "7px",
    marginTop: "40px", padding: "10px 18px", borderRadius: "10px",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
    color: "#e0e7ff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
};

const Privacy = ({ onBack }) => (
    <div style={shell}>
        <h1 style={h1}>🔒 Privacy Policy</h1>
        <p style={updated}>Last updated: {UPDATED}</p>

        <h2 style={h2}>1. Who we are</h2>
        <p style={p}>
            {SITE} is operated by <strong style={{ color: "#fff" }}>{OPERATOR}</strong> ({OPERATOR_LOCATION}).
            This site is a free, browser-based collection of open-source mini games. You can reach us about any
            privacy matter at <a style={a} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2 style={h2}>2. What we collect today</h2>
        <p style={p}>
            {SITE} runs entirely in your browser. As of this writing we collect <strong style={{ color: "#fff" }}>no personal information</strong> and use no third-party analytics or advertising trackers.
        </p>
        <ul style={ul}>
            <li style={li}><strong style={{ color: "#fff" }}>No accounts.</strong> You never register or log in.</li>
            <li style={li}><strong style={{ color: "#fff" }}>No gameplay tracking.</strong> We do not track what you play across visits or share it with anyone.</li>
            <li style={li}><strong style={{ color: "#fff" }}>Local only.</strong> Scores and a few UI preferences (e.g. theme, last game) may be stored in your own browser via <code>localStorage</code>. This never leaves your device and you can clear it anytime from your browser settings.</li>
            <li style={li}><strong style={{ color: "#fff" }}>Security cookies.</strong> Our CDN (Cloudflare) may set technical cookies required to deliver and protect the site. These are not used for advertising or cross-site tracking.</li>
        </ul>

        <h2 style={h2}>3. Planned advertising &amp; analytics (important)</h2>
        <p style={p}>
            We intend to monetize {SITE} through advertising (for example Google AdSense) and possibly privacy-respecting
            analytics. <strong style={{ color: "#fff" }}>Before any advertising or analytics partner that sets cookies is enabled, we will ask for your consent</strong> through a cookie banner and will not load those partners without it.
        </p>
        <ul style={ul}>
            <li style={li}>If you are in the EEA/UK, non-essential ad and analytics cookies will only load after you accept.</li>
            <li style={li}>If you are in California, we honor the Global Privacy Control (GPC) signal and treat it as a "Do Not Sell or Share" opt-out.</li>
            <li style={li}>Some ad partners may build a non-identifying interest profile; you can decline and still use every game.</li>
        </ul>

        <h2 style={h2}>4. Children</h2>
        <p style={p}>
            {SITE} is a general-audience games site that may appeal to minors. We do not knowingly collect personal data from children.
            When advertising is enabled we will request <strong style={{ color: "#fff" }}>child-directed / non-personalized</strong> ad settings where required
            (e.g. under COPPA and the GDPR children's provisions) and will not target ads based on a child's activity.
        </p>

        <h2 style={h2}>5. Your rights</h2>
        <p style={p}>
            Depending on where you live (GDPR, UK GDPR, CCPA/CPRA, and similar laws) you may have rights to access, correct,
            delete, or port your data, and to object to or restrict processing. Because we currently store nothing identifiable
            about you server-side, most of this is satisfied by clearing your browser storage. For anything else, email
            {" "}<a style={a} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2 style={h2}>6. Changes</h2>
        <p style={p}>We may update this policy as the site evolves. Material changes (especially around advertising) will be reflected here with a new "Last updated" date.</p>

        <button style={back} onClick={onBack}>← Back to games</button>
    </div>
);

const Terms = ({ onBack }) => (
    <div style={shell}>
        <h1 style={h1}>📜 Terms of Service</h1>
        <p style={updated}>Last updated: {UPDATED}</p>

        <h2 style={h2}>1. Acceptance</h2>
        <p style={p}>By using {SITE} you agree to these terms. If you do not agree, please do not use the site.</p>

        <h2 style={h2}>2. Use of the site</h2>
        <ul style={ul}>
            <li style={li}>The games are provided <strong style={{ color: "#fff" }}>"as is"</strong> for free personal, non-commercial entertainment.</li>
            <li style={li}>Do not use the site for any unlawful, harmful, or abusive purpose.</li>
            <li style={li}>You may not attempt to disrupt, reverse-engineer, or overload the service.</li>
        </ul>

        <h2 style={h2}>3. Age</h2>
        <p style={p}>If you are under the age of digital consent in your country (e.g. 13 under COPPA, 16 under GDPR unless lowered), please use the site with a parent or guardian.</p>

        <h2 style={h2}>4. Intellectual property</h2>
        <p style={p}>
            All game code is open source under the Apache-2.0 license — you can read and audit it on
            {" "}<a style={a} href="https://github.com/eyetoolkit/eyetoolkit-games" target="_blank" rel="noopener noreferrer">GitHub</a>.
            The {SITE} name, logo, and visual design are used under the same project and may not be redistributed as a competing service without permission.
        </p>

        <h2 style={h2}>5. Disclaimers &amp; liability</h2>
        <p style={p}>
            We are not responsible for any indirect or consequential damages arising from use of the site. Scores and progress are
            stored locally and may be lost if you clear your browser data; we cannot recover them.
        </p>

        <h2 style={h2}>6. Changes</h2>
        <p style={p}>We may modify or discontinue the site at any time. Continued use after changes means you accept the revised terms.</p>

        <button style={back} onClick={onBack}>← Back to games</button>
    </div>
);

const Cookies = ({ onBack }) => (
    <div style={shell}>
        <h1 style={h1}>🍪 Cookie Policy</h1>
        <p style={updated}>Last updated: {UPDATED}</p>

        <h2 style={h2}>What cookies are</h2>
        <p style={p}>Cookies are small text files stored in your browser. They help sites remember things between visits.</p>

        <h2 style={h2}>Cookies we use today</h2>
        <ul style={ul}>
            <li style={li}><strong style={{ color: "#fff" }}>Strictly necessary:</strong> technical cookies set by our CDN (Cloudflare) to deliver and secure the site. These cannot be declined.</li>
            <li style={li}><strong style={{ color: "#fff" }}>Preference (local only):</strong> your chosen consent setting, stored in your browser via <code>localStorage</code>.</li>
            <li style={li}><strong style={{ color: "#fff" }}>Advertising / analytics:</strong> <em>none yet.</em> We will only load these after you give consent (see the banner).</li>
        </ul>

        <h2 style={h2}>Managing your choices</h2>
        <p style={p}>
            You can change or withdraw your choice anytime by clearing site data in your browser, or by using the controls in our
            cookie banner. If you are in the EEA/UK, non-essential cookies load only after you accept; if you are in California,
            the Global Privacy Control (GPC) signal is honored as an opt-out.
        </p>

        <h2 style={h2}>Third parties</h2>
        <p style={p}>
            Once advertising is enabled, partners such as Google may set cookies per their own policies
            (<a style={a} href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google ads policy</a>).
            We will link to their controls (e.g. ad personalization settings) from this page when live.
        </p>

        <button style={back} onClick={onBack}>← Back to games</button>
    </div>
);

const About = ({ onBack }) => (
    <div style={shell}>
        <h1 style={h1}>ℹ️ About Bytecade Games</h1>
        <p style={updated}>Last updated: {UPDATED}</p>

        <h2 style={h2}>Our mission</h2>
        <p style={p}>
            {SITE} is a free, open-source collection of browser mini games — no downloads, no accounts, no clutter.
            We believe good games should just load and play.
        </p>

        <h2 style={h2}>Who runs it</h2>
        <p style={p}>
            {SITE} is operated by <strong style={{ color: "#fff" }}>{OPERATOR}</strong> ({OPERATOR_LOCATION}) as part of the
            mathduel.games network of game sites. The code is open source under Apache-2.0.
        </p>

        <h2 style={h2}>Sister sites</h2>
        <ul style={ul}>
            <li style={li}><a style={a} href="https://mathduel.games" target="_blank" rel="noopener noreferrer">MathDuel</a> — real-time math duels</li>
            <li style={li}><a style={a} href="https://boardduel.com" target="_blank" rel="noopener noreferrer">BoardDuel</a> — board &amp; card duels vs real people</li>
            <li style={li}><a style={a} href="https://memoryduel.com" target="_blank" rel="noopener noreferrer">MemoryDuel</a> — memory &amp; reaction face-offs</li>
        </ul>

        <h2 style={h2}>Contact</h2>
        <p style={p}>Questions, takedowns, or privacy requests: <a style={a} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

        <button style={back} onClick={onBack}>← Back to games</button>
    </div>
);

const TITLES = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    about: "About Bytecade Games",
};

const META = {
    privacy: "How Bytecade Games handles your data and its plan for advertising.",
    terms: "The rules for using Bytecade Games' free mini-game collection.",
    cookies: "What cookies Bytecade Games uses and how to control them.",
    about: "Who runs Bytecade Games and our sister sites in the mathduel.games network.",
};

const setMetaProp = (prop, content) => {
    try {
        let el = document.head.querySelector(`meta[property="${prop}"]`);
        if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
        el.setAttribute("content", content);
    } catch (_) { /* noop */ }
};
const setMetaName = (name, content) => {
    try {
        let el = document.head.querySelector(`meta[name="${name}"]`);
        if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
        el.setAttribute("content", content);
    } catch (_) { /* noop */ }
};
const setCanonical = (href) => {
    try {
        let el = document.head.querySelector('link[rel="canonical"]');
        if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
        el.setAttribute("href", href);
    } catch (_) { /* noop */ }
};

export default function Legal({ page, onBack }) {
    useEffect(() => {
        try {
            const titleText = `${TITLES[page] || "Bytecade Games"} — ${SITE}`;
            const descText = `${META[page] || SITE}. Free, open-source, no account required.`;
            const url = `${SITE_URL}/${page}`;
            document.title = titleText;
            const el = document.querySelector('meta[name="description"]');
            if (el) el.setAttribute("content", descText);
            setMetaProp("og:title", titleText);
            setMetaProp("og:description", descText);
            setMetaProp("og:url", url);
            setMetaProp("og:type", "website");
            setMetaProp("og:image", `${SITE_URL}/og-image.png`);
            setMetaName("twitter:title", titleText);
            setMetaName("twitter:description", descText);
            setMetaName("twitter:image", `${SITE_URL}/og-image.png`);
            setCanonical(url);
        } catch (_) { /* noop */ }
    }, [page]);

    const body = page === "privacy" ? <Privacy onBack={onBack} />
        : page === "terms" ? <Terms onBack={onBack} />
        : page === "cookies" ? <Cookies onBack={onBack} />
        : page === "about" ? <About onBack={onBack} />
        : <Privacy onBack={onBack} />;

    return <div style={wrap}>{body}</div>;
}
