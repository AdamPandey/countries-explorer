// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryCard } from "./custom-components/CountryCard";
import { Navbar } from './custom-components/Navbar';
import { CountryCardSkeleton } from './custom-components/CountryCardSkeleton';
import { HeroTicker } from './custom-components/HeroTicker';
import { Globe } from './custom-components/globe/Globe';
import { useMediaQuery } from './hooks/useMediaQuery';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    }
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const isSearching = searchTerm.length > 0;

  useEffect(() => {
    const fields = 'name,capital,population,flags,region,cca3,cca2';
    
    axios.get('https://restcountries.com/v3.1/all', { params: { fields } })
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => { console.error("Error fetching data:", error); setError("Failed to load data."); })
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
      
      <AnimatePresence>
        {!isSearching && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* --- THIS IS THE FINAL, CORRECT LOGIC --- */}
            {/* On desktop, show the Globe. */}
            {isDesktop && <Globe countries={countries} />}
            {/* The Ticker is now shown on BOTH desktop and mobile. */}
            <HeroTicker countries={countries} />
            {/* -------------------------------------- */}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main 
        className="container mx-auto p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!isSearching && (
          <div className="my-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                {isDesktop ? "Or Browse the Full List" : "Explore Countries"}
              </h2>
              <p className="text-muted-foreground">
                {isDesktop ? "Click on a country on the globe or find it below" : "Or search for a specific one above"}
              </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <CountryCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCountries.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </motion.main> 
    </>
  );
}

export default App;