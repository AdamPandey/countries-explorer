// src/custom-components/globe/Globe.jsx

import { Suspense, useEffect, useState, useRef } from 'react';
// --- THIS IS THE FIX ---
import { Canvas } from '@react-three/fiber'; 
// -----------------------
import { OrbitControls } from '@react-three/drei';
import * as topojson from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import { Country } from './Country';
import { useTheme } from '@/components/theme-provider';

export function Globe() {
  const [countries, setCountries] = useState([]);
  const { theme } = useTheme();
  
  const isDragging = useRef(false);
  const mouseDownPos = useRef(null);
  const [isAnyCountryHovered, setIsAnyCountryHovered] = useState(false);

  const handlePointerDown = (e) => {
    isDragging.current = false;
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (mouseDownPos.current) {
      const dx = e.clientX - mouseDownPos.current.x;
      const dy = e.clientY - mouseDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        isDragging.current = true;
      }
    }
  };

  const handlePointerUp = () => {
    mouseDownPos.current = null;
    setTimeout(() => {
      isDragging.current = false;
    }, 0);
  };

  useEffect(() => {
    const countryGeometries = topojson.feature(worldAtlas, worldAtlas.objects.countries);
    setCountries(countryGeometries.features);
  }, []);

  const sphereColor = theme === 'dark' ? '#111827' : '#f0f0f0';

  return (
    <div
      className="h-[60vh] w-full cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={1} />

          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color={sphereColor} />
          </mesh>

          {countries.map((geo, i) => (
              <Country
                key={geo.properties.iso_a3 || i}
                geo={geo}
                isDragging={isDragging}
                onHoverChange={setIsAnyCountryHovered}
              />
            ))}

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            rotateSpeed={0.4}
            enableRotate={!isAnyCountryHovered}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}