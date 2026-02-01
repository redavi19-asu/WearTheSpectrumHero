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

      {/* STORY C — PINNED RING → BRAIN (8 colors only) */}
      <section ref={lineSectionRef} className="pinSection" id="story-c">
        <div
          className="pinSticky"
          style={{
            // local progress: stays 0 until you're clearly inside the pinned section
            "--t": Math.min(1, Math.max(0, (lineProgress - 0.12) / 0.88)),

            // draw ring first 0%→35%, brain 25%→100% (overlap feels smoother)
            "--ring": Math.min(1, Math.max(0, ((lineProgress - 0.12) / 0.88) / 0.35)),
            "--brain": Math.min(1, Math.max(0, (((lineProgress - 0.12) / 0.88) - 0.25) / 0.75)),

            // crossfade ring → brain
            "--ringFade": Math.min(1, Math.max(0, (0.58 - ((lineProgress - 0.12) / 0.88)) / 0.22)),
            "--brainFade": Math.min(1, Math.max(0, (((lineProgress - 0.12) / 0.88) - 0.35) / 0.25)),
          }}
        >
          <div className="pinCopy">
            <h2 className="h2 reveal">Keep scrolling.</h2>
            <p className="p reveal">
              The section holds. The colors move. The lines form a brain — because support isn’t one color.
            </p>
          </div>

          <div className="ringBrainStage reveal" aria-hidden="true">
            {/* RING: 8 solid-color segments (no extra colors) */}
            <svg className="rbSvg" viewBox="0 0 600 600">
              <g className="ringLayer">
                {/* each arc draws based on --ring */}
                <path pathLength="1" className="rbPath red"
                  d="M300,70 A230,230 0 0 1 473,143" />
                <path pathLength="1" className="rbPath orange"
                  d="M473,143 A230,230 0 0 1 530,300" />
                <path pathLength="1" className="rbPath yellow"
                  d="M530,300 A230,230 0 0 1 473,457" />
                <path pathLength="1" className="rbPath green"
                  d="M473,457 A230,230 0 0 1 300,530" />
                <path pathLength="1" className="rbPath blue"
                  d="M300,530 A230,230 0 0 1 127,457" />
                <path pathLength="1" className="rbPath indigo"
                  d="M127,457 A230,230 0 0 1 70,300" />
                <path pathLength="1" className="rbPath violet"
                  d="M70,300 A230,230 0 0 1 127,143" />
                <path pathLength="1" className="rbPath black"
                  d="M127,143 A230,230 0 0 1 300,70" />
              </g>

              {/* BRAIN: 8 segments (same palette). Draws based on --brain */}
              <g className="brainLayer">
                {/* Outer brain contour (more realistic) */}
                <path pathLength="1" className="rbPath black"
                  d="M300,150
       C245,125 185,145 165,205
       C145,265 175,295 170,330
       C160,405 205,455 260,475
       C285,485 292,505 300,520
       C308,505 315,485 340,475
       C405,450 450,400 435,330
       C430,295 460,265 440,205
       C420,145 355,125 300,150 Z" />

                {/* Left hemisphere folds */}
                <path pathLength="1" className="rbPath red"
                  d="M262,175 C225,175 205,200 212,228 C218,252 245,260 240,285" />
                <path pathLength="1" className="rbPath orange"
                  d="M230,245 C205,255 195,275 205,295 C215,315 245,315 238,338" />
                <path pathLength="1" className="rbPath yellow"
                  d="M215,315 C190,330 188,355 205,372 C222,388 252,382 250,405" />
                <path pathLength="1" className="rbPath green"
                  d="M235,365 C220,392 235,415 260,420 C282,424 292,440 288,462" />

                {/* Right hemisphere folds */}
                <path pathLength="1" className="rbPath blue"
                  d="M338,175 C375,175 395,200 388,228 C382,252 355,260 360,285" />
                <path pathLength="1" className="rbPath indigo"
                  d="M370,245 C395,255 405,275 395,295 C385,315 355,315 362,338" />
                <path pathLength="1" className="rbPath violet"
                  d="M385,315 C410,330 412,355 395,372 C378,388 348,382 350,405" />

                {/* Deeper sulci / inner curves (adds “real” texture) */}
                <path pathLength="1" className="rbPath red"
                  d="M290,205 C265,220 265,245 290,258 C315,272 315,295 290,308" />
                <path pathLength="1" className="rbPath blue"
                  d="M310,205 C335,220 335,245 310,258 C285,272 285,295 310,308" />

                <path pathLength="1" className="rbPath orange"
                  d="M280,330 C255,345 255,372 280,385 C305,398 305,420 282,435" />
                <path pathLength="1" className="rbPath indigo"
                  d="M320,330 C345,345 345,372 320,385 C295,398 295,420 318,435" />

                {/* Brain stem (simple but more believable) */}
                <path pathLength="1" className="rbPath black"
                  d="M300,520 C305,545 320,560 340,570" />
              </g>
            </svg>
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
