// src/custom-components/globe/InfoCard.jsx

import { motion } from 'framer-motion';

// Animation variants for the card to slide in from the right
const cardVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
};

export function InfoCard({ country, onNavigate, onClose, theme }) {
  // Theme-aware styling
  const isDarkMode = theme === 'dark';
  const cardStyles = {
    width: '280px',
    padding: '16px',
    backgroundColor: isDarkMode ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    color: isDarkMode ? 'white' : '#18181b',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };
  const secondaryTextStyle = { color: isDarkMode ? '#a1a1aa' : '#71717a' };

  return (
    // This is a normal motion.div positioned absolutely within its parent
    <motion.div
      className="absolute top-4 right-4 z-10"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div style={cardStyles}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '24px',
            height: '24px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: isDarkMode ? '#b91c1c' : '#ef4444',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1',
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', textAlign: 'center' }}>
          {country.name.common}
        </h2>

        {/* Flag */}
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          style={{ width: '100%', borderRadius: '4px', marginBottom: '12px' }}
        />

        {/* Info */}
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', textAlign: 'center', ...secondaryTextStyle }}>
          {`Capital: ${country.capital?.[0] || 'N/A'} | Population: ${country.population.toLocaleString()}`}
        </p>

        {/* Details Button */}
        <button
          onClick={onNavigate}
          style={{
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: isDarkMode ? '#0ea5e9' : '#0284c7',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Show Details
        </button>
      </div>
    </motion.div>
  );
}