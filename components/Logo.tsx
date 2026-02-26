export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Brutalist thick border box */}
      <rect x="10" y="30" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="10" />
      
      {/* Data bars */}
      <rect x="22" y="60" width="14" height="25" fill="currentColor" />
      <rect x="43" y="45" width="14" height="40" fill="currentColor" />
      
      {/* Neon orange breakout bar */}
      <rect x="64" y="10" width="14" height="75" fill="#FF4F00" />
      
      {/* Tech/Cyberpunk cut detail */}
      <rect x="60" y="24" width="22" height="6" fill="black" />
    </svg>
  );
}
