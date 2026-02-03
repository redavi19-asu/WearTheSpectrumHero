import { useEffect, useRef, useState } from "react";

export default function BrainScroll() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      if (travel <= 0) return;

      const p = Math.min(Math.max(-rect.top / travel, 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    // iPhone Safari force-render fix
    setTimeout(() => {
      if (v.paused) {
        v.play().then(() => {
          v.pause();
          v.currentTime = 0;
        }).catch(() => {});
      }
    }, 200);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = progress * v.duration;
  }, [progress]);

  return (
    <section ref={sectionRef} className="brainScrollSection">
      <div className="pinSticky">
        <div className="brainSplit">
          
          {/* STORY TEXT */}
          <div className="brainCopy">
            <h2 className="brainTitle reveal">"Autism"</h2>

            <p>
              Not broken. Not less. Just different wiring — processing more,
              sensing more, noticing patterns others might miss.
            </p>

            <p>
              Autism isn’t a defect. It’s a different operating system.
              Different inputs. Different rhythms. Different strengths.
            </p>

            <p>
              Some days the world is too loud. Some days it’s too fast.
              Understanding changes everything.
            </p>
          </div>

          {/* VIDEO (UNCHANGED SIZE) */}
          <div className="brainVideoWrap">
            <video
              ref={videoRef}
              className="rbVideo"
              muted
              playsInline
              preload="auto"
              poster="/WearTheSpectrumHero/assets/spectrumhero.png"
            >
              <source src="/WearTheSpectrumHero/assets/brain-scroll-ios.mp4" type="video/mp4" />
            </video>
          </div>

        </div>
      </div>
    </section>
  );
}
