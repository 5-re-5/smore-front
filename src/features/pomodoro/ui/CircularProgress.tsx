interface CircularProgressProps {
  progress: number; // 0-100
  children?: React.ReactNode;
}

export const CircularProgress = ({ progress }: CircularProgressProps) => {
  // 184.32px = 11.52rem (outer container size)
  const OUTER_SIZE = 11.52;
  // 38.88px = 2.43rem (stroke width)
  const STROKE_WIDTH = 2.6;
  // 67.68px = 4.23rem (button outer container)
  const BUTTON_OUTER_SIZE = 3.1;

  const center = (OUTER_SIZE * 16) / 2; // Convert rem to px for SVG
  // Position the progress circle just outside the button container
  const radius = (BUTTON_OUTER_SIZE * 16) / 2 + (STROKE_WIDTH * 16) / 2 + 8; // 8px gap
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <svg
      width={OUTER_SIZE * 16}
      height={OUTER_SIZE * 16}
      className="absolute transform -rotate-90"
      style={{ top: 0, left: 0 }}
    >
      {/* Progress circle with gradient */}
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#50CAFF" />
          <stop offset="100%" stopColor="#0478FF" />
        </linearGradient>
      </defs>

      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={STROKE_WIDTH * 16}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-linear"
      />
    </svg>
  );
};
