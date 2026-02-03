export default function Patch({ size = "base" }) {
  const sizes = {
    base: 360,
    small: 160,
    big: 520,
  };

  return (
    <div style={{ maxWidth: sizes[size], margin: "0 auto" }}>
      <img
        src="/WearTheSpectrumHero/assets/spectrumhero.png"
        alt="Spectrum Hero patch"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
