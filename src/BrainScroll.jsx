import { useEffect, useRef, useState } from "react";
import "./CinematicJourney.css";

const stages = [
  {
    kicker: "EARLY CHILDHOOD",
    title: "The world is big, bright, and full of wonder.",
    copy: "Color, sound, texture, movement, and tiny details can all feel enormous. There is no single right way to explore a new world.",
    note: "Different ways of experiencing the world are still real ways of connecting with it.",
    focusY: 8,
  },
  {
    kicker: "CHILDHOOD",
    title: "Curiosity grows. So do the details.",
    copy: "Play, routines, favorite subjects, patterns, and focused interests can become powerful ways to learn, communicate, and feel grounded.",
    note: "Interest can become confidence when it is supported instead of redirected.",
    focusY: 25,
  },
  {
    kicker: "SCHOOL YEARS",
    title: "New rooms bring new rules, rhythms, and expectations.",
    copy: "Classrooms, friendships, noise, schedules, and social cues can arrive all at once. Understanding from the people around us can change the entire experience.",
    note: "Support can turn pressure into possibility.",
    focusY: 42,
  },
  {
    kicker: "TEEN YEARS",
    title: "Identity gets louder while the world asks for more.",
    copy: "Growing into yourself can mean discovering boundaries, strengths, communication styles, interests, and the people who make it easier to be fully yourself.",
    note: "Being understood should not require pretending to be someone else.",
    focusY: 59,
  },
  {
    kicker: "YOUNG ADULTHOOD",
    title: "Independence can look different for everyone.",
    copy: "Work, relationships, routines, creativity, and responsibility all take shape in different ways. There is more than one path toward a meaningful adult life.",
    note: "Different paths can still lead to purpose, connection, and success.",
    focusY: 76,
  },
  {
    kicker: "ADULTHOOD",
    title: "The spectrum does not disappear with age.",
    copy: "Adults build careers, relationships, communities, families, routines, and lives of their own while continuing to experience the world in uniquely personal ways.",
    note: "Acceptance belongs at every age.",
    focusY: 93,
  },
];

function CinematicScene({ stageIndex, stageProgress, progress }) {
  const stage = stages[stageIndex];
  const drift = (stageProgress - 0.5) * 3.5;
  const focusY = Math.max(0, Math.min(100, stage.focusY + drift));
  const scale = 1.03 + stageProgress * 0.045;

  return (
    <div className="cinematicScene" aria-hidden="true">
      <img
        className="cinematicSceneImage"
        src={`${import.meta.env.BASE_URL}spectrum-life-cinematic.webp`}
        alt=""
        style={{
          objectPosition: `50% ${focusY}%`,
          transform: `scale(${scale})`,
        }}
      />
      <div className="cinematicSceneWash" />
      <div className="cinematicSceneLight" style={{ opacity: 0.16 + progress * 0.12 }} />
      <div className="cinematicSceneVignette" />
      <div className="cinematicSceneGrain" />
    </div>
  );
}

export default function BrainScroll() {
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = Math.max(1, rect.height - viewportHeight);
      const next = Math.min(Math.max(-rect.top / travel, 0), 1);

      setProgress(next);
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
  const stageProgress = stageIndex === stages.length - 1 && progress === 1 ? 1 : rawStage - stageIndex;
  const stage = stages[stageIndex];

  return (
    <section ref={sectionRef} className="lifeJourney" aria-label="The Spectrum Through Life">
      <div className="lifeJourneySticky">
        <CinematicScene stageIndex={stageIndex} stageProgress={stageProgress} progress={progress} />

        <div className="journeyTopline">
          <span>THE SPECTRUM THROUGH LIFE</span>
          <span>{String(stageIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span>
        </div>

        <div className="journeyContent" key={stage.kicker}>
          <p className="journeyKicker">{stage.kicker}</p>
          <h2>{stage.title}</h2>
          <p className="journeyBody">{stage.copy}</p>
          <p className="journeyNote">{stage.note}</p>
        </div>

        <div className="journeyStageRail" aria-hidden="true">
          {stages.map((item, index) => (
            <span key={item.kicker} className={index === stageIndex ? "active" : ""}>
              <i />
              <b>{String(index + 1).padStart(2, "0")}</b>
            </span>
          ))}
        </div>

        <div className="journeyProgress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="journeyScrollCue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <i>↓</i>
        </div>
      </div>
    </section>
  );
}
