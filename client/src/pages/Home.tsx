/* Folklore home: a concise field-guide landing page that directs operators to the full agent library. */
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronDown, CircleDollarSign, Compass, Leaf, LockKeyhole, Menu, Monitor, Moon, Send, ShieldCheck, Sparkles, Sun, UsersRound, X } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";
type Plan = {
  key: string;
  label: string;
  price: string;
  cadence: string;
  description: string;
  features: readonly string[];
  action: string;
  href?: string;
};

type PrivacyResult = {
  status: "forwarded" | "blocked" | "review";
  response: string;
  redactions: { label: string; count: number }[];
  decision: { risk: "low" | "medium" | "high"; reasons: string[] };
  outboundMessages: { toAgent: string; allowedFields: string[]; needSummary: string }[];
  audit: { rawClientDataForwarded: false; recipients: string[] };
};

const agentFields = [
  { number: "I.", title: "Customer support", description: "Ticket triage, return handling, and review-ready reply drafts.", href: "/agents#drafter", symbol: "↗" },
  { number: "II.", title: "Inventory & restocking", description: "Low-stock context and reorder briefs for a human supplier review.", href: "/agents#watchkeeper", symbol: "⌁" },
  { number: "III.", title: "Order fulfillment", description: "Carrier evidence and a clear next-step brief for delivery exceptions.", href: "/agents#exceptions", symbol: "□" },
  { number: "IV.", title: "Marketing & ads", description: "Campaign performance context with reviewable decision signals.", href: "/agents#recap", symbol: "✳" },
  { number: "V.", title: "Reviews & feedback", description: "Private feedback sorting that keeps original words and human judgment close.", href: "/agents#feedback", symbol: "◇" },
];

export const plans: readonly Plan[] = [
  {
    key: "field-notes",
    label: "Field notes",
    price: "$0",
    cadence: "Public archive",
    description: "Explore the agent records and understand each review-first workflow.",
    features: ["Browse all five agent records", "Read workflow boundaries", "Use public workspace examples"],
    action: "Explore the library",
    href: "/agents#agent-library",
  },
  {
    key: "operator",
    label: "Operator access",
    price: "Opening soon",
    cadence: "Founding plan",
    description: "A plan for operators who want agent workspaces as their team’s review bench.",
    features: ["Workspace access for the agent library", "Human-review safeguards in every flow", "Future agent-library additions"],
    action: "Select operator plan",
  },
  {
    key: "team-archive",
    label: "Team archive",
    price: "On request",
    cadence: "Team plan",
    description: "For teams planning shared operating patterns and dedicated access requirements.",
    features: ["Shared access planning", "Team-oriented onboarding", "Plan design before checkout opens"],
    action: "Select team plan",
  },
];

export default function Home() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = window.localStorage.getItem("folklore-theme-preference");
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  });
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [privacyRequest, setPrivacyRequest] = useState("");
  const [clientReference, setClientReference] = useState("");
  const [privacyAgent, setPrivacyAgent] = useState("auto");
  const [authToken, setAuthToken] = useState("");
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyResult, setPrivacyResult] = useState<PrivacyResult | null>(null);
  const resolvedTheme = themePreference === "system" ? systemTheme : themePreference;
  const ThemeIcon = themePreference === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", syncSystemTheme);
    return () => mediaQuery.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("folklore-theme-preference", themePreference);
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [themePreference, resolvedTheme]);

  const closeMenu = () => setMenuOpen(false);
  const selectTheme = (preference: ThemePreference) => {
    setThemePreference(preference);
    setThemeMenuOpen(false);
  };
  const handlePrivacySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrivacyLoading(true);
    setPrivacyResult(null);
    try {
      const response = await fetch("/api/privacy/needs", { method: "POST", headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}` } : {}) }, body: JSON.stringify({ request: privacyRequest, clientReference: clientReference || undefined, requestedAgent: privacyAgent === "auto" ? undefined : privacyAgent }) });
      if (!response.ok) throw new Error("gateway rejected the request");
      const result = await response.json() as PrivacyResult;
      setPrivacyResult(result);
    } catch {
      setPrivacyResult({ status: "review", response: "The gateway requires a valid tenant bearer token. Nothing was shared with another agent.", redactions: [], decision: { risk: "medium", reasons: ["authentication required"] }, outboundMessages: [], audit: { rawClientDataForwarded: false, recipients: [] } });
    } finally {
      setPrivacyLoading(false);
    }
  };

  return (
    <div className={`folklore-page theme-${resolvedTheme}`}>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Folklore home">
          <span className="wordmark-mark"><img src="/manus-storage/folklore-mark_b6f5994d.png" alt="" /></span>
          <span>Folk<span>lore</span></span>
        </a>
        <div className="header-actions">
          <div className="theme-control">
            <button className="theme-toggle" type="button" onClick={() => setThemeMenuOpen((open) => !open)} aria-label={`Theme preference: ${themePreference}. Current appearance: ${resolvedTheme}.`} aria-haspopup="menu" aria-expanded={themeMenuOpen}>
              <ThemeIcon size={15} /><span>{themePreference === "system" ? "System" : themePreference === "dark" ? "Dark" : "Light"}</span><ChevronDown size={13} className={themeMenuOpen ? "is-open" : ""} />
            </button>
            <div className={`theme-picker ${themeMenuOpen ? "open" : ""}`} role="menu" aria-label="Theme preference">
              <button type="button" role="menuitemradio" aria-checked={themePreference === "system"} className={themePreference === "system" ? "active" : ""} onClick={() => selectTheme("system")}><Monitor size={15} /><span>System</span><small>Matches your OS</small></button>
              <button type="button" role="menuitemradio" aria-checked={themePreference === "light"} className={themePreference === "light" ? "active" : ""} onClick={() => selectTheme("light")}><Sun size={15} /><span>Light</span></button>
              <button type="button" role="menuitemradio" aria-checked={themePreference === "dark"} className={themePreference === "dark" ? "active" : ""} onClick={() => selectTheme("dark")}><Moon size={15} /><span>Dark</span></button>
            </div>
          </div>
          <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          <a href="/agents#agent-library" onClick={closeMenu}>Agent library</a>
          <a href="#pricing" onClick={closeMenu}>Plans</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a className="nav-cta" href="/agents#drafter" onClick={closeMenu}>Open a workspace <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero home-hero" aria-labelledby="hero-title">
          <div className="hero-image-wrap"><img className="hero-image" src="/manus-storage/folklore-hero_5b8b317d.webp" alt="Aerial view of a green forest canopy with white birds flying across it" /><div className="hero-image-wash" /><div className="hero-image-caption"><span>Field note 001</span><span>Canopy / in motion</span></div></div>
          <div className="hero-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> E-commerce agent library</div><h1 id="hero-title">Every agent here has a <em>story.</em></h1><p className="hero-sub">Folklore gathers AI agents for the work behind a storefront. Start with the record, inspect the workflow, then open a private human-review workspace when you are ready.</p><div className="hero-actions"><a className="button button-primary" href="/agents#agent-library">Explore agents <ArrowRight size={16} /></a><a className="button button-ghost" href="#pricing">See plans <ArrowUpRight size={16} /></a></div><div className="hero-proof"><div><strong>01</strong><span>Read the record</span></div><div><strong>02</strong><span>Open the workspace</span></div><div><strong>03</strong><span>Keep the decision human</span></div></div></div>
          <div className="hero-side-note"><span>Built for operators</span><strong>who prefer proof<br />to promises.</strong><ArrowDownRight size={20} /></div>
        </section>

        <div className="seal-divider" aria-hidden="true"><span className="rule" /><span className="seal">◆ Told, tested, trusted ◆</span><span className="rule" /></div>

        <section className="section-shell home-library-preview" aria-labelledby="library-preview-title">
          <div className="section-intro"><div className="eyebrow"><span className="eyebrow-dot" /> The agent library</div><h2 id="library-preview-title">The work has its own <em>place.</em></h2><p>The full agent record and all five interactive workspaces now live in a focused library—without crowding the path into Folklore.</p><a className="text-link" href="/agents#agent-library">Enter the library <ArrowUpRight size={15} /></a></div>
          <div className="category-grid">{agentFields.map((field, index) => <a className={`category-card card-${index + 1}`} href={field.href} key={field.title}><span className="card-index">{field.number}</span><span className="category-icon" aria-hidden="true">{field.symbol}</span><h3>{field.title}</h3><p>{field.description}</p><span className="card-arrow"><ArrowUpRight size={16} /></span></a>)}</div>
        </section>

        <section className="library-bridge" aria-labelledby="bridge-title"><div className="library-bridge-mark"><Compass size={20} /><span>Agent archive</span></div><div><div className="eyebrow eyebrow-gold"><span className="eyebrow-dot" /> Dedicated workspace</div><h2 id="bridge-title">Open the record<br />when you need the <em>work.</em></h2></div><p>Each workspace preserves the same boundary: Folklore prepares evidence, language, or a next-step brief. A person remains responsible for every external action.</p><a className="button button-light" href="/agents#drafter">Visit the agent library <ArrowRight size={16} /></a></section>

        <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
          <div className="pricing-intro"><div><div className="eyebrow"><span className="eyebrow-dot" /> Plans &amp; billing</div><h2 id="pricing-title">Choose the access<br />that fits your <em>bench.</em></h2></div><p>Billing and payment processing are being finalized separately. You can choose an access path now; no charge, checkout, or card entry is available on this page.</p></div>
          <div className="pricing-grid">{plans.map((plan) => <article className={`plan-card ${plan.key === "operator" ? "plan-card-featured" : ""}`} key={plan.key}><div className="plan-head"><span className="plan-kicker">{plan.cadence}</span><h3>{plan.label}</h3><p>{plan.description}</p></div><div className="plan-price"><strong>{plan.price}</strong><span>{plan.key === "field-notes" ? "to begin" : "before checkout opens"}</span></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>{plan.href ? <a className="button button-light plan-action" href={plan.href}>{plan.action} <ArrowUpRight size={15} /></a> : <button className="button button-primary plan-action" type="button" onClick={() => setSelectedPlan(plan.key)}>{selectedPlan === plan.key ? "Plan noted" : plan.action} {selectedPlan === plan.key ? <Check size={15} /> : <ArrowRight size={15} />}</button>}</article>)}</div>
          <div className="billing-notice" aria-live="polite"><LockKeyhole size={17} /><p>{selectedPlan ? "Your plan interest has been noted in this browser only. Secure checkout will become available after payment setup is connected." : "Secure checkout is intentionally disabled for now. Plan selection does not create a subscription or collect payment details."}</p><CircleDollarSign size={17} /></div>
        </section>

        <section className="process-section" id="how-it-works" aria-labelledby="process-title"><div className="process-image"><img src="/manus-storage/folklore-botanical_ec118ecd.png" alt="Hand-inked botanical field guide illustration with birds and reeds" /><span className="image-stamp">No. 07<br />Field guide</span></div><div className="process-content"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> How it works</div><h2 id="process-title">Trust is a <em>trail,</em> not a badge.</h2><div className="steps"><div className="step"><span className="step-number">01</span><div><h3>Browse the record</h3><p>Start with the real task and the boundary around it—not a promise about the future.</p></div></div><div className="step"><span className="step-number">02</span><div><h3>Run it in your world</h3><p>Use a focused workspace where it matters. Keep edge cases close and the final decision clear.</p></div></div><div className="step"><span className="step-number">03</span><div><h3>Choose access deliberately</h3><p>Explore the public library now and select a plan when the paid access model is ready.</p></div></div></div></div></section>

        <section className="privacy-section" id="privacy" aria-labelledby="privacy-title"><div className="privacy-copy"><div className="eyebrow"><span className="eyebrow-dot" /> Privacy gateway / live pattern</div><h2 id="privacy-title">Share the <em>need,</em> not the record.</h2><p>Describe what the client needs. Folklore removes common identifiers, checks for instruction hijacking, and sends each downstream agent only the fields required for its job.</p><div className="privacy-principles"><div><LockKeyhole size={17} /><span><strong>Redact first</strong>Emails, phones, cards, IPs, and credentials are replaced before routing.</span></div><div><UsersRound size={17} /><span><strong>Need-to-know</strong>Agents receive an opaque reference and a bounded task summary.</span></div><div><ShieldCheck size={17} /><span><strong>Fail closed</strong>Suspicious requests are blocked or held for review, never improvised.</span></div></div><form className="privacy-form" onSubmit={handlePrivacySubmit}><label htmlFor="privacy-request">Client need</label><textarea id="privacy-request" value={privacyRequest} onChange={(event) => setPrivacyRequest(event.target.value)} placeholder="Example: A customer needs a refund because a delivery is late." rows={5} required /><div className="privacy-form-grid"><label htmlFor="client-reference">Opaque client reference <span>optional</span><input id="client-reference" value={clientReference} onChange={(event) => setClientReference(event.target.value)} placeholder="Internal reference" /></label><label htmlFor="privacy-agent">Route to<select id="privacy-agent" value={privacyAgent} onChange={(event) => setPrivacyAgent(event.target.value)}><option value="auto">Auto-select by need</option><option value="support">Support</option><option value="inventory">Inventory</option><option value="fulfillment">Fulfillment</option><option value="marketing">Marketing</option></select></label></div><label className="privacy-token-field" htmlFor="privacy-token">Tenant bearer token <span>sent only in the request header; never stored</span><input id="privacy-token" type="password" value={authToken} onChange={(event) => setAuthToken(event.target.value)} placeholder="Paste a short-lived tenant token" autoComplete="off" /></label><button className="button button-primary privacy-submit" type="submit" disabled={privacyLoading}>{privacyLoading ? "Checking boundary…" : "Run privacy check"} {privacyLoading ? <ShieldCheck size={16} /> : <Send size={16} />}</button></form></div><div className="privacy-panel"><div className="privacy-panel-header"><span className="privacy-panel-label"><span className="live-dot" /> Gateway status</span><span className="privacy-default">Default deny</span></div>{privacyResult ? <div className={`privacy-result result-${privacyResult.status}`}><div className="privacy-result-title">{privacyResult.status === "blocked" ? <AlertTriangle size={20} /> : privacyResult.status === "forwarded" ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}<strong>{privacyResult.status === "blocked" ? "Request blocked" : privacyResult.status === "forwarded" ? "Need shared safely" : "Review boundary"}</strong><span className="risk-label">{privacyResult.decision.risk} risk</span></div><p>{privacyResult.response}</p>{privacyResult.redactions.length > 0 && <div className="privacy-result-block"><span className="result-kicker">Redactions applied</span><div className="redaction-list">{privacyResult.redactions.map((item) => <span key={item.label}>{item.label.replace("_", " ")} × {item.count}</span>)}</div></div>}<div className="privacy-result-block"><span className="result-kicker">Downstream recipients</span>{privacyResult.audit.recipients.length > 0 ? <div className="recipient-list">{privacyResult.audit.recipients.map((recipient) => <span key={recipient}>{recipient} agent</span>)}</div> : <span className="empty-result">No agent received the request.</span>}</div>{privacyResult.outboundMessages.length > 0 && <div className="privacy-message-preview"><span className="result-kicker">Safe outbound summary</span><p>{privacyResult.outboundMessages[0].needSummary}</p><span className="allowed-fields">Allowed fields: {privacyResult.outboundMessages[0].allowedFields.join(" · ")}</span></div>}<div className="privacy-audit"><ShieldCheck size={15} /> Raw client data forwarded: <strong>never</strong></div></div> : <div className="privacy-empty"><ShieldCheck size={29} /><strong>Ready to inspect a need.</strong><p>The result will show what was redacted, which agent can receive the task, and why.</p><div className="privacy-empty-row"><span>1. sanitize</span><span>2. assess</span><span>3. route</span></div></div>}</div></section>

        <section className="closing-section" aria-labelledby="closing-title"><div className="closing-mark"><BookOpen size={23} /><span>Archive note / 2026</span></div><div><div className="eyebrow"><span className="eyebrow-dot" /> For operators, by operators</div><h2 id="closing-title">Start with the task<br />worth <em>understanding.</em></h2></div><div className="closing-action"><p>Open the library to inspect a record, try a workflow, and keep responsibility with your team.</p><a className="button button-primary" href="/agents#agent-library">Browse agents <Sparkles size={16} /></a></div></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark"><img src="/manus-storage/folklore-mark_b6f5994d.png" alt="" /></span><span>Folk<span>lore</span></span></a><span>AI agents for the work behind the storefront.</span><span>© 2026 Folklore archive</span></footer>
    </div>
  );
}
