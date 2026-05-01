export function CosmicBackground({ stars = true }: { stars?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cosmic">
      {stars && <div className="absolute inset-0 stars opacity-70" />}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-glow blur-3xl" />
      <div className="absolute bottom-[-200px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-[50%] bg-aurora opacity-25 blur-3xl" />
    </div>
  );
}
