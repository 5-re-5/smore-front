interface IconProps {
  className?: string;
}

export const LockIcon = ({ className }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 7V5a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <path d="M6 7h4" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="8" cy="11" r=".8" fill="currentColor" />
  </svg>
);
