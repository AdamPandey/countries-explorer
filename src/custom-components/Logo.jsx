// src/custom-components/Logo.jsx

export function Logo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The Globe */}
      <circle cx="50" cy="50" r="40" />
      
      {/* The Orbital Arc */}
      <path 
        d="M 20 60 A 45 20 0 1 0 80 40" 
        strokeDasharray="5, 10" // This gives it a cool, dashed "data path" look
      />
    </svg>
  );
}