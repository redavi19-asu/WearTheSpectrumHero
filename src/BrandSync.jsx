import { useEffect } from "react";

export default function BrandSync() {
  useEffect(() => {
    const patchColors = ["#ff3b30", "#ffd60a", "#34c759", "#0a84ff"];

    const syncBrand = () => {
      const spectrumLetters = document.querySelectorAll(".title span");
      spectrumLetters.forEach((letter, index) => {
        letter.style.color = patchColors[index % patchColors.length];
      });

      const storyButton = Array.from(document.querySelectorAll(".heroCtas .btn"))
        .find((button) => button.textContent?.trim() === "Start the story");

      if (storyButton) {
        storyButton.style.background =
          "linear-gradient(90deg, #c92f2a 0%, #d6ad16 34%, #278a4b 67%, #216db4 100%)";
        storyButton.style.borderColor = "rgba(255,255,255,.18)";
      }
    };

    syncBrand();
    const observer = new MutationObserver(syncBrand);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
