/* Folklore home: a concise field-guide landing page that directs operators to the full agent library. */
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleDollarSign, Compass, Leaf, LockKeyhole, Menu, Monitor, Moon, Sparkles, Sun, X } from "lucide-react";

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

        <section className="closing-section" aria-labelledby="closing-title"><div className="closing-mark"><BookOpen size={23} /><span>Archive note / 2026</span></div><div><div className="eyebrow"><span className="eyebrow-dot" /> For operators, by operators</div><h2 id="closing-title">Start with the task<br />worth <em>understanding.</em></h2></div><div className="closing-action"><p>Open the library to inspect a record, try a workflow, and keep responsibility with your team.</p><a className="button button-primary" href="/agents#agent-library">Browse agents <Sparkles size={16} /></a></div></section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark"><img src="/manus-storage/folklore-mark_b6f5994d.png" alt="" /></span><span>Folk<span>lore</span></span></a><span>AI agents for the work behind the storefront.</span><span>© 2026 Folklore archive</span></footer>
    </div>
  );
}
