// src/custom-components/globe/Globe.jsx

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as topojson from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import { Country } from './Country';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { InfoCard3D } from './InfoCard3D';
import * as THREE from 'three';

function Scene({ geoData, onHoverChange, onCountryClick, target, controlsRef, theme, isAnyCountryHovered, selectedCountry, onClose, onNavigate }) {
  const initialTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const targetPosition = target ? target.center : initialTarget.current;
      const idealPosition = target ? target.center.clone().normalize().multiplyScalar(1.8) : new THREE.Vector3(0, 0, 2.5);

      const distanceToTarget = camera.position.distanceTo(idealPosition);

      if (distanceToTarget < 0.01) {
        camera.position.copy(idealPosition);
        controls.target.copy(targetPosition);
      } else {
        controls.target.lerp(targetPosition, 0.1);
        camera.position.lerp(idealPosition, 0.1);
      }
      
      controls.update();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={theme === 'dark' ? '#111827' : '#ffffff'} />
      </mesh>
      {geoData.map((geo) => (
        <Country
          key={geo.id || geo.properties.name}
          geo={geo}
          onHoverChange={onHoverChange}
          onCountryClick={onCountryClick}
          theme={theme}
        />
      ))}

      {/* InfoCard3D is now INSIDE Scene */}
      {selectedCountry && (
        <InfoCard3D
          country={selectedCountry}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        rotateSpeed={0.4}
        enableRotate={!isAnyCountryHovered && !target}
      />
    </>
  );
}

export function Globe({ countries }) {
  const [geoData, setGeoData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [target, setTarget] = useState(null);
  const controlsRef = useRef();
  const { theme } = useTheme();
  const [isAnyCountryHovered, setIsAnyCountryHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const geometries = topojson.feature(worldAtlas, worldAtlas.objects.countries);
    setGeoData(geometries.features);
  }, []);

  const handleCountryClick = useCallback((countryName, center) => {
    const countryData = countries.find(c => 
      c.name.official === countryName || c.name.common === countryName
    );
    if (countryData) {
      setSelectedCountry(countryData);
      setTarget({ center });
    }
  }, [countries]);

  const handleCloseInfoCard = () => {
    setSelectedCountry(null);
    setTarget(null);
  };

  const handleNavigateToDetails = () => {
    if (selectedCountry) {
      navigate(`/country/${selectedCountry.cca3}`);
      handleCloseInfoCard();
    }
  };

  return (
    <div className="h-[60vh] w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene 
            geoData={geoData}
            onHoverChange={setIsAnyCountryHovered}
            onCountryClick={handleCountryClick}
            target={target}
            controlsRef={controlsRef}
            theme={theme}
            isAnyCountryHovered={isAnyCountryHovered}
            selectedCountry={selectedCountry}
            onClose={handleCloseInfoCard}
            onNavigate={handleNavigateToDetails}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}