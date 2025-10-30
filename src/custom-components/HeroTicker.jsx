// src/custom-components/HeroTicker.jsx

import { useEffect, useState } from "react";
import axios from "axios"; // <-- IMPORT AXIOS
import { TickerColumn } from "./TickerColumn";

// We now get the key from Vite's environment variables
const PEXELS_API_KEY = Tcy9zXQsZOm9PmHdoGzuQwE1N7iqhjL6QL1Z0czthoP6Qjg3ERhLBFX2;

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

export function HeroTicker({ countries }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (countries.length === 0 || !PEXELS_API_KEY) return;

    const fetchPhotos = async () => {
      try {
        const randomCountries = shuffleArray([...countries]).slice(0, 25);
        const photoPromises = randomCountries.map(country => {
          // --- THE FIX: Use Axios to make the API call ---
          const query = `Travel ${country.name.common}`;
          return axios.get(`https://api.pexels.com/v1/search`, {
            params: { query, per_page: 1 },
            headers: {
              Authorization: PEXELS_API_KEY // Pexels API requires an Authorization header
            }
          });
          // ---------------------------------------------
        });
        
        const photoResults = await Promise.all(photoPromises);
        const fetchedPhotos = photoResults
          // Axios puts the data in a `data` property
          .map((result, index) => result.data.photos.length > 0 ? { ...result.data.photos[0], countryName: randomCountries[index].name.common } : null)
          .filter(Boolean);

        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error("Error fetching photos from Pexels:", error);
      }
    };

    fetchPhotos();
  }, [countries]);

  if (photos.length < 25) return null;

  const column1Photos = photos.slice(0, 5);
  const column2Photos = photos.slice(5, 10);
  const column3Photos = photos.slice(10, 15);
  const column4Photos = photos.slice(15, 20);
  const column5Photos = photos.slice(20, 25);

  return (
    <div className="h-[90vh] w-full overflow-hidden mask-gradient">
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