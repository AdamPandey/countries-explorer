// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CountryCard } from "./custom-components/CountryCard";
import { Navbar } from './custom-components/Navbar';
import { CountryCardSkeleton } from './custom-components/CountryCardSkeleton';
import { HeroTicker } from './custom-components/HeroTicker'; // <-- IMPORT THE NEW COMPONENT

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
      
      {!loading && <HeroTicker countries={countries} />}

      <motion.main 
        className="container mx-auto p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="my-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Explore Countries</h2>
            <p className="text-muted-foreground">Or search for a specific one above</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm-grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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