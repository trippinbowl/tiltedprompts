export default function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06d6a0" />
        </linearGradient>
        <linearGradient id="logo-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M18 48L30 8L42 8L30 48Z" fill="url(#logo-grad)" opacity="0.95" />
      <path d="M30 48L42 8L54 8L42 48Z" fill="url(#logo-grad-2)" opacity="0.55" />
    </svg>
  );
}
