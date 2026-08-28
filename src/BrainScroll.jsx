import { useEffect, useRef, useState } from "react";
import "./CinematicJourney.css";

const stages = [
  {
    kicker: "EARLY CHILDHOOD",
    title: "The world starts big, bright, and full of motion.",
    copy: "Every sound, color, texture, face, and routine can feel larger than life. Wonder and overwhelm can exist in the same moment.",
    note: "Different ways of experiencing the world are still valid ways of experiencing it.",
    imageY: "0%",
    imageScale: 1.07,
    accent: "#f2b756",
    glow: "rgba(242,183,86,.22)",
  },
  {
    kicker: "CHILDHOOD",
    title: "Curiosity grows. Interests deepen.",
    copy: "Play, patterns, favorite subjects, movement, routines, and imagination can become powerful ways to connect with the world.",
    note: "A strong interest can be a doorway, not a limitation.",
    imageY: "20%",
    imageScale: 1.08,
    accent: "#65aef1",
    glow: "rgba(101,174,241,.2)",
  },
  {
    kicker: "SCHOOL YEARS",
    title: "New rooms bring new rules, rhythms, and expectations.",
    copy: "Classrooms, friendships, noise, transitions, and social expectations can arrive all at once. The right support can make space for strengths to show.",
    note: "Understanding can turn pressure into possibility.",
    imageY: "40%",
    imageScale: 1.08,
    accent: "#80c66a",
    glow: "rgba(128,198,106,.18)",
  },
  {
    kicker: "TEEN YEARS",
    title: "Identity gets louder while the world asks for more.",
    copy: "Teen years can mean finding your voice, learning your boundaries, discovering what helps, and deciding which expectations actually belong to you.",
    note: "Being understood should never require pretending to be someone else.",
    imageY: "60%",
    imageScale: 1.09,
    accent: "#ad75f2",
    glow: "rgba(173,117,242,.2)",
  },
  {
    kicker: "YOUNG ADULTHOOD",
    title: "Independence brings possibility and new kinds of pressure.",
    copy: "Work, relationships, responsibilities, routines, and self-advocacy become part of building a life that actually fits the person living it.",
    note: "Support does not erase independence. It can help make independence possible.",
    imageY: "80%",
    imageScale: 1.08,
    accent: "#f0a15d",
    glow: "rgba(240,161,93,.18)",
  },
  {
    kicker: "ADULTHOOD",
    title: "The spectrum does not disappear when childhood ends.",
    copy: "Autistic adults build careers, relationships, communities, families, routines, creative lives, and futures of their own.",
    note: "Acceptance belongs at every age.",
    imageY: "100%",
    imageScale: 1.06,
    accent: "#76b7f5",
    glow: "rgba(118,183,245,.2)",
  },
];

export default function BrainScroll() {
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const travel = Math.max(1, rect.height - viewport);
      setProgress(Math.min(Math.max(-rect.top / travel, 0), 1));
      frameRef.current = 0;
    };

    const onScroll = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const rawStage = progress * stages.length;
  const stageIndex = Math.min(stages.length - 1, Math.floor(rawStage));
  const stage = stages[stageIndex];

  const visualStyle = {
    "--image-y": stage.imageY,
    "--image-scale": stage.imageScale,
    "--stage-accent": stage.accent,
    "--stage-glow": stage.glow,
  };

  return (
    <section ref={sectionRef} className="lifeJourney" aria-label="The spectrum through life">
      <div className="lifeJourneySticky" style={visualStyle}>
        <div className="lifeJourneyImage" aria-hidden="true" />
        <div className="lifeJourneyShade" aria-hidden="true" />
        <div className="lifeJourneyGlow" aria-hidden="true" />

        <div className="lifeJourneyTopline">
          <span>THE SPECTRUM THROUGH LIFE</span>
          <span>{String(stageIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
        </div>

        <div className="lifeJourneyContent">
          <article className="lifeJourneyCard" key={stageIndex}>
            <p className="lifeJourneyKicker">{stage.kicker}</p>
            <h2>{stage.title}</h2>
            <p className="lifeJourneyBody">{stage.copy}</p>
            <p className="lifeJourneyNote">{stage.note}</p>
          </article>
        </div>

        <div className="lifeJourneyRail" aria-hidden="true">
          {stages.map((item, index) => (
            <span key={item.kicker} className={index === stageIndex ? "active" : ""} />
          ))}
        </div>

        <div className="lifeJourneyHint" aria-hidden="true">SCROLL TO MOVE THROUGH THE STORY</div>
        <div className="lifeJourneyProgress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
