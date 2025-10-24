// src/custom-components/HeroTicker.jsx

import { useEffect, useState } from "react";
import { createClient } from "pexels";
import { TickerColumn } from "./TickerColumn";

const PEXELS_API_KEY = "Tcy9zXQsZOm9PmHdoGzuQwE1N7iqhjL6QL1Z0czthoP6Qjg3ERhLBFX2"; // <-- IMPORTANT

const pexelsClient = createClient(PEXELS_API_KEY);

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

export function HeroTicker({ countries }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (countries.length === 0) return;

    const fetchPhotos = async () => {
      try {
        // Fetch more photos for 5 columns, let's get 25
        const randomCountries = shuffleArray([...countries]).slice(0, 25);
        const photoPromises = randomCountries.map(country => 
          pexelsClient.photos.search({ query: `Travel ${country.name.common}`, per_page: 1 })
        );
        
        const photoResults = await Promise.all(photoPromises);
        const fetchedPhotos = photoResults
          .map((result, index) => result.photos.length > 0 ? { ...result.photos[0], countryName: randomCountries[index].name.common } : null)
          .filter(Boolean);

        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos from Pexels:", error);
      }
    };

    fetchPhotos();
  }, [countries]);

  // Wait until we have enough photos for all 5 columns
  if (photos.length < 25) return null;

  // Distribute photos into five columns (5 photos each)
  const column1Photos = photos.slice(0, 5);
  const column2Photos = photos.slice(5, 10);
  const column3Photos = photos.slice(10, 15);
  const column4Photos = photos.slice(15, 20);
  const column5Photos = photos.slice(20, 25);

  return (
    <div className="h-[60vh] w-full overflow-hidden mask-gradient">
      {/* Update the grid to have 5 columns */}
      <div className="grid grid-cols-5 gap-4 h-full">
        <TickerColumn photos={column1Photos} direction="up" />
        <TickerColumn photos={column2Photos} direction="down" />
        <TickerColumn photos={column3Photos} direction="up" />
        <TickerColumn photos={column4Photos} direction="down" />
        <TickerColumn photos={column5Photos} direction="up" />
      </div>
    </div>
  );
}