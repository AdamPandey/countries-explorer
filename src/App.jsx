// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './custom-components/Navbar';
import { CountryCardSkeleton } from './custom-components/CountryCardSkeleton';
import { HeroTicker } from './custom-components/HeroTicker';
import { CountryGrid } from './custom-components/CountryGrid';
import { Globe } from './custom-components/globe/Globe';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const fields = 'name,capital,population,flags,region,cca3';
    
    axios.get('https://restcountries.com/v3.1/all', { params: { fields } })
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error("Error fetching country data:", error);
        setError("Failed to load country data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar 
        showSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {!loading && (isDesktop ? <Globe countries={countries} /> : <HeroTicker countries={countries} />)}

      <main className="container mx-auto p-8">
        <div className="my-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              {isDesktop ? "Or Browse Below" : "Explore Countries"}
            </h2>
            <p className="text-muted-foreground">
              {isDesktop ? "Click on a country on the globe or find it in the list" : "Or search for a specific one above"}
            </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <CountryCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <CountryGrid countries={filteredCountries} />
        )}
      </main>
    </>
  );
}

export default App;