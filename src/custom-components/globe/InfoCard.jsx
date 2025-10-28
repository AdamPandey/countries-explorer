// src/custom-components/globe/InfoCard.jsx

import { Html, Billboard } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useState } from 'react';

// This is a special animated version of the Html component
const AnimatedHtml = a(Html);

export function InfoCard({ country, onNavigate, onClose }) {
  const [visible, setVisible] = useState(true);

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
    setTimeout(() => onClose?.(), 300); // Wait for animation
  };

  const { scale, opacity } = useSpring({
    to: {
      scale: visible ? 1 : 0,
      opacity: visible ? 1 : 0,
    },
    from: { scale: 0, opacity: 0 },
    config: { mass: 1, tension: 280, friction: 25 },
  });

  const stopPropagation = (e) => e.stopPropagation();

  return (
    // =================================================================
    // THE FIX: Changed the X position from 1.7 to 1.5 to move it closer.
    // =================================================================
    <Billboard position={[1.2, 0.5, 0]}>
      <AnimatedHtml
        center
        style={{
          opacity: opacity,
          transform: scale.to(s => `scale(${s})`),
          pointerEvents: 'auto',
        }}
        onPointerDown={stopPropagation}
      >
        <div
          style={{
            width: '280px',
            padding: '16px',
            backgroundColor: 'rgba(24, 24, 27, 0.9)',
            borderRadius: '12px',
            color: 'white',
            fontFamily: 'sans-serif',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '50%',
              backgroundColor: '#b91c1c',
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
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', textAlign: 'center', color: '#a1a1aa' }}>
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
              backgroundColor: '#0ea5e9',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Show Details
          </button>
        </div>
      </AnimatedHtml>
    </Billboard>
  );
}