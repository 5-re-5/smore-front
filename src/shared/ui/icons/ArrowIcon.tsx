interface IconProps {
  className?: string;
}

export const ArrowIcon = ({ className }: IconProps) => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15.5531 6.55907C15.8618 6.25031 15.8618 5.7497 15.5531 5.44093L10.5214 0.409306C10.2127 0.10054 9.71207 0.10054 9.4033 0.409305C9.09454 0.718071 9.09454 1.21868 9.4033 1.52744L13.8759 6L9.4033 10.4726C9.09454 10.7813 9.09454 11.2819 9.4033 11.5907C9.71207 11.8995 10.2127 11.8995 10.5214 11.5907L15.5531 6.55907ZM0 6L-6.91203e-08 6.79064L14.994 6.79065L14.994 6L14.994 5.20936L6.91203e-08 5.20936L0 6Z"
      fill="currentColor"
    />
  </svg>
);
