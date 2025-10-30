// src/custom-components/Logo.jsx

export function Logo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="5" // Slightly thicker for a stronger presence
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The Globe */}
      <circle cx="50" cy="50" r="40" opacity="0.8" />
      
      {/* The Meridian Arc */}
      <path d="M 50 10 A 40 40 0 0 1 50 90" />
      
      {/* Subtle start/end points on the meridian */}
      <circle cx="50" cy="10" r="3" fill="currentColor" stroke="none" />
      <circle cx="50" cy="90" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}