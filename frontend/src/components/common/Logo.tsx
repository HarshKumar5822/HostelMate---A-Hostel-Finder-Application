export default function Logo({ size = 38 }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center select-none">
      <img
        src="/logo.png"
        alt="Room Mates"
        className="w-auto object-contain"
        style={{ height: `${size}px` }}
      />
    </span>
  );
}
