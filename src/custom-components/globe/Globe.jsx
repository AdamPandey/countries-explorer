// src/custom-components/globe/Globe.jsx

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as topojson from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import { Country } from './Country';
import { useTheme } from '@/components/theme-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

// Scene component is correct, no changes needed
function Scene({ geoData, onHoverChange, onCountryClick, target, controlsRef, theme, isAnyCountryHovered }) {
  const initialTarget = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(({ camera }) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      if (target) {
        controls.target.lerp(target.center, 0.1);
        const idealPosition = target.center.clone().normalize().multiplyScalar(1.8);
        camera.position.lerp(idealPosition, 0.1);
      } else {
        controls.target.lerp(initialTarget.current, 0.1);
      }
      controls.update();
    }
  });
  const sphereColor = theme === 'dark' ? '#111827' : '#ffffff';
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={sphereColor} />
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

  useEffect(() => {
    const geometries = topojson.feature(worldAtlas, worldAtlas.objects.countries);
    setGeoData(geometries.features);
  }, []);

  const handleCountryClick = useCallback((countryName, center) => {
    console.log(`[GLOBE] 2. Globe received click for name: ${countryName}`);
    
    // =================================================================
    // THE FINAL FIX: Find the country by matching its NAME.
    // This is robust and handles cases like "United States of America" vs "United States".
    // =================================================================
    const countryData = countries.find(c => 
      c.name.official === countryName || c.name.common === countryName
    );
    
    console.log(`[GLOBE]    - Found matching data:`, countryData ? countryData.name.common : 'NOT FOUND');
    
    if (countryData) {
      console.log("[GLOBE]    - Setting selectedCountry and camera target.");
      setSelectedCountry(countryData);
      if (center) {
          setTarget({ center });
      }
    } else {
      console.warn(`[GLOBE]    - Could not find a match for name: ${countryName}`);
    }
  }, [countries]);

  const handleCloseDialog = () => {
    setSelectedCountry(null);
    setTarget(null);
  };

  return (
    <>
      <div className="h-[60vh] w-full cursor-grab active-cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} gl={{ logarithmicDepthBuffer: true }}>
          <Suspense fallback={null}>
            <Scene 
              geoData={geoData}
              onHoverChange={setIsAnyCountryHovered}
              onCountryClick={handleCountryClick}
              target={target}
              controlsRef={controlsRef}
              theme={theme}
              isAnyCountryHovered={isAnyCountryHovered}
            />
          </Suspense>
        </Canvas>
      </div>

      <Dialog open={!!selectedCountry} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCountry?.name?.common || "Country Details"}</DialogTitle>
            <DialogDescription>
              Population: {selectedCountry?.population?.toLocaleString() || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button asChild onClick={handleCloseDialog}>
              <Link to={`/country/${selectedCountry?.cca3}`}>View More Details</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}