import { useEffect, useMemo, useRef, useState } from "react";
import "./Journey.css";

const stages = [
  {
    kicker: "CHILDHOOD",
    title: "The world starts big, bright, and full of motion.",
    copy: "Play can look different for every child. Some jump right into the group. Some watch first. Some find joy in patterns, movement, color, sound, or one favorite thing.",
    note: "Different ways of playing are still ways of connecting.",
    scene: "play",
  },
  {
    kicker: "GROWING UP",
    title: "School brings new rooms, new rules, and new rhythms.",
    copy: "Friendships, classrooms, routines, noise, and expectations can all arrive at once. Understanding and patience can make those spaces feel safer and more welcoming.",
    note: "Support can turn pressure into possibility.",
    scene: "school",
  },
  {
    kicker: "TEEN + YOUNG ADULT",
    title: "Identity gets louder while the world asks for more.",
    copy: "Growing into yourself can mean discovering strengths, boundaries, interests, communication styles, and the people who make it easier to be fully yourself.",
    note: "Being understood should not require pretending to be someone else.",
    scene: "identity",
  },
  {
    kicker: "ADULTHOOD",
    title: "Autism does not end when childhood does.",
    copy: "Adults build relationships, careers, routines, communities, and lives of their own. A little awareness from the people around them can change the entire experience.",
    note: "Acceptance belongs at every age.",
    scene: "adult",
  },
];

function CinematicScene({ stageIndex, progress, stageProgress }) {
  const sceneStyle = useMemo(
    () => ({
      "--journey-progress": progress,
      "--stage-progress": stageProgress,
      "--stage-index": stageIndex,
    }),
    [progress, stageIndex, stageProgress],
  );

  return (
    <div className={`cinematicScene cinematicScene--${stages[stageIndex].scene}`} style={sceneStyle} aria-hidden="true">
      <div className="cinemaSky" />
      <div className="cinemaHalo cinemaHalo--one" />
      <div className="cinemaHalo cinemaHalo--two" />
      <div className="cinemaParticles">
        {Array.from({ length: 18 }).map((_, index) => (
          <i
            key={index}
            style={{
              "--particle": index,
              left: `${(index * 37) % 97}%`,
              top: `${(index * 53) % 88}%`,
            }}
          />
        ))}
      </div>

      <div className="cinemaWorld">
        <div className="environment environment--play">
          <div className="toyBlock toyBlock--a" /><div className="toyBlock toyBlock--b" /><div className="toyBlock toyBlock--c" />
          <div className="cinemaBall" />
        </div>

        <div className="environment environment--school">
          <div className="hallLine hallLine--one" /><div className="hallLine hallLine--two" />
          <div className="locker locker--a" /><div className="locker locker--b" /><div className="locker locker--c" />
          <div className="schoolDoor"><span>CLASS</span></div>
        </div>

        <div className="environment environment--identity">
          <div className="cityPanel cityPanel--a" /><div className="cityPanel cityPanel--b" /><div className="cityPanel cityPanel--c" />
          <div className="neonWord neonWord--one">IDEAS</div><div className="neonWord neonWord--two">VOICE</div>
        </div>

        <div className="environment environment--adult">
          <div className="windowFrame"><span /><span /><span /><span /></div>
          <div className="deskShape" /><div className="plantShape"><i /><i /><b /></div>
        </div>

        <div className="cinematicPerson">
          <div className="personShadow" />
          <div className="personHead"><i /></div>
          <div className="personNeck" />
          <div className="personTorso" />
          <div className="personArm personArm--left"><span /></div>
          <div className="personArm personArm--right"><span /></div>
          <div className="personLeg personLeg--left"><span /></div>
          <div className="personLeg personLeg--right"><span /></div>
        </div>

        <div className="cinemaForeground cinemaForeground--left" />
        <div className="cinemaForeground cinemaForeground--right" />
      </div>

      <div className="cinemaLens" />
      <div className="cinemaVignette" />
      <div className="cinemaCaption">SCROLL TO MOVE THROUGH THE STORY</div>
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
      const vh = window.innerHeight || 1;
      const travel = Math.max(1, rect.height - vh);
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
    <section ref={sectionRef} className="lifeJourney" aria-label="Autism through life stages">
      <div className="lifeJourneySticky">
        <div className="journeyBackdrop" />
        <div className="journeyGrain" />

        <div className="journeyTopline">
          <span>THE SPECTRUM THROUGH LIFE</span>
          <span>{String(stageIndex + 1).padStart(2, "0")} / 04</span>
        </div>

        <div className="journeyLayout">
          <div className="journeyCopy" key={`copy-${stageIndex}`}>
            <p className="journeyKicker">{stage.kicker}</p>
            <h2>{stage.title}</h2>
            <p className="journeyBody">{stage.copy}</p>
            <p className="journeyNote">{stage.note}</p>
          </div>

          <div className="journeyVisual">
            <CinematicScene stageIndex={stageIndex} progress={progress} stageProgress={stageProgress} />
          </div>
        </div>

        <div className="journeyProgress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="journeyDots" aria-hidden="true">
          {stages.map((item, index) => (
            <span key={item.kicker} className={index === stageIndex ? "active" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
