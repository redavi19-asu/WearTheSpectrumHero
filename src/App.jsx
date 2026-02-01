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
  const [isPinned, setIsPinned] = useState(false);

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
          className={`pinSticky ${isPinned ? "isPinned" : ""}`}
          style={{
            "--profile": Math.min(1, Math.max(0, (lineProgress - 0.08) / 0.40)),
            "--brain": Math.min(1, Math.max(0, (lineProgress - 0.35) / 0.65)),
          }}
        >
          <div className="pinCopy">
            <h2 className="h2 reveal">Keep scrolling.</h2>
            <p className="p reveal">
              The section holds. The colors move. The lines form a brain — because support isn’t one color.
            </p>
          </div>

          <div className="ringBrainStage reveal" aria-hidden="true">
            <svg className="rbSvg" viewBox="0 0 600 600">
              <defs>
                {/* Closed head/profile silhouette for clipping the brain inside */}
                <clipPath id="profileClip">
                  <path
                    d="
          M 380 145
          C 430 175, 450 235, 425 275
          C 418 290, 405 302, 392 308
          C 386 312, 380 314, 375 315
          C 386 337, 380 360, 362 375
          C 344 390, 325 395, 312 402
          C 320 430, 305 455, 278 470
          C 260 480, 248 495, 252 518
          C 250 545, 220 560, 195 545
          C 165 525, 158 492, 168 468
          C 178 444, 170 420, 150 395
          C 128 368, 130 330, 155 305
          C 175 285, 183 260, 180 235
          C 175 190, 210 150, 260 135
          C 310 120, 350 125, 380 145
          Z
        "
                  />
                </clipPath>
              </defs>

              {/* 1) WHITE PROFILE OUTLINE (real silhouette) */}
              <g className="profileLayer">
                <path
                  pathLength="1"
                  className="rbPath outline"
                  d="
        M 380 145
        C 430 175, 450 235, 425 275
              C 418 290, 405 302, 392 308
              C 386 312, 380 314, 375 315
        C 386 337, 380 360, 362 375
        C 344 390, 325 395, 312 402
        C 320 430, 305 455, 278 470
        C 260 480, 248 495, 252 518
        C 250 545, 220 560, 195 545
        C 165 525, 158 492, 168 468
        C 178 444, 170 420, 150 395
        C 128 368, 130 330, 155 305
        C 175 285, 183 260, 180 235
        C 175 190, 210 150, 260 135
        C 310 120, 350 125, 380 145
      "
                />
              </g>

              {/* 2) BRAIN INSIDE HEAD (8 colors, clipped to silhouette) */}
              <g className="brainInsideLayer" clipPath="url(#profileClip)" transform="translate(22 -12) scale(1.12)">
                {/* Outer brain boundary (subtle) */}
                <path pathLength="1" className="rbPath black"
                  d="M220,220
         C235,180 270,160 310,165
         C355,170 388,205 392,245
         C395,280 372,305 340,312
         C350,340 340,368 318,380
         C292,395 260,392 242,372
         C220,350 216,320 230,300
         C210,285 205,255 220,220 Z" />

                {/* Left hemisphere folds */}
                <path pathLength="1" className="rbPath red"
                  d="M245,210 C225,225 225,248 246,262 C266,276 292,276 304,292" />
                <path pathLength="1" className="rbPath orange"
                  d="M255,245 C238,260 240,282 260,295 C280,308 308,310 320,328" />
                <path pathLength="1" className="rbPath yellow"
                  d="M252,285 C236,300 240,322 260,334 C280,346 305,346 315,364" />
                <path pathLength="1" className="rbPath green"
                  d="M265,330 C252,350 265,370 290,372 C312,374 325,386 325,402" />

                {/* Right hemisphere folds */}
                <path pathLength="1" className="rbPath blue"
                  d="M320,205 C345,220 355,242 345,260 C335,280 312,288 312,306" />
                <path pathLength="1" className="rbPath indigo"
                  d="M340,235 C362,252 370,275 355,292 C340,308 315,312 312,332" />
                <path pathLength="1" className="rbPath violet"
                  d="M350,275 C368,292 372,318 352,330 C332,342 305,345 298,362" />

                {/* Midline sulcus (makes it read “brain” immediately) */}
                <path pathLength="1" className="rbPath black"
                  d="M305,182 C292,200 292,225 305,242
         C318,260 318,285 305,302
         C292,320 292,345 305,362" />
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
