import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function useRevealOnScroll(selector = ".reveal") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("in");
        }
      },
      { threshold: 0.18 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}

function useScrollProgress(ref) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress 0..1 as section crosses viewport
      const start = vh * 0.85;
      const end = -vh * 0.15;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      setP(clamped);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return p;
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  useRevealOnScroll(".reveal");

  const lineSectionRef = useRef(null);
  const lineProgress = useScrollProgress(lineSectionRef);

  const spectrumWord = useMemo(() => {
    const letters = "Spectrum".split("");
    const colors = [
      "var(--c-red)",
      "var(--c-orange)",
      "var(--c-yellow)",
      "var(--c-green)",
      "var(--c-blue)",
      "var(--c-indigo)",
      "var(--c-violet)",
      "var(--c-blue)",
    ];
    return letters.map((ch, i) => (
      <span key={i} style={{ color: colors[i % colors.length] }}>
        {ch}
      </span>
    ));
  }, []);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page">
      {/* HERO */}
      <header className="hero">
        <div className="heroInner">
          <div className="pill reveal">WEARTHESPECTRUMHERO</div>

          <h1 className="title reveal">
            Wear the {spectrumWord} Hero
          </h1>

          <p className="sub reveal">
            A small symbol with a big message: visibility, understanding, and support —
            without having to explain yourself every day.
          </p>

          <div className="heroCtas reveal">
            <button className="btn primary" onClick={() => scrollToId("story")}>
              Start the story
            </button>
            <button className="btn" onClick={() => scrollToId("patch")}>
              See the patch
            </button>
          </div>

          <div className={`scrollHint ${reducedMotion ? "" : "bounce"}`}>
            <span>Scroll</span>
            <span className="arrow">↓</span>
          </div>
        </div>
      </header>

      {/* STORY A */}
      <section id="story" className="section">
        <div className="container split">
          <div className="copy">
            <h2 className="h2 reveal">It shows up before you have to speak</h2>
            <p className="p reveal">
              The patch carries the message softly — not loud, not flashy. Just enough color to say:
              <span className="quote"> “Be patient. Be kind. Be human.”</span>
            </p>

            <div className="chips reveal">
              <span className="chip dot red">visibility</span>
              <span className="chip dot yellow">understanding</span>
              <span className="chip dot green">support</span>
              <span className="chip dot blue">respect</span>
            </div>

            <p className="p subtle reveal">
              It’s not a label. It’s a quiet signal that helps the room meet you halfway.
            </p>
          </div>

          <div className="visual reveal">
            <div className="patchStage">
              <div className="patchGlow" aria-hidden="true" />
              <img
                className="patchImg"
                src="/assets/spectrumhero.png"
                alt="Spectrum Hero patch"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STORY B */}
      <section className="section">
        <div className="container split reverse">
          <div className="copy">
            <h2 className="h2 reveal">A starter 8 colors — but one shared meaning</h2>
            <p className="p reveal">
              Like a Crayola starter pack: simple, familiar, and human. The colors aren’t “extra.”
              They’re a reminder that people experience the world differently — and that’s okay.
            </p>

            <div className="miniGrid reveal">
              <div className="miniCard">
                <div className="miniDot red" />
                <div>
                  <div className="miniTitle">Red</div>
                  <div className="miniText">presence</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot orange" />
                <div>
                  <div className="miniTitle">Orange</div>
                  <div className="miniText">warmth</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot yellow" />
                <div>
                  <div className="miniTitle">Yellow</div>
                  <div className="miniText">clarity</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot green" />
                <div>
                  <div className="miniTitle">Green</div>
                  <div className="miniText">calm</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot blue" />
                <div>
                  <div className="miniTitle">Blue</div>
                  <div className="miniText">trust</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot indigo" />
                <div>
                  <div className="miniTitle">Indigo</div>
                  <div className="miniText">depth</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot violet" />
                <div>
                  <div className="miniTitle">Violet</div>
                  <div className="miniText">care</div>
                </div>
              </div>
              <div className="miniCard">
                <div className="miniDot black" />
                <div>
                  <div className="miniTitle">Black</div>
                  <div className="miniText">respect</div>
                </div>
              </div>
            </div>

            <p className="p subtle reveal">
              The design stays friendly. The message stays serious.
            </p>
          </div>

          <div className="visual reveal">
            <div className="cardPanel">
              <h3 className="h3">What it’s for</h3>
              <ul className="list">
                <li>School, work, public spaces</li>
                <li>Days you don’t have the energy to explain</li>
                <li>Moments when kindness matters most</li>
              </ul>
              <div className="divider" />
              <p className="p subtle">
                Built to feel supportive — not clinical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY C — LINE DRAWS */}
      <section ref={lineSectionRef} className="section">
        <div className="container">
          <h2 className="h2 reveal">The spectrum line shows up — and the room slows down</h2>
          <p className="p reveal">
            You don’t need a speech. Just a signal that says: give me a second. Meet me with care.
          </p>

          <div className="lineWrap reveal" aria-hidden="true">
            <svg className="spectrumLine" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                className="linePath"
                d="M0,75 C140,20 260,120 400,70 C520,25 620,115 760,70 C900,25 980,95 1200,55"
                style={{
                  strokeDashoffset: `${(1 - lineProgress) * 1800}`,
                  transition: reducedMotion ? "none" : "stroke-dashoffset 120ms linear",
                }}
              />
            </svg>
          </div>
        </div>
      </section>

      {/* PATCH SECTION (KEEP GLOW + CLEAN BLACK) */}
      <section id="patch" className="section">
        <div className="container split">
          <div className="visual reveal">
            <div className="patchStage big">
              <div className="patchGlow" aria-hidden="true" />
              <img
                className="patchImg big"
                src="/assets/spectrumhero.png"
                alt="Spectrum Hero patch"
              />
            </div>
          </div>

          <div className="copy">
            <h2 className="h2 reveal">The patch</h2>
            <p className="p reveal">
              Stitched with intention. The black border keeps it grounded — the color keeps it human.
            </p>

            <div className="specs reveal">
              <div className="spec">
                <div className="specK">Style</div>
                <div className="specV">embroidered look</div>
              </div>
              <div className="spec">
                <div className="specK">Feel</div>
                <div className="specV">soft + durable</div>
              </div>
              <div className="spec">
                <div className="specK">Message</div>
                <div className="specV">kindness first</div>
              </div>
            </div>

            <button className="btn primary reveal" onClick={() => scrollToId("merch")}>
              See merch
            </button>
          </div>
        </div>
      </section>

      {/* MERCH BOX */}
      <section id="merch" className="section">
        <div className="container">
          <div className="merchHeader">
            <h2 className="h2 reveal">Merch</h2>
            <p className="p reveal">
              Clean, simple drops — patch-forward. No clutter.
            </p>
          </div>

          <div className="grid reveal">
            <article className="product">
              <div className="productTop">
                <div className="productBadge red" />
                <div>
                  <div className="productName">Patch Tee</div>
                  <div className="productSub">Everyday soft</div>
                </div>
              </div>
              <div className="productBody">
                <p className="p subtle">
                  The patch design, centered and calm. Built for daily wear.
                </p>
              </div>
              <div className="productActions">
                <button className="btn">Details</button>
                <button className="btn primary">Buy</button>
              </div>
            </article>

            <article className="product">
              <div className="productTop">
                <div className="productBadge blue" />
                <div>
                  <div className="productName">Hoodie</div>
                  <div className="productSub">Black-on-black vibe</div>
                </div>
              </div>
              <div className="productBody">
                <p className="p subtle">
                  Minimal outside, meaningful inside. Patch stays visible.
                </p>
              </div>
              <div className="productActions">
                <button className="btn">Details</button>
                <button className="btn primary">Buy</button>
              </div>
            </article>

            <article className="product">
              <div className="productTop">
                <div className="productBadge yellow" />
                <div>
                  <div className="productName">Cap / Beanie</div>
                  <div className="productSub">Small signal</div>
                </div>
              </div>
              <div className="productBody">
                <p className="p subtle">
                  For days you want the message without the conversation.
                </p>
              </div>
              <div className="productActions">
                <button className="btn">Details</button>
                <button className="btn primary">Buy</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footerLine" />
          <div className="footerSmall">
            <strong>Wear the Spectrum Hero</strong>
            <span>Built with care. Designed to feel human.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./styles.css";

function useInView(ref, options = { threshold: 0.35 }) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);

  return inView;
}

export default function App() {
  const prefersReduced = useReducedMotion();

  // Scroll hooks for color sweep behind the patch
  const patchWrapRef = useRef(null);
  const { scrollYProgress: patchProgress } = useScroll({
    target: patchWrapRef,
    offset: ["start end", "end start"],
  });

  const sweepX = useTransform(patchProgress, [0, 1], ["-20%", "20%"]);
  const sweepOpacity = useTransform(patchProgress, [0, 0.25, 0.7, 1], [0, 1, 1, 0]);

  // Section C: line draws when in view
  const sectionCRef = useRef(null);
  const cInView = useInView(sectionCRef);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  const chips = useMemo(
    () => [
      { label: "visibility", className: "chip chip-red" },
      { label: "understanding", className: "chip chip-yellow" },
      { label: "support", className: "chip chip-green" },
      { label: "respect", className: "chip chip-blue" },
    ],
    []
  );

  return (
    <div className="page">
      {/* drifting spectrum noise */}
      <div className="noise" aria-hidden="true" />

      {/* HERO */}
      <section className="section hero" id="top">
        <div className="heroInner">
          <div className="pill">WEARTHESPECTRUMHERO</div>

          <h1 className="heroTitle">
            Wear the <span className="spectrumWord">Spectrum</span> Hero
          </h1>

          <p className="heroSub">
            A small symbol with a big message: visibility, understanding, and support —
            without having to explain yourself every day.
          </p>

          <div className="heroActions">
            <button className="btn primary" onClick={() => goTo("story-a")}>
              Start the story
            </button>
            <button className="btn ghost" onClick={() => goTo("patch")}>
              See the patch
            </button>
          </div>

          <button className="scrollHint" onClick={() => goTo("story-a")} aria-label="Scroll">
            <span className="scrollText">Scroll</span>
            <span className="arrow" aria-hidden="true">↓</span>
          </button>
        </div>
      </section>

      {/* STORY A */}
      <section className="section story" id="story-a">
        <div className="contentGrid">
          <div>
            <h2 className="h2">Some days, words are heavy.</h2>
            <p className="p">
              Not everyone has the energy to explain what they need. The Spectrum Hero is
              a quiet signal — a way to ask for patience without making a speech.
            </p>

            <div className="callout">
              <div className="calloutDot" />
              <p className="calloutText">
                It’s not “look at me.” It’s “please meet me halfway.”
              </p>
            </div>
          </div>

          <div className="storyCard">
            <h3 className="h3">What it does</h3>
            <ul className="list">
              <li>Gives people context without spotlighting you</li>
              <li>Invites kindness before the moment gets hard</li>
              <li>Makes space for different communication styles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PATCH SECTION */}
      <section className="section patch" id="patch">
        <div className="patchLayout" ref={patchWrapRef}>
          {/* slow color sweep behind patch during scroll */}
          <motion.div
            className="sweep"
            style={{
              x: sweepX,
              opacity: prefersReduced ? 0.6 : sweepOpacity,
            }}
            aria-hidden="true"
          />

          <div className="patchText">
            <h2 className="h2 big">It shows up before you have to speak</h2>
            <p className="p">
              The patch carries the message softly — not loud, not flashy. Just enough
              color to say: <span className="quote">“Be patient. Be kind. Be human.”</span>
            </p>

            <div className="chipRow">
              {chips.map((c) => (
                <span key={c.label} className={c.className}>
                  <span className="chipDot" aria-hidden="true" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <div className="patchArt" aria-label="Spectrum Hero patch">
            <img src="/assets/spectrumhero.png" alt="Spectrum Hero patch" />
          </div>
        </div>
      </section>

      {/* SECTION C (LINE DRAWS) */}
      <section className="section c" id="story-c" ref={sectionCRef}>
        <div className="cInner">
          <div className="cTop">
            <h2 className="h2">A spectrum line — because support isn’t one color</h2>
            <p className="p">
              Some days are red. Some are blue. Some are everything at once. The line is a
              reminder: the goal isn’t “normal.” The goal is “understood.”
            </p>
          </div>

          <div className="lineStage" aria-hidden="true">
            <svg className="lineSvg" viewBox="0 0 1200 180" fill="none">
              <defs>
                <linearGradient id="crayola" x1="0" y1="0" x2="1200" y2="0">
                  <stop offset="0%" stopColor="#EE204D" />   {/* red */}
                  <stop offset="14%" stopColor="#FF7538" />  {/* orange */}
                  <stop offset="28%" stopColor="#FCE883" />  {/* yellow */}
                  <stop offset="42%" stopColor="#1CAC78" />  {/* green */}
                  <stop offset="56%" stopColor="#1F75FE" />  {/* blue */}
                  <stop offset="70%" stopColor="#7366BD" />  {/* purple */}
                  <stop offset="85%" stopColor="#926EAE" />  {/* violet */}
                  <stop offset="100%" stopColor="#FFFFFF" /> {/* fade */}
                </linearGradient>
              </defs>

              <motion.path
                d="M 20 130 C 140 40, 260 170, 380 110 C 520 40, 650 170, 780 110 C 900 50, 1020 150, 1180 90"
                stroke="url(#crayola)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  cInView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  duration: prefersReduced ? 0 : 1.6,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>

          <div className="cCards">
            <div className="miniCard">
              <h3 className="h3">For families</h3>
              <p className="p small">A gentle cue for patience in public spaces.</p>
            </div>
            <div className="miniCard">
              <h3 className="h3">For schools</h3>
              <p className="p small">A signal that supports different learning needs.</p>
            </div>
            <div className="miniCard">
              <h3 className="h3">For workplaces</h3>
              <p className="p small">A small badge that can reduce friction fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta" id="cta">
        <div className="ctaInner">
          <h2 className="h2">Wear it. Share it. Make space.</h2>
          <p className="p">
            This isn’t about “standing out.” It’s about being met with respect.
          </p>

          <div className="heroActions">
            <a className="btn primary" href="#" onClick={(e) => e.preventDefault()}>
              Get the patch
            </a>
            <button className="btn ghost" onClick={() => goTo("top")}>
              Back to top
            </button>
          </div>

          <div className="footerLine" />
          <div className="footerText">
            <strong>Wear the Spectrum Hero</strong>
            <div>Built with care. Designed to feel human.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
