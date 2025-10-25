// src/custom-components/globe/Country.jsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useTheme } from '@/components/theme-provider';
import earcut from 'earcut';

// Helper function to convert Lat/Lon to a 3D point on a sphere
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Helper function to create the solid geometry for a country
function createCountryGeometry(geo, radius) {
  const geometries = [];

  const createMeshForPolygon = (polygon) => {
    // 1. Project the 2D GeoJSON coordinates to 3D points on the sphere
    const shape = polygon[0].map(([lon, lat]) => latLonToVector3(lat, lon, radius));

    // 2. Create the main filled shape
    const geometry = new THREE.ShapeGeometry(new THREE.Shape(shape));
    
    // 3. For countries with holes (like South Africa), handle them here if needed
    // This example focuses on the main shape for simplicity.

    geometries.push(geometry);
  };

  if (geo.geometry.type === 'Polygon') {
    createMeshForPolygon(geo.geometry.coordinates);
  } else if (geo.geometry.type === 'MultiPolygon') {
    geo.geometry.coordinates.forEach(createMeshForPolygon);
  }

  // This simple example returns the first geometry. A full implementation
  // would merge all geometries for a MultiPolygon country.
  return geometries[0];
}


// --- A more robust geometry creation function using Earcut ---
function createTriangulatedGeometry(geo, radius) {
    const polygons = geo.geometry.type === 'Polygon'
      ? [geo.geometry.coordinates]
      : geo.geometry.coordinates;

    const vertices = [];
    const faces = [];
    let vertexOffset = 0;

    polygons.forEach(polygon => {
        const polyVerts = [];
        const holeIndices = [];

        polygon.forEach((ring, index) => {
            const projectedRing = ring.map(([lon, lat]) => {
                const vec = latLonToVector3(lat, lon, radius);
                return [vec.x, vec.y, vec.z];
            });

            // Flatten for earcut
            const flatRing = projectedRing.flat();
            polyVerts.push(...flatRing);
            
            if (index > 0) {
                holeIndices.push(projectedRing.length);
            }
        });
        
        // Triangulate using earcut
        const triangles = earcut(polyVerts, holeIndices, 3);
        
        // Add vertices to the main list
        for (let i = 0; i < polyVerts.length; i += 3) {
            vertices.push(polyVerts[i], polyVerts[i+1], polyVerts[i+2]);
        }
        
        // Add faces, adjusting indices based on the current offset
        for (let i = 0; i < triangles.length; i++) {
            faces.push(triangles[i] + vertexOffset / 3);
        }

        vertexOffset += polyVerts.length;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(faces);
    geometry.computeVertexNormals(); // For lighting
    return geometry;
}


export function Country({ geo, isDragging, onHoverChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const countryCode = geo.properties.iso_a3;

  const geometry = useMemo(() => {
    if (!geo?.geometry) return null;
    // The radius is slightly larger than the globe to prevent z-fighting
    return createTriangulatedGeometry(geo, 1.01); 
  }, [geo]);

  if (!geometry) return null;

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    onHoverChange(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
    document.body.style.cursor = 'grab';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDragging.current) return;
    if (countryCode && countryCode !== 'ATA') {
      navigate(`/country/${countryCode}`);
    }
  };

  // Define colors for both the fill and the outline
  const fillColor = theme === 'dark' ? '#374151' : '#e5e7eb'; // A subtle fill
  const strokeColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const hoverColor = theme === 'dark' ? '#0ea5e9' : '#0284c7';

  return (
    <group>
      {/* 1. The Solid Fill Mesh (for visuals and hovering) */}
      <mesh
        geometry={geometry}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <meshBasicMaterial
          color={isHovered ? hoverColor : fillColor}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 2. The Outline (optional, but looks good) */}
      <lineSegments geometry={geometry}>
         <lineBasicMaterial color={strokeColor} />
      </lineSegments>
    </group>
  );
}