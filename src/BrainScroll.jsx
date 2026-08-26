import { useEffect, useRef, useState } from "react";
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

function SceneArt({ scene }) {
  return (
    <div className={`journeyScene journeyScene--${scene}`} aria-hidden="true">
      <div className="sceneGlow sceneGlowA" />
      <div className="sceneGlow sceneGlowB" />
      <div className="sceneFloor" />

      {scene === "play" && (
        <>
          <div className="cartoonPerson child childA"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /><span className="leg legL" /><span className="leg legR" /></div>
          <div className="cartoonPerson child childB"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /><span className="leg legL" /><span className="leg legR" /></div>
          <div className="sceneBall" />
          <div className="sceneBlocks"><i /><i /><i /></div>
        </>
      )}

      {scene === "school" && (
        <>
          <div className="sceneDesk deskA" /><div className="sceneDesk deskB" />
          <div className="cartoonPerson child schoolKidA"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /></div>
          <div className="cartoonPerson child schoolKidB"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /></div>
          <div className="sceneBoard"><span>ABC</span></div>
        </>
      )}

      {scene === "identity" && (
        <>
          <div className="cartoonPerson teen teenA"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /><span className="leg legL" /><span className="leg legR" /></div>
          <div className="cartoonPerson teen teenB"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /><span className="leg legL" /><span className="leg legR" /></div>
          <div className="speechBubble bubbleA">music</div>
          <div className="speechBubble bubbleB">ideas</div>
          <div className="spectrumArc" />
        </>
      )}

      {scene === "adult" && (
        <>
          <div className="sceneCouch" />
          <div className="cartoonPerson adult adultA"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /></div>
          <div className="cartoonPerson adult adultB"><span className="head" /><span className="body" /><span className="arm armL" /><span className="arm armR" /></div>
          <div className="speechBubble adultBubble">understanding</div>
          <div className="scenePlant"><i /><i /><span /></div>
        </>
      )}
    </div>
  );
}

export default function BrainScroll() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const travel = Math.max(1, rect.height - vh);
      setProgress(Math.min(Math.max(-rect.top / travel, 0), 1));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stageIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
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

          <div className="journeyVisual" key={`scene-${stageIndex}`}>
            <SceneArt scene={stage.scene} />
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
