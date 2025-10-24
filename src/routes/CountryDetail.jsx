// src/routes/CountryDetail.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "../custom-components/Navbar";

// --- PASTE YOUR API KEYS HERE ---
const TMDB_API_KEY = "f54fa4d4f3194b07532fed063bbb1ed5";
const GNEWS_API_KEY = "2292fff9f892cde36a495c00d220783a";
const EXCHANGERATE_API_KEY = "c968e6a4f756ec94d027e83e";
// ---------------------------------

export function CountryDetail() {
  // ... (keep all your existing useState and useEffect hooks exactly as they are) ...
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [movies, setMovies] = useState([]);
  const [news, setNews] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (Your entire useEffect fetching logic remains unchanged) ...
    setLoading(true);
    setCountry(null);
    setMovies([]);
    setNews([]);
    setExchangeRate(null);

    const fetchCountryData = axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);

    fetchCountryData.then(response => {
        const countryData = response.data[0];
        setCountry(countryData);

        const countryName = countryData.name.common;
        const cca2 = countryData.cca2;
        const currencyCode = Object.keys(countryData.currencies)[0];

        const fetchMoviesData = axios.get(`https://api.themoviedb.org/3/discover/movie`, {
            params: { api_key: TMDB_API_KEY, with_origin_country: cca2, sort_by: 'popularity.desc' }
        });
        const fetchNewsData = axios.get(`https://gnews.io/api/v4/search?q=${countryName}&lang=en&max=4&apikey=${GNEWS_API_KEY}`);
        const fetchExchangeRateData = axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${currencyCode}`);

        return Promise.allSettled([fetchMoviesData, fetchNewsData, fetchExchangeRateData]);
      })
      .then(results => {
        if (results[0].status === 'fulfilled') setMovies(results[0].value.data.results.slice(0, 8));
        if (results[1].status === 'fulfilled') setNews(results[1].value.data.articles);
        if (results[2].status === 'fulfilled') setExchangeRate(results[2].value.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Could not load data for this country.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [countryCode]);


  // ... (keep your loading and error return statements as they are) ...
  if (loading && !country) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8 flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">{error}</div>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <motion.main 
        className="container mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* ... (The entire content of your existing <main> tag goes here) ... */}
        {country && (
          <>
            <Button asChild variant="outline" className="mb-8">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all countries
              </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="w-full border rounded-lg shadow-lg" />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6">{country.name.common}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-lg">
                  <p><span className="font-semibold">Official Name:</span> {country.name.official}</p>
                  <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  <p><span className="font-semibold">Region:</span> {country.region}</p>
                  <p><span className="font-semibold">Sub Region:</span> {country.subregion}</p>
                  <p><span className="font-semibold">Capital:</span> {country.capital?.join(', ') || 'N/A'}</p>
                  <p><span className="font-semibold">Currencies:</span> {Object.values(country.currencies).map(c => c.name).join(', ')}</p>
                  <p><span className="font-semibold">Languages:</span> {Object.values(country.languages).join(', ')}</p>
                  {exchangeRate && <p><span className="font-semibold">Exchange Rate:</span> 1 {exchangeRate.base_code} = {exchangeRate.conversion_rates.USD} USD</p>}
                </div>
                {country.borders?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Border Countries:</h3>
                    <div className="flex flex-wrap gap-2">{country.borders.map(b => <Button asChild key={b} variant="secondary"><Link to={`/country/${b}`}>{b}</Link></Button>)}</div>
                  </div>
                )}
              </div>
            </div>
            
            {news.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-bold mb-6">Latest News</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {news.map(article => (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" key={article.title} className="block border rounded-lg p-4 hover:bg-muted transition-colors">
                      <img src={article.image} alt={article.title} className="rounded mb-4 aspect-video object-cover"/>
                      <h4 className="font-semibold mb-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">{article.source.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {movies.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-bold mb-6">Popular Movies</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {movies.map(movie => movie.poster_path && (
                    <div key={movie.id}><img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded-lg shadow-md" /><p className="text-sm mt-2 font-semibold truncate">{movie.title}</p></div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.main>
    </>
  );
}