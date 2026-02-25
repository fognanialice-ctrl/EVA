export default function FilmGrain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="g">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves={4}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#g)" />
    </svg>
  );
}
