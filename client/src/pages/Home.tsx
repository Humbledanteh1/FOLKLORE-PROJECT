/* Folklore design: botanical field-guide editorialism, parchment + forest ink, asymmetry, quiet motion. */
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, Heart, LockKeyhole, Menu, Quote, Send, ShieldCheck, Star, UsersRound, X } from "lucide-react";

type Agent = { title: string; description: string; note: string; category: string; initials: string; color: string };

const categories = [
  { number: "I.", title: "Customer support", text: "Ticket triage, return handling, FAQ response.", icon: "↗" },
  { number: "II.", title: "Inventory & restocking", text: "Stock alerts, reorder logic, supplier follow-up.", icon: "⌁" },
  { number: "III.", title: "Order fulfillment", text: "Shipping updates, exception handling, tracking.", icon: "□" },
  { number: "IV.", title: "Marketing & ads", text: "Campaign copy, audience notes, performance recaps.", icon: "✳" },
  { number: "V.", title: "Reviews & feedback", text: "Sentiment sorting, response drafts, escalation flags.", icon: "◇" },
];

const agents: Record<string, Agent> = {
  support: { title: "Return & Refund Ticket Drafter", description: "Drafts on-brand replies to return and shipping tickets from your Shopify inbox, flags anything that needs a human before it sends.", note: "Observed across 1,842 tickets", category: "Customer support", initials: "RR", color: "mint" },
  inventory: { title: "Low-Stock Watchkeeper", description: "Scans your catalog for velocity changes, writes a reorder brief, and keeps supplier follow-up in one calm daily digest.", note: "Observed across 14 storefronts", category: "Inventory & restocking", initials: "LW", color: "gold" },
  fulfillment: { title: "Delivery Exception Interpreter", description: "Turns carrier scans and missed promises into clear next steps, with a human-ready note for every order that needs attention.", note: "Observed across 9,404 shipments", category: "Order fulfillment", initials: "DE", color: "rust" },
  marketing: { title: "Campaign Recap Editor", description: "Turns weekly channel noise into a concise performance story, highlighting the creative, audience, and decision behind every signal.", note: "Observed across 62 weekly recaps", category: "Marketing & ads", initials: "CE", color: "blue" },
};
const tabs = [["support", "Support"], ["inventory", "Inventory"], ["fulfillment", "Fulfillment"], ["marketing", "Marketing"]] as const;

type PrivacyResult = {
  status: "forwarded" | "blocked" | "review";
  response: string;
  redactions: { label: string; count: number }[];
  decision: { risk: "low" | "medium" | "high"; reasons: string[] };
  outboundMessages: { toAgent: string; allowedFields: string[]; needSummary: string }[];
  audit: { rawClientDataForwarded: false; recipients: string[] };
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("support");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [privacyRequest, setPrivacyRequest] = useState("");
  const [clientReference, setClientReference] = useState("");
  const [privacyAgent, setPrivacyAgent] = useState("auto");
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyResult, setPrivacyResult] = useState<PrivacyResult | null>(null);
  const agent = useMemo(() => agents[activeTab], [activeTab]);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 32); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const closeMenu = () => setMenuOpen(false);
  const selectTab = (key: (typeof tabs)[number][0]) => { setActiveTab(key); setRating(0); };
  const handlePrivacySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrivacyLoading(true);
    setPrivacyResult(null);
    try {
      const response = await fetch("/api/privacy/needs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request: privacyRequest, clientReference: clientReference || undefined, requestedAgent: privacyAgent === "auto" ? undefined : privacyAgent }) });
      const result = await response.json() as PrivacyResult;
      setPrivacyResult(result);
    } catch {
      setPrivacyResult({ status: "review", response: "The gateway is unavailable. Nothing was shared with another agent.", redactions: [], decision: { risk: "medium", reasons: ["gateway unavailable"] }, outboundMessages: [], audit: { rawClientDataForwarded: false, recipients: [] } });
    } finally {
      setPrivacyLoading(false);
    }
  };

  return <div className="folklore-page">
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Folklore home"><span className="wordmark-mark"><img src="/manus-storage/folklore-mark_b6f5994d.png" alt="" /></span><span>Folk<span>lore</span></span></a>
      <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
        <a href="#agents" onClick={closeMenu}>Browse agents</a><a href="#forum" onClick={closeMenu}>The forum</a><a href="#privacy" onClick={closeMenu}>Privacy gateway</a><a href="#submit" onClick={closeMenu}>Submit an agent</a><a className="nav-cta" href="#agents" onClick={closeMenu}>Explore the archive <ArrowUpRight size={14} /></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image-wrap"><img className="hero-image" src="/manus-storage/folklore-hero_5b8b317d.webp" alt="Aerial view of a green forest canopy with white birds flying across it" /><div className="hero-image-wash" /><div className="hero-image-caption"><span>Field note 001</span><span>Canopy / in motion</span></div></div>
        <div className="hero-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> A marketplace built on record, not rating</div><h1 id="hero-title">Every agent here has a <em>story.</em></h1><p className="hero-sub">Folklore is where AI agents for e-commerce ops earn their reputation — through real tasks, real outputs, and the people who have actually run them.</p><div className="hero-actions"><a className="button button-primary" href="#agents">Browse agents <ArrowRight size={16} /></a><a className="button button-ghost" href="#forum">Join the forum <ArrowUpRight size={16} /></a></div><div className="hero-proof"><div><strong>01</strong><span>Read the record</span></div><div><strong>02</strong><span>Run the task</span></div><div><strong>03</strong><span>Share what changed</span></div></div></div>
        <div className="hero-side-note"><span>Trusted by operators</span><strong>who prefer proof<br />to promises.</strong><ArrowDownRight size={20} /></div>
      </section>

      <div className="seal-divider" aria-hidden="true"><span className="rule" /><span className="seal">◆ Told, tested, trusted ◆</span><span className="rule" /></div>

      <section className="section-shell categories-section" id="agents" aria-labelledby="agents-title">
        <div className="section-intro"><div className="eyebrow"><span className="eyebrow-dot" /> Browse by field</div><h2 id="agents-title">A better way to find the right <em>help.</em></h2><p>Not a wall of five-star ratings. A living index of the work, the workflow, and what actually happened when an operator pressed run.</p><a className="text-link" href="#featured">See the featured record <ArrowUpRight size={15} /></a></div>
        <div className="category-grid">{categories.map((category, index) => <a className={`category-card card-${index + 1}`} href="#featured" key={category.title} onClick={() => selectTab(index === 0 ? "support" : index === 1 ? "inventory" : index === 2 ? "fulfillment" : "marketing")}><span className="card-index">{category.number}</span><span className="category-icon" aria-hidden="true">{category.icon}</span><h3>{category.title}</h3><p>{category.text}</p><span className="card-arrow"><ArrowUpRight size={16} /></span></a>)}</div>
      </section>

      <section className="archive-band" id="forum" aria-labelledby="forum-title"><div className="archive-pattern" /><div className="archive-inner"><div className="archive-heading"><div className="eyebrow eyebrow-gold"><span className="eyebrow-dot" /> The forum</div><h2 id="forum-title">The part the listing <em>can’t</em> tell you.</h2><p>Operators leave the context behind the result: the odd edge case, the workflow it replaced, the thing they would do differently next time.</p><a className="button button-light" href="#submit">Read the field notes <ArrowRight size={16} /></a></div><div className="thread-list"><div className="thread-card"><div><span className="thread-kicker">Customer support · 12 min read</span><h3>“It got the tone right because we gave it a boundary.”</h3></div><ArrowUpRight size={18} /></div><div className="thread-card"><div><span className="thread-kicker">Inventory · 8 min read</span><h3>What changed when the reorder brief became daily.</h3></div><ArrowUpRight size={18} /></div><div className="thread-card"><div><span className="thread-kicker">Fulfillment · 5 min read</span><h3>A missed delivery is a story before it is a ticket.</h3></div><ArrowUpRight size={18} /></div><div className="archive-quote"><Quote size={20} /><p>“The useful part wasn’t automation. It was finally seeing the pattern.”</p><span>— Marina, home goods operator</span></div></div></div></section>

      <section className="section-shell featured-section" id="featured" aria-labelledby="featured-title"><div className="featured-header"><div><div className="eyebrow"><span className="eyebrow-dot" /> Open record / 04</div><h2 id="featured-title">Featured agent</h2></div><p className="featured-header-note">A living sample from the Folklore archive.<br />Switch fields to see how the record changes.</p></div><div className="pill-tabs" role="tablist" aria-label="Featured agent categories"><span className="pill-indicator" style={{ transform: `translateX(${tabs.findIndex(([key]) => key === activeTab) * 100}%)`, width: `${100 / tabs.length}%` }} />{tabs.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={activeTab === key} className={activeTab === key ? "active" : ""} onClick={() => selectTab(key)}>{label}</button>)}</div><div className="agent-record"><div className={`agent-avatar ${agent.color}`}>{agent.initials}<span className="avatar-check"><Check size={11} /></span></div><div className="agent-main"><div className="record-meta"><span className="live-dot" /> Verified field note <span className="meta-separator">/</span> {agent.category}</div><h3>{agent.title}</h3><p>{agent.description}</p><div className="agent-footer"><span className="agent-observation"><Activity size={15} /> {agent.note}</span><div className="rating-wrap" aria-label={`Rate ${agent.title}`}><span className="rating-label">Your read</span><div className="stars">{[1, 2, 3, 4, 5].map((star) => <button className={star <= rating ? "star on" : "star"} type="button" aria-label={`${star} star${star > 1 ? "s" : ""}`} key={star} onClick={() => setRating(star)}><Star size={18} fill="currentColor" /></button>)}</div></div></div></div><div className="agent-side"><span className="record-number">FN—{String(tabs.findIndex(([key]) => key === activeTab) + 1).padStart(2, "0")}</span><button className={`like-button ${liked ? "liked" : ""}`} type="button" aria-pressed={liked} onClick={() => setLiked((value) => !value)}><Heart size={16} fill={liked ? "currentColor" : "none"} /><span>{liked ? 129 : 128}</span></button><span className="like-caption">Operators saved this record</span></div></div></section>

      <section className="privacy-section" id="privacy" aria-labelledby="privacy-title"><div className="privacy-copy"><div className="eyebrow"><span className="eyebrow-dot" /> Privacy gateway / live pattern</div><h2 id="privacy-title">Share the <em>need,</em> not the record.</h2><p>Describe what the client needs. Folklore removes common identifiers, checks for instruction hijacking, and sends each downstream agent only the fields required for its job.</p><div className="privacy-principles"><div><LockKeyhole size={17} /><span><strong>Redact first</strong>Emails, phones, cards, IPs, and credentials are replaced before routing.</span></div><div><UsersRound size={17} /><span><strong>Need-to-know</strong>Agents receive an opaque reference and a bounded task summary.</span></div><div><ShieldCheck size={17} /><span><strong>Fail closed</strong>Suspicious requests are blocked or held for review, never improvised.</span></div></div><form className="privacy-form" onSubmit={handlePrivacySubmit}><label htmlFor="privacy-request">Client need</label><textarea id="privacy-request" value={privacyRequest} onChange={(event) => setPrivacyRequest(event.target.value)} placeholder="Example: A customer needs a refund because a delivery is late." rows={5} required /><div className="privacy-form-grid"><label htmlFor="client-reference">Opaque client reference <span>optional</span><input id="client-reference" value={clientReference} onChange={(event) => setClientReference(event.target.value)} placeholder="Internal reference" /></label><label htmlFor="privacy-agent">Route to<select id="privacy-agent" value={privacyAgent} onChange={(event) => setPrivacyAgent(event.target.value)}><option value="auto">Auto-select by need</option><option value="support">Support</option><option value="inventory">Inventory</option><option value="fulfillment">Fulfillment</option><option value="marketing">Marketing</option></select></label></div><button className="button button-primary privacy-submit" type="submit" disabled={privacyLoading}>{privacyLoading ? "Checking boundary…" : "Run privacy check"} {privacyLoading ? <ShieldCheck size={16} /> : <Send size={16} />}</button></form></div><div className="privacy-panel"><div className="privacy-panel-header"><span className="privacy-panel-label"><span className="live-dot" /> Gateway status</span><span className="privacy-default">Default deny</span></div>{privacyResult ? <div className={`privacy-result result-${privacyResult.status}`}><div className="privacy-result-title">{privacyResult.status === "blocked" ? <AlertTriangle size={20} /> : privacyResult.status === "forwarded" ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}<strong>{privacyResult.status === "blocked" ? "Request blocked" : privacyResult.status === "forwarded" ? "Need shared safely" : "Review boundary"}</strong><span className="risk-label">{privacyResult.decision.risk} risk</span></div><p>{privacyResult.response}</p>{privacyResult.redactions.length > 0 && <div className="privacy-result-block"><span className="result-kicker">Redactions applied</span><div className="redaction-list">{privacyResult.redactions.map((item) => <span key={item.label}>{item.label.replace("_", " ")} × {item.count}</span>)}</div></div>}<div className="privacy-result-block"><span className="result-kicker">Downstream recipients</span>{privacyResult.audit.recipients.length > 0 ? <div className="recipient-list">{privacyResult.audit.recipients.map((recipient) => <span key={recipient}>{recipient} agent</span>)}</div> : <span className="empty-result">No agent received the request.</span>}</div>{privacyResult.outboundMessages.length > 0 && <div className="privacy-message-preview"><span className="result-kicker">Safe outbound summary</span><p>{privacyResult.outboundMessages[0].needSummary}</p><span className="allowed-fields">Allowed fields: {privacyResult.outboundMessages[0].allowedFields.join(" · ")}</span></div>}<div className="privacy-audit"><ShieldCheck size={15} /> Raw client data forwarded: <strong>never</strong></div></div> : <div className="privacy-empty"><ShieldCheck size={29} /><strong>Ready to inspect a need.</strong><p>The result will show what was redacted, which agent can receive the task, and why.</p><div className="privacy-empty-row"><span>1. sanitize</span><span>2. assess</span><span>3. route</span></div></div>}</div></section>

      <section className="process-section" id="verify" aria-labelledby="process-title"><div className="process-image"><img src="/manus-storage/folklore-botanical_ec118ecd.png" alt="Hand-inked botanical field guide illustration with birds and reeds" /><span className="image-stamp">No. 07<br />Field guide</span></div><div className="process-content"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> How it works</div><h2 id="process-title">Trust is a <em>trail,</em> not a badge.</h2><div className="steps"><div className="step"><span className="step-number">01</span><div><h3>Browse the record</h3><p>Start with the real task and the proof attached to it — not a promise about the future.</p></div></div><div className="step"><span className="step-number">02</span><div><h3>Run it in your world</h3><p>Try the workflow where it matters. Keep your edge cases close and your expectations legible.</p></div></div><div className="step"><span className="step-number">03</span><div><h3>Leave the next clue</h3><p>Share what changed so the next operator can make a better decision, faster.</p></div></div></div></div></section>

      <section className="closing-section" id="submit" aria-labelledby="closing-title"><div className="closing-mark"><BookOpen size={23} /><span>Archive note / 2026</span></div><div><div className="eyebrow"><span className="eyebrow-dot" /> For operators, by operators</div><h2 id="closing-title">Bring the work<br />worth <em>remembering.</em></h2></div><div className="closing-action"><p>Have an agent that earned its place in your stack? Give it a proper record.</p><a className="button button-primary" href="#top">Submit an agent <ArrowUpRight size={16} /></a></div></section>
    </main>

    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark"><img src="/manus-storage/folklore-mark_b6f5994d.png" alt="" /></span><span>Folk<span>lore</span></span></a><span>AI agents for the work behind the storefront.</span><span>© 2026 Folklore archive</span></footer>
  </div>;
}
