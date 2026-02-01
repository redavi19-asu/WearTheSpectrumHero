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

function useIsNarrow(bp = 768) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= bp : false
  );

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth <= bp);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);

  return narrow;
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
      // progress 0..1 only while the section is pinned in view
      const travel = Math.max(1, rect.height - vh);      // distance the section “scrolls” while sticky
      const raw = Math.max(0, -rect.top) / travel;       // 0 when top hits viewport, 1 when bottom leaves
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
  const BASE = import.meta.env.BASE_URL;
  const reducedMotion = usePrefersReducedMotion();
  useRevealOnScroll(".reveal");
  const isNarrow = useIsNarrow();

  useEffect(() => {
    const history = window.history;
    const prevRestoration = history.scrollRestoration;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = prevRestoration;
      }
    };
  }, []);

  const lineSectionRef = useRef(null);
  const videoRef = useRef(null);
  const lineProgress = useScrollProgress(lineSectionRef);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const sync = () => {
      if (!v.duration || Number.isNaN(v.duration)) return;
      const t = Math.max(0, Math.min(1, lineProgress));
      v.currentTime = t * v.duration;
    };

    sync();
    v.addEventListener("loadedmetadata", sync);
    return () => v.removeEventListener("loadedmetadata", sync);
  }, [lineProgress]);

  useEffect(() => {
    const el = lineSectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const inside = rect.top <= 0 && rect.bottom >= vh;
      setIsPinned(inside);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isPinned) return;
    const section = lineSectionRef.current;
    if (!section) return;
    section.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
  }, [isPinned]);

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
    const el = document.getElementById(id);
    if (!el) return;

    if (reducedMotion) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    const startY = window.scrollY || window.pageYOffset;
    const targetY = el.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    const duration = 900;
    const startTime = performance.now();

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOut(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
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
                src={`${BASE}assets/spectrumhero.png`}
                alt="Spectrum Hero patch"
              />
            </div>
          </div>
        </div>

        <div className={`scrollHint ${reducedMotion ? "" : "bounce"}`}>
          <span>Scroll</span>
          <span className="arrow">↓</span>
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

        <div className={`scrollHint ${reducedMotion ? "" : "bounce"}`}>
          <span>Scroll</span>
          <span className="arrow">↓</span>
        </div>
      </section>

      {/* STORY C — PINNED RING → BRAIN (8 colors only) */}
      <section ref={lineSectionRef} className="pinSection" id="story-c">
        <div
          className={`pinSticky ${isPinned ? "isPinned" : ""}`}
          style={{
            "--profile": Math.min(1, Math.max(0, (lineProgress - 0.08) / 0.40)),
            "--brain": Math.min(1, Math.max(0, (lineProgress - 0.35) / 0.65)),
          }}
        >
          <div className="pinCopy">
            <h2 className="h2 reveal">This is what “autism” can feel like.</h2>

            <p className="p reveal">
              Not broken. Not less. Just different wiring — processing more, sensing more,
              noticing patterns other people miss.
            </p>

            <p className="p reveal">
              Autism isn’t a defect. It’s a different operating system.
              Different sensory input. Different communication styles.
              Different rhythm — with real strengths: focus, honesty,
              creativity, deep interests.
            </p>

            <p className="p reveal">
              Keep scrolling. The colors keep moving, because the brain never stops working.
              And as it forms, the message is simple:
              <span className="quote"> make space, be patient, lead with kindness.</span>
            </p>

            <p className="p subtle reveal">
              Some days the world is too loud. Some days it’s too fast.
              This is a reminder that understanding is a superpower —
              and support changes everything.
            </p>
          </div>

          <div className="ringBrainStage reveal">
            <video
              ref={videoRef}
              className="rbVideo"
              src={`${BASE}assets/brain-scroll.mp4`}
              muted
              playsInline
              preload="auto"
              poster={`${BASE}assets/spectrumhero.png`}
            />
          </div>

          <div className="pinHint reveal">
            <span className="chip dot blue">keep scrolling</span>
            <span className="chip dot green">watch it form</span>
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
                src={`${BASE}assets/spectrumhero.png`}
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

        <div className={`scrollHint ${reducedMotion ? "" : "bounce"}`}>
          <span>Scroll</span>
          <span className="arrow">↓</span>
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
