// src/custom-components/globe/InfoCard3D.jsx

import { Text, Image, RoundedBox, Billboard } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useState, useMemo } from 'react';

export function InfoCard3D({ country, onNavigate, onClose }) {
  const [visible, setVisible] = useState(true);

  const safeCountry = useMemo(
    () => ({
      name: country?.name || { common: 'Unknown' },
      flags: country?.flags || { svg: '' },
      capital: country?.capital || ['N/A'],
      population: country?.population || 0,
    }),
    [country]
  );

  const { position, scale, opacity } = useSpring({
    from: { position: [3.0, 0, 0], scale: 0, opacity: 0 },
    to: {
      position: [1.7, 0, 0],
      scale: visible ? 1 : 0,
      opacity: visible ? 1 : 0,
    },
    config: { mass: 1, tension: 280, friction: 25 },
  });

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const stopPropagation = (e) => e.stopPropagation();

  const cardWidth = 1;
  const cardHeight = 1.3;

  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <a.group
        position={position}
        scale={scale}
        onPointerDown={stopPropagation}
      >
        <a.mesh
          position={[0, 0, 0]}
          scale={scale}
        >
          {/* Background Card */}
          <RoundedBox args={[cardWidth, cardHeight, 0.05]} radius={0.05}>
            <a.meshBasicMaterial
              color="#18181b"
              transparent
              opacity={opacity}
              depthWrite={true}
            />
          </RoundedBox>

          {/* Title */}
          <Text
            position={[0, cardHeight * 0.38, 0.06]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="top"
            maxWidth={cardWidth * 0.9}
          >
            {safeCountry.name.common}
          </Text>

          {/* Flag */}
          {safeCountry.flags.svg && (
            <Image
              url={safeCountry.flags.svg}
              scale={[cardWidth * 0.8, 0.5]}
              position={[0, 0.05, 0.05]}
              transparent
              depthTest={false}
              toneMapped={false}
            />
          )}

          {/* Info */}
          <Text
            position={[0, -0.28, 0.06]}
            fontSize={0.05}
            color="#a1a1aa"
            anchorX="center"
          >
            {`Capital: ${safeCountry.capital[0]} | Population: ${safeCountry.population.toLocaleString()}`}
          </Text>

          {/* Show Details Button */}
          <group
            position-y={-cardHeight * 0.38}
            onPointerUp={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
          >
            <RoundedBox
              args={[cardWidth * 0.7, 0.15, 0.001]}
              radius={0.03}
              smoothness={4}
              position-z={0.051}
            >
              <meshBasicMaterial color="#0ea5e9" />
            </RoundedBox>

            <Text
              position-z={0.052}
              fontSize={0.06}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={cardWidth * 0.6}
            >
              Show Details
            </Text>
          </group>

          {/* Close Button */}
          <group
            position={[cardWidth * 0.44, cardHeight * 0.44, 0.051]}
            onPointerUp={handleClose}
          >
            <RoundedBox
              args={[0.12, 0.12, 0.001]}
              radius={0.03}
              smoothness={4}
              position-z={0.001}
            >
              <meshBasicMaterial color="#b91c1c" />
            </RoundedBox>

            <Text
              position-z={0.012}
              fontSize={0.06}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              ×
            </Text>
          </group>
        </a.mesh>
      </a.group>
    </Billboard>
  );
}