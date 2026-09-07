import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Public landing page for AskAU.
 *
 * Editorial, single-column marketing page shown to unauthenticated
 * visitors at the site root. Copy is drawn from the MISD "Ask AU"
 * initiative brief. Styling is scoped to `.landing` (see styles/landing.css)
 * and intentionally does not follow the app's dark theme.
 */

const NAV_LINKS = [
  { label: "What it does", href: "#what-it-does" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Governance", href: "#governance" },
  { label: "Contact", href: "#contact" },
];

const HERO_PROMPTS = [
  "What's the leave policy for staff on secondment?",
  "Find the latest AfCFTA implementation report",
  "How do I request a procurement approval?",
];

const LAYERS = [
  {
    key: "A",
    title: "Search institutional knowledge",
    body: "Query policy documents, resolutions, directorate archives and past correspondence in plain language, with answers grounded in and cited back to the source document.",
  },
  {
    key: "B",
    title: "Work across connected systems",
    body: "HR, finance, procurement and IT service platforms are reachable from one conversational interface, replacing the need to know which system holds which answer.",
  },
  {
    key: "C",
    title: "Act on multi-step requests",
    body: "Beyond answering, Ask AU can draft a memo, open a request, or route an approval to the right desk — always with a clear record of what it did and why.",
  },
];

const PHASES = [
  {
    number: "01",
    title: "Enterprise Knowledge Platform",
    body: "Unifies AU documents, policies and institutional memory into one searchable, governed foundation.",
    status: "In progress",
    solid: true,
  },
  {
    number: "02",
    title: "Enterprise Integration Platform",
    body: "Connects Ask AU to the HR, finance and procurement systems staff already use every day.",
    status: "Planned",
    solid: false,
  },
  {
    number: "03",
    title: "Agentic AI Platform",
    body: "Extends Ask AU from answering questions to completing tasks and workflows across departments.",
    status: "Planned",
    solid: false,
  },
];

const GOVERNANCE = [
  {
    title: "Sourced, not invented",
    body: "Every answer drawn from AU knowledge is traceable to the document or system it came from.",
  },
  {
    title: "Access follows role",
    body: "Ask AU only surfaces what a staff member is already permitted to see — nothing is exposed beyond existing access controls.",
  },
  {
    title: "Human oversight on action",
    body: "Requests that change a record or trigger a workflow are logged and routed for the appropriate approval, not executed silently.",
  },
];

const ACCESS_HREF = "/login";
const CONTACT_HREF = `mailto:${siteConfig.supportEmail}`;

function Tricolor() {
  return (
    <div className="landing-tricolor" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function HeroRadar() {
  const outerHex = "160,50 255,105 255,215 160,270 65,215 65,105";
  const innerShape = "160,90 199,138 208,188 160,230 125,180 117,135";
  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Stylised coverage diagram across AU systems"
    >
      <g stroke="var(--line)" fill="none" strokeWidth="1">
        <circle cx="160" cy="160" r="40" />
        <circle cx="160" cy="160" r="80" />
        <circle cx="160" cy="160" r="120" />
        <circle cx="160" cy="160" r="150" />
        <line x1="10" y1="160" x2="310" y2="160" />
        <line x1="160" y1="10" x2="160" y2="310" />
      </g>
      <polygon points={outerHex} fill="none" stroke="var(--au-green-bright)" strokeWidth="1.5" />
      <polygon
        points={innerShape}
        fill="var(--au-gold)"
        fillOpacity="0.28"
        stroke="var(--au-gold)"
        strokeWidth="1.5"
      />
      {outerHex.split(" ").map((pt) => {
        const [cx, cy] = pt.split(",");
        return <circle key={pt} cx={cx} cy={cy} r="3.5" fill="var(--au-green-bright)" />;
      })}
      <circle cx="160" cy="160" r="4.5" fill="var(--au-red)" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/au-emblem.png"
            alt="African Union emblem"
            width={250}
            height={225}
            priority
            className="h-10 w-auto"
          />
          <span className="landing-display text-xl font-semibold">Ask AU</span>
          <span aria-hidden="true" className="hidden h-4 w-px bg-[var(--line)] sm:block" />
          <span className="hidden text-[0.6875rem] tracking-wide text-[var(--ink-faint)] uppercase sm:inline">
            African Union Commission · MISD
          </span>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="landing-navlink">
              {link.label}
            </a>
          ))}
        </nav>
        <Link href={ACCESS_HREF} className="landing-btn landing-btn--outline-dark">
          Login
        </Link>
      </header>
      <Tricolor />

      <main id="main-content">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="mb-6 flex items-center gap-2 text-[0.6875rem] tracking-wide text-[var(--ink-faint)] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--au-green-bright)]" />
              An initiative of the Management Information Systems Directorate
            </p>
            <h1 className="landing-display text-5xl md:text-6xl">
              One place to ask, across every AU system.
            </h1>
            <p className="mt-6 max-w-md text-[var(--ink-soft)]">
              Ask AU brings the Commission&apos;s policies, procedures and platforms into a single
              conversation — so staff spend less time searching, and more time working.
            </p>

            <div className="landing-ask mt-8 max-w-md">
              <span className="landing-ask__input">
                Ask about leave policy, budget codes, or IT support…
              </span>
              <span className="landing-ask__btn">Ask</span>
            </div>
            <div className="mt-4 flex max-w-lg flex-wrap gap-2">
              {HERO_PROMPTS.map((prompt) => (
                <span key={prompt} className="landing-chip">
                  {prompt}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <HeroRadar />
          </div>
        </section>

        {/* Quote band */}
        <section className="bg-[var(--paper-alt)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
            <div>
              <p className="landing-display text-3xl md:text-4xl">
                &ldquo;Knowledge at the Commission is not missing. It is scattered.&rdquo;
              </p>
              <p className="mt-4 text-[0.8125rem] text-[var(--ink-faint)]">
                — Finding from the AU 5-Year ICT Consultations
              </p>
            </div>
            <div className="space-y-4 text-[var(--ink-soft)]">
              <p>
                Policies live in one directorate&apos;s archive, procedures in another&apos;s inbox,
                and system access in a third&apos;s ticketing queue. Staff already know most of the
                answers exist somewhere inside the Commission — the cost is in finding them.
              </p>
              <p>
                Ask AU was proposed to close that gap: a single, governed AI layer that sits across
                the Commission&apos;s knowledge and systems, so any staff member can ask a question
                in plain language and get a grounded, sourced answer — or have Ask AU carry out the
                task itself.
              </p>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section id="what-it-does" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="landing-eyebrow">What it does</p>
          <h2 className="landing-display mt-3 max-w-2xl text-3xl md:text-4xl">
            An assistant that knows the Commission from the inside.
          </h2>
          <p className="mt-5 max-w-xl text-[var(--ink-soft)]">
            Ask AU is built in three layers, each expanding what the platform can do for staff
            without changing how they interact with it.
          </p>

          <div className="mt-12 border-t border-[var(--line)]">
            {LAYERS.map((layer) => (
              <div
                key={layer.key}
                className="grid gap-3 border-b border-[var(--line)] py-8 md:grid-cols-[3rem_1fr] md:gap-8"
              >
                <span className="landing-display text-lg text-[var(--ink-faint)]">{layer.key}</span>
                <div className="max-w-2xl">
                  <h3 className="font-semibold text-[var(--ink)]">{layer.title}</h3>
                  <p className="mt-2 text-[var(--ink-soft)]">{layer.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="landing-dark">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <p className="landing-eyebrow">Delivery roadmap</p>
            <h2 className="landing-display mt-3 text-3xl md:text-4xl">
              Built in three phases, over nine months.
            </h2>
            <p className="mt-5 max-w-xl text-[#c8d2c5]">
              Each phase is a working foundation for the next — knowledge first, then integration,
              then autonomous action.
            </p>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {PHASES.map((phase) => (
                <div key={phase.number}>
                  <p className="landing-display text-3xl text-[var(--au-gold)]">{phase.number}</p>
                  <h3 className="mt-4 font-semibold text-white">{phase.title}</h3>
                  <p className="mt-2 text-[0.875rem] text-[#c8d2c5]">{phase.body}</p>
                  <span
                    className={`landing-pill mt-4 ${
                      phase.solid ? "landing-pill--solid" : "landing-pill--outline"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Governance */}
        <section id="governance" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="landing-eyebrow">Governance &amp; trust</p>
          <div className="mt-3 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="landing-display text-3xl md:text-4xl">
                Answers you can rely on, and a record of everything asked.
              </h2>
              <p className="mt-5 max-w-md text-[var(--ink-soft)]">
                Ask AU is reviewed by MISD&apos;s cybersecurity and governance function at every
                phase, and built to meet the Commission&apos;s standards for data protection before
                it meets a single desk.
              </p>
            </div>
            <div className="space-y-8">
              {GOVERNANCE.map((item) => (
                <div key={item.title} className="landing-gov-item">
                  <h3 className="font-semibold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 text-[var(--ink-soft)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="landing-dark">
          <Tricolor />
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
            <h2 className="landing-display max-w-sm text-3xl md:text-4xl">
              Ask AU is rolling out across the Commission.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href={ACCESS_HREF} className="landing-btn landing-btn--gold">
                Request early access
              </Link>
              <a href={CONTACT_HREF} className="landing-btn landing-btn--outline-light">
                Contact MISD
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-[0.75rem] text-[var(--ink-faint)] md:flex-row md:items-center md:justify-between">
        <p>AskAU — an enterprise AI orchestration platform for the African Union Commission</p>
        <p>Management Information Systems Directorate</p>
      </footer>
    </div>
  );
}
