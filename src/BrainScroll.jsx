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
      <video
        ref={videoRef}
        className="rbVideo"
        muted
        playsInline
        preload="auto"
        poster="/WearTheSpectrumHero/assets/spectrumhero.png"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          WebkitTransform: "translateZ(0)",
        }}
      >
        <source src={`${import.meta.env.BASE_URL}assets/brain-scroll-ios.mp4`} type="video/mp4" />
      </video>
    </section>
  );
}
