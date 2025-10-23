// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CountryCard } from "./custom-components/CountryCard";
import { Loader2 } from 'lucide-react';
import { Navbar } from './custom-components/Navbar';

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
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching country data:", error);
        setError("Failed to load country data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-8">{error}</div>;
  }

  return (
    <>
      <Navbar 
        showSearch={true}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="container mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;