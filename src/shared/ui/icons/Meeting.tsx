import React from 'react';

interface IconProps {
  className?: string;
}

export const Meeting = ({ className }: IconProps) => (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.40039 1H8.46387L16.7998 9.99219V22C16.7998 22.2208 16.6211 22.4002 16.4004 22.4004H1.40039C1.17948 22.4004 1 22.2209 1 22V1.40039C1 1.17948 1.17948 1 1.40039 1Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
