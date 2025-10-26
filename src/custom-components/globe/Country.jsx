// src/custom-components/globe/Country.jsx

import { useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import earcut from 'earcut';

// Helper functions (No changes needed here)
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createTriangulatedGeometry(geo, radius) {
    const polygons = geo.geometry.type === 'Polygon'
      ? [geo.geometry.coordinates]
      : geo.geometry.coordinates;
    const allVertices = [];
    const allFaces = [];
    let vertexOffset = 0;
    polygons.forEach(polygon => {
        if (!polygon[0] || polygon[0].length < 3) return;
        const polyVerts = [];
        const holeIndices = [];
        polygon.forEach((ring, index) => {
            if (index > 0) holeIndices.push(polyVerts.length / 3);
            ring.forEach(([lon, lat]) => {
                const vec = latLonToVector3(lat, lon, radius);
                polyVerts.push(vec.x, vec.y, vec.z);
            });
        });
        const triangles = earcut(polyVerts, holeIndices, 3);
        for (let i = 0; i < triangles.length; i++) allFaces.push(triangles[i] + vertexOffset);
        for (let i = 0; i < polyVerts.length; i++) allVertices.push(polyVerts[i]);
        vertexOffset += polyVerts.length / 3;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(allVertices, 3));
    geometry.setIndex(allFaces);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
}

export function Country({ geo, onHoverChange, onCountryClick, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const geometry = useMemo(() => {
    if (!geo?.geometry) return null;
    return createTriangulatedGeometry(geo, 1.01); 
  }, [geo]);

  const handlePointerEnter = useCallback((e) => {
    e.stopPropagation();
    setIsHovered(true);
    onHoverChange(true);
    document.body.style.cursor = 'pointer';
  }, [onHoverChange]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    onHoverChange(false);
    document.body.style.cursor = 'grab';
  }, [onHoverChange]);
  
  const handlePointerDown = useCallback((e) => { e.stopPropagation(); }, []);

  const handlePointerUp = useCallback((e) => {
    e.stopPropagation();
    
    // =================================================================
    // THE REAL FIX - PART 1: Use the country's NAME to identify it.
    // =================================================================
    const countryName = geo.properties.name;
    console.log(`[COUNTRY] 1. POINTER UP detected on ${countryName}`);

    if (countryName && countryName !== 'Antarctica') {
        const center = geometry.boundingSphere.center;
        console.log(`[COUNTRY]    - Name: ${countryName}. Calling parent onCountryClick...`);
        // Pass the NAME and the center vector to the parent.
        onCountryClick(countryName, center);
    }
  }, [geo, geometry, onCountryClick]);

  if (!geometry) return null;

  const fillColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const strokeColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const hoverColor = theme === 'dark' ? '#0ea5e9' : '#0284c7';

  return (
    <group>
      <mesh
        geometry={geometry}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <meshBasicMaterial color={isHovered ? hoverColor : fillColor} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={geometry}>
         <lineBasicMaterial color={strokeColor} />
      </lineSegments>
    </group>
  );
}