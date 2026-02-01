import { motion, useReducedMotion } from "framer-motion";
import "./styles.css";

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main>
      {/* HERO SECTION */}
      <section className="panel hero" id="top">
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Wear the Spectrum Hero
        </motion.h1>

        <button
          className="scroll-arrow"
          aria-label="Scroll to next section"
          onClick={() =>
            document.querySelector("#symbol")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          ↓
        </button>
      </section>

      {/* SYMBOL INTRO */}
      <section className="panel dark" id="symbol">
        <motion.img
          src="/assets/spectrum-hero-patch-mosaic.png"
          alt="Spectrum Hero patch"
          initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <p>The Spectrum Hero represents strength across difference.</p>
      </section>

      {/* STORY */}
      <section className="panel light">
        <motion.h2
          whileInView={{ opacity: 1 }}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
        >
          A symbol of diversity.
        </motion.h2>
        <p>
          Each color tells a story. Together they form something whole — a hero
          made of spectrum.
        </p>
      </section>

      {/* TRANSFORMATION */}
      <section className="panel dark">
        <motion.img
          src="/assets/spectrum-hero-flat.png"
          alt="Spectrum Hero flat"
          initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 0.8 }}
          transition={{ duration: 0.8 }}
        />
        <p>From symbol… to something you can wear.</p>
      </section>

      {/* SHOP */}
      <section className="panel shop" id="shop">
        <h2>Wear the Spectrum Hero</h2>
        <p>10% of profits support autism awareness.</p>

        <div className="product-grid">
          <div className="product-card">T-Shirt</div>
          <div className="product-card">Hoodie</div>
          <div className="product-card">Hat</div>
        </div>

        <button className="cta">Shop the Collection</button>
      </section>
    </main>
  );
}
