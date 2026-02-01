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
