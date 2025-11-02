import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as topojson from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import { Country } from './Country';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { InfoCard } from './InfoCard';
import { AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

function Scene({ geoData, onHoverChange, onCountryClick, target, controlsRef, theme, isAnyCountryHovered, selectedCountry }) {
  const groupRef = useRef();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -1.57;
    }
  }, []);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    let worldTargetPosition;
    let worldIdealPosition;

    if (target) {
      
      const localCenter = target.center;
      
      
      worldTargetPosition = groupRef.current.localToWorld(localCenter.clone());

      
      worldIdealPosition = worldTargetPosition.clone().normalize().multiplyScalar(1.8);
    } else {
      
      worldTargetPosition = new THREE.Vector3(0, 0, 0);
      worldIdealPosition = new THREE.Vector3(0, 0, 2.5);
    }
    
    
    const distanceToTarget = state.camera.position.distanceTo(worldIdealPosition);
    if (distanceToTarget < 0.01) {
      state.camera.position.copy(worldIdealPosition);
      controls.target.copy(worldTargetPosition);
    } else {
      controls.target.lerp(worldTargetPosition, 0.1);
      state.camera.position.lerp(worldIdealPosition, 0.1);
    }

    controls.update();
    
    
    if (groupRef.current && !isUserInteracting && !target) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const onInteractionStart = () => {
    clearTimeout(timeoutRef.current);
    setIsUserInteracting(true);
  };

  const onInteractionEnd = () => {
    timeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={theme === 'dark' ? '#111827' : '#ffffff'} />
      </mesh>
      {geoData.map((geo) => {
        const isActive = selectedCountry?.name.common === geo.properties.name || selectedCountry?.name.official === geo.properties.name;
        return (
          <Country
            key={geo.id || geo.properties.name}
            geo={geo}
            onHoverChange={onHoverChange}
            onCountryClick={onCountryClick}
            theme={theme}
            isActive={isActive}
          />
        );
      })}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        rotateSpeed={0.4}
        enableRotate={!isAnyCountryHovered && !target}
        onStart={onInteractionStart}
        onEnd={onInteractionEnd}
      />
    </group>
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
    if (selectedCountry?.cca3 === countryData?.cca3) {
      setSelectedCountry(null);
      setTarget(null);
    } else if (countryData) {
      setSelectedCountry(countryData);
      setTarget({ center });
    }
  }, [countries, selectedCountry]);

  const handleCloseInfoCard = () => {
    setSelectedCountry(null);
    setTarget(null);
  };

  const handleNavigateToDetails = () => {
    if (selectedCountry) {
      navigate(`/country/${selectedCountry?.cca3}`);
      handleCloseInfoCard();
    }
  };

  return (
    <div className="relative h-[85vh] w-full cursor-grab active:cursor-grabbing">
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
          />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {selectedCountry && (
          <InfoCard
            key={selectedCountry.cca3}
            country={selectedCountry}
            onClose={handleCloseInfoCard}
            onNavigate={handleNavigateToDetails}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}